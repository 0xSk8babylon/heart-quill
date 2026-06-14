// Backend capability map — derived from energyplanner0613 FastAPI routers.
// Read-only reference. NOT wired to any live API. Update this file as the
// backend grows; UI cards in heart-quill consume it to show what each
// surface will eventually pull from.

export type CapabilityStatus =
  | "mocked"          // UI exists in heart-quill with in-memory data only
  | "future_wired"    // UI exists, backend exists, not yet connected
  | "backend_only";   // Backend router exists, no UI surface yet

export type CapabilityGroup = "home" | "explore" | "planner" | "builder" | "internal";

export type Capability = {
  id: string;
  router: string;            // FastAPI router module
  endpointGroup: string;     // Likely REST prefix
  supports: string;          // Homeowner-facing card / surface in heart-quill
  status: CapabilityStatus;
  note?: string;
};

export const CAPABILITY_GROUPS: Record<CapabilityGroup, { label: string; lede: string }> = {
  home: {
    label: "Home",
    lede: "Power the digital twin: who lives here, the building, the panel, and the systems on record.",
  },
  explore: {
    label: "Explore",
    lede: "Profile, goals, priorities, and Learn — the homeowner's understanding layer.",
  },
  planner: {
    label: "Planner",
    lede: "Scenarios, estimates, ecosystem compatibility, and the trade-offs behind each pathway.",
  },
  builder: {
    label: "Builder",
    lede: "Contractor hand-off, review lanes, evidence trails, and post-install context.",
  },
  internal: {
    label: "Internal / Admin",
    lede: "Cross-cutting infrastructure: provenance, privacy, AI context, geometry, facts.",
  },
};

