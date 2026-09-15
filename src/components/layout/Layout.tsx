import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { SideNav } from "./SideNav";
import { Rail } from "./Rail";
import { useForge } from "@/store";
import { content } from "@/data";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

export function Layout() {
  const theme = useForge((s) => s.settings.theme);
  const railOpen = useForge((s) => s.settings.railOpen);
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className={`wrap ${railOpen ? "" : "norail"}`} id="wrap">
        <SideNav />
        <main id="main" data-testid="main">
          <Suspense fallback={<div className="empty" data-testid="loading">Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
        {railOpen && <Rail />}
      </div>
      <div className="foot" data-testid="foot">
        Forge · content v{content.meta.version} generated {content.meta.generated} · {content.resources.length} resources · {content.projects.length} projects · {content.drills.length} drills · {content.cards.length} cards. Progress is stored in this browser (<code>localStorage</code>); export a backup from Settings.
      </div>
    </>
  );
}
