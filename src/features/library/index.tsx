import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { content } from "@/data";
import { useForge } from "@/store";
import { COST_MODELS, DIFFICULTIES, PRIORITIES, TIME_BUCKETS, type CostModel, type Difficulty, type Priority, type Resource, type ResourceType, type TimeBucket, type TrackId } from "@/types";
import { COST_LABEL, DIFF_LABEL, PRIORITY_LABEL, PRIORITY_ORDER, TIME_LABEL, TYPE_ICON, TYPE_LABEL } from "@/lib/labels";
import { Accordion, Chip, Empty, PageHeader, Seg, Switch } from "@/components/ui";
import { ResourceRow } from "@/components/ResourceRow";

type Sort = "priority" | "hours" | "title";
type Layout = "grouped" | "flat";

function toggleIn<T extends string>(list: string[], v: T): string[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export function filterResources(list: Resource[], f: ReturnType<typeof useForge.getState>["ui"]["libraryFilters"], progress: Record<string, { status: string }>): Resource[] {
  const q = f.q.trim().toLowerCase();
  return list.filter((r) => {
    if (q) {
      const hay = `${r.title} ${r.creator} ${r.tags.join(" ")} ${r.skillIds.join(" ")} ${r.buildsSkill}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.tracks.length && !r.trackIds.some((t) => f.tracks.includes(t))) return false;
    if (f.types.length && !f.types.includes(r.resourceType)) return false;
    if (f.cost.length && !f.cost.includes(r.cost.model)) return false;
    if (f.difficulty.length && !f.difficulty.includes(r.difficulty)) return false;
    if (f.priority.length && !f.priority.includes(r.priority)) return false;
    if (f.time.length && !f.time.includes(r.timeBucket)) return false;
    if (f.hideDone && progress[r.id]?.status === "done") return false;
    if (f.onlyArtifacts && !r.producesArtifact) return false;
    return true;
  });
}

export function sortResources(list: Resource[], sort: Sort): Resource[] {
  const arr = [...list];
  if (sort === "priority") arr.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.title.localeCompare(b.title));
  else if (sort === "hours") arr.sort((a, b) => (b.estHours ?? 0) - (a.estHours ?? 0) || a.title.localeCompare(b.title));
  else arr.sort((a, b) => a.title.localeCompare(b.title));
  return arr;
}

export default function LibraryPage() {
  const filters = useForge((s) => s.ui.libraryFilters);
  const setFilters = useForge((s) => s.setLibraryFilters);
  const progress = useForge((s) => s.progress);
  const collapsed = useForge((s) => s.ui.collapsed);
  const toggleCollapsed = useForge((s) => s.toggleCollapsed);
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<Sort>("priority");
  const [layout, setLayout] = useState<Layout>("grouped");
  const searchRef = useRef<HTMLInputElement>(null);

  // ?q= presets the search once, then is removed from the URL.
  useEffect(() => {
    const q = params.get("q");
    if (q !== null) {
      setFilters({ q });
      params.delete("q");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toUpperCase();
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") { e.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => sortResources(filterResources(content.resources, filters, progress), sort), [filters, progress, sort]);
  const types = useMemo(() => Array.from(new Set(content.resources.map((r) => r.resourceType))).sort() as ResourceType[], []);
  const activeCount = filters.tracks.length + filters.types.length + filters.cost.length + filters.difficulty.length + filters.priority.length + filters.time.length + (filters.hideDone ? 1 : 0) + (filters.onlyArtifacts ? 1 : 0) + (filters.q ? 1 : 0);

  const clear = () => setFilters({ q: "", tracks: [], types: [], cost: [], difficulty: [], priority: [], time: [], hideDone: false, onlyArtifacts: false });

  return (
    <div data-testid="page-library">
      <PageHeader title="📚 Library" sub={`${content.resources.length} curated resources across 8 tracks. Filter, expand a row for the why, and track status, progress and hours.`} />

      <div className="filters">
        <div className="frow">
          <div className="search">
            <span aria-hidden="true">🔍</span>
            <input ref={searchRef} value={filters.q} onChange={(e) => setFilters({ q: e.target.value })} placeholder="Search title, creator, tags…" aria-label="Search resources" data-testid="lib-search" />
            <span className="k">/</span>
          </div>
          <Seg<Sort> value={sort} onChange={setSort} testId="lib-sort" options={[{ value: "priority", label: "Priority" }, { value: "hours", label: "Hours" }, { value: "title", label: "A–Z" }]} />
          <Seg<Layout> value={layout} onChange={setLayout} testId="lib-layout" options={[{ value: "grouped", label: "By track" }, { value: "flat", label: "Flat" }]} />
          <span className="fmeta" style={{ marginLeft: "auto" }} data-testid="lib-count">{filtered.length} of {content.resources.length} resources</span>
          <button className="sbtn sm ghost" onClick={clear} disabled={activeCount === 0} data-testid="lib-clear">Clear{activeCount ? ` (${activeCount})` : ""}</button>
        </div>
        <div className="fgroup-label">Track</div>
        <div className="chips">
          {content.tracks.map((t) => <Chip key={t.id} on={filters.tracks.includes(t.id)} color={t.color} onClick={() => setFilters({ tracks: toggleIn(filters.tracks, t.id as TrackId) })} testId={`lib-chip-track-${t.id}`}>{t.code} · {t.name}</Chip>)}
        </div>
        <div className="fgroup-label">Type</div>
        <div className="chips">
          {types.map((t) => <Chip key={t} small on={filters.types.includes(t)} onClick={() => setFilters({ types: toggleIn(filters.types, t) })} testId={`lib-chip-type-${t}`}>{TYPE_ICON[t]} {TYPE_LABEL[t]}</Chip>)}
        </div>
        <div className="row" style={{ gap: 24, alignItems: "flex-start" }}>
          <div>
            <div className="fgroup-label">Cost</div>
            <div className="chips">{COST_MODELS.map((c) => <Chip key={c} small on={filters.cost.includes(c)} onClick={() => setFilters({ cost: toggleIn(filters.cost, c as CostModel) })} testId={`lib-chip-cost-${c}`}>{COST_LABEL[c]}</Chip>)}</div>
          </div>
          <div>
            <div className="fgroup-label">Difficulty</div>
            <div className="chips">{DIFFICULTIES.map((d) => <Chip key={d} small on={filters.difficulty.includes(d)} onClick={() => setFilters({ difficulty: toggleIn(filters.difficulty, d as Difficulty) })} testId={`lib-chip-diff-${d}`}>{DIFF_LABEL[d]}</Chip>)}</div>
          </div>
          <div>
            <div className="fgroup-label">Priority</div>
            <div className="chips">{PRIORITIES.map((p) => <Chip key={p} small on={filters.priority.includes(p)} onClick={() => setFilters({ priority: toggleIn(filters.priority, p as Priority) })} testId={`lib-chip-prio-${p}`}>{PRIORITY_LABEL[p]}</Chip>)}</div>
          </div>
          <div>
            <div className="fgroup-label">Time</div>
            <div className="chips">{TIME_BUCKETS.map((b) => <Chip key={b} small on={filters.time.includes(b)} onClick={() => setFilters({ time: toggleIn(filters.time, b as TimeBucket) })} testId={`lib-chip-time-${b}`}>{TIME_LABEL[b]}</Chip>)}</div>
          </div>
        </div>
        <div className="toggles">
          <label className="tog"><Switch checked={filters.hideDone} onChange={(v) => setFilters({ hideDone: v })} label="Hide done" testId="lib-hide-done" /> Hide done</label>
          <label className="tog"><Switch checked={filters.onlyArtifacts} onChange={(v) => setFilters({ onlyArtifacts: v })} label="Only artifact-producing" testId="lib-only-artifacts" /> Produces an artifact</label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty>No resources match. <button className="linkbtn" onClick={clear}>Clear filters</button></Empty>
      ) : layout === "flat" ? (
        <div data-testid="lib-list">{filtered.map((r) => <ResourceRow key={r.id} r={r} prefix="lib" />)}</div>
      ) : (
        <div data-testid="lib-list">
          {[...content.tracks].sort((a, b) => a.priorityRank - b.priorityRank).map((t) => {
            const rows = filtered.filter((r) => r.trackIds[0] === t.id);
            if (rows.length === 0) return null;
            const done = rows.filter((r) => progress[r.id]?.status === "done").length;
            const key = `lib-track-${t.id}`;
            return (
              <Accordion key={t.id} title={`${t.icon} ${t.code} · ${t.name}`} meta={`${rows.length} resources · #${t.priorityRank} priority`} color={t.color} open={!collapsed[key]} onToggle={() => toggleCollapsed(key)} pct={rows.length ? Math.round((done / rows.length) * 100) : 0} testId={`lib-group-${t.id}`}>
                {rows.map((r) => <ResourceRow key={r.id} r={r} prefix="lib" />)}
              </Accordion>
            );
          })}
        </div>
      )}
    </div>
  );
}
