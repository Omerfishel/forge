import { Link } from "react-router-dom";
import { useForge } from "@/store";
import { useOverall, usePace, usePlan, useStreak } from "@/lib/hooks";
import { fmtHours } from "@/lib/labels";

export function Header() {
  const overall = useOverall();
  const pace = usePace();
  const plan = usePlan();
  const streak = useStreak();
  const settings = useForge((s) => s.settings);
  const update = useForge((s) => s.updateSettings);

  const pct = overall.pct;
  const paceCls = pace.cls === "ahead" ? "tcx-ahead" : pace.cls === "behind" ? "tcx-behind" : "tcx-onpace";

  return (
    <header className="top" data-testid="header">
      <div className="top-in">
        <div className="brandrow">
          <div className="logo" aria-hidden="true" />
          <div className="title">
            <h1>Forge · Product-CTO Track</h1>
            <div className="sub" data-testid="subline">Agent &amp; NHI security · AI-for-cyber · FDE → CPO/CTO &nbsp;·&nbsp; {settings.hoursPerWeek}h/wk</div>
          </div>
          <div className="grow" />
          <div className="hbtns">
            <button className={`iconbtn btn-rail ${settings.railOpen ? "on" : ""}`} onClick={() => update({ railOpen: !settings.railOpen })} title="Toggle side panel" data-testid="btn-rail" aria-pressed={settings.railOpen}>⏱ <span className="blbl">Panel</span></button>
            <button className="iconbtn" onClick={() => update({ theme: settings.theme === "dark" ? "light" : "dark" })} title="Toggle theme" data-testid="btn-theme">{settings.theme === "dark" ? "☀" : "☾"} <span className="blbl">{settings.theme === "dark" ? "Light" : "Dark"}</span></button>
            <Link className="iconbtn" to="/settings" title="Settings" data-testid="btn-settings">⚙ <span className="blbl">Settings</span></Link>
          </div>
        </div>
        <div className="ovwrap">
          <div className="ovmeta" data-testid="ov-meta"><b>{overall.done}</b>/{overall.total} items · <b>{fmtHours(overall.hoursDone)}</b>/{fmtHours(overall.hours)}</div>
          <div className="ovbar" title={`${pct}% of the library complete`}><i style={{ width: `${pct}%` }} data-testid="ov-bar" /></div>
          <div className="ovmeta" data-testid="ov-pct">{pct}%</div>
        </div>
        <div className="topctx" data-testid="topctx">
          <span className="tcx-ph tcx-phase"><span className="tcx-dot" />Phase {plan.phase} · {plan.phaseTitle}</span>
          <span className="tcx-sep">·</span>
          <span className="tcx-i">week {Math.min(plan.week + 1, pace.totalWeeks)} of {pace.totalWeeks}</span>
          <span className="tcx-sep">·</span>
          <span className={paceCls}>{pace.status}</span>
          <span className="tcx-sep">·</span>
          <span className="tcx-i">🔥 {streak}-day streak</span>
        </div>
      </div>
    </header>
  );
}
