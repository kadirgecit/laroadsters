// Minimal health check — returns 200 with the timestamp.
// Used to debug function deploys. Safe to remove once /api/auth/login works.

import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

export default async function handler(_req: any, res: any) {
  try {
    const url = process.env.DATABASE_URL || '';
    const results: any = { steps: [] };

    results.steps.push('1: imported bcrypt + neon OK');

    const sql = neon(url);
    results.steps.push('2: neon() OK');

    const rows = await sql`SELECT 1 as one`;
    results.steps.push(`3: query OK (${JSON.stringify(rows)})`);

    const hash = await bcrypt.hash('hello', 4);
    results.steps.push(`4: bcrypt.hash OK (${hash.slice(0, 20)}...)`);

    const ok = await bcrypt.compare('hello', hash);
    results.steps.push(`5: bcrypt.compare OK (${ok})`);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, ...results }));
  } catch (e: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({
      ok: false,
      err: e?.message || String(e),
      stack: e?.stack?.slice(0, 1500),
    }));
  }
}
