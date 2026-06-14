// Homeowner-facing object model.
// Read-only seed data shared by Home / Explore / Planner / Builder.
// Nothing here calls the backend; capabilities[] are the future wire points.

import type { IconName } from "@/components/twin-layer/Icon";

// ──────────────────────────────────────────────────────────────
// Maturity model: how a homeowner intent flows through the app.
// Goal → Guided Template → Sandbox Draft → Checked Draft → Validated Scenario → Project
// ──────────────────────────────────────────────────────────────
export type MaturityStage =
  | "goal" | "template" | "sandbox" | "checked" | "validated" | "project";

export const MATURITY: Array<{
  stage: MaturityStage;
  label: string;
  meaning: string;
  page: "Explore" | "Planner" | "Builder";
}> = [
  { stage: "goal",      label: "Goal",              meaning: "What the homeowner wants",                                  page: "Explore" },
  { stage: "template",  label: "Guided Template",   meaning: "A known starting pattern (architecture + intent)",          page: "Planner"  },
  { stage: "sandbox",   label: "Sandbox Draft",     meaning: "Customized homeowner planning sketch — not yet validated",  page: "Planner"  },
  { stage: "checked",   label: "Checked Draft",     meaning: "Draft run through app logic (compatibility, NEC, programs)", page: "Planner" },
  { stage: "validated", label: "Validated Scenario", meaning: "Has enough known facts and readiness confidence",          page: "Planner"  },
  { stage: "project",   label: "Project",           meaning: "Selected scenario moving toward contractor / build",        page: "Builder"  },
];

// ──────────────────────────────────────────────────────────────
// Goals (Explore)
// ──────────────────────────────────────────────────────────────
export type Goal = {
  id: string;
  title: string;
  blurb: string;
  icon: IconName;
  seeds: Array<"template" | "sandbox">; // what selecting this goal could seed
};

export const GOALS: Goal[] = [
  { id: "lower-bill",     title: "Lower my bill",         blurb: "Shift use to off-peak, cut TOU exposure.",            icon: "scale",    seeds: ["template"] },
  { id: "add-solar",      title: "Add solar",             blurb: "Generate your own electricity on-site.",              icon: "solar",    seeds: ["template", "sandbox"] },
  { id: "battery-backup", title: "Add battery backup",    blurb: "Keep critical loads on during an outage.",            icon: "battery",  seeds: ["template", "sandbox"] },
  { id: "ev-charging",    title: "Add EV charging",       blurb: "Plan a Level-2 charger your panel can support.",      icon: "ev",       seeds: ["template"] },
  { id: "outages",        title: "Prepare for outages",   blurb: "Stay powered when the grid goes down.",               icon: "shield",   seeds: ["template"] },
  { id: "partial-off",    title: "Go partially off-grid", blurb: "Self-consume most of the time, keep the grid as backup.", icon: "layers", seeds: ["template", "sandbox"] },
  { id: "full-off",       title: "Go fully off-grid",     blurb: "Disconnect from the utility. Plan for every season.", icon: "spark",    seeds: ["template", "sandbox"] },
  { id: "future-proof",   title: "Future-proof the home", blurb: "Leave headroom for what comes next.",                 icon: "target",   seeds: ["template"] },
  { id: "resale",         title: "Improve resale value",  blurb: "Make the home more attractive to future buyers.",     icon: "passport", seeds: ["template"] },
  { id: "emissions",      title: "Reduce emissions",      blurb: "Electrify and lean on cleaner hours.",                icon: "spark",    seeds: ["template"] },
];

// ──────────────────────────────────────────────────────────────
// Learn topics (Explore)
// ──────────────────────────────────────────────────────────────
export type LearnTopic = {
  id: string;
  title: string;
  summary: string;
  ties: string; // how it connects to the twin / planning
};

