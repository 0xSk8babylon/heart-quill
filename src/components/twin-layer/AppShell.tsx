import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useRouterState } from "@tanstack/react-router";
import { HOME } from "@/lib/twin-layer/data";
import { useTwin } from "@/lib/twin-layer/store";
import { Icon, type IconName } from "./Icon";
import { Inspector } from "./Inspector";

const TABS: Array<{ to: "/twin" | "/explore" | "/scenario" | "/progress"; icon: IconName; title: string; sub: string }> = [
  { to: "/twin", icon: "home", title: "Home", sub: "Your digital twin" },
  { to: "/explore", icon: "search", title: "Explore", sub: "Profile · goals · learn" },
  { to: "/scenario", icon: "layers", title: "Planner", sub: "Plan. Compare. Decide." },
  { to: "/progress", icon: "users", title: "Builder", sub: "Shared with your contractor" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { needs, selectedNode, selectNode, confirmNode, toast } = useTwin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const location = useLocation();

  // Set dark theme + density on <html> like the original prototype
  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-theme", "dark");
    r.setAttribute("data-density", "regular");
    r.style.setProperty("--accent-warn", "#e0913f");
    r.style.setProperty("--twin-glow", "#8fb8d8");
  }, []);

  // Clear selection on route change
  useEffect(() => { selectNode(null); }, [location.pathname, selectNode]);

  return (
    <div className="app">
      <header className="topnav">
        <div className="brand">
          <span className="brand-mark"><Icon name="spark" size={18} /></span>
        </div>
        <nav className="tabs">
          {TABS.map((x) => {
            const active = pathname === x.to;
            const showBadge = x.to === "/progress" && needs > 0;
            return (
              <Link key={x.to} to={x.to} className={`tab ${active ? "tab-on" : ""}`}>
                <span className="tab-icon"><Icon name={x.icon} size={20} /></span>
                <span className="tab-text">
                  <span className="tab-title-sm">
                    {x.title}
                    {showBadge ? <span className="tab-badge">{needs}</span> : null}
                  </span>
                  <span className="tab-sub">{x.sub}</span>
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="topnav-right">
          <button className="icon-btn" aria-label="Notifications">
            <Icon name="bell" size={19} />
            {needs ? <span className="icon-badge" /> : null}
          </button>
          <Link to="/capabilities" className="icon-btn" aria-label="Backend capability map" title="Backend capability map">
            <Icon name="scale" size={18} />
          </Link>
          <Link to="/catalog" className="icon-btn" aria-label="Capability catalog" title="Capability catalog">
            <Icon name="layers" size={18} />
          </Link>
          <button className="icon-btn" aria-label="Settings"><Icon name="gear" size={19} /></button>
          <span className="avatar">{HOME.initials}</span>
        </div>
      </header>

      <main className="stage">{children}</main>

      {selectedNode ? (
        <Inspector node={selectedNode} onClose={() => selectNode(null)} onConfirm={confirmNode} />
      ) : null}

      {toast ? (
        <div className="toast"><Icon name="check" size={16} />{toast}</div>
      ) : null}
    </div>
  );
}
