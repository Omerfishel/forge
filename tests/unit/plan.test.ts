import { activePath, blockers, currentPhase, findCycles, findItem, isUnblocked, overallStats, paceInfo, pathProgress, prereqIds, trackStats, weekPlan } from "@/lib/plan";
import { parseKey } from "@/lib/dates";
import { bundle, PATH } from "./fixtures";
import type { ProgressEntry } from "@/types";

const done = (...ids: string[]): Record<string, ProgressEntry> => Object.fromEntries(ids.map((id) => [id, { itemId: id, itemType: "resource" as const, status: "done" as const, updatedAt: "" }]));
const START = "2026-09-14";

describe("dependency graph", () => {
  it("finds items of every kind", () => {
    expect(findItem(bundle, "t1-a")?.kind).toBe("resource");
    expect(findItem(bundle, "p-one")?.kind).toBe("project");
    expect(findItem(bundle, "d-week")?.kind).toBe("drill");
    expect(findItem(bundle, "a-t1-rubric")?.kind).toBe("assessment");
    expect(findItem(bundle, "m-1")?.kind).toBe("milestone");
    expect(findItem(bundle, "nope")).toBeUndefined();
  });
  it("resolves prerequisite ids (content ids only)", () => {
    expect(prereqIds(bundle, "t1-b")).toEqual(["t1-a"]);
    expect(prereqIds(bundle, "p-two")).toEqual(["p-one", "t7-d"]);
    expect(prereqIds(bundle, "m-1")).toEqual(["p-one"]);
  });
  it("unblocked / blockers", () => {
    expect(isUnblocked(bundle, {}, "t1-a")).toBe(true);
    expect(isUnblocked(bundle, {}, "t1-b")).toBe(false);
    expect(blockers(bundle, {}, "p-two")).toEqual(["p-one", "t7-d"]);
    expect(isUnblocked(bundle, done("t1-a"), "t1-b")).toBe(true);
    const skipped: Record<string, ProgressEntry> = { "t1-a": { itemId: "t1-a", itemType: "resource", status: "skipped", updatedAt: "" } };
    expect(isUnblocked(bundle, skipped, "t1-b")).toBe(true);
  });
  it("detects cycles", () => {
    expect(findCycles(bundle)).toEqual([]);
    const cyclic = { ...bundle, resources: [{ ...bundle.resources[0], prerequisites: ["t1-b"] }, ...bundle.resources.slice(1)] };
    expect(findCycles(cyclic).length).toBeGreaterThan(0);
  });
});

describe("paths & phases", () => {
  it("activePath falls back to the first path", () => {
    expect(activePath(bundle, "path-variant-a").id).toBe("path-variant-a");
    expect(activePath(bundle, "missing").id).toBe("path-primary");
  });
  it("currentPhase follows months elapsed", () => {
    expect(currentPhase(PATH, START, parseKey("2026-09-20"))).toBe(1);
    expect(currentPhase(PATH, START, parseKey("2026-12-20"))).toBe(2);
    expect(currentPhase(PATH, START, parseKey("2027-10-01"))).toBe(3);
    expect(currentPhase(PATH, START, parseKey("2030-01-01"))).toBe(3);
    expect(currentPhase(PATH, START, parseKey("2026-01-01"))).toBe(1); // before start clamps to phase 1
  });
  it("pathProgress ignores drills for the % and counts active drills separately", () => {
    const p = pathProgress(PATH, done("t1-a", "t1-b"), { "d-week": ["2026-09-14"] }, bundle);
    expect(p.total).toBe(9); expect(p.done).toBe(2); expect(p.pct).toBe(22); expect(p.drills).toBe(2); expect(p.drillsActive).toBe(1);
  });
});

describe("pace", () => {
  it("is on pace at week 0 with nothing done, ahead after finishing one", () => {
    const p0 = paceInfo(bundle, PATH, {}, START, parseKey("2026-09-14"));
    expect(p0.expected).toBe(0); expect(p0.cls).toBe("onpace");
    const p1 = paceInfo(bundle, PATH, done("t1-a"), START, parseKey("2026-09-14"));
    expect(p1.cls).toBe("ahead"); expect(p1.delta).toBe(1);
  });
  it("is behind deep into phase 1 with nothing done", () => {
    const p = paceInfo(bundle, PATH, {}, START, parseKey("2026-12-01"));
    expect(p.expected).toBeGreaterThan(0); expect(p.cls).toBe("behind"); expect(p.status).toMatch(/behind/);
    expect(p.totalWeeks).toBe(78);
  });
  it("expects everything by the end", () => {
    const p = paceInfo(bundle, PATH, {}, START, parseKey("2029-01-01"));
    expect(p.expected).toBe(9); expect(p.week).toBe(78);
  });
});

