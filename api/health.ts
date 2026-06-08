import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import busboy from 'busboy';

export default async function handler(_req: any, res: any) {
  try {
    const r: any = { steps: [] };
    r.steps.push('1: all imports OK');
    r.steps.push(`2: busboy type: ${typeof busboy}, has default: ${typeof (busboy as any).default}`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r));
  } catch (e: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, err: e?.message, stack: e?.stack?.slice(0, 1500) }));
  }
}
