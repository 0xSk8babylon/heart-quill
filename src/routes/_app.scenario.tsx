import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ScenarioBuilder } from "@/components/twin-layer/ScenarioBuilder";
import { SCENARIOS } from "@/lib/twin-layer/data";
import { useTwin } from "@/lib/twin-layer/store";

export const Route = createFileRoute("/_app/scenario")({
  head: () => ({
    meta: [
      { title: "Scenario Builder — Twin Layer" },
      { name: "description", content: "Plan. Compare. Decide. Three energy pathways modeled from your home twin." },
      { property: "og:title", content: "Scenario Builder — Twin Layer" },
      { property: "og:description", content: "Plan. Compare. Decide. Three energy pathways modeled from your home twin." },
    ],
  }),
  component: ScenarioPage,
});

function ScenarioPage() {
  const navigate = useNavigate();
  const { scenarioId, showToast } = useTwin();
  return (
    <ScenarioBuilder
      onShare={() => {
        const s = SCENARIOS.find((x) => x.id === scenarioId);
        showToast(`${s?.name ?? "Pathway"} shared with Bright Path Energy`);
        navigate({ to: "/progress" });
      }}
    />
  );
}
