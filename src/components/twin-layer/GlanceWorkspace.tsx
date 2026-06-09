import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Icon, type IconName } from "./Icon";
import { EcosystemComparison } from "./EcosystemComparison";
import { EcosystemIngest } from "./EcosystemIngest";

type GlanceKey = "update" | "expand" | "compare" | "goals";

const ITEMS: Array<{ key: GlanceKey; icon: IconName; title: string; sub: string }> = [
  { key: "update", icon: "spark", title: "Update", sub: "Refresh facts & confirmations" },
  { key: "expand", icon: "layers", title: "Explore", sub: "What's possible next" },
  { key: "compare", icon: "shield", title: "Compare", sub: "Side-by-side trade-offs" },
  { key: "goals", icon: "target", title: "Decide", sub: "Shape your plan" },
];

const CONTENT: Record<GlanceKey, { eyebrow: string; title: string; body: string; cta: string }> = {
  update: {
    eyebrow: "Twin maintenance",
    title: "Keep your twin current",
    body: "Confirm flagged systems, add missing equipment, and refresh utility data so every plan you run reflects the home you actually live in.",
    cta: "Review flagged systems",
  },
  expand: {
    eyebrow: "Future expansions",
    title: "See what's possible next",
    body: "Model heat pump upgrades, additional storage, EV chargers, and panel upgrades — without committing to anything yet.",
    cta: "Browse expansion paths",
  },
  compare: {
    eyebrow: "Ecosystem comparison",
    title: "Compare side by side",
    body: "Stack Tesla, Enphase, SolarEdge and hybrid setups against your twin to see real trade-offs in backup, cost, and complexity.",
    cta: "Open comparison",
  },
  goals: {
    eyebrow: "Goals & priorities",
    title: "What matters most to you?",
    body: "Tell your twin whether resilience, savings, or future-readiness comes first — every recommendation reshuffles to match.",
    cta: "Set my priorities",
  },
};

export function GlanceWorkspace({ onGoals }: { onGoals: () => void }) {
  const [active, setActive] = useState<GlanceKey>("update");
  const content = CONTENT[active];
  const hash = useRouterState({ select: (s) => s.location.hash });
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!hash?.startsWith("glance-")) return;
    const key = hash.slice("glance-".length) as GlanceKey;
    if (ITEMS.some((i) => i.key === key)) {
      setActive(key);
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <section className="glance-workspace" ref={rootRef}>

      <aside className="gw-sidebar" aria-label="At a glance menu">
        <p className="gw-eyebrow">At a glance</p>
        <nav className="gw-nav">
          {ITEMS.map((item) => {
            const isOn = item.key === active;
            return (
              <button
                key={item.key}
                type="button"
                className={`gw-item ${isOn ? "gw-item-on" : ""}`}
                onClick={() => setActive(item.key)}
                aria-current={isOn ? "page" : undefined}
              >
                <span className="gw-item-icon"><Icon name={item.icon} size={18} /></span>
                <span className="gw-item-text">
                  <span className="gw-item-title">{item.title}</span>
                  <span className="gw-item-sub">{item.sub}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="gw-content">
        {active === "compare" ? (
          <EcosystemComparison />
        ) : active === "update" ? (
          <EcosystemIngest />
        ) : (
          <>
            <p className="eyebrow">{content.eyebrow}</p>
            <h3 className="gw-title">{content.title}</h3>
            <p className="gw-body">{content.body}</p>
            <button className="btn" onClick={active === "goals" ? onGoals : undefined}>
              {content.cta} <Icon name="arrow" size={16} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

