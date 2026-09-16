import { Link, useParams } from "react-router-dom";
import { content } from "@/data";
import { useForge } from "@/store";
import { useTrackStats } from "@/lib/hooks";
import { trackStats } from "@/lib/plan";
import { fmtHours, PRIORITY_LABEL, ROLE_LABEL, STATUS_LABEL, trackColorVar } from "@/lib/labels";
import { PRIORITIES, ROLES, type Priority, type Track, type TrackId } from "@/types";
import { Accordion, Bar, Card, Chip, Empty, PageHeader } from "@/components/ui";
import { ResourceRow } from "@/components/ResourceRow";

function RoleFilter() {
  const role = useForge((s) => s.settings.roleFilter);
  const update = useForge((s) => s.updateSettings);
  return (
    <div className="chips" style={{ marginBottom: 16 }}>
      <Chip on={role === "all"} onClick={() => update({ roleFilter: "all" })} testId="role-chip-all">All roles</Chip>
      {ROLES.map((r) => <Chip key={r} on={role === r} onClick={() => update({ roleFilter: r })} testId={`role-chip-${r}`}>{ROLE_LABEL[r]}</Chip>)}
    </div>
  );
}

function TrackCard({ t }: { t: Track }) {
  const s = useTrackStats(t.id);
  return (
    <Link to={`/tracks/${t.id}`} className="card" style={{ display: "block", color: "inherit", textDecoration: "none", borderLeft: `3px solid ${t.color}` }} data-testid={`track-card-${t.id}`}>
      <div className="body">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <b style={{ fontSize: 14 }}>{t.icon} {t.code} · {t.name}</b>
          <span className="bdg type">#{t.priorityRank} priority</span>
        </div>
        <p className="muted small" style={{ margin: "8px 0" }}>{t.goal}</p>
        <div style={{ marginTop: 6 }}><Bar pct={s.pct} color={t.color} height={7} /></div>
        <div className="fmeta" style={{ marginTop: 6 }}>{s.done}/{s.total} items · {s.mustDoDone}/{s.mustDoTotal} must-do · {fmtHours(s.hours)}</div>
        <div className="acc small" style={{ marginTop: 8, fontWeight: 600 }}>Open ▸</div>
      </div>
    </Link>
  );
}

