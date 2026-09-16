// Planning logic: dependency DAG, unblocked items, phase-by-date, pace,
// track progress and the "what should I do this week" assembler. Pure.
import type { ContentBundle, Drill, Path, PathItem, ProgressEntry, Project, Resource, TrackId, Assessment, Milestone } from "@/types";
import { monthIndex, weekIndex, todayKey } from "./dates";
import { drillDue } from "./streaks";
import type { SrsState } from "@/store";
import { dueCount } from "./srs";

export type AnyItem =
  | { kind: "resource"; item: Resource }
  | { kind: "project"; item: Project }
  | { kind: "drill"; item: Drill }
  | { kind: "assessment"; item: Assessment }
  | { kind: "milestone"; item: Milestone };

export function findItem(bundle: ContentBundle, id: string): AnyItem | undefined {
  const r = bundle.resources.find((x) => x.id === id);
  if (r) return { kind: "resource", item: r };
  const p = bundle.projects.find((x) => x.id === id);
  if (p) return { kind: "project", item: p };
  const d = bundle.drills.find((x) => x.id === id);
  if (d) return { kind: "drill", item: d };
  const a = bundle.assessments.find((x) => x.id === id);
  if (a) return { kind: "assessment", item: a };
  const m = bundle.milestones.find((x) => x.id === id);
  if (m) return { kind: "milestone", item: m };
  return undefined;
}

export function itemTitle(bundle: ContentBundle, id: string): string {
  const f = findItem(bundle, id);
  return f ? f.item.title : id;
}

/** Prerequisite IDs that are real content IDs (ignore free-text prereqs). */
export function prereqIds(bundle: ContentBundle, id: string): string[] {
  const f = findItem(bundle, id);
  if (!f) return [];
  const raw = f.kind === "resource" || f.kind === "project" ? f.item.prerequisites : f.kind === "milestone" ? f.item.dependsOn : [];
  return raw.filter((p) => !!findItem(bundle, p));
}

export function isDoneP(progress: Record<string, ProgressEntry>, id: string): boolean {
  return progress[id]?.status === "done";
}

/** An item is unblocked when every content prerequisite is done (or skipped). */
export function isUnblocked(bundle: ContentBundle, progress: Record<string, ProgressEntry>, id: string): boolean {
  return prereqIds(bundle, id).every((p) => {
    const st = progress[p]?.status;
    return st === "done" || st === "skipped";
  });
}

export function blockers(bundle: ContentBundle, progress: Record<string, ProgressEntry>, id: string): string[] {
  return prereqIds(bundle, id).filter((p) => !(progress[p]?.status === "done" || progress[p]?.status === "skipped"));
}

/** Detect cycles in the prerequisite graph (returns list of cycles as id arrays). */
export function findCycles(bundle: ContentBundle): string[][] {
  const ids = [...bundle.resources, ...bundle.projects, ...bundle.milestones].map((x) => x.id);
  const state = new Map<string, 0 | 1 | 2>();
  const stack: string[] = [];
  const cycles: string[][] = [];
  const visit = (id: string) => {
    const s = state.get(id) ?? 0;
    if (s === 1) { cycles.push([...stack.slice(stack.indexOf(id)), id]); return; }
    if (s === 2) return;
    state.set(id, 1);
    stack.push(id);
    for (const p of prereqIds(bundle, id)) visit(p);
    stack.pop();
    state.set(id, 2);
  };
  for (const id of ids) visit(id);
  return cycles;
}

// ---------------------------------------------------------------------------
// Paths & phases
// ---------------------------------------------------------------------------
export function activePath(bundle: ContentBundle, pathId: string): Path {
  return bundle.paths.find((p) => p.id === pathId) ?? bundle.paths[0];
}

/** Phase (1..3) the user is in, by months elapsed since startDate. */
export function currentPhase(path: Path, startDate: string, now: Date = new Date()): 1 | 2 | 3 {
  const m = Math.max(0, monthIndex(startDate, now));
  for (const ph of path.phases) {
    if (m >= ph.months[0] && m < ph.months[1]) return ph.phase;
  }
  return path.phases[path.phases.length - 1]?.phase ?? 3;
}

export function pathItemsForPhase(path: Path, phase: 1 | 2 | 3): PathItem[] {
  return path.items.filter((i) => i.phase === phase);
}

