// Achievements (badges) — pure.
import type { ContentBundle, ProgressEntry } from "@/types";
import { calcStreak } from "./streaks";

export interface Achievement { id: string; icon: string; name: string; desc: string; done: boolean }

export interface AchievementInput {
  bundle: ContentBundle;
  progress: Record<string, ProgressEntry>;
  completions: Record<string, number>;
  drillLog: Record<string, string[]>;
  pomoCount: number;
  notesCount: number;
  srsReviewed: number;
  paceAhead: boolean;
}

export function achievements(i: AchievementInput): Achievement[] {
  const { bundle, progress } = i;
  const doneIds = Object.values(progress).filter((p) => p.status === "done").map((p) => p.itemId);
  const done = doneIds.length;
  const resTotal = bundle.resources.length + bundle.projects.length;
  const resDone = doneIds.filter((id) => bundle.resources.some((r) => r.id === id) || bundle.projects.some((p) => p.id === id)).length;
  const overall = resTotal ? Math.round((resDone / resTotal) * 100) : 0;
  const streak = calcStreak(i.completions);
  const projectsDone = bundle.projects.filter((p) => progress[p.id]?.status === "done").length;
  const portfolioDone = bundle.projects.filter((p) => p.isPortfolioPiece && progress[p.id]?.status === "done").length;
  const labsDone = bundle.resources.filter((r) => (r.resourceType === "ctf" || r.resourceType === "interactive_lab") && progress[r.id]?.status === "done").length;
  const mustDo = bundle.resources.filter((r) => r.priority === "must_do");
  const mustDoDone = mustDo.filter((r) => progress[r.id]?.status === "done").length;
  const trackCleared = bundle.tracks.some((t) => {
    const ids = [...bundle.resources.filter((r) => r.trackIds.includes(t.id)).map((r) => r.id), ...bundle.projects.filter((p) => p.trackIds.includes(t.id)).map((p) => p.id)];
    return ids.length > 0 && ids.every((id) => progress[id]?.status === "done" || progress[id]?.status === "skipped");
  });
  const assessmentsDone = bundle.assessments.filter((a) => progress[a.id]?.status === "done").length;
  const drillLogs = Object.values(i.drillLog).reduce((a, l) => a + l.length, 0);
  const papers = (i.drillLog["d-paper-week"] ?? []).length;
  const posts = (i.drillLog["d-tech-post-week"] ?? []).length;
  const seedDone = bundle.projects.filter((p) => p.isStartupSeed && progress[p.id]?.status === "done").length;

  return [
    { id: "first", icon: "🌱", name: "First step", desc: "Complete your first item", done: done >= 1 },
    { id: "ten", icon: "🎯", name: "Getting going", desc: "10 items done", done: done >= 10 },
    { id: "twentyfive", icon: "🏗️", name: "Momentum", desc: "25 items done", done: done >= 25 },
    { id: "fifty", icon: "🚀", name: "Halfway hero", desc: "50% of the library complete", done: overall >= 50 },
    { id: "hundred", icon: "👑", name: "Champion", desc: "Finish the whole library", done: overall >= 100 },
    { id: "streak3", icon: "🔥", name: "On fire", desc: "3-day streak", done: streak >= 3 },
    { id: "streak7", icon: "💪", name: "Week warrior", desc: "7-day streak", done: streak >= 7 },
    { id: "streak14", icon: "⚡", name: "Unstoppable", desc: "14-day streak", done: streak >= 14 },
    { id: "streak30", icon: "🏆", name: "Legend", desc: "30-day streak", done: streak >= 30 },
    { id: "mustdo", icon: "🧭", name: "Canon", desc: "All must-do resources done", done: mustDo.length > 0 && mustDoDone >= mustDo.length },
    { id: "track", icon: "🏁", name: "Track cleared", desc: "Finish every item in a track", done: trackCleared },
    { id: "ship1", icon: "🚢", name: "Shipped", desc: "Finish your first project", done: projectsDone >= 1 },
    { id: "port3", icon: "✍️", name: "Portfolio", desc: "3 portfolio pieces published", done: portfolioDone >= 3 },
    { id: "seed", icon: "🌰", name: "Startup seed", desc: "Finish a startup-seed project", done: seedDone >= 1 },
    { id: "lab5", icon: "🧪", name: "Hands-on", desc: "5 labs or CTFs done", done: labsDone >= 5 },
    { id: "papers10", icon: "📄", name: "Paper trail", desc: "10 weekly paper summaries", done: papers >= 10 },
    { id: "posts5", icon: "📣", name: "Learning in public", desc: "5 technical posts published", done: posts >= 5 },
    { id: "drills25", icon: "🔁", name: "Habit builder", desc: "25 drill completions", done: drillLogs >= 25 },
    { id: "pomo10", icon: "⏱️", name: "Deep worker", desc: "10 focus sessions", done: i.pomoCount >= 10 },
    { id: "notes10", icon: "📓", name: "Writing to think", desc: "10 notes captured", done: i.notesCount >= 10 },
    { id: "srs100", icon: "🧠", name: "Recall", desc: "100 flashcard reviews", done: i.srsReviewed >= 100 },
    { id: "ready1", icon: "✅", name: "Ready when", desc: "Pass a track's readiness rubric", done: assessmentsDone >= 1 },
    { id: "ahead", icon: "🏇", name: "Ahead of plan", desc: "Get ahead of the schedule", done: i.paceAhead },
  ];
}
