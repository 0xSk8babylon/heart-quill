import { useEcosystems } from "@/lib/twin-layer/ecosystem-store";
import type { Compatibility, CostImpact, Difficulty, Flexibility } from "@/lib/twin-layer/ecosystems";
import { Icon } from "./Icon";

function toneFor(value: Compatibility | Difficulty | Flexibility | CostImpact): "ok" | "warn" | "off" {
  switch (value) {
    case "Native":
    case "Low":
    case "Highly Expandable":
      return "ok";
    case "Good":
    case "Moderate":
    case "Flexible":
      return "warn";
    case "Partial":
    case "Limited":
    case "High":
    case "Locked":
    case "Higher":
      return "off";
    default:
      return "off";
  }
}

function Pill({ label, tone }: { label: string; tone: "ok" | "warn" | "off" }) {
  return <span className={`eco-pill eco-pill-${tone}`}>{label}</span>;
}

function Dots({ rating }: { rating: Compatibility | Difficulty | Flexibility }) {
  const filled = rating === "Native" || rating === "Low" || rating === "Highly Expandable"
    ? 3
    : rating === "Good" || rating === "Moderate" || rating === "Flexible"
    ? 2
    : 1;
  const tone = toneFor(rating);
  return (
    <span className="eco-dots">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`eco-dot eco-dot-${i <= filled ? tone : "empty"}`} />
      ))}
    </span>
  );
}

export function EcosystemComparison() {
  const { ecosystems } = useEcosystems();

  if (ecosystems.length === 0) {
    return (
      <div className="eco-empty">
        <p className="eyebrow">No ecosystems yet</p>
        <p>Add or import ecosystems from the Update menu to see them compared here.</p>
      </div>
    );
  }

  return (
    <div className="eco-compare">
      <div className="eco-compare-head">
        <div>
          <p className="eyebrow">Compare</p>
          <h3 className="card-title">Ecosystem Comparison</h3>
          <p className="eco-sub">
            Compare mixed ecosystems to find the best balance of compatibility, install ease, and long-term value.
          </p>
        </div>
        <span className="live-tag"><span className="live-dot" />{ecosystems.length} ecosystems</span>
      </div>

      <div className="eco-table" role="table">
        <div className="eco-row eco-row-head" role="row">
          <div className="eco-col eco-col-name">Ecosystem</div>
          <div className="eco-col">Works Together</div>
          <div className="eco-col">How They Talk</div>
          <div className="eco-col">Install Difficulty</div>
          <div className="eco-col">Cheapest Safe Path</div>
          <div className="eco-col">Long-Term Flexibility</div>
          <div className="eco-col eco-col-practices">Install Practicality &amp; Cost-Effective Approach</div>
        </div>

        {ecosystems.map((e) => (
          <div key={e.id} className="eco-row" role="row">
            <div className="eco-col eco-col-name">
              <div className="eco-rank">{e.rank}</div>
              <div className="eco-name-block">
                <strong>{e.name}</strong>
                <ul className="eco-products">
                  {e.products.map((p) => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="eco-col">
              <Pill label={e.worksTogether.rating} tone={toneFor(e.worksTogether.rating)} />
              <p className="eco-note">{e.worksTogether.note}</p>
            </div>

            <div className="eco-col">
              <ul className="eco-list">
                {e.howTheyTalk.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="eco-col">
              <Pill label={e.installDifficulty.rating} tone={toneFor(e.installDifficulty.rating)} />
              <Dots rating={e.installDifficulty.rating} />
              <p className="eco-note">{e.installDifficulty.note}</p>
            </div>

            <div className="eco-col">
              <ul className="eco-checklist">
                {e.cheapestSafePath.map((step) => (
                  <li key={step}><Icon name="check" size={12} />{step}</li>
                ))}
              </ul>
              <p className="eco-meta">Est. install: <strong>{e.estInstallDays}</strong></p>
            </div>

            <div className="eco-col">
              <Pill label={e.longTermFlexibility.rating} tone={toneFor(e.longTermFlexibility.rating)} />
              <p className="eco-note">{e.longTermFlexibility.note}</p>
            </div>

            <div className="eco-col eco-col-practices">
              <ul className="eco-checklist">
                {e.installPractices.map((p) => (
                  <li key={p}><Icon name="check" size={12} />{p}</li>
                ))}
              </ul>
              <p className="eco-meta">
                Cost impact: <Pill label={e.costImpact} tone={toneFor(e.costImpact)} />
              </p>
              <p className="eco-meta">Score: <strong>{e.compatibilityScore}/100</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