export function pathProgress(path: Path, progress: Record<string, ProgressEntry>, drillLog: Record<string, string[]>, bundle: ContentBundle) {
  const items = path.items.filter((i) => i.itemType !== "drill");
  const done = items.filter((i) => isDoneP(progress, i.itemId)).length;
  const drills = path.items.filter((i) => i.itemType === "drill");
  const drillsActive = drills.filter((i) => {
    const d = bundle.drills.find((x) => x.id === i.itemId);
    return d && (drillLog[d.id]?.length ?? 0) > 0;
  }).length;
  return { total: items.length, done, pct: items.length ? Math.round((done / items.length) * 100) : 0, drills: drills.length, drillsActive };
}

// ---------------------------------------------------------------------------
// Pace: expected vs actual through the active path by time elapsed
// ---------------------------------------------------------------------------
export interface PaceInfo {
  expected: number;
  actual: number;
  delta: number;
  expPct: number;
  actPct: number;
  cls: "ahead" | "onpace" | "behind";
  status: string;
  msg: string;
  week: number;
  totalWeeks: number;
}

export function paceInfo(bundle: ContentBundle, path: Path, progress: Record<string, ProgressEntry>, startDate: string, now: Date = new Date()): PaceInfo {
  const items = path.items.filter((i) => i.itemType !== "drill");
  const totalWeeks = Math.round(path.durationMonths * 4.345);
  const week = Math.max(0, Math.min(totalWeeks, weekIndex(startDate, now)));
  // Expected: items whose phase should have started, weighted linearly inside a phase.
  let expected = 0;
  for (const ph of path.phases) {
    const phItems = items.filter((i) => i.phase === ph.phase);
    const startW = Math.round(ph.months[0] * 4.345);
    const endW = Math.min(totalWeeks, Math.round(ph.months[1] * 4.345));
    if (week >= endW) expected += phItems.length;
    else if (week > startW) expected += Math.floor(phItems.length * ((week - startW) / (endW - startW)));
  }
  const actual = items.filter((i) => isDoneP(progress, i.itemId)).length;
  const delta = actual - expected;
  const total = items.length || 1;
  const r: PaceInfo = {
    expected, actual, delta, week, totalWeeks,
    expPct: Math.round((expected / total) * 100),
    actPct: Math.round((actual / total) * 100),
    cls: delta > 0 ? "ahead" : delta === 0 ? "onpace" : "behind",
    status: "", msg: "",
  };
  if (delta > 0) { r.status = `🏇 ${delta} item${delta > 1 ? "s" : ""} ahead of plan`; r.msg = "You're ahead of schedule — keep the lead and bank buffer for the harder projects."; }
  else if (delta === 0) { r.status = "🎯 Right on pace"; r.msg = "Bang on schedule. Finish one more item and you're ahead of the plan."; }
  else { const b = -delta; r.status = `⏳ ${b} item${b > 1 ? "s" : ""} behind plan`; r.msg = `The path expected ${expected} item${expected === 1 ? "" : "s"} by week ${Math.min(week + 1, totalWeeks)}; you've completed ${actual}. Knock out ${b} to get back on track.`; }
  void bundle;
  return r;
}

// ---------------------------------------------------------------------------
// Track progress
// ---------------------------------------------------------------------------
export interface TrackStats { trackId: TrackId; total: number; done: number; inProgress: number; pct: number; hours: number; hoursDone: number; mustDoTotal: number; mustDoDone: number }

export function trackStats(bundle: ContentBundle, progress: Record<string, ProgressEntry>, trackId: TrackId, roleFilter: string = "all"): TrackStats {
  const res = bundle.resources.filter((r) => r.trackIds.includes(trackId) && (roleFilter === "all" || r.roleRelevance.includes(roleFilter as never)));
  const proj = bundle.projects.filter((p) => p.trackIds.includes(trackId) && (roleFilter === "all" || p.roleRelevance.includes(roleFilter as never)));
  const ids = [...res.map((r) => r.id), ...proj.map((p) => p.id)];
  const done = ids.filter((id) => isDoneP(progress, id)).length;
  const inProgress = ids.filter((id) => progress[id]?.status === "in_progress").length;
  const hours = res.reduce((a, r) => a + (r.estHours ?? 0), 0) + proj.reduce((a, p) => a + p.estHours, 0);
  const hoursDone = ids.reduce((a, id) => a + (progress[id]?.hoursLogged ?? 0), 0);
  const must = res.filter((r) => r.priority === "must_do");
  return {
    trackId, total: ids.length, done, inProgress,
    pct: ids.length ? Math.round((done / ids.length) * 100) : 0,
    hours, hoursDone: Math.round(hoursDone * 10) / 10,
    mustDoTotal: must.length, mustDoDone: must.filter((r) => isDoneP(progress, r.id)).length,
  };
}

