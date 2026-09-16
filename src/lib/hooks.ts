// Shared hooks that bind the content bundle to the store. Features should use
// these instead of recomputing plan logic.
import { useEffect, useMemo, useState } from "react";
import { content } from "@/data";
import { useForge } from "@/store";
import { activePath, overallStats, paceInfo, trackStats, weekPlan } from "./plan";
import { calcStreak } from "./streaks";
import { todayKey } from "./dates";
import type { TrackId } from "@/types";

export function useContent() {
  return content;
}

/** Re-renders at local midnight so "today" stays correct in long sessions. */
export function useToday(): string {
  const [key, setKey] = useState(todayKey());
  useEffect(() => {
    const id = window.setInterval(() => { const k = todayKey(); setKey((prev) => (prev === k ? prev : k)); }, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return key;
}

export function usePlan() {
  const progress = useForge((s) => s.progress);
  const drillLog = useForge((s) => s.drillLog);
  const srs = useForge((s) => s.srs);
  const settings = useForge((s) => s.settings);
  const today = useToday();
  return useMemo(
    () => weekPlan(content, { pathId: settings.activePathId, startDate: settings.startDate, hoursPerWeek: settings.hoursPerWeek, progress, drillLog, srs }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress, drillLog, srs, settings.activePathId, settings.startDate, settings.hoursPerWeek, today],
  );
}

export function usePace() {
  const progress = useForge((s) => s.progress);
  const settings = useForge((s) => s.settings);
  const today = useToday();
  return useMemo(() => paceInfo(content, activePath(content, settings.activePathId), progress, settings.startDate), [progress, settings.activePathId, settings.startDate, today]);
}

export function useOverall() {
  const progress = useForge((s) => s.progress);
  return useMemo(() => overallStats(content, progress), [progress]);
}

export function useStreak() {
  const completions = useForge((s) => s.completions);
  const today = useToday();
  return useMemo(() => calcStreak(completions, today), [completions, today]);
}

export function useTrackStats(trackId: TrackId) {
  const progress = useForge((s) => s.progress);
  const roleFilter = useForge((s) => s.settings.roleFilter);
  return useMemo(() => trackStats(content, progress, trackId, roleFilter), [progress, trackId, roleFilter]);
}

export function useActivePath() {
  const pathId = useForge((s) => s.settings.activePathId);
  return useMemo(() => activePath(content, pathId), [pathId]);
}

/**
 * Persisted open/closed state for a collapsible section. `defaultOpen` applies
 * until the user toggles it; the toggle always flips the *current* state.
 */
export function useOpen(key: string, defaultOpen: boolean): [boolean, () => void] {
  const stored = useForge((s) => s.ui.collapsed[key]);
  const setCollapsed = useForge((s) => s.setCollapsed);
  const open = stored === undefined ? defaultOpen : !stored;
  return [open, () => setCollapsed(key, open)];
}
