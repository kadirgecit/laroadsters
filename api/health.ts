// Minimal health check — returns 200 with the timestamp.
// Used to debug function deploys. Safe to remove once /api/auth/login works.

import { neon } from '@neondatabase/serverless';

export default async function handler(_req: any, res: any) {
  try {
    const url = process.env.DATABASE_URL || '';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (!url) {
      res.end(JSON.stringify({ ok: false, err: 'DATABASE_URL not set' }));
      return;
    }
    const sql = neon(url);
    const rows = await sql`SELECT 1 as one`;
    res.end(JSON.stringify({ ok: true, db: rows, urlHost: new URL(url).host }));
  } catch (e: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, err: e?.message || String(e), stack: e?.stack?.slice(0, 800) }));
  }
}
