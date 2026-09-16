import { useMemo, useState } from "react";
import { content } from "@/data";
import { useForge } from "@/store";
import { Card, Chip, PageHeader } from "@/components/ui";
import { FIT_COLOR, FIT_KIND, FIT_LABEL, FIT_ORDER, is8200, isCompassTab, STAGE_FILTERS, STAGE_KIND, STAGE_LABEL, TABS, type CompassTab, type StageFilter } from "./shared";

const S = content.strategy;

function Overview() {
  return (
    <>
      <Card title="TL;DR" className="accent mb16" testId="compass-tldr">
        <ul style={{ margin: 0, paddingLeft: 18 }} className="small">{S.tldr.map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}</ul>
      </Card>
      <div className="grid-2">{S.keyFindings.map((k) => <Card key={k.id} title={k.title} testId={`finding-${k.id}`}><p className="small muted" style={{ margin: 0 }}>{k.body}</p></Card>)}</div>
    </>
  );
}

function Domains() {
  const domains = [...S.domains].sort((a, b) => FIT_ORDER[a.fit] - FIT_ORDER[b.fit]);
  return (
    <>
      {domains.map((d) => (
        <div key={d.id} className="card mb12" style={{ borderLeft: `3px solid ${FIT_COLOR[d.fit]}` }} data-testid={`domain-${d.id}`}>
          <div className="card-h"><span style={{ textTransform: "none", letterSpacing: 0, color: "var(--ink)", fontSize: 14 }}>{d.name}</span><span className={`bdg ${FIT_KIND[d.fit]}`}>{FIT_LABEL[d.fit]}</span></div>
          <div className="body">
            <p className="small" style={{ marginTop: 0 }}><b>Verdict.</b> {d.verdict}</p>
            <p className="small muted">{d.fitRationale}</p>
            {d.subLanes.length > 0 && (
              <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Sub-lane</th><th>Examples</th><th>2028–29 bet</th></tr></thead><tbody>
                {d.subLanes.map((l) => <tr key={l.id}><td><b>{l.name}</b>{l.note && <div className="xs faint">{l.note}</div>}</td><td><div className="chips">{l.examples.map((e) => <span key={e} className="chip sm">{e}</span>)}</div></td><td className="muted">{l.bet}</td></tr>)}
              </tbody></table></div>
            )}
          </div>
        </div>
      ))}
      <Card title="Adjacent domains worth adding" className="mt16">
        {[...S.adjacentDomains].sort((a, b) => a.rank - b.rank).map((a) => (
          <div key={a.id} className="item" style={{ ["--tc" as string]: "var(--acc)" }} data-testid={`adjacent-${a.id}`}>
            <span className="mono" style={{ color: "var(--acc)", fontWeight: 700 }}>{a.rank}</span>
            <div className="i-main"><div className="i-titlerow" style={{ cursor: "default" }}><span className="i-title">{a.name}</span></div><div className="small muted" style={{ marginTop: 4 }}>{a.rationale}</div>{a.examples && a.examples.length > 0 && <div className="chips" style={{ marginTop: 6 }}>{a.examples.map((e) => <span key={e} className="chip sm">{e}</span>)}</div>}</div>
          </div>
        ))}
      </Card>
    </>
  );
}

