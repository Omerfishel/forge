// ============================================================================
// Forge — core data model. This is the contract every data file and feature
// module must follow. IDs use track-prefixed slugs (e.g. "t1-karpathy-zth").
// ============================================================================

export type TrackId =
  | "T1_AI_ML"
  | "T2_BACKEND_SYSTEMS"
  | "T3_PRODUCT"
  | "T4_FDE_SE"
  | "T5_SALES_GTM"
  | "T6_FOUNDER"
  | "T7_DOMAIN"
  | "T8_META";

export const TRACK_IDS: TrackId[] = [
  "T1_AI_ML",
  "T2_BACKEND_SYSTEMS",
  "T3_PRODUCT",
  "T4_FDE_SE",
  "T5_SALES_GTM",
  "T6_FOUNDER",
  "T7_DOMAIN",
  "T8_META",
];

export type ResourceType =
  | "course"
  | "video"
  | "book"
  | "article"
  | "paper"
  | "podcast"
  | "newsletter"
  | "interactive_lab"
  | "ctf"
  | "tutorial"
  | "repo"
  | "tool"
  | "community"
  | "conference"
  | "certification"
  | "template"
  | "worksheet"
  | "framework";

export type Format =
  | "self_paced"
  | "cohort"
  | "book"
  | "video_series"
  | "hands_on_lab"
  | "reading"
  | "event"
  | "tool";

export type Difficulty = "foundational" | "intermediate" | "advanced";
export type Priority = "must_do" | "high" | "optional" | "skip_unless_relevant";
export type CostModel = "free" | "one_time" | "subscription" | "freemium";
export type RoleRelevance = "PM" | "FDE" | "SE" | "Developer" | "CTO" | "CEO";
export type TimeBucket = "lt_2h" | "2_10h" | "10_30h" | "30_100h" | "gt_100h" | "ongoing";
export type Freshness = "current" | "aging" | "stale" | "unknown";

export const ROLES: RoleRelevance[] = ["PM", "FDE", "SE", "Developer", "CTO", "CEO"];
export const DIFFICULTIES: Difficulty[] = ["foundational", "intermediate", "advanced"];
export const PRIORITIES: Priority[] = ["must_do", "high", "optional", "skip_unless_relevant"];
export const COST_MODELS: CostModel[] = ["free", "one_time", "subscription", "freemium"];
export const TIME_BUCKETS: TimeBucket[] = ["lt_2h", "2_10h", "10_30h", "30_100h", "gt_100h", "ongoing"];

export interface Cost {
  model: CostModel;
  amount?: number;
  currency?: string;
  note?: string;
  /** ID of a free substitute resource, when one exists (used by the Budget view). */
  freeAlternativeId?: string;
}

export interface Resource {
  id: string;
  title: string;
  creator: string;
  url: string;
  urlVerified: boolean;
  urlVerifiedDate: string; // ISO date (YYYY-MM-DD)
  resourceType: ResourceType;
  format: Format;
  cost: Cost;
  estHours?: number;
  timeBucket: TimeBucket;
  difficulty: Difficulty;
  /** Resource IDs (preferred) or free text prerequisites. */
  prerequisites: string[];
  buildsSkill: string;
  whyForHim: string;
  priority: Priority;
  producesArtifact: boolean;
  trackIds: TrackId[];
  skillIds: string[];
  roleRelevance: RoleRelevance[];
  tags: string[];
  freshness: Freshness;
  qualitySignal: string;
  /** Optional longer notes / caveats / flags from the research (e.g. price unverified). */
  notes?: string;
  /** Optional sub-links (e.g. specific short courses within a catalog). */
  links?: { label: string; url: string }[];
}

export interface Skill {
  id: string;
  trackId: TrackId;
  name: string;
  description: string;
  parentSkillId?: string;
}

export interface Track {
  id: TrackId;
  /** Short code used in badges, e.g. "T1". */
  code: string;
  name: string;
  goal: string;
  /** Long-form description of why this track matters for him. */
  why: string;
  skillIds: string[];
  priorityRank: number; // 1 = highest
  /** CSS color token for this track (hex). */
  color: string;
  icon: string;
  /** "Ready when" statement, mirrored in the assessments data. */
  readyWhen: string;
}

export interface Project {
  id: string;
  title: string;
  trackIds: TrackId[];
  goal: string;
  steps: string[];
  stack: string[];
  difficulty: Difficulty;
  estHours: number;
  proves: string;
  publishAs: string;
  isPortfolioPiece: boolean;
  isStartupSeed: boolean;
  relatedResourceIds: string[];
  /** Project or resource IDs that should be done first (dependency DAG). */
  prerequisites: string[];
  roleRelevance: RoleRelevance[];
  tags: string[];
  /** Ethical / scope caveats (e.g. authorized targets only). */
  caveats?: string;
}

export type Cadence = "daily" | "weekly" | "biweekly" | "monthly";
export type SoloOrPartner = "solo" | "ai_roleplay" | "partner" | "group";

export interface Drill {
  id: string;
  title: string;
  trackIds: TrackId[];
  cadence: Cadence;
  description: string;
  estMinutes: number;
  soloOrPartner: SoloOrPartner;
  streakable: boolean;
  tags: string[];
  /** Only active during these path phases (1..3). Empty = always. */
  phases?: (1 | 2 | 3)[];
  /** Kind of drill: recurring habit vs. soft-skill workout script. */
  kind: "habit" | "workout";
  /** For workouts: a prompt/script to run the roleplay with an AI or partner. */
  script?: string;
}

