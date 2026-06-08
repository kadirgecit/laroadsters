// Single Vercel serverless function that handles all /api/* routes.
// Keeps the project under Vercel's 12-function hobby limit.
//
// Routing is by URL path + method. Add new endpoints by adding cases
// to the routes table.
//
// Auth: admin endpoints require a valid session cookie set by /auth/login.

import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { put, del } from '@vercel/blob';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import busboy from 'busboy';
import type { IncomingMessage, ServerResponse } from 'node:http';

// ---------- env / config ----------
const DATABASE_URL = process.env.DATABASE_URL || '';
const BLOB_TOKEN=process.env.BLOB_READ_WRITE_TOKEN || '';
const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET || 'dev-only-change-me-' + (process.env.VERCEL_ENV || 'local');
const COOKIE_NAME = 'lar_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

// Lazy Neon client. Avoids crashing at module load if DATABASE_URL is missing.
let _sql: NeonQueryFunction<false, false> | null = null;
function db(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!DATABASE_URL) throw new Error('DATABASE_URL not configured');
    _sql = neon(DATABASE_URL);
  }
  return _sql;
}

// ---------- types ----------
type Handler = (req: AuthedRequest, res: ServerResponse) => Promise<void> | void;
interface AuthedRequest extends IncomingMessage {
  admin?: { email: string };
  body?: any;
  params?: Record<string, string>;
}

// ---------- helpers ----------
function json(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

async function readJson(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer | string) => (data += chunk.toString()));
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function parseCookies(req: IncomingMessage): Record<string, string> {
  const header = req.headers.cookie || '';
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k) out[k] = decodeURIComponent(v.join('='));
  }
  return out;
}

