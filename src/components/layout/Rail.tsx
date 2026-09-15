import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForge } from "@/store";
import { useOverall, usePace, usePlan, useStreak, useToday } from "@/lib/hooks";
import { fmtHours } from "@/lib/labels";
import { useToast } from "@/components/ui";

// ---------------------------------------------------------------------------
// Coach line (the "mascot" equivalent — a terse, state-aware nudge)
// ---------------------------------------------------------------------------
export function coachLine(o: { todayDone: number; goal: number; streak: number; pace: "ahead" | "onpace" | "behind"; due: number; hour: number; name: string }): { icon: string; line: string } {
  const { todayDone, goal, streak, pace, due, hour } = o;
  if (streak > 0 && streak % 7 === 0 && todayDone > 0) return { icon: "🏆", line: `${streak}-day streak. That's a habit now, not a sprint.` };
  if (todayDone >= goal * 2) return { icon: "🔥", line: `${todayDone} done today. Ship it and go outside.` };
  if (todayDone >= goal && pace === "ahead") return { icon: "😎", line: "Goal met and ahead of plan. Bank the buffer for the projects." };
  if (todayDone >= goal) return { icon: "✅", line: `Daily goal met — ${todayDone} down. Nice.` };
  if (todayDone > 0) return { icon: "🙂", line: `${todayDone} down, ${Math.max(0, goal - todayDone)} to go for today's goal.` };
  if (streak > 0 && hour >= 21) return { icon: "😬", line: `Your ${streak}-day streak dies at midnight. One drill saves it.` };
  if (streak > 0 && hour >= 17) return { icon: "👀", line: `Streak at risk (${streak} days). One item keeps it alive.` };
  if (pace === "behind" && due > 3) return { icon: "🧯", line: `${due} things are due. Pick the smallest and start there.` };
  if (pace === "behind") return { icon: "🧭", line: "Behind the plan. Finish one unblocked item to get moving." };
  if (pace === "ahead") return { icon: "🏇", line: "Ahead of schedule. Pull a project forward — that's where credibility comes from." };
  if (hour >= 23 || hour < 5) return { icon: "😴", line: "Late. Rest beats a sloppy session. Tomorrow, one clean block." };
  if (hour < 12) return { icon: "☕", line: "Fresh day. Pick one item from the queue and go." };
  return { icon: "🛠️", line: "Build in public: an artifact beats a certificate every time." };
}

function CoachCard() {
  const completions = useForge((s) => s.completions);
  const goal = useForge((s) => s.settings.dailyGoal);
  const name = useForge((s) => s.settings.name);
  const streak = useStreak();
  const pace = usePace();
  const plan = usePlan();
  const today = useToday();
  const c = coachLine({ todayDone: completions[today] ?? 0, goal, streak, pace: pace.cls, due: plan.drillsDue.length + plan.next.length, hour: new Date().getHours(), name });
  return (
    <div className="card accent" data-testid="coach">
      <div className="body" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 34, lineHeight: 1, animation: "bob 3.2s ease-in-out infinite" }} aria-hidden="true">{c.icon}</div>
        <div>
          <div className="hero-name" style={{ font: "800 10px/1 var(--mono)", letterSpacing: ".6px", color: "var(--acc)", textTransform: "uppercase", marginBottom: 5 }}>Coach</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.42 }} data-testid="coach-line">{c.line}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pomodoro
// ---------------------------------------------------------------------------
function beep() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = 880; g.gain.value = 0.08;
    o.connect(g); g.connect(ctx.destination); o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, 220);
  } catch { /* ignore */ }
}

