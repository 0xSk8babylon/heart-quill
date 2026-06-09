import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HomeTwin } from "@/components/twin-layer/HomeTwin";
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
    <HomeTwin
      onGoals={() => {
        showToast("Let’s set your energy goals");
        navigate({ to: "/scenario" });
      }}
    />
  );
}
