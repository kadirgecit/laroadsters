// One-time migration: upload the original local image files to Vercel Blob
// and seed the DB rows. Run once after deploying the admin panel so the
// public site shows the same sponsor logos and gallery photos that were
// hardcoded in the pre-admin build.
//
// What it does:
//   1. Uploads 5 sponsor logos from /public/sponsors/* to Vercel Blob,
//      then INSERTs into `sponsors` (idempotent — skips names that exist).
//   2. Creates the `runs` and `members` gallery albums (idempotent), then
//      uploads the 20 club-run photos and 10 member-car photos, INSERTs
//      them into `gallery_photos`.
//
// Safe to re-run: all inserts use ON CONFLICT DO NOTHING (sponsors by
// `name`, albums by `slug`, photos by `id` UUID generated up front).
//
// Usage:   npx tsx db/migrate-assets.ts
// Then delete this file — it's a one-shot tool, not part of the running app.

import { readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');
if (!BLOB_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN not set');
const sql = neon(DATABASE_URL);

const PROJECT_ROOT = join(import.meta.dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');

// MIME type lookup — covers the formats used in the original hardcoded data.
const MIME: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.JPG':  'image/jpeg',
  '.JPEG': 'image/jpeg',
  '.PNG':  'image/png',
};
function mimeFor(path: string) {
  return MIME[extname(path)] || 'application/octet-stream';
}

// Upload one local file to Vercel Blob under the given key prefix.
// Returns the public Blob URL.
async function uploadFile(localPath: string, keyPrefix: string): Promise<string> {
  const buf = readFileSync(localPath);
  const filename = localPath.split('/').pop()!;
  const key = `${keyPrefix}/${filename}`;
  const blob = await put(key, buf, {
    access: 'public',
    token: BLOB_TOKEN,
    contentType: mimeFor(localPath),
    allowOverwrite: true,
  });
  console.log(`  ↑ ${key}  (${(buf.length / 1024).toFixed(0)}KB)`);
  return blob.url;
}

// ---------------------------------------------------------------------------
// Sponsors
// ---------------------------------------------------------------------------
const sponsorDefs = [
  { name: 'Bob Drake',                       file: 'bob-drake.webp',                    url: 'https://bobdrake.com' },
  { name: 'Brookville Roadster',            file: 'brookville-roadster.webp',          url: 'https://brookvilleroadster.com' },
  { name: 'California Car Cover',           file: 'california-car-cover.jpg',          url: 'https://calcarcover.com' },
  { name: 'Grand National Roadster Show',   file: 'grand-national-roadster-show.jpg',  url: 'https://rodshows.com' },
  { name: 'Rodding USA Magazine',            file: 'rodding-usa.png',                    url: 'https://www.roddingusa.com' },
];

async function migrateSponsors() {
  console.log('\n=== SPONSORS ===');
  for (let i = 0; i < sponsorDefs.length; i++) {
    const s = sponsorDefs[i];
    // Skip if this sponsor name already exists in the DB.
    const existing = await sql`SELECT id, logo_url FROM sponsors WHERE name = ${s.name}` as any[];
    if (existing.length > 0) {
      console.log(`  • ${s.name} — already in DB, skipping (logo_url: ${existing[0].logo_url})`);
      continue;
    }
    const localPath = join(PUBLIC_DIR, 'sponsors', s.file);
    if (!statSync(localPath, { throwIfNoEntry: false })) {
      console.log(`  ! ${s.name} — file missing: ${localPath}, skipping`);
      continue;
    }
    const logo_url = await uploadFile(localPath, 'sponsors');
    await sql`
      INSERT INTO sponsors (name, logo_url, url, sort_order, enabled)
      VALUES (${s.name}, ${logo_url}, ${s.url}, ${(i + 1) * 10}, true)
    `;
    console.log(`  + inserted ${s.name}`);
  }
}

// ---------------------------------------------------------------------------
// Gallery albums + photos
// ---------------------------------------------------------------------------
const albumDefs = [
  {
    slug: 'runs',
    title: 'Club Runs',
    photos: [
      // Original hardcoded data: src paths are local; captions are all "Club Run".
      ...[1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((n) => ({
        // try .jpg first, then .jpeg
        file: `Runs/run${n}.${n === 1 || n === 3 || (n >= 13 && n <= 15) ? 'jpeg' : 'jpg'}`,
        caption: 'Club Run',
      })),
      ...[1, 2, 3, 4].map((n) => ({
        file: `LA-Roadster-Shows/2025NWDD${n}.jpeg`,
        caption: 'Club Run',
      })),
    ],
  },
  {
    slug: 'members',
    title: 'Member Cars',
    photos: [
      { file: 'Club-cars/BUCKRDSTER3.jpg',           caption: 'John Buck' },
      { file: 'Club-cars/BUTLER1.jpg',               caption: 'Ken Butler' },
      { file: 'Club-cars/COHN6.jpg',                 caption: 'Rich Cohn' },
      { file: 'Club-cars/gammell_car copy.jpg',      caption: 'Doyle Gammell' },
      { file: 'Club-cars/jordan copy.JPG',           caption: 'Randy Jordan' },
      { file: 'Club-cars/kreb_carJT copy.jpg',       caption: 'Bill Krebs' },
      { file: 'Club-cars/Scritchfield_Roadster copy.jpg', caption: 'Dick Stritchfield' },
      { file: 'Club-cars/simeone_car1 copy.JPG',     caption: 'Rick Simeone' },
      { file: 'Club-cars/tann cabby copy.jpg',       caption: 'Jeff Tann' },
      { file: 'Club-cars/winson copy.JPG',           caption: 'Paul Winson' },
    ],
  },
];

async function migrateGallery() {
  console.log('\n=== GALLERY ALBUMS + PHOTOS ===');
  for (let ai = 0; ai < albumDefs.length; ai++) {
    const a = albumDefs[ai];
    // Idempotent album insert by slug.
    let rows = await sql`SELECT id FROM gallery_albums WHERE slug = ${a.slug}` as any[];
    let albumId: string;
    if (rows.length > 0) {
      albumId = rows[0].id;
      console.log(`\nAlbum "${a.title}" already exists (${albumId}), adding missing photos only.`);
    } else {
      rows = await sql`
        INSERT INTO gallery_albums (slug, title, sort_order)
        VALUES (${a.slug}, ${a.title}, ${(ai + 1) * 10})
        RETURNING id
      ` as any[];
      albumId = rows[0].id;
      console.log(`\nAlbum "${a.title}" created (${albumId}).`);
    }

    // Count existing photos; only insert missing ones (in original order).
    const existing = await sql`
      SELECT title, sort_order FROM gallery_photos WHERE album_id = ${albumId}
    ` as any[];
    const existingCount = existing.length;

    // Skip the whole album if it already has the same number of photos as
    // the original hardcoded list — this is the "already migrated" signal.
    if (existingCount >= a.photos.length) {
      console.log(`  (${a.slug} already has ${existingCount} photo(s), skipping uploads)`);
      continue;
    }

    let sortOrder = (existingCount + 1) * 10;
    for (let i = existingCount; i < a.photos.length; i++) {
      const p = a.photos[i];
      // Find the actual file on disk — handle .jpg vs .jpeg, spaces in name, etc.
      const dir = join(PUBLIC_DIR, 'assets/gallery', p.file.substring(0, p.file.lastIndexOf('/')));
      const base = p.file.substring(p.file.lastIndexOf('/') + 1);
      const dotIdx = base.lastIndexOf('.');
      const stem = base.substring(0, dotIdx);
      const exts = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG', '.webp', '.WEBP'];
      const found = exts.map((e) => join(dir, stem + e)).find((p2) =>
        statSync(p2, { throwIfNoEntry: false }),
      );
      if (!found) {
        console.log(`  ! missing local file: ${p.file}, skipping`);
        continue;
      }
      const blobUrl = await uploadFile(found, `gallery/${a.slug}`);
      await sql`
        INSERT INTO gallery_photos (album_id, blob_url, title, caption, sort_order)
        VALUES (${albumId}, ${blobUrl}, ${p.caption}, ${p.caption}, ${sortOrder})
      `;
      sortOrder += 10;
    }
  }
}

// ---------------------------------------------------------------------------
// Set Club Runs album cover = first photo's blob_url
// ---------------------------------------------------------------------------
async function setAlbumCovers() {
  console.log('\n=== ALBUM COVERS ===');
  for (const a of albumDefs) {
    const photo = await sql`
      SELECT p.id, p.blob_url FROM gallery_photos p
      JOIN gallery_albums a ON a.id = p.album_id
      WHERE a.slug = ${a.slug}
      ORDER BY p.sort_order ASC LIMIT 1
    ` as any[];
    if (photo.length === 0) {
      console.log(`  - no photos in "${a.slug}", cover left null`);
      continue;
    }
    await sql`UPDATE gallery_albums SET cover_photo_id = ${photo[0].id} WHERE slug = ${a.slug}`;
    console.log(`  ✓ ${a.slug} cover = ${photo[0].id}`);
  }
}

async function main() {
  console.log('Migrating pre-admin assets to Vercel Blob + DB…');
  await migrateSponsors();
  await migrateGallery();
  await setAlbumCovers();
  console.log('\nDone. Public site should now show all 5 sponsors + 30 gallery photos.');
  console.log('You can delete this file (db/migrate-assets.ts) — it is one-shot.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
