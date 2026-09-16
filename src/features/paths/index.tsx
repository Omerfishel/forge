import { Link } from "react-router-dom";
import { content } from "@/data";
import { useForge } from "@/store";
import { useActivePath, useToday } from "@/lib/hooks";
import { blockers, currentPhase, findItem, itemTitle, pathProgress } from "@/lib/plan";
import { drillDue, drillStreak } from "@/lib/streaks";
import { CADENCE_LABEL, fmtHours, TYPE_ICON, trackColorVar } from "@/lib/labels";
import { iconForType, routeForItem } from "@/lib/routes";
import { weekIndex } from "@/lib/dates";
import { Accordion, Bar, Card, PageHeader, TrackBdg, useToast } from "@/components/ui";
import type { PathItem } from "@/types";

function PathItemRow({ it }: { it: PathItem }) {
  const progress = useForge((s) => s.progress);
  const drillLog = useForge((s) => s.drillLog);
  const toggleDone = useForge((s) => s.toggleDone);
  const logDrill = useForge((s) => s.logDrill);
  const toast = useToast();
  const today = useToday();
  const f = findItem(content, it.itemId);
  if (!f) return null;
  const trackId = f.kind === "assessment" ? f.item.trackId : f.kind === "milestone" ? undefined : f.item.trackIds[0];
  const track = trackId ? content.tracks.find((t) => t.id === trackId) : undefined;
  const isDone = progress[it.itemId]?.status === "done";
  const inProg = progress[it.itemId]?.status === "in_progress";
  const bl = it.itemType === "drill" ? [] : blockers(content, progress, it.itemId);
  const hours = f.kind === "resource" ? f.item.estHours : f.kind === "project" ? f.item.estHours : undefined;
  const icon = f.kind === "resource" ? TYPE_ICON[f.item.resourceType] : iconForType(it.itemType);

  if (f.kind === "drill") {
    const due = drillDue(f.item, drillLog[f.item.id], today);
    const streak = drillStreak(f.item, drillLog[f.item.id], today);
    return (
      <div className="item" style={{ ["--tc" as string]: track ? trackColorVar(track.id) : "var(--t8)" }} data-testid={`path-item-${it.itemId}`}>
        <span className="i-type" style={{ marginTop: 2 }}>🔁</span>
        <div className="i-main">
          <div className="i-titlerow" style={{ cursor: "default" }}><Link className="i-title" to="/drills" style={{ color: "var(--ink)" }}>{f.item.title}</Link><span className="bdg type">{CADENCE_LABEL[f.item.cadence]}</span>{due ? <span className="bdg must">Due</span> : <span className="bdg ok">Done this period</span>}<span className="pill">{streak} 🔥</span></div>
          {it.note && <div className="faint xs" style={{ marginTop: 4 }}>{it.note}</div>}
        </div>
        <div className="i-right"><span className="hrs">{f.item.estMinutes} min</span><button className="focusbtn" disabled={!due} onClick={() => { logDrill(f.item.id); toast(<><b>Logged</b> {f.item.title}</>, "ok"); }} data-testid={`path-item-log-${it.itemId}`}>Log ✓</button></div>
      </div>
    );
  }

  return (
    <div className={`item ${isDone ? "done" : ""} ${bl.length ? "blocked" : ""}`} style={{ ["--tc" as string]: track ? trackColorVar(track.id) : "var(--acc)" }} data-testid={`path-item-${it.itemId}`}>
      <input type="checkbox" className="cbx" checked={isDone} onChange={() => { toggleDone(it.itemId, it.itemType as never); if (!isDone) toast(<><b>Done.</b> {f.item.title}</>, "ok"); }} aria-label={`Mark ${f.item.title} done`} data-testid={`path-item-done-${it.itemId}`} />
      <div className="i-main">
        <div className="i-titlerow" style={{ cursor: "default" }}>
          <span className="i-type">{icon}</span>
          <Link className="i-title" to={routeForItem(content, it.itemId)} style={{ color: "var(--ink)" }}>{f.item.title}</Link>
          {f.kind === "milestone" && <span className="pill">target week {f.item.targetWeek}</span>}
          {inProg && <span className="bdg info">in progress</span>}
          {!isDone && !inProg && bl.length === 0 && it.itemType !== "milestone" && <span className="bdg ok">Ready</span>}
          {bl.length > 0 && <span className="bdg bad" title={`Blocked by: ${bl.map((b) => itemTitle(content, b)).join(", ")}`}>Blocked by {bl.length}</span>}
        </div>
        <div className="i-badges">
          {track && <TrackBdg trackId={track.id} code={track.code} />}
          <span className="bdg type">{it.itemType}</span>
          {f.kind === "milestone" ? <span className="faint xs">{f.item.criteria}</span> : it.note ? <span className="faint xs">{it.note}</span> : null}
          {bl.length > 0 && <span className="faint xs" style={{ whiteSpace: "normal" }}>needs: {bl.map((b) => itemTitle(content, b)).join(", ")}</span>}
        </div>
      </div>
      <div className="i-right"><span className="hrs">{hours ? fmtHours(hours) : ""}</span></div>
    </div>
  );
}