function Roles() {
  return (
    <>
      <Card title="Role ladder" className="mb16">
        <div className="col" style={{ gap: 0 }}>
          {S.roleLadder.map((r, i) => (
            <div key={r.id} className="row" style={{ alignItems: "stretch", gap: 14, flexWrap: "nowrap" }} data-testid={`ladder-${r.id}`}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                <span className="mono" style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? "var(--acc)" : "var(--panel2)", color: i === 0 ? "var(--acc-ink)" : "var(--muted)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800, border: "1px solid var(--line-solid)" }}>{i + 1}</span>
                {i < S.roleLadder.length - 1 && <span style={{ flex: 1, width: 2, background: "var(--line-solid)", minHeight: 24 }} />}
              </div>
              <div style={{ paddingBottom: 18, minWidth: 0 }}>
                <div className="lbl" style={{ color: "var(--acc)" }}>{r.horizon}</div>
                <b>{r.title}</b>
                <div className="small muted" style={{ marginTop: 4 }}>{r.detail}</div>
                {r.fallback && <div className="xs faint" style={{ marginTop: 4 }}>Fallback: {r.fallback}</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid-2">{S.roleStrategy.map((k) => <Card key={k.id} title={k.title}><p className="small muted" style={{ margin: 0 }}>{k.body}</p></Card>)}</div>
    </>
  );
}

function Startups() {
  const [stage, setStage] = useState<StageFilter>("all");
  const [only8200, setOnly8200] = useState(false);
  const rows = useMemo(() => S.targetStartups.filter((s) => (stage === "all" || s.stage === stage) && (!only8200 || s.signals.some(is8200))), [stage, only8200]);
  return (
    <Card title="Target startups" right={<span className="fmeta" data-testid="startup-count">{rows.length} of {S.targetStartups.length}</span>}>
      <div className="chips" style={{ marginBottom: 12 }}>
        {STAGE_FILTERS.map((s) => <Chip key={s} small on={stage === s} onClick={() => setStage(s)} testId={`startup-filter-${s}`}>{STAGE_LABEL[s]}</Chip>)}
        <Chip small on={only8200} onClick={() => setOnly8200((v) => !v)} testId="startup-filter-8200">8200-linked</Chip>
      </div>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Company</th><th>Domain</th><th>Funding</th><th>Investors</th><th>Signals</th><th>Stage</th><th>Fit</th></tr></thead><tbody>
        {rows.map((s) => (
          <tr key={s.id} style={s.isBestMatch ? { background: "color-mix(in srgb, var(--acc) 8%, transparent)" } : undefined} data-testid={`startup-row-${s.id}`}>
            <td><b>{s.isBestMatch ? "★ " : ""}{s.name}</b>{s.isBestMatch && <div className="xs acc">best documented match</div>}</td>
            <td>{s.domain}</td><td className="mono xs">{s.funding}</td><td className="xs muted">{s.investors}</td>
            <td><div className="chips">{s.signals.map((g) => <span key={g} className={`bdg ${is8200(g) ? "high" : "type"}`}>{g}</span>)}</div></td>
            <td><span className={`bdg ${STAGE_KIND[s.stage]}`}>{STAGE_LABEL[s.stage]}</span></td>
            <td className="xs muted">{s.fitNote}{s.caveat && <div className="xs faint" style={{ marginTop: 3 }}>⚠ {s.caveat}</div>}</td>
          </tr>
        ))}
      </tbody></table></div>
    </Card>
  );
}

function Timeline() {
  return (
    <div>{S.timeline.map((t, i) => (
      <div key={t.id} className="phase" data-testid={`timeline-${t.id}`} style={{ ["--pc" as string]: i === 0 ? "var(--acc)" : "var(--info)" }}>
        <div className="phase-h" style={{ cursor: "default" }}><span className="phase-off">{t.horizon}</span></div>
        <div className="phase-body"><ul className="small" style={{ margin: "4px 0", paddingLeft: 18 }}>{t.items.map((it, j) => <li key={j} style={{ marginBottom: 4 }}>{it}</li>)}</ul></div>
      </div>
    ))}</div>
  );
}

function Skills() {
  const kind: Record<string, string> = { all: "type", have: "ok", want: "high", cofounder: "seed" };
  return <div className="grid-2">{S.skillsPool.map((g) => <Card key={g.id} title={g.title} testId={`skills-${g.kind}`}><div className="chips">{g.skills.map((s) => <span key={s} className={`bdg ${kind[g.kind]}`} style={{ whiteSpace: "normal", fontSize: 11, padding: "5px 8px" }}>{s}</span>)}</div></Card>)}</div>;
}

function Money() {
  return (
    <>
      <div className="stat-grid">{S.compensation.map((c) => <div key={c.id} className="stat" data-testid={`comp-${c.id}`}><div className="big" style={{ fontSize: 20 }}>{c.value}</div><div className="lb">{c.label}</div><div className="sm" style={{ whiteSpace: "normal" }}>{c.source}</div></div>)}</div>
      <div className="grid-2">{S.vcs.map((v, i) => <Card key={v.tier} title={v.tier} testId={`vcs-${i}`}><div className="chips">{v.names.map((n) => <span key={n} className="chip sm">{n}</span>)}</div></Card>)}</div>
      <Card title="Co-founder strategy" className="mt16"><ul className="small muted" style={{ margin: 0, paddingLeft: 18 }}>{S.cofounderStrategy.map((c, i) => <li key={i} style={{ marginBottom: 6 }}>{c}</li>)}</ul></Card>
    </>
  );
}

function Playbook() {
  return <div>{S.recommendations.map((r) => (
    <div key={r.id} className="item" style={{ ["--tc" as string]: "var(--acc)" }} data-testid={`rec-${r.id}`}>
      <span className="i-type" style={{ marginTop: 2 }}>▶</span>
      <div className="i-main"><div className="lbl" style={{ color: "var(--acc)" }}>{r.stage}</div><div className="small">{r.action}</div><div className="deliver" style={{ marginTop: 8, marginBottom: 0 }}><span className="lbl">Threshold to change</span>{r.threshold}</div></div>
    </div>
  ))}</div>;
}

function Caveats() {
  return <Card title="Caveats · read before acting on the numbers"><ul className="small muted" style={{ margin: 0, paddingLeft: 18 }}>{S.caveats.map((c) => <li key={c.id} style={{ marginBottom: 6 }} data-testid={`caveat-${c.id}`}>{c.text}</li>)}</ul></Card>;
}

export default function CompassPage() {
  const raw = useForge((s) => s.ui.compassTab);
  const setUi = useForge((s) => s.setUi);
  const tab: CompassTab = isCompassTab(raw) ? raw : "overview";
  return (
    <div data-testid="page-compass">
      <PageHeader title="🧭 Compass" sub="The five-year strategy: where the unfair advantage is, which role to take now, who to target, and when to found." />
      <div className="chips" style={{ marginBottom: 16 }}>{TABS.map((t) => <Chip key={t.key} on={tab === t.key} onClick={() => setUi({ compassTab: t.key })} testId={`compass-tab-${t.key}`}>{t.label}</Chip>)}</div>
      {tab === "overview" && <Overview />}
      {tab === "domains" && <Domains />}
      {tab === "roles" && <Roles />}
      {tab === "startups" && <Startups />}
      {tab === "timeline" && <Timeline />}
      {tab === "skills" && <Skills />}
      {tab === "money" && <Money />}
      {tab === "playbook" && <Playbook />}
      {tab === "caveats" && <Caveats />}
    </div>
  );
}
