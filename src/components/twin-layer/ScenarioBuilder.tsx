import { Fragment } from "react";
import { COMPARE_KEYS, SCENARIOS } from "@/lib/twin-layer/data";
import { useTwin } from "@/lib/twin-layer/store";
import { Badge, Confidence, ScoreMeter, TrustBadge } from "./atoms";
import { Icon } from "./Icon";

export function ScenarioBuilder({ onShare }: { onShare: () => void }) {
  const { scenarioId, setScenarioId } = useTwin();
  const goalLabel = (g: string) => g.replaceAll("_", " ");
  const chosen = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];

  const leaders: Record<string, string> = {};
  COMPARE_KEYS.forEach(({ key }) => {
    const best = key === "complexity"
      ? [...SCENARIOS].sort((a, b) => a[key] - b[key])[0]
      : [...SCENARIOS].sort((a, b) => b[key] - a[key])[0];
    leaders[key] = best.id;
  });

  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Scenario builder</p>
          <h2 className="tab-title">Plan. Compare. Decide.</h2>
          <p className="tab-lede">
            Three planning pathways modeled from your twin. Every value carries its own trust state — nothing here is a quote yet.
          </p>
        </div>
        <div className="tab-head-meta">
          <Icon name="scale" size={18} /><span>{SCENARIOS.length} pathways · 1 home</span>
        </div>
      </header>

      <div className="scenario-grid">
        {SCENARIOS.map((s) => {
          const active = s.id === scenarioId;
          return (
            <article key={s.id} className={`scenario ${active ? "scenario-active" : ""} ${s.recommended ? "scenario-rec" : ""}`}>
              {s.recommended ? <span className="rec-flag"><Icon name="spark" size={13} />Recommended</span> : null}
              <div className="scenario-top">
                <h3 className="scenario-name">{s.name}</h3>
                <Badge tone="info">{goalLabel(s.goal)}</Badge>
              </div>
              <p className="scenario-blurb">{s.blurb}</p>

              <div className="scenario-cost">
                <span className="cost-label">Planning estimate</span>
                <span className="cost-value">${s.cost.toLocaleString()}<span className="cost-tilde">≈</span></span>
              </div>

              <div className="scenario-scores">
                {COMPARE_KEYS.map(({ key, label }) => (
                  <div key={key} className="score-row">
                    <span className="score-name">
                      {label}{leaders[key] === s.id ? <span className="score-best">best</span> : null}
                    </span>
                    <ScoreMeter
                      value={key === "complexity" ? 100 - s[key] : s[key]}
                      tone={key === "backup" ? "ok" : key === "expansion" ? "info" : "warn"} />
                    <span className="score-num">{s[key]}</span>
                  </div>
                ))}
              </div>

              <div className="scenario-chips">
                {s.chips.map((c) => <span key={c} className="chip">{c}</span>)}
              </div>

              <p className="scenario-note">{s.note}</p>

              <div className="scenario-foot">
                <div className="scenario-trust">
                  <Confidence level={s.confidence} />
                  {s.trust.map((t) => <TrustBadge key={t} state={t} />)}
                </div>
              </div>

              <button className={`btn ${active ? "btn-primary" : "btn-outline"} btn-wide`} onClick={() => setScenarioId(s.id)}>
                {active ? (
                  <Fragment><Icon name="check" size={16} />Selected pathway</Fragment>
                ) : "Select this pathway"}
              </button>
            </article>
          );
        })}
      </div>

      <div className="compare-strip">
        <div className="compare-head"><Icon name="scale" size={17} /><span>Head to head</span></div>
        <div className="compare-rows">
          {COMPARE_KEYS.map(({ key, label }) => (
            <div key={key} className="compare-row">
              <span className="compare-label">{label}</span>
              <div className="compare-bars">
                {SCENARIOS.map((s) => (
                  <div key={s.id} className={`compare-cell ${leaders[key] === s.id ? "compare-lead" : ""}`}>
                    <span className="compare-cell-name">{s.name.split(" ")[0]}</span>
                    <ScoreMeter
                      value={key === "complexity" ? 100 - s[key] : s[key]}
                      tone={leaders[key] === s.id ? "ok" : "mute"} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="compare-foot">
          <div>
            <span className="compare-foot-label">Carrying forward</span>
            <strong>{chosen.name}</strong>
          </div>
          <button className="btn btn-primary" onClick={onShare}>
            <Icon name="users" size={17} />Share with contractor
          </button>
        </div>
      </div>
    </div>
  );
}
