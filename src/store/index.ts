// ============================================================================
// Forge — single persisted store (zustand + localStorage).
// Keep this file free of content imports; selectors that need content live in
// src/lib and take the bundle as an argument so they stay pure & testable.
// ============================================================================
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Note, ProgressEntry, ProgressItemType, ProgressStatus, RoleRelevance } from "@/types";
import { todayKey, nowIso } from "@/lib/dates";

export const STORAGE_KEY = "forge_v1";

export type Theme = "dark" | "light";

export interface SrsState {
  /** 0 = new. */
  reps: number;
  ease: number; // SM-2 ease factor, starts 2.5
  interval: number; // days
  due: string; // YYYY-MM-DD
  lapses: number;
  lastGrade?: number;
}

export interface PomodoroSettings {
  focus: number;
  short: number;
  long: number;
  rounds: number;
  sound: boolean;
}

export interface PomodoroState {
  mode: "focus" | "short" | "long";
  running: boolean;
  /** Absolute epoch ms when the current interval ends (null when paused). */
  endTime: number | null;
  /** Seconds remaining when paused. */
  remaining: number;
  round: number;
  taskId: string | null;
  taskTitle: string | null;
}

export interface Settings {
  name: string;
  theme: Theme;
  /** Program start date (Monday) — drives phase/week computations. */
  startDate: string;
  hoursPerWeek: number;
  activePathId: string;
  roleFilter: RoleRelevance | "all";
  dailyGoal: number;
  railOpen: boolean;
  navPinned: boolean;
  pomo: PomodoroSettings;
  /** Feed of newsletters/sites the user follows (for "staying current"). */
  freshnessCheckedAt?: string;
}

export interface UiState {
  libraryFilters: {
    q: string;
    tracks: string[];
    types: string[];
    cost: string[];
    difficulty: string[];
    priority: string[];
    time: string[];
    hideDone: boolean;
    onlyArtifacts: boolean;
  };
  expanded: Record<string, boolean>;
  collapsed: Record<string, boolean>;
  reviewDeck: string | "all";
  compassTab: string;
}

export interface ForgeState {
  version: number;
  progress: Record<string, ProgressEntry>;
  /** drillId -> ISO date keys (YYYY-MM-DD) when it was completed. */
  drillLog: Record<string, string[]>;
  /** date key -> number of items completed that day (for streaks/heatmap). */
  completions: Record<string, number>;
  notes: Note[];
  srs: Record<string, SrsState>;
  /** cardId -> flagged (needs edit / suspicious). */
  srsReviewedToday: Record<string, number>;
  settings: Settings;
  pomodoro: PomodoroState;
  pomoCount: number;
  ui: UiState;
  /** Achievement ids already celebrated (so we toast once). */
  celebrated: Record<string, boolean>;

