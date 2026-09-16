import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { content } from "@/data";
import { useForge } from "@/store";
import type { Assessment, Track } from "@/types";
import { Accordion, Bar, PageHeader, useToast } from "@/components/ui";

const TYPE_LABEL: Record<Assessment["type"], string> = { rubric: "Rubric", self_test: "Self-test", checkpoint: "Checkpoint", public_proof: "Public proof" };
const TYPE_ORDER: Record<Assessment["type"], number> = { rubric: 0, self_test: 1, checkpoint: 2, public_proof: 3 };

function AssessmentBlock({ a, track }: { a: Assessment; track: Track }) {
  const entry = useForge((s) => s.progress[a.id]);
  const toggleCriterion = useForge((s) => s.toggleCriterion);
  const setLinks = useForge((s) => s.setLinks);
  const notes = useForge((s) => s.notes);
  const addNote = useForge((s) => s.addNote);
  const updateNote = useForge((s) => s.updateNote);
  const toast = useToast();
  const existing = notes.find((n) => n.itemId === a.id);
  const [text, setText] = useState(existing?.body ?? "");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const done = new Set(entry?.criteriaDone ?? []);
  const pct = a.criteria.length ? Math.round((done.size / a.criteria.length) * 100) : 0;
  const links = entry?.links ?? [];
  const validUrl = /^https?:\/\/\S+$/.test(url.trim());

  const saveNotes = () => {
    if (existing) { updateNote(existing.id, { body: text }); toast("Notes saved.", "ok"); }
    else if (text.trim()) { addNote({ title: `${track.code} self-test · ${a.title}`, body: text, tags: ["self-test"], itemId: a.id }); toast("Notes saved.", "ok"); }
    else toast("Nothing to save yet — write your answers first.", "info");
  };

  return (
    <div className="card mb12" style={{ borderLeft: `3px solid ${track.color}` }} data-testid={`assess-item-${a.id}`}>
      <div className="card-h"><span className="bdg type">{TYPE_LABEL[a.type]}</span><span style={{ textTransform: "none", letterSpacing: 0, color: "var(--ink)", fontSize: 13 }}>{a.title}</span><span className="grow" /><span className={`bdg ${entry?.status === "done" ? "ok" : pct > 0 ? "info" : "type"}`}>{entry?.status === "done" ? "Ready ✓" : `${pct}%`}</span></div>
      <div className="body">
        {a.type === "rubric" && <div className="deliver"><span className="lbl">Ready when</span>{a.readyWhen}</div>}
        {a.type !== "rubric" && <p className="muted small" style={{ marginTop: 0 }}>{a.readyWhen}</p>}
        {a.questions && a.questions.length > 0 && (
          <div style={{ marginBottom: 10 }}><span className="lbl">Questions</span><ol className="small muted" style={{ margin: 0, paddingLeft: 18 }}>{a.questions.map((q, i) => <li key={i}>{q}</li>)}</ol></div>
        )}
        {a.publicProof && <div className="deliver" style={{ borderLeftColor: "var(--info)" }}><span className="lbl" style={{ color: "var(--info)" }}>Public proof</span>{a.publicProof}</div>}
        <span className="lbl">Criteria · {done.size}/{a.criteria.length}</span>
        <div className="col" style={{ gap: 6 }}>
          {a.criteria.map((c, i) => (
            <label key={i} className="row" style={{ gap: 10, alignItems: "flex-start", flexWrap: "nowrap", cursor: "pointer" }}>
              <input type="checkbox" className="cbx" checked={done.has(i)} aria-label={c} onChange={() => { toggleCriterion(a.id, i, a.criteria.length); if (!done.has(i) && done.size + 1 === a.criteria.length) toast(<><b>{track.code} ready.</b> {a.title} complete.</>, "ok"); }} data-testid={`assess-crit-${a.id}-${i}`} />
              <span className={`small ${done.has(i) ? "faint" : ""}`}>{c}</span>
            </label>
          ))}
        </div>
        <div style={{ marginTop: 10 }}><Bar pct={pct} color={track.color} height={6} /></div>
        {a.type === "self_test" && (
          <div style={{ marginTop: 12 }}>
            <span className="lbl">Self-test notes</span>
            <textarea className="ta" value={text} onChange={(e) => setText(e.target.value)} placeholder="Explain each answer in your own words — that's the test." aria-label="Self-test notes" data-testid={`assess-notes-${a.id}`} />
            <div className="row" style={{ marginTop: 6 }}><button className="sbtn sm" onClick={saveNotes} data-testid={`assess-notes-save-${a.id}`}>Save notes</button>{existing && <span className="xs faint">saved as a note</span>}</div>
          </div>
        )}
        {a.type === "public_proof" && (
          <div style={{ marginTop: 12 }}>
            <span className="lbl">Proof links</span>
            {links.length > 0 && <div className="col" style={{ gap: 4, marginBottom: 6 }}>{links.map((l, i) => <div key={i} className="row" style={{ justifyContent: "space-between" }}><a href={l.url} target="_blank" rel="noreferrer" className="small">↗ {l.label}</a><button className="linkbtn xs" onClick={() => setLinks(a.id, "assessment", links.filter((_, j) => j !== i))} data-testid={`assess-proof-remove-${a.id}-${i}`}>remove</button></div>)}</div>}
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <input className="fi" placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} aria-label="Proof label" data-testid={`assess-proof-label-${a.id}`} />
              <input className="fi" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Proof URL" data-testid={`assess-proof-url-${a.id}`} />
              <button className="sbtn sm" disabled={!label.trim() || !validUrl} onClick={() => { setLinks(a.id, "assessment", [...links, { label: label.trim(), url: url.trim() }]); setLabel(""); setUrl(""); toast("Proof link saved.", "ok"); }} data-testid={`assess-proof-save-${a.id}`}>Save link</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentsPage() {
  const progress = useForge((s) => s.progress);
  const collapsed = useForge((s) => s.ui.collapsed);
  const setCollapsed = useForge((s) => s.setCollapsed);
  const [params, setParams] = useSearchParams();
  const tracks = [...content.tracks].sort((a, b) => a.priorityRank - b.priorityRank);
  // ?track=ID (from a track page or a summary tile) opens that section and scrolls to it.
  useEffect(() => {
    const t = params.get("track");
    if (!t) return;
    setCollapsed(`assess-${t}`, false);
    params.delete("track");
    setParams(params, { replace: true });
    window.setTimeout(() => document.querySelector(`[data-testid="assess-track-${t}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  const pctAll = (t: Track) => { const list = content.assessments.filter((a) => a.trackId === t.id); if (!list.length) return 0; return Math.round(list.reduce((acc, a) => acc + (a.criteria.length ? ((progress[a.id]?.criteriaDone?.length ?? 0) / a.criteria.length) * 100 : 0), 0) / list.length); };
  const rubricOf = (t: Track) => content.assessments.find((a) => a.trackId === t.id && a.type === "rubric");
  const pctOf = (a?: Assessment) => (a && a.criteria.length ? Math.round(((progress[a.id]?.criteriaDone?.length ?? 0) / a.criteria.length) * 100) : 0);
  const readyCount = tracks.filter((t) => { const r = rubricOf(t); return r && progress[r.id]?.status === "done"; }).length;

  return (
    <div data-testid="page-assess">
      <PageHeader title="✅ Ready-when" sub={`Per-track readiness rubrics, self-tests and public proof. ${readyCount} of ${tracks.length} tracks ready.`} />
      <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", marginBottom: 18 }}>
        {tracks.map((t) => { const r = rubricOf(t); const ready = r && progress[r.id]?.status === "done"; return (
          <button key={t.id} type="button" className="stat" style={{ padding: 12, borderTop: `3px solid ${t.color}`, textAlign: "left", cursor: "pointer", font: "inherit", color: "inherit" }} onClick={() => { setCollapsed(`assess-${t.id}`, false); document.querySelector(`[data-testid="assess-track-${t.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }} data-testid={`assess-summary-${t.id}`} aria-label={`${t.code} readiness`}>
            <div className="row" style={{ justifyContent: "space-between" }}><b>{t.icon} {t.code}</b>{ready ? <span className="bdg ok">Ready</span> : <span className="mono xs muted">{pctOf(r)}% rubric</span>}</div>
            <div style={{ marginTop: 8 }}><Bar pct={pctOf(r)} color={t.color} height={6} /></div>
            <div className="xs faint" style={{ marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
          </button>
        ); })}
      </div>
      {tracks.map((t, i) => {
        const list = content.assessments.filter((a) => a.trackId === t.id).sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
        const key = `assess-${t.id}`;
        const open = collapsed[key] === undefined ? i === 0 : !collapsed[key];
        return (
          <Accordion key={t.id} title={`${t.icon} ${t.code} · ${t.name}`} meta={`${list.length} checks`} color={t.color} open={open} onToggle={() => setCollapsed(key, open)} pct={pctAll(t)} testId={`assess-track-${t.id}`}>
            {list.map((a) => <AssessmentBlock key={a.id} a={a} track={t} />)}
          </Accordion>
        );
      })}
    </div>
  );
}
