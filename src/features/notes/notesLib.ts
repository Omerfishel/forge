// Pure helpers for the Notes view: link resolution, filtering/sorting, tag
// parsing and the markdown export. No React, no store — easy to unit test.
import type { ContentBundle, Note, TrackId } from "@/types";
import { findItem } from "@/lib/plan";

export type LinkKind = "resource" | "project" | "drill" | "assessment" | "milestone";
export type LinkFilter = "all" | "resource" | "project" | "unlinked";
export type SortDir = "newest" | "oldest";

/** Store key (inside ui.expanded) that persists the "oldest first" sort choice. */
export const NOTES_SORT_KEY = "notes:sort-oldest";

export interface NoteLink {
  kind: LinkKind | "missing";
  id: string;
  title: string;
  /** In-app route for the linked item (undefined when the item no longer exists). */
  to?: string;
  trackId?: TrackId;
  /** One-letter code shown in the badge: R / P / D / A / M / ?. */
  code: string;
}

export interface NoteDraft {
  title: string;
  body: string;
  tags: string[];
  resourceId?: string;
  projectId?: string;
  itemId?: string;
}

const CODE: Record<LinkKind, string> = { resource: "R", project: "P", drill: "D", assessment: "A", milestone: "M" };

/** Route for a linked content item. Resources deep-link into the library search, projects open their card. */
export function routeFor(kind: LinkKind, id: string, title: string): string {
  switch (kind) {
    case "resource": return `/library?q=${encodeURIComponent(title)}`;
    case "project": return `/projects?open=${encodeURIComponent(id)}`;
    case "drill": return "/drills";
    case "assessment": return "/assess";
    case "milestone": return "/paths";
  }
}

/** Resolve whichever of resourceId / projectId / itemId is set into a displayable link. */
export function resolveLink(bundle: ContentBundle, note: Pick<Note, "resourceId" | "projectId" | "itemId">): NoteLink | undefined {
  const id = note.resourceId || note.projectId || note.itemId;
  if (!id) return undefined;
  const found = findItem(bundle, id);
  if (!found) return { kind: "missing", id, title: id, code: "?" };
  const trackId = found.kind === "milestone" ? undefined : found.kind === "assessment" ? found.item.trackId : found.item.trackIds[0];
  return { kind: found.kind, id, title: found.item.title, to: routeFor(found.kind, id, found.item.title), trackId, code: CODE[found.kind] };
}

/** `<select>` value for a note's link: "kind:id" or "" for none. */
export function linkValueOf(bundle: ContentBundle, note: Pick<Note, "resourceId" | "projectId" | "itemId">): string {
  if (note.resourceId) return `resource:${note.resourceId}`;
  if (note.projectId) return `project:${note.projectId}`;
  if (note.itemId) return `${findItem(bundle, note.itemId)?.kind ?? "item"}:${note.itemId}`;
  return "";
}

/** Inverse of linkValueOf: which id field a "kind:id" select value populates. Always returns all three keys so a patch clears stale links. */
export function parseLinkValue(value: string): Pick<NoteDraft, "resourceId" | "projectId" | "itemId"> {
  const i = value.indexOf(":");
  if (!value || i < 0) return { resourceId: undefined, projectId: undefined, itemId: undefined };
  const kind = value.slice(0, i);
  const id = value.slice(i + 1);
  if (!id) return { resourceId: undefined, projectId: undefined, itemId: undefined };
  if (kind === "resource") return { resourceId: id, projectId: undefined, itemId: undefined };
  if (kind === "project") return { resourceId: undefined, projectId: id, itemId: undefined };
  return { resourceId: undefined, projectId: undefined, itemId: id };
}

/** "a, b ,,c" → ["a","b","c"] (trimmed, empties dropped, exact duplicates removed). */
export function parseTags(input: string): string[] {
  const out: string[] = [];
  for (const raw of input.split(",")) {
    const t = raw.trim();
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

/** Distinct tags across all notes, sorted case-insensitively, with usage counts. */
export function allTags(notes: Note[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const n of notes) for (const t of n.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag, undefined, { sensitivity: "base" }));
}

export function isUnlinked(note: Pick<Note, "resourceId" | "projectId" | "itemId">): boolean {
  return !note.resourceId && !note.projectId && !note.itemId;
}

export interface NoteFilters { q: string; tags: string[]; link: LinkFilter; sort: SortDir }

export function matchesFilters(bundle: ContentBundle, note: Note, f: Omit<NoteFilters, "sort">): boolean {
  const q = f.q.trim().toLowerCase();
  if (q) {
    const hay = `${note.title}\n${note.body}\n${note.tags.join(" ")}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.tags.length > 0 && !note.tags.some((t) => f.tags.includes(t))) return false;
  if (f.link === "unlinked") return isUnlinked(note);
  if (f.link === "resource" || f.link === "project") return resolveLink(bundle, note)?.kind === f.link;
  return true;
}

/** Search (title/body/tags), tag multi-select (any-of), link filter, then sort by updatedAt. */
export function filterNotes(bundle: ContentBundle, notes: Note[], f: NoteFilters): Note[] {
  const dir = f.sort === "oldest" ? 1 : -1;
  return notes
    .filter((n) => matchesFilters(bundle, n, f))
    .sort((a, b) => {
      const d = a.updatedAt.localeCompare(b.updatedAt);
      if (d !== 0) return d * dir;
      return a.createdAt.localeCompare(b.createdAt) * dir;
    });
}

function isoDate(iso: string): string {
  return iso.length >= 10 ? iso.slice(0, 10) : iso;
}

/** One markdown document with every note (newest first), ready to drop into Obsidian/Notion. */
export function exportMarkdown(bundle: ContentBundle, notes: Note[], now: Date): string {
  const sorted = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const lines: string[] = [];
  lines.push("# Forge notes");
  lines.push("");
  lines.push(`_Exported ${now.toISOString().slice(0, 10)} · ${sorted.length} note${sorted.length === 1 ? "" : "s"}_`);
  lines.push("");
  for (const n of sorted) {
    lines.push(`## ${n.title.trim() || "Untitled"}`);
    lines.push("");
    const meta: string[] = [`created ${isoDate(n.createdAt)}`, `updated ${isoDate(n.updatedAt)}`];
    if (n.tags.length) meta.push(`tags: ${n.tags.map((t) => `#${t}`).join(" ")}`);
    const link = resolveLink(bundle, n);
    if (link) {
      const found = findItem(bundle, link.id);
      const url = found?.kind === "resource" ? ` (${found.item.url})` : "";
      meta.push(`linked: ${link.code} · ${link.title}${url}`);
    }
    lines.push(`_${meta.join(" · ")}_`);
    lines.push("");
    if (n.body.trim()) { lines.push(n.body.trim()); lines.push(""); }
    lines.push("---");
    lines.push("");
  }
  return lines.join("\n");
}
