import { useState } from "react";
import { Link } from "react-router-dom";
import { content } from "@/data";
import { useForge } from "@/store";
import { usePace, usePlan, useStreak, useToday } from "@/lib/hooks";
import { fmtLong, parseKey } from "@/lib/dates";
import { fmtHours, TYPE_ICON, trackColorVar } from "@/lib/labels";
import { findItem } from "@/lib/plan";
import { iconForType, routeForItem } from "@/lib/routes";
import { Accordion, Bar, Card, Empty, PriorityBdg, TrackBdg, useToast } from "@/components/ui";
import type { PathItemType } from "@/types";

function trackOf(id: string) {
  const f = findItem(content, id);
  if (!f) return undefined;
  const tid = f.kind === "assessment" ? f.item.trackId : f.kind === "milestone" ? undefined : f.item.trackIds[0];
  return tid ? content.tracks.find((t) => t.id === tid) : undefined;
}

export default function DashboardPage() {
  const plan = usePlan();
  const pace = usePace();
  const streak = useStreak();
  const today = useToday();
  const settings = useForge((s) => s.settings);
  const completions = useForge((s) => s.completions);
  const progress = useForge((s) => s.progress);
  const toggleDone = useForge((s) => s.toggleDone);
  const setStatus = useForge((s) => s.setStatus);
  const setPomodoro = useForge((s) => s.setPomodoro);
  const logDrill = useForge((s) => s.logDrill);
  const collapsed = useForge((s) => s.ui.collapsed);
  const setCollapsed = useForge((s) => s.setCollapsed);
  const toast = useToast();

  const doneToday = completions[today] ?? 0;
  const goal = settings.dailyGoal;
  const nextLesson = plan.next[0];
  const nextDrill = plan.drillsDue[0];
  const inProgress = Object.values(progress).filter((p) => p.status === "in_progress" && findItem(content, p.itemId)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const blockedOpen = collapsed["today-blocked"] === undefined ? false : !collapsed["today-blocked"]; // collapsed by default
  // Items completed during this visit stay visible (done) so a mis-click can be undone.
  const [sessionDone, setSessionDone] = useState<typeof plan.next>([]);
  const weekRows = [...plan.next, ...sessionDone.filter((d) => !plan.next.some((n) => n.item.itemId === d.item.itemId))];

  const done = (id: string, type: PathItemType) => {
    const wasDone = progress[id]?.status === "done";
    toggleDone(id, type as never);
    if (!wasDone) {
      const row = plan.next.find((n) => n.item.itemId === id);
      if (row) setSessionDone((l) => (l.some((x) => x.item.itemId === id) ? l : [...l, row]));
      toast(<><b>Done.</b> {findItem(content, id)?.item.title}</>, "ok");
    } else setSessionDone((l) => l.filter((x) => x.item.itemId !== id));
  };

  return (
    <div data-testid="page-dashboard">
      <div className="hero">
        <div className="hero-icon" aria-hidden="true">🎯</div>
        <div>
          <div className="hero-name">Today</div>
          <div className="hero-line">{fmtLong(parseKey(today))}</div>
          <div className="fmeta" style={{ marginTop: 4 }}>Program start {settings.startDate} · week {plan.week + 1} of {pace.totalWeeks} · Phase {plan.phase}: {plan.phaseTitle}</div>
        </div>
      </div>

      <div className={`pacebanner ${pace.cls}`} data-testid="pace-banner">
        <b>{pace.status}</b> — {pace.msg}
        <Link className="chip sm" to="/progress" style={{ marginLeft: "auto" }}>Details ▸</Link>
      </div>

      <div className="stat-grid" data-testid="today-stats">
        <div className="stat"><div className="big">{doneToday}<span className="muted" style={{ fontSize: 16 }}>/{goal}</span></div><div className="lb">Done today</div><div style={{ marginTop: 8 }}><Bar pct={goal ? (doneToday / goal) * 100 : 0} color="var(--acc)" height={6} /></div></div>
        <div className="stat"><div className="big">{streak}</div><div className="lb">Day streak 🔥</div><div className="sm">{streak > 0 ? "keep it alive today" : "one item starts it"}</div></div>
        <div className="stat"><div className="big">{plan.drillsDue.length}</div><div className="lb">Drills due</div><div className="sm"><Link to="/drills">open drills ▸</Link></div></div>
        <div className="stat"><div className="big">{plan.srs.due}</div><div className="lb">Cards due</div><div className="sm">{plan.srs.fresh} new · <Link to="/review">review ▸</Link></div></div>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <Card title="🗓 This week" right={<span className="pill">{plan.next.length} next</span>} testId="week-card">
          {weekRows.length === 0 ? (
            <Empty>Nothing unblocked in the active path. Finish a prerequisite or switch paths.</Empty>
          ) : (
            <div data-testid="week-list">
              {weekRows.map((n) => {
                const f = findItem(content, n.item.itemId);
                if (!f) return null;
                const tr = trackOf(n.item.itemId);
                const isDone = progress[n.item.itemId]?.status === "done";
                const icon = f.kind === "resource" ? TYPE_ICON[f.item.resourceType] : iconForType(n.item.itemType);
                return (
                  <div key={n.item.itemId} className={`item ${isDone ? "done" : ""}`} style={{ ["--tc" as string]: tr ? trackColorVar(tr.id) : undefined }} data-testid={`week-item-${n.item.itemId}`}>
                    <input type="checkbox" className="cbx" checked={isDone} onChange={() => done(n.item.itemId, n.item.itemType)} aria-label={`Mark ${n.title} done`} data-testid={`week-done-${n.item.itemId}`} />
                    <div className="i-main">
                      <div className="i-titlerow" style={{ cursor: "default" }}>
                        <span className="i-type">{icon}</span>
                        <Link className="i-title" to={routeForItem(content, n.item.itemId)} style={{ color: "var(--ink)" }}>{n.title}</Link>
                        {n.inProgress && <span className="bdg info">in progress</span>}
                      </div>
                      <div className="i-badges">
                        {tr && <TrackBdg trackId={tr.id} code={tr.code} />}
                        {f.kind === "resource" && <PriorityBdg priority={f.item.priority} />}
                        <span className="bdg type">{n.item.itemType}</span>
                        {n.item.note && <span className="faint xs">{n.item.note}</span>}
                      </div>
                    </div>
                    <div className="i-right">
                      <span className="hrs">{n.hours ? fmtHours(n.hours) : ""}</span>
                      {f.kind === "resource" && <a className="focusbtn" href={f.item.url} target="_blank" rel="noreferrer" data-testid={`week-open-${n.item.itemId}`}>Open ↗</a>}
                      <button className="focusbtn" onClick={() => { setPomodoro({ taskId: n.item.itemId, taskTitle: n.title }); toast(<>Pomodoro set to <b>{n.title}</b></>); }} data-testid={`week-focus-${n.item.itemId}`}>⏱ Focus</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: 12 }} data-testid="week-hours">
            <div className="row" style={{ justifyContent: "space-between" }}><span className="fmeta">{plan.plannedHours}h planned of {plan.budgetHours}h this week</span><span className="fmeta">{Math.min(100, Math.round((plan.plannedHours / Math.max(1, plan.budgetHours)) * 100))}%</span></div>
            <div style={{ marginTop: 6 }}><Bar pct={(plan.plannedHours / Math.max(1, plan.budgetHours)) * 100} color={plan.plannedHours > plan.budgetHours ? "var(--warn)" : "var(--ok)"} height={7} /></div>
          </div>
        </Card>

        <div className="col" style={{ gap: 16 }}>
          <Card title="⚡ Today's queue" testId="queue-card">
            <div className="col" style={{ gap: 10 }}>
              <div className="deliver" data-testid="queue-lesson">
                <span className="lbl">Next lesson</span>
                {nextLesson ? <Link to={routeForItem(content, nextLesson.item.itemId)}>{nextLesson.title}</Link> : <span className="muted">Nothing queued — all unblocked items are done.</span>}
              </div>
              <div className="deliver" style={{ borderLeftColor: "var(--warn)" }} data-testid="queue-drill">
                <span className="lbl" style={{ color: "var(--warn)" }}>One drill</span>
                {nextDrill ? (
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span>{nextDrill.title} <span className="faint xs">· {nextDrill.estMinutes} min</span></span>
                    <button className="sbtn sm" onClick={() => { logDrill(nextDrill.id); toast(<><b>Logged</b> {nextDrill.title}</>, "ok"); }} data-testid="queue-drill-log">Log ✓</button>
                  </div>
                ) : <span className="muted">No drills due right now.</span>}
              </div>
              <div className="deliver" style={{ borderLeftColor: "var(--info)" }} data-testid="queue-review">
                <span className="lbl" style={{ color: "var(--info)" }}>Spaced repetition</span>
                <span>{plan.srs.due} cards due · {plan.srs.fresh} new · </span><Link to="/review" data-testid="queue-review-link">review now ▸</Link>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <span className="lbl">Continue</span>
              {inProgress.length === 0 ? <div className="rubric">Nothing in progress. Start something from the week list.</div> : (
                <div className="col" style={{ gap: 4 }} data-testid="continue-list">
                  {inProgress.map((p) => <Link key={p.itemId} to={routeForItem(content, p.itemId)} className="small">{iconForType(p.itemType)} {findItem(content, p.itemId)?.item.title}{p.percentComplete ? <span className="faint xs"> · {p.percentComplete}%</span> : null}</Link>)}
                </div>
              )}
            </div>
          </Card>

          <Card title={`🏁 Milestones · phase ${plan.phase}`} testId="milestones-card">
            {plan.milestones.length === 0 ? <div className="rubric">No milestones defined for this phase.</div> : plan.milestones.map((m) => {
              const isDone = progress[m.id]?.status === "done";
              return (
                <div key={m.id} className={`item ${isDone ? "done" : ""}`} style={{ ["--tc" as string]: "var(--acc)" }} data-testid={`milestone-row-${m.id}`}>
                  <input type="checkbox" className="cbx" checked={isDone} onChange={() => setStatus(m.id, "milestone", isDone ? "todo" : "done")} aria-label={`Mark ${m.title} done`} data-testid={`milestone-${m.id}`} />
                  <div className="i-main">
                    <div className="i-titlerow" style={{ cursor: "default" }}><span className="i-type">🏁</span><span className="i-title">{m.title}</span><span className="pill">target week {m.targetWeek}</span></div>
                    <div className="muted small" style={{ marginTop: 4 }}>{m.criteria}</div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Accordion title="⛔ Blocked" meta={`${plan.blocked.length} waiting on prerequisites`} color="var(--bad)" open={blockedOpen} onToggle={() => setCollapsed("today-blocked", blockedOpen)} testId="blocked-toggle">
          {plan.blocked.length === 0 ? <Empty>Nothing is blocked.</Empty> : (
            <div data-testid="blocked-list">
              {plan.blocked.map((b) => (
                <div key={b.item.itemId} className="item blocked" style={{ ["--tc" as string]: "var(--bad)" }}>
                  <span />
                  <div className="i-main">
                    <div className="i-titlerow" style={{ cursor: "default" }}><span className="i-type">{iconForType(b.item.itemType)}</span><Link className="i-title" to={routeForItem(content, b.item.itemId)} style={{ color: "var(--ink)" }}>{b.title}</Link></div>
                    <div className="faint xs" style={{ marginTop: 4 }}>Blocked by: {b.blockers.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Accordion>
      </div>
    </div>
  );
}
