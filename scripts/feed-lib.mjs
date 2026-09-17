// Pure feed logic shared by the GitHub Actions builder and the unit tests.
// Zero dependencies: a tolerant RSS/Atom parser, relevance scoring and a
// deliberately small selection ("the top things", not a firehose).

// ---------------------------------------------------------------------------
// Sources. tier 1 = signal-dense sources that deserve a boost.
// category must be one of CATEGORIES.
// ---------------------------------------------------------------------------
export const CATEGORIES = ["AI security", "Cyber", "AI & ML", "Startups & VC", "Israel tech"];

export const SOURCES = [
  // AI security / agent security (the wedge)
  { name: "Simon Willison", url: "https://simonwillison.net/atom/everything/", site: "https://simonwillison.net", category: "AI & ML", tier: 1 },
  { name: "Embrace The Red", url: "https://embracethered.com/blog/index.xml", site: "https://embracethered.com", category: "AI security", tier: 1 },
  { name: "tl;dr sec", url: "https://tldrsec.com/feed.xml", site: "https://tldrsec.com", category: "Cyber", tier: 1 },
  { name: "Trail of Bits", url: "https://blog.trailofbits.com/feed/", site: "https://blog.trailofbits.com", category: "Cyber", tier: 1 },
  { name: "Google Project Zero", url: "https://googleprojectzero.blogspot.com/feeds/posts/default?alt=rss", site: "https://googleprojectzero.blogspot.com", category: "Cyber", tier: 1 },
  { name: "PortSwigger Research", url: "https://portswigger.net/research/rss", site: "https://portswigger.net/research", category: "Cyber", tier: 1 },
  { name: "OWASP GenAI Security", url: "https://genai.owasp.org/feed/", site: "https://genai.owasp.org", category: "AI security", tier: 1 },
  { name: "Wiz Blog", url: "https://www.wiz.io/feed/rss.xml", site: "https://www.wiz.io/blog", category: "AI security", tier: 2 },
  { name: "Unit 42", url: "https://unit42.paloaltonetworks.com/feed/", site: "https://unit42.paloaltonetworks.com", category: "Cyber", tier: 2 },
  { name: "Check Point Research", url: "https://research.checkpoint.com/feed/", site: "https://research.checkpoint.com", category: "Cyber", tier: 2 },
  { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/", site: "https://krebsonsecurity.com", category: "Cyber", tier: 2 },
  { name: "Schneier on Security", url: "https://www.schneier.com/feed/atom/", site: "https://www.schneier.com", category: "Cyber", tier: 2 },
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", site: "https://thehackernews.com", category: "Cyber", tier: 3 },
  // AI & ML
  { name: "OpenAI", url: "https://openai.com/news/rss.xml", site: "https://openai.com/news", category: "AI & ML", tier: 2 },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", site: "https://deepmind.google/blog", category: "AI & ML", tier: 2 },
  { name: "Hugging Face", url: "https://huggingface.co/blog/feed.xml", site: "https://huggingface.co/blog", category: "AI & ML", tier: 2 },
  { name: "Latent Space", url: "https://www.latent.space/feed", site: "https://www.latent.space", category: "AI & ML", tier: 1 },
  { name: "Import AI", url: "https://importai.substack.com/feed", site: "https://importai.substack.com", category: "AI & ML", tier: 1 },
  { name: "Google AI", url: "https://blog.google/technology/ai/rss/", site: "https://blog.google/technology/ai/", category: "AI & ML", tier: 2 },
  { name: "Hamel Husain", url: "https://hamel.dev/index.xml", site: "https://hamel.dev", category: "AI & ML", tier: 1 },
  // Startups & VC
  { name: "TechCrunch Startups", url: "https://techcrunch.com/category/startups/feed/", site: "https://techcrunch.com/category/startups", category: "Startups & VC", tier: 3 },
  { name: "Crunchbase News", url: "https://news.crunchbase.com/feed/", site: "https://news.crunchbase.com", category: "Startups & VC", tier: 2 },
  { name: "Sequoia", url: "https://www.sequoiacap.com/feed", site: "https://www.sequoiacap.com", category: "Startups & VC", tier: 2 },
  { name: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com/feed", site: "https://www.lennysnewsletter.com", category: "Startups & VC", tier: 1 },
  { name: "Y Combinator", url: "https://www.ycombinator.com/blog/rss", site: "https://www.ycombinator.com/blog", category: "Startups & VC", tier: 2 },
  // Israel tech
  { name: "NoCamels", url: "https://nocamels.com/feed/", site: "https://nocamels.com", category: "Israel tech", tier: 3 },
];

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------
export const decode = (s) => (s || "")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
  .replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_m, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&amp;/g, "&");

export const stripTags = (s) => decode(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const tag = (block, name) => {
  const m = block.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + name + ">", "i"));
  return m ? m[1] : "";
};

