import { useState } from "react";
import { content } from "@/data";
import { useForge } from "@/store";
import { usePlan, useToday } from "@/lib/hooks";
import { drillDue, drillStreak, heatmap } from "@/lib/streaks";
import { CADENCE_LABEL, trackColorVar } from "@/lib/labels";
import { fmtDate, isValidKey } from "@/lib/dates";
import { Card, PageHeader, Seg, TrackBdg, useToast } from "@/components/ui";
import type { Drill } from "@/types";
import { drillInPhase, drillTotals, heatPadding, lastPeriods, loggedLastNDays, longestStreak, PERIOD_NOUN, periodsHit, PHASE_OPTIONS, SOLO_ICON, SOLO_LABEL, totalLogged, type PhaseFilter } from "./lib";

function HabitRow({ d, today }: { d: Drill; today: string }) {
  const log = useForge((s) => s.drillLog[d.id]);
  const logDrill = useForge((s) => s.logDrill);
  const unlogDrill = useForge((s) => s.unlogDrill);
  const toast = useToast();
  const [date, setDate] = useState("");
  const due = drillDue(d, log, today);
  const streak = drillStreak(d, log, today);
  const loggedToday = (log ?? []).includes(today);
  const periods = lastPeriods(d.cadence, 12, today);
  const hits = periodsHit(d.cadence, log, periods);
  const track = content.tracks.find((t) => t.id === d.trackIds[0]);
  return (
    <div className="item" style={{ ["--tc" as string]: trackColorVar(d.trackIds[0]) }} data-testid={`drill-row-${d.id}`}>
      <span className="i-type" style={{ marginTop: 2 }}>🔁</span>
      <div className="i-main">
        <div className="i-titlerow" style={{ cursor: "default" }}>
          <span className="i-title">{d.title}</span>
          <span className="bdg type">{CADENCE_LABEL[d.cadence]}</span>
          {due ? <span className="bdg must">Due now</span> : <span className="bdg ok">Done this period</span>}
          <span className="pill" data-testid={`drill-streak-${d.id}`}>{streak} 🔥</span>
        </div>
        <div className="muted small" style={{ marginTop: 4 }}>{d.description}</div>
        <div className="i-badges">
          {track && <TrackBdg trackId={track.id} code={track.code} />}
          <span className="pill">{d.estMinutes} min</span>
          <span className="pill">{SOLO_ICON[d.soloOrPartner]} {SOLO_LABEL[d.soloOrPartner]}</span>
          {d.phases && d.phases.length > 0 && <span className="bdg type">phase {d.phases.join("/")}</span>}
          <span className="row" style={{ gap: 3, marginLeft: 4 }} aria-label={`Last 12 ${PERIOD_NOUN[d.cadence]}`} title={`Last 12 ${PERIOD_NOUN[d.cadence]}`}>
            {periods.map((p, i) => <i key={p.key} title={p.label} style={{ width: 9, height: 9, borderRadius: 2, display: "inline-block", background: hits[i] ? "var(--acc)" : "var(--panel)", border: `1px solid ${p.current ? "var(--acc)" : "var(--line-solid)"}` }} />)}
          </span>
        </div>
      </div>
      <div className="i-right">
        {loggedToday ? (
          <button className="focusbtn" onClick={() => { unlogDrill(d.id); toast("Undone."); }} data-testid={`drill-undo-${d.id}`}>Undo today</button>
        ) : (
          <button className="focusbtn" style={{ color: due ? "var(--acc)" : undefined, borderColor: due ? "var(--acc)" : undefined }} onClick={() => { logDrill(d.id); toast(<><b>Logged</b> {d.title}</>, "ok"); }} data-testid={`drill-log-${d.id}`}>Log ✓</button>
        )}
        <span className="row" style={{ gap: 4, flexWrap: "nowrap" }}>
          <input className="sel" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} aria-label="Backfill date" data-testid={`drill-date-${d.id}`} style={{ padding: "3px 5px", fontSize: 11 }} />
          <button className="sbtn sm ghost" disabled={!isValidKey(date) || date > today} onClick={() => { logDrill(d.id, date); toast(<>Logged for <b>{fmtDate(date)}</b></>, "ok"); setDate(""); }} data-testid={`drill-log-date-${d.id}`}>Log date</button>
        </span>
      </div>
    </div>
  );
}

