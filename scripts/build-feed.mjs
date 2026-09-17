// Builds public/feed.json: the day's top stories across cyber, AI security,
// AI/ML, startups and the Israeli ecosystem. Runs in GitHub Actions before the
// site build (see .github/workflows/pages.yml) and locally via `npm run feed`.
// Zero dependencies. Tolerant: a broken source is skipped, never fatal.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCES, dedupe, parseFeed, select, sourcesByName } from "./feed-lib.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../public/feed.json");
// The currently published feed is merged in so stories accumulate across runs
// even when a source is temporarily down.
const ARCHIVE_URL = process.env.FEED_ARCHIVE_URL ?? "https://omerfishel.github.io/forge/feed.json";
const UA = "Forge/1.0 (+https://github.com/Omerfishel/forge feed builder)";

async function getText(url, ms = 12000) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: "follow", headers: { "User-Agent": UA, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, */*" } });
    if (!r.ok) return null;
    return await r.text();
  } catch { return null; } finally { clearTimeout(timer); }
}

const results = await Promise.allSettled(SOURCES.map(async (src) => {
  const xml = await getText(src.url);
  if (!xml) throw new Error("fetch failed");
  const items = parseFeed(xml, src);
  if (!items.length) throw new Error("no items parsed");
  return items;
}));

const fresh = []; const okSources = []; const failed = [];
results.forEach((r, i) => {
  if (r.status === "fulfilled") { okSources.push(SOURCES[i].name); fresh.push(...r.value); }
  else failed.push(`${SOURCES[i].name} (${r.reason?.message ?? "error"})`);
});
console.log(`fetched ${okSources.length}/${SOURCES.length} sources, ${fresh.length} raw items`);
if (failed.length) console.warn("skipped:", failed.join("; "));

let archive = [];
try {
  const j = JSON.parse(readFileSync(OUT, "utf8"));
  if (Array.isArray(j?.items)) archive = j.items;
} catch { /* no local snapshot */ }
if (!process.env.FEED_NO_ARCHIVE) {
  const live = await getText(ARCHIVE_URL, 8000);
  try { const j = JSON.parse(live ?? ""); if (Array.isArray(j?.items)) archive = archive.concat(j.items); } catch { /* not published yet */ }
}

const byName = sourcesByName();
const merged = dedupe(fresh, archive.filter((it) => byName[it.source]));
const items = select(merged, byName);

const days = new Set(items.map((it) => it.date.slice(0, 10)));
const payload = {
  updated: new Date().toISOString(),
  count: items.length,
  days: days.size,
  sources: SOURCES.map((s) => ({ name: s.name, site: s.site, category: s.category, ok: okSources.includes(s.name) })),
  items,
};
if (!items.length) {
  // Nothing usable this run (network down?) — keep whatever feed.json already exists.
  console.error("no stories selected — leaving the existing feed.json untouched");
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload));
  console.log(`public/feed.json: ${items.length} stories over ${days.size} days (${items.filter((i) => i.top).length} top picks)`);
}