function setSessionCookie(res: ServerResponse, token: string) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`,
  );
}

function clearSessionCookie(res: ServerResponse) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
  );
}

function getAdminFromRequest(req: IncomingMessage): { email: string } | null {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded?.email) return { email: decoded.email };
  } catch {
    // invalid/expired
  }
  return null;
}

function requireAdmin(req: AuthedRequest, res: ServerResponse): boolean {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    json(res, 401, { error: 'Not authenticated' });
    return false;
  }
  req.admin = admin;
  return true;
}

function compileRoute(pattern: string) {
  const re = new RegExp('^' + pattern.replace(/:[a-zA-Z_]+/g, '([^/]+)') + '$');
  return (url: string) => {
    const m = url.match(re);
    if (!m) return null;
    const params: Record<string, string> = {};
    const names = (pattern.match(/:[a-zA-Z_]+/g) || []).map((s) => s.slice(1));
    names.forEach((n, i) => (params[n] = m[i + 1]));
    return params;
  };
}

// ---------- route table ----------
type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
const routes: Record<string, Partial<Record<Methods, Handler>>> = {
  '/auth/login': { POST: handleLogin },
  '/auth/logout': { POST: handleLogout },
  '/me': { GET: handleMe },

  '/public/news-cards': { GET: handlePublicNewsCards },
  '/public/news-posts': { GET: handlePublicNewsPosts },
  '/public/events': { GET: handlePublicEvents },
  '/public/documents': { GET: handlePublicDocuments },
  '/public/sponsors': { GET: handlePublicSponsors },
  '/public/gallery-albums': { GET: handlePublicGalleryAlbums },
  '/public/gallery-photos': { GET: handlePublicGalleryPhotos },
  '/public/settings': { GET: handlePublicSettings },

  '/admin/news-cards': { GET: handleAdminNewsCards, PUT: handleAdminNewsCardsUpdate },
  '/admin/news-posts': { GET: handleAdminNewsPosts, POST: handleAdminNewsPostCreate },
  '/admin/news-posts/:id': { PUT: handleAdminNewsPostUpdate, DELETE: handleAdminNewsPostDelete },
  '/admin/events': { GET: handleAdminEvents, POST: handleAdminEventCreate },
  '/admin/events/:id': { PUT: handleAdminEventUpdate, DELETE: handleAdminEventDelete },
  '/admin/documents': { GET: handleAdminDocuments, POST: handleAdminDocumentCreate },
  '/admin/documents/:id': { PUT: handleAdminDocumentUpdate, DELETE: handleAdminDocumentDelete },
  '/admin/sponsors': { GET: handleAdminSponsors, POST: handleAdminSponsorCreate },
  '/admin/sponsors/:id': { PUT: handleAdminSponsorUpdate, DELETE: handleAdminSponsorDelete },
  '/admin/gallery-albums': { GET: handleAdminGalleryAlbums, POST: handleAdminGalleryAlbumCreate },
  '/admin/gallery-albums/:id': { PUT: handleAdminGalleryAlbumUpdate, DELETE: handleAdminGalleryAlbumDelete },
  '/admin/gallery-photos': { POST: handleAdminGalleryPhotoCreate },
  '/admin/gallery-photos/:id': { PUT: handleAdminGalleryPhotoUpdate, DELETE: handleAdminGalleryPhotoDelete },
  '/admin/upload': { POST: handleAdminUpload },
  '/admin/settings': { PUT: handleAdminSettingsUpdate },
};

// ---------- entrypoint ----------
// Use module.exports for Vercel function compatibility (works with both
// 'type':'module' and CJS package.json settings).
const handler = async (req: AuthedRequest, res: ServerResponse) => {
  try {
    const method = ((req.method || 'GET') as Methods).toUpperCase() as Methods;

    // Parse JSON body for non-GET/HEAD
    if (method !== 'GET' && method !== 'HEAD') {
      const ct = (req.headers['content-type'] || '').toString();
      if (ct.includes('application/json')) {
        try {
          req.body = await readJson(req);
        } catch {
          return json(res, 400, { error: 'Invalid JSON body' });
        }
      }
    }

    // Vercel passes the original request URL. Strip the /api prefix.
    const rawUrl = (req.url || '/').split('?')[0];
    const url = rawUrl.replace(/^\/api/, '') || '/';

    for (const pattern of Object.keys(routes)) {
      const matcher = compileRoute(pattern);
      const m = matcher(url);
      if (!m) continue;
      const handler = routes[pattern][method];
      if (!handler) return json(res, 405, { error: 'Method not allowed' });
      req.params = m;
      return handler(req, res);
    }

    return json(res, 404, { error: 'Not found', path: url });
  } catch (err: any) {
    console.error('API error:', err);
    return json(res, 500, { error: err?.message || 'Internal server error' });
  }
};

module.exports = handler;
module.exports.default = handler;

// ---------- auth handlers ----------
async function handleLogin(req: AuthedRequest, res: ServerResponse) {
  const { email, password } = req.body || {};
  if (!email || !password) return json(res, 400, { error: 'Email and password required' });

  const rows = await db()`SELECT email, password_hash FROM admin_users WHERE email = ${email} LIMIT 1`;
  if (!rows.length) return json(res, 401, { error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, (rows[0] as any).password_hash);
  if (!ok) return json(res, 401, { error: 'Invalid credentials' });

  const token = jwt.sign({ email: (rows[0] as any).email }, JWT_SECRET, { expiresIn: '14d' });
  setSessionCookie(res, token);
  return json(res, 200, { ok: true, email: (rows[0] as any).email });
}

async function handleLogout(_req: AuthedRequest, res: ServerResponse) {
  clearSessionCookie(res);
  return json(res, 200, { ok: true });
}

async function handleMe(req: IncomingMessage, res: ServerResponse) {
  const admin = getAdminFromRequest(req);
  if (!admin) return json(res, 200, { authenticated: false });
  return json(res, 200, { authenticated: true, email: admin.email });
}

// ---------- public reads ----------
async function handlePublicNewsCards(_req: AuthedRequest, res: ServerResponse) {
  const rows = await db()`
    SELECT slug, title, body_text, flyer_url, image_urls, enabled, sort_order
    FROM news_cards
    WHERE enabled = TRUE
    ORDER BY sort_order ASC
  `;
  return json(res, 200, rows);
}

async function handlePublicNewsPosts(_req: AuthedRequest, res: ServerResponse) {
  const rows = await db()`
    SELECT id, title, body_text, published_at
    FROM news_posts
    ORDER BY published_at DESC
  `;
  return json(res, 200, rows);
}

async function handlePublicEvents(_req: AuthedRequest, res: ServerResponse) {
  const rows = await db()`
    SELECT id, title, date, location, description, flyer_pdf_url, sort_order
    FROM events
    ORDER BY sort_order ASC
  `;
  return json(res, 200, rows);
}

async function handlePublicDocuments(_req: AuthedRequest, res: ServerResponse) {
  const rows = await db()`
    SELECT id, name, file_url, size_label, category, sort_order
    FROM documents
    ORDER BY category ASC, sort_order ASC
  `;
  return json(res, 200, rows);
}

async function handlePublicSponsors(_req: AuthedRequest, res: ServerResponse) {
  const rows = await db()`
    SELECT id, name, logo_url, url, sort_order
    FROM sponsors
    ORDER BY sort_order ASC
  `;
  return json(res, 200, rows);
}

async function handlePublicGalleryAlbums(_req: AuthedRequest, res: ServerResponse) {
  const rows = await db()`
    SELECT a.id, a.slug, a.title, a.sort_order, a.created_at,
           (SELECT blob_url FROM gallery_photos WHERE album_id = a.id ORDER BY sort_order ASC LIMIT 1) AS cover_url
    FROM gallery_albums a
    ORDER BY a.sort_order ASC
  `;
  return json(res, 200, rows);
}

async function handlePublicGalleryPhotos(req: AuthedRequest, res: ServerResponse) {
  const qs = (req.url || '').split('?')[1] || '';
  const params = new URLSearchParams(qs);
  const album = params.get('album');
  if (album) {
    const rows = await db()`
      SELECT id, album_id, blob_url, title, caption, sort_order
      FROM gallery_photos
      WHERE album_id = ${album}
      ORDER BY sort_order ASC
    `;
    return json(res, 200, rows);
  }
  const rows = await db()`
    SELECT id, album_id, blob_url, title, caption, sort_order
    FROM gallery_photos
    ORDER BY sort_order ASC
  `;
  return json(res, 200, rows);
}

async function handlePublicSettings(_req: AuthedRequest, res: ServerResponse) {
  const rows = await db()`SELECT key, value FROM site_settings`;
  const out: Record<string, string> = {};
  for (const r of rows as any[]) out[r.key] = r.value;
  return json(res, 200, out);
}

// ---------- admin handlers ----------
async function handleAdminNewsCards(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const rows = await db()`
    SELECT id, slug, title, body_text, flyer_url, image_urls, enabled, sort_order, updated_at
    FROM news_cards
    ORDER BY sort_order ASC
  `;
  return json(res, 200, rows);
}

async function handleAdminNewsCardsUpdate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { cards } = req.body || {};
  if (!Array.isArray(cards)) return json(res, 400, { error: 'cards array required' });

  for (const c of cards) {
    if (!c.slug) continue;
    await db()`
      UPDATE news_cards
      SET title = COALESCE(${c.title ?? null}, title),
          body_text = COALESCE(${c.body_text ?? null}, body_text),
          flyer_url = ${c.flyer_url ?? null},
          image_urls = COALESCE(${c.image_urls ? JSON.stringify(c.image_urls) : null}::jsonb, image_urls),
          enabled = COALESCE(${c.enabled ?? null}, enabled),
          sort_order = COALESCE(${c.sort_order ?? null}, sort_order),
          updated_at = NOW()
      WHERE slug = ${c.slug}
    `;
  }
  return json(res, 200, { ok: true });
}

async function handleAdminNewsPosts(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const rows = await db()`
    SELECT id, title, body_text, published_at, created_at
    FROM news_posts
    ORDER BY published_at DESC
  `;
  return json(res, 200, rows);
}

async function handleAdminNewsPostCreate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { title, body_text, published_at } = req.body || {};
  if (!title || !body_text) return json(res, 400, { error: 'title and body_text required' });
  const rows = await db()`
    INSERT INTO news_posts (title, body_text, published_at)
    VALUES (${title}, ${body_text}, ${published_at || new Date().toISOString()})
    RETURNING id, title, body_text, published_at
  `;
  return json(res, 200, (rows as any[])[0]);
}

async function handleAdminNewsPostUpdate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const { title, body_text, published_at } = req.body || {};
  const rows = await db()`
    UPDATE news_posts
    SET title = COALESCE(${title ?? null}, title),
        body_text = COALESCE(${body_text ?? null}, body_text),
        published_at = COALESCE(${published_at ?? null}, published_at)
    WHERE id = ${id}
    RETURNING id, title, body_text, published_at
  `;
  return json(res, 200, (rows as any[])[0]);
}

async function handleAdminNewsPostDelete(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  await db()`DELETE FROM news_posts WHERE id = ${id}`;
  return json(res, 200, { ok: true });
}

async function handleAdminEvents(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const rows = await db()`SELECT * FROM events ORDER BY sort_order ASC`;
  return json(res, 200, rows);
}
async function handleAdminEventCreate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { title, date, location, description, flyer_pdf_url } = req.body || {};
  if (!title) return json(res, 400, { error: 'title required' });
  const rows = await db()`
    INSERT INTO events (title, date, location, description, flyer_pdf_url)
    VALUES (${title}, ${date || ''}, ${location || null}, ${description || null}, ${flyer_pdf_url || null})
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminEventUpdate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const { title, date, location, description, flyer_pdf_url, sort_order } = req.body || {};
  const rows = await db()`
    UPDATE events SET
      title = COALESCE(${title ?? null}, title),
      date = COALESCE(${date ?? null}, date),
      location = COALESCE(${location ?? null}, location),
      description = COALESCE(${description ?? null}, description),
      flyer_pdf_url = COALESCE(${flyer_pdf_url ?? null}, flyer_pdf_url),
      sort_order = COALESCE(${sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminEventDelete(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  await db()`DELETE FROM events WHERE id = ${id}`;
  return json(res, 200, { ok: true });
}

async function handleAdminDocuments(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const rows = await db()`SELECT * FROM documents ORDER BY category, sort_order`;
  return json(res, 200, rows);
}
async function handleAdminDocumentCreate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { name, file_url, size_label, category, sort_order } = req.body || {};
  if (!name || !file_url) return json(res, 400, { error: 'name and file_url required' });
  const rows = await db()`
    INSERT INTO documents (name, file_url, size_label, category, sort_order)
    VALUES (${name}, ${file_url}, ${size_label || null}, ${category || null}, ${sort_order || 0})
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminDocumentUpdate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const { name, size_label, category, sort_order } = req.body || {};
  const rows = await db()`
    UPDATE documents SET
      name = COALESCE(${name ?? null}, name),
      size_label = COALESCE(${size_label ?? null}, size_label),
      category = COALESCE(${category ?? null}, category),
      sort_order = COALESCE(${sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminDocumentDelete(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const row = await db()`SELECT file_url FROM documents WHERE id = ${id}` as any[];
  if (row[0]?.file_url) {
    try { await del(row[0].file_url, { token: BLOB_TOKEN }); } catch { /* ignore */ }
  }
  await db()`DELETE FROM documents WHERE id = ${id}`;
  return json(res, 200, { ok: true });
}

async function handleAdminSponsors(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const rows = await db()`SELECT * FROM sponsors ORDER BY sort_order`;
  return json(res, 200, rows);
}
async function handleAdminSponsorCreate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { name, logo_url, url, sort_order } = req.body || {};
  if (!name || !logo_url) return json(res, 400, { error: 'name and logo_url required' });
  const rows = await db()`
    INSERT INTO sponsors (name, logo_url, url, sort_order)
    VALUES (${name}, ${logo_url}, ${url || null}, ${sort_order || 0})
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminSponsorUpdate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const { name, url, sort_order } = req.body || {};
  const rows = await db()`
    UPDATE sponsors SET
      name = COALESCE(${name ?? null}, name),
      url = COALESCE(${url ?? null}, url),
      sort_order = COALESCE(${sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminSponsorDelete(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const row = await db()`SELECT logo_url FROM sponsors WHERE id = ${id}` as any[];
  if (row[0]?.logo_url) {
    try { await del(row[0].logo_url, { token: BLOB_TOKEN }); } catch { /* ignore */ }
  }
  await db()`DELETE FROM sponsors WHERE id = ${id}`;
  return json(res, 200, { ok: true });
}

async function handleAdminGalleryAlbums(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const rows = await db()`SELECT * FROM gallery_albums ORDER BY sort_order`;
  return json(res, 200, rows);
}
async function handleAdminGalleryAlbumCreate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { slug, title, sort_order } = req.body || {};
  if (!slug || !title) return json(res, 400, { error: 'slug and title required' });
  const rows = await db()`
    INSERT INTO gallery_albums (slug, title, sort_order)
    VALUES (${slug}, ${title}, ${sort_order || 0})
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminGalleryAlbumUpdate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const { title, sort_order, cover_photo_id } = req.body || {};
  const rows = await db()`
    UPDATE gallery_albums SET
      title = COALESCE(${title ?? null}, title),
      sort_order = COALESCE(${sort_order ?? null}, sort_order),
      cover_photo_id = COALESCE(${cover_photo_id ?? null}, cover_photo_id)
    WHERE id = ${id}
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminGalleryAlbumDelete(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const photos = await db()`SELECT blob_url FROM gallery_photos WHERE album_id = ${id}` as any[];
  for (const p of photos) {
    try { await del(p.blob_url, { token: BLOB_TOKEN }); } catch { /* ignore */ }
  }
  await db()`DELETE FROM gallery_albums WHERE id = ${id}`;
  return json(res, 200, { ok: true });
}

async function handleAdminGalleryPhotoCreate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { album_id, blob_url, title, caption, sort_order } = req.body || {};
  if (!album_id || !blob_url) return json(res, 400, { error: 'album_id and blob_url required' });
  const rows = await db()`
    INSERT INTO gallery_photos (album_id, blob_url, title, caption, sort_order)
    VALUES (${album_id}, ${blob_url}, ${title || null}, ${caption || null}, ${sort_order || 0})
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminGalleryPhotoUpdate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const { title, caption, sort_order } = req.body || {};
  const rows = await db()`
    UPDATE gallery_photos SET
      title = COALESCE(${title ?? null}, title),
      caption = COALESCE(${caption ?? null}, caption),
      sort_order = COALESCE(${sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return json(res, 200, (rows as any[])[0]);
}
async function handleAdminGalleryPhotoDelete(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.params!;
  const row = await db()`SELECT blob_url FROM gallery_photos WHERE id = ${id}` as any[];
  if (row[0]?.blob_url) {
    try { await del(row[0].blob_url, { token: BLOB_TOKEN }); } catch { /* ignore */ }
  }
  await db()`DELETE FROM gallery_photos WHERE id = ${id}`;
  return json(res, 200, { ok: true });
}

// Generic file upload. Image compression for gallery is done client-side.
async function handleAdminUpload(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  if (!BLOB_TOKEN) return json(res, 500, { error: 'BLOB_READ_WRITE_TOKEN not configured' });

  const bb = busboy({ headers: req.headers });
  return new Promise<void>((resolve) => {
    let uploaded: { url: string; pathname: string } | null = null;
    bb.on('file', async (_name: string, file: NodeJS.ReadableStream, info: any) => {
      const safeName = (info.filename || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
      const blob = await put(safeName, file as any, {
        access: 'public',
        token: BLOB_TOKEN,
      });
      uploaded = { url: blob.url, pathname: blob.pathname };
    });
    bb.on('close', () => {
      if (!uploaded) {
        json(res, 400, { error: 'No file uploaded' });
      } else {
        json(res, 200, uploaded);
      }
      resolve();
    });
    req.pipe(bb);
  });
}

async function handleAdminSettingsUpdate(req: AuthedRequest, res: ServerResponse) {
  if (!requireAdmin(req, res)) return;
  const { settings } = req.body || {};
  if (!settings || typeof settings !== 'object') return json(res, 400, { error: 'settings object required' });
  for (const [k, v] of Object.entries(settings)) {
    await db()`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${k}, ${String(v)}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
  }
  return json(res, 200, { ok: true });
}
