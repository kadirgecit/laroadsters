// Minimal health check — returns 200 with the timestamp.
// Used to debug function deploys. Safe to remove once /api/auth/login works.

export default function handler(_req: any, res: any) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, ts: Date.now() }));
}
