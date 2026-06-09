// Twin Layer data model — ported from the standalone prototype.

export type StatusKey = "known" | "needs_confirmation" | "not_added";
export type TrustKey =
  | "verified"
  | "user_created"
  | "demo_seed"
  | "derived_estimate"
  | "placeholder"
  | "missing";
export type ConfidenceKey = "high" | "medium" | "low";
export type Tone = "ok" | "warn" | "off" | "info" | "default" | "mute";

export const STATUS: Record<StatusKey, { key: StatusKey; label: string; dot: Tone; ring: Tone }> = {
  known: { key: "known", label: "Known / Verified", dot: "ok", ring: "ok" },
  needs_confirmation: { key: "needs_confirmation", label: "Needs confirmation", dot: "warn", ring: "warn" },
  not_added: { key: "not_added", label: "Not added yet", dot: "off", ring: "off" },
};

export const TRUST: Record<TrustKey, { label: string; tone: Tone }> = {
  verified: { label: "Verified manufacturer data", tone: "ok" },
  user_created: { label: "User-entered", tone: "info" },
  demo_seed: { label: "Demo data", tone: "warn" },
  derived_estimate: { label: "Derived estimate", tone: "warn" },
  placeholder: { label: "Placeholder", tone: "warn" },
  missing: { label: "Missing info", tone: "off" },
};

export const CONFIDENCE: Record<ConfidenceKey, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const HOME = {
  name: "The Sandoval Residence",
  address: "418 Manzanita Way, Walnut Creek, CA",
  type: "Single Family",
  yearBuilt: 2018,
  squareFootage: 2450,
  serviceType: "Overhead",
  serviceSize: "200A",
  utility: "Pacific Gas & Electric",
  owner: "Jordan Sandoval",
  initials: "JS",
};

export type GlyphName =
  | "solar" | "utility" | "battery" | "panel" | "meter" | "ev" | "backup" | "generator";

export type NodeModel = {
  id: string;
  label: string;
  system: string;
  glyph: GlyphName;
  x: number;
  y: number;
  status: StatusKey;
  trust: TrustKey;
  confidence: ConfidenceKey;
  headline: string;
  summary: string;
  facts: string[];
  missing: string[];
  basis: string;
  hub?: boolean;
};

export const NODES: NodeModel[] = [
  { id: "solar", label: "Solar", system: "solar_pv", glyph: "solar", x: 26, y: 16, status: "known", trust: "verified", confidence: "high",
    headline: "7.2 kW rooftop array",
    summary: "20 × 360 W panels modeled across the south + west roof planes. Verified against the manufacturer datasheet on file.",
    facts: ["20 modules · 360 W each", "South + west exposure", "Enphase microinverters"], missing: [],
    basis: "Manufacturer datasheet · roof model" },
  { id: "utility", label: "Utility", system: "utility_program_context", glyph: "utility", x: 74, y: 16, status: "known", trust: "verified", confidence: "high",
    headline: "Pacific Gas & Electric",
    summary: "Grid service confirmed from the utility account. NEM 3.0 export tariff applies to this address.",
    facts: ["Overhead service drop", "NEM 3.0 export tariff", "Rate plan: E-ELEC"], missing: [],
    basis: "Utility account · address lookup" },
  { id: "battery", label: "Battery", system: "battery_storage", glyph: "battery", x: 12, y: 44, status: "known", trust: "verified", confidence: "high",
    headline: "13.5 kWh storage",
    summary: "Single AC-coupled battery confirmed and commissioned. Reserve set for partial-home backup.",
    facts: ["13.5 kWh usable", "AC-coupled", "Backup reserve: 20%"], missing: [],
    basis: "Commissioning record · gateway" },
  { id: "panel", label: "Main Panel", system: "panel_load_management", glyph: "panel", x: 50, y: 46, status: "known", trust: "user_created", confidence: "high",
    headline: "200A main service panel",
    summary: "Square D load center with 30 of 40 spaces filled. The hub of the twin — every other system routes through here.",
    facts: ["200A bus rating", "30 / 40 spaces used", "Split-phase 240V"], missing: [],
    basis: "Homeowner photo · panel schedule", hub: true },
  { id: "meter", label: "Meter", system: "utility_program_context", glyph: "meter", x: 88, y: 44, status: "known", trust: "demo_seed", confidence: "medium",
    headline: "Bi-directional smart meter",
    summary: "PG&E smart meter on file. Interval data not yet imported, so usage shaping uses typical assumptions.",
    facts: ["Bi-directional", "Meter #PGE-44182", "Interval data: not imported"],
    missing: ["15-min interval usage export"], basis: "Utility account · demo seed" },
  { id: "ev", label: "EV Charger", system: "ev_readiness", glyph: "ev", x: 18, y: 74, status: "known", trust: "user_created", confidence: "medium",
    headline: "Level 2 · 48A circuit",
    summary: "A 48A EV circuit is wired in the garage. Charger make/model entered by the homeowner, not yet spec-verified.",
    facts: ["48A dedicated circuit", "Garage wall mount", "Make: entered, unverified"],
    missing: ["Charger model verification"], basis: "Homeowner entry" },
  { id: "backup", label: "Backup Loads", system: "panel_load_management", glyph: "backup", x: 50, y: 78, status: "needs_confirmation", trust: "derived_estimate", confidence: "low",
    headline: "Critical loads · unconfirmed",
    summary: "We estimated a backup load list from the panel schedule, but the homeowner hasn't confirmed which circuits matter during an outage.",
    facts: ["Estimated 8 critical circuits", "≈ 4.1 kW running", "Priorities: assumed"],
    missing: ["Confirm essential circuits", "Confirm fridge + medical loads"], basis: "Derived from panel schedule" },
  { id: "generator", label: "Generator", system: "backup_generator", glyph: "generator", x: 82, y: 74, status: "needs_confirmation", trust: "placeholder", confidence: "low",
    headline: "Standby generator · placeholder",
    summary: "A generator pad shows in site photos, but no unit, fuel type, or transfer-switch wiring is captured yet.",
    facts: ["Pad visible in photos", "Fuel type: unknown", "Transfer switch: unknown"],
    missing: ["Confirm generator exists", "Capture fuel type + size", "Capture transfer switch"], basis: "Site photo · placeholder" },
];