  // ---- actions ----
  setStatus: (itemId: string, itemType: ProgressItemType, status: ProgressStatus) => void;
  toggleDone: (itemId: string, itemType: ProgressItemType) => void;
  setPercent: (itemId: string, itemType: ProgressItemType, percent: number) => void;
  logHours: (itemId: string, itemType: ProgressItemType, hours: number) => void;
  setLinks: (itemId: string, itemType: ProgressItemType, links: { label: string; url: string }[]) => void;
  toggleCriterion: (assessmentId: string, index: number, total: number) => void;
  logDrill: (drillId: string, dateKey?: string) => void;
  unlogDrill: (drillId: string, dateKey?: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => string;
  updateNote: (id: string, patch: Partial<Omit<Note, "id" | "createdAt">>) => void;
  deleteNote: (id: string) => void;
  gradeCard: (cardId: string, grade: 0 | 1 | 2 | 3, next: SrsState) => void;
  resetCard: (cardId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setPomodoro: (patch: Partial<PomodoroState>) => void;
  incPomoCount: () => void;
  setUi: (patch: Partial<UiState>) => void;
  setLibraryFilters: (patch: Partial<UiState["libraryFilters"]>) => void;
  toggleExpanded: (key: string) => void;
  toggleCollapsed: (key: string) => void;
  markCelebrated: (id: string) => void;
  importState: (data: unknown) => boolean;
  exportState: () => string;
  resetAll: () => void;
}

function mondayOf(d: Date): string {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
  const y = mon.getFullYear();
  const m = String(mon.getMonth() + 1).padStart(2, "0");
  const dd = String(mon.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function defaultSettings(): Settings {
  return {
    name: "Omer",
    theme: "dark",
    startDate: mondayOf(new Date()),
    hoursPerWeek: 12,
    activePathId: "path-primary",
    roleFilter: "all",
    dailyGoal: 2,
    railOpen: true,
    navPinned: false,
    pomo: { focus: 25, short: 5, long: 15, rounds: 4, sound: true },
  };
}

export function defaultPomodoro(): PomodoroState {
  return { mode: "focus", running: false, endTime: null, remaining: 25 * 60, round: 1, taskId: null, taskTitle: null };
}

export function defaultUi(): UiState {
  return {
    libraryFilters: { q: "", tracks: [], types: [], cost: [], difficulty: [], priority: [], time: [], hideDone: false, onlyArtifacts: false },
    expanded: {},
    collapsed: {},
    reviewDeck: "all",
    compassTab: "overview",
  };
}

export function defaultData() {
  return {
    version: 1,
    progress: {} as Record<string, ProgressEntry>,
    drillLog: {} as Record<string, string[]>,
    completions: {} as Record<string, number>,
    notes: [] as Note[],
    srs: {} as Record<string, SrsState>,
    srsReviewedToday: {} as Record<string, number>,
    settings: defaultSettings(),
    pomodoro: defaultPomodoro(),
    pomoCount: 0,
    ui: defaultUi(),
    celebrated: {} as Record<string, boolean>,
  };
}

let idCounter = 0;
export function uid(prefix = "n"): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const PERSIST_KEYS: (keyof ForgeState)[] = [
  "version", "progress", "drillLog", "completions", "notes", "srs", "srsReviewedToday",
  "settings", "pomodoro", "pomoCount", "ui", "celebrated",
];

function bumpCompletion(completions: Record<string, number>, delta: number, key = todayKey()) {
  const next = { ...completions };
  const v = (next[key] ?? 0) + delta;
  if (v <= 0) delete next[key]; else next[key] = v;
  return next;
}

export const useForge = create<ForgeState>()(
  persist(
    (set, get) => ({
      ...defaultData(),

      setStatus: (itemId, itemType, status) =>
        set((s) => {
          const prev = s.progress[itemId];
          const wasDone = prev?.status === "done";
          const isDone = status === "done";
          const entry: ProgressEntry = {
            ...(prev ?? { itemId, itemType }),
            itemId, itemType, status,
            percentComplete: isDone ? 100 : prev?.percentComplete ?? (status === "in_progress" ? Math.max(prev?.percentComplete ?? 0, 1) : 0),
            updatedAt: nowIso(),
          };
          let completions = s.completions;
          if (isDone && !wasDone) completions = bumpCompletion(completions, +1);
          if (!isDone && wasDone) completions = bumpCompletion(completions, -1);
          return { progress: { ...s.progress, [itemId]: entry }, completions };
        }),

      toggleDone: (itemId, itemType) => {
        const cur = get().progress[itemId]?.status;
        get().setStatus(itemId, itemType, cur === "done" ? "todo" : "done");
      },

      setPercent: (itemId, itemType, percent) =>
        set((s) => {
          const p = Math.max(0, Math.min(100, Math.round(percent)));
          const prev = s.progress[itemId];
          const status: ProgressStatus = p >= 100 ? "done" : p > 0 ? "in_progress" : prev?.status === "skipped" ? "skipped" : "todo";
          const wasDone = prev?.status === "done";
          let completions = s.completions;
          if (status === "done" && !wasDone) completions = bumpCompletion(completions, +1);
          if (status !== "done" && wasDone) completions = bumpCompletion(completions, -1);
          return {
            progress: { ...s.progress, [itemId]: { ...(prev ?? { itemId, itemType }), itemId, itemType, status, percentComplete: p, updatedAt: nowIso() } },
            completions,
          };
        }),

      logHours: (itemId, itemType, hours) =>
        set((s) => {
          const prev = s.progress[itemId];
          const h = Math.max(0, (prev?.hoursLogged ?? 0) + hours);
          const status = prev?.status ?? (h > 0 ? "in_progress" : "todo");
          return { progress: { ...s.progress, [itemId]: { ...(prev ?? { itemId, itemType }), itemId, itemType, status, hoursLogged: Math.round(h * 100) / 100, updatedAt: nowIso() } } };
        }),

      setLinks: (itemId, itemType, links) =>
        set((s) => {
          const prev = s.progress[itemId];
          return { progress: { ...s.progress, [itemId]: { ...(prev ?? { itemId, itemType, status: "todo" as ProgressStatus }), itemId, itemType, links, updatedAt: nowIso() } } };
        }),

      toggleCriterion: (assessmentId, index, total) =>
        set((s) => {
          const prev = s.progress[assessmentId];
          const cur = new Set(prev?.criteriaDone ?? []);
          if (cur.has(index)) cur.delete(index); else cur.add(index);
          const done = [...cur].sort((a, b) => a - b);
          const p = total > 0 ? Math.round((done.length / total) * 100) : 0;
          const status: ProgressStatus = p >= 100 ? "done" : p > 0 ? "in_progress" : "todo";
          const wasDone = prev?.status === "done";
          let completions = s.completions;
          if (status === "done" && !wasDone) completions = bumpCompletion(completions, +1);
          if (status !== "done" && wasDone) completions = bumpCompletion(completions, -1);
          return {
            progress: { ...s.progress, [assessmentId]: { ...(prev ?? { itemId: assessmentId, itemType: "assessment" as const }), itemId: assessmentId, itemType: "assessment", status, percentComplete: p, criteriaDone: done, updatedAt: nowIso() } },
            completions,
          };
        }),

      logDrill: (drillId, dateKey = todayKey()) =>
        set((s) => {
          const list = s.drillLog[drillId] ?? [];
          if (list.includes(dateKey)) return {};
          return { drillLog: { ...s.drillLog, [drillId]: [...list, dateKey].sort() }, completions: bumpCompletion(s.completions, +1, dateKey) };
        }),

      unlogDrill: (drillId, dateKey = todayKey()) =>
        set((s) => {
          const list = s.drillLog[drillId] ?? [];
          if (!list.includes(dateKey)) return {};
          return { drillLog: { ...s.drillLog, [drillId]: list.filter((d) => d !== dateKey) }, completions: bumpCompletion(s.completions, -1, dateKey) };
        }),

      addNote: (note) => {
        const id = uid("note");
        const ts = nowIso();
        set((s) => ({ notes: [{ ...note, id, createdAt: ts, updatedAt: ts }, ...s.notes] }));
        return id;
      },
      updateNote: (id, patch) => set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: nowIso() } : n)) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      gradeCard: (cardId, grade, next) =>
        set((s) => ({
          srs: { ...s.srs, [cardId]: { ...next, lastGrade: grade } },
          srsReviewedToday: { ...s.srsReviewedToday, [todayKey()]: (s.srsReviewedToday[todayKey()] ?? 0) + 1 },
        })),
      resetCard: (cardId) => set((s) => { const srs = { ...s.srs }; delete srs[cardId]; return { srs }; }),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch, pomo: { ...s.settings.pomo, ...(patch.pomo ?? {}) } } })),
      setPomodoro: (patch) => set((s) => ({ pomodoro: { ...s.pomodoro, ...patch } })),
      incPomoCount: () => set((s) => ({ pomoCount: s.pomoCount + 1 })),
      setUi: (patch) => set((s) => ({ ui: { ...s.ui, ...patch } })),
      setLibraryFilters: (patch) => set((s) => ({ ui: { ...s.ui, libraryFilters: { ...s.ui.libraryFilters, ...patch } } })),
      toggleExpanded: (key) => set((s) => ({ ui: { ...s.ui, expanded: { ...s.ui.expanded, [key]: !s.ui.expanded[key] } } })),
      toggleCollapsed: (key) => set((s) => ({ ui: { ...s.ui, collapsed: { ...s.ui.collapsed, [key]: !s.ui.collapsed[key] } } })),
      markCelebrated: (id) => set((s) => ({ celebrated: { ...s.celebrated, [id]: true } })),

