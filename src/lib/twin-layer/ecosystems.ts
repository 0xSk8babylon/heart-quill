export type Difficulty = "Low" | "Moderate" | "High";
export type Compatibility = "Native" | "Good" | "Partial" | "Limited";
export type Flexibility = "Highly Expandable" | "Flexible" | "Locked";
export type CostImpact = "Low" | "Moderate" | "Higher";

export type Product = {
  id: string;
  name: string;
  category: "solar" | "battery" | "panel" | "generator" | "inverter" | "smart-panel";
  model?: string;
  spec?: string;
};

export type Ecosystem = {
  id: string;
  rank: number;
  name: string;
  products: Product[];
  worksTogether: { rating: Compatibility; note: string };
  howTheyTalk: string[];
  installDifficulty: { rating: Difficulty; note: string };
  cheapestSafePath: string[];
  estInstallDays: string;
  longTermFlexibility: { rating: Flexibility; note: string };
  installPractices: string[];
  costImpact: CostImpact;
  compatibilityScore: number;
};

export const SEED_ECOSYSTEMS: Ecosystem[] = [
  {
    id: "schneider-eg4",
    rank: 1,
    name: "Schneider + EG4 + Generac",
    products: [
      { id: "schneider-xw-pro", name: "Schneider XW Pro", category: "inverter" },
      { id: "eg4-ll-s-12k", name: "EG4 LL-S 12k", category: "battery" },
      { id: "generac-guardian-8kw", name: "Generac Guardian 8kW", category: "generator" },
    ],
    worksTogether: { rating: "Native", note: "Designed to work together seamlessly." },
    howTheyTalk: ["Native App", "Modbus (RS485)", "CTs for Monitoring", "Transfer Switch", "Auto / Manual Fallback"],
    installDifficulty: { rating: "Low", note: "Straightforward installation with integrated components." },
    cheapestSafePath: [
      "Use existing 200A service if possible",
      "Install CTs and monitor baseline",
      "Add battery (EG4) with gateway",
      "Connect generator with ATS",
      "Enable smart load management",
    ],
    estInstallDays: "1–2 Days",
    longTermFlexibility: { rating: "Highly Expandable", note: "Open architecture with strong expansion options." },
    installPractices: [
      "Use existing 200A service if possible",
      "Prioritize critical loads first",
      "Add smart load management before service upgrade",
      "Pre-wire for future battery expansion",
      "Use modular components to scale over time",
    ],
    costImpact: "Low",
    compatibilityScore: 92,
  },
  {
    id: "enphase-span",
    rank: 2,
    name: "Enphase + SPAN + Generac",
    products: [
      { id: "enphase-iq8p", name: "Enphase IQ8P", category: "inverter" },
      { id: "span-panel", name: "SPAN Panel", category: "smart-panel" },
      { id: "generac-guardian-8kw-2", name: "Generac Guardian 8kW", category: "generator" },
    ],
    worksTogether: { rating: "Good", note: "Strong integration with some gateway needs." },
    howTheyTalk: ["Enphase App", "SPAN App", "Cloud API", "CTs via SPAN", "Generator via Relay", "Manual Fallback"],
    installDifficulty: { rating: "Moderate", note: "Requires panel integration and configuration alignment." },
    cheapestSafePath: [
      "Use existing 200A service if possible",
      "Install SPAN panel and CTs",
      "Connect Enphase via app/cloud",
      "Add generator with relay control",
      "Set up load priorities",
    ],
    estInstallDays: "2–3 Days",
    longTermFlexibility: { rating: "Flexible", note: "Good flexibility with third-party and future updates." },
    installPractices: [
      "Use existing 200A service if possible",
      "Prioritize critical loads first",
      "Add smart load management before service upgrade",
      "Pre-wire for future battery expansion",
      "Consider phased battery addition",
    ],
    costImpact: "Moderate",
    compatibilityScore: 81,
  },
  {
    id: "ecoflow-smarthome",
    rank: 3,
    name: "EcoFlow + Smart Home Panel + Generator",
    products: [
      { id: "ecoflow-delta-pro", name: "EcoFlow DELTA Pro", category: "battery" },
      { id: "ecoflow-smart-home-panel", name: "Smart Home Panel", category: "smart-panel" },
      { id: "portable-generator", name: "Generator (Portable)", category: "generator" },
    ],
    worksTogether: { rating: "Partial", note: "Limited native integration; more manual steps." },
    howTheyTalk: ["EcoFlow App", "Wi-Fi / Bluetooth", "CTs (3rd Party)", "Manual Transfer", "Manual Fallback"],
    installDifficulty: { rating: "High", note: "More manual configuration and field coordination." },
    cheapestSafePath: [
      "Use existing 200A service if possible",
      "Install panel + CTs (3rd party)",
      "Manually configure EcoFlow app",
      "Connect portable generator manually",
      "Set critical loads and test",
    ],
    estInstallDays: "3–5 Days",
    longTermFlexibility: { rating: "Locked", note: "Proprietary components limit seamless expansion." },
    installPractices: [
      "Use existing 200A service if possible",
      "Start with essential loads only",
      "Add portable power before permanent upgrades",
      "Pre-wire circuits for future panel upgrade",
      "Plan for manual management in outages",
    ],
    costImpact: "Higher",
    compatibilityScore: 64,
  },
];
