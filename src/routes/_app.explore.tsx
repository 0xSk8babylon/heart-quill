import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GlanceWorkspace } from "@/components/twin-layer/GlanceWorkspace";
import { useTwin } from "@/lib/twin-layer/store";

export const Route = createFileRoute("/_app/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Twin Layer" },
      { name: "description", content: "Update your homeowner profile, set goals and priorities, and explore what your twin can do next." },
      { property: "og:title", content: "Explore — Twin Layer" },
      { property: "og:description", content: "Update your homeowner profile, set goals and priorities, and explore what your twin can do next." },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const navigate = useNavigate();
  const { showToast } = useTwin();
  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Explore</p>
          <h2 className="tab-title">Profile, goals & priorities</h2>
          <p className="tab-lede">
            Keep your twin current, set what matters most, and explore what's possible before you plan.
          </p>
        </div>
      </header>
      <GlanceWorkspace
        onGoals={() => {
          showToast("Let’s set your energy goals");
          navigate({ to: "/scenario" });
        }}
      />
    </div>
  );
}