function TrackDetail({ t }: { t: Track }) {
  const role = useForge((s) => s.settings.roleFilter);
  const progress = useForge((s) => s.progress);
  const collapsed = useForge((s) => s.ui.collapsed);
  const toggleCollapsed = useForge((s) => s.toggleCollapsed);
  const s = trackStats(content, progress, t.id, role);
  const res = content.resources.filter((r) => r.trackIds.includes(t.id) && (role === "all" || r.roleRelevance.includes(role)));
  const projects = content.projects.filter((p) => p.trackIds.includes(t.id) && (role === "all" || p.roleRelevance.includes(role)));
  const skills = content.skills.filter((sk) => sk.trackId === t.id);
  const rubric = content.assessments.find((a) => a.trackId === t.id && a.type === "rubric");

  return (
    <div data-testid="track-detail">
      <Link to="/tracks" className="small" data-testid="track-back">← All tracks</Link>
      <div className="hero" style={{ marginTop: 10 }}>
        <div className="hero-icon" aria-hidden="true">{t.icon}</div>
        <div>
          <div className="hero-name">{t.code} · priority #{t.priorityRank}</div>
          <div className="hero-line">{t.name}</div>
          <div className="muted small" style={{ marginTop: 4 }}>{t.goal}</div>
        </div>
      </div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Card title="Why this track">
          <p className="muted small" style={{ margin: 0 }}>{t.why}</p>
          <div style={{ marginTop: 10 }}><span className="lbl">Skills</span><div className="chips" data-testid="track-skills">{skills.map((sk) => <span key={sk.id} className="chip sm" title={sk.description}>{sk.name}</span>)}</div></div>
        </Card>
        <Card title="Ready when" testId="track-ready">
          <div className="deliver">{t.readyWhen}</div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="fmeta">{s.done}/{s.total} items · {s.mustDoDone}/{s.mustDoTotal} must-do · {fmtHours(s.hoursDone)} of {fmtHours(s.hours)} logged</span>
            <Link to="/assess" className="sbtn sm">Rubric ▸ {rubric && progress[rubric.id]?.status === "done" ? "✅" : ""}</Link>
          </div>
          <div style={{ marginTop: 8 }}><Bar pct={s.pct} color={t.color} /></div>
        </Card>
      </div>
      <RoleFilter />
      {role !== "all" && <div className="help" style={{ marginBottom: 12 }}>Showing items relevant to the <b>{ROLE_LABEL[role]}</b> role. Switch to “All roles” to see everything.</div>}
      {PRIORITIES.map((p: Priority) => {
        const rows = res.filter((r) => r.priority === p);
        if (rows.length === 0) return null;
        const key = `track-${t.id}-${p}`;
        const open = collapsed[key] === undefined ? p === "must_do" || p === "high" : !collapsed[key];
        const done = rows.filter((r) => progress[r.id]?.status === "done").length;
        return (
          <Accordion key={p} title={PRIORITY_LABEL[p]} meta={`${rows.length} resources`} color={p === "must_do" ? "var(--warn)" : p === "high" ? "var(--acc)" : "var(--faint)"} open={open} onToggle={() => toggleCollapsed(key)} pct={Math.round((done / rows.length) * 100)} testId={`track-group-${p}`}>
            {rows.map((r) => <ResourceRow key={r.id} r={r} prefix="track" />)}
          </Accordion>
        );
      })}
      {res.length === 0 && <Empty>No resources in this track for the selected role.</Empty>}
      <Card title="🧪 Projects in this track" className="mt16">
        {projects.length === 0 ? <div className="rubric">No projects for this track{role !== "all" ? " and role" : ""}.</div> : projects.map((p) => {
          const st = progress[p.id]?.status ?? "todo";
          return (
            <div key={p.id} className={`item ${st === "done" ? "done" : ""}`} style={{ ["--tc" as string]: trackColorVar(t.id) }} data-testid={`track-proj-${p.id}`}>
              <span className="i-type" style={{ marginTop: 2 }}>🧪</span>
              <div className="i-main">
                <div className="i-titlerow" style={{ cursor: "default" }}><Link className="i-title" to={`/projects?open=${p.id}`} style={{ color: "var(--ink)" }}>{p.title}</Link><span className={`bdg ${st === "done" ? "ok" : st === "in_progress" ? "info" : "type"}`}>{STATUS_LABEL[st]}</span>{p.isStartupSeed && <span className="bdg seed">startup seed</span>}</div>
                <div className="faint xs" style={{ marginTop: 4 }}>{p.proves}</div>
              </div>
              <div className="i-right"><span className="hrs">{fmtHours(p.estHours)}</span></div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

export default function TracksPage() {
  const { trackId } = useParams();
  if (trackId) {
    const t = content.tracks.find((x) => x.id === (trackId as TrackId));
    if (!t) return <div data-testid="page-tracks"><Empty>Unknown track. <Link to="/tracks">Back to tracks</Link></Empty></div>;
    return <div data-testid="page-tracks"><TrackDetail t={t} /></div>;
  }
  return (
    <div data-testid="page-tracks">
      <PageHeader title="🗺️ Tracks" sub="Eight tracks, ranked by leverage for the FDE → product-CTO path. The role filter narrows every list in the app." />
      <RoleFilter />
      <div className="grid-auto">
        {[...content.tracks].sort((a, b) => a.priorityRank - b.priorityRank).map((t) => <TrackCard key={t.id} t={t} />)}
      </div>
    </div>
  );
}
