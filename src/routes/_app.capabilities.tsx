import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CAPABILITY_GROUPS,
  STATUS_META,
  capabilitiesByGroup,
  type CapabilityGroup,
} from "@/lib/twin-layer/capabilities";
import { Badge } from "@/components/twin-layer/atoms";
import { Icon } from "@/components/twin-layer/Icon";

export const Route = createFileRoute("/_app/capabilities")({
  head: () => ({
    meta: [
      { title: "Backend Capability Map — Twin Layer" },
      { name: "description", content: "Read-only map of backend capabilities and the heart-quill cards they will eventually power." },
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

function CapabilitiesPage() {
  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Reference · read-only</p>
          <h2 className="tab-title">Backend capability map</h2>
          <p className="tab-lede">
            Discovered FastAPI routers from <code>energyplanner0613</code>, grouped by the homeowner
            surface they will eventually power. Nothing on this page is wired — heart-quill still runs
            from in-memory mock data.
          </p>
        </div>
        <div className="tab-head-meta">
          <span className="live-dot" style={{ background: "#e0913f" }} />
          Mock shell · backend not connected
        </div>
      </header>

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
                return (
                  <article key={c.id} className="card cap-card">
                    <div className="cap-card-head">
                      <code className="cap-router">{c.router}</code>
                      <Badge tone={s.tone}>{s.label}</Badge>
                    </div>
                    <p className="cap-endpoint">
                      <Icon name="layers" size={12} />
                      <code>{c.endpointGroup}</code>
                    </p>
                    <p className="cap-supports">{c.supports}</p>
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
