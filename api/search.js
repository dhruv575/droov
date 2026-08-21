/**
 * Vercel / Node serverless adapter for the AI search endpoint.
 * Deployed automatically as POST /api/search.
 */
import { runSearch } from './_lib/search-core.js';

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

async function readJsonBody(req) {
  // Vercel parses JSON for us; fall back to reading the stream elsewhere.
  if (req.body && typeof req.body === 'object') return req.body;

  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 96 * 1024) throw new Error('Payload too large.');
    chunks.push(chunk);
  }
  if (!chunks.length) return null;
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  const { status, body: payload } = await runSearch(body, process.env, {
    ip: clientIp(req)
  });

  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(payload);
}
