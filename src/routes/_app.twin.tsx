import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HomeTwin } from "@/components/twin-layer/HomeTwin";
import { RegistrySection } from "@/components/twin-layer/RegistryCard";
import { useTwin } from "@/lib/twin-layer/store";

export const Route = createFileRoute("/_app/twin")({
  head: () => ({
    meta: [
      { title: "Home Twin — Twin Layer" },
      { name: "description", content: "Your residential energy digital twin — solar, battery, panel, and more in one live diagram." },
      { property: "og:title", content: "Home Twin — Twin Layer" },
      { property: "og:description", content: "Your residential energy digital twin — live home diagram and energy passport." },
    ],
  }),
  component: TwinPage,
});

function TwinPage() {
  const navigate = useNavigate();
  const { showToast } = useTwin();
  return (
    <>
      <HomeTwin
        onGoals={() => {
          showToast("Let’s set your energy goals");
          navigate({ to: "/scenario" });
        }}
      />
      <RegistrySection
        section="home"
        eyebrow="More about your home"
        title="Other home capabilities"
        lede="Every card answers one homeowner question and shows where its data lives, what it isn't, and when it activates."
        excludeIds={["energy-twin-overview", "single-line-diagram", "energy-passport"]}
      />
    </>
  );
}
