import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ScenarioBuilder } from "@/components/twin-layer/ScenarioBuilder";
import { RegistrySection } from "@/components/twin-layer/RegistryCard";
import { GlanceWorkspace } from "@/components/twin-layer/GlanceWorkspace";
import { HomeDiagram } from "@/components/twin-layer/HomeDiagram";
import { StatusDot } from "@/components/twin-layer/atoms";
import { SCENARIOS } from "@/lib/twin-layer/data";
import { Icon } from "@/components/twin-layer/Icon";
import { useTwin } from "@/lib/twin-layer/store";

const SCENARIO_NODES: Record<string, string[]> = {
  "sc-critical": ["solar", "panel", "battery", "backup"],
  "sc-balanced": ["solar", "utility", "meter", "panel", "battery", "backup", "ev"],
  "sc-future": ["solar", "utility", "meter", "panel", "battery", "backup", "ev", "generator"],
};

export const Route = createFileRoute("/_app/scenario")({
  head: () => ({
    meta: [
      { title: "Plan — Twin Layer" },
      { name: "description", content: "Plan. Compare. Decide. Three energy pathways modeled from your home twin." },
      { property: "og:title", content: "Plan — Twin Layer" },
      { property: "og:description", content: "Plan. Compare. Decide. Three energy pathways modeled from your home twin." },
    ],
  }),
  component: ScenarioPage,
});

function ScenarioPage() {
  const navigate = useNavigate();
  const { scenarioId, setScenarioId, showToast, nodes, selectedId, selectNode } = useTwin();
  const visibleNodes = useMemo(() => {
    const allow = new Set(SCENARIO_NODES[scenarioId] ?? nodes.map((n) => n.id));
    return nodes.filter((n) => allow.has(n.id));
  }, [nodes, scenarioId]);
  return (
    <>
      <div className="tab-wrap">
        <div className="diagram-row">
          <aside className="sb-menu" role="group" aria-label="Scenario builder">
            <p className="sb-menu-title"><Icon name="scale" size={13} />Scenario builder</p>
            <ul className="sb-menu-list">
              {SCENARIOS.map((s, i) => {
                const active = s.id === scenarioId;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`sb-menu-item ${active ? "sb-menu-item-active" : ""}`}
                      onClick={() => setScenarioId(s.id)}
                      title={s.name}
                    >
                      <span className="sb-menu-num">{i + 1}</span>
                      <span className="sb-menu-text">
                        <span className="sb-menu-label">Scenario {i + 1}</span>
                        <span className="sb-menu-sub">{s.name}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
          <section className="card diagram-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Home diagram</p>
                <h3 className="card-title">Planning against your twin</h3>
              </div>
              <span className="live-tag"><span className="live-dot" />Updated just now</span>
            </div>
            <HomeDiagram nodes={visibleNodes} selectedId={selectedId} onSelect={selectNode} />
            <div className="legend">
              <span><StatusDot status="known" />Known / verified</span>
              <span><StatusDot status="needs_confirmation" />Needs confirmation</span>
              <span><StatusDot status="not_added" />Not added yet</span>
            </div>
          </section>
        </div>
        <GlanceWorkspace onGoals={() => showToast("Goals & priorities — coming soon")} />
      </div>


      <ScenarioBuilder
        onShare={() => {
          const s = SCENARIOS.find((x) => x.id === scenarioId);
          showToast(`${s?.name ?? "Pathway"} shared with Bright Path Energy`);
          navigate({ to: "/progress" });
        }}
      />

      <div className="tab-wrap">
        <RegistrySection
          section="planner"
          eyebrow="More planning surfaces"
          title="Other planner capabilities"
          lede="Adjacent planning lenses that activate as your twin gains structured context."
          excludeIds={["scenarios"]}
        />
      </div>
    </>
  );
}
