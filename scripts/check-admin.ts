import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
const env = readFileSync('.env.local', 'utf-8');
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
console.log('password from env:', JSON.stringify(process.env.ADMIN_PASSWORD));
const sql = neon(process.env.DATABASE_URL!);
const r = await sql`SELECT password_hash FROM admin_users WHERE email = ${process.env.ADMIN_EMAIL}` as any[];
const hash = r[0].password_hash;
console.log('hash:', hash);
const ok = await bcrypt.compare(process.env.ADMIN_PASSWORD!, hash);
console.log('bcrypt.compare result:', ok);