describe("stats", () => {
  it("trackStats counts resources+projects per track and must-do", () => {
    // T1 owns t1-a, t1-b and p-one (p-two belongs to T7).
    const s = trackStats(bundle, done("t1-a", "p-one"), "T1_AI_ML");
    expect(s.total).toBe(3); expect(s.done).toBe(2); expect(s.pct).toBe(67); expect(s.hours).toBe(40); expect(s.mustDoTotal).toBe(1); expect(s.mustDoDone).toBe(0);
    expect(trackStats(bundle, {}, "T7_DOMAIN").total).toBe(2);
  });
  it("trackStats honours the role filter", () => {
    expect(trackStats(bundle, {}, "T1_AI_ML", "CEO").total).toBe(0);
    expect(trackStats(bundle, {}, "T1_AI_ML", "FDE").total).toBe(3);
  });
  it("overallStats counts every completable item and hours", () => {
    const prog = { ...done("t1-a"), "p-one": { itemId: "p-one", itemType: "project" as const, status: "in_progress" as const, hoursLogged: 4.5, updatedAt: "" } };
    const o = overallStats(bundle, prog);
    expect(o.total).toBe(4 + 2 + 1 + 2); expect(o.done).toBe(1); expect(o.hoursDone).toBe(4.5); expect(o.hours).toBe(53 + 40);
  });
});

describe("weekPlan", () => {
  const base = { pathId: "path-primary", startDate: START, hoursPerWeek: 12, drillLog: {}, srs: {} };
  it("surfaces unblocked phase-1 items first and reports blocked ones", () => {
    const w = weekPlan(bundle, { ...base, progress: {}, now: parseKey("2026-09-16") });
    expect(w.phase).toBe(1); expect(w.week).toBe(0); expect(w.phaseTitle).toBe("Foundations");
    // phase-1 unblocked first, then later-phase unblocked items (incl. the phase-2 rubric, 0h)
    expect(w.next.map((n) => n.item.itemId)).toEqual(["t1-a", "t2-c", "t7-d", "a-t1-rubric"]);
    expect(w.blocked.map((b) => b.item.itemId)).toEqual(["t1-b", "p-one", "p-two"]);
    expect(w.blocked[0].blockers).toEqual(["Resource t1-a"]);
    expect(w.drillsDue.map((d) => d.id)).toEqual(["d-week", "d-day"]);
    expect(w.srs).toEqual({ due: 0, fresh: 12, learned: 0 });
    expect(w.milestones.map((m) => m.id)).toEqual(["m-1"]);
    expect(w.plannedHours).toBe(10 + 30 + 3);
  });
  it("unblocks dependents as work completes and excludes done items", () => {
    const w = weekPlan(bundle, { ...base, progress: done("t1-a", "t1-b"), now: parseKey("2026-09-16") });
    expect(w.next.map((n) => n.item.itemId)).toEqual(["p-one", "t2-c", "t7-d", "a-t1-rubric"]);
  });
  it("marks in-progress items and caps the queue", () => {
    const progress = { "t1-a": { itemId: "t1-a", itemType: "resource" as const, status: "in_progress" as const, updatedAt: "" } };
    const w = weekPlan(bundle, { ...base, progress, now: parseKey("2026-09-16"), maxNext: 1 });
    expect(w.next).toHaveLength(1); expect(w.next[0].inProgress).toBe(true);
  });
  it("phase-scoped drills disappear outside their phase; drills logged this period are not due", () => {
    const w = weekPlan(bundle, { ...base, progress: {}, drillLog: { "d-week": ["2026-12-14"] }, now: parseKey("2026-12-16") });
    expect(w.phase).toBe(2);
    expect(w.drillsDue.map((d) => d.id)).toEqual([]);
  });
});