export const LEARN_TOPICS: LearnTopic[] = [
  { id: "solar",         title: "Solar",                       summary: "Sunlight → DC → AC for your home.",                            ties: "Sized against roof, shading and your annual use on the twin." },
  { id: "battery",       title: "Battery",                     summary: "Store energy for evenings and outages.",                       ties: "Sized against critical loads and your TOU window." },
  { id: "generator",     title: "Generator",                   summary: "Burns fuel to make electricity during long outages.",          ties: "Layers behind battery for long-duration resilience." },
  { id: "ev",            title: "EV charging",                 summary: "Level 1, 2, and DC fast — what your panel can support.",       ties: "Checked against NEC service capacity on your twin." },
  { id: "ac-coupled",    title: "AC-coupled systems",          summary: "Solar and battery each have their own AC inverter.",           ties: "Easier to add storage to an existing solar array." },
  { id: "dc-coupled",    title: "DC-coupled systems",          summary: "Solar and battery share a hybrid inverter on the DC side.",    ties: "Higher round-trip efficiency for new builds." },
  { id: "hybrid",        title: "Hybrid systems",              summary: "Mix of AC and DC coupling under one controller.",              ties: "Flexible — but compatibility rules matter more." },
  { id: "offgrid",       title: "Off-grid systems",            summary: "No utility connection. Sized for worst-week, not average.",    ties: "Requires far more storage + a generator fallback." },
  { id: "tou",           title: "TOU / self-consumption",      summary: "Use what you make, avoid the expensive hours.",                ties: "Drives battery sizing and dispatch logic." },
  { id: "critical",      title: "Critical loads",              summary: "Fridge, well pump, medical — what must stay on.",              ties: "Defined per-home; drives backup architecture." },
  { id: "whole-home",    title: "Whole-home backup",           summary: "Everything keeps running, including HVAC.",                    ties: "Needs a larger battery or a smart panel + load shedding." },
  { id: "future-ready",  title: "Future-ready planning",       summary: "Leave room for the next upgrade — EV, heat pump, addition.",   ties: "Reflected as headroom on your twin." },
];

// ──────────────────────────────────────────────────────────────
// Guided Templates (Planner)
// Architecture × Intent matrix.
// ──────────────────────────────────────────────────────────────
export type TemplateArchitecture = "AC-Coupled" | "DC-Coupled" | "Hybrid" | "Off-Grid";

export type Template = {
  id: string;
  architecture: TemplateArchitecture;
  intent: string;
  blurb: string;
  costTier: 1 | 2 | 3 | 4;        // ◐ → ●●●●
  complexity: 1 | 2 | 3 | 4;
  backup: "none" | "partial" | "whole" | "long-duration";
  futureReady: 1 | 2 | 3;
};

