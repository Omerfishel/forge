// News feed: loads public/feed.json (built by scripts/build-feed.mjs in CI),
// caches it for the session and refreshes it every 30 minutes while open.
import { useEffect, useState } from "react";
import type { FeedCategory, FeedItem, FeedPayload } from "@/types";

export const FEED_CATEGORIES: FeedCategory[] = ["AI security", "Cyber", "AI & ML", "Startups & VC", "Israel tech"];
export const FEED_CATEGORY_VAR: Record<FeedCategory, string> = {
  "AI security": "--t7", Cyber: "--t4", "AI & ML": "--t1", "Startups & VC": "--t5", "Israel tech": "--t3",
};
export const REFRESH_MS = 30 * 60 * 1000;

export interface FeedStatus {
  payload: FeedPayload | null;
  loading: boolean;
  /** "missing" = feed.json not published yet; "error" = network/parse failure. */
  error: "missing" | "error" | null;
  refresh: () => void;
}

/** Where feed.json lives relative to the app (works on GitHub Pages sub-paths). */
export function feedUrl(): string {
  const base = (import.meta.env?.BASE_URL as string | undefined) ?? "./";
  return `${base.endsWith("/") ? base : base + "/"}feed.json`;
}

let cache: { payload: FeedPayload | null; error: FeedStatus["error"]; at: number } | null = null;
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

function isPayload(v: unknown): v is FeedPayload {
  return !!v && typeof v === "object" && Array.isArray((v as FeedPayload).items);
}

export function normalizePayload(raw: unknown): FeedPayload | null {
  if (!isPayload(raw)) return null;
  const items: FeedItem[] = raw.items
    .filter((it) => it && typeof it.id === "string" && typeof it.title === "string" && typeof it.url === "string")
    .map((it) => ({ id: it.id, title: it.title, url: it.url, source: String(it.source ?? ""), category: (FEED_CATEGORIES.includes(it.category) ? it.category : "Cyber") as FeedCategory, date: typeof it.date === "string" ? it.date : "", summary: typeof it.summary === "string" ? it.summary : "", score: Number(it.score) || 0, top: !!it.top }))
    .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  return { updated: String(raw.updated ?? ""), count: items.length, days: Number(raw.days) || new Set(items.map((i) => i.date.slice(0, 10))).size, sources: Array.isArray(raw.sources) ? raw.sources : [], items };
}

export async function loadFeed(force = false): Promise<void> {
  if (!force && cache && Date.now() - cache.at < REFRESH_MS) return;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const r = await fetch(`${feedUrl()}?t=${Math.floor(Date.now() / 60000)}`, { cache: "no-store" });
      if (r.status === 404) { cache = { payload: null, error: "missing", at: Date.now() }; return; }
      if (!r.ok) throw new Error(String(r.status));
      const payload = normalizePayload(await r.json());
      cache = payload ? { payload, error: null, at: Date.now() } : { payload: null, error: "error", at: Date.now() };
    } catch {
      cache = { payload: cache?.payload ?? null, error: cache?.payload ? null : "error", at: Date.now() };
    } finally {
      inflight = null;
      listeners.forEach((l) => l());
    }
  })();
  return inflight;
}

/** Test hook: reset the module cache. */
export function resetFeedCache() { cache = null; inflight = null; }

export function useFeed(): FeedStatus {
  const [, tick] = useState(0);
  useEffect(() => {
    const l = () => tick((n) => n + 1);
    listeners.add(l);
    void loadFeed();
    const id = window.setInterval(() => void loadFeed(), REFRESH_MS);
    return () => { listeners.delete(l); window.clearInterval(id); };
  }, []);
  return { payload: cache?.payload ?? null, loading: !cache, error: cache?.error ?? null, refresh: () => void loadFeed(true) };
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------
export function feedDayKey(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function feedDayLabel(key: string, now: Date = new Date()): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((today.getTime() - date.getTime()) / 864e5);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" });
}

/** Items published in the last `hours` that are still unread. */
export function unreadRecent(items: FeedItem[], read: Record<string, true>, hours = 48, now = Date.now()): FeedItem[] {
  const cutoff = now - hours * 3600e3;
  return items.filter((it) => !read[it.id] && (Date.parse(it.date) || 0) >= cutoff);
}

/** The rail's radar: up to n unread top picks, newest first, falling back to any unread. */
export function radarPicks(items: FeedItem[], read: Record<string, true>, n = 3): FeedItem[] {
  const unread = items.filter((it) => !read[it.id]);
  const tops = unread.filter((it) => it.top);
  const pool = tops.length >= n ? tops : [...tops, ...unread.filter((it) => !it.top)];
  return pool.slice(0, n);
}

export function groupByDay(items: FeedItem[]): { key: string; items: FeedItem[] }[] {
  const groups: { key: string; items: FeedItem[] }[] = [];
  for (const it of items) {
    const k = feedDayKey(it.date) || "unknown";
    const g = groups[groups.length - 1];
    if (g && g.key === k) g.items.push(it); else groups.push({ key: k, items: [it] });
  }
  return groups;
}
