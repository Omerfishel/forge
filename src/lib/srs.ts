// SM-2-style spaced repetition scheduler (pure).
import type { SrsState } from "@/store";
import { addDaysKey, todayKey } from "./dates";

export type Grade = 0 | 1 | 2 | 3; // again, hard, good, easy

export const GRADE_LABELS: Record<Grade, string> = { 0: "Again", 1: "Hard", 2: "Good", 3: "Easy" };

export function newCardState(now = todayKey()): SrsState {
  return { reps: 0, ease: 2.5, interval: 0, due: now, lapses: 0 };
}

/** Preview the next interval (days) for each grade — shown on the buttons. */
export function previewIntervals(state: SrsState | undefined): Record<Grade, number> {
  const s = state ?? newCardState();
  return { 0: 0, 1: schedule(s, 1).interval, 2: schedule(s, 2).interval, 3: schedule(s, 3).interval };
}

export function schedule(state: SrsState | undefined, grade: Grade, now = todayKey()): SrsState {
  const s = state ?? newCardState(now);
  let { reps, ease, interval, lapses } = s;

  if (grade === 0) {
    reps = 0;
    interval = 0;
    lapses += 1;
    ease = Math.max(1.3, ease - 0.2);
    return { reps, ease, interval, lapses, due: now };
  }

  // SM-2 ease update: q maps hard→3, good→4, easy→5
  const q = grade === 1 ? 3 : grade === 2 ? 4 : 5;
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  if (reps === 0) interval = grade === 1 ? 1 : grade === 2 ? 1 : 3;
  else if (reps === 1) interval = grade === 1 ? 2 : grade === 2 ? 4 : 6;
  else {
    const base = Math.max(1, Math.round(interval * ease));
    interval = grade === 1 ? Math.max(1, Math.round(interval * 1.2)) : grade === 2 ? base : Math.round(base * 1.3);
  }
  reps += 1;
  return { reps, ease: Math.round(ease * 100) / 100, interval, lapses, due: addDaysKey(now, interval) };
}

export function isDue(state: SrsState | undefined, now = todayKey()): boolean {
  if (!state) return true; // new cards are always available
  return state.due <= now;
}

export function dueCount(cardIds: string[], srs: Record<string, SrsState>, now = todayKey()): { due: number; fresh: number; learned: number } {
  let due = 0, fresh = 0, learned = 0;
  for (const id of cardIds) {
    const s = srs[id];
    if (!s) { fresh += 1; continue; }
    if (s.reps > 0) learned += 1;
    if (s.due <= now) due += 1;
  }
  return { due, fresh, learned };
}

/** Order: due (oldest due first), then new cards, capped. */
export function queue(cardIds: string[], srs: Record<string, SrsState>, opts: { now?: string; maxNew?: number; maxTotal?: number } = {}): string[] {
  const now = opts.now ?? todayKey();
  const maxNew = opts.maxNew ?? 10;
  const maxTotal = opts.maxTotal ?? 40;
  const due = cardIds.filter((id) => srs[id] && srs[id].due <= now).sort((a, b) => (srs[a].due < srs[b].due ? -1 : srs[a].due > srs[b].due ? 1 : 0));
  const fresh = cardIds.filter((id) => !srs[id]).slice(0, maxNew);
  return [...due, ...fresh].slice(0, maxTotal);
}
