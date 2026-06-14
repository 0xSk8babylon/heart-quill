import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CAPABILITY_GROUPS,
  STATUS_META,
  UI_STATUS_META,
  capabilitiesByGroup,
  uiSummary,
  type CapabilityGroup,
  type UiStatus,
} from "@/lib/twin-layer/capabilities";
import { Badge } from "@/components/twin-layer/atoms";
import { Icon } from "@/components/twin-layer/Icon";

export const Route = createFileRoute("/_app/capabilities")({
  head: () => ({
    meta: [
      { title: "Backend Capability Map — Twin Layer" },
      { name: "description", content: "Read-only map of backend capabilities cross-referenced with the heart-quill UI shell inventory." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CapabilitiesPage,
});

const GROUP_ORDER: CapabilityGroup[] = ["home", "explore", "planner", "builder", "internal"];

const GROUP_LINK: Partial<Record<CapabilityGroup, { to: "/twin" | "/explore" | "/scenario" | "/progress" | "/internal"; label: string }>> = {
  home: { to: "/twin", label: "Open Home" },
  explore: { to: "/explore", label: "Open Explore" },
  planner: { to: "/scenario", label: "Open Planner" },
  builder: { to: "/progress", label: "Open Builder" },
  internal: { to: "/internal", label: "Open Internal" },
};

const UI_ORDER: UiStatus[] = ["in_shell", "future_wired", "source_view_pair", "trust_candidate_pair", "missing"];

function CapabilitiesPage() {
  const counts = uiSummary();
  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Reference · read-only</p>
          <h2 className="tab-title">Backend capability map</h2>
          <p className="tab-lede">
            FastAPI routers from <code>energyplanner0613</code> cross-referenced with the heart-quill
            UI shell. Every card shows two things: the <strong>backend status</strong> (does the
            router exist?) and the <strong>UI shell status</strong> (does a card represent it
            today?). Nothing on this page is wired.
          </p>
        </div>
        <div className="tab-head-meta">
          <span className="live-dot" style={{ background: "#e0913f" }} />
          Mock shell · backend not connected
        </div>
      </header>

      <section className="card cap-legend">
        <div>
          <p className="eyebrow">UI shell inventory</p>
          <h3 className="card-title">What's already in the shell vs. still missing</h3>
        </div>
        <div className="cap-legend-grid">
          {UI_ORDER.map((k) => {
            const m = UI_STATUS_META[k];
            return (
              <div key={k} className={`cap-legend-item cap-legend-${m.tone}`}>
                <div className="cap-legend-head">
                  <Badge tone={m.tone}>{m.label}</Badge>
                  <span className="cap-legend-count">{counts[k]}</span>
                </div>
                <p className="cap-legend-desc">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {GROUP_ORDER.map((group) => {
        const meta = CAPABILITY_GROUPS[group];
        const items = capabilitiesByGroup(group);
        const link = GROUP_LINK[group];
        return (
          <section key={group} className="registry-section">
            <header className="registry-section-head">
              <p className="eyebrow">{meta.label}</p>
              <h2 className="registry-section-title">{meta.label} surfaces</h2>
              <p className="registry-section-lede">{meta.lede}</p>
              {link ? (
                <Link to={link.to} className="cap-section-link">
                  <Icon name="layers" size={13} />
                  {link.label}
                </Link>
              ) : null}
            </header>
            <div className="cap-grid">
              {items.map((c) => {
                const s = STATUS_META[c.status];
                const u = UI_STATUS_META[c.uiStatus];
                return (
                  <article key={c.id} className={`card cap-card cap-ui-${u.tone}`}>
                    <div className="cap-card-head">
                      <code className="cap-router">{c.router}</code>
                      <Badge tone={u.tone}>{u.label}</Badge>
                    </div>
                    <p className="cap-endpoint">
                      <Icon name="layers" size={12} />
                      <code>{c.endpointGroup}</code>
                      <span className="cap-endpoint-sep">·</span>
                      <Badge tone={s.tone}>{s.label}</Badge>
                    </p>
                    <p className="cap-supports">{c.supports}</p>
                    {c.uiLocations.length ? (
                      <ul className="cap-locations">
                        {c.uiLocations.map((loc) => (
                          <li key={loc}>
                            <Icon name="check" size={11} />
                            <span>{loc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="cap-locations-empty">No UI surface yet.</p>
                    )}
                    {c.note ? <p className="cap-note">{c.note}</p> : null}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