export const TEMPLATES: Template[] = [
  // AC-Coupled
  { id: "ac-solar",     architecture: "AC-Coupled", intent: "Solar Only",             blurb: "Bill offset, no battery, simplest install.",                 costTier: 1, complexity: 1, backup: "none",          futureReady: 1 },
  { id: "ac-tou",       architecture: "AC-Coupled", intent: "TOU / Self-Consumption", blurb: "Solar + battery sized to shave evening peak.",               costTier: 2, complexity: 2, backup: "none",          futureReady: 2 },
  { id: "ac-partial",   architecture: "AC-Coupled", intent: "Partial Backup",         blurb: "Critical loads stay on through outages.",                    costTier: 2, complexity: 2, backup: "partial",       futureReady: 2 },
  { id: "ac-whole",     architecture: "AC-Coupled", intent: "Whole-Home Backup",      blurb: "Everything keeps running, smart panel manages load.",        costTier: 3, complexity: 3, backup: "whole",         futureReady: 2 },
  { id: "ac-v2g",       architecture: "AC-Coupled", intent: "V2G Candidate",          blurb: "EV battery participates as home storage (where allowed).",   costTier: 3, complexity: 4, backup: "partial",       futureReady: 3 },
  // DC-Coupled
  { id: "dc-solar",     architecture: "DC-Coupled", intent: "Solar Only",             blurb: "Hybrid inverter, future-ready for a battery later.",         costTier: 1, complexity: 2, backup: "none",          futureReady: 2 },
  { id: "dc-tou",       architecture: "DC-Coupled", intent: "TOU / Self-Consumption", blurb: "Higher round-trip efficiency for daily cycling.",            costTier: 2, complexity: 2, backup: "none",          futureReady: 2 },
  { id: "dc-partial",   architecture: "DC-Coupled", intent: "Partial Backup",         blurb: "Critical loads with efficient DC battery coupling.",         costTier: 2, complexity: 3, backup: "partial",       futureReady: 2 },
  { id: "dc-whole",     architecture: "DC-Coupled", intent: "Whole-Home Backup",      blurb: "Hybrid inverter + large battery + smart panel.",             costTier: 3, complexity: 3, backup: "whole",         futureReady: 3 },
  { id: "dc-v2g",       architecture: "DC-Coupled", intent: "V2G Candidate",          blurb: "EV pack on DC bus, where vehicle + inverter support it.",    costTier: 4, complexity: 4, backup: "partial",       futureReady: 3 },
  // Hybrid
  { id: "hy-solar",     architecture: "Hybrid",     intent: "Solar Only",             blurb: "AC + DC mixed for retrofit flexibility.",                    costTier: 2, complexity: 2, backup: "none",          futureReady: 2 },
  { id: "hy-tou",       architecture: "Hybrid",     intent: "TOU / Self-Consumption", blurb: "Layer storage onto an existing solar array.",                costTier: 2, complexity: 3, backup: "none",          futureReady: 2 },
  { id: "hy-partial",   architecture: "Hybrid",     intent: "Partial Backup",         blurb: "Critical loads, mixed-vendor friendly.",                     costTier: 2, complexity: 3, backup: "partial",       futureReady: 2 },
  { id: "hy-whole",     architecture: "Hybrid",     intent: "Whole-Home Backup",      blurb: "Full backup with mixed AC + DC sources.",                    costTier: 3, complexity: 4, backup: "whole",         futureReady: 3 },
  { id: "hy-v2g",       architecture: "Hybrid",     intent: "V2G Candidate",          blurb: "EV participates alongside fixed storage.",                   costTier: 4, complexity: 4, backup: "whole",         futureReady: 3 },
  // Off-Grid
  { id: "off-essential",architecture: "Off-Grid",   intent: "Essential Loads",        blurb: "Keep fridge, lights, pump and comms running year-round.",    costTier: 2, complexity: 3, backup: "long-duration", futureReady: 1 },
  { id: "off-whole",    architecture: "Off-Grid",   intent: "Whole-Home Off-Grid",    blurb: "Fully autonomous; sized for worst-week, not average.",       costTier: 4, complexity: 4, backup: "long-duration", futureReady: 2 },
  { id: "off-primary",  architecture: "Off-Grid",   intent: "Solar + Battery Primary",blurb: "Solar + storage do nearly all the work.",                    costTier: 3, complexity: 4, backup: "long-duration", futureReady: 2 },
  { id: "off-gen",      architecture: "Off-Grid",   intent: "Generator-Assisted",     blurb: "Generator covers cloudy weeks; battery handles daily cycle.",costTier: 3, complexity: 3, backup: "long-duration", futureReady: 2 },
  { id: "off-long",     architecture: "Off-Grid",   intent: "Long-Duration Resilience", blurb: "Extra fuel, redundancy and seasonal storage planning.",   costTier: 4, complexity: 4, backup: "long-duration", futureReady: 3 },
];

// ──────────────────────────────────────────────────────────────
// Sandbox Draft — homeowner planning sketch (mock fields).
// ──────────────────────────────────────────────────────────────
export type SandboxDraft = {
  id: string;
  name: string;
  goalId: string;             // from GOALS
  templateId: string;         // from TEMPLATES
  systemType: TemplateArchitecture;
  equipment: string[];        // categories selected
  backup: "none" | "partial" | "whole";
  budget: "tight" | "mid" | "comfortable";
  timeline: "now" | "6mo" | "12mo" | "flexible";
  assumptions: string[];
  missingFacts: string[];
  warnings: string[];
  validation: "draft" | "checked" | "validated";
};

export const SANDBOX_DRAFTS: SandboxDraft[] = [
  {
    id: "draft-summer-resilience",
    name: "Summer resilience sketch",
    goalId: "outages",
    templateId: "ac-partial",
    systemType: "AC-Coupled",
    equipment: ["Solar array", "Battery", "Smart panel"],
    backup: "partial",
    budget: "mid",
    timeline: "6mo",
    assumptions: ["Roof south-facing 22°", "Critical loads ≈ 6 kWh / day"],
    missingFacts: ["Confirmed panel make/model", "Shading study"],
    warnings: ["Battery sized to critical loads only — not whole-home"],
    validation: "draft",
  },
  {
    id: "draft-ev-future",
    name: "EV + future heat pump",
    goalId: "future-proof",
    templateId: "dc-tou",
    systemType: "DC-Coupled",
    equipment: ["Solar array", "Hybrid inverter", "L2 charger"],
    backup: "none",
    budget: "comfortable",
    timeline: "12mo",
    assumptions: ["Service is 200A", "Single EV at 40A"],
    missingFacts: ["Heat-pump load estimate", "Utility approval timeline"],
    warnings: ["Heat-pump may exceed service capacity — NEC check needed"],
    validation: "draft",
  },
];

