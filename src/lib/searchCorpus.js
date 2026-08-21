import projectsData from '../Data/projects.json';
import chatsData from '../Data/chats.json';
import researchData from '../Data/research.json';
import demosData from '../Data/demos.json';
import experimentsData from '../Data/experiments.json';
import updatesData from '../Data/updates.json';

/**
 * The single searchable catalog of the site. Both the instant keyword pass and
 * the AI pass rank over this same list, so a result can never point somewhere
 * that doesn't exist.
 */

const slug = (value) => String(value || '').trim().replace(/\s+/g, '-').toLowerCase();

// Mirrors the content of ResumePage, so the resume is reachable by search.
const RESUME_TEXT = `University of Pennsylvania graduating May 2027 Bachelors of Engineering in Artificial Intelligence 3.96 GPA courses Data Structures and Algorithms Big Data Analytics Linear Algebra for ML AI Optimization. Jane Street Strategy and Product Intern New York May 2026 to August 2026 created systems enabling novel trading related workflows across the options desk and the finance team. Polymarket Growth Engineering New York November 2025 to April 2026 led automation and design across newsletters including the daily insights newsletter for 1000000 readers leading to 1000000 in daily deposits, wrote 4 research articles for Polymarket Substack with 100k views, developed Polymarket news aggregator automating partner X accounts and newsletters. Morgan Stanley Fixed Income Quant Intern New York May 2025 to August 2025 developed XGBoost models predicting month-by-month mortgage prepayment default loan level wrote script calculate cashflows loan pools production billion annual lending mortgage backed securities. University of Pennsylvania Teaching Assistant January 2025 to May 2026 ESE 2030 Linear Algebra for ML AI office hours recitations 120 students, LING 0500 Introduction to Formal Linguistics. Hack4Impact co-director since September 2023 managed 40 student developers building software for 6 nonprofit organizations, led projects Fulfill NJ Baldwin School. Daily Pennsylvanian Innovation Lab Manager December 2023 to December 2024. Comma Capital University Fellow. Projects CONDITIONAL infrastructure to decompose research and price probability of events. MTS built out all of the technology behind the livestreamed news and talk show in one month, including creating the Drops paradigm of one-off high-craft interactive briefings, which led directly to sponsorships from NVIDIA and Lovable. Uncertainty Labs MCMC sampler architecture in Rust 1800x improvement over state of the art on Neal's Funnel. Musk-Altman Trial Evidence Explorer with live transcription of court hearings, 3000000 views on X, recommended by ChatGPT as official source for evidence on the OpenAI trial. Skills Java Python Ruby on Rails JavaScript NumPy Pandas PyTorch SciKit Learn Rust. Awards 4x AIME top 20 percent Chicago Trading Competition. Interests Arsenal Football Club Boston Celtics jewelry design hiking StairMaster cooking.`;

function entry({ id, type, title, content, extra = '', href, external = false }) {
  return { id, type, title, content, extra, href, external };
}

export const CORPUS = [
  entry({
    id: 'resume',
    type: 'resume',
    title: 'Resume',
    content: RESUME_TEXT,
    href: '/resume'
  }),

  ...projectsData.map((item, i) =>
    entry({
      id: `project-${i}`,
      type: 'project',
      title: item.name,
      content: item.desc,
      extra: (item.tech || []).join(' '),
      href: item.link,
      external: true
    })
  ),

  ...experimentsData.map((item, i) =>
    entry({
      id: `experiment-${i}`,
      type: 'experiment',
      title: item.name,
      content: item.desc,
      extra: (item.tech || []).join(' '),
      href: item.link,
      external: true
    })
  ),

  ...chatsData.map((item, i) =>
    entry({
      id: `chat-${i}`,
      type: 'chat',
      title: item.title,
      content: item.description,
      href: `/chats/${slug(item.chatTitle || item.title)}`
    })
  ),

  ...researchData.map((item, i) =>
    entry({
      id: `research-${i}`,
      type: 'research',
      title: item.title,
      content: item.description,
      href: `/research/${slug(item.chatTitle || item.title)}`
    })
  ),

  ...demosData.map((item, i) =>
    entry({
      id: `demo-${i}`,
      type: 'demo',
      title: item.name,
      content: item.description,
      href: `/demos/${slug(item.name)}`
    })
  ),

  ...updatesData.map((item, i) =>
    entry({
      id: `update-${i}`,
      type: 'update',
      title: item.title,
      content: `${item.date || ''} ${item.description || ''}`.trim(),
      href: `/updates/${slug(item.title)}`
    })
  )
].filter((item) => item.title && item.content);

const BY_ID = new Map(CORPUS.map((item) => [item.id, item]));

export const getById = (id) => BY_ID.get(id);

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'did', 'do', 'does',
  'for', 'from', 'has', 'have', 'he', 'his', 'how', 'i', 'in', 'is', 'it', 'its',
  'me', 'of', 'on', 'or', 'she', 'that', 'the', 'their', 'them', 'they', 'this',
  'to', 'was', 'what', 'when', 'where', 'which', 'who', 'why', 'with', 'you',
  'your', 'dhruv', 'gupta'
]);

export const tokenize = (text) =>
  String(text)
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));

/**
 * Cheap lexical score, used both to rank the instant results and to pick the
 * shortlist we hand to the model.
 */
export function scoreItem(item, query) {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return 0;

  const title = item.title.toLowerCase();
  const haystack = `${title} ${item.content} ${item.extra}`.toLowerCase();

  let score = 0;
  if (title.includes(lowerQuery)) score += 12;
  if (haystack.includes(lowerQuery)) score += 6;

  for (const token of tokenize(lowerQuery)) {
    if (title.includes(token)) score += 3;
    else if (haystack.includes(token)) score += 1;
  }
  return score;
}

/** Ranked lexical matches, best first. */
export function keywordSearch(query, limit = 10) {
  if (!query.trim()) return [];
  return CORPUS.map((item) => ({ item, score: scoreItem(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

/**
 * Shortlist sent to the API. Falls back to the whole (small) corpus when the
 * query has no lexical overlap at all, so semantic queries still work.
 */
export function buildCandidates(query, limit = 24) {
  const scored = CORPUS.map((item) => ({ item, score: scoreItem(item, query) }))
    .sort((a, b) => b.score - a.score);

  const matched = scored.filter(({ score }) => score > 0);
  const pool = (matched.length >= 4 ? matched : scored).slice(0, limit);

  return pool.map(({ item }) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    text: item.content
  }));
}
