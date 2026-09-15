import { dueCount, isDue, newCardState, previewIntervals, queue, schedule } from "@/lib/srs";
import type { SrsState } from "@/store";

const NOW = "2026-09-15";

describe("srs scheduler", () => {
  it("new card graded good → 1 day, then 4, then grows by ease", () => {
    const s1 = schedule(undefined, 2, NOW);
    expect(s1.reps).toBe(1); expect(s1.interval).toBe(1); expect(s1.due).toBe("2026-09-16");
    const s2 = schedule(s1, 2, s1.due);
    expect(s2.reps).toBe(2); expect(s2.interval).toBe(4);
    const s3 = schedule(s2, 2, s2.due);
    expect(s3.interval).toBeGreaterThanOrEqual(9);
    expect(s3.due > s2.due).toBe(true);
  });
  it("easy grows faster than good, hard slower", () => {
    const base: SrsState = { reps: 3, ease: 2.5, interval: 10, due: NOW, lapses: 0 };
    expect(schedule(base, 3, NOW).interval).toBeGreaterThan(schedule(base, 2, NOW).interval);
    expect(schedule(base, 1, NOW).interval).toBeLessThan(schedule(base, 2, NOW).interval);
    expect(schedule(base, 1, NOW).ease).toBeLessThan(base.ease);
    expect(schedule(base, 3, NOW).ease).toBeGreaterThan(base.ease);
  });
  it("again resets reps, counts a lapse, lowers ease (floored at 1.3), due today", () => {
    const base: SrsState = { reps: 5, ease: 1.35, interval: 30, due: NOW, lapses: 1 };
    const s = schedule(base, 0, NOW);
    expect(s.reps).toBe(0); expect(s.lapses).toBe(2); expect(s.ease).toBe(1.3); expect(s.interval).toBe(0); expect(s.due).toBe(NOW);
  });
  it("isDue / dueCount / queue", () => {
    const srs: Record<string, SrsState> = {
      a: { ...newCardState(NOW), reps: 1, interval: 1, due: "2026-09-10" },
      b: { ...newCardState(NOW), reps: 1, interval: 1, due: "2026-09-20" },
      c: { ...newCardState(NOW), reps: 1, interval: 1, due: NOW },
    };
    expect(isDue(srs.a, NOW)).toBe(true);
    expect(isDue(srs.b, NOW)).toBe(false);
    expect(isDue(undefined, NOW)).toBe(true);
    expect(dueCount(["a", "b", "c", "d", "e"], srs, NOW)).toEqual({ due: 2, fresh: 2, learned: 3 });
    const q = queue(["e", "d", "c", "b", "a"], srs, { now: NOW, maxNew: 1 });
    expect(q).toEqual(["a", "c", "e"]); // oldest due first, then 1 new
    expect(queue(["a", "b"], srs, { now: NOW, maxTotal: 1 })).toEqual(["a"]);
  });
  it("preview intervals are monotonic in grade", () => {
    const p = previewIntervals({ reps: 2, ease: 2.5, interval: 6, due: NOW, lapses: 0 });
    expect(p[0]).toBe(0);
    expect(p[1]).toBeLessThanOrEqual(p[2]);
    expect(p[2]).toBeLessThanOrEqual(p[3]);
  });
});
