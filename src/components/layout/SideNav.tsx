import { NavLink } from "react-router-dom";
import { NAV } from "@/features/registry";
import { useForge } from "@/store";
import { usePlan } from "@/lib/hooks";

export function SideNav() {
  const plan = usePlan();
  const pinned = useForge((s) => s.settings.navPinned);
  const update = useForge((s) => s.updateSettings);
  const libQFromLink = useForge((s) => s.ui.libQFromLink);
  const setLibraryFilters = useForge((s) => s.setLibraryFilters);
  const setUi = useForge((s) => s.setUi);
  const badges: Record<string, { n: number; hot?: boolean }> = {
    today: { n: plan.next.filter((x) => x.unblocked).length + plan.drillsDue.length },
    drills: { n: plan.drillsDue.length, hot: plan.drillsDue.length > 0 },
    review: { n: plan.srs.due, hot: plan.srs.due > 0 },
  };
  return (
    <nav className="side" id="side" aria-label="Primary">
      <div className={`tabs ${pinned ? "pinned" : ""}`} id="tabs" data-testid="nav" onDoubleClick={() => update({ navPinned: !pinned })} title="Double-click to pin/unpin the menu">
        {NAV.map((n) => {
          const b = badges[n.key];
          const has = b && b.n > 0;
          return (
            <span key={n.key} style={{ display: "contents" }}>
              {n.sep && <div className="tabsep" />}
              <NavLink to={n.path} onClick={(e) => { if (n.key === "library" && libQFromLink) { setLibraryFilters({ q: "" }); setUi({ libQFromLink: false }); } if (e.detail > 0) e.currentTarget.blur(); }} className={({ isActive }) => `tab ${isActive ? "sel" : ""} ${has ? "has-badge" : ""} ${has && b.hot ? "hot" : ""}`} data-testid={`nav-${n.key}`} title={n.label}>
                <span className="ti" aria-hidden="true">{n.icon}</span>
                <span className="tl">{n.label}</span>
                {has && <span className={`c ${b.hot ? "hot" : ""}`}>{b.n > 99 ? "99+" : b.n}</span>}
              </NavLink>
            </span>
          );
        })}
      </div>
    </nav>
  );
}
