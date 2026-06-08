// Local test harness for the catch-all API. Run with: npx tsx scripts/test-api.ts
// Simulates Vercel-style req/res and invokes the handler directly.

import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

// Load .env.local manually (no dotenv dep needed)
try {
  const env = readFileSync('.env.local', 'utf-8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch {}

const sql = neon(process.env.DATABASE_URL || '');

async function main() {
  console.log('1: Importing handler...');
  const mod = await import('../api/[[...path]].ts');
  const handler = mod.default || mod;
  console.log('   handler type:', typeof handler);

  console.log('2: Building mock req/res...');
  const reqBody = JSON.stringify({ email: 'admin@laroadsters.com', password: '146855Aa.!' });
  const req: any = {
    method: 'POST',
    url: '/api/auth/login',
    headers: { 'content-type': 'application/json', cookie: '' },
    on(event: string, cb: any) {
      if (event === 'data') cb(Buffer.from(reqBody));
      if (event === 'end') cb();
    },
  };
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    setHeader(k: string, v: string) { this.headers[k] = v; },
    end(data?: any) {
      console.log('   response status:', this.statusCode);
      console.log('   response body:', data);
      if (data && data.length > 0) {
        try { console.log('   parsed:', JSON.parse(data)); } catch {}
      }
    },
  };

  console.log('3: Invoking handler...');
  try {
    await handler(req, res);
  } catch (e: any) {
    console.error('   HANDLER THREW:', e.message);
    console.error('   STACK:', e.stack);
    process.exit(1);
  }

  console.log('4: Done.');
  process.exit(0);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