/** Parse an RSS 2.0 or Atom document into normalised items. Never throws. */
export function parseFeed(xml, source) {
  const out = [];
  if (!xml || typeof xml !== "string") return out;
  const isAtom = /<entry[\s>]/.test(xml) && !/<item[\s>]/.test(xml);
  const blocks = xml.split(isAtom ? /<entry[\s>]/ : /<item[\s>]/).slice(1);
  for (const raw of blocks) {
    const block = raw.split(isAtom ? /<\/entry>/ : /<\/item>/)[0];
    const title = stripTags(tag(block, "title"));
    let link = "";
    if (isAtom) {
      const links = block.match(/<link\b[^>]*>/gi) || [];
      const alt = links.find((l) => /rel=["']?alternate/i.test(l)) || links.find((l) => !/rel=/i.test(l) && /href=/i.test(l)) || links.find((l) => /href=/i.test(l));
      const h = alt && alt.match(/href=["']([^"']+)["']/i);
      link = h ? h[1] : "";
    } else {
      link = stripTags(tag(block, "link"));
      if (!link) { const g = block.match(/<link[^>]*href=["']([^"']+)["']/i); if (g) link = g[1]; }
      if (!link) { const g = block.match(/<guid[^>]*>(https?:[^<]+)<\/guid>/i); if (g) link = stripTags(g[1]); }
    }
    link = decode(link).trim();
    const dateRaw = decode(tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || tag(block, "dc:date") || "").trim();
    const d = new Date(dateRaw);
    const date = Number.isNaN(d.getTime()) ? "" : d.toISOString();
    const summary = stripTags(tag(block, "description") || tag(block, "summary") || tag(block, "content:encoded") || tag(block, "content"));
    if (!title || !/^https?:\/\//i.test(link)) continue;
    out.push({
      id: idFor(link),
      title: title.slice(0, 200),
      url: canonicalUrl(link),
      source: source.name,
      category: source.category,
      date,
      summary: clip(summary, 240),
    });
  }
  return out;
}

export function canonicalUrl(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    for (const k of [...u.searchParams.keys()]) if (/^(utm_|ref$|source$|fbclid|gclid|mc_)/i.test(k)) u.searchParams.delete(k);
    u.hostname = u.hostname.toLowerCase();
    return u.toString().replace(/\/$/, "");
  } catch { return url.split("#")[0]; }
}

/** Stable id from the canonical URL (short FNV-1a hex). */
export function idFor(url) {
  const s = canonicalUrl(url);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return "f" + h.toString(16).padStart(8, "0");
}

export function clip(s, n) {
  if (!s) return "";
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const i = cut.lastIndexOf(" ");
  return (i > n * 0.5 ? cut.slice(0, i) : cut).replace(/[,;:\-–—\s]+$/, "") + "…";
}

// ---------------------------------------------------------------------------
// Scoring: what is worth Omer's attention (agent/NHI security, AI-for-cyber,
// AI engineering, seed-stage startups, the Israeli ecosystem).
// ---------------------------------------------------------------------------
const KEYWORDS = [
  [/prompt[- ]injection|indirect injection|jailbreak|guardrail|lethal trifecta|memory poisoning|tool (?:use|calling|misuse)/i, 22],
  [/\bmcp\b|model context protocol|\ba2a\b|agentic|ai agents?|llm agents?|autonomous agents?|computer[- ]use/i, 20],
  [/non-?human identit|\bnhi\b|workload identit|spiffe|spire|machine identit|service accounts?|\boauth\b|token exchange|zero trust/i, 18],
  [/ai security|llm security|owasp|mitre atlas|ai red[- ]team|red[- ]teaming|ai[- ]soc|autonomous (?:pentest|soc)|ai pentest/i, 18],
  [/\bevals?\b|evaluation harness|llm-as-a-judge|observability|tracing/i, 10],
  [/\bllm\b|language model|\bgpt-?\d|claude|gemini|openai|anthropic|deepmind|hugging face|fine-?tun|\brag\b|inference|open[- ]weights?/i, 8],
  [/zero-?day|\bcve-\d/i, 8],
  [/vulnerab|exploit|breach|ransomware|supply[- ]chain|malware|phishing/i, 5],
  [/\bseed\b|series [abc]\b|raises|funding|acqui|valuation|unicorn|y combinator|\byc\b|founders?|co-?founders?|go-to-market|\bgtm\b|pmf|product-market/i, 8],
  [/israel|tel aviv|\b8200\b|cyberstarts|team8|glilot|yl ventures|check point|wiz\b/i, 12],
  [/forward[- ]deployed|solutions engineer|\bfde\b/i, 15],
];
const PENALTIES = [
  [/webinar|sponsored|partner content|discount|promo code|giveaway|black friday/i, -25],
  [/\bhiring\b|we'?re hiring|job (?:opening|posting)/i, -20],
  [/podcast episode|\bep\.? ?\d+|episode \d+/i, -6],
  [/weekly (?:recap|roundup|digest)|this week in|top \d+ (?:tools|tips|apps)/i, -8],
];
const TIER_BOOST = { 1: 16, 2: 8, 3: 0 };

/**
 * Relevance score. Deliberately time-independent: stories compete within their
 * own day, and the archive is re-scored on every build, so recency must not
 * shuffle yesterday's picks.
 */
export function score(item, source) {
  const hay = `${item.title} ${item.summary || ""}`;
  let s = 0;
  for (const [re, w] of KEYWORDS) { if (re.test(hay)) s += w; if (re.test(item.title)) s += Math.round(w * 0.4); }
  for (const [re, w] of PENALTIES) if (re.test(hay)) s += w;
  s += TIER_BOOST[source?.tier ?? 3] ?? 0;
  if ((item.summary || "").length >= 120) s += 3;
  if (item.title.length < 24) s -= 4;
  return Math.round(s);
}

// ---------------------------------------------------------------------------
// Selection: dedupe, window, per-day and per-source caps.
// ---------------------------------------------------------------------------
export const DEFAULT_LIMITS = { windowDays: 14, perDay: 8, perSourcePerDay: 2, topPerDay: 3, minScore: 12, topScore: 30, total: 120 };

export function dayKey(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function normTitle(t) {
  return (t || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

/** Merge lists (earlier lists win on conflicts) and drop duplicates by url and by near-identical title. */
export function dedupe(...lists) {
  const byUrl = new Set(); const byTitle = new Set(); const out = [];
  for (const list of lists) for (const it of list) {
    if (!it || !it.url || !it.title) continue;
    const u = canonicalUrl(it.url); const t = normTitle(it.title);
    if (byUrl.has(u) || (t && byTitle.has(t))) continue;
    byUrl.add(u); if (t) byTitle.add(t);
    out.push({ ...it, url: u, id: idFor(u) });
  }
  return out;
}

/**
 * Pick the stories worth reading: newest window, scored, capped per day and
 * per source per day, with the best `topPerDay` of each day flagged `top`.
 */
export function select(items, sourcesByName, now = Date.now(), limits = DEFAULT_LIMITS) {
  const L = { ...DEFAULT_LIMITS, ...limits };
  const cutoff = now - L.windowDays * 864e5;
  const scored = items
    .map((it) => ({ ...it, score: score(it, sourcesByName[it.source]) }))
    .filter((it) => { const t = Date.parse(it.date); return t && t >= cutoff && t <= now + 864e5 && it.score >= L.minScore; });
  const days = new Map();
  for (const it of scored) { const k = dayKey(it.date); if (!days.has(k)) days.set(k, []); days.get(k).push(it); }
  const out = [];
  for (const [, list] of [...days.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))) {
    list.sort((a, b) => b.score - a.score || (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
    const perSource = new Map(); const picked = [];
    for (const it of list) {
      if (picked.length >= L.perDay) break;
      const n = perSource.get(it.source) ?? 0;
      if (n >= L.perSourcePerDay) continue;
      perSource.set(it.source, n + 1);
      picked.push(it);
    }
    picked.forEach((it, i) => { it.top = i < L.topPerDay && it.score >= L.topScore; });
    out.push(...picked);
  }
  out.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  return out.slice(0, L.total);
}

export function sourcesByName(list = SOURCES) {
  return Object.fromEntries(list.map((s) => [s.name, s]));
}
