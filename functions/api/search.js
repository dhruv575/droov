/**
 * Cloudflare Pages Functions adapter for the AI search endpoint.
 * Deployed automatically as POST /api/search.
 *
 * Set the secret with:  wrangler pages secret put OPENROUTER_API_KEY
 */
import { runSearch } from '../../api/_lib/search-core.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const { status, body: payload } = await runSearch(body, env, {
    ip: request.headers.get('cf-connecting-ip') || 'unknown'
  });

  return json(payload, status);
}

export function onRequest() {
  return json({ error: 'Use POST.' }, 405);
}

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
