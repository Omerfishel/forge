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
  /** True while the library search was preset by a deep link (cleared when opened from the nav). */
  libQFromLink?: boolean;
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
  /** Resource ids the user plans to buy (Budget view) — separate from learning status. */
  planned: Record<string, boolean>;

  // ---- actions ----
  setStatus: (itemId: string, itemType: ProgressItemType, status: ProgressStatus) => void;
  toggleDone: (itemId: string, itemType: ProgressItemType) => void;
  setPercent: (itemId: string, itemType: ProgressItemType, percent: number) => void;
  logHours: (itemId: string, itemType: ProgressItemType, hours: number) => void;
  setLinks: (itemId: string, itemType: ProgressItemType, links: { label: string; url: string }[]) => void;
  /** Tick/untick one checklist item (assessment rubric criterion or project step); percent = done/total. */
  toggleCriterion: (itemId: string, index: number, total: number, itemType?: ProgressItemType) => void;
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
  /** Explicitly set a collapsible section closed (true) or open (false). */
  setCollapsed: (key: string, collapsed: boolean) => void;
  markCelebrated: (id: string) => void;
  togglePlanned: (resourceId: string) => void;
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
    planned: {} as Record<string, boolean>,
  };
}

let idCounter = 0;
export function uid(prefix = "n"): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const PERSIST_KEYS: (keyof ForgeState)[] = [
  "version", "progress", "drillLog", "completions", "notes", "srs", "srsReviewedToday",
  "settings", "pomodoro", "pomoCount", "ui", "celebrated", "planned",
];

function bumpCompletion(completions: Record<string, number>, delta: number, key = todayKey()) {
  const next = { ...completions };
  const v = (next[key] ?? 0) + delta;
  if (v <= 0) delete next[key]; else next[key] = v;
  return next;
}

// ---------------------------------------------------------------------------
// Import sanitising: a backup is untrusted JSON. Keep only well-typed values.
// ---------------------------------------------------------------------------
const STATUSES: ProgressStatus[] = ["todo", "in_progress", "done", "skipped"];
const ITEM_TYPES: ProgressItemType[] = ["resource", "project", "drill", "milestone", "assessment"];
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const isDateKey = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const num = (v: unknown, fallback: number, min = -Infinity, max = Infinity) => { const n = typeof v === "number" ? v : Number(v); return Number.isFinite(n) && n >= min && n <= max ? n : fallback; };
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

