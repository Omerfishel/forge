// Navigation registry. Each feature lives in src/features/<key>/index.tsx and
// exports a default React component. Add a feature here to put it in the nav.
import { lazy, type LazyExoticComponent, type ComponentType } from "react";

export interface NavEntry {
  key: string;
  path: string;
  label: string;
  icon: string;
  /** Group separator before this entry. */
  sep?: boolean;
  component: LazyExoticComponent<ComponentType>;
  /** Extra route patterns rendered by the same component (e.g. detail pages). */
  extraPaths?: string[];
}

export const NAV: NavEntry[] = [
  { key: "today", path: "/today", label: "Today", icon: "🎯", component: lazy(() => import("./dashboard")) },
  { key: "paths", path: "/paths", label: "Paths", icon: "🛤️", component: lazy(() => import("./paths")) },
  { key: "tracks", path: "/tracks", label: "Tracks", icon: "🗺️", component: lazy(() => import("./tracks")), extraPaths: ["/tracks/:trackId"] },
  { key: "library", path: "/library", label: "Library", icon: "📚", component: lazy(() => import("./library")) },
  { key: "projects", path: "/projects", label: "Projects", icon: "🧪", component: lazy(() => import("./projects")) },
  { key: "drills", path: "/drills", label: "Drills", icon: "🔁", component: lazy(() => import("./drills")) },
  { key: "review", path: "/review", label: "Review", icon: "🧠", component: lazy(() => import("./review")) },
  { key: "reading", path: "/reading", label: "Reading", icon: "📄", component: lazy(() => import("./reading")) },
  { key: "feed", path: "/feed", label: "News", icon: "📰", component: lazy(() => import("./feed")) },
  { key: "notes", path: "/notes", label: "Notes", icon: "📓", component: lazy(() => import("./notes")) },
  { key: "assess", path: "/assess", label: "Ready-when", icon: "✅", sep: true, component: lazy(() => import("./assessments")) },
  { key: "compass", path: "/compass", label: "Compass", icon: "🧭", component: lazy(() => import("./compass")) },
  { key: "progress", path: "/progress", label: "Progress", icon: "📊", component: lazy(() => import("./progress")) },
  { key: "budget", path: "/budget", label: "Budget", icon: "💰", sep: true, component: lazy(() => import("./budget")) },
  { key: "freshness", path: "/freshness", label: "Freshness", icon: "🔄", component: lazy(() => import("./freshness")) },
  { key: "settings", path: "/settings", label: "Settings", icon: "⚙️", component: lazy(() => import("./settings")) },
];

export const DEFAULT_PATH = "/today";