export const EDGES: Array<[string, string]> = [
  ["solar", "panel"], ["utility", "meter"], ["meter", "panel"],
  ["battery", "panel"], ["ev", "panel"], ["backup", "panel"], ["generator", "panel"],
];

export type Scenario = {
  id: string; name: string; goal: string; profile: string; architecture: string;
  blurb: string; cost: number; expansion: number; complexity: number; backup: number;
  trust: TrustKey[]; confidence: ConfidenceKey; recommended?: boolean;
  chips: string[]; note: string;
};

export const SCENARIOS: Scenario[] = [
  { id: "sc-critical", name: "Critical Backup", goal: "partial_backup", profile: "critical_efficient", architecture: "hybrid",
    blurb: "Keep the essentials alive through an outage at the lowest reasonable spend.",
    cost: 18400, expansion: 42, complexity: 35, backup: 61,
    trust: ["user_created", "placeholder"], confidence: "medium",
    chips: ["1 battery", "Lean reserve", "No generator"],
    note: "Lowest upfront cost. Covers ~8 critical circuits but no whole-home ride-through." },
  { id: "sc-balanced", name: "Balanced Resilience", goal: "whole_home_backup", profile: "balanced", architecture: "hybrid",
    blurb: "Most of the home stays on during an outage, sized against typical use.",
    cost: 31200, expansion: 68, complexity: 58, backup: 84,
    trust: ["derived_estimate"], confidence: "medium", recommended: true,
    chips: ["2 batteries", "Standard reserve", "Smart panel"],
    note: "Recommended pathway. Balances cost, backup duration, and install complexity." },
  { id: "sc-future", name: "Future-Ready Expansion", goal: "expansion_ready", profile: "premium_future_ready", architecture: "dc_coupled",
    blurb: "Build headroom now for an EV, a heat pump, and added storage later.",
    cost: 44800, expansion: 95, complexity: 77, backup: 88,
    trust: ["placeholder"], confidence: "low",
    chips: ["3 batteries", "Robust margin", "Generator-ready"],
    note: "Highest expansion readiness. Several values are placeholders pending confirmation." },
];

export type CompareKey = { key: "backup" | "expansion" | "complexity"; label: string; suffix: string };
export const COMPARE_KEYS: CompareKey[] = [
  { key: "backup", label: "Backup capability", suffix: "" },
  { key: "expansion", label: "Expansion readiness", suffix: "" },
  { key: "complexity", label: "Install complexity", suffix: "" },
];

export const CONTRACTOR = {
  name: "Bright Path Energy",
  contact: "Marcus Lee",
  role: "Lead estimator",
  sharedAt: "Shared 2 days ago",
  status: "review_context_available",
};

export type Lane = {
  id: string; label: string; status: string; confidence: ConfidenceKey; count: number;
  homeowner: string; prompt: string; items?: string[];
};

export const LANES: Lane[] = [
  { id: "planning_review", label: "Planning review", status: "review_context_available", confidence: "high", count: 0,
    homeowner: "Your home model and goals are ready for a contractor to read.",
    prompt: "Review the home twin and confirm the planning frame looks right." },
  { id: "missing_input_review", label: "Missing input review", status: "review_limited", confidence: "medium", count: 2,
    homeowner: "Two inputs are still needed before estimating can firm up.",
    prompt: "Request interval usage data and the EV charger model from the homeowner.",
    items: ["15-min interval usage export", "EV charger model verification"] },
  { id: "confirmation_gate_review", label: "Confirmation gate review", status: "blocked_or_deferred", confidence: "low", count: 2,
    homeowner: "Two systems need your confirmation before a proposal can move forward.",
    prompt: "Backup-load list and the generator must be confirmed to clear this gate.",
    items: ["Confirm essential backup circuits", "Confirm generator + fuel type"] },
  { id: "option_candidate_review", label: "Option candidate review", status: "review_context_available", confidence: "medium", count: 3,
    homeowner: "Three scenario pathways are ready for the contractor to weigh in on.",
    prompt: "Compare the three pathways and flag the best fit for this home.",
    items: ["Critical Backup", "Balanced Resilience", "Future-Ready Expansion"] },
  { id: "proposal_prep_blocked_deferred", label: "Proposal prep", status: "blocked_or_deferred", confidence: "low", count: 1,
    homeowner: "Proposal prep is waiting on the confirmation gate above.",
    prompt: "Deferred until backup loads + generator clear the confirmation gate.",
    items: ["Blocked by: confirmation gate review"] },
];

export const LANE_STATUS: Record<string, { label: string; tone: Tone }> = {
  review_context_available: { label: "Ready to review", tone: "ok" },
  review_limited: { label: "Review limited", tone: "warn" },
  blocked_or_deferred: { label: "Blocked", tone: "off" },
  unavailable: { label: "Unavailable", tone: "off" },
};

export const ACTIVITY = [
  { who: "You", what: "shared the home twin with Bright Path Energy", when: "2 days ago" },
  { who: "Marcus Lee", what: "opened the home diagram and energy passport", when: "1 day ago" },
  { who: "Marcus Lee", what: "requested interval usage data", when: "22 hours ago" },
  { who: "System", what: "flagged 2 confirmation gates blocking proposal prep", when: "20 hours ago" },
];
