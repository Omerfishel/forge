// A resource as a list row with an expandable detail panel. Shared by Library,
// Tracks, Reading and Today. `prefix` namespaces the data-testids (lib-, track-…).
import { useState } from "react";
import type { ProgressStatus, Resource } from "@/types";
import { useForge } from "@/store";
import { content } from "@/data";
import { CostBdg, DiffDots, FreshBdg, PriorityBdg, TrackBdg, useToast } from "@/components/ui";
import { fmtHours, STATUS_LABEL, TIME_LABEL, TYPE_ICON, TYPE_LABEL, trackColorVar } from "@/lib/labels";
import { blockers, itemTitle } from "@/lib/plan";

export function ResourceRow({ r, prefix, compact }: { r: Resource; prefix: string; compact?: boolean }) {
  const entry = useForge((s) => s.progress[r.id]);
  const expanded = useForge((s) => !!s.ui.expanded[`${prefix}:${r.id}`]);
  const toggleExpanded = useForge((s) => s.toggleExpanded);
  const toggleDone = useForge((s) => s.toggleDone);
  const setStatus = useForge((s) => s.setStatus);
  const setPercent = useForge((s) => s.setPercent);
  const logHours = useForge((s) => s.logHours);
  const addNote = useForge((s) => s.addNote);
  const setPomodoro = useForge((s) => s.setPomodoro);
  const progress = useForge((s) => s.progress);
  const toast = useToast();
  const [hours, setHours] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const status: ProgressStatus = entry?.status ?? "todo";
  const done = status === "done";
  const pct = entry?.percentComplete ?? (done ? 100 : 0);
  const hasPct = entry?.percentComplete !== undefined && entry.percentComplete > 0;
  const tc = trackColorVar(r.trackIds[0]);
  const tracks = content.tracks;
  const blocked = blockers(content, progress, r.id);
  const key = `${prefix}-${r.id}`;

  return (
    <div className={`item ${done ? "done" : ""} ${blocked.length ? "blocked" : ""}`} style={{ ["--tc" as string]: tc }} data-testid={`${prefix}-row-${r.id}`}>
      <input type="checkbox" className="cbx" checked={done} onChange={() => { toggleDone(r.id, "resource"); toast(done ? <>Marked <b>not done</b>: {r.title}</> : <><b>Done.</b> {r.title}</>, done ? "info" : "ok"); }} aria-label={`Mark ${r.title} done`} data-testid={`${prefix}-done-${r.id}`} />
      <div className="i-main">
        <div className="i-titlerow" onClick={() => toggleExpanded(`${prefix}:${r.id}`)} role="button" aria-expanded={expanded} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpanded(`${prefix}:${r.id}`); } }} data-testid={`${prefix}-expand-${r.id}`}>
          <span className="i-type" title={TYPE_LABEL[r.resourceType]}>{TYPE_ICON[r.resourceType]}</span>
          <span className="i-title">{r.title}</span>
          <span className="faint xs">{r.creator}</span>
          {status === "in_progress" && hasPct && <span className="bdg info">{pct}%</span>}
          {status === "skipped" && <span className="bdg type">skipped</span>}
        </div>
        {!compact && (
          <div className="i-badges">
            {r.trackIds.map((t) => { const tr = tracks.find((x) => x.id === t); return tr ? <TrackBdg key={t} trackId={t} code={tr.code} /> : null; })}
            <PriorityBdg priority={r.priority} />
            <CostBdg model={r.cost.model} amount={r.cost.amount} currency={r.cost.currency} />
            <DiffDots difficulty={r.difficulty} />
            <span className="pill">{TIME_LABEL[r.timeBucket]}</span>
            <FreshBdg freshness={r.freshness} />
            {r.producesArtifact && <span className="bdg ok">artifact</span>}
            {blocked.length > 0 && <span className="bdg bad" title={blocked.map((b) => itemTitle(content, b)).join(", ")}>blocked by {blocked.length}</span>}
          </div>
        )}
        {expanded && (
          <div className="i-detail" data-testid={`${prefix}-detail-${r.id}`}>
            <p><span className="lbl">Why for you</span>{r.whyForHim}</p>
            <p><span className="lbl">Builds</span>{r.buildsSkill}</p>
            <p><span className="lbl">Signal</span>{r.qualitySignal}</p>
            {r.notes && <div className="help" style={{ marginBottom: 10 }}>{r.notes}</div>}
            {r.prerequisites.length > 0 && (
              <p><span className="lbl">Prerequisites</span>
                {r.prerequisites.map((p, i) => {
                  const isId = !!content.resources.find((x) => x.id === p) || !!content.projects.find((x) => x.id === p);
                  const st = progress[p]?.status;
                  return <span key={i} className={`bdg ${isId ? (st === "done" || st === "skipped" ? "ok" : "bad") : "type"}`} style={{ marginRight: 6, whiteSpace: "normal" }}>{isId ? itemTitle(content, p) : p}</span>;
                })}
              </p>
            )}
            {r.links && r.links.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <span className="lbl">Links</span>
                {r.links.map((l) => <a key={l.url} className="reslink" href={l.url} target="_blank" rel="noreferrer">↗ {l.label}</a>)}
              </div>
            )}
            <div className="row" style={{ gap: 14 }}>
              <label className="row" style={{ gap: 6 }}><span className="lbl" style={{ margin: 0 }}>Status</span>
                <select className="sel" value={status} onChange={(e) => setStatus(r.id, "resource", e.target.value as ProgressStatus)} data-testid={`${prefix}-status-${r.id}`}>
                  {(["todo", "in_progress", "done", "skipped"] as ProgressStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </label>
              <label className="row" style={{ gap: 6 }}><span className="lbl" style={{ margin: 0 }}>Progress</span>
                <input type="range" min={0} max={100} step={5} value={pct} onChange={(e) => setPercent(r.id, "resource", Number(e.target.value))} aria-label="Percent complete" data-testid={`${prefix}-percent-${r.id}`} />
                <span className="mono xs muted">{pct}%</span>
              </label>
              <label className="row" style={{ gap: 6 }}><span className="lbl" style={{ margin: 0 }}>Hours</span>
                <input className="sel" type="number" min={0} max={100} step={0.5} value={hours} placeholder="1" onChange={(e) => setHours(e.target.value)} style={{ width: 64 }} aria-label="Hours to log" data-testid={`${prefix}-hours-${r.id}`} />
                <button className="sbtn sm" onClick={() => { const h = Number(hours); if (!(h > 0) || h > 100) { toast("Enter between 0.5 and 100 hours.", "bad"); return; } logHours(r.id, "resource", h); setHours(""); toast(<>Logged <b>{h}h</b> on {r.title}</>, "ok"); }} data-testid={`${prefix}-hours-add-${r.id}`}>Log</button>
                <span className="mono xs muted">{fmtHours(entry?.hoursLogged ?? 0)} logged</span>
              </label>
              <button className="sbtn sm" onClick={() => setNoteOpen((v) => !v)} data-testid={`${prefix}-note-${r.id}`}>📓 {noteOpen ? "Cancel" : "Add note"}</button>
            </div>
            {noteOpen && (
              <div className="col" style={{ marginTop: 10 }}>
                <textarea className="ta" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Writing to think…" aria-label="Note" data-testid={`${prefix}-note-text-${r.id}`} />
                <div className="row"><button className="sbtn primary sm" disabled={!note.trim()} onClick={() => { addNote({ title: r.title, body: note.trim(), tags: ["resource"], resourceId: r.id }); setNote(""); setNoteOpen(false); toast(<><b>Note saved.</b> Find it under Notes.</>, "ok"); }} data-testid={`${prefix}-note-save-${r.id}`}>Save note</button></div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="i-right">
        <span className="hrs">{fmtHours(r.estHours)}</span>
        <a className="focusbtn" href={r.url} target="_blank" rel="noreferrer" data-testid={`${prefix}-open-${r.id}`}>Open ↗</a>
        <button className="focusbtn" onClick={() => { setPomodoro({ taskId: r.id, taskTitle: r.title }); toast(<>Pomodoro set to <b>{r.title}</b></>); }} data-testid={`${prefix}-focus-${r.id}`} title="Attach to the Pomodoro timer">⏱ Focus</button>
      </div>
      <span className="sr-only" data-testid={`${key}-status`}>{status}</span>
    </div>
  );
}
