import { useMemo, useState } from "react";
import { content } from "@/data";
import { useForge } from "@/store";
import { useToday } from "@/lib/hooks";
import { drillDue, drillStreak } from "@/lib/streaks";
import { relTime } from "@/lib/dates";
import { PRIORITY_ORDER } from "@/lib/labels";
import type { ResourceType } from "@/types";
import { Card, Chip, Empty, Md, PageHeader, Switch, useConfirm, useToast } from "@/components/ui";
import { ResourceRow } from "@/components/ResourceRow";

const READING_TYPES: ResourceType[] = ["paper", "article", "newsletter", "framework"];
const TYPE_FILTERS: { key: "all" | ResourceType; label: string }[] = [
  { key: "all", label: "All" }, { key: "paper", label: "Papers" }, { key: "article", label: "Articles" }, { key: "newsletter", label: "Newsletters" }, { key: "framework", label: "Frameworks" },
];
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export default function ReadingPage() {
  const today = useToday();
  const notes = useForge((s) => s.notes);
  const drillLog = useForge((s) => s.drillLog["d-paper-week"]);
  const progress = useForge((s) => s.progress);
  const logDrill = useForge((s) => s.logDrill);
  const addNote = useForge((s) => s.addNote);
  const updateNote = useForge((s) => s.updateNote);
  const deleteNote = useForge((s) => s.deleteNote);
  const toast = useToast();
  const { confirm, node: confirmNode } = useConfirm();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [filter, setFilter] = useState<"all" | ResourceType>("all");
  const [hideDone, setHideDone] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const paperDrill = content.drills.find((d) => d.id === "d-paper-week");
  const due = paperDrill ? drillDue(paperDrill, drillLog, today) : false;
  const streak = paperDrill ? drillStreak(paperDrill, drillLog, today) : 0;
  const paperNotes = useMemo(() => notes.filter((n) => n.tags.includes("paper")), [notes]);

  const queueRows = useMemo(() => content.resources
    .filter((r) => READING_TYPES.includes(r.resourceType) && (filter === "all" || r.resourceType === filter) && (!hideDone || progress[r.id]?.status !== "done"))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.trackIds[0].localeCompare(b.trackIds[0]) || a.title.localeCompare(b.title)), [filter, hideDone, progress]);

  const save = () => {
    if (!title.trim()) return;
    const body = `${url.trim() ? url.trim() + "\n\n" : ""}${summary.trim()}`;
    addNote({ title: title.trim(), body, tags: ["paper"], itemId: "d-paper-week" });
    logDrill("d-paper-week");
    toast(<><b>Paper logged.</b> Streak {streak + (due ? 1 : 0)} 🔥</>, "ok");
    setTitle(""); setUrl(""); setSummary(""); setOpen(false);
  };

  return (
    <div data-testid="page-reading">
      <PageHeader title="📄 Reading" sub="One paper a week with a 200-word summary, plus the frameworks, articles and newsletters that keep you current." />
      <Card title="📚 1 paper / week" className="accent" testId="paper-tracker" right={<span className={`bdg ${due ? "must" : "ok"}`}>{due ? "Due this week" : "Done this week"}</span>}>
        <div className="row" style={{ gap: 18 }}>
          <div><div className="streak-num">{streak} 🔥</div><div className="lb" style={{ marginTop: 2 }}>week streak</div></div>
          <div><div className="streak-num">{(drillLog ?? []).length}</div><div className="lb" style={{ marginTop: 2 }}>papers logged</div></div>
          <div><div className="streak-num">{paperNotes.length}</div><div className="lb" style={{ marginTop: 2 }}>summaries</div></div>
          <span className="grow" />
          {!open && <button className="sbtn primary" onClick={() => setOpen(true)} data-testid="paper-log-open">+ Log this week's paper</button>}
        </div>
        {open && (
          <div className="frm" style={{ marginTop: 14 }} data-testid="paper-form">
            <div className="row2">
              <label>Title <input className="fi" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. PentestGPT (USENIX Security 2024)" data-testid="paper-title" /></label>
              <label>URL <input className="fi" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://arxiv.org/abs/…" data-testid="paper-url" /></label>
            </div>
            <label>200-word summary <span className="xs faint">({words(summary)} words)</span>
              <textarea className="ta" style={{ minHeight: 120 }} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="What problem, what method, what result, what it means for agent security…" data-testid="paper-summary" />
            </label>
            <div className="row">
              <button className="sbtn primary" disabled={!title.trim()} onClick={save} data-testid="paper-save">Save + log week</button>
              <button className="sbtn ghost" onClick={() => setOpen(false)} data-testid="paper-cancel">Cancel</button>
              {!title.trim() && <span className="xs faint">Title is required.</span>}
            </div>
          </div>
        )}
      </Card>

      <div className="grid-2 mt16" style={{ alignItems: "start" }}>
        <Card title="Reading queue" right={<label className="tog"><Switch checked={hideDone} onChange={setHideDone} label="Hide done" testId="reading-hide-done" /> hide done</label>}>
          <div className="chips" style={{ marginBottom: 10 }}>{TYPE_FILTERS.map((t) => <Chip key={t.key} small on={filter === t.key} onClick={() => setFilter(t.key)} testId={`reading-filter-${t.key}`}>{t.label}</Chip>)}</div>
          {queueRows.length === 0 ? <Empty>Nothing in the queue for this filter.</Empty> : queueRows.map((r) => <ResourceRow key={r.id} r={r} prefix="reading" />)}
        </Card>
        <Card title="Paper log" right={<span className="pill">{paperNotes.length}</span>}>
          {paperNotes.length === 0 ? <Empty>No summaries yet. Log this week's paper above.</Empty> : paperNotes.map((n) => (
            <div key={n.id} className="item" style={{ ["--tc" as string]: "var(--t7)" }} data-testid={`paper-note-${n.id}`}>
              <span className="i-type" style={{ marginTop: 2 }}>📄</span>
              <div className="i-main">
                {editing === n.id ? (
                  <div className="col">
                    <input className="fi" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} aria-label="Title" data-testid={`paper-edit-title-${n.id}`} />
                    <textarea className="ta" value={editBody} onChange={(e) => setEditBody(e.target.value)} aria-label="Body" data-testid={`paper-edit-body-${n.id}`} />
                    <div className="row"><button className="sbtn primary sm" onClick={() => { updateNote(n.id, { title: editTitle.trim() || n.title, body: editBody }); setEditing(null); toast("Saved.", "ok"); }} data-testid={`paper-edit-save-${n.id}`}>Save</button><button className="sbtn sm ghost" onClick={() => setEditing(null)}>Cancel</button></div>
                  </div>
                ) : (
                  <>
                    <div className="i-titlerow" style={{ cursor: "default" }}><span className="i-title">{n.title}</span><span className="faint xs">{relTime(n.updatedAt)}</span></div>
                    <div className="small muted" style={{ marginTop: 4 }}><Md text={n.body} /></div>
                  </>
                )}
              </div>
              <div className="i-right">
                <button className="focusbtn" onClick={() => { setEditing(n.id); setEditTitle(n.title); setEditBody(n.body); }} data-testid={`paper-edit-${n.id}`}>Edit</button>
                <button className="focusbtn" onClick={async () => { if (await confirm(<>Delete “{n.title}”? This does not undo the week's log.</>)) { deleteNote(n.id); toast("Deleted."); } }} data-testid={`paper-delete-${n.id}`}>Delete</button>
              </div>
            </div>
          ))}
        </Card>
      </div>
      {confirmNode}
    </div>
  );
}