export default function PathsPage() {
  const settings = useForge((s) => s.settings);
  const update = useForge((s) => s.updateSettings);
  const progress = useForge((s) => s.progress);
  const drillLog = useForge((s) => s.drillLog);
  const collapsed = useForge((s) => s.ui.collapsed);
  const setCollapsed = useForge((s) => s.setCollapsed);
  const active = useActivePath();
  const toast = useToast();
  const phase = currentPhase(active, settings.startDate);
  const week = Math.max(0, weekIndex(settings.startDate));
  const pp = pathProgress(active, progress, drillLog, content);
  const ms = content.milestones.filter((m) => m.pathId === active.id);
  const msDone = ms.filter((m) => progress[m.id]?.status === "done").length;

  return (
    <div data-testid="page-paths">
      <PageHeader title="🛤️ Paths" sub="Pick one path and treat the rest as backlog. Switching recomputes the weekly plan on Today." />

      <div className="grid-auto" style={{ marginBottom: 18 }}>
        {content.paths.map((p) => {
          const isActive = p.id === settings.activePathId;
          const prog = pathProgress(p, progress, drillLog, content);
          return (
            <div key={p.id} className={`card ${isActive ? "accent" : ""}`} style={isActive ? { borderColor: "var(--acc)" } : undefined} data-testid={`path-card-${p.id}`}>
              <div className="body">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <b style={{ fontSize: 14 }}>{p.name}</b>
                  {isActive ? <span className="bdg high">Active</span> : <button className="sbtn sm" onClick={() => { update({ activePathId: p.id, hoursPerWeek: p.hoursPerWeek }); toast(<>Active path: <b>{p.name}</b> · budget set to {p.hoursPerWeek}h/wk</>, "ok"); }} data-testid={`path-activate-${p.id}`}>Activate</button>}
                </div>
                <div className="fmeta" style={{ marginTop: 6 }}>{p.durationMonths} mo · {p.hoursPerWeek}h/wk · {prog.total} items + {prog.drills} drills{p.variantOf ? " · variant" : ""}</div>
                <p className="muted small" style={{ margin: "8px 0" }}>{p.description}</p>
                <div className="deliver" style={{ marginBottom: 8 }}><span className="lbl">Output</span>{p.output}</div>
                <div className="row" style={{ justifyContent: "space-between" }}><span className="fmeta">{prog.done}/{prog.total} done</span><span className="fmeta">{prog.pct}%</span></div>
                <div style={{ marginTop: 6 }}><Bar pct={prog.pct} color="var(--acc)" height={7} /></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stat-grid" data-testid="path-stats">
        <div className="stat"><div className="big">{phase}</div><div className="lb">Current phase</div><div className="sm">{active.phases.find((p) => p.phase === phase)?.title}</div></div>
        <div className="stat"><div className="big">{Math.min(week + 1, Math.round(active.durationMonths * 4.345))}</div><div className="lb">Week</div><div className="sm">of ~{Math.round(active.durationMonths * 4.345)}{week + 1 > Math.round(active.durationMonths * 4.345) ? " · past the end" : ""}</div></div>
        <div className="stat"><div className="big">{pp.pct}%</div><div className="lb">Path progress</div><div className="sm">{pp.done}/{pp.total} items · {pp.drillsActive}/{pp.drills} drills active</div></div>
        <div className="stat"><div className="big">{msDone}<span className="muted" style={{ fontSize: 16 }}>/{ms.length}</span></div><div className="lb">Milestones</div></div>
      </div>

      <Card title={`${active.name} · sequenced plan`} testId="path-plan">
        {active.phases.map((ph) => {
          const items = active.items.filter((i) => i.phase === ph.phase);
          const countable = items.filter((i) => i.itemType !== "drill");
          const done = countable.filter((i) => progress[i.itemId]?.status === "done").length;
          const key = `path-${active.id}-${ph.phase}`;
          const open = collapsed[key] === undefined ? ph.phase === phase : !collapsed[key];
          return (
            <Accordion key={ph.phase} title={`Phase ${ph.phase} · ${ph.title}`} meta={`months ${ph.months[0]}–${ph.months[1]} · ${items.length} items${ph.phase === phase ? " · current" : ""}`} color={ph.phase === phase ? "var(--acc)" : "var(--faint)"} open={open} onToggle={() => setCollapsed(key, open)} pct={countable.length ? Math.round((done / countable.length) * 100) : 0} testId={`path-phase-${ph.phase}`}>
              <p className="muted small" style={{ margin: "6px 4px 10px" }}>{ph.summary}</p>
              {items.map((it) => <PathItemRow key={it.itemId} it={it} />)}
            </Accordion>
          );
        })}
      </Card>
    </div>
  );
}