      importState: (data) => {
        if (!data || typeof data !== "object") return false;
        const d = data as Partial<ForgeState>;
        if (!d.progress || typeof d.progress !== "object") return false;
        const base = defaultData();
        set({
          ...base,
          progress: d.progress ?? {},
          drillLog: d.drillLog ?? {},
          completions: d.completions ?? {},
          notes: Array.isArray(d.notes) ? d.notes : [],
          srs: d.srs ?? {},
          srsReviewedToday: d.srsReviewedToday ?? {},
          settings: { ...base.settings, ...(d.settings ?? {}), pomo: { ...base.settings.pomo, ...(d.settings?.pomo ?? {}) } },
          pomodoro: { ...base.pomodoro, ...(d.pomodoro ?? {}), running: false, endTime: null },
          pomoCount: typeof d.pomoCount === "number" ? d.pomoCount : 0,
          ui: { ...base.ui, ...(d.ui ?? {}), libraryFilters: { ...base.ui.libraryFilters, ...(d.ui?.libraryFilters ?? {}) } },
          celebrated: d.celebrated ?? {},
        });
        return true;
      },

      exportState: () => {
        const s = get();
        const out: Record<string, unknown> = {};
        for (const k of PERSIST_KEYS) out[k] = s[k];
        out.exportedAt = nowIso();
        return JSON.stringify(out, null, 2);
      },

      resetAll: () => set({ ...defaultData() }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const out: Record<string, unknown> = {};
        for (const k of PERSIST_KEYS) out[k] = s[k];
        return out as Partial<ForgeState>;
      },
    },
  ),
);

// Convenience selectors --------------------------------------------------------
export const isDone = (progress: Record<string, ProgressEntry>, id: string) => progress[id]?.status === "done";
export const statusOf = (progress: Record<string, ProgressEntry>, id: string): ProgressStatus => progress[id]?.status ?? "todo";
