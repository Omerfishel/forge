// Content integrity: schema validation (zod), referential integrity, DAG sanity,
// and minimum-coverage assertions against the curriculum spec.
import { z } from "zod";
import { content } from "@/data";
import { TRACK_IDS } from "@/types";
import { findCycles, prereqIds } from "@/lib/plan";

const TrackIdZ = z.enum(["T1_AI_ML", "T2_BACKEND_SYSTEMS", "T3_PRODUCT", "T4_FDE_SE", "T5_SALES_GTM", "T6_FOUNDER", "T7_DOMAIN", "T8_META"]);
const ResourceTypeZ = z.enum(["course", "video", "book", "article", "paper", "podcast", "newsletter", "interactive_lab", "ctf", "tutorial", "repo", "tool", "community", "conference", "certification", "template", "worksheet", "framework"]);
const FormatZ = z.enum(["self_paced", "cohort", "book", "video_series", "hands_on_lab", "reading", "event", "tool"]);
const DifficultyZ = z.enum(["foundational", "intermediate", "advanced"]);
const PriorityZ = z.enum(["must_do", "high", "optional", "skip_unless_relevant"]);
const CostModelZ = z.enum(["free", "one_time", "subscription", "freemium"]);
const RoleZ = z.enum(["PM", "FDE", "SE", "Developer", "CTO", "CEO"]);
const TimeBucketZ = z.enum(["lt_2h", "2_10h", "10_30h", "30_100h", "gt_100h", "ongoing"]);
const FreshnessZ = z.enum(["current", "aging", "stale", "unknown"]);
const slug = z.string().regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "id must be a kebab-case slug");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const url = z.string().url();

