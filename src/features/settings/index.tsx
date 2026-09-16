import { useRef, useState } from "react";
import { content } from "@/data";
import { useForge, type Theme } from "@/store";
import { isValidKey } from "@/lib/dates";
import { ROLE_LABEL } from "@/lib/labels";
import { ROLES, type RoleRelevance } from "@/types";
import { Card, PageHeader, Seg, Switch, useConfirm, useToast } from "@/components/ui";

function download(name: string, text: string) {
  try {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { /* ignore */ }
}

export default function SettingsPage() {
  const settings = useForge((s) => s.settings);
  const update = useForge((s) => s.updateSettings);
  const pomodoro = useForge((s) => s.pomodoro);
  const setPomodoro = useForge((s) => s.setPomodoro);
  const exportState = useForge((s) => s.exportState);
  const importState = useForge((s) => s.importState);
  const resetAll = useForge((s) => s.resetAll);
  const toast = useToast();
  const { confirm, node } = useConfirm();
  const [exported, setExported] = useState("");
  const [importText, setImportText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const num = (v: string, min: number, max: number, fallback: number) => { const n = Number(v); return Number.isFinite(n) && n >= min && n <= max ? n : fallback; };
  const setPomo = (patch: Partial<typeof settings.pomo>) => {
    const pomo = { ...settings.pomo, ...patch };
    update({ pomo });
    if (!pomodoro.running) {
      const mins = pomodoro.mode === "focus" ? pomo.focus : pomodoro.mode === "short" ? pomo.short : pomo.long;
      setPomodoro({ remaining: mins * 60, endTime: null });
    }
  };
  const doExport = () => { const json = exportState(); setExported(json); download(`forge-backup-${new Date().toISOString().slice(0, 10)}.json`, json); toast(<><b>Backup exported.</b></>, "ok"); };
  const doImport = (text: string) => {
    try {
      const data = JSON.parse(text);
      if (importState(data)) { toast(<><b>Imported.</b> Progress, notes and settings restored.</>, "ok"); setImportText(""); }
      else toast("That file doesn't look like a Forge backup.", "bad");
    } catch { toast("Invalid JSON.", "bad"); }
  };

  return (
    <div data-testid="page-settings">
      <PageHeader title="⚙️ Settings" sub="Profile, plan parameters, Pomodoro, backups. Everything saves instantly to this browser." />
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="col" style={{ gap: 16 }}>
          <Card title="Profile & plan">
            <div className="frm">
              <label>Name<input className="fi" value={settings.name} onChange={(e) => update({ name: e.target.value })} data-testid="set-name" /></label>
              <label>Theme<Seg<Theme> value={settings.theme} onChange={(v) => update({ theme: v })} testId="set-theme" options={[{ value: "dark", label: "☾ Dark" }, { value: "light", label: "☀ Light" }]} /></label>
              <label>Program start date (Monday recommended)
                <input className="fi" type="date" value={settings.startDate} onChange={(e) => { if (isValidKey(e.target.value)) { update({ startDate: e.target.value }); toast(<>Plan re-based to <b>{e.target.value}</b></>, "ok"); } }} data-testid="set-start" />
                <span className="xs faint">Phases, week numbers and pace are computed from this date.</span>
              </label>
              <div className="row2">
                <label>Hours per week<input className="fi" type="number" min={1} max={60} value={settings.hoursPerWeek} onChange={(e) => update({ hoursPerWeek: num(e.target.value, 1, 60, settings.hoursPerWeek) })} data-testid="set-hours" /></label>
                <label>Daily goal (items)<input className="fi" type="number" min={1} max={10} value={settings.dailyGoal} onChange={(e) => update({ dailyGoal: num(e.target.value, 1, 10, settings.dailyGoal) })} data-testid="set-goal" /></label>
              </div>
              <label>Active path
                <select className="fi" value={settings.activePathId} onChange={(e) => { update({ activePathId: e.target.value }); toast(<>Active path: <b>{content.paths.find((p) => p.id === e.target.value)?.name}</b></>, "ok"); }} data-testid="set-path">
                  {content.paths.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.durationMonths} mo · {p.hoursPerWeek}h/wk</option>)}
                </select>
              </label>
              <label>Default role filter
                <select className="fi" value={settings.roleFilter} onChange={(e) => update({ roleFilter: e.target.value as RoleRelevance | "all" })} data-testid="set-role">
                  <option value="all">All roles</option>{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </select>
              </label>
              <label className="inline">Keep the left menu expanded<Switch checked={settings.navPinned} onChange={(v) => update({ navPinned: v })} label="Pin navigation" testId="set-nav-pinned" /></label>
              <label className="inline">Show the side panel (coach, Pomodoro, drills)<Switch checked={settings.railOpen} onChange={(v) => update({ railOpen: v })} label="Side panel" testId="set-rail" /></label>
            </div>
          </Card>
          <Card title="⏱ Pomodoro">
            <div className="frm">
              <div className="row2">
                <label>Focus (min)<input className="fi" type="number" min={1} max={120} value={settings.pomo.focus} onChange={(e) => setPomo({ focus: num(e.target.value, 1, 120, settings.pomo.focus) })} data-testid="set-pomo-focus" /></label>
                <label>Short break (min)<input className="fi" type="number" min={1} max={60} value={settings.pomo.short} onChange={(e) => setPomo({ short: num(e.target.value, 1, 60, settings.pomo.short) })} data-testid="set-pomo-short" /></label>
              </div>
              <div className="row2">
                <label>Long break (min)<input className="fi" type="number" min={1} max={90} value={settings.pomo.long} onChange={(e) => setPomo({ long: num(e.target.value, 1, 90, settings.pomo.long) })} data-testid="set-pomo-long" /></label>
                <label>Rounds before long break<input className="fi" type="number" min={1} max={12} value={settings.pomo.rounds} onChange={(e) => setPomo({ rounds: num(e.target.value, 1, 12, settings.pomo.rounds) })} data-testid="set-pomo-rounds" /></label>
              </div>
              <label className="inline">Sound at the end of a block<Switch checked={settings.pomo.sound} onChange={(v) => update({ pomo: { ...settings.pomo, sound: v } })} label="Pomodoro sound" testId="set-pomo-sound" /></label>
            </div>
          </Card>
        </div>
        <div className="col" style={{ gap: 16 }}>
          <Card title="💾 Data">
            <div className="frm">
              <div>
                <div className="row"><button className="sbtn primary" onClick={doExport} data-testid="set-export">⬇ Export JSON backup</button>{exported && <button className="sbtn" onClick={async () => { try { await navigator.clipboard.writeText(exported); toast("Copied.", "ok"); } catch { toast("Clipboard unavailable.", "bad"); } }} data-testid="set-copy">Copy</button>}</div>
                {exported && <textarea className="ta" readOnly value={exported} style={{ marginTop: 8, minHeight: 90, fontFamily: "var(--mono)", fontSize: 11 }} aria-label="Exported JSON" data-testid="set-export-text" />}
              </div>
              <div>
                <span className="lbl">Import a backup</span>
                <textarea className="ta" value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste backup JSON here…" style={{ minHeight: 90, fontFamily: "var(--mono)", fontSize: 11 }} aria-label="Import JSON" data-testid="set-import-text" />
                <div className="row" style={{ marginTop: 8 }}>
                  <button className="sbtn" disabled={!importText.trim()} onClick={() => doImport(importText)} data-testid="set-import">Import pasted JSON</button>
                  <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => doImport(String(rd.result ?? "")); rd.readAsText(f); e.target.value = ""; }} data-testid="set-import-file" />
                  <button className="sbtn ghost" onClick={() => fileRef.current?.click()} data-testid="set-import-file-btn">Choose file…</button>
                </div>
                <div className="help" style={{ marginTop: 8 }}>Importing replaces current progress, notes, flashcard schedules and settings with the backup's.</div>
              </div>
              <div>
                <button className="dangerbtn" onClick={async () => { if (await confirm("Reset ALL progress, notes, flashcards and settings? Export a backup first.")) { resetAll(); toast("Everything reset.", "bad"); } }} data-testid="set-reset">Reset all progress</button>
              </div>
            </div>
          </Card>
          <Card title="About" testId="about-card">
            <div className="mini"><span>Content version</span><b>{content.meta.version} · {content.meta.generated}</b></div>
            <div className="mini"><span>Resources · projects · drills</span><b>{content.resources.length} · {content.projects.length} · {content.drills.length}</b></div>
            <div className="mini"><span>Flashcards · assessments · paths</span><b>{content.cards.length} · {content.assessments.length} · {content.paths.length}</b></div>
            <div style={{ marginTop: 10 }}><span className="lbl">Sources</span><ul className="xs muted" style={{ margin: 0, paddingLeft: 16 }}>{content.meta.sourceDocs.map((d) => <li key={d}>{d}</li>)}</ul></div>
            <div style={{ marginTop: 10 }}><span className="lbl">Keyboard</span>
              <table className="tbl"><tbody>
                <tr><td><span className="kbd">/</span></td><td className="muted">Focus the library search</td></tr>
                <tr><td><span className="kbd">Space</span></td><td className="muted">Reveal the flashcard answer</td></tr>
                <tr><td><span className="kbd">1–4</span></td><td className="muted">Grade the card (Again / Hard / Good / Easy)</td></tr>
                <tr><td><span className="kbd">Esc</span></td><td className="muted">Close a dialog</td></tr>
              </tbody></table>
            </div>
          </Card>
        </div>
      </div>
      {node}
    </div>
  );
}
