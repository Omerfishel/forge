import { useEffect, useMemo } from "react";
import { content } from "@/data";
import { useForge } from "@/store";
import { useOverall, usePace, useStreak, useToday } from "@/lib/hooks";
import { achievements } from "@/lib/achievements";
import { trackStats, itemTitle } from "@/lib/plan";
import { heatmap } from "@/lib/streaks";
import { fmtDate, relTime } from "@/lib/dates";
import { fmtHours, ROLE_LABEL, STATUS_LABEL } from "@/lib/labels";
import { Bar, Card, PageHeader, useToast } from "@/components/ui";
import { heatPadding } from "@/features/drills/lib";

export default function ProgressPage() {
  const today = useToday();
  const overall = useOverall();
  const pace = usePace();
  const streak = useStreak();
  const progress = useForge((s) => s.progress);
  const completions = useForge((s) => s.completions);
  const drillLog = useForge((s) => s.drillLog);
  const pomoCount = useForge((s) => s.pomoCount);
  const notes = useForge((s) => s.notes);
  const reviewed = useForge((s) => s.srsReviewedToday);
  const settings = useForge((s) => s.settings);
  const update = useForge((s) => s.updateSettings);
  const celebrated = useForge((s) => s.celebrated);
  const markCelebrated = useForge((s) => s.markCelebrated);
  const toast = useToast();

  const reviewedTotal = Object.values(reviewed).reduce((a, b) => a + b, 0);
  const drillsTotal = Object.values(drillLog).reduce((a, l) => a + l.length, 0);
  const doneToday = completions[today] ?? 0;
  const list = useMemo(() => achievements({ bundle: content, progress, completions, drillLog, pomoCount, notesCount: notes.length, srsReviewed: reviewedTotal, paceAhead: pace.cls === "ahead" }), [progress, completions, drillLog, pomoCount, notes.length, reviewedTotal, pace.cls]);
  const got = list.filter((a) => a.done).length;

  useEffect(() => {
    for (const a of list) if (a.done && !celebrated[a.id]) { markCelebrated(a.id); toast(<>🏆 <b>Achievement unlocked:</b> {a.name}</>, "ok"); }
  }, [list, celebrated, markCelebrated, toast]);

  const cells = heatmap(completions, 91, today);
  const pad = heatPadding(cells[0].key);
  const recent = Object.values(progress).filter((p) => p.updatedAt).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 12);
  const tracks = [...content.tracks].sort((a, b) => a.priorityRank - b.priorityRank);

  return (
    <div data-testid="page-progress">
      <PageHeader title="📊 Progress" sub="Pace against the active path, per-track completion, streaks, achievements and recent activity." />
      <div className="stat-grid">
        <div className="stat" data-testid="stat-done"><div className="big">{overall.done}<span className="muted" style={{ fontSize: 16 }}>/{overall.total}</span></div><div className="lb">Items done</div><div className="sm">{overall.pct}% of everything</div></div>
        <div className="stat" data-testid="stat-hours"><div className="big">{fmtHours(overall.hoursDone)}</div><div className="lb">Hours logged</div><div className="sm">of ~{fmtHours(overall.hours)} estimated</div></div>
        <div className="stat" data-testid="stat-streak"><div className="big">{streak}</div><div className="lb">Day streak 🔥</div></div>
        <div className="stat" data-testid="stat-pomo"><div className="big">{pomoCount}</div><div className="lb">Focus sessions</div></div>
        <div className="stat" data-testid="stat-cards"><div className="big">{reviewedTotal}</div><div className="lb">Cards reviewed</div></div>
        <div className="stat" data-testid="stat-drills"><div className="big">{drillsTotal}</div><div className="lb">Drills logged</div></div>
      </div>

      <div className="grid-2 mb16" style={{ alignItems: "start" }}>
        <div className={`card`} style={{ borderColor: pace.cls === "ahead" ? "color-mix(in srgb, var(--ok) 45%, var(--line-solid))" : pace.cls === "behind" ? "color-mix(in srgb, var(--warn) 45%, var(--line-solid))" : undefined }} data-testid="pace-card">
          <div className="card-h">Pace · week {pace.week + 1} of {pace.totalWeeks}</div>
          <div className="body">
            <div style={{ fontWeight: 750, fontSize: 18, color: pace.cls === "ahead" ? "var(--ok)" : pace.cls === "behind" ? "var(--warn)" : "var(--acc)" }}>{pace.status}</div>
            <p className="small muted" style={{ margin: "8px 0 12px" }}>{pace.msg}</p>
            <div className="col" style={{ gap: 8 }}>
              <div className="row" style={{ flexWrap: "nowrap" }}><span className="small" style={{ width: 96 }}>Expected</span><div style={{ flex: 1 }}><Bar pct={pace.expPct} color="var(--faint)" /></div><span className="mono xs muted" style={{ width: 84, textAlign: "right" }}>{pace.expected} · {pace.expPct}%</span></div>
              <div className="row" style={{ flexWrap: "nowrap" }}><span className="small" style={{ width: 96 }}>Actual</span><div style={{ flex: 1 }}><Bar pct={pace.actPct} color="var(--acc)" /></div><span className="mono xs muted" style={{ width: 84, textAlign: "right" }}>{pace.actual} · {pace.actPct}%</span></div>
            </div>
          </div>
        </div>
        <Card title="Daily goal">
          <div className="row" style={{ gap: 12 }}>
            <span className="mono" style={{ font: "750 20px/1 var(--mono)", color: "var(--acc)", minWidth: 56 }} data-testid="goal-value">{doneToday} / {settings.dailyGoal}</span>
            <div style={{ flex: 1 }}><Bar pct={(doneToday / Math.max(1, settings.dailyGoal)) * 100} color="var(--acc)" height={12} /></div>
            <div className="row" style={{ gap: 6 }}>
              <button className="sbtn sm" onClick={() => update({ dailyGoal: Math.max(1, settings.dailyGoal - 1) })} disabled={settings.dailyGoal <= 1} aria-label="Decrease daily goal" data-testid="goal-dec">−</button>
              <button className="sbtn sm" onClick={() => update({ dailyGoal: Math.min(10, settings.dailyGoal + 1) })} disabled={settings.dailyGoal >= 10} aria-label="Increase daily goal" data-testid="goal-inc">+</button>
            </div>
          </div>
          <div className="small muted" style={{ marginTop: 12 }}>{doneToday >= settings.dailyGoal ? "Goal met — anything more is a buffer." : `${settings.dailyGoal - doneToday} more today keeps the ${streak > 0 ? `${streak}-day ` : ""}streak alive.`}</div>
          <div className="row" style={{ marginTop: 10, gap: 6 }}><span className="lbl" style={{ margin: 0 }}>Role filter</span><span className="bdg type">{settings.roleFilter === "all" ? "all roles" : ROLE_LABEL[settings.roleFilter]}</span></div>
        </Card>
      </div>

      <Card title="Per-track progress" className="mb16">
        <div className="bars">
          {tracks.map((t) => { const s = trackStats(content, progress, t.id, settings.roleFilter); return (
            <div key={t.id} className="brow" data-testid={`track-bar-${t.id}`}>
              <div className="bn"><span className="sq" style={{ background: t.color }} />{t.code} · {t.name}</div>
              <div className="bt"><i style={{ width: `${s.pct}%`, background: t.color }} /></div>
              <div className="bv">{s.done}/{s.total} · {s.pct}%</div>
            </div>
          ); })}
        </div>
      </Card>

      <Card title="Achievements" right={<span className="pill" data-testid="badges-count">{got} of {list.length} unlocked</span>} className="mb16">
        <div className="badges">{list.map((a) => <div key={a.id} className={`badge ${a.done ? "got" : "locked"}`} data-testid={`badge-${a.id}`} title={a.desc}><div className="bi">{a.icon}</div><div className="bnm">{a.name}</div><div className="bd">{a.desc}</div></div>)}</div>
      </Card>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <Card title="Activity · last 91 days">
          <div className="heat" data-testid="heatmap" role="img" aria-label="Activity heatmap">
            {Array.from({ length: pad }, (_, i) => <i key={`pad-${i}`} style={{ visibility: "hidden" }} />)}
            {cells.map((c) => <i key={c.key} className={`l${c.level}`} title={`${fmtDate(c.key, { month: "short", day: "numeric", year: "numeric" })} · ${c.count}`} />)}
          </div>
        </Card>
        <Card title="Recent activity">
          {recent.length === 0 ? <div className="rubric">Nothing yet — complete an item to see it here.</div> : (
            <div className="col" style={{ gap: 6 }} data-testid="activity-list">
              {recent.map((p) => <div key={p.itemId} className="row" style={{ justifyContent: "space-between", flexWrap: "nowrap" }}><span className="small" style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{itemTitle(content, p.itemId)}</span><span className="row" style={{ gap: 6, flexWrap: "nowrap" }}><span className={`bdg ${p.status === "done" ? "ok" : p.status === "in_progress" ? "info" : "type"}`}>{STATUS_LABEL[p.status]}</span><span className="xs faint" style={{ whiteSpace: "nowrap" }}>{relTime(p.updatedAt)}</span></span></div>)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
