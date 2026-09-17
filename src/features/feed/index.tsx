import { useEffect, useMemo, useState } from "react";
import { useForge } from "@/store";
import { FEED_CATEGORIES, FEED_CATEGORY_VAR, feedDayLabel, groupByDay, useFeed } from "@/lib/feed";
import { relTime } from "@/lib/dates";
import type { FeedCategory, FeedItem } from "@/types";
import { Card, Chip, Empty, PageHeader, Seg, Switch, useToast } from "@/components/ui";

type Filter = "all" | "saved" | FeedCategory;
type Range = "48h" | "7d" | "all";

function FeedRow({ it, now }: { it: FeedItem; now: Date }) {
  const read = useForge((s) => !!s.feed.read[it.id]);
  const saved = useForge((s) => !!s.feed.saved[it.id]);
  const markFeedRead = useForge((s) => s.markFeedRead);
  const toggleFeedSaved = useForge((s) => s.toggleFeedSaved);
  const fc = `var(${FEED_CATEGORY_VAR[it.category]})`;
  return (
    <article className={`fitem ${read ? "read" : ""} ${it.top ? "top" : ""}`} style={{ ["--fc" as string]: fc }} data-testid={`feed-item-${it.id}`}>
      <div className="favatar" aria-hidden="true">{(it.source || "?").slice(0, 1).toUpperCase()}</div>
      <div className="fbody">
        <div className="fmetarow">
          {it.top && <span className="ftop" title="Top pick of the day">★ TOP</span>}
          <span className="fcat">{it.category}</span>
          <span className="fsrc">{it.source}</span>
          <span className="ftime">{relTime(it.date, now)}</span>
        </div>
        <a className="ftitle" href={it.url} target="_blank" rel="noreferrer" onClick={() => markFeedRead(it.id)} data-testid={`feed-title-${it.id}`}>{it.title}</a>
        {it.summary && <p className="fsum">{it.summary}</p>}
        <div className="factions">
          <a className="fbtn" href={it.url} target="_blank" rel="noreferrer" onClick={() => markFeedRead(it.id)} data-testid={`feed-open-${it.id}`}>Read ↗</a>
          <button className={`fbtn ${saved ? "on" : ""}`} onClick={() => toggleFeedSaved(it.id)} aria-pressed={saved} data-testid={`feed-save-${it.id}`}>{saved ? "★ Saved" : "☆ Save"}</button>
          <button className={`fbtn ${read ? "on" : ""}`} onClick={() => markFeedRead(it.id, !read)} aria-pressed={read} data-testid={`feed-read-${it.id}`}>{read ? "✓ Read" : "Mark read"}</button>
        </div>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const { payload, loading, error, refresh } = useFeed();
  const read = useForge((s) => s.feed.read);
  const saved = useForge((s) => s.feed.saved);
  const markFeedReadMany = useForge((s) => s.markFeedReadMany);
  const markFeedSeen = useForge((s) => s.markFeedSeen);
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [range, setRange] = useState<Range>("7d");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [q, setQ] = useState("");
  const [showSources, setShowSources] = useState(false);
  const now = new Date();

  useEffect(() => { markFeedSeen(); }, [markFeedSeen]);

  const items = payload?.items ?? [];
  const visible = useMemo(() => {
    const cutoff = range === "48h" ? Date.now() - 48 * 3600e3 : range === "7d" ? Date.now() - 7 * 864e5 : 0;
    const needle = q.trim().toLowerCase();
    return items.filter((it) =>
      (filter === "all" || (filter === "saved" ? !!saved[it.id] : it.category === filter)) &&
      (!unreadOnly || !read[it.id]) &&
      (Date.parse(it.date) || 0) >= cutoff &&
      (!needle || `${it.title} ${it.summary} ${it.source}`.toLowerCase().includes(needle)));
  }, [items, filter, range, unreadOnly, q, read, saved]);
  const groups = useMemo(() => groupByDay(visible), [visible]);
  const unreadCount = items.filter((it) => !read[it.id]).length;
  const savedCount = Object.keys(saved).length;
  const topToday = useMemo(() => items.filter((it) => it.top && !read[it.id] && (Date.parse(it.date) || 0) >= Date.now() - 48 * 3600e3).slice(0, 5), [items, read]);

  return (
    <div data-testid="page-feed">
      <PageHeader
        title="📰 News"
        sub={payload ? `${payload.count} stories over ${payload.days} days from ${payload.sources.length} sources · a few a day, never a firehose · updated ${relTime(payload.updated, now)}` : "The day's top stories in cyber, AI security, AI/ML, startups and Israeli tech."}
        right={<><button className="sbtn" onClick={refresh} data-testid="feed-refresh">↻ Refresh</button><button className="sbtn" onClick={() => setShowSources((v) => !v)} aria-expanded={showSources} data-testid="feed-sources">📚 Sources</button></>}
      />

      {showSources && payload && (
        <Card title="Sources" className="mb16" testId="feed-sources-list">
          <div className="chips">{payload.sources.map((s) => <a key={s.name} className={`chip sm ${s.ok ? "" : "faint"}`} href={s.site} target="_blank" rel="noreferrer" title={`${s.category}${s.ok ? "" : " · failed on the last run"}`}>{s.name}{s.ok ? "" : " ⚠"}</a>)}</div>
          <div className="rubric mt8">The list is curated in <code>scripts/feed-lib.mjs</code>. Each run keeps at most 8 stories a day (2 per source) with a relevance score above the bar, and drops anything older than 14 days.</div>
        </Card>
      )}

      {loading && !payload ? (
        <Empty>Loading the feed…</Empty>
      ) : error === "missing" || !payload ? (
        <Empty>The feed hasn't been published yet. It appears once the <code>Deploy to GitHub Pages</code> workflow has run (it rebuilds <code>feed.json</code> twice a day).{error === "error" ? " The last fetch failed — try Refresh." : ""}</Empty>
      ) : (
        <>
          {topToday.length > 0 && filter === "all" && !q && (
            <Card title="★ Top picks · last 48h" className="accent mb16" testId="feed-top">
              <div className="col" style={{ gap: 6 }}>
                {topToday.map((it) => (
                  <div key={it.id} className="row" style={{ justifyContent: "space-between", flexWrap: "nowrap", gap: 10 }}>
                    <a href={it.url} target="_blank" rel="noreferrer" className="small" style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--ink)", fontWeight: 650 }} onClick={() => useForge.getState().markFeedRead(it.id)} data-testid={`feed-top-${it.id}`}>{it.title}</a>
                    <span className="xs faint" style={{ whiteSpace: "nowrap" }}>{it.source}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="filters">
            <div className="frow">
              <div className="search" style={{ flex: "1 1 200px" }}><span aria-hidden="true">🔍</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories…" aria-label="Search stories" data-testid="feed-search" /></div>
              <Seg<Range> value={range} onChange={setRange} testId="feed-range" options={[{ value: "48h", label: "48h" }, { value: "7d", label: "7 days" }, { value: "all", label: "All" }]} />
              <label className="tog"><Switch checked={unreadOnly} onChange={setUnreadOnly} label="Unread only" testId="feed-unread" /> unread only</label>
              <span className="fmeta" style={{ marginLeft: "auto" }} data-testid="feed-count">{visible.length} shown · {unreadCount} unread</span>
            </div>
            <div className="chips" style={{ marginTop: 10 }}>
              <Chip small on={filter === "all"} onClick={() => setFilter("all")} testId="feed-cat-all">All</Chip>
              {FEED_CATEGORIES.map((c) => <Chip key={c} small on={filter === c} color={`var(${FEED_CATEGORY_VAR[c]})`} onClick={() => setFilter(c)} testId={`feed-cat-${c.replace(/[^a-z]+/gi, "-").toLowerCase()}`}>{c}</Chip>)}
              <Chip small on={filter === "saved"} onClick={() => setFilter("saved")} testId="feed-cat-saved">★ Saved {savedCount ? <span className="xs faint">{savedCount}</span> : null}</Chip>
            </div>
          </div>

          {groups.length === 0 ? (
            <Empty>{filter === "saved" ? "Nothing saved yet — tap ☆ Save on a story to keep it." : unreadOnly ? "All caught up." : "Nothing matches."}</Empty>
          ) : groups.map((g) => {
            const unreadIds = g.items.filter((it) => !read[it.id]).map((it) => it.id);
            return (
              <section key={g.key} data-testid={`feed-day-${g.key}`}>
                <div className="fdayhead"><span>{feedDayLabel(g.key, now)}</span><span className="pill">{g.items.length}</span><span className="grow" />{unreadIds.length > 0 && <button className="linkbtn xs" onClick={() => { markFeedReadMany(unreadIds); toast(`Marked ${unreadIds.length} as read.`); }} data-testid={`feed-day-read-${g.key}`}>mark day as read</button>}</div>
                {g.items.map((it) => <FeedRow key={it.id} it={it} now={now} />)}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
