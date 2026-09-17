import { CATEGORIES, SOURCES, canonicalUrl, clip, dedupe, idFor, parseFeed, score, select, sourcesByName, type FeedSourceDef, type RawItem } from "../../scripts/feed-lib.mjs";
import { feedDayLabel, groupByDay, normalizePayload, radarPicks, unreadRecent } from "@/lib/feed";

const NOW = Date.parse("2026-09-17T12:00:00Z");
const src = (over: Partial<FeedSourceDef> = {}): FeedSourceDef => ({ name: "Test", url: "https://t.example/feed", site: "https://t.example", category: "Cyber", tier: 2, ...over });
const item = (over: Partial<RawItem> = {}): RawItem => ({ id: "x", title: "A perfectly ordinary story title", url: "https://t.example/a", source: "Test", category: "Cyber", date: new Date(NOW - 3600e3).toISOString(), summary: "", ...over });

const RSS = `<?xml version="1.0"?><rss><channel><title>T</title>
<item><title>First &amp; <![CDATA[<b>bold</b>]]> story</title><link>https://t.example/one?utm_source=rss</link><pubDate>Tue, 16 Sep 2026 10:00:00 GMT</pubDate><description><![CDATA[<p>Hello <em>world</em> &nbsp; summary.</p>]]></description></item>
<item><title>No link story</title><pubDate>Tue, 16 Sep 2026 10:00:00 GMT</pubDate></item>
<item><title>Guid link</title><guid>https://t.example/two</guid><pubDate>garbage</pubDate></item>
</channel></rss>`;
const ATOM = `<feed xmlns="http://www.w3.org/2005/Atom"><title>A</title>
<entry><title>Atom entry</title><link rel="self" href="https://t.example/self"/><link rel="alternate" href="https://t.example/atom#frag"/><updated>2026-09-15T08:00:00Z</updated><summary>Sum</summary></entry>
<entry><title>Second</title><link href="https://t.example/second"/><published>2026-09-14T08:00:00Z</published><content type="html">&lt;p&gt;Body&lt;/p&gt;</content></entry>
</feed>`;

describe("feed-lib: parsing", () => {
  it("parses RSS with CDATA, entities, utm stripping and guid fallback", () => {
    const items = parseFeed(RSS, src());
    expect(items.map((i) => i.title)).toEqual(["First & bold story", "Guid link"]);
    expect(items[0].url).toBe("https://t.example/one");
    expect(items[0].summary).toBe("Hello world summary.");
    expect(items[0].date).toBe("2026-09-16T10:00:00.000Z");
    expect(items[1].date).toBe(""); // unparseable date → empty
    expect(items[0].id).toMatch(/^f[0-9a-f]{8}$/);
  });
  it("parses Atom, preferring rel=alternate and stripping fragments", () => {
    const items = parseFeed(ATOM, src({ category: "AI & ML" }));
    expect(items).toHaveLength(2);
    expect(items[0].url).toBe("https://t.example/atom");
    expect(items[0].category).toBe("AI & ML");
    expect(items[1].summary).toBe("Body");
  });
  it("never throws on garbage", () => {
    expect(parseFeed("", src())).toEqual([]);
    expect(parseFeed("<html>nope</html>", src())).toEqual([]);
    expect(parseFeed(null as unknown as string, src())).toEqual([]);
  });
  it("canonicalises urls and clips text at word boundaries", () => {
    expect(canonicalUrl("HTTPS://Example.com/a/?utm_medium=x&id=5#top")).toBe("https://example.com/a/?id=5");
    expect(idFor("https://example.com/a")).toBe(idFor("https://example.com/a/#x"));
    expect(clip("one two three four", 12)).toBe("one two…");
    expect(clip("short", 12)).toBe("short");
  });
});

