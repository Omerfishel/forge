// Human labels + icons for enums. Keep every display string in one place.
import type { CostModel, Difficulty, Freshness, Priority, ResourceType, RoleRelevance, TimeBucket, TrackId, ProgressStatus, Cadence } from "@/types";

export const TIME_LABEL: Record<TimeBucket, string> = {
  lt_2h: "< 2h", "2_10h": "2–10h", "10_30h": "10–30h", "30_100h": "30–100h", gt_100h: "100h+", ongoing: "ongoing",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  must_do: "Must do", high: "High", optional: "Optional", skip_unless_relevant: "Skip unless relevant",
};
export const PRIORITY_CLASS: Record<Priority, string> = { must_do: "must", high: "high", optional: "type", skip_unless_relevant: "bad" };
export const PRIORITY_ORDER: Record<Priority, number> = { must_do: 0, high: 1, optional: 2, skip_unless_relevant: 3 };

export const COST_LABEL: Record<CostModel, string> = { free: "Free", one_time: "One-time", subscription: "Subscription", freemium: "Freemium" };

export const DIFF_LABEL: Record<Difficulty, string> = { foundational: "Foundational", intermediate: "Intermediate", advanced: "Advanced" };
export const DIFF_LEVEL: Record<Difficulty, number> = { foundational: 1, intermediate: 2, advanced: 3 };

export const FRESH_LABEL: Record<Freshness, string> = { current: "Current", aging: "Aging", stale: "Stale", unknown: "Unknown" };
export const FRESH_CLASS: Record<Freshness, string> = { current: "ok", aging: "high", stale: "bad", unknown: "type" };

export const TYPE_ICON: Record<ResourceType, string> = {
  course: "🎓", video: "🎬", book: "📖", article: "📰", paper: "📄", podcast: "🎙️", newsletter: "✉️",
  interactive_lab: "🧪", ctf: "🚩", tutorial: "🧭", repo: "🗂️", tool: "🛠️", community: "👥", conference: "🎤",
  certification: "🎖️", template: "📋", worksheet: "📝", framework: "🧱",
};
export const TYPE_LABEL: Record<ResourceType, string> = {
  course: "Course", video: "Video", book: "Book", article: "Article", paper: "Paper", podcast: "Podcast", newsletter: "Newsletter",
  interactive_lab: "Lab", ctf: "CTF", tutorial: "Tutorial", repo: "Repo", tool: "Tool", community: "Community", conference: "Conference",
  certification: "Certification", template: "Template", worksheet: "Worksheet", framework: "Framework",
};

export const ROLE_LABEL: Record<RoleRelevance, string> = { PM: "PM", FDE: "FDE", SE: "SE", Developer: "Dev", CTO: "CTO", CEO: "CEO" };

export const STATUS_LABEL: Record<ProgressStatus, string> = { todo: "To do", in_progress: "In progress", done: "Done", skipped: "Skipped" };
export const STATUS_ICON: Record<ProgressStatus, string> = { todo: "○", in_progress: "◐", done: "●", skipped: "⊘" };

export const CADENCE_LABEL: Record<Cadence, string> = { daily: "Daily", weekly: "Weekly", biweekly: "Every 2 weeks", monthly: "Monthly" };

export const TRACK_VAR: Record<TrackId, string> = {
  T1_AI_ML: "--t1", T2_BACKEND_SYSTEMS: "--t2", T3_PRODUCT: "--t3", T4_FDE_SE: "--t4",
  T5_SALES_GTM: "--t5", T6_FOUNDER: "--t6", T7_DOMAIN: "--t7", T8_META: "--t8",
};

export function trackColorVar(trackId: TrackId): string {
  return `var(${TRACK_VAR[trackId]})`;
}

export function fmtHours(h: number | undefined): string {
  if (h === undefined || h === null) return "—";
  if (h >= 100) return `${Math.round(h)}h`;
  return `${Math.round(h * 10) / 10}h`;
}

export function fmtUsd(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return `$${n.toLocaleString("en-US")}`;
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
