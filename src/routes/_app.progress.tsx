import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InProgress } from "@/components/twin-layer/InProgress";
import { RegistrySection } from "@/components/twin-layer/RegistryCard";
import { useTwin } from "@/lib/twin-layer/store";

export const Route = createFileRoute("/_app/progress")({
  head: () => ({
    meta: [
      { title: "In Progress — Twin Layer" },
      { name: "description", content: "Contractor review lanes and activity for your shared home twin." },
      { property: "og:title", content: "In Progress — Twin Layer" },
      { property: "og:description", content: "Contractor review lanes and activity for your shared home twin." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const navigate = useNavigate();
  const { showToast } = useTwin();
  return (
    <>
      <InProgress
        onJump={() => {
          showToast("Open a flagged system to confirm it");
          navigate({ to: "/twin" });
        }}
      />
      <div className="tab-wrap">
        <RegistrySection
          section="build"
          eyebrow="More build surfaces"
          title="Other build capabilities"
          lede="Readiness lenses that come online once contractor, estimate, and program context are sufficient."
          excludeIds={["contractor-context", "estimate-readiness", "proposal-options"]}
        />
      </div>
    </>
  );
}
