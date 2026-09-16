// Where an item "lives" in the app — used for cross-view links.
import type { ContentBundle, PathItemType } from "@/types";
import { findItem } from "./plan";

export function routeForItem(bundle: ContentBundle, id: string): string {
  const f = findItem(bundle, id);
  if (!f) return "/library";
  switch (f.kind) {
    case "resource": return `/library?q=${encodeURIComponent(f.item.title)}`;
    case "project": return `/projects?open=${encodeURIComponent(id)}`;
    case "drill": return "/drills";
    case "assessment": return "/assess";
    case "milestone": return "/paths";
  }
}

export function iconForType(t: PathItemType): string {
  switch (t) {
    case "resource": return "📚";
    case "project": return "🧪";
    case "drill": return "🔁";
    case "assessment": return "✅";
    case "milestone": return "🏁";
  }
}
