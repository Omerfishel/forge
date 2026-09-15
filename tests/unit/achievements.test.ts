import { achievements } from "@/lib/achievements";
import { bundle } from "./fixtures";
import type { ProgressEntry } from "@/types";

const base = { bundle, progress: {} as Record<string, ProgressEntry>, completions: {}, drillLog: {}, pomoCount: 0, notesCount: 0, srsReviewed: 0, paceAhead: false };
const got = (list: ReturnType<typeof achievements>, id: string) => list.find((a) => a.id === id)!.done;

describe("achievements", () => {
  it("nothing unlocked at start", () => {
    const a = achievements(base);
    expect(a.length).toBeGreaterThan(15);
    expect(a.every((x) => !x.done)).toBe(true);
  });
  it("unlocks by completions, streaks and projects", () => {
    const progress: Record<string, ProgressEntry> = {
      "t1-a": { itemId: "t1-a", itemType: "resource", status: "done", updatedAt: "" },
      "p-two": { itemId: "p-two", itemType: "project", status: "done", updatedAt: "" },
      "t7-d": { itemId: "t7-d", itemType: "resource", status: "done", updatedAt: "" },
    };
    const a = achievements({ ...base, progress, completions: { "2026-09-16": 1, "2026-09-15": 1, "2026-09-14": 1 }, pomoCount: 10, notesCount: 10, srsReviewed: 100, paceAhead: true });
    expect(got(a, "first")).toBe(true);
    expect(got(a, "ten")).toBe(false);
    expect(got(a, "ship1")).toBe(true);
    expect(got(a, "seed")).toBe(true);
    expect(got(a, "pomo10")).toBe(true);
    expect(got(a, "notes10")).toBe(true);
    expect(got(a, "srs100")).toBe(true);
    expect(got(a, "ahead")).toBe(true);
    expect(got(a, "fifty")).toBe(true); // 3 of 6 resources+projects = 50%
  });
  it("track cleared and must-do canon", () => {
    const progress: Record<string, ProgressEntry> = Object.fromEntries(["t1-a", "t1-b", "p-one", "p-two"].map((id) => [id, { itemId: id, itemType: "resource", status: "done", updatedAt: "" }]));
    const a = achievements({ ...base, progress });
    expect(got(a, "track")).toBe(true); // T1 has t1-a, t1-b, p-one, p-two(no: p-two is T7) → T1 = t1-a,t1-b,p-one all done
    expect(got(a, "mustdo")).toBe(true); // only t1-b is must_do
  });
  it("drill-based badges", () => {
    const a = achievements({ ...base, drillLog: { "d-paper-week": Array.from({ length: 10 }, (_, i) => `2026-01-${String(i + 1).padStart(2, "0")}`), "d-tech-post-week": ["a", "b", "c", "d", "e"], x: Array.from({ length: 10 }, () => "k") } });
    expect(got(a, "papers10")).toBe(true);
    expect(got(a, "posts5")).toBe(true);
    expect(got(a, "drills25")).toBe(true);
  });
});
