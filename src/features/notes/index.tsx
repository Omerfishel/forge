import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { content } from "@/data";
import { useForge } from "@/store";
import { relTime } from "@/lib/dates";
import type { Note } from "@/types";
import { Chip, Empty, Md, PageHeader, Seg, useConfirm, useToast } from "@/components/ui";
import { allTags, exportMarkdown, filterNotes, linkValueOf, parseLinkValue, parseTags, resolveLink, type LinkFilter, type NoteDraft, type SortDir } from "./notesLib";

const EMPTY: NoteDraft = { title: "", body: "", tags: [] };

function download(name: string, text: string, mime = "text/markdown") {
  try {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { /* ignore */ }
}

export default function NotesPage() {
  const notes = useForge((s) => s.notes);
  const addNote = useForge((s) => s.addNote);
  const updateNote = useForge((s) => s.updateNote);
  const deleteNote = useForge((s) => s.deleteNote);
  const toast = useToast();
  const { confirm, node } = useConfirm();
  const [q, setQ] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [link, setLink] = useState<LinkFilter>("all");
  const [sort, setSort] = useState<SortDir>("newest");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<NoteDraft>(EMPTY);
  const [tagInput, setTagInput] = useState("");

  const list = useMemo(() => filterNotes(content, notes, { q, tags, link, sort }), [notes, q, tags, link, sort]);
  const tagList = useMemo(() => allTags(notes), [notes]);
  // Drop selected tags that no longer exist (note deleted or re-tagged).
  useEffect(() => { setTags((cur) => { const keep = cur.filter((t) => tagList.some((x) => x.tag === t)); return keep.length === cur.length ? cur : keep; }); }, [tagList]);
  const [exportedMd, setExportedMd] = useState("");
  const linkOptions = useMemo(() => [
    ...content.resources.map((r) => ({ value: `resource:${r.id}`, label: `R · ${r.title}` })),
    ...content.projects.map((p) => ({ value: `project:${p.id}`, label: `P · ${p.title}` })),
    ...content.drills.map((d) => ({ value: `drill:${d.id}`, label: `D · ${d.title}` })),
    ...content.assessments.map((a) => ({ value: `assessment:${a.id}`, label: `A · ${a.title}` })),
  ], []);

  const startNew = () => { setEditing("new"); setDraft(EMPTY); setTagInput(""); };
  const startEdit = (n: Note) => { setEditing(n.id); setDraft({ title: n.title, body: n.body, tags: n.tags, resourceId: n.resourceId, projectId: n.projectId, itemId: n.itemId }); setTagInput(n.tags.join(", ")); };
  const cancel = () => { setEditing(null); setDraft(EMPTY); };
  const save = () => {
    const d = { ...draft, title: draft.title.trim(), body: draft.body.trim(), tags: parseTags(tagInput) };
    if (!d.title && !d.body) return;
    if (editing === "new") { addNote({ ...d, title: d.title || d.body.slice(0, 40) }); toast(<><b>Note saved.</b></>, "ok"); }
    else if (editing && notes.some((n) => n.id === editing)) { updateNote(editing, { ...d, title: d.title || d.body.slice(0, 40) }); toast("Note updated.", "ok"); }
    else if (editing) { addNote({ ...d, title: d.title || d.body.slice(0, 40) }); toast(<><b>Note re-created</b> — the original had been deleted.</>, "info"); }
    cancel();
  };
  const exportAll = async () => {
    const md = exportMarkdown(content, notes, new Date());
    setExportedMd(md);
    download("forge-notes.md", md);
    try { await navigator.clipboard.writeText(md); toast(<><b>Exported.</b> Markdown downloaded and copied.</>, "ok"); }
    catch { toast(<><b>Exported.</b> Markdown downloaded.</>, "ok"); }
  };

  return (
    <div data-testid="page-notes">
      <PageHeader title="📓 Notes" sub="Writing to think. Markdown notes linked to resources, projects, drills and rubrics. Export to Obsidian/Notion any time." right={<><button className="sbtn" onClick={exportAll} disabled={notes.length === 0} data-testid="notes-export">⬇ Export markdown</button><button className="sbtn primary" onClick={startNew} data-testid="notes-new">+ New note</button></>} />

      <div className="filters">
        <div className="frow">
          <div className="search"><span aria-hidden="true">🔍</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes…" aria-label="Search notes" data-testid="notes-search" /></div>
          <select className="sel" value={link} onChange={(e) => setLink(e.target.value as LinkFilter)} aria-label="Link filter" data-testid="notes-link-filter">
            <option value="all">All notes</option><option value="resource">Linked to a resource</option><option value="project">Linked to a project</option><option value="unlinked">Unlinked</option>
          </select>
          <Seg<SortDir> value={sort} onChange={setSort} testId="notes-sort" options={[{ value: "newest", label: "Newest" }, { value: "oldest", label: "Oldest" }]} />
          <span className="fmeta" style={{ marginLeft: "auto" }} data-testid="notes-count">{list.length} of {notes.length}</span>
        </div>
        {(tagList.length > 0 || tags.length > 0 || q || link !== "all") && <div className="chips" style={{ marginTop: 10 }}>{tagList.map((t) => <Chip key={t.tag} small on={tags.includes(t.tag)} onClick={() => setTags((v) => (v.includes(t.tag) ? v.filter((x) => x !== t.tag) : [...v, t.tag]))} testId={`notes-tag-${t.tag}`}>#{t.tag} <span className="xs faint">{t.count}</span></Chip>)}{(tags.length > 0 || q || link !== "all") && <button className="linkbtn xs" onClick={() => { setTags([]); setQ(""); setLink("all"); }} data-testid="notes-clear">Clear filters</button>}</div>}
      </div>

      {exportedMd && (
        <div className="card mb16" data-testid="notes-export-panel">
          <div className="card-h">Exported markdown<span className="grow" /><button className="linkbtn" onClick={async () => { try { await navigator.clipboard.writeText(exportedMd); toast("Copied.", "ok"); } catch { toast("Clipboard unavailable — select the text below.", "bad"); } }}>Copy</button><button className="linkbtn" style={{ marginLeft: 10 }} onClick={() => setExportedMd("")}>Hide</button></div>
          <div className="body"><textarea className="ta" readOnly value={exportedMd} style={{ minHeight: 120, fontFamily: "var(--mono)", fontSize: 11 }} aria-label="Exported markdown" data-testid="notes-export-text" /></div>
        </div>
      )}
      {editing && (
        <div className="card mb16" data-testid="note-editor">
          <div className="card-h">{editing === "new" ? "New note" : "Edit note"}</div>
          <div className="body frm">
            <input className="fi" placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} aria-label="Title" data-testid="note-title" autoFocus />
            <div className="grid-2">
              <textarea className="ta" style={{ minHeight: 180, fontFamily: "var(--mono)", fontSize: 12.5 }} placeholder={"Markdown: **bold**, `code`, - lists, links…"} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} aria-label="Body" data-testid="note-body" />
              <div className="help" style={{ minHeight: 180, overflow: "auto" }} data-testid="note-preview">{draft.body.trim() ? <Md text={draft.body} /> : <span className="faint">Preview</span>}</div>
            </div>
            <div className="row2">
              <label>Tags (comma-separated)<input className="fi" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="idea, nhi, interview" data-testid="note-tags" /></label>
              <label>Link to
                <select className="fi" value={linkValueOf(content, draft)} onChange={(e) => setDraft({ ...draft, ...parseLinkValue(e.target.value) })} data-testid="note-link">
                  <option value="">— none —</option>
                  {linkOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>
            <div className="row">
              <button className="sbtn primary" onClick={save} disabled={!draft.title.trim() && !draft.body.trim()} data-testid="note-save">Save</button>
              <button className="sbtn ghost" onClick={cancel} data-testid="note-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <Empty>{notes.length === 0 ? "No notes yet. Capture one from any resource row, a paper summary, or start here." : "No notes match the filters."}</Empty>
      ) : (
        <div className="col" style={{ gap: 10 }}>
          {list.map((n) => {
            const l = resolveLink(content, n);
            return (
              <div key={n.id} className="card" data-testid={`note-card-${n.id}`}>
                <div className="body">
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <b style={{ fontSize: 14 }}>{n.title}</b>
                      <div className="row" style={{ gap: 6, marginTop: 4 }}>
                        <span className="faint xs">{relTime(n.updatedAt)}</span>
                        {l && (l.to ? <Link to={l.to} className="bdg info">{l.code} · {l.title}</Link> : <span className="bdg bad">{l.code} · {l.title}</span>)}
                        {n.tags.map((t) => <span key={t} className="chip sm">#{t}</span>)}
                      </div>
                    </div>
                    <div className="row" style={{ gap: 6 }}>
                      <button className="sbtn sm" onClick={() => startEdit(n)} data-testid={`note-edit-${n.id}`}>Edit</button>
                      <button className="sbtn sm ghost" onClick={async () => { if (await confirm(<>Delete “{n.title}”?</>)) { if (editing === n.id) cancel(); deleteNote(n.id); toast("Deleted."); } }} data-testid={`note-delete-${n.id}`}>Delete</button>
                    </div>
                  </div>
                  {n.body && <div className="small muted" style={{ marginTop: 8 }}><Md text={n.body} /></div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {node}
    </div>
  );
}
