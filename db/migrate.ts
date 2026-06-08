// One-shot migration runner. Executes db/schema.sql against the Neon database.
// Safe to run repeatedly: all statements use IF NOT EXISTS.
//
// Usage:  npx tsx db/migrate.ts
//
// Reads DATABASE_URL from .env.local (or process env).

import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

try { config({ path: '.env.local' }); } catch {}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env.local or your environment.');
  process.exit(1);
}

const sql_text = readFileSync('db/schema.sql', 'utf-8');
const db = neon(process.env.DATABASE_URL);

// Split SQL into statements respecting dollar-quoted strings, single-quoted
// strings, and line comments. Each CREATE TABLE / CREATE INDEX block is
// terminated by a `;` at the end of a line.
function splitStatements(input: string): string[] {
  const out: string[] = [];
  let buf = '';
  let inSingle = false;
  let inDollar = false;
  let dollarTag = '';
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const next = input[i + 1];
    // line comment
    if (!inSingle && !inDollar && c === '-' && next === '-') {
      while (i < input.length && input[i] !== '\n') i++;
      buf += '\n';
      continue;
    }
    // dollar quote start
    if (!inSingle) {
      const m = input.slice(i).match(/^(\$[a-zA-Z0-9_]*\$)/);
      if (m) {
        if (!inDollar) {
          inDollar = true;
          dollarTag = m[1];
          buf += m[1];
          i += m[1].length - 1;
          continue;
        } else if (dollarTag === m[1]) {
          inDollar = false;
          dollarTag = '';
          buf += m[1];
          i += m[1].length - 1;
          continue;
        }
      }
    }
    // single quote
    if (!inDollar && c === "'") {
      inSingle = !inSingle;
      buf += c;
      continue;
    }
    // statement terminator
    if (!inSingle && !inDollar && c === ';') {
      out.push(buf.trim());
      buf = '';
      continue;
    }
    buf += c;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter((s) => s.length > 0);
}

async function main() {
  console.log('Running schema migration...');
  const statements = splitStatements(sql_text);
  console.log(`Found ${statements.length} statements.`);
  for (const stmt of statements) {
    const preview = stmt.replace(/\s+/g, ' ').slice(0, 80);
    try {
      await db.query(stmt);
      console.log(`  ✓ ${preview}`);
    } catch (err: any) {
      console.error(`  ✗ ${preview}`);
      console.error('  ', err.message);
      throw err;
    }
  }
  console.log('Migration complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