// Comparison fields used by the Comparisons surface.
export const COMPARISON_FIELDS: Array<{ key: string; label: string }> = [
  { key: "goal",         label: "Goal match" },
  { key: "cost",         label: "Cost tier" },
  { key: "complexity",   label: "Complexity tier" },
  { key: "backup",       label: "Backup strength" },
  { key: "savings",      label: "Energy savings potential" },
  { key: "resilience",   label: "Resilience value" },
  { key: "future",       label: "Future-readiness" },
  { key: "missing",      label: "Missing facts" },
  { key: "confidence",   label: "Confidence score" },
  { key: "readiness",    label: "Readiness gates" },
  { key: "contractor",   label: "Contractor review needed" },
  { key: "next",         label: "Recommended next step" },
];

// ──────────────────────────────────────────────────────────────
// Project (Builder)
// ──────────────────────────────────────────────────────────────
export type ProjectField = { label: string; value: string; tone?: "ok" | "warn" | "info" | "off" };

export const PROJECT_OBJECT = {
  name: "Demo Project — Summer resilience",
  selectedScenario: "AC-Coupled · Partial Backup · 10 kWh battery",
  fields: [
    { label: "Contractor workflow readiness", value: "Ready to scope",              tone: "ok"   as const },
    { label: "Estimate readiness",            value: "Soft estimate available",     tone: "info" as const },
    { label: "Confirmation gates",            value: "2 facts to confirm",          tone: "warn" as const },
    { label: "Install complexity",            value: "Medium",                      tone: "info" as const },
    { label: "Proposal handoff",              value: "Draft proposal generated",    tone: "info" as const },
    { label: "Shared compatibility view",     value: "Visible to Bright Path",      tone: "ok"   as const },
    { label: "Site / photo evidence",         value: "4 photos uploaded",           tone: "ok"   as const },
    { label: "Contractor notes",              value: "Awaiting first site visit",   tone: "off"  as const },
    { label: "CRM handoff",                   value: "Queued",                      tone: "off"  as const },
    { label: "Post-install state",            value: "Not yet installed",           tone: "off"  as const },
    { label: "Lifecycle events",              value: "Created · Shared",            tone: "info" as const },
    { label: "Energy Twin update",            value: "Will refresh after install",  tone: "off"  as const },
  ] satisfies ProjectField[],
  questions: [
    "What selected plan are we building?",
    "What needs to be confirmed?",
    "What can be shared?",
    "What is blocked?",
    "What happens after install?",
  ],
};

// ──────────────────────────────────────────────────────────────
// Energy Twin overview blocks (Home).
// ──────────────────────────────────────────────────────────────
export const TWIN_OVERVIEW = {
  headline: "Your home has an Energy Twin",
  sub: "Here's what your home already tells us. Complete a few details to improve your plan.",
  blocks: [
    { icon: "home"     as IconName, label: "Known home facts",          hint: "Service, panel, square footage, year built." },
    { icon: "layers"   as IconName, label: "Single-line diagram",       hint: "How power flows from utility to loads today." },
    { icon: "target"   as IconName, label: "Readiness snapshot",        hint: "What your home is ready for, right now." },
    { icon: "passport" as IconName, label: "Energy passport",           hint: "Portable summary of your home's systems." },
    { icon: "shield"   as IconName, label: "Confidence & provenance",   hint: "Where each fact comes from and how trusted it is." },
    { icon: "search"   as IconName, label: "Missing facts",             hint: "What to confirm next to sharpen your plan." },
    { icon: "scale"    as IconName, label: "Constraint summary",        hint: "Service size, NEC load, panel headroom." },
    { icon: "spark"    as IconName, label: "Upgrade readiness",         hint: "What can be added now vs. needs a step first." },
  ],
};
