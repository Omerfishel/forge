import { useCallback, useState, type DragEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { content } from "@/data";
import { useForge } from "@/store";
import type { ProgressStatus, Project } from "@/types";
import { blockers, itemTitle } from "@/lib/plan";
import { DIFF_LABEL, fmtHours, STATUS_LABEL, trackColorVar } from "@/lib/labels";
import { Bar, DiffDots, Modal, Seg, TrackBdg, PageHeader, useToast } from "@/components/ui";

type Col = "todo" | "in_progress" | "done";
const COLS: { key: Col; label: string; icon: string }[] = [
  { key: "todo", label: "Backlog", icon: "📋" },
  { key: "in_progress", label: "In progress", icon: "🔨" },
  { key: "done", label: "Done", icon: "✅" },
];
const colOf = (s: ProgressStatus | undefined): Col => (s === "in_progress" ? "in_progress" : s === "done" ? "done" : "todo");

function KCard({ p, onOpen, dragging, setDragging }: { p: Project; onOpen: (id: string) => void; dragging: string | null; setDragging: (id: string | null) => void }) {
  const entry = useForge((s) => s.progress[p.id]);
  const progress = useForge((s) => s.progress);
  const setStatus = useForge((s) => s.setStatus);
  const toast = useToast();
  const col = colOf(entry?.status);
  const stepsDone = entry?.criteriaDone?.length ?? 0;
  const bl = blockers(content, progress, p.id);
  const idx = COLS.findIndex((c) => c.key === col);
  const move = (to: Col) => { setStatus(p.id, "project", to); toast(<><b>{p.title}</b> → {COLS.find((c) => c.key === to)?.label}</>, "ok"); };
  return (
    <div className={`kcard ${dragging === p.id ? "dragging" : ""}`} style={{ ["--tc" as string]: trackColorVar(p.trackIds[0]) }} draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", p.id); e.dataTransfer.effectAllowed = "move"; setDragging(p.id); }} onDragEnd={() => setDragging(null)} data-testid={`kcard-${p.id}`}>
      <div className="kt">{p.title}</div>
      <div className="i-badges">
        {p.trackIds.map((t) => { const tr = content.tracks.find((x) => x.id === t); return tr ? <TrackBdg key={t} trackId={t} code={tr.code} /> : null; })}
        {p.isPortfolioPiece && <span className="bdg ok">Portfolio</span>}
        {p.isStartupSeed && <span className="bdg seed">Startup seed</span>}
        <DiffDots difficulty={p.difficulty} />
        <span className="pill">{fmtHours(p.estHours)}</span>
      </div>
      <div className="km">{stepsDone}/{p.steps.length} steps{bl.length ? ` · blocked by ${bl.map((b) => itemTitle(content, b)).join(", ")}` : ""}</div>
      <div style={{ margin: "6px 0" }}><Bar pct={p.steps.length ? (stepsDone / p.steps.length) * 100 : 0} color="var(--acc)" height={5} /></div>
      {bl.length > 0 && <span className="bdg bad" style={{ whiteSpace: "normal" }}>Blocked</span>}
      <div className="row" style={{ marginTop: 8, gap: 6 }}>
        <button className="sbtn sm" onClick={() => onOpen(p.id)} data-testid={`kcard-open-${p.id}`}>Open</button>
        <span className="grow" />
        {idx > 0 && <button className="sbtn sm ghost" aria-label={`Move ${p.title} to ${COLS[idx - 1].label}`} onClick={() => move(COLS[idx - 1].key)} data-testid={`kcard-move-${p.id}-${COLS[idx - 1].key}`}>◀</button>}
        {idx < COLS.length - 1 && <button className="sbtn sm ghost" aria-label={`Move ${p.title} to ${COLS[idx + 1].label}`} onClick={() => move(COLS[idx + 1].key)} data-testid={`kcard-move-${p.id}-${COLS[idx + 1].key}`}>▶</button>}
      </div>
    </div>
  );
}

function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const entry = useForge((s) => s.progress[p.id]);
  const progress = useForge((s) => s.progress);
  const toggleCriterion = useForge((s) => s.toggleCriterion);
  const setStatus = useForge((s) => s.setStatus);
  const logHours = useForge((s) => s.logHours);
  const setLinks = useForge((s) => s.setLinks);
  const toast = useToast();
  const [hours, setHours] = useState("2");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const done = new Set(entry?.criteriaDone ?? []);
  const col = colOf(entry?.status);
  const links = entry?.links ?? [];
  const related = p.relatedResourceIds.map((id) => content.resources.find((r) => r.id === id)).filter(Boolean);
  const validUrl = /^https?:\/\/\S+$/.test(url.trim());

  return (
    <Modal title={<span>🧪 {p.title}</span>} onClose={onClose} wide testId="proj-modal">
      <div className="row" style={{ marginBottom: 12 }}>
        {p.trackIds.map((t) => { const tr = content.tracks.find((x) => x.id === t); return tr ? <TrackBdg key={t} trackId={t} code={tr.code} /> : null; })}
        <span className="bdg type">{DIFF_LABEL[p.difficulty]}</span>
        <span className="pill">{fmtHours(p.estHours)} est.</span>
        {p.isPortfolioPiece && <span className="bdg ok">Portfolio piece</span>}
        {p.isStartupSeed && <span className="bdg seed">Startup seed</span>}
        <span className="grow" />
        <Seg<Col> value={col} onChange={(v) => { setStatus(p.id, "project", v); toast(<>Status: <b>{STATUS_LABEL[v]}</b></>, "ok"); }} testId="proj-status" options={COLS.map((c) => ({ value: c.key, label: c.label }))} />
      </div>
      <p className="muted" style={{ marginTop: 0 }}>{p.goal}</p>
      <div className="grid-2">
        <div>
          <span className="lbl">Steps · {done.size}/{p.steps.length}</span>
          <div className="col" style={{ gap: 6 }}>
            {p.steps.map((s, i) => (
              <label key={i} className="row" style={{ gap: 10, alignItems: "flex-start", flexWrap: "nowrap", cursor: "pointer" }}>
                <input type="checkbox" className="cbx" checked={done.has(i)} onChange={() => toggleCriterion(p.id, i, p.steps.length, "project")} data-testid={`proj-step-${i}`} />
                <span className={`small ${done.has(i) ? "faint" : ""}`} style={done.has(i) ? { textDecoration: "line-through" } : undefined}>{s}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: 12 }}><span className="lbl">Stack</span><div className="chips">{p.stack.map((s) => <span key={s} className="chip sm">{s}</span>)}</div></div>
        </div>
        <div>
          <div className="deliver"><span className="lbl">Proves</span>{p.proves}</div>
          <div className="deliver" style={{ borderLeftColor: "var(--info)" }}><span className="lbl" style={{ color: "var(--info)" }}>Publish as</span>{p.publishAs}</div>
          {p.caveats && <div className="help" style={{ borderLeft: "3px solid var(--bad)", marginBottom: 10 }}><b>Caveat.</b> {p.caveats}</div>}
          {p.prerequisites.length > 0 && (
            <div style={{ marginBottom: 10 }}><span className="lbl">Prerequisites</span>
              {p.prerequisites.map((id) => { const st = progress[id]?.status; return <span key={id} className={`bdg ${st === "done" || st === "skipped" ? "ok" : "bad"}`} style={{ marginRight: 6, whiteSpace: "normal" }}>{itemTitle(content, id)}</span>; })}
            </div>
          )}
          {related.length > 0 && (
            <div style={{ marginBottom: 10 }}><span className="lbl">Related resources</span>
              <div className="col" style={{ gap: 3 }}>{related.map((r) => r && <Link key={r.id} className="small" to={`/library?q=${encodeURIComponent(r.title)}`}>{r.title}</Link>)}</div>
            </div>
          )}
          <div style={{ marginBottom: 10 }}>
            <span className="lbl">Hours · {fmtHours(entry?.hoursLogged ?? 0)} logged</span>
            <div className="row"><input className="sel" type="number" min={0} step={0.5} value={hours} onChange={(e) => setHours(e.target.value)} style={{ width: 70 }} aria-label="Hours" data-testid="proj-hours" /><button className="sbtn sm" onClick={() => { const h = Number(hours); if (h > 0) { logHours(p.id, "project", h); toast(<>Logged <b>{h}h</b></>, "ok"); } }} data-testid="proj-hours-add">Log</button></div>
          </div>
          <div>
            <span className="lbl">Publish links</span>
            {links.length === 0 ? <div className="rubric" style={{ marginBottom: 6 }}>No links yet — add the repo, post and demo when you ship.</div> : (
              <div className="col" style={{ gap: 4, marginBottom: 6 }}>
                {links.map((l, i) => <div key={i} className="row" style={{ justifyContent: "space-between" }}><a href={l.url} target="_blank" rel="noreferrer" className="small">↗ {l.label}</a><button className="linkbtn xs" onClick={() => setLinks(p.id, "project", links.filter((_, j) => j !== i))} data-testid={`proj-link-remove-${i}`}>remove</button></div>)}
              </div>
            )}
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <input className="fi" placeholder="Label (repo / post / demo)" value={label} onChange={(e) => setLabel(e.target.value)} aria-label="Link label" data-testid="proj-link-label" />
              <input className="fi" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Link URL" data-testid="proj-link-url" />
              <button className="sbtn sm" disabled={!label.trim() || !validUrl} onClick={() => { setLinks(p.id, "project", [...links, { label: label.trim(), url: url.trim() }]); setLabel(""); setUrl(""); toast(<><b>Link added.</b></>, "ok"); }} data-testid="proj-link-add">Add</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function ProjectsPage() {
  const progress = useForge((s) => s.progress);
  const setStatus = useForge((s) => s.setStatus);
  const [params, setParams] = useSearchParams();
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<Col | null>(null);
  const toast = useToast();
  const openId = params.get("open");
  const openProject = openId ? content.projects.find((p) => p.id === openId) : undefined;
  const open = useCallback((id: string) => { params.set("open", id); setParams(params); }, [params, setParams]);
  const close = useCallback(() => { params.delete("open"); setParams(params); }, [params, setParams]);

  const total = content.projects.length;
  const doneN = content.projects.filter((p) => progress[p.id]?.status === "done").length;
  const portfolio = content.projects.filter((p) => p.isPortfolioPiece && progress[p.id]?.status === "done").length;
  const seeds = content.projects.filter((p) => p.isStartupSeed && progress[p.id]?.status === "done").length;
  const hours = content.projects.reduce((a, p) => a + (progress[p.id]?.hoursLogged ?? 0), 0);

  const onDrop = (e: DragEvent, col: Col) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragging;
    setOver(null); setDragging(null);
    if (!id) return;
    const p = content.projects.find((x) => x.id === id);
    if (!p || colOf(progress[id]?.status) === col) return;
    setStatus(id, "project", col);
    toast(<><b>{p.title}</b> → {COLS.find((c) => c.key === col)?.label}</>, "ok");
  };

  return (
    <div data-testid="page-projects">
      <PageHeader title="🧪 Projects" sub="Nine portfolio builds. Each one doubles as a credibility signal and, for the seeds, a possible startup. Drag cards or use the arrows." />
      <div className="stat-grid" data-testid="projects-stats">
        <div className="stat"><div className="big">{doneN}<span className="muted" style={{ fontSize: 16 }}>/{total}</span></div><div className="lb">Projects shipped</div></div>
        <div className="stat"><div className="big">{portfolio}</div><div className="lb">Portfolio pieces</div></div>
        <div className="stat"><div className="big">{seeds}</div><div className="lb">Startup seeds done</div></div>
        <div className="stat"><div className="big">{fmtHours(hours)}</div><div className="lb">Hours logged</div></div>
      </div>
      <div className="kanban">
        {COLS.map((c) => {
          const cards = content.projects.filter((p) => colOf(progress[p.id]?.status) === c.key);
          return (
            <div key={c.key} className={`kcol ${over === c.key ? "over" : ""}`} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (over !== c.key) setOver(c.key); }} onDragLeave={() => setOver(null)} onDrop={(e) => onDrop(e, c.key)} data-testid={`kanban-col-${c.key}`}>
              <div className="kcol-h">{c.icon} {c.label}<span className="pill">{cards.length}</span></div>
              <div className="kcol-b">
                {cards.length === 0 && <div className="rubric" style={{ padding: 8 }}>Drop a project here.</div>}
                {cards.map((p) => <KCard key={p.id} p={p} onOpen={open} dragging={dragging} setDragging={setDragging} />)}
              </div>
            </div>
          );
        })}
      </div>
      {openProject && <ProjectModal p={openProject} onClose={close} />}
    </div>
  );
}