const ResourceZ = z.object({
  id: slug, title: z.string().min(3), creator: z.string().min(1), url, urlVerified: z.boolean(), urlVerifiedDate: isoDate,
  resourceType: ResourceTypeZ, format: FormatZ,
  cost: z.object({ model: CostModelZ, amount: z.number().nonnegative().optional(), currency: z.string().optional(), note: z.string().optional(), freeAlternativeId: z.string().optional() }),
  estHours: z.number().positive().optional(), timeBucket: TimeBucketZ, difficulty: DifficultyZ, prerequisites: z.array(z.string()),
  buildsSkill: z.string().min(5), whyForHim: z.string().min(10), priority: PriorityZ, producesArtifact: z.boolean(),
  trackIds: z.array(TrackIdZ).min(1), skillIds: z.array(z.string()).min(1), roleRelevance: z.array(RoleZ).min(1), tags: z.array(z.string()),
  freshness: FreshnessZ, qualitySignal: z.string().min(3), notes: z.string().optional(), links: z.array(z.object({ label: z.string(), url })).optional(),
});
const ProjectZ = z.object({
  id: slug, title: z.string().min(3), trackIds: z.array(TrackIdZ).min(1), goal: z.string().min(10), steps: z.array(z.string().min(3)).min(3), stack: z.array(z.string()).min(1),
  difficulty: DifficultyZ, estHours: z.number().positive(), proves: z.string().min(5), publishAs: z.string().min(3), isPortfolioPiece: z.boolean(), isStartupSeed: z.boolean(),
  relatedResourceIds: z.array(z.string()), prerequisites: z.array(z.string()), roleRelevance: z.array(RoleZ).min(1), tags: z.array(z.string()), caveats: z.string().optional(),
});
const DrillZ = z.object({
  id: slug, title: z.string().min(3), trackIds: z.array(TrackIdZ).min(1), cadence: z.enum(["daily", "weekly", "biweekly", "monthly"]), description: z.string().min(10),
  estMinutes: z.number().positive(), soloOrPartner: z.enum(["solo", "ai_roleplay", "partner", "group"]), streakable: z.boolean(), tags: z.array(z.string()),
  phases: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])).optional(), kind: z.enum(["habit", "workout"]), script: z.string().optional(),
});
const AssessmentZ = z.object({
  id: slug, trackId: TrackIdZ, type: z.enum(["rubric", "checkpoint", "self_test", "public_proof"]), title: z.string().min(3), readyWhen: z.string().min(10),
  questions: z.array(z.string()).optional(), criteria: z.array(z.string().min(3)).min(1), publicProof: z.string().optional(), tags: z.array(z.string()),
});
const PathZ = z.object({
  id: slug, name: z.string().min(3), durationMonths: z.number().positive(), hoursPerWeek: z.number().positive(),
  phases: z.array(z.object({ phase: z.union([z.literal(1), z.literal(2), z.literal(3)]), title: z.string(), months: z.tuple([z.number(), z.number()]), summary: z.string() })).min(1),
  items: z.array(z.object({ itemId: z.string(), itemType: z.enum(["resource", "project", "drill", "milestone", "assessment"]), phase: z.union([z.literal(1), z.literal(2), z.literal(3)]), note: z.string().optional() })).min(5),
  variantOf: z.string().optional(), description: z.string().min(10), output: z.string().min(5),
});
const MilestoneZ = z.object({ id: slug, pathId: z.string(), phase: z.union([z.literal(1), z.literal(2), z.literal(3)]), title: z.string(), targetWeek: z.number().nonnegative(), criteria: z.string().min(5), dependsOn: z.array(z.string()) });
const CardZ = z.object({ id: slug, deck: z.string(), front: z.string().min(5), back: z.string().min(5), trackIds: z.array(TrackIdZ).min(1), tags: z.array(z.string()), sourceId: z.string().optional() });
const TrackZ = z.object({ id: TrackIdZ, code: z.string().regex(/^T[1-8]$/), name: z.string(), goal: z.string().min(10), why: z.string().min(10), skillIds: z.array(z.string()).min(1), priorityRank: z.number().int().min(1).max(8), color: z.string().regex(/^#[0-9a-fA-F]{6}$/), icon: z.string(), readyWhen: z.string().min(10) });
const SkillZ = z.object({ id: slug, trackId: TrackIdZ, name: z.string(), description: z.string().min(5), parentSkillId: z.string().optional() });

const ids = {
  resources: new Set(content.resources.map((r) => r.id)),
  projects: new Set(content.projects.map((p) => p.id)),
  drills: new Set(content.drills.map((d) => d.id)),
  assessments: new Set(content.assessments.map((a) => a.id)),
  milestones: new Set(content.milestones.map((m) => m.id)),
  skills: new Set(content.skills.map((s) => s.id)),
  paths: new Set(content.paths.map((p) => p.id)),
};
const allItemIds = new Set([...ids.resources, ...ids.projects, ...ids.drills, ...ids.assessments, ...ids.milestones]);

function expectValid<T>(schema: z.ZodType<T>, list: unknown[], label: string) {
  const errors: string[] = [];
  list.forEach((item, i) => {
    const r = schema.safeParse(item);
    if (!r.success) errors.push(`${label}[${i}] (${(item as { id?: string })?.id ?? "?"}): ${r.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
  });
  expect(errors, errors.join("\n")).toEqual([]);
}

describe("content schema", () => {
  it("tracks are valid, complete and uniquely ranked", () => {
    expectValid(TrackZ, content.tracks, "track");
    expect(content.tracks.map((t) => t.id).sort()).toEqual([...TRACK_IDS].sort());
    expect(new Set(content.tracks.map((t) => t.priorityRank)).size).toBe(content.tracks.length);
  });
  it("skills valid", () => expectValid(SkillZ, content.skills, "skill"));
  it("resources valid", () => expectValid(ResourceZ, content.resources, "resource"));
  it("projects valid", () => expectValid(ProjectZ, content.projects, "project"));
  it("drills valid", () => expectValid(DrillZ, content.drills, "drill"));
  it("assessments valid", () => expectValid(AssessmentZ, content.assessments, "assessment"));
  it("paths valid", () => expectValid(PathZ, content.paths, "path"));
  it("milestones valid", () => expectValid(MilestoneZ, content.milestones, "milestone"));
  it("cards valid", () => expectValid(CardZ, content.cards, "card"));
});

describe("content integrity", () => {
  it("all ids are globally unique", () => {
    const all = [...content.resources, ...content.projects, ...content.drills, ...content.assessments, ...content.milestones, ...content.cards, ...content.skills, ...content.paths].map((x) => x.id);
    const dupes = all.filter((id, i) => all.indexOf(id) !== i);
    expect(dupes, `duplicate ids: ${dupes.join(", ")}`).toEqual([]);
  });
  it("resource ids are prefixed by their primary track (t1..t8)", () => {
    const bad = content.resources.filter((r) => !r.id.startsWith(r.trackIds[0].slice(0, 2).toLowerCase() + "-"));
    expect(bad.map((r) => `${r.id} (${r.trackIds[0]})`), "resource id prefix must match primary track").toEqual([]);
  });
  it("skills referenced by tracks/resources exist", () => {
    const missing: string[] = [];
    for (const t of content.tracks) for (const s of t.skillIds) if (!ids.skills.has(s)) missing.push(`${t.id}→${s}`);
    for (const r of content.resources) for (const s of r.skillIds) if (!ids.skills.has(s)) missing.push(`${r.id}→${s}`);
    expect(missing, missing.join(", ")).toEqual([]);
  });
  it("every skill belongs to an existing track and parents exist", () => {
    const bad = content.skills.filter((s) => s.parentSkillId && !ids.skills.has(s.parentSkillId)).map((s) => s.id);
    expect(bad).toEqual([]);
  });
  it("free alternative ids resolve", () => {
    const bad = content.resources.filter((r) => r.cost.freeAlternativeId && !ids.resources.has(r.cost.freeAlternativeId)).map((r) => r.id);
    expect(bad).toEqual([]);
  });
  it("project relatedResourceIds & prerequisites resolve", () => {
    const bad: string[] = [];
    for (const p of content.projects) {
      for (const r of p.relatedResourceIds) if (!ids.resources.has(r)) bad.push(`${p.id}→related:${r}`);
      for (const r of p.prerequisites) if (!allItemIds.has(r)) bad.push(`${p.id}→prereq:${r}`);
    }
    expect(bad, bad.join(", ")).toEqual([]);
  });
  it("resource prerequisites that look like ids resolve", () => {
    const bad: string[] = [];
    for (const r of content.resources) for (const p of r.prerequisites) if (/^[tpd][0-9]?-[a-z0-9-]+$/.test(p) && !allItemIds.has(p)) bad.push(`${r.id}→${p}`);
    expect(bad, bad.join(", ")).toEqual([]);
  });
  it("path items and milestones resolve", () => {
    const bad: string[] = [];
    for (const p of content.paths) {
      for (const it of p.items) {
        const set = it.itemType === "resource" ? ids.resources : it.itemType === "project" ? ids.projects : it.itemType === "drill" ? ids.drills : it.itemType === "assessment" ? ids.assessments : ids.milestones;
        if (!set.has(it.itemId)) bad.push(`${p.id}→${it.itemType}:${it.itemId}`);
      }
      if (p.variantOf && !ids.paths.has(p.variantOf)) bad.push(`${p.id}→variantOf:${p.variantOf}`);
    }
    for (const m of content.milestones) {
      if (!ids.paths.has(m.pathId)) bad.push(`${m.id}→path:${m.pathId}`);
      for (const d of m.dependsOn) if (!allItemIds.has(d)) bad.push(`${m.id}→dependsOn:${d}`);
    }
    expect(bad, bad.join(", ")).toEqual([]);
  });
  it("path items are unique within a path", () => {
    for (const p of content.paths) {
      const keys = p.items.map((i) => i.itemId);
      const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
      expect(dupes, `${p.id} duplicates: ${dupes.join(", ")}`).toEqual([]);
    }
  });
  it("prerequisite graph has no cycles", () => {
    expect(findCycles(content)).toEqual([]);
  });
  it("within a path, prerequisites appear no later than their dependents", () => {
    const bad: string[] = [];
    for (const p of content.paths) {
      const pos = new Map(p.items.map((it, i) => [it.itemId, i]));
      for (const it of p.items) {
        for (const pre of prereqIds(content, it.itemId)) {
          const pi = pos.get(pre);
          if (pi !== undefined && pi > (pos.get(it.itemId) ?? 0)) bad.push(`${p.id}: ${pre} (#${pi}) after ${it.itemId} (#${pos.get(it.itemId)})`);
        }
      }
    }
    expect(bad, bad.join("\n")).toEqual([]);
  });
  it("cards sourceId resolves when present", () => {
    const bad = content.cards.filter((c) => c.sourceId && !allItemIds.has(c.sourceId)).map((c) => c.id);
    expect(bad).toEqual([]);
  });
  it("estHours is consistent with timeBucket", () => {
    const bad: string[] = [];
    for (const r of content.resources) {
      if (r.estHours === undefined) continue;
      const h = r.estHours;
      const ok = r.timeBucket === "ongoing" || (r.timeBucket === "lt_2h" && h < 2) || (r.timeBucket === "2_10h" && h >= 2 && h <= 10) || (r.timeBucket === "10_30h" && h >= 10 && h <= 30) || (r.timeBucket === "30_100h" && h >= 30 && h <= 100) || (r.timeBucket === "gt_100h" && h > 100);
      if (!ok) bad.push(`${r.id}: ${h}h vs ${r.timeBucket}`);
    }
    expect(bad, bad.join(", ")).toEqual([]);
  });
});

describe("content coverage (from the curriculum spec)", () => {
  const must = (id: string, set: Set<string>) => expect(set.has(id), `missing ${id}`).toBe(true);
  it("has the spec's named resources", () => {
    for (const id of [
      "t1-karpathy-zth", "t1-hf-llm-course", "t1-hf-agents", "t1-hf-smol", "t1-dlai-shortcourses", "t1-evals-course", "t1-hamel-evals-blog", "t1-langfuse", "t1-promptfoo", "t1-deepeval", "t1-ollama", "t1-vllm", "t1-claude-code",
      "t2-sysdesign-primer", "t2-ddia", "t2-bytebytego", "t2-fullstack", "t2-cloud-devops",
      "t3-momtest", "t3-inspired", "t3-continuous-discovery", "t3-lennys", "t3-lenny-course", "t3-reforge", "t3-aipm-khan", "t3-prototyping",
      "t4-fde-explainers", "t4-psc", "t4-demo2win", "t4-naase", "t4-wtse",
      "t5-founding-sales", "t5-obviously-awesome", "t5-sales-pitch", "t5-meddic", "t5-never-split", "t5-ciso-buying",
      "t6-yc-startup-school", "t6-yc-cofounder", "t6-andy-raskin", "t6-managers-path", "t6-first-round", "t6-saas-metrics", "t6-israeli-fundraising",
      "t7-owasp-llm", "t7-owasp-agentic", "t7-mitre-atlas", "t7-nist-airmf", "t7-owasp-redteam", "t7-gandalf", "t7-hackaprompt", "t7-htb-ai", "t7-spiffe", "t7-nhi-landscape", "t7-xbow", "t7-pentest-papers", "t7-aisoc", "t7-ros-ot", "t7-cyberweek", "t7-defensetech-week", "t7-cybertech",
      "t8-learning-public", "t8-pkm", "t8-deliberate-practice", "t8-accountability",
    ]) must(id, ids.resources);
  });
  it("has the 9 spec projects", () => {
    for (const id of ["p-secure-mcp-agent", "p-eval-harness", "p-ai-soc-triage", "p-autonomous-pentest", "p-nhi-prototype", "p-redteam-writeup", "p-fullstack-ai", "p-finetune-security", "p-reproduce-paper"]) must(id, ids.projects);
  });
  it("has the 9 spec drills", () => {
    for (const id of ["d-paper-week", "d-sysdesign-week", "d-tech-post-week", "d-demo-week", "d-customer-interview-week", "d-cold-outreach-day", "d-prd-rewrite", "d-ctf-week", "d-negotiation-roleplay"]) must(id, ids.drills);
  });
  it("has the four paths", () => {
    for (const id of ["path-primary", "path-variant-a", "path-variant-b", "path-variant-c"]) must(id, ids.paths);
    expect(content.paths.find((p) => p.id === "path-primary")?.phases.length).toBe(3);
  });
  it("has an assessment for every track", () => {
    for (const t of TRACK_IDS) expect(content.assessments.some((a) => a.trackId === t), `no assessment for ${t}`).toBe(true);
  });
  it("has a healthy volume of content", () => {
    expect(content.resources.length).toBeGreaterThanOrEqual(80);
    expect(content.cards.length).toBeGreaterThanOrEqual(100);
    expect(content.drills.filter((d) => d.kind === "workout").length).toBeGreaterThanOrEqual(6);
    for (const t of TRACK_IDS) expect(content.resources.filter((r) => r.trackIds.includes(t)).length, `track ${t} too thin`).toBeGreaterThanOrEqual(5);
  });
  it("dependency DAG from the spec is encoded", () => {
    const pre = (id: string) => prereqIds(content, id);
    expect(pre("p-finetune-security")).toEqual(expect.arrayContaining(["t1-karpathy-zth"]));
    expect(pre("p-secure-mcp-agent")).toEqual(expect.arrayContaining(["t1-hf-agents"]));
    expect(pre("p-nhi-prototype")).toEqual(expect.arrayContaining(["p-secure-mcp-agent"]));
    expect(pre("p-eval-harness").length).toBeGreaterThan(0);
    expect(pre("p-ai-soc-triage")).toEqual(expect.arrayContaining(["p-eval-harness"]));
    expect(pre("p-fullstack-ai")).toEqual(expect.arrayContaining(["t2-sysdesign-primer"]));
    expect(pre("p-redteam-writeup").some((x) => x.startsWith("t7-owasp") || x === "t7-mitre-atlas")).toBe(true);
  });
  it("strategy content is populated", () => {
    const s = content.strategy;
    expect(s.tldr.length).toBeGreaterThanOrEqual(3);
    expect(s.domains.length).toBe(4);
    expect(s.adjacentDomains.length).toBeGreaterThanOrEqual(6);
    expect(s.targetStartups.length).toBeGreaterThanOrEqual(10);
    expect(s.roleLadder.length).toBeGreaterThanOrEqual(4);
    expect(s.timeline.length).toBeGreaterThanOrEqual(5);
    expect(s.skillsPool.length).toBe(4);
    expect(s.recommendations.length).toBeGreaterThanOrEqual(5);
    expect(s.caveats.length).toBeGreaterThanOrEqual(5);
    expect(s.compensation.length).toBeGreaterThanOrEqual(3);
    expect(s.vcs.length).toBeGreaterThanOrEqual(2);
    expect(s.keyFindings.length).toBeGreaterThanOrEqual(4);
    expect(s.cofounderStrategy.length).toBeGreaterThanOrEqual(3);
  });
});
