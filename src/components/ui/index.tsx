// Shared UI primitives. Keep them small, unstyled beyond app.css classes.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Difficulty, TrackId, Priority, CostModel, Freshness } from "@/types";
import { DIFF_LEVEL, PRIORITY_CLASS, PRIORITY_LABEL, COST_LABEL, FRESH_CLASS, FRESH_LABEL, trackColorVar } from "@/lib/labels";

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------
interface ToastMsg { id: number; text: ReactNode; kind?: "ok" | "bad" | "info" }
const ToastCtx = createContext<(text: ReactNode, kind?: ToastMsg["kind"]) => void>(() => {});
export function useToast() { return useContext(ToastCtx); }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<ToastMsg[]>([]);
  const idRef = useRef(0);
  const push = useCallback((text: ReactNode, kind: ToastMsg["kind"] = "info") => {
    const id = ++idRef.current;
    setList((l) => [...l, { id, text, kind }]);
    window.setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div id="toast" role="status" aria-live="polite">
        {list.map((t) => (
          <div key={t.id} className={`toast ${t.kind ?? ""}`} data-testid="toast">{t.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
export function Modal({ title, onClose, children, wide, testId }: { title: ReactNode; onClose: () => void; children: ReactNode; wide?: boolean; testId?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} data-testid={testId ?? "modal"}>
      <div className={`modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : "Dialog"}>
        <div className="mh"><h2>{title}</h2><button className="x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="mc">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small display atoms
// ---------------------------------------------------------------------------
export function Chip({ on, onClick, children, color, title, small, testId }: { on?: boolean; onClick?: () => void; children: ReactNode; color?: string; title?: string; small?: boolean; testId?: string }) {
  return (
    <button type="button" className={`chip ${on ? "on" : ""} ${small ? "sm" : ""}`} onClick={onClick} title={title} aria-pressed={on} data-testid={testId}>
      {color && <span className="dot" style={{ background: color }} />}
      {children}
    </button>
  );
}

export function Bdg({ kind = "type", children, style, title }: { kind?: string; children: ReactNode; style?: React.CSSProperties; title?: string }) {
  return <span className={`bdg ${kind}`} style={style} title={title}>{children}</span>;
}

export function TrackBdg({ trackId, code }: { trackId: TrackId; code: string }) {
  return <span className="bdg track" style={{ ["--tc" as string]: trackColorVar(trackId) }}>{code}</span>;
}

export function PriorityBdg({ priority }: { priority: Priority }) {
  return <span className={`bdg ${PRIORITY_CLASS[priority]}`}>{PRIORITY_LABEL[priority]}</span>;
}

export function CostBdg({ model, amount, currency }: { model: CostModel; amount?: number; currency?: string }) {
  const paid = model !== "free";
  const txt = model === "free" ? "Free" : amount ? `${COST_LABEL[model]} · ${currency === "USD" || !currency ? "$" : currency + " "}${amount.toLocaleString("en-US")}` : COST_LABEL[model];
  return <span className={`bdg cost ${paid ? "paid" : ""}`}>{txt}</span>;
}

export function FreshBdg({ freshness }: { freshness: Freshness }) {
  return <span className={`bdg ${FRESH_CLASS[freshness]}`} title="Freshness">{FRESH_LABEL[freshness]}</span>;
}

export function DiffDots({ difficulty }: { difficulty: Difficulty }) {
  const lvl = DIFF_LEVEL[difficulty];
  return (
    <span className="diff" title={difficulty} aria-label={`Difficulty: ${difficulty}`}>
      {[1, 2, 3].map((n) => <i key={n} className={n <= lvl ? "f" : ""} />)}
    </span>
  );
}

export function Bar({ pct, color, height = 9, testId }: { pct: number; color?: string; height?: number; testId?: string }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="pbt" style={{ height }} role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} data-testid={testId}>
      <i style={{ width: `${p}%`, background: color }} />
    </div>
  );
}

export function Switch({ checked, onChange, label, testId }: { checked: boolean; onChange: (v: boolean) => void; label?: string; testId?: string }) {
  return (
    <label className="sw" title={label}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} data-testid={testId} />
      <span />
    </label>
  );
}

export function Seg<T extends string>({ value, options, onChange, testId }: { value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; testId?: string }) {
  return (
    <div className="seg" role="tablist" data-testid={testId}>
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" aria-selected={o.value === value} className={`segbtn ${o.value === value ? "on" : ""}`} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}

export function PageHeader({ title, sub, right }: { title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="page-h row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
      <div><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
      {right && <div className="row">{right}</div>}
    </div>
  );
}

export function Card({ title, children, right, className, testId, bodyStyle }: { title?: ReactNode; children: ReactNode; right?: ReactNode; className?: string; testId?: string; bodyStyle?: React.CSSProperties }) {
  return (
    <div className={`card ${className ?? ""}`} data-testid={testId}>
      {title && <div className="card-h"><span>{title}</span><span className="grow" />{right}</div>}
      <div className="body" style={bodyStyle}>{children}</div>
    </div>
  );
}

/** Collapsible group with a colored left stripe (phase/track accordion). */
export function Accordion({ title, meta, color, open, onToggle, children, pct, right, testId }: { title: ReactNode; meta?: ReactNode; color?: string; open: boolean; onToggle: () => void; children: ReactNode; pct?: number; right?: ReactNode; testId?: string }) {
  return (
    <div className={`phase ${open ? "" : "col"}`} style={{ ["--pc" as string]: color }} data-testid={testId}>
      <div className="phase-h" onClick={onToggle} role="button" aria-expanded={open} tabIndex={0} aria-label={typeof title === "string" ? `${title} section` : undefined} data-testid={testId ? `${testId}-h` : undefined} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}>
        <span className="car">▼</span>
        <span className="nm">{title}</span>
        {meta && <span className="wk">{meta}</span>}
        <span className="grow" />
        {right}
        {pct !== undefined && (<><div className="pbar"><i style={{ width: `${pct}%` }} /></div><span className="ppct">{pct}%</span></>)}
      </div>
      <div className="phase-body">{children}</div>
    </div>
  );
}

/** Basic markdown-ish renderer: paragraphs, **bold**, `code`, - lists, links. Safe (no HTML injection). */
export function Md({ text }: { text: string }) {
  const blocks = useMemo(() => text.split(/\n{2,}/), [text]);
  return (
    <div className="md">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;
        }
        if (lines.some((l) => /^\s*[-*]\s+/.test(l))) {
          // mixed: leading prose lines, then bullet lines
          const firstBullet = lines.findIndex((l) => /^\s*[-*]\s+/.test(l));
          const prose = lines.slice(0, firstBullet);
          const bullets = lines.slice(firstBullet).filter((l) => l.trim());
          return <div key={i}>{prose.length > 0 && <p style={{ margin: "0 0 6px" }}>{inline(prose.join(" "))}</p>}<ul style={{ margin: "0 0 8px" }}>{bullets.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul></div>;
        }
        if (/^#{1,3}\s/.test(lines[0])) {
          const lvl = lines[0].match(/^(#{1,3})/)![1].length;
          const H = (`h${lvl + 2}`) as "h3" | "h4" | "h5";
          return <div key={i}><H style={{ margin: "8px 0 4px" }}>{inline(lines[0].replace(/^#{1,3}\s/, ""))}</H>{lines.slice(1).length > 0 && <p>{inline(lines.slice(1).join(" "))}</p>}</div>;
        }
        return <p key={i} style={{ margin: "0 0 8px" }}>{lines.map((l, j) => <span key={j}>{inline(l)}{j < lines.length - 1 && <br />}</span>)}</p>;
      })}
    </div>
  );
}

function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((https?:\/\/[^)\s]+)\)|https?:\/\/[^\s)]+)/g;
  let last = 0; let m: RegExpExecArray | null; let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<b key={k++}>{tok.slice(2, -2)}</b>);
    else if (tok.startsWith("`")) out.push(<code key={k++}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("[")) { const label = tok.slice(1, tok.indexOf("]")); out.push(<a key={k++} href={m[2]} target="_blank" rel="noreferrer">{label}</a>); }
    else {
      const trail = tok.match(/[.,;:!?]+$/)?.[0] ?? "";
      const clean = trail ? tok.slice(0, -trail.length) : tok;
      out.push(<a key={k++} href={clean} target="_blank" rel="noreferrer">{clean}</a>);
      if (trail) out.push(trail);
    }
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** Confirm dialog hook. */
export function useConfirm() {
  const [state, setState] = useState<{ msg: ReactNode; resolve: (v: boolean) => void } | null>(null);
  const confirm = useCallback((msg: ReactNode) => new Promise<boolean>((resolve) => setState({ msg, resolve })), []);
  const node = state ? (
    <Modal title="Are you sure?" onClose={() => { state.resolve(false); setState(null); }} testId="confirm">
      <p className="muted" style={{ marginTop: 0 }}>{state.msg}</p>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="sbtn" onClick={() => { state.resolve(false); setState(null); }}>Cancel</button>
        <button className="dangerbtn" onClick={() => { state.resolve(true); setState(null); }} data-testid="confirm-yes">Confirm</button>
      </div>
    </Modal>
  ) : null;
  return { confirm, node };
}
