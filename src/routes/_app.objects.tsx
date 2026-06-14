import { createFileRoute, Link } from "@tanstack/react-router";
import { CAPABILITIES, type Capability } from "@/lib/twin-layer/capabilities";
import { Badge } from "@/components/twin-layer/atoms";
import { Icon, type IconName } from "@/components/twin-layer/Icon";

export const Route = createFileRoute("/_app/objects")({
  head: () => ({
    meta: [
      { title: "Product Objects — Twin Layer" },
      { name: "description", content: "Homeowner-facing product objects: Energy Twin, Goals, Learn, Scenario, and Project — and the capabilities behind each one." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ObjectsPage,
});

type SectionKey = "Home" | "Explore" | "Planner" | "Builder";
type ObjectStatus = "mocked" | "stubbed" | "future_wired" | "backend_backed";

const STATUS_LABEL: Record<ObjectStatus, { label: string; tone: "ok" | "warn" | "info" | "off" }> = {
  mocked:         { label: "Mocked",         tone: "warn" },
  stubbed:        { label: "Stubbed",        tone: "off"  },
  future_wired:   { label: "Future-wired",   tone: "info" },
  backend_backed: { label: "Backend-backed", tone: "ok"   },
};

type ProductObject = {
  id: string;
  name: string;
  icon: IconName;
  section: SectionKey;
  sectionRoute: "/twin" | "/explore" | "/scenario" | "/progress";
  status: ObjectStatus;
  usedFor: string;
  capabilityIds: string[];
  displays: string[];
  decisions: string[];
};

const OBJECTS: ProductObject[] = [
  {
    id: "energy-twin",
    name: "Energy Twin",
    icon: "home",
    section: "Home",
    sectionRoute: "/twin",
    status: "mocked",
    usedFor:
      "A live mirror of the home — the panel, the loads, what's installed today, and how trustworthy each fact is. The homeowner opens this to see what the system already knows about their house.",
    capabilityIds: [
      "homes", "buildings", "panels", "loads", "energy_passport",
      "system_visibility", "facts", "provenance", "evidence", "nec_load_calculation",
    ],
    displays: [
      "Address, square footage, panel size, service amps",
      "Single-line diagram with status dots (known / needs / not added)",
      "Energy passport summary (annual use, solar, battery)",
      "Trust badges on each fact with source / basis",
    ],
    decisions: [
      "Do I have headroom on my panel for an EV charger or heat pump?",
      "Which facts about my home need confirming before I plan upgrades?",
      "What does my contractor see vs. what I see?",
    ],
  },
  {
    id: "goals",
    name: "Goals",
    icon: "spark",
    section: "Explore",
    sectionRoute: "/explore",
    status: "mocked",
    usedFor:
      "The homeowner's priorities — resilience, bill savings, electrification, comfort. Drives which scenarios get recommended and how trade-offs are framed.",
    capabilityIds: [
      "product_preferences", "twin_planning_context", "design_advisor",
    ],
    displays: [
      "Ranked priority chips (backup power, savings, EV-ready, low carbon)",
      "Budget band and timeline window",
      "Ecosystem preferences (Tesla, Enphase, agnostic)",
      "Narrative of what's possible next given goals",
    ],
    decisions: [
      "What am I optimizing for first?",
      "Which scenarios should the planner surface for me?",
      "How aggressive a timeline am I willing to commit to?",
    ],
  },
  {
    id: "learn",
    name: "Learn",
    icon: "book",
    section: "Explore",
    sectionRoute: "/explore",
    status: "stubbed",
    usedFor:
      "Plain-language explainers cited to real sources — NEM 3.0, rebates, code basics, compatibility rules. The homeowner reads these to understand why a recommendation is what it is.",
    capabilityIds: [
      "source_documents", "program_intelligence", "compatibility_rules", "rule_provenance",
    ],
    displays: [
      "Topic cards (NEM 3.0, IRA tax credits, panel upgrades)",
      "Citations to source documents and program filings",
      "Compatibility rule explainers ('why this inverter pairs with that battery')",
      "Local program eligibility notes",
    ],
    decisions: [
      "Why does this rule apply to my home?",
      "What programs am I likely eligible for?",
      "How current is the information I'm reading?",
    ],
  },
  {
    id: "scenario",
    name: "Scenario",
    icon: "layers",
    section: "Planner",
    sectionRoute: "/scenario",
    status: "mocked",
    usedFor:
      "A comparable pathway — equipment + estimate + readiness + ecosystem fit. The homeowner uses scenarios to compare two or three concrete futures side by side and pick one to share with a contractor.",
    capabilityIds: [
      "designs", "scenarios", "estimates", "estimate_readiness", "equipment",
      "compatibility_rules", "design_advisor", "proposal_option_sets",
      "product_library", "takeoffs", "planning",
    ],
    displays: [
      "Three pathway cards (e.g. essentials / balanced / whole-home)",
      "Cost, payback, and confidence chip per pathway",
      "Equipment chips and ecosystem badge",
      "Readiness gate (what's missing before this can be estimated firmly)",
    ],
    decisions: [
      "Which pathway fits my goals and budget?",
      "What do I still need to confirm before I commit?",
      "Which scenario do I send to a contractor?",
    ],
  },
  {
    id: "project",
    name: "Project",
    icon: "users",
    section: "Builder",
    sectionRoute: "/progress",
    status: "mocked",
    usedFor:
      "A live shared workspace with the contractor — lanes, activity, hand-off context, and post-install records. The homeowner watches their chosen scenario become a real install.",
    capabilityIds: [
      "contractor_workflow", "contractor_context", "crm_handoff",
      "planning_exchange", "post_install", "privacy",
    ],
    displays: [
      "Five review lanes (scoping → design → permit → install → close-out)",
      "Contractor header card (who's assigned, contact, status)",
      "Activity feed and outstanding 'needs from you' items",
      "Share scope — what the contractor can and cannot see",
    ],
    decisions: [
      "What does my contractor need from me right now?",
      "Where is my project in the pipeline?",
      "What was actually installed, and what's on record afterwards?",
    ],
  },
];

const SECTION_TONE: Record<SectionKey, "ok" | "warn" | "info" | "off"> = {
  Home: "ok",
  Explore: "info",
  Planner: "warn",
  Builder: "off",
};

function ObjectsPage() {
  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Product shape · read-only</p>
          <h2 className="tab-title">Product objects</h2>
          <p className="tab-lede">
            Five homeowner-facing objects the shell is built around. This view is the bridge between
            the router inventory (<Link to="/capabilities">/capabilities</Link>) and the plain-English
            catalog (<Link to="/catalog">/catalog</Link>) — it answers <em>"what does the homeowner
            actually pick up and use?"</em> Nothing here is wired.
          </p>
        </div>
        <div className="tab-head-meta">
          <span className="live-dot" style={{ background: "#8fb8d8" }} />
          Mock shell · backend not connected
        </div>
      </header>

      <section className="obj-grid">
        {OBJECTS.map((o) => (
          <ObjectCard key={o.id} obj={o} />
        ))}
      </section>
    </div>
  );
}

function ObjectCard({ obj }: { obj: ProductObject }) {
  const status = STATUS_LABEL[obj.status];
  const caps: Capability[] = obj.capabilityIds
    .map((id) => CAPABILITIES.find((c) => c.id === id))
    .filter(Boolean) as Capability[];

  return (
    <article className="card obj-card">
      <header className="obj-card-head">
        <div className="obj-card-title">
          <span className="obj-icon"><Icon name={obj.icon} size={20} /></span>
          <div>
            <h3>{obj.name}</h3>
            <p className="obj-sub">{obj.usedFor}</p>
          </div>
        </div>
        <div className="obj-card-meta">
          <Badge tone={SECTION_TONE[obj.section]}>{obj.section}</Badge>
          <Badge tone={status.tone}>{status.label}</Badge>
          <Link to={obj.sectionRoute} className="obj-open">Open {obj.section} →</Link>
        </div>
      </header>

      <div className="obj-grid-inner">
        <section>
          <p className="eyebrow">What it shows</p>
          <ul className="obj-list">
            {obj.displays.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </section>
        <section>
          <p className="eyebrow">Decisions it helps make</p>
          <ul className="obj-list">
            {obj.decisions.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </section>
      </div>

      <section className="obj-caps">
        <p className="eyebrow">Backed by capabilities</p>
        <div className="obj-caps-list">
          {caps.map((c) => (
            <span key={c.id} className="obj-cap">
              <code>{c.router}</code>
              <span className="obj-cap-sub">{c.supports}</span>
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