describe("feed-lib: scoring and selection", () => {
  it("rewards the wedge, tier and substance; penalises promos", () => {
    const base = score(item(), src({ tier: 3 }));
    expect(score(item({ title: "Indirect prompt injection in an MCP agent" }), src({ tier: 3 }))).toBeGreaterThan(base + 40);
    expect(score(item(), src({ tier: 1 }))).toBe(base + 16);
    expect(score(item({ summary: "Join our webinar for a sponsored discount code" }), src({ tier: 3 }))).toBeLessThan(base);
    expect(score(item({ title: "Tiny" }), src({ tier: 3 }))).toBeLessThan(base);
  });
  it("is time-independent", () => {
    const a = score(item({ date: new Date(NOW - 10 * 864e5).toISOString() }), src());
    const b = score(item({ date: new Date(NOW).toISOString() }), src());
    expect(a).toBe(b);
  });
  it("dedupes by url and near-identical title, first list wins", () => {
    const out = dedupe([item({ url: "https://t.example/a", title: "Same Story!" })], [item({ url: "https://t.example/a#x", title: "Other" }), item({ url: "https://t.example/b", title: "same story" }), item({ url: "https://t.example/c", title: "Different" })]);
    expect(out.map((i) => i.url)).toEqual(["https://t.example/a", "https://t.example/c"]);
  });
  it("caps per day and per source, flags top picks and drops weak or old stories", () => {
    const byName = sourcesByName([src({ name: "Loud", tier: 1 }), src({ name: "Quiet", tier: 1 }), src({ name: "Meh", tier: 3 })]);
    const day = (d: number, h: number) => new Date(NOW - d * 864e5 - h * 3600e3).toISOString();
    const items: RawItem[] = [
      ...Array.from({ length: 6 }, (_, i) => item({ url: `https://l/${i}`, title: `Loud prompt injection story number ${i}`, source: "Loud", date: day(0, i) })),
      ...Array.from({ length: 6 }, (_, i) => item({ url: `https://q/${i}`, title: `Quiet story number ${i} about things`, source: "Quiet", date: day(0, i) })),
      item({ url: "https://m/1", title: "Meh generic post without keywords", source: "Meh", date: day(0, 1) }),
      item({ url: "https://m/2", title: "Meh zero-day exploit CVE-2026-1234 vulnerability", source: "Meh", date: day(0, 2) }),
      item({ url: "https://old/1", title: "Loud story from a month ago prompt injection", source: "Loud", date: day(30, 0) }),
      item({ url: "https://future/1", title: "Loud story from the future prompt injection", source: "Loud", date: new Date(NOW + 3 * 864e5).toISOString() }),
    ];
    const out = select(items, byName, NOW, { perDay: 4, perSourcePerDay: 2, topPerDay: 2 });
    expect(out).toHaveLength(4);
    expect(out.filter((i) => i.source === "Loud")).toHaveLength(2); // six candidates, capped at 2
    expect(out.filter((i) => i.source === "Meh")).toHaveLength(1); // the zero-day story outranks the quiet tier-1 posts
    expect(out.filter((i) => i.source === "Quiet")).toHaveLength(1);
    expect(out.some((i) => i.url.startsWith("https://old"))).toBe(false);
    expect(out.some((i) => i.url.startsWith("https://future"))).toBe(false);
    expect(out.filter((i) => i.top)).toHaveLength(2);
    // the relevant Meh story clears the bar; the generic one does not
    const meh = select(items.filter((i) => i.source === "Meh"), byName, NOW);
    expect(meh.map((i) => i.url)).toEqual(["https://m/2"]);
  });
  it("source table is consistent", () => {
    const names = SOURCES.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
    for (const s of SOURCES) { expect(CATEGORIES).toContain(s.category); expect(s.url).toMatch(/^https:\/\//); }
  });
});

describe("feed helpers (app side)", () => {
  const items = [
    { id: "a", title: "A", url: "https://x/a", source: "S", category: "Cyber" as const, date: new Date(NOW - 1 * 3600e3).toISOString(), summary: "", score: 40, top: true },
    { id: "b", title: "B", url: "https://x/b", source: "S", category: "Cyber" as const, date: new Date(NOW - 30 * 3600e3).toISOString(), summary: "", score: 20, top: false },
    { id: "c", title: "C", url: "https://x/c", source: "S", category: "Cyber" as const, date: new Date(NOW - 80 * 3600e3).toISOString(), summary: "", score: 50, top: true },
  ];
  it("normalises payloads defensively", () => {
    expect(normalizePayload(null)).toBeNull();
    expect(normalizePayload({ items: "nope" })).toBeNull();
    const p = normalizePayload({ updated: "u", items: [{ id: "1", title: "t", url: "https://x", category: "Bogus", date: "2026-09-01T00:00:00Z" }, { id: 2 }] })!;
    expect(p.items).toHaveLength(1);
    expect(p.items[0].category).toBe("Cyber");
    expect(p.days).toBe(1);
  });
  it("unreadRecent, radarPicks and grouping", () => {
    expect(unreadRecent(items, {}, 48, NOW).map((i) => i.id)).toEqual(["a", "b"]);
    expect(unreadRecent(items, { a: true }, 48, NOW).map((i) => i.id)).toEqual(["b"]);
    expect(radarPicks(items, {}, 3).map((i) => i.id)).toEqual(["a", "c", "b"]);
    expect(radarPicks(items, { a: true, c: true }, 3).map((i) => i.id)).toEqual(["b"]);
    expect(groupByDay(items).map((g) => g.items.length)).toEqual([1, 1, 1]);
    expect(feedDayLabel("2026-09-17", new Date(NOW))).toBe("Today");
    expect(feedDayLabel("2026-09-16", new Date(NOW))).toBe("Yesterday");
  });
});