export type AssessmentType = "rubric" | "checkpoint" | "self_test" | "public_proof";

export interface Assessment {
  id: string;
  trackId: TrackId;
  type: AssessmentType;
  title: string;
  readyWhen: string;
  questions?: string[];
  /** Rubric criteria the user ticks off. */
  criteria: string[];
  /** What counts as public proof (e.g. a published write-up). */
  publicProof?: string;
  tags: string[];
}

export type PathItemType = "resource" | "project" | "drill" | "milestone" | "assessment";

export interface PathItem {
  itemId: string;
  itemType: PathItemType;
  phase: 1 | 2 | 3;
  /** Short reason this item sits at this point in the sequence. */
  note?: string;
}

export interface Milestone {
  id: string;
  pathId: string;
  phase: 1 | 2 | 3;
  title: string;
  targetWeek: number;
  criteria: string;
  dependsOn: string[]; // item IDs
}

export interface PathPhase {
  phase: 1 | 2 | 3;
  title: string;
  /** Inclusive month range, e.g. [0,3]. */
  months: [number, number];
  summary: string;
}

export interface Path {
  id: string;
  name: string;
  durationMonths: number;
  hoursPerWeek: number;
  phases: PathPhase[];
  items: PathItem[];
  variantOf?: string;
  description: string;
  /** Expected outcome statement. */
  output: string;
}

export interface Note {
  id: string;
  resourceId?: string;
  projectId?: string;
  /** Free-form link to any other item (drill, assessment, strategy card). */
  itemId?: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type ProgressStatus = "todo" | "in_progress" | "done" | "skipped";
export type ProgressItemType = "resource" | "project" | "drill" | "milestone" | "assessment";

export interface ProgressEntry {
  itemId: string;
  itemType: ProgressItemType;
  status: ProgressStatus;
  percentComplete?: number;
  hoursLogged?: number;
  updatedAt: string;
  /** Publish links for projects (repo / blog / demo). */
  links?: { label: string; url: string }[];
  /** Rubric criteria ticked (assessments). */
  criteriaDone?: number[];
}

export interface Tag {
  id: string;
  label: string;
  category: "skill" | "role" | "difficulty" | "cost" | "time" | "priority" | "domain";
}

// ---------------------------------------------------------------------------
// Spaced-repetition cards (Anki-style deck)
// ---------------------------------------------------------------------------
export interface Card {
  id: string;
  deck: string; // e.g. "system_design", "transformers", "evals", "agent_security"
  front: string;
  back: string;
  trackIds: TrackId[];
  tags: string[];
  /** Source resource id, when derived from one. */
  sourceId?: string;
}

// ---------------------------------------------------------------------------
// Strategy ("Compass") content — from the 5-year plan document
// ---------------------------------------------------------------------------
export type DomainFit = "strongest" | "strong" | "selective" | "weak";

export interface DomainSubLane {
  id: string;
  name: string;
  examples: string[];
  bet: string; // 2028–29 bet
  note?: string;
}

export interface Domain {
  id: string;
  name: string;
  fit: DomainFit;
  verdict: string;
  subLanes: DomainSubLane[];
  /** Why it fits / doesn't fit him. */
  fitRationale: string;
}

export interface AdjacentDomain {
  id: string;
  rank: number;
  name: string;
  rationale: string;
  examples?: string[];
}

export type StartupStage = "watch" | "true_early" | "seed" | "series_a_plus";

export interface TargetStartup {
  id: string;
  name: string;
  domain: string;
  funding: string;
  investors: string;
  signals: string[]; // e.g. "8200", "hiring FDE"
  stage: StartupStage;
  fitNote: string;
  isBestMatch?: boolean;
  caveat?: string;
}

export interface RoleLadderStep {
  id: string;
  horizon: string; // "Now", "1–2 yrs", ...
  title: string;
  detail: string;
  fallback?: string;
}

export interface TimelineStep {
  id: string;
  horizon: string;
  items: string[];
}

export interface SkillsPoolGroup {
  id: string;
  title: string;
  kind: "all" | "have" | "want" | "cofounder";
  skills: string[];
}

export interface StrategyRecommendation {
  id: string;
  stage: string; // "Now → this month"
  action: string;
  threshold: string;
}

export interface CompStat {
  id: string;
  label: string;
  value: string;
  source: string;
}

export interface Caveat {
  id: string;
  text: string;
}

export interface KeyFinding {
  id: string;
  title: string;
  body: string;
}

export interface Strategy {
  tldr: string[];
  keyFindings: KeyFinding[];
  domains: Domain[];
  adjacentDomains: AdjacentDomain[];
  roleLadder: RoleLadderStep[];
  roleStrategy: KeyFinding[];
  timeline: TimelineStep[];
  skillsPool: SkillsPoolGroup[];
  targetStartups: TargetStartup[];
  cofounderStrategy: string[];
  compensation: CompStat[];
  vcs: { tier: string; names: string[] }[];
  recommendations: StrategyRecommendation[];
  caveats: Caveat[];
}

// ---------------------------------------------------------------------------
// Aggregate content bundle (what src/data/index.ts exports)
// ---------------------------------------------------------------------------
export interface ContentBundle {
  tracks: Track[];
  skills: Skill[];
  resources: Resource[];
  projects: Project[];
  drills: Drill[];
  assessments: Assessment[];
  paths: Path[];
  milestones: Milestone[];
  cards: Card[];
  tags: Tag[];
  strategy: Strategy;
  meta: { generated: string; sourceDocs: string[]; version: string };
}
