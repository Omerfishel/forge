// A tiny, self-contained content bundle for logic tests (independent of the real seed).
import type { ContentBundle, Resource, Project, Drill, Path, Milestone, Card, Assessment, Track } from "@/types";

const res = (id: string, extra: Partial<Resource> = {}): Resource => ({
  id, title: `Resource ${id}`, creator: "x", url: "https://example.com/" + id, urlVerified: true, urlVerifiedDate: "2026-09-01",
  resourceType: "course", format: "self_paced", cost: { model: "free" }, estHours: 10, timeBucket: "10_30h", difficulty: "intermediate",
  prerequisites: [], buildsSkill: "something useful", whyForHim: "because it matters for him", priority: "high", producesArtifact: false,
  trackIds: ["T1_AI_ML"], skillIds: ["agents"], roleRelevance: ["FDE"], tags: [], freshness: "current", qualitySignal: "good", ...extra,
});
const proj = (id: string, extra: Partial<Project> = {}): Project => ({
  id, title: `Project ${id}`, trackIds: ["T1_AI_ML"], goal: "build something real", steps: ["a", "b", "c"], stack: ["python"], difficulty: "intermediate", estHours: 20,
  proves: "capability", publishAs: "repo", isPortfolioPiece: true, isStartupSeed: false, relatedResourceIds: [], prerequisites: [], roleRelevance: ["FDE"], tags: [], ...extra,
});
const drill = (id: string, extra: Partial<Drill> = {}): Drill => ({
  id, title: `Drill ${id}`, trackIds: ["T8_META"], cadence: "weekly", description: "do the thing every week", estMinutes: 60, soloOrPartner: "solo", streakable: true, tags: [], kind: "habit", ...extra,
});

export const R1 = res("t1-a", { cost: { model: "free" } });
export const R2 = res("t1-b", { prerequisites: ["t1-a"], cost: { model: "one_time", amount: 50, currency: "USD", freeAlternativeId: "t1-a" }, priority: "must_do" });
export const R3 = res("t2-c", { trackIds: ["T2_BACKEND_SYSTEMS"], skillIds: ["system-design"], cost: { model: "subscription", amount: 120, currency: "USD" }, estHours: 30, timeBucket: "30_100h" });
export const R4 = res("t7-d", { trackIds: ["T7_DOMAIN"], skillIds: ["nhi"], resourceType: "ctf", estHours: 3, timeBucket: "2_10h" });
export const P1 = proj("p-one", { prerequisites: ["t1-b"] });
export const P2 = proj("p-two", { prerequisites: ["p-one", "t7-d"], isStartupSeed: true, trackIds: ["T7_DOMAIN"] });
export const D_WEEK = drill("d-week");
export const D_DAY = drill("d-day", { cadence: "daily", estMinutes: 15, phases: [1] });
export const D_BI = drill("d-bi", { cadence: "biweekly" });
export const D_MONTH = drill("d-month", { cadence: "monthly" });

export const A1: Assessment = { id: "a-t1-rubric", trackId: "T1_AI_ML", type: "rubric", title: "T1 ready", readyWhen: "ready when x", criteria: ["c1", "c2", "c3"], tags: [] };

export const M1: Milestone = { id: "m-1", pathId: "path-primary", phase: 1, title: "Phase 1 done", targetWeek: 13, criteria: "two projects", dependsOn: ["p-one"] };
export const M2: Milestone = { id: "m-2", pathId: "path-primary", phase: 2, title: "Phase 2 done", targetWeek: 52, criteria: "seed work", dependsOn: ["p-two"] };

export const PATH: Path = {
  id: "path-primary", name: "Primary", durationMonths: 18, hoursPerWeek: 12, description: "the default path", output: "a product CTO",
  phases: [
    { phase: 1, title: "Foundations", months: [0, 3], summary: "" },
    { phase: 2, title: "In the job", months: [3, 12], summary: "" },
    { phase: 3, title: "Pre-founding", months: [12, 18], summary: "" },
  ],
  items: [
    { itemId: "t1-a", itemType: "resource", phase: 1 },
    { itemId: "t1-b", itemType: "resource", phase: 1 },
    { itemId: "d-week", itemType: "drill", phase: 1 },
    { itemId: "d-day", itemType: "drill", phase: 1 },
    { itemId: "p-one", itemType: "project", phase: 1 },
    { itemId: "m-1", itemType: "milestone", phase: 1 },
    { itemId: "t2-c", itemType: "resource", phase: 2 },
    { itemId: "t7-d", itemType: "resource", phase: 2 },
    { itemId: "p-two", itemType: "project", phase: 2 },
    { itemId: "a-t1-rubric", itemType: "assessment", phase: 2 },
    { itemId: "m-2", itemType: "milestone", phase: 2 },
  ],
};
export const VARIANT: Path = { ...PATH, id: "path-variant-a", name: "Variant A", durationMonths: 3, hoursPerWeek: 15, variantOf: "path-primary", phases: [{ phase: 1, title: "Sprint", months: [0, 3], summary: "" }], items: PATH.items.filter((i) => i.phase === 1) };

export const CARDS: Card[] = Array.from({ length: 12 }, (_, i) => ({ id: `c-x-${i + 1}`, deck: i < 6 ? "system-design" : "nhi", front: `Q${i + 1} ?`, back: `A${i + 1} .`, trackIds: ["T2_BACKEND_SYSTEMS"], tags: [] }));

const track = (id: Track["id"], code: string, rank: number, color: string): Track => ({ id, code, name: code, goal: "goal statement here", why: "why statement here", skillIds: ["agents"], priorityRank: rank, color, icon: "x", readyWhen: "ready when statement" });

export const bundle: ContentBundle = {
  tracks: [track("T1_AI_ML", "T1", 1, "#22d3ee"), track("T2_BACKEND_SYSTEMS", "T2", 4, "#38bdf8"), track("T7_DOMAIN", "T7", 3, "#f6c453"), track("T8_META", "T8", 8, "#94a3b8")],
  skills: [
    { id: "agents", trackId: "T1_AI_ML", name: "Agents", description: "build agents" },
    { id: "system-design", trackId: "T2_BACKEND_SYSTEMS", name: "System design", description: "design systems" },
    { id: "nhi", trackId: "T7_DOMAIN", name: "NHI", description: "non-human identity" },
  ],
  resources: [R1, R2, R3, R4],
  projects: [P1, P2],
  drills: [D_WEEK, D_DAY, D_BI, D_MONTH],
  assessments: [A1],
  paths: [PATH, VARIANT],
  milestones: [M1, M2],
  cards: CARDS,
  tags: [],
  strategy: { tldr: [], keyFindings: [], domains: [], adjacentDomains: [], roleLadder: [], roleStrategy: [], timeline: [], skillsPool: [], targetStartups: [], cofounderStrategy: [], compensation: [], vcs: [], recommendations: [], caveats: [] },
  meta: { generated: "2026-09-15", sourceDocs: [], version: "test" },
};
