import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CAPABILITY_GROUPS,
  STATUS_META,
  UI_STATUS_META,
  type CapabilityGroup,
} from "@/lib/twin-layer/capabilities";
import { catalogByGroup, type EnrichedCatalogEntry } from "@/lib/twin-layer/catalog";
import { Badge } from "@/components/twin-layer/atoms";
import { Icon } from "@/components/twin-layer/Icon";

export const Route = createFileRoute("/_app/catalog")({
  head: () => ({
    meta: [
      { title: "Capability Catalog — Twin Layer" },
      { name: "description", content: "Plain-English catalog of every backend capability, with inputs, outputs, and recommended UI section. Documentation only — no live data." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CatalogPage,
});

const GROUP_ORDER: CapabilityGroup[] = ["home", "explore", "planner", "builder", "internal"];

function CatalogPage() {
  const [activeGroup, setActiveGroup] = useState<CapabilityGroup | "all">("all");
  const [query, setQuery] = useState("");

  const entries = useMemo(() => {
    const all = GROUP_ORDER.flatMap((g) => catalogByGroup(g));
    const byGroup = activeGroup === "all" ? all : all.filter((e) => e.recommendedSection === activeGroup);
    const q = query.trim().toLowerCase();
    if (!q) return byGroup;
    return byGroup.filter((e) =>
      [e.title, e.what, e.why, e.homeownerQuestion, e.router, e.id].some((s) => s.toLowerCase().includes(q)),
    );
  }, [activeGroup, query]);

  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Catalog · documentation-only</p>
          <h2 className="tab-title">Capability catalog</h2>
          <p className="tab-lede">
            Plain-English description of every backend router discovered in <code>energyplanner0613</code>.
            For each capability: what it does, why it exists, who uses it, the homeowner question it answers,
            its inputs and outputs, related capabilities, and the recommended UI section. All samples are
            seed/demo data — nothing on this page calls the backend.
          </p>
        </div>
        <div className="tab-head-meta">
          <span className="live-dot" style={{ background: "#8fb8d8" }} />
          Reference · seed data only
          <Link to="/capabilities" className="cap-section-link" style={{ marginLeft: 12 }}>
            <Icon name="layers" size={13} />
            UI shell inventory
          </Link>
        </div>
      </header>

      <section className="card catalog-controls">
        <div className="catalog-tabs">
          <button
            className={`catalog-tab ${activeGroup === "all" ? "catalog-tab-on" : ""}`}
            onClick={() => setActiveGroup("all")}
          >
            All <span className="catalog-tab-count">{GROUP_ORDER.reduce((n, g) => n + catalogByGroup(g).length, 0)}</span>
          </button>
          {GROUP_ORDER.map((g) => (
            <button
              key={g}
              className={`catalog-tab ${activeGroup === g ? "catalog-tab-on" : ""}`}
              onClick={() => setActiveGroup(g)}
            >
              {CAPABILITY_GROUPS[g].label}
              <span className="catalog-tab-count">{catalogByGroup(g).length}</span>
            </button>
          ))}
        </div>
        <div className="catalog-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Search capability, router, or question…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      <div className="catalog-list">
        {entries.map((e) => (
          <CatalogCard key={e.id} entry={e} />
        ))}
        {entries.length === 0 ? (
          <p className="catalog-empty">No capabilities match that filter.</p>
        ) : null}
      </div>
    </div>
  );
}

function CatalogCard({ entry }: { entry: EnrichedCatalogEntry }) {
  const s = STATUS_META[entry.status];
  const u = UI_STATUS_META[entry.uiStatus];
  return (
    <article className="card catalog-card">
      <header className="catalog-card-head">
        <div>
          <p className="eyebrow">{CAPABILITY_GROUPS[entry.recommendedSection].label}</p>
          <h3 className="catalog-card-title">{entry.title}</h3>
          <p className="catalog-card-question">"{entry.homeownerQuestion}"</p>
        </div>
        <div className="catalog-card-badges">
          <Badge tone={u.tone}>{u.label}</Badge>
          <Badge tone={s.tone}>{s.label}</Badge>
        </div>
      </header>

      <p className="catalog-card-meta">
        <code className="cap-router">{entry.router}</code>
        <span className="cap-endpoint-sep">·</span>
        <code>{entry.endpointGroup}</code>
      </p>

      <div className="catalog-grid">
        <Field label="What it does" value={entry.what} />
        <Field label="Why it exists" value={entry.why} />
        <Field label="Who uses it" value={entry.who} />
        <ListField label="Inputs" items={entry.inputs} />
        <ListField label="Outputs" items={entry.outputs} />
        <RelatedField items={entry.related} />
      </div>

      {(entry.sampleInput || entry.sampleOutput) ? (
        <div className="catalog-samples">
          {entry.sampleInput ? (
            <div className="catalog-sample">
              <p className="catalog-sample-label">Sample input · demo</p>
              <pre>{JSON.stringify(entry.sampleInput, null, 2)}</pre>
            </div>
          ) : null}
          {entry.sampleOutput ? (
            <div className="catalog-sample">
              <p className="catalog-sample-label">Sample output · demo</p>
              <pre>{JSON.stringify(entry.sampleOutput, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="catalog-field">
      <p className="catalog-field-label">{label}</p>
      <p className="catalog-field-value">{value}</p>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="catalog-field">
      <p className="catalog-field-label">{label}</p>
      <ul className="catalog-field-list">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

function RelatedField({ items }: { items: string[] }) {
  return (
    <div className="catalog-field">
      <p className="catalog-field-label">Related</p>
      <ul className="catalog-related">
        {items.map((id) => <li key={id}><code>{id}</code></li>)}
      </ul>
    </div>
  );
}
