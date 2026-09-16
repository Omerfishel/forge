import { content } from "@/data";
import { useForge } from "@/store";
import { useToday } from "@/lib/hooks";
import { addDaysKey, diffDaysKey, fmtDate } from "@/lib/dates";
import { FRESH_LABEL, TYPE_ICON, trackColorVar } from "@/lib/labels";
import type { Freshness, Resource } from "@/types";
import { Accordion, FreshBdg, PageHeader, TrackBdg, useToast } from "@/components/ui";

type GroupKey = "stale" | "aging" | "unknown" | "quarterly" | "unverified" | "current";
const GROUPS: { key: GroupKey; title: string; color: string; pick: (r: Resource) => boolean; hint: string }[] = [
  { key: "stale", title: "Stale — re-verify now", color: "var(--bad)", pick: (r) => r.freshness === "stale", hint: "Known to be out of date." },
  { key: "aging", title: "Aging — check soon", color: "var(--warn)", pick: (r) => r.freshness === "aging", hint: "Probably fine, but versions/prices may have moved." },
  { key: "unknown", title: "Unknown freshness", color: "var(--faint)", pick: (r) => r.freshness === "unknown", hint: "Never verified at seed time." },
  { key: "quarterly", title: "Quarterly re-check (frameworks, certs, conferences)", color: "var(--info)", pick: (r) => r.tags.includes("reverify-quarterly") || ["framework", "certification", "conference"].includes(r.resourceType), hint: "OWASP / ATLAS / NIST versions and event dates move fast." },
  { key: "unverified", title: "URL not verified", color: "var(--acc)", pick: (r) => !r.urlVerified, hint: "Added from memory — open once and confirm." },
  { key: "current", title: "Current", color: "var(--ok)", pick: (r) => r.freshness === "current", hint: "Verified at seed time." },
];

export default function FreshnessPage() {
  const today = useToday();
  const checkedAt = useForge((s) => s.settings.freshnessCheckedAt);
  const update = useForge((s) => s.updateSettings);
  const collapsed = useForge((s) => s.ui.collapsed);
  const setCollapsed = useForge((s) => s.setCollapsed);
  const toast = useToast();
  const counts = (["current", "aging", "stale", "unknown"] as Freshness[]).map((f) => ({ f, n: content.resources.filter((r) => r.freshness === f).length }));
  const nextDue = checkedAt ? addDaysKey(checkedAt, 90) : null;
  const overdue = nextDue ? diffDaysKey(today, nextDue) >= 0 : true;

  return (
    <div data-testid="page-freshness">
      <PageHeader title="🔄 Freshness" sub="AI security moves weekly. This monitor surfaces what to re-verify and when." />
      <div className="card accent mb16">
        <div className="body row" style={{ gap: 18 }}>
          <div><div className="lbl">Last full check</div><b data-testid="fresh-checked-at">{checkedAt ? fmtDate(checkedAt, { month: "short", day: "numeric", year: "numeric" }) : "never"}</b></div>
          <div><div className="lbl">Next due</div><b className={overdue ? "bad" : "ok"}>{nextDue ? fmtDate(nextDue, { month: "short", day: "numeric", year: "numeric" }) : "now"}{overdue ? " · overdue" : ""}</b></div>
          <div className="row" style={{ gap: 6 }} data-testid="fresh-counts">{counts.map((c) => <span key={c.f} className="pill">{FRESH_LABEL[c.f]} {c.n}</span>)}</div>
          <span className="grow" />
          <button className="sbtn primary" onClick={() => { update({ freshnessCheckedAt: today }); toast(<><b>Marked checked</b> — next due in 90 days.</>, "ok"); }} data-testid="fresh-mark-checked">Mark all checked today</button>
        </div>
      </div>
      <div className="help mb16">Policy: re-check OWASP LLM / Agentic Top 10, MITRE ATLAS and NIST AI RMF versions quarterly (ATLAS moved from v5.1.0 to v5.4.0 within three months); re-verify prices and cohort dates before paying; confirm conference dates before booking.</div>
      {GROUPS.map((g) => {
        const rows = content.resources.filter(g.pick);
        const key = `fresh-${g.key}`;
        const open = collapsed[key] === undefined ? g.key !== "current" : !collapsed[key];
        return (
          <Accordion key={g.key} title={g.title} meta={`${rows.length} · ${g.hint}`} color={g.color} open={open} onToggle={() => setCollapsed(key, open)} testId={`fresh-group-${g.key}`}>
            {rows.length === 0 ? <div className="rubric" style={{ padding: 6 }}>None.</div> : rows.map((r) => { const tr = content.tracks.find((t) => t.id === r.trackIds[0]); return (
              <div key={r.id} className="item" style={{ ["--tc" as string]: trackColorVar(r.trackIds[0]) }} data-testid={`fresh-row-${g.key}-${r.id}`}>
                <span className="i-type" style={{ marginTop: 2 }}>{TYPE_ICON[r.resourceType]}</span>
                <div className="i-main">
                  <div className="i-titlerow" style={{ cursor: "default" }}><a className="i-title" href={r.url} target="_blank" rel="noreferrer" style={{ color: "var(--ink)" }}>{r.title}</a><span className="faint xs">{r.creator}</span><FreshBdg freshness={r.freshness} />{!r.urlVerified && <span className="bdg high">url unverified</span>}</div>
                  <div className="i-badges">{tr && <TrackBdg trackId={tr.id} code={tr.code} />}<span className="pill">{r.urlVerified ? "verified" : "added"} {r.urlVerifiedDate}</span>{r.notes && <span className="faint xs" style={{ maxWidth: 520, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.notes}>{r.notes}</span>}</div>
                </div>
                <div className="i-right"><a className="focusbtn" href={r.url} target="_blank" rel="noreferrer" data-testid={`fresh-open-${g.key}-${r.id}`}>Open ↗</a></div>
              </div>
            ); })}
          </Accordion>
        );
      })}
    </div>
  );
}
