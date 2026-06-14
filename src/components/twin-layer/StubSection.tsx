import { Badge } from "./atoms";
import { Icon } from "./Icon";
import { CAPABILITIES, type CapabilityGroup } from "@/lib/twin-layer/capabilities";

// Stub content for capabilities that previously had no UI surface.
// Each entry is a placeholder card — visually marked as "future backend-wired".
type StubContent = {
  capabilityId: string;
  homeownerTitle: string;
  question: string;
  body: string;
  preview: string[]; // bullet placeholders showing what will eventually render
};

const STUBS: StubContent[] = [
  // ─── Home ─────────────────────────────────────────────────────────────
  {
    capabilityId: "nec_load_calculation",
    homeownerTitle: "Service capacity check",
    question: "Will my 200A panel handle what I want to add?",
    body: "An NEC Section 220 load calculation will check whether adding an EV charger, heat pump, or extra battery would exceed your service rating.",
    preview: ["Existing demand load", "Projected new load", "Headroom remaining", "Service upgrade flag"],
  },

  // ─── Planner ──────────────────────────────────────────────────────────
  {
    capabilityId: "designs",
    homeownerTitle: "Design drafts",
    question: "Where do my saved planning drafts live?",
    body: "Each scenario you save becomes a design draft you can revisit, branch, or share. Today only the three preset pathways render.",
    preview: ["Draft name + last edited", "Branched from scenario", "Status: draft / shared / archived"],
  },
  {
    capabilityId: "estimate_readiness",
    homeownerTitle: "Estimate readiness gate",
    question: "Is this pathway ready for a real estimate?",
    body: "Before a scenario can produce a firm estimate, certain inputs must clear — interval usage, panel schedule, equipment selection. A readiness gate will surface what's blocking.",
    preview: ["Inputs satisfied · ✓", "Inputs missing · 2", "Confidence band", "Block reason"],
  },
  {
    capabilityId: "takeoffs",
    homeownerTitle: "Bill of materials",
    question: "What equipment, parts, and labor does this plan need?",
    body: "Takeoffs translate a chosen scenario into a contractor-ready parts list with quantities and category groupings.",
    preview: ["Modules / inverters", "Battery + cabling", "Labor hours by trade", "Total line items"],
  },

  // ─── Builder ──────────────────────────────────────────────────────────
  {
    capabilityId: "post_install",
    homeownerTitle: "After install",
    question: "What happens after the system is on?",
    body: "Post-install adds a homeowner-facing checklist for commissioning, monitoring setup, warranty registration, and the first 30-day performance check.",
    preview: ["Commissioning sign-off", "Monitoring linked", "Warranty registered", "30-day check-in"],
  },

  // ─── Internal / Admin ─────────────────────────────────────────────────
  {
    capabilityId: "ai_context",
    homeownerTitle: "AI prompt grounding",
    question: "What does the AI see when it answers homeowner questions?",
    body: "Internal-only. Surfaces the structured context (home facts, scenarios, provenance) currently being passed into any AI explanation so prompts stay grounded.",
    preview: ["Active home snapshot", "Included scenarios", "Excluded sensitive fields", "Token budget"],
  },
  {
    capabilityId: "geometry",
    homeownerTitle: "Roof & panel geometry",
    question: "How is the roof and equipment laid out spatially?",
    body: "Geometry stores roof planes, azimuths, tilt, and equipment placement coordinates that future visualizations and shading models will read from.",
    preview: ["Roof planes (N/S/E/W)", "Azimuth + tilt per plane", "Equipment XYZ placement"],
  },
  {
    capabilityId: "rule_provenance",
    homeownerTitle: "Why this rule fired",
    question: "Why was this scenario marked incompatible?",
    body: "Internal-only. When a compatibility rule blocks a pathway, this exposes which rule fired, what facts triggered it, and the rule version.",
    preview: ["Rule ID + version", "Triggering facts", "Severity", "Override path"],
  },
  {
    capabilityId: "privacy",
    homeownerTitle: "Share scope & redaction",
    question: "What does a contractor actually see when I share?",
    body: "Defines which fields leave the homeowner view on CRM hand-off — addresses, billing data, and any flagged sensitive notes are redacted or scoped.",
    preview: ["Fields shared", "Fields redacted", "Share expiry", "Audit trail"],
  },
];

function stubsForGroup(group: CapabilityGroup): Array<StubContent & { router: string; endpointGroup: string }> {
  return STUBS.map((s) => {
    const cap = CAPABILITIES.find((c) => c.id === s.capabilityId);
    if (!cap) return null;
    // Group membership is derived from capabilitiesByGroup definitions.
    // We re-check via the supports/group mapping by router id list.
    const groupMembers: Record<CapabilityGroup, string[]> = {
      home: ["nec_load_calculation"],
      explore: [],
      planner: ["designs", "estimate_readiness", "takeoffs"],
      builder: ["post_install"],
      internal: ["ai_context", "geometry", "rule_provenance", "privacy"],
    };
    if (!groupMembers[group].includes(s.capabilityId)) return null;
    return { ...s, router: cap.router, endpointGroup: cap.endpointGroup };
  }).filter((x): x is StubContent & { router: string; endpointGroup: string } => !!x);
}

export function StubSection({ group, title }: { group: CapabilityGroup; title?: string }) {
  const items = stubsForGroup(group);
  if (items.length === 0) return null;

  const heading = title ?? "Coming soon — backend wiring in flight";

  return (
    <section className="registry-section">
      <header className="registry-section-head">
        <p className="eyebrow">Future-wired</p>
        <h2 className="registry-section-title">{heading}</h2>
        <p className="registry-section-lede">
          Placeholder cards for capabilities the backend already supports but the shell hasn't surfaced yet.
          Every card here will swap to real data once its router is wired.
        </p>
      </header>
      <div className="registry-grid">
        {items.map((s) => (
          <article key={s.capabilityId} className="card registry-card stub-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Stub · {s.capabilityId.replaceAll("_", " ")}</p>
                <h3 className="card-title">{s.homeownerTitle}</h3>
              </div>
              <div className="registry-tags">
                <Badge tone="info">Future-wired</Badge>
              </div>
            </div>
            <p className="registry-question">
              <Icon name="search" size={14} />{s.question}
            </p>
            <p className="registry-empty">{s.body}</p>
            <ul className="stub-preview">
              {s.preview.map((p) => (
                <li key={p}>
                  <span className="stub-shimmer" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="registry-foot stub-foot">
              <span className="cap-router">{s.router}</span>
              <span className="cap-endpoint-inline">
                <Icon name="link" size={11} /><code>{s.endpointGroup}</code>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
