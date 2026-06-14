import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/twin-layer/atoms";
import { Icon } from "@/components/twin-layer/Icon";
import { HomeDiagram } from "@/components/twin-layer/HomeDiagram";
import { NODES } from "@/lib/twin-layer/data";
import {
  TEMPLATES, SANDBOX_DRAFTS, COMPARISON_FIELDS, MATURITY,
  TEMPLATE_OVERLAYS, UPGRADE_PATH, PLAN_CARDS,
  type TemplateArchitecture, type PlanCard, type UpgradeStep,
} from "@/lib/twin-layer/objects";

export const Route = createFileRoute("/_app/planner")({
  head: () => ({
    meta: [
      { title: "Planner — Twin Layer" },
      { name: "description", content: "Visual scenario builder — see how each template touches your home, compare cost / difficulty / readiness, and plan the upgrade path." },
      { property: "og:title", content: "Planner — Twin Layer" },
      { property: "og:description", content: "Visual scenario builder — see how each template touches your home, compare cost / difficulty / readiness, and plan the upgrade path." },
    ],
  }),
  component: PlannerPage,
});

type Tab = "templates" | "sandbox" | "comparisons";

function PlannerPage() {
  const [tab, setTab] = useState<Tab>("templates");
  const overlayKeys = Object.keys(TEMPLATE_OVERLAYS);
  const [overlayId, setOverlayId] = useState<string>(overlayKeys[0]);
  const overlay = TEMPLATE_OVERLAYS[overlayId];

  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Planner</p>
          <h2 className="tab-title">Plan. Compare. Decide.</h2>
          <p className="tab-lede">
            See how each pattern touches your home, sketch your own draft, and compare them side by
            side. Nothing here is committed — drafts only become a real plan when they're validated
            against your home and a contractor.
          </p>
        </div>
        <div className="tab-head-meta">
          <span className="live-dot" />
          Mock shell · planning sketches only
        </div>
      </header>

      <PlannerCanvas overlayId={overlayId} setOverlayId={setOverlayId} overlay={overlay} />

      <UpgradePathStrip />

      <nav className="planner-tabs" role="tablist">
        <TabBtn id="templates"   active={tab} onClick={setTab} icon="layers" label="Guided Templates" count={TEMPLATES.length} />
        <TabBtn id="sandbox"     active={tab} onClick={setTab} icon="spark"  label="Sandbox Drafts"   count={SANDBOX_DRAFTS.length} />
        <TabBtn id="comparisons" active={tab} onClick={setTab} icon="scale"  label="Comparisons"      count={PLAN_CARDS.length} />
      </nav>

      {tab === "templates"   ? <TemplatesView />   : null}
      {tab === "sandbox"     ? <SandboxView />     : null}
      {tab === "comparisons" ? <ComparisonsView /> : null}

      <MaturityStrip />
    </div>
  );
}

