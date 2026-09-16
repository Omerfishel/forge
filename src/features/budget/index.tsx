import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { content } from "@/data";
import { useForge } from "@/store";
import { budgetSummary, costLines } from "@/lib/budget";
import { COST_LABEL, fmtUsd, STATUS_LABEL } from "@/lib/labels";
import type { CostModel } from "@/types";
import { Card, Chip, CostBdg, Empty, PageHeader, TrackBdg, useToast } from "@/components/ui";

type Filter = "all" | Exclude<CostModel, "free">;

export default function BudgetPage() {
  const progress = useForge((s) => s.progress);
  const setStatus = useForge((s) => s.setStatus);
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const summary = useMemo(() => budgetSummary(content, progress), [progress]);
  const lines = useMemo(() => costLines(content, progress).filter((l) => filter === "all" || l.resource.cost.model === filter).sort((a, b) => (b.amountUsd ?? -1) - (a.amountUsd ?? -1) || a.resource.title.localeCompare(b.resource.title)), [progress, filter]);
  const skips = content.resources.filter((r) => r.priority === "skip_unless_relevant");

  return (
    <div data-testid="page-budget">
      <PageHeader title="💰 Budget" sub="What the library would cost, what you've actually committed to, and the free substitute for every paid item." />
      <div className="stat-grid">
        <div className="stat" data-testid="budget-total"><div className="big">{fmtUsd(summary.totalUsd)}</div><div className="lb">If you bought everything</div><div className="sm">{summary.paidCount} priced items</div></div>
        <div className="stat" data-testid="budget-planned"><div className="big">{fmtUsd(summary.plannedUsd)}</div><div className="lb">Planned / spent</div><div className="sm">items in progress or done</div></div>
        <div className="stat" data-testid="budget-recurring"><div className="big">{fmtUsd(summary.recurringUsd)}</div><div className="lb">Recurring per year</div></div>
        <div className="stat" data-testid="budget-free"><div className="big">{summary.freeCount}</div><div className="lb">Free resources</div><div className="sm">vs {summary.paidCount} paid · {summary.withFreeAlt} have a free alternative{summary.unpriced ? ` · ${summary.unpriced} unpriced` : ""}</div></div>
      </div>
      <Card title="Paid items" right={<div className="chips"><Chip small on={filter === "all"} onClick={() => setFilter("all")} testId="budget-filter-all">All</Chip>{(["one_time", "subscription", "freemium"] as Filter[]).map((m) => <Chip key={m} small on={filter === m} onClick={() => setFilter(m)} testId={`budget-filter-${m}`}>{COST_LABEL[m as CostModel]}</Chip>)}</div>}>
        {lines.length === 0 ? <Empty>No priced items for this filter.</Empty> : (
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Resource</th><th>Cost</th><th>Free alternative</th><th>Status</th><th>Plan to buy</th></tr></thead><tbody>
            {lines.map((l) => { const r = l.resource; const st = progress[r.id]?.status ?? "todo"; const tr = content.tracks.find((t) => t.id === r.trackIds[0]); return (
              <tr key={r.id} data-testid={`budget-row-${r.id}`}>
                <td><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> {tr && <TrackBdg trackId={tr.id} code={tr.code} />}{r.cost.note && <div className="xs faint">{r.cost.note}</div>}</td>
                <td><CostBdg model={r.cost.model} amount={r.cost.amount} currency={r.cost.currency} />{l.amountUsd !== null && r.cost.currency && r.cost.currency !== "USD" && <div className="xs faint">≈ {fmtUsd(l.amountUsd)}</div>}</td>
                <td>{l.freeAlternative ? <Link to={`/library?q=${encodeURIComponent(l.freeAlternative.title)}`} className="small">{l.freeAlternative.title}</Link> : <span className="faint">—</span>}</td>
                <td><span className={`bdg ${st === "done" ? "ok" : st === "in_progress" ? "info" : "type"}`}>{STATUS_LABEL[st]}</span></td>
                <td><label className="row" style={{ gap: 6 }}><input type="checkbox" className="cbx" checked={l.planned} onChange={(e) => { setStatus(r.id, "resource", e.target.checked ? "in_progress" : "todo"); toast(e.target.checked ? <>Planned: <b>{r.title}</b></> : <>Unplanned: {r.title}</>, "ok"); }} data-testid={`budget-plan-${r.id}`} /><span className="xs muted">{l.planned ? "planned" : "not planned"}</span></label></td>
              </tr>
            ); })}
          </tbody></table></div>
        )}
      </Card>
      <div className="grid-2 mt16" style={{ alignItems: "start" }}>
        <Card title="Spend discipline" className="accent" testId="budget-guidance">
          <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Stay free / open-source for Tracks 1–2 and most of Track 7.</li>
            <li>Pay only for: (a) <b>HTB AI Red Teamer</b> (~$490/yr) if you want the one credential in your wedge; (b) <b>one cohort</b> — Aman Khan's AI-PM or Hamel's evals ($4,200; ideally employer-funded); (c) books.</li>
            <li><b>Skip</b> Reforge ($1,995/yr) and CISSP / OSCP. Artifacts beat certificates.</li>
            <li>Prices drift — re-verify at purchase time (see Freshness).</li>
          </ul>
        </Card>
        <Card title="Skip unless relevant">
          {skips.length === 0 ? <div className="rubric">Nothing flagged.</div> : skips.map((r) => <div key={r.id} className="mini" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}><span><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> <CostBdg model={r.cost.model} amount={r.cost.amount} currency={r.cost.currency} /></span><span className="xs faint">{r.notes ?? r.whyForHim}</span></div>)}
        </Card>
      </div>
    </div>
  );
}
