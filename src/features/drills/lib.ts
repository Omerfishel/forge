// Pure helpers for the Drills view. Everything takes `today` explicitly so tests
// can inject dates (see CLAUDE.md conventions).
import type { Cadence, Drill, SoloOrPartner } from "@/types";
import { addDays, addDaysKey, fmtDate, lastNDays, parseKey, toKey, weekStartOf } from "@/lib/dates";
import { cadenceDays, drillStreak, periodKey } from "@/lib/streaks";

export type PhaseFilter = "all" | "1" | "2" | "3";

export const PHASE_OPTIONS: { value: PhaseFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "1", label: "Phase 1" },
  { value: "2", label: "Phase 2" },
  { value: "3", label: "Phase 3" },
];

export const SOLO_LABEL: Record<SoloOrPartner, string> = {
  solo: "Solo",
  ai_roleplay: "AI roleplay",
  partner: "Partner",
  group: "Group",
};

export const SOLO_ICON: Record<SoloOrPartner, string> = {
  solo: "🧍",
  ai_roleplay: "🤖",
  partner: "🧑‍🤝‍🧑",
  group: "👥",
};

/** Short label for "one period" of a cadence (used in the history strip caption). */
export const PERIOD_NOUN: Record<Cadence, string> = { daily: "days", weekly: "weeks", biweekly: "fortnights", monthly: "months" };

/** Drills with no phases are always active; otherwise they must list the phase. */
export function drillInPhase(drill: Drill, phase: PhaseFilter): boolean {
  if (phase === "all") return true;
  if (!drill.phases || drill.phases.length === 0) return true;
  return drill.phases.includes(Number(phase) as 1 | 2 | 3);
}

export interface PeriodCell {
  /** periodKey() bucket for this period. */
  key: string;
  /** Human label for tooltips. */
  label: string;
  /** True for the period containing `today`. */
  current: boolean;
}

/** The last n periods of a cadence, oldest first, keyed like periodKey(). */
export function lastPeriods(cadence: Cadence, n: number, today: string): PeriodCell[] {
  const out: PeriodCell[] = [];
  const cur = periodKey(cadence, today);
  const d = parseKey(today);
  for (let i = n - 1; i >= 0; i--) {
    let key: string;
    let label: string;
    if (cadence === "monthly") {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      key = periodKey("monthly", toKey(m));
      label = m.toLocaleDateString("en", { month: "short", year: "numeric" });
    } else {
      const cursor = addDaysKey(today, -i * cadenceDays(cadence));
      key = periodKey(cadence, cursor);
      if (cadence === "daily") label = fmtDate(cursor, { weekday: "short", month: "short", day: "numeric" });
      else if (cadence === "weekly") label = `Week of ${fmtDate(key)}`;
      else {
        // biweekly keys are "bw-<idx>" windows anchored at 1970-01-05
        const idx = Number(key.slice(3));
        const start = toKey(addDays(parseKey("1970-01-05"), idx * 14));
        label = `Fortnight of ${fmtDate(start)}`;
      }
    }
    out.push({ key, label, current: key === cur });
  }
  return out;
}

/** Which of the given periods have at least one log entry. */
export function periodsHit(cadence: Cadence, log: string[] | undefined, periods: PeriodCell[]): boolean[] {
  const hit = new Set((log ?? []).map((k) => periodKey(cadence, k)));
  return periods.map((p) => hit.has(p.key));
}

/** Number of drill-log entries (across all drills) dated within the last n days. */
export function loggedLastNDays(drillLog: Record<string, string[]>, days: number, today: string): number {
  const window = new Set(lastNDays(days, parseKey(today)));
  let n = 0;
  for (const list of Object.values(drillLog)) for (const k of list) if (window.has(k)) n += 1;
  return n;
}

export function totalLogged(drillLog: Record<string, string[]>): number {
  return Object.values(drillLog).reduce((a, l) => a + l.length, 0);
}

export interface StreakLeader { drill: Drill | null; streak: number }

/** The habit with the longest current streak. */
export function longestStreak(habits: Drill[], drillLog: Record<string, string[]>, today: string): StreakLeader {
  let best: StreakLeader = { drill: null, streak: 0 };
  for (const d of habits) {
    const s = drillStreak(d, drillLog[d.id], today);
    if (s > best.streak) best = { drill: d, streak: s };
  }
  return best;
}

export interface DrillTotal { drill: Drill; total: number; streak: number; last: string | null }

/** Per-drill totals for the activity table (only drills with at least one log), most logged first. */
export function drillTotals(drills: Drill[], drillLog: Record<string, string[]>, today: string): DrillTotal[] {
  return drills
    .map((drill) => {
      const log = drillLog[drill.id] ?? [];
      const sorted = [...log].sort();
      return { drill, total: log.length, streak: drill.kind === "habit" ? drillStreak(drill, log, today) : 0, last: sorted.length ? sorted[sorted.length - 1] : null };
    })
    .filter((t) => t.total > 0)
    .sort((a, b) => b.total - a.total || a.drill.title.localeCompare(b.drill.title));
}

/** Leading blank cells so the heatmap's 7 rows read Monday→Sunday. */
export function heatPadding(firstKey: string): number {
  const day = parseKey(firstKey).getDay(); // 0 = Sunday
  return day === 0 ? 6 : day - 1;
}

export function weekStartKey(today: string): string {
  return toKey(weekStartOf(parseKey(today)));
}