export const CAPABILITIES: Capability[] = [
  // ─── Home ──────────────────────────────────────────────────────────────
  { id: "accounts",      router: "accounts",       endpointGroup: "/accounts",        supports: "Avatar · session · ownership",      status: "mocked",       note: "Auth + home-access middleware live in backend." },
  { id: "homes",         router: "homes",          endpointGroup: "/homes",           supports: "Twin Home header · address card",   status: "future_wired", note: "Replaces HOME constant in src/lib/twin-layer/data.ts." },
  { id: "buildings",     router: "buildings",      endpointGroup: "/buildings",       supports: "Known Home Facts card",             status: "future_wired" },
  { id: "panels",        router: "panels",         endpointGroup: "/panels",          supports: "Main Panel node · panel schedule",  status: "future_wired" },
  { id: "loads",         router: "loads",          endpointGroup: "/loads",           supports: "Backup Loads node · circuit list",  status: "future_wired" },
  { id: "energy_passport", router: "energy_passport", endpointGroup: "/energy-passport", supports: "Energy Passport card",          status: "future_wired" },
  { id: "system_visibility", router: "system_visibility", endpointGroup: "/system-visibility", supports: "Known / Needs / Not added status dots", status: "future_wired" },
  { id: "nec_load_calculation", router: "nec_load_calculation", endpointGroup: "/nec-load-calc", supports: "Service-size readiness on Home",  status: "backend_only" },

  // ─── Explore ───────────────────────────────────────────────────────────
  { id: "product_preferences",   router: "product_preferences",   endpointGroup: "/product-preferences",   supports: "Goals & priorities tile",         status: "future_wired" },
  { id: "product_library",       router: "product_library",       endpointGroup: "/product-library",       supports: "Ecosystem catalog (Tesla, Enphase, …)", status: "future_wired" },
  { id: "source_documents",      router: "source_documents",      endpointGroup: "/source-documents",      supports: "Learn → cited references",        status: "backend_only", note: "Powers Learn tab inside Explore." },
  { id: "program_intelligence",  router: "program_intelligence",  endpointGroup: "/program-intelligence",  supports: "Learn → NEM 3.0, rebates, programs", status: "backend_only" },
  { id: "twin_planning_context", router: "twin_planning_context", endpointGroup: "/twin-planning-context", supports: "Explore narrative · what's possible next", status: "future_wired" },

  // ─── Planner ───────────────────────────────────────────────────────────
  { id: "designs",                router: "designs",                endpointGroup: "/designs",                 supports: "Scenario builder rows",          status: "future_wired" },
  { id: "scenarios",              router: "scenarios",              endpointGroup: "/scenarios",               supports: "Three pathway cards on Planner", status: "future_wired" },
  { id: "estimates",              router: "estimates",              endpointGroup: "/estimates",               supports: "Cost / payback chips",           status: "future_wired" },
  { id: "estimate_readiness",     router: "estimate_readiness",     endpointGroup: "/estimate-readiness",      supports: "Readiness gates on each scenario", status: "future_wired" },
  { id: "equipment",              router: "equipment",              endpointGroup: "/equipment",               supports: "Equipment chips per scenario",   status: "future_wired" },
  { id: "compatibility_rules",    router: "compatibility_rules",    endpointGroup: "/compatibility-rules",     supports: "Compatibility card",             status: "future_wired" },
  { id: "design_advisor",         router: "design_advisor",         endpointGroup: "/design-advisor",          supports: "Recommended pathway badge",      status: "backend_only" },
  { id: "proposal_option_sets",   router: "proposal_option_sets",   endpointGroup: "/proposal-options",        supports: "Compare ecosystems sidebar",     status: "future_wired" },
  { id: "takeoffs",               router: "takeoffs",               endpointGroup: "/takeoffs",                supports: "Future: bill-of-materials view", status: "backend_only" },
  { id: "planning",               router: "planning",               endpointGroup: "/planning",                supports: "Planner narrative + framing",    status: "future_wired" },

  // ─── Builder ───────────────────────────────────────────────────────────
  { id: "contractor_workflow",    router: "contractor_workflow",    endpointGroup: "/contractor-workflow",     supports: "Five review lanes on Builder",   status: "future_wired" },
  { id: "contractor_context",     router: "contractor_context",     endpointGroup: "/contractor-context",      supports: "Bright Path Energy header card", status: "future_wired" },
  { id: "crm_handoff",            router: "crm_handoff",            endpointGroup: "/crm-handoff",             supports: "Share-with-contractor action",   status: "future_wired" },
  { id: "planning_exchange",      router: "planning_exchange",      endpointGroup: "/planning-exchange",       supports: "Activity feed on Builder",       status: "future_wired" },
  { id: "post_install",           router: "post_install",           endpointGroup: "/post-install",            supports: "Future: after-install checklist", status: "backend_only" },

  // ─── Internal / Admin ──────────────────────────────────────────────────
  { id: "ai_context",         router: "ai_context",         endpointGroup: "/internal/ai-context",       supports: "AI prompt grounding",          status: "backend_only" },
  { id: "evidence",           router: "evidence",           endpointGroup: "/internal/evidence",         supports: "Trust badges (verified / derived)", status: "future_wired" },
  { id: "facts",              router: "facts",              endpointGroup: "/internal/facts",            supports: "Known Home Facts substrate",   status: "future_wired" },
  { id: "geometry",           router: "geometry",           endpointGroup: "/internal/geometry",         supports: "Future: roof / panel geometry", status: "backend_only" },
  { id: "provenance",         router: "provenance",         endpointGroup: "/internal/provenance",       supports: "Source / basis line on Inspector", status: "future_wired" },
  { id: "rule_provenance",    router: "rule_provenance",    endpointGroup: "/internal/rule-provenance",  supports: "Why a compatibility rule fired", status: "backend_only" },
  { id: "privacy",            router: "privacy",            endpointGroup: "/internal/privacy",          supports: "Share scope on CRM handoff",   status: "backend_only" },
];

export function capabilitiesByGroup(group: CapabilityGroup): Capability[] {
  // Stable order = order declared above.
  const order: Record<CapabilityGroup, string[]> = {
    home: ["accounts","homes","buildings","panels","loads","energy_passport","system_visibility","nec_load_calculation"],
    explore: ["product_preferences","product_library","source_documents","program_intelligence","twin_planning_context"],
    planner: ["designs","scenarios","estimates","estimate_readiness","equipment","compatibility_rules","design_advisor","proposal_option_sets","takeoffs","planning"],
    builder: ["contractor_workflow","contractor_context","crm_handoff","planning_exchange","post_install"],
    internal: ["ai_context","evidence","facts","geometry","provenance","rule_provenance","privacy"],
  };
  const ids = order[group];
  return ids.map((id) => CAPABILITIES.find((c) => c.id === id)!).filter(Boolean);
}

export const STATUS_META: Record<CapabilityStatus, { label: string; tone: "ok" | "warn" | "info" | "off" }> = {
  mocked:        { label: "Mocked",         tone: "warn" },
  future_wired:  { label: "Future-wired",   tone: "info" },
  backend_only:  { label: "Backend exists", tone: "off" },
};
