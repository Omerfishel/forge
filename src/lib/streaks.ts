// Streaks, drill cadence, heatmap — pure helpers.
import type { Cadence, Drill } from "@/types";
import { addDaysKey, diffDaysKey, lastNDays, parseKey, todayKey, toKey, weekStartOf } from "./dates";

/** Consecutive days (ending today or yesterday) with at least one completion. */
export function calcStreak(completions: Record<string, number>, now = todayKey()): number {
  let streak = 0;
  let cursor = now;
  // A streak is still alive if nothing happened today yet but yesterday had activity.
  if (!(completions[cursor] > 0)) cursor = addDaysKey(cursor, -1);
  while (completions[cursor] > 0) {
    streak += 1;
    cursor = addDaysKey(cursor, -1);
  }
  return streak;
}

export function cadenceDays(c: Cadence): number {
  switch (c) {
    case "daily": return 1;
    case "weekly": return 7;
    case "biweekly": return 14;
    case "monthly": return 30;
  }
}

/** Period key that a date belongs to for a cadence (used for streak counting). */
export function periodKey(cadence: Cadence, dateKey: string): string {
  const d = parseKey(dateKey);
  if (cadence === "daily") return dateKey;
  if (cadence === "monthly") return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const ws = weekStartOf(d);
  if (cadence === "weekly") return toKey(ws);
  // biweekly: bucket by 14-day windows anchored at epoch Monday 1970-01-05
  const epoch = parseKey("1970-01-05");
  const idx = Math.floor(diffDaysKey(toKey(ws), toKey(epoch)) / 14);
  return `bw-${idx}`;
}

/** Whether a drill is due now: no log entry inside the current period. */
export function drillDue(drill: Drill, log: string[] | undefined, now = todayKey()): boolean {
  const cur = periodKey(drill.cadence, now);
  return !(log ?? []).some((k) => periodKey(drill.cadence, k) === cur);
}

export function drillDoneThisPeriod(drill: Drill, log: string[] | undefined, now = todayKey()): boolean {
  return !drillDue(drill, log, now);
}

/** Count of consecutive periods (ending at the current or previous period) with a log entry. */
export function drillStreak(drill: Drill, log: string[] | undefined, now = todayKey()): number {
  const entries = new Set((log ?? []).map((k) => periodKey(drill.cadence, k)));
  if (entries.size === 0) return 0;
  const step = cadenceDays(drill.cadence);
  let cursor = now;
  let streak = 0;
  // allow the current period to be incomplete
  if (!entries.has(periodKey(drill.cadence, cursor))) cursor = addDaysKey(cursor, -step);
  let guard = 0;
  while (entries.has(periodKey(drill.cadence, cursor)) && guard < 2000) {
    streak += 1;
    cursor = addDaysKey(cursor, -step);
    guard += 1;
  }
  return streak;
}

export interface HeatCell { key: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

/** Last n days of activity with a 0–4 intensity level. */
export function heatmap(completions: Record<string, number>, days = 91, now = todayKey()): HeatCell[] {
  const keys = lastNDays(days, parseKey(now));
  return keys.map((key) => {
    const c = completions[key] ?? 0;
    const level: HeatCell["level"] = c <= 0 ? 0 : c === 1 ? 1 : c === 2 ? 2 : c <= 4 ? 3 : 4;
    return { key, count: c, level };
  });
}

/** Sum of completions in the last n days. */
export function recentTotal(completions: Record<string, number>, days = 7, now = todayKey()): number {
  return lastNDays(days, parseKey(now)).reduce((a, k) => a + (completions[k] ?? 0), 0);
}