export function Pomodoro() {
  const pomo = useForge((s) => s.pomodoro);
  const cfg = useForge((s) => s.settings.pomo);
  const setPomo = useForge((s) => s.setPomodoro);
  const inc = useForge((s) => s.incPomoCount);
  const toast = useToast();
  const [, tick] = useState(0);
  const completedRef = useRef(false);

  const dur = (m: typeof pomo.mode) => (m === "focus" ? cfg.focus : m === "short" ? cfg.short : cfg.long) * 60;
  const remaining = pomo.running && pomo.endTime ? Math.max(0, Math.round((pomo.endTime - Date.now()) / 1000)) : pomo.remaining;
  const total = dur(pomo.mode);
  const pct = total > 0 ? Math.round(((total - remaining) / total) * 100) : 0;

  useEffect(() => {
    if (!pomo.running) return;
    const id = window.setInterval(() => tick((n) => n + 1), 500);
    return () => window.clearInterval(id);
  }, [pomo.running]);

  useEffect(() => {
    if (!pomo.running || remaining > 0) { completedRef.current = false; return; }
    if (completedRef.current) return;
    completedRef.current = true;
    if (cfg.sound) beep();
    if (pomo.mode === "focus") {
      inc();
      const nextRound = pomo.round + 1;
      const long = pomo.round % cfg.rounds === 0;
      setPomo({ running: false, endTime: null, mode: long ? "long" : "short", remaining: (long ? cfg.long : cfg.short) * 60, round: nextRound });
      toast(<><b>Focus block done.</b> Take a {long ? "long" : "short"} break.</>, "ok");
    } else {
      setPomo({ running: false, endTime: null, mode: "focus", remaining: cfg.focus * 60 });
      toast("Break over — back to it.", "info");
    }
  }, [remaining, pomo.running, pomo.mode, pomo.round, cfg, inc, setPomo, toast]);

  const start = () => setPomo({ running: true, endTime: Date.now() + remaining * 1000 });
  const pause = () => setPomo({ running: false, endTime: null, remaining });
  const reset = () => setPomo({ running: false, endTime: null, remaining: dur(pomo.mode) });
  const skip = () => {
    const next: typeof pomo.mode = pomo.mode === "focus" ? (pomo.round % cfg.rounds === 0 ? "long" : "short") : "focus";
    setPomo({ running: false, endTime: null, mode: next, remaining: dur(next), round: pomo.mode === "focus" ? pomo.round + 1 : pomo.round });
  };
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const ringc = pomo.mode === "focus" ? "var(--acc)" : "var(--ok)";

  return (
    <div className="card" data-testid="pomodoro">
      <h3>⏱ Pomodoro</h3>
      <div className="pomo">
        <div className="ring" style={{ ["--pct" as string]: pct, ["--ringc" as string]: ringc }}>
          <div className="t"><div className="clock" data-testid="pomo-clock">{mm}:{ss}</div><div className="mode">{pomo.mode === "focus" ? "Focus" : pomo.mode === "short" ? "Short break" : "Long break"}</div></div>
        </div>
        <div className="dots" aria-label={`Round ${((pomo.round - 1) % cfg.rounds) + 1} of ${cfg.rounds}`}>
          {Array.from({ length: cfg.rounds }, (_, i) => <i key={i} className={i < (pomo.round - 1) % cfg.rounds ? "f" : ""} />)}
        </div>
        <div className="ptask">{pomo.taskTitle ? <>Focusing on <b>{pomo.taskTitle}</b></> : "No task attached — use “Focus” on any item."}</div>
        <div className="pctrl">
          {pomo.running
            ? <button className="pbtn primary" onClick={pause} data-testid="pomo-pause">Pause</button>
            : <button className="pbtn primary" onClick={start} data-testid="pomo-start">Start</button>}
          <button className="pbtn" onClick={reset} data-testid="pomo-reset">Reset</button>
          <button className="pbtn ghost" onClick={skip} data-testid="pomo-skip">Skip ⏭</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rail
// ---------------------------------------------------------------------------
export function Rail() {
  const overall = useOverall();
  const streak = useStreak();
  const pomoCount = useForge((s) => s.pomoCount);
  const plan = usePlan();
  const completions = useForge((s) => s.completions);
  const today = useToday();
  const logDrill = useForge((s) => s.logDrill);
  const toast = useToast();
  const dueDrills = useMemo(() => plan.drillsDue.slice(0, 4), [plan.drillsDue]);

  return (
    <aside className="rail" id="rail" data-testid="rail">
      <CoachCard />
      <Pomodoro />
      <div className="card">
        <h3>📊 At a glance</h3>
        <div className="body">
          <div className="mini"><span>Completed</span><b data-testid="glance-done">{overall.done} / {overall.total}</b></div>
          <div className="mini"><span>Hours logged</span><b>{fmtHours(overall.hoursDone)}</b></div>
          <div className="mini"><span>Day streak</span><b data-testid="glance-streak">{streak} 🔥</b></div>
          <div className="mini"><span>Focus sessions</span><b>{pomoCount}</b></div>
          <div className="mini"><span>Done today</span><b data-testid="glance-today">{completions[today] ?? 0}</b></div>
          <div className="mini"><span>Cards due</span><b>{plan.srs.due}</b></div>
        </div>
      </div>
      <div className="card">
        <h3>🔁 Drills due <span className="grow" /><Link to="/drills" className="linkbtn">All ▸</Link></h3>
        <div className="body">
          {dueDrills.length === 0 ? (
            <div className="rubric">Nothing due right now. Streaks are safe.</div>
          ) : (
            <div className="col" style={{ gap: 6 }}>
              {dueDrills.map((d) => (
                <div key={d.id} className="row" style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
                  <span className="small" style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={d.title}>{d.title}</span>
                  <button className="sbtn sm" onClick={() => { logDrill(d.id); toast(<><b>Logged</b> {d.title}</>, "ok"); }} data-testid={`rail-drill-${d.id}`}>✓ {d.estMinutes}m</button>
                </div>
              ))}
              {plan.drillsDue.length > dueDrills.length && <div className="rubric">+{plan.drillsDue.length - dueDrills.length} more</div>}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
