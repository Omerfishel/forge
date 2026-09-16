// Shared constants + tiny helpers for the Compass view (strategy from the
// five-year plan). Display strings for the strategy enums live here because
// they are only used by this feature.
import type { DomainFit, StartupStage, SkillsPoolGroup } from "@/types";

export const TABS = [
  { key: "overview", label: "Overview" },
  { key: "domains", label: "Domains" },
  { key: "roles", label: "Roles" },
  { key: "startups", label: "Startups" },
  { key: "timeline", label: "Timeline" },
  { key: "skills", label: "Skills" },
  { key: "money", label: "Money" },
  { key: "playbook", label: "Playbook" },
  { key: "caveats", label: "Caveats" },
] as const;

export type CompassTab = (typeof TABS)[number]["key"];

export function isCompassTab(v: unknown): v is CompassTab {
  return typeof v === "string" && TABS.some((t) => t.key === v);
}

// ---- domains ---------------------------------------------------------------
export const FIT_KIND: Record<DomainFit, string> = { strongest: "ok", strong: "info", selective: "high", weak: "bad" };
export const FIT_LABEL: Record<DomainFit, string> = { strongest: "Strongest fit", strong: "Strong fit", selective: "Selective fit", weak: "Weak fit" };
export const FIT_ORDER: Record<DomainFit, number> = { strongest: 0, strong: 1, selective: 2, weak: 3 };
/** CSS colour token used for the card stripe. */
export const FIT_COLOR: Record<DomainFit, string> = { strongest: "var(--ok)", strong: "var(--info)", selective: "var(--acc)", weak: "var(--bad)" };

// ---- startups --------------------------------------------------------------
export type StageFilter = StartupStage | "all";
export const STAGE_FILTERS: StageFilter[] = ["all", "true_early", "seed", "series_a_plus", "watch"];
export const STAGE_LABEL: Record<StageFilter, string> = { all: "All stages", true_early: "True early", seed: "Seed", series_a_plus: "Series A+", watch: "Watch" };
export const STAGE_KIND: Record<StartupStage, string> = { true_early: "seed", seed: "ok", series_a_plus: "info", watch: "type" };

export function is8200(signal: string): boolean {
  return /8200/.test(signal);
}

/** Badge style for a startup signal string. */
export function signalKind(signal: string): string {
  const s = signal.toLowerCase();
  if (is8200(s)) return "high";
  if (s.includes("hiring")) return "ok";
  if (s.includes("early") || s.includes("watch")) return "seed";
  return "type";
}

// ---- skills ----------------------------------------------------------------
export const SKILL_KIND: Record<SkillsPoolGroup["kind"], string> = { all: "type", have: "ok", want: "high", cofounder: "seed" };
export const SKILL_HINT: Record<SkillsPoolGroup["kind"], string> = {
  all: "The full core-team / future CTO-CPO toolkit.",
  have: "Already in hand — lean on these in interviews.",
  want: "Close these yourself over 12–24 months.",
  cofounder: "Do not try to close these — find them in a co-founder.",
};

// ---- playbook --------------------------------------------------------------
/** The data sometimes repeats the "Threshold…:" label inside the text; strip it so the UI label is not doubled. */
export function stripThresholdPrefix(text: string): string {
  return text.replace(/^\s*threshold(?:\s+to\s+[a-z ]+?)?\s*:\s*/i, "");
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