export function sanitizeImport(data: unknown): Partial<ForgeState> | null {
  if (!isObj(data)) return null;
  const hasAny = ["progress", "notes", "drillLog", "settings", "srs", "completions"].some((k) => k in data);
  if (!hasAny) return null;
  const base = defaultData();
  const progress: Record<string, ProgressEntry> = {};
  if (isObj(data.progress)) for (const [id, raw] of Object.entries(data.progress)) {
    if (!isObj(raw)) continue;
    const status = STATUSES.includes(raw.status as ProgressStatus) ? (raw.status as ProgressStatus) : "todo";
    const itemType = ITEM_TYPES.includes(raw.itemType as ProgressItemType) ? (raw.itemType as ProgressItemType) : "resource";
    const e: ProgressEntry = { itemId: id, itemType, status, updatedAt: str(raw.updatedAt, nowIso()) };
    if (raw.percentComplete !== undefined) e.percentComplete = num(raw.percentComplete, 0, 0, 100);
    if (raw.hoursLogged !== undefined) e.hoursLogged = num(raw.hoursLogged, 0, 0, 100000);
    if (Array.isArray(raw.links)) e.links = raw.links.filter(isObj).map((l) => ({ label: str(l.label), url: str(l.url) })).filter((l) => l.label && l.url);
    if (Array.isArray(raw.criteriaDone)) e.criteriaDone = raw.criteriaDone.map((n) => num(n, -1, 0, 999)).filter((n) => n >= 0);
    progress[id] = e;
  }
  const drillLog: Record<string, string[]> = {};
  if (isObj(data.drillLog)) for (const [id, list] of Object.entries(data.drillLog)) if (Array.isArray(list)) drillLog[id] = Array.from(new Set(list.filter(isDateKey))).sort();
  const completions: Record<string, number> = {};
  if (isObj(data.completions)) for (const [k, v] of Object.entries(data.completions)) if (isDateKey(k)) { const n = num(v, 0, 0, 10000); if (n > 0) completions[k] = Math.round(n); }
  const notes: Note[] = Array.isArray(data.notes) ? data.notes.filter(isObj).map((n) => ({
    id: str(n.id) || uid("note"), title: str(n.title), body: str(n.body), createdAt: str(n.createdAt, nowIso()), updatedAt: str(n.updatedAt, nowIso()),
    tags: Array.isArray(n.tags) ? n.tags.filter((t): t is string => typeof t === "string") : [],
    resourceId: typeof n.resourceId === "string" ? n.resourceId : undefined, projectId: typeof n.projectId === "string" ? n.projectId : undefined, itemId: typeof n.itemId === "string" ? n.itemId : undefined,
  })) : [];
  const srs: Record<string, SrsState> = {};
  if (isObj(data.srs)) for (const [id, raw] of Object.entries(data.srs)) if (isObj(raw) && isDateKey(raw.due)) srs[id] = { reps: num(raw.reps, 0, 0, 10000), ease: num(raw.ease, 2.5, 1.3, 10), interval: num(raw.interval, 0, 0, 100000), due: raw.due, lapses: num(raw.lapses, 0, 0, 10000), lastGrade: raw.lastGrade === undefined ? undefined : num(raw.lastGrade, 0, 0, 3) };
  const srsReviewedToday: Record<string, number> = {};
  if (isObj(data.srsReviewedToday)) for (const [k, v] of Object.entries(data.srsReviewedToday)) if (isDateKey(k)) srsReviewedToday[k] = Math.round(num(v, 0, 0, 100000));
  const ds = isObj(data.settings) ? data.settings : {};
  const dp = isObj(ds.pomo) ? ds.pomo : {};
  const ROLES_ALL = ["all", "PM", "FDE", "SE", "Developer", "CTO", "CEO"];
  const settings: Settings = {
    name: str(ds.name, base.settings.name),
    theme: ds.theme === "light" ? "light" : "dark",
    startDate: isDateKey(ds.startDate) ? ds.startDate : base.settings.startDate,
    hoursPerWeek: num(ds.hoursPerWeek, base.settings.hoursPerWeek, 1, 60),
    activePathId: str(ds.activePathId, base.settings.activePathId),
    roleFilter: ROLES_ALL.includes(ds.roleFilter as string) ? (ds.roleFilter as Settings["roleFilter"]) : "all",
    dailyGoal: Math.round(num(ds.dailyGoal, base.settings.dailyGoal, 1, 10)),
    railOpen: ds.railOpen === undefined ? base.settings.railOpen : !!ds.railOpen,
    navPinned: !!ds.navPinned,
    pomo: { focus: num(dp.focus, 25, 1, 120), short: num(dp.short, 5, 1, 60), long: num(dp.long, 15, 1, 90), rounds: Math.round(num(dp.rounds, 4, 1, 12)), sound: dp.sound === undefined ? true : !!dp.sound },
    freshnessCheckedAt: isDateKey(ds.freshnessCheckedAt) ? ds.freshnessCheckedAt : undefined,
  };
  const dpo = isObj(data.pomodoro) ? data.pomodoro : {};
  const mode = dpo.mode === "short" || dpo.mode === "long" ? dpo.mode : "focus";
  const pomodoro: PomodoroState = { mode, running: false, endTime: null, remaining: num(dpo.remaining, settings.pomo.focus * 60, 0, 120 * 60), round: Math.round(num(dpo.round, 1, 1, 10000)), taskId: typeof dpo.taskId === "string" ? dpo.taskId : null, taskTitle: typeof dpo.taskTitle === "string" ? dpo.taskTitle : null };
  const du = isObj(data.ui) ? data.ui : {};
  const dlf = isObj(du.libraryFilters) ? du.libraryFilters : {};
  const strList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  const boolMap = (v: unknown) => { const out: Record<string, boolean> = {}; if (isObj(v)) for (const [k, b] of Object.entries(v)) out[k] = !!b; return out; };
  const ui: UiState = {
    libraryFilters: { q: str(dlf.q), tracks: strList(dlf.tracks), types: strList(dlf.types), cost: strList(dlf.cost), difficulty: strList(dlf.difficulty), priority: strList(dlf.priority), time: strList(dlf.time), hideDone: !!dlf.hideDone, onlyArtifacts: !!dlf.onlyArtifacts },
    expanded: boolMap(du.expanded), collapsed: boolMap(du.collapsed), reviewDeck: str(du.reviewDeck, "all") || "all", compassTab: str(du.compassTab, "overview") || "overview",
  };
  return { progress, drillLog, completions, notes, srs, srsReviewedToday, settings, pomodoro, pomoCount: Math.round(num(data.pomoCount, 0, 0, 1000000)), ui, celebrated: boolMap(data.celebrated), planned: boolMap(data.planned) };
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
          const prevPct = prev?.percentComplete;
          // Leaving "done" drops the 100%; todo/skipped reset to 0; in-progress keeps a real partial value only.
          const percentComplete = isDone ? 100 : status === "in_progress" ? (prevPct !== undefined && prevPct > 0 && prevPct < 100 ? prevPct : undefined) : 0;
          const entry: ProgressEntry = {
            ...(prev ?? { itemId, itemType }),
            itemId, itemType, status,
            percentComplete,
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

      toggleCriterion: (assessmentId, index, total, itemType = "assessment") =>
        set((s) => {
          const prev = s.progress[assessmentId];
          const cur = new Set(prev?.criteriaDone ?? []);
          if (cur.has(index)) cur.delete(index); else cur.add(index);
          const done = [...cur].sort((a, b) => a - b);
          const p = total > 0 ? Math.round((done.length / total) * 100) : 0;
          // A project moved to Done on the board stays done while its checklist is edited; rubrics derive strictly.
          const keepDone = itemType === "project" && prev?.status === "done";
          const status: ProgressStatus = keepDone || p >= 100 ? "done" : p > 0 ? "in_progress" : "todo";
          const wasDone = prev?.status === "done";
          let completions = s.completions;
          if (status === "done" && !wasDone) completions = bumpCompletion(completions, +1);
          if (status !== "done" && wasDone) completions = bumpCompletion(completions, -1);
          return {
            progress: { ...s.progress, [assessmentId]: { ...(prev ?? { itemId: assessmentId, itemType }), itemId: assessmentId, itemType, status, percentComplete: p, criteriaDone: done, updatedAt: nowIso() } },
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
      setCollapsed: (key, collapsed) => set((s) => ({ ui: { ...s.ui, collapsed: { ...s.ui.collapsed, [key]: collapsed } } })),
      markCelebrated: (id) => set((s) => ({ celebrated: { ...s.celebrated, [id]: true } })),
      togglePlanned: (id) => set((s) => { const planned = { ...s.planned }; if (planned[id]) delete planned[id]; else planned[id] = true; return { planned }; }),

      importState: (data) => {
        const clean = sanitizeImport(data);
        if (!clean) return false;
        set({ ...defaultData(), ...clean });
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
      // Deep-merge nested objects so partial/older persisted state keeps new defaults.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ForgeState>;
        const base = defaultData();
        return {
          ...current,
          ...p,
          settings: { ...base.settings, ...(p.settings ?? {}), pomo: { ...base.settings.pomo, ...(p.settings?.pomo ?? {}) } },
          pomodoro: { ...base.pomodoro, ...(p.pomodoro ?? {}) },
          ui: { ...base.ui, ...(p.ui ?? {}), libraryFilters: { ...base.ui.libraryFilters, ...(p.ui?.libraryFilters ?? {}) } },
          progress: p.progress ?? {},
          drillLog: p.drillLog ?? {},
          completions: p.completions ?? {},
          notes: Array.isArray(p.notes) ? p.notes : [],
          srs: p.srs ?? {},
          srsReviewedToday: p.srsReviewedToday ?? {},
          celebrated: p.celebrated ?? {},
          pomoCount: typeof p.pomoCount === "number" ? p.pomoCount : 0,
          planned: p.planned ?? {},
        };
      },
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