function WorkoutRow({ d }: { d: Drill }) {
  const log = useForge((s) => s.drillLog[d.id]);
  const logDrill = useForge((s) => s.logDrill);
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const today = useToday();
  const copy = async () => {
    try { await navigator.clipboard.writeText(d.script ?? ""); toast(<><b>Script copied.</b> Paste it into your AI of choice.</>, "ok"); }
    catch { toast("Clipboard unavailable — select the script text and copy manually.", "bad"); }
  };
  return (
    <div className="item" style={{ ["--tc" as string]: trackColorVar(d.trackIds[0]) }} data-testid={`workout-${d.id}`}>
      <span className="i-type" style={{ marginTop: 2 }}>{SOLO_ICON[d.soloOrPartner]}</span>
      <div className="i-main">
        <div className="i-titlerow" onClick={() => setOpen((v) => !v)} role="button" aria-expanded={open} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); } }} data-testid={`workout-expand-${d.id}`}>
          <span className="i-title">{d.title}</span>
          <span className="bdg type">{SOLO_LABEL[d.soloOrPartner]}</span>
          <span className="pill">{d.estMinutes} min</span>
          <span className="pill">{(log ?? []).length} sessions</span>
        </div>
        <div className="muted small" style={{ marginTop: 4 }}>{d.description}</div>
        {open && d.script && (
          <div className="i-detail">
            <span className="lbl">Roleplay script</span>
            <pre className="help" style={{ whiteSpace: "pre-wrap", fontFamily: "var(--sans)", margin: 0 }} data-testid={`workout-script-${d.id}`}>{d.script}</pre>
          </div>
        )}
      </div>
      <div className="i-right">
        <button className="focusbtn" onClick={copy} data-testid={`workout-copy-${d.id}`}>Copy script</button>
        <button className="focusbtn" disabled={(log ?? []).includes(today)} onClick={() => { logDrill(d.id); toast(<><b>Session logged.</b> {d.title}</>, "ok"); }} data-testid={`workout-log-${d.id}`}>Log session</button>
      </div>
    </div>
  );
}

export default function DrillsPage() {
  const today = useToday();
  const plan = usePlan();
  const drillLog = useForge((s) => s.drillLog);
  const completions = useForge((s) => s.completions);
  const [phase, setPhase] = useState<PhaseFilter>(String(plan.phase) as PhaseFilter);
  const habits = content.drills.filter((d) => d.kind === "habit" && drillInPhase(d, phase));
  const workouts = content.drills.filter((d) => d.kind === "workout");
  const dueNow = content.drills.filter((d) => d.kind === "habit" && drillDue(d, drillLog[d.id], today)).length;
  const week = loggedLastNDays(drillLog, 7, today);
  const best = longestStreak(content.drills.filter((d) => d.kind === "habit"), drillLog, today);
  const total = totalLogged(drillLog);
  const cells = heatmap(completions, 91, today);
  const pad = heatPadding(cells[0].key);
  const totals = drillTotals(content.drills, drillLog, today);

  return (
    <div data-testid="page-drills">
      <PageHeader title="🔁 Drills" sub="Recurring habits that compound: papers, posts, demos, discovery calls, outreach. Log them, keep the streaks, and use the roleplay scripts for the soft skills." />
      <div className="stat-grid" data-testid="drills-stats">
        <div className="stat"><div className="big">{dueNow}</div><div className="lb">Due now</div></div>
        <div className="stat"><div className="big">{week}</div><div className="lb">Logged this week</div></div>
        <div className="stat"><div className="big">{best.streak}</div><div className="lb">Longest streak</div><div className="sm">{best.drill ? best.drill.title : "—"}</div></div>
        <div className="stat"><div className="big">{total}</div><div className="lb">Total logged</div></div>
      </div>
      <Card title="Habits" right={<Seg<PhaseFilter> value={phase} onChange={setPhase} testId="drills-phase" options={PHASE_OPTIONS} />}>
        {habits.length === 0 ? <div className="rubric">No habits for this phase.</div> : habits.map((d) => <HabitRow key={d.id} d={d} today={today} />)}
      </Card>
      <Card title="Soft-skill workouts · AI roleplay" className="mt16">
        <div className="help" style={{ marginBottom: 10 }}>Copy a script into an AI assistant (or hand it to a partner) and run the scene. Log the session afterwards; self-review against the rubric in the script.</div>
        {workouts.map((d) => <WorkoutRow key={d.id} d={d} />)}
      </Card>
      <div className="grid-2 mt16">
        <Card title="Activity · last 91 days">
          <div className="heat" data-testid="heatmap" role="img" aria-label="Activity heatmap">
            {Array.from({ length: pad }, (_, i) => <i key={`pad-${i}`} style={{ visibility: "hidden" }} />)}
            {cells.map((c) => <i key={c.key} className={`l${c.level}`} title={`${fmtDate(c.key, { month: "short", day: "numeric", year: "numeric" })} · ${c.count}`} />)}
          </div>
          <div className="row" style={{ marginTop: 8, gap: 6 }}><span className="xs faint">less</span>{[0, 1, 2, 3, 4].map((l) => <i key={l} className={`l${l}`} style={{ width: 11, height: 11, borderRadius: 2, display: "inline-block", background: l === 0 ? "var(--panel2)" : l === 4 ? "var(--acc)" : `color-mix(in srgb, var(--acc) ${[0, 30, 55, 80][l]}%, var(--panel2))`, border: "1px solid var(--line)" }} />)}<span className="xs faint">more</span></div>
        </Card>
        <Card title="Per-drill totals">
          {totals.length === 0 ? <div className="rubric">Nothing logged yet.</div> : (
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Drill</th><th>Total</th><th>Streak</th><th>Last</th></tr></thead><tbody>
              {totals.map((t) => <tr key={t.drill.id}><td>{t.drill.title}</td><td className="mono">{t.total}</td><td className="mono">{t.streak}</td><td className="mono">{t.last ? fmtDate(t.last) : "—"}</td></tr>)}
            </tbody></table></div>
          )}
        </Card>
      </div>
    </div>
  );
}
