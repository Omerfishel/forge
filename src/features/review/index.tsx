import { useCallback, useEffect, useMemo, useState } from "react";
import { content } from "@/data";
import { useForge } from "@/store";
import { useToday } from "@/lib/hooks";
import { dueCount, GRADE_LABELS, previewIntervals, queue, schedule, type Grade } from "@/lib/srs";
import { fmtDate } from "@/lib/dates";
import { Card, Chip, Empty, PageHeader, TrackBdg, useToast } from "@/components/ui";

const deckLabel = (d: string) => d.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const fmtInterval = (d: number) => (d <= 0 ? "<1d" : d < 30 ? `${d}d` : d < 365 ? `${Math.round(d / 30)}mo` : `${(d / 365).toFixed(1)}y`);

export default function ReviewPage() {
  const today = useToday();
  const srs = useForge((s) => s.srs);
  const gradeCard = useForge((s) => s.gradeCard);
  const resetCard = useForge((s) => s.resetCard);
  const deck = useForge((s) => s.ui.reviewDeck);
  const setUi = useForge((s) => s.setUi);
  const reviewedToday = useForge((s) => s.srsReviewedToday[today] ?? 0);
  const toast = useToast();
  const [maxNew, setMaxNew] = useState(10);
  const [session, setSession] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(false);
  const [browse, setBrowse] = useState(false);
  const [ahead, setAhead] = useState(false);
  const [total, setTotal] = useState(0);

  const decks = useMemo(() => Array.from(new Set(content.cards.map((c) => c.deck))), []);
  const deckCards = useMemo(() => content.cards.filter((c) => deck === "all" || c.deck === deck), [deck]);
  const counts = dueCount(deckCards.map((c) => c.id), srs, today);

  const build = useCallback((studyAhead: boolean) => {
    const ids = deckCards.map((c) => c.id);
    let q = queue(ids, srs, { now: today, maxNew, maxTotal: 60 });
    if (q.length === 0 && studyAhead) {
      // Nothing due: pull the soonest-due learned cards plus new ones.
      q = [...ids].filter((id) => srs[id]).sort((a, b) => srs[a].due.localeCompare(srs[b].due)).slice(0, 10);
    }
    setSession(q); setIdx(0); setShown(false); setTotal(q.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckCards, maxNew, today]);

  useEffect(() => { setAhead(false); build(false); }, [deck, maxNew, build]);

  const currentId = session[idx];
  const card = currentId ? content.cards.find((c) => c.id === currentId) : undefined;
  const state = currentId ? srs[currentId] : undefined;
  const preview = previewIntervals(state);

  const grade = useCallback((g: Grade) => {
    if (!card) return;
    const next = schedule(srs[card.id], g, today);
    gradeCard(card.id, g, next);
    setSession((s) => (g === 0 ? [...s, card.id] : s));
    setIdx((i) => i + 1);
    setShown(false);
  }, [card, srs, today, gradeCard]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!card) return;
      if (e.key === " " && !shown) { e.preventDefault(); setShown(true); }
      else if (shown && ["1", "2", "3", "4"].includes(e.key)) { e.preventDefault(); grade((Number(e.key) - 1) as Grade); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [card, shown, grade]);

  const nextDue = useMemo(() => {
    const future = deckCards.map((c) => srs[c.id]?.due).filter((d): d is string => !!d && d > today).sort();
    return future[0];
  }, [deckCards, srs, today]);

  return (
    <div data-testid="page-review">
      <PageHeader title="🧠 Review" sub="Anki-style spaced repetition seeded with system-design, transformer, eval, agent-security and NHI concepts. Space reveals, 1–4 grades." />
      <div className="chips" style={{ marginBottom: 14 }}>
        <Chip on={deck === "all"} onClick={() => setUi({ reviewDeck: "all" })} testId="deck-chip-all">All decks <span className="xs faint">{content.cards.length}</span></Chip>
        {decks.map((d) => { const c = dueCount(content.cards.filter((x) => x.deck === d).map((x) => x.id), srs, today); return <Chip key={d} on={deck === d} onClick={() => setUi({ reviewDeck: d })} testId={`deck-chip-${d}`}>{deckLabel(d)} <span className="xs faint">{c.due} due · {c.fresh} new</span></Chip>; })}
      </div>
      <div className="stat-grid" data-testid="srs-stats">
        <div className="stat"><div className="big">{counts.due}</div><div className="lb">Due</div></div>
        <div className="stat"><div className="big">{counts.fresh}</div><div className="lb">New</div></div>
        <div className="stat"><div className="big">{counts.learned}</div><div className="lb">Learned</div><div className="sm">of {deckCards.length} in deck</div></div>
        <div className="stat"><div className="big">{reviewedToday}</div><div className="lb">Reviewed today</div></div>
        <div className="stat"><label className="lb" style={{ display: "block", marginTop: 0 }}>New per session</label><input className="sel" type="number" min={0} max={50} value={maxNew} onChange={(e) => setMaxNew(Math.max(0, Math.min(50, Number(e.target.value) || 0)))} aria-label="Max new cards per session" data-testid="srs-max-new" style={{ width: 80, marginTop: 6 }} /></div>
      </div>

      {card ? (
        <div className="srs-card" data-testid="srs-card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="fmeta" data-testid="srs-progress">Card {idx + 1} of {session.length}{session.length > total ? ` (+${session.length - total} again)` : ""}</span>
            <span className="row" style={{ gap: 6 }}><span className="bdg type">{deckLabel(card.deck)}</span>{card.trackIds.map((t) => { const tr = content.tracks.find((x) => x.id === t); return tr ? <TrackBdg key={t} trackId={t} code={tr.code} /> : null; })}{state ? <span className="pill">rep {state.reps} · ease {state.ease}</span> : <span className="bdg info">new</span>}</span>
          </div>
          <div className="front" data-testid="srs-front">{card.front}</div>
          {shown ? (
            <>
              <div className="back" data-testid="srs-back">{card.back}</div>
              <div className="srs-grade">
                {([0, 1, 2, 3] as Grade[]).map((g) => (
                  <button key={g} className={`sbtn ${g === 2 ? "primary" : ""}`} onClick={() => grade(g)} data-testid={`srs-grade-${g}`} title={`Key ${g + 1}`}>{GRADE_LABELS[g]}<small>{fmtInterval(preview[g])} · {g + 1}</small></button>
                ))}
              </div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="xs faint">{card.tags.map((t) => `#${t}`).join(" ")}</span>
                <button className="linkbtn xs" onClick={() => { resetCard(card.id); toast("Card reset to new."); }} data-testid="srs-reset">Reset card</button>
              </div>
            </>
          ) : (
            <div><button className="sbtn primary" onClick={() => setShown(true)} data-testid="srs-show">Show answer <span className="kbd" style={{ marginLeft: 6 }}>Space</span></button></div>
          )}
        </div>
      ) : (
        <div className="srs-card" style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }} data-testid="srs-empty">
          <div style={{ fontSize: 34 }}>🎉</div>
          <div className="front">{session.length > 0 ? "Session complete." : "All caught up."}</div>
          <div className="muted small">{counts.fresh > 0 ? `${counts.fresh} new cards are waiting.` : nextDue ? `Next card due ${fmtDate(nextDue)}.` : "No cards scheduled."} {reviewedToday > 0 && `${reviewedToday} reviewed today.`}</div>
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="sbtn primary" onClick={() => { setAhead(true); build(true); }} data-testid="srs-ahead">Study ahead</button>
            {session.length > 0 && <button className="sbtn" onClick={() => build(false)} data-testid="srs-again">New session</button>}
          </div>
          {ahead && session.length === 0 && <div className="rubric">Nothing to study ahead in this deck.</div>}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button className="sbtn" onClick={() => setBrowse((v) => !v)} aria-expanded={browse} data-testid="srs-browse">{browse ? "Hide" : "Browse"} deck ({deckCards.length})</button>
        {browse && (
          <Card className="mt12">
            {deckCards.length === 0 ? <Empty>No cards.</Empty> : (
              <div className="tbl-wrap"><table className="tbl" data-testid="srs-table"><thead><tr><th>Front</th><th>Deck</th><th>State</th><th>Interval</th><th>Lapses</th></tr></thead><tbody>
                {deckCards.map((c) => { const s = srs[c.id]; return <tr key={c.id}><td>{c.front}</td><td className="mono xs">{c.deck}</td><td className="mono xs">{s ? (s.due <= today ? "due" : `due ${fmtDate(s.due)}`) : "new"}</td><td className="mono xs">{s ? fmtInterval(s.interval) : "—"}</td><td className="mono xs">{s?.lapses ?? 0}</td></tr>; })}
              </tbody></table></div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
