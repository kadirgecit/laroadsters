// One-shot migration runner. Executes db/schema.sql against the Neon database.
// Safe to run repeatedly: all statements use IF NOT EXISTS.
//
// Usage:  node --experimental-strip-types db/migrate.ts
//   or:   npx tsx db/migrate.ts
//
// Reads DATABASE_URL from .env.local (or process env).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load .env.local if it exists
try {
  config({ path: '.env.local' });
} catch {
  // dotenv might not be installed in prod; env vars come from Vercel
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env.local or your environment.');
  process.exit(1);
}

const db = neon(process.env.DATABASE_URL);

async function main() {
  console.log('Running schema migration...');
  // Neon serverless driver doesn't support multi-statement queries directly.
  // Split on semicolons that are followed by a newline, ignore comments.
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await db.query(stmt);
    } catch (err) {
      console.error('Failed statement:\n', stmt.slice(0, 200), '\n');
      throw err;
    }
  }
  console.log(`Done. ${statements.length} statements executed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
