// Date helpers. All "keys" are local-date strings YYYY-MM-DD.

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayKey(now: Date = new Date()): string {
  return toKey(now);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}

export function addDaysKey(key: string, n: number): string {
  return toKey(addDays(parseKey(key), n));
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function diffDays(a: Date, b: Date): number {
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((A - B) / 86400000);
}

export function diffDaysKey(a: string, b: string): number {
  return diffDays(parseKey(a), parseKey(b));
}

/** Monday of the week containing d. */
export function weekStartOf(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

/** 0-based week index since startKey (Monday). Negative if before start. */
export function weekIndex(startKey: string, now: Date = new Date()): number {
  return Math.floor(diffDays(now, parseKey(startKey)) / 7);
}

/** 0-based month index since startKey (30.44-day months). */
export function monthIndex(startKey: string, now: Date = new Date()): number {
  return Math.floor(diffDays(now, parseKey(startKey)) / 30.44);
}

export function fmtDate(key: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }): string {
  return parseKey(key).toLocaleDateString("en", opts);
}

export function fmtLong(d: Date): string {
  return d.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });
}

export function relTime(iso: string, now: Date = new Date()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const s = Math.max(0, Math.round((now.getTime() - t) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
}

/** Keys for the last n days ending today (inclusive), oldest first. */
export function lastNDays(n: number, now: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(toKey(addDays(now, -i)));
  return out;
}

export function isValidKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const d = parseKey(key);
  return toKey(d) === key;
}
