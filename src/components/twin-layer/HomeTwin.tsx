import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { HOME } from "@/lib/twin-layer/data";
import { useTwin } from "@/lib/twin-layer/store";
import { DigitalTwin } from "./DigitalTwin";
import { HomeDiagram } from "./HomeDiagram";
import { Icon, type IconName } from "./Icon";
import { SegBar, StatusDot } from "./atoms";

function ScrollRevealTitle() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let hideTimer: number | null = null;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }
        if (entry.isIntersecting) {
          setVisible(true);
          hideTimer = window.setTimeout(() => setVisible(false), 3000);
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => { obs.disconnect(); if (hideTimer) window.clearTimeout(hideTimer); };
  }, []);
  return (
    <h1 ref={ref} className={`hero-title hero-title-reveal ${visible ? "is-visible" : ""}`}>
      Welcome<br />home,
    </h1>
  );
}

const GLOW = "#8fb8d8";
const ACCENT = "#e0913f";

const GLANCE_ITEMS: Array<{ key: "update" | "expand" | "compare" | "goals"; icon: IconName; label: string; sub: string }> = [
  { key: "update", icon: "spark", label: "Update your twin", sub: "Refresh facts & confirmations" },
  { key: "expand", icon: "layers", label: "Explore future expansions", sub: "What's possible next" },
  { key: "compare", icon: "shield", label: "Compare ecosystems", sub: "Side-by-side trade-offs" },
  { key: "goals", icon: "target", label: "Set goals & priorities", sub: "Shape your plan" },
];


function AtAGlanceMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`glance ${open ? "glance-open" : ""}`} ref={ref}>
      <button className="glance-trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu">
        <span className="glance-trigger-dot" />
        <span className="glance-trigger-label">at a glance</span>
      </button>
      {open ? (
        <div className="glance-panel" role="menu">
          <p className="glance-eyebrow">At a glance</p>
          <ul className="glance-list">
            {GLANCE_ITEMS.map((item) => (
              <li key={item.key}>
                <button
                  className="glance-item"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/scenario", hash: `glance-${item.key}` });
                  }}
                >
                  <span className="glance-item-icon"><Icon name={item.icon} size={18} /></span>
                  <span className="glance-item-text">
                    <span className="glance-item-label">{item.label}</span>
                    <span className="glance-item-sub">{item.sub}</span>
                  </span>
                  <Icon name="arrow" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}


function StatusItem({ icon, label, value, children }: {
  icon: IconName; label: string; value: string; children?: ReactNode;
}) {
  return (
    <div className="status-item">
      <span className="status-icon"><Icon name={icon} size={20} /></span>
      <div className="status-meta">
        <span className="status-label">{label}</span>
        <span className="status-value">{value}</span>
        {children}
      </div>
    </div>
  );
}

export function HomeTwin({ onGoals }: { onGoals: () => void }) {
  const { nodes, selectedId, selectNode, showToast } = useTwin();

  const known = nodes.filter((n) => n.status === "known").length;
  const needs = nodes.filter((n) => n.status === "needs_confirmation").length;
  const total = nodes.length;
  const confidencePct = Math.round((known / total) * 100);
  const confidenceLabel = confidencePct >= 90 ? "Excellent" : confidencePct >= 75 ? "Good" : confidencePct >= 55 ? "Fair" : "Building";
  const readyLabel = needs === 0 ? "Ready" : "In progress";

  return (
    <div className="twin-grid">
      <div className="hero-column">
        <section className="hero-stage">
          <AtAGlanceMenu />
          <div className="twin-visual"><DigitalTwin glow={GLOW} accentWarn={ACCENT} dark /></div>
          <div className="hero-copy">
            <ScrollRevealTitle />
          </div>
        </section>

        <div className="twin-status twin-status-below">
          <StatusItem icon="shield" label="Data confidence" value={confidenceLabel}>
            <SegBar value={confidencePct} tone="ok" />
          </StatusItem>
          <StatusItem icon="target" label="Readiness" value={readyLabel}>
            <SegBar value={needs === 0 ? 100 : 100 - needs * 18} tone={needs === 0 ? "ok" : "warn"} />
          </StatusItem>
          <StatusItem icon="search" label="Missing items" value={String(needs)}>
            <span className="status-note">{needs ? "needs your confirmation" : "all systems confirmed"}</span>
          </StatusItem>
        </div>
      </div>

      <aside className="rail">
        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">Home diagram</p>
              <h3 className="card-title">What your twin knows</h3>
            </div>
            <span className="live-tag"><span className="live-dot" />Updated just now</span>
          </div>
          <HomeDiagram nodes={nodes} selectedId={selectedId} onSelect={selectNode} compact />
          <div className="legend">
            <span><StatusDot status="known" />Known / verified</span>
            <span><StatusDot status="needs_confirmation" />Needs confirmation</span>
            <span><StatusDot status="not_added" />Not added yet</span>
          </div>
        </section>



        <section className="card passport">
          <div className="card-head">
            <div>
              <p className="eyebrow">Energy passport</p>
              <h3 className="card-title">Your portable home record</h3>
            </div>
            <span className="live-tag live-active"><span className="live-dot" />Active</span>
          </div>
          <div className="passport-body">
            <div className="passport-seal"><Icon name="passport" size={30} /></div>
            <ul className="passport-stats">
              <li><strong>{known}</strong> facts captured</li>
              <li className={needs ? "warn-text" : ""}>
                <strong>{needs}</strong> confirmation{needs === 1 ? "" : "s"} needed
              </li>
              <li><strong>0</strong> completed projects</li>
            </ul>
          </div>
        </section>

        <section className="card summary">
          <div className="card-head">
            <div>
              <p className="eyebrow">Home summary</p>
              <h3 className="card-title">{HOME.name}</h3>
            </div>
          </div>
          <dl className="summary-list">
            <div><dt>Home type</dt><dd>{HOME.type}</dd></div>
            <div><dt>Year built</dt><dd>{HOME.yearBuilt}</dd></div>
            <div><dt>Square footage</dt><dd>{HOME.squareFootage.toLocaleString()} ft²</dd></div>
            <div><dt>Service</dt><dd>{HOME.serviceType} · {HOME.serviceSize}</dd></div>
            <div><dt>Utility</dt><dd>{HOME.utility}</dd></div>
          </dl>
          <button className="btn btn-wide" onClick={() => showToast("Full home profile — coming in this prototype")}>
            View full home profile <Icon name="chevron" size={16} />
          </button>
        </section>
      </aside>
    </div>
  );
}