export function overallStats(bundle: ContentBundle, progress: Record<string, ProgressEntry>) {
  const ids = [...bundle.resources.map((r) => r.id), ...bundle.projects.map((p) => p.id), ...bundle.assessments.map((a) => a.id), ...bundle.milestones.map((m) => m.id)];
  const done = ids.filter((id) => isDoneP(progress, id)).length;
  const hours = bundle.resources.reduce((a, r) => a + (r.estHours ?? 0), 0) + bundle.projects.reduce((a, p) => a + p.estHours, 0);
  const hoursDone = Object.values(progress).reduce((a, p) => a + (p.hoursLogged ?? 0), 0);
  return { total: ids.length, done, pct: ids.length ? Math.round((done / ids.length) * 100) : 0, hours, hoursDone: Math.round(hoursDone * 10) / 10 };
}

// ---------------------------------------------------------------------------
// Weekly plan assembler
// ---------------------------------------------------------------------------
export interface WeekPlan {
  phase: 1 | 2 | 3;
  phaseTitle: string;
  week: number;
  /** Next unblocked, not-done resources/projects/assessments in path order (capped). */
  next: { item: PathItem; title: string; hours: number; unblocked: boolean; blockers: string[]; inProgress: boolean }[];
  /** Blocked items (for transparency). */
  blocked: { item: PathItem; title: string; blockers: string[] }[];
  /** Drills due this period. */
  drillsDue: Drill[];
  /** SRS summary. */
  srs: { due: number; fresh: number; learned: number };
  /** Milestones in the current phase. */
  milestones: Milestone[];
  budgetHours: number;
  plannedHours: number;
}

export function weekPlan(
  bundle: ContentBundle,
  opts: { pathId: string; startDate: string; hoursPerWeek: number; progress: Record<string, ProgressEntry>; drillLog: Record<string, string[]>; srs: Record<string, SrsState>; now?: Date; maxNext?: number },
): WeekPlan {
  const now = opts.now ?? new Date();
  const path = activePath(bundle, opts.pathId);
  const phase = currentPhase(path, opts.startDate, now);
  const phaseTitle = path.phases.find((p) => p.phase === phase)?.title ?? `Phase ${phase}`;
  const week = Math.max(0, weekIndex(opts.startDate, now));
  const maxNext = opts.maxNext ?? 6;

  // Candidate order: current phase items first, then earlier-phase leftovers, then later phases.
  const order = [...path.items.filter((i) => i.phase === phase), ...path.items.filter((i) => i.phase < phase), ...path.items.filter((i) => i.phase > phase)];
  const next: WeekPlan["next"] = [];
  const blocked: WeekPlan["blocked"] = [];
  let planned = 0;
  for (const it of order) {
    if (it.itemType === "drill" || it.itemType === "milestone") continue;
    const st = opts.progress[it.itemId]?.status;
    if (st === "done" || st === "skipped") continue;
    const f = findItem(bundle, it.itemId);
    if (!f) continue;
    const hours = f.kind === "resource" ? f.item.estHours ?? 0 : f.kind === "project" ? f.item.estHours : 0;
    const bl = blockers(bundle, opts.progress, it.itemId);
    if (bl.length) { blocked.push({ item: it, title: f.item.title, blockers: bl.map((b) => itemTitle(bundle, b)) }); continue; }
    if (next.length < maxNext) {
      next.push({ item: it, title: f.item.title, hours, unblocked: true, blockers: [], inProgress: st === "in_progress" });
      planned += hours;
    }
  }
  const drillIds = new Set(path.items.filter((i) => i.itemType === "drill").map((i) => i.itemId));
  const drillsDue = bundle.drills.filter((d) => d.kind === "habit" && drillIds.has(d.id) && (!d.phases || d.phases.length === 0 || d.phases.includes(phase)) && drillDue(d, opts.drillLog[d.id], todayKey(now)));
  const srs = dueCount(bundle.cards.map((c) => c.id), opts.srs, todayKey(now));
  const milestones = bundle.milestones.filter((m) => m.pathId === path.id && m.phase === phase);
  return { phase, phaseTitle, week, next, blocked, drillsDue, srs, milestones, budgetHours: opts.hoursPerWeek, plannedHours: Math.round(planned) };
}
