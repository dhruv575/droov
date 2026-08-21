import { buildCandidates, getById } from './searchCorpus';

const ENDPOINT = '/api/search';

/**
 * Ask the server-side OpenRouter proxy to rank the site's pages against a
 * query and write a short answer.
 *
 * Resolves to { answer, results: [{ item, reason }], model }.
 * Throws on failure so the caller can fall back to keyword results.
 */
export async function aiSearch(query, { signal } = {}) {
  const candidates = buildCandidates(query);
  if (candidates.length === 0) {
    return { answer: '', results: [], model: null };
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, candidates })
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Search is unavailable right now.');
  }

  if (!response.ok) {
    throw new Error(payload?.error || 'Search is unavailable right now.');
  }

  const results = (payload.results || [])
    .map(({ id, reason }) => {
      const item = getById(id);
      return item ? { item, reason } : null;
    })
    .filter(Boolean);

  return { answer: payload.answer || '', results, model: payload.model || null };
}