// ── Canvas: home twin + overlay of what a template adds ────────
function PlannerCanvas({
  overlayId, setOverlayId, overlay,
}: {
  overlayId: string;
  setOverlayId: (id: string) => void;
  overlay: { color: string; nodeIds: string[]; caption: string };
}) {
  const noop = () => {};
  return (
    <section className="card planner-canvas-card">
      <header className="planner-canvas-head">
        <div>
          <p className="eyebrow">Scenario canvas</p>
          <h3 className="card-title">How a pattern lands on your home</h3>
          <p className="planner-canvas-lede">
            Read-only visualization. Highlights show which parts of your Energy Twin a pattern would
            touch. No equipment is added or committed.
          </p>
        </div>
        <div className="planner-canvas-legend" aria-hidden="true">
          <span className="planner-canvas-swatch" style={{ background: overlay.color }} />
          <span>Touched by pattern</span>
        </div>
      </header>

      <div className="planner-canvas-grid">
        <div className="planner-canvas-diagram">
          <HomeDiagram
            nodes={NODES}
            selectedId={null}
            onSelect={noop}
            compact
            overlay={{ color: overlay.color, nodeIds: overlay.nodeIds }}
          />
        </div>
        <div className="planner-canvas-side">
          <p className="field-label">Preview a pattern</p>
          <div className="planner-canvas-chips" role="tablist" aria-label="Preview pattern">
            {Object.entries(TEMPLATE_OVERLAYS).map(([id, o]) => {
              const t = TEMPLATES.find((x) => x.id === id);
              const on = id === overlayId;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={`planner-canvas-chip ${on ? "planner-canvas-chip-on" : ""}`}
                  onClick={() => setOverlayId(id)}
                  style={on ? { borderColor: o.color, boxShadow: `0 0 0 1px ${o.color} inset` } : undefined}
                >
                  <span className="planner-canvas-chip-dot" style={{ background: o.color }} />
                  <span className="planner-canvas-chip-label">
                    {t ? `${t.architecture} · ${t.intent}` : id}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="planner-canvas-caption">{overlay.caption}</p>
          <p className="planner-canvas-note">
            Visualization only — actual equipment, conduit and panel work are decided with a
            contractor on the Builder tab.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Upgrade path strip ─────────────────────────────────────────
const STATE_TONE: Record<UpgradeStep["state"], "ok" | "info" | "warn" | "default"> = {
  current: "ok",
  ready: "ok",
  planned: "info",
  future: "default",
  blocked: "warn",
};

function UpgradePathStrip() {
  return (
    <section className="card upgrade-path-card">
      <header className="card-head">
        <div>
          <p className="eyebrow">Upgrade path</p>
          <h3 className="card-title">From today toward your goals</h3>
          <p className="planner-canvas-lede">
            A possible order of upgrades for this home. Order, costs and timing are illustrative.
          </p>
        </div>
        <Badge tone="info">Read-only</Badge>
      </header>
      <ol className="upgrade-path">
        {UPGRADE_PATH.map((s, i) => (
          <li key={s.id} className={`upgrade-step upgrade-step-${s.state}`}>
            <div className="upgrade-step-marker">
              <span className="upgrade-step-num">{i + 1}</span>
              {i < UPGRADE_PATH.length - 1 ? <span className="upgrade-step-line" /> : null}
            </div>
            <div className="upgrade-step-body">
              <div className="upgrade-step-head">
                <span className="upgrade-step-label">{s.label}</span>
                <Badge tone={STATE_TONE[s.state]}>{s.state}</Badge>
              </div>
              <p className="upgrade-step-detail">{s.detail}</p>
              {s.note ? <p className="upgrade-step-note"><Icon name="shield" size={11} />{s.note}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}


function TabBtn({
  id, active, onClick, icon, label, count,
}: { id: Tab; active: Tab; onClick: (t: Tab) => void; icon: "layers" | "spark" | "scale"; label: string; count: number }) {
  const on = active === id;
  return (
    <button type="button" role="tab" aria-selected={on} className={`planner-tab ${on ? "planner-tab-on" : ""}`} onClick={() => onClick(id)}>
      <Icon name={icon} size={16} />
      <span>{label}</span>
      <span className="planner-tab-count">{count}</span>
    </button>
  );
}

// ── Templates ──────────────────────────────────────────────────
const ARCHES: TemplateArchitecture[] = ["AC-Coupled", "DC-Coupled", "Hybrid", "Off-Grid"];

function TemplatesView() {
  return (
    <section className="planner-section">
      <p className="planner-section-lede">
        Known starting patterns grouped by architecture. Pick one to seed a Sandbox Draft.
      </p>
      <div className="tpl-arch-grid">
        {ARCHES.map((arch) => (
          <article key={arch} className="card tpl-arch-card">
            <header className="tpl-arch-head">
              <h3 className="card-title">{arch}</h3>
              <Badge tone="info">{TEMPLATES.filter((t) => t.architecture === arch).length} patterns</Badge>
            </header>
            <ul className="tpl-list">
              {TEMPLATES.filter((t) => t.architecture === arch).map((t) => (
                <li key={t.id} className="tpl-item">
                  <div className="tpl-item-head">
                    <span className="tpl-item-title">{t.intent}</span>
                    <span className="tpl-item-meta">
                      <Pips n={t.costTier} max={4} title="Cost" />
                      <Pips n={t.complexity} max={4} title="Complexity" />
                    </span>
                  </div>
                  <p className="tpl-item-blurb">{t.blurb}</p>
                  <div className="tpl-item-foot">
                    <Badge tone={t.backup === "none" ? "default" : t.backup === "long-duration" ? "ok" : "info"}>
                      {t.backup === "none" ? "No backup" : `${t.backup} backup`}
                    </Badge>
                    <button type="button" className="link-btn">Seed a draft →</button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pips({ n, max, title }: { n: number; max: number; title: string }) {
  return (
    <span className="pips" title={`${title}: ${n}/${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`pip ${i < n ? "pip-on" : ""}`} />
      ))}
    </span>
  );
}

// ── Sandbox Drafts ─────────────────────────────────────────────
function SandboxView() {
  return (
    <section className="planner-section">
      <div className="sandbox-warn">
        <Icon name="shield" size={14} />
        <span>
          <strong>Draft only</strong> — not yet validated against your home, utility, panel,
          service size, or contractor requirements.
        </span>
      </div>
      <div className="sandbox-grid">
        {SANDBOX_DRAFTS.map((d) => (
          <article key={d.id} className="card sandbox-card">
            <header className="sandbox-head">
              <div>
                <h3 className="card-title">{d.name}</h3>
                <p className="sandbox-sub">
                  Seeded from <code>{d.templateId}</code> · Goal: <code>{d.goalId}</code>
                </p>
              </div>
              <Badge tone={d.validation === "validated" ? "ok" : d.validation === "checked" ? "info" : "warn"}>
                {d.validation}
              </Badge>
            </header>

            <div className="sandbox-grid-inner">
              <FieldList label="System type"          items={[d.systemType]} />
              <FieldList label="Equipment categories" items={d.equipment} />
              <FieldList label="Backup preference"    items={[d.backup]} />
              <FieldList label="Budget preference"    items={[d.budget]} />
              <FieldList label="Timeline preference"  items={[d.timeline]} />
              <FieldList label="Assumptions"          items={d.assumptions} />
              <FieldList label="Missing facts"        items={d.missingFacts} tone="warn" />
              <FieldList label="Draft warnings"       items={d.warnings} tone="warn" />
            </div>
          </article>
        ))}

        <article className="card sandbox-card sandbox-new">
          <Icon name="plus" size={22} />
          <h3 className="card-title">Start a new sandbox draft</h3>
          <p className="sandbox-sub">Pick a goal in Explore, or seed one from a Guided Template above.</p>
          <Link to="/explore" className="link-btn">Go to Goals →</Link>
        </article>
      </div>
    </section>
  );
}

function FieldList({ label, items, tone }: { label: string; items: string[]; tone?: "warn" }) {
  return (
    <div className={`field-block ${tone ? `field-block-${tone}` : ""}`}>
      <p className="field-label">{label}</p>
      <ul className="field-values">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

// ── Comparisons ────────────────────────────────────────────────
function ComparisonsView() {
  const rows = useMemo(() => ([
    {
      name: "Template · AC Partial Backup",
      kind: "template" as const,
      values: {
        goal: "Outages",            cost: "●●○○",  complexity: "●●○○",  backup: "Partial",
        savings: "Moderate",        resilience: "Good",        future: "Medium",
        missing: "—",               confidence: "Pattern only", readiness: "Not gated",
        contractor: "No",           next: "Seed a draft",
      },
    },
    {
      name: SANDBOX_DRAFTS[0].name,
      kind: "draft" as const,
      values: {
        goal: "Outages",            cost: "●●○○",  complexity: "●●○○",  backup: "Partial",
        savings: "Moderate",        resilience: "Good",        future: "Medium",
        missing: "2 items",         confidence: "Medium",       readiness: "Shading study",
        contractor: "Eventually",   next: "Run compatibility checks",
      },
    },
    {
      name: SANDBOX_DRAFTS[1].name,
      kind: "draft" as const,
      values: {
        goal: "Future-proof",       cost: "●●●○",  complexity: "●●●○",  backup: "None",
        savings: "Strong",          resilience: "Low",         future: "High",
        missing: "Heat-pump est.",  confidence: "Medium",       readiness: "NEC service check",
        contractor: "Yes",          next: "Estimate heat-pump load",
      },
    },
  ]), []);

  return (
    <section className="planner-section">
      <p className="planner-section-lede">
        Compare templates and drafts on the same fields. Validated scenarios appear here once a draft
        clears its readiness gates.
      </p>
      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Field</th>
              {rows.map((r) => (
                <th key={r.name}>
                  <div className="compare-col-head">
                    <span>{r.name}</span>
                    <Badge tone={r.kind === "template" ? "info" : "warn"}>{r.kind}</Badge>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_FIELDS.map((f) => (
              <tr key={f.key}>
                <th scope="row">{f.label}</th>
                {rows.map((r) => (
                  <td key={r.name}>{(r.values as Record<string, string>)[f.key] ?? "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Maturity Strip ─────────────────────────────────────────────
function MaturityStrip() {
  return (
    <section className="card maturity-card">
      <header className="card-head">
        <div>
          <p className="eyebrow">Maturity model</p>
          <h3 className="card-title">How an idea becomes a project</h3>
        </div>
        <Badge tone="info">Read-only</Badge>
      </header>
      <ol className="maturity-strip">
        {MATURITY.map((m, i) => (
          <li key={m.stage} className="maturity-step">
            <span className="maturity-num">{i + 1}</span>
            <div>
              <p className="maturity-label">{m.label}</p>
              <p className="maturity-meaning">{m.meaning}</p>
              <p className="maturity-page">Lives in: <strong>{m.page}</strong></p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
