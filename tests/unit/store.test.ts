import { STORAGE_KEY, defaultData, useForge } from "@/store";
import { todayKey } from "@/lib/dates";

beforeEach(() => {
  useForge.setState({ ...defaultData() });
});

describe("store: progress", () => {
  it("setStatus done bumps today's completions; undo removes it", () => {
    const s = useForge.getState();
    s.setStatus("t1-a", "resource", "done");
    expect(useForge.getState().progress["t1-a"].status).toBe("done");
    expect(useForge.getState().progress["t1-a"].percentComplete).toBe(100);
    expect(useForge.getState().completions[todayKey()]).toBe(1);
    s.setStatus("t1-a", "resource", "todo");
    expect(useForge.getState().completions[todayKey()]).toBeUndefined();
  });
  it("toggleDone flips", () => {
    useForge.getState().toggleDone("x", "project");
    expect(useForge.getState().progress.x.status).toBe("done");
    useForge.getState().toggleDone("x", "project");
    expect(useForge.getState().progress.x.status).toBe("todo");
  });
  it("setPercent derives status and clamps", () => {
    const s = useForge.getState();
    s.setPercent("r", "resource", 40);
    expect(useForge.getState().progress.r.status).toBe("in_progress");
    s.setPercent("r", "resource", 150);
    expect(useForge.getState().progress.r.percentComplete).toBe(100);
    expect(useForge.getState().progress.r.status).toBe("done");
    expect(useForge.getState().completions[todayKey()]).toBe(1);
    s.setPercent("r", "resource", -5);
    expect(useForge.getState().progress.r.percentComplete).toBe(0);
    expect(useForge.getState().progress.r.status).toBe("todo");
    expect(useForge.getState().completions[todayKey()]).toBeUndefined();
  });
  it("logHours accumulates and never goes negative", () => {
    const s = useForge.getState();
    s.logHours("r", "resource", 1.5);
    s.logHours("r", "resource", 2);
    expect(useForge.getState().progress.r.hoursLogged).toBe(3.5);
    s.logHours("r", "resource", -10);
    expect(useForge.getState().progress.r.hoursLogged).toBe(0);
  });
  it("setLinks stores publish links", () => {
    useForge.getState().setLinks("p", "project", [{ label: "repo", url: "https://x" }]);
    expect(useForge.getState().progress.p.links).toEqual([{ label: "repo", url: "https://x" }]);
  });
  it("toggleCriterion computes percent and completes at 100%", () => {
    const s = useForge.getState();
    s.toggleCriterion("a", 0, 2);
    expect(useForge.getState().progress.a.percentComplete).toBe(50);
    expect(useForge.getState().progress.a.status).toBe("in_progress");
    s.toggleCriterion("a", 1, 2);
    expect(useForge.getState().progress.a.status).toBe("done");
    expect(useForge.getState().completions[todayKey()]).toBe(1);
    s.toggleCriterion("a", 1, 2);
    expect(useForge.getState().progress.a.status).toBe("in_progress");
    expect(useForge.getState().completions[todayKey()]).toBeUndefined();
  });
});

describe("store: drills, notes, srs", () => {
  it("logDrill is idempotent per day and unlog removes", () => {
    const s = useForge.getState();
    s.logDrill("d", "2026-09-10");
    s.logDrill("d", "2026-09-10");
    s.logDrill("d", "2026-09-09");
    expect(useForge.getState().drillLog.d).toEqual(["2026-09-09", "2026-09-10"]);
    expect(useForge.getState().completions["2026-09-10"]).toBe(1);
    s.unlogDrill("d", "2026-09-10");
    expect(useForge.getState().drillLog.d).toEqual(["2026-09-09"]);
    expect(useForge.getState().completions["2026-09-10"]).toBeUndefined();
  });
  it("notes CRUD", () => {
    const s = useForge.getState();
    const id = s.addNote({ title: "T", body: "B", tags: ["x"], resourceId: "t1-a" });
    expect(useForge.getState().notes[0].id).toBe(id);
    s.updateNote(id, { body: "B2" });
    expect(useForge.getState().notes[0].body).toBe("B2");
    s.deleteNote(id);
    expect(useForge.getState().notes).toHaveLength(0);
  });
  it("gradeCard stores state and counts today's reviews", () => {
    useForge.getState().gradeCard("c", 2, { reps: 1, ease: 2.5, interval: 1, due: "2026-09-17", lapses: 0 });
    expect(useForge.getState().srs.c.lastGrade).toBe(2);
    expect(useForge.getState().srsReviewedToday[todayKey()]).toBe(1);
    useForge.getState().resetCard("c");
    expect(useForge.getState().srs.c).toBeUndefined();
  });
});

describe("store: settings, export/import, reset, persistence", () => {
  it("updateSettings merges pomo deeply", () => {
    useForge.getState().updateSettings({ hoursPerWeek: 15, pomo: { focus: 50 } as never });
    const st = useForge.getState().settings;
    expect(st.hoursPerWeek).toBe(15);
    expect(st.pomo.focus).toBe(50);
    expect(st.pomo.short).toBe(5);
  });
  it("export → import round-trips and rejects garbage", () => {
    const s = useForge.getState();
    s.setStatus("t1-a", "resource", "done");
    s.addNote({ title: "n", body: "b", tags: [] });
    const json = s.exportState();
    s.resetAll();
    expect(useForge.getState().progress["t1-a"]).toBeUndefined();
    expect(useForge.getState().importState(JSON.parse(json))).toBe(true);
    expect(useForge.getState().progress["t1-a"].status).toBe("done");
    expect(useForge.getState().notes).toHaveLength(1);
    expect(useForge.getState().importState("nope")).toBe(false);
    expect(useForge.getState().importState({ foo: 1 })).toBe(false);
  });
  it("persists to localStorage under the versioned key", () => {
    useForge.getState().setStatus("z", "resource", "done");
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).state.progress.z.status).toBe("done");
  });
});
