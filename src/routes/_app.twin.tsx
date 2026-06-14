import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HomeTwin } from "@/components/twin-layer/HomeTwin";
import { RegistrySection } from "@/components/twin-layer/RegistryCard";
import { StubSection } from "@/components/twin-layer/StubSection";
import { Icon } from "@/components/twin-layer/Icon";
import { useTwin } from "@/lib/twin-layer/store";
import { TWIN_OVERVIEW } from "@/lib/twin-layer/objects";

export const Route = createFileRoute("/_app/twin")({
  head: () => ({
    meta: [
      { title: "Home — Twin Layer" },
      { name: "description", content: "Your residential energy digital twin — solar, battery, panel, and more in one live diagram." },
      { property: "og:title", content: "Home — Twin Layer" },
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
          navigate({ to: "/explore" });
        }}
      />

      <div className="tab-wrap">
        <section className="card twin-overview">
          <header className="card-head">
            <div>
              <p className="eyebrow">Energy Twin</p>
              <h3 className="card-title">{TWIN_OVERVIEW.headline}</h3>
              <p className="twin-overview-sub">{TWIN_OVERVIEW.sub}</p>
            </div>
            <span className="live-tag live-active"><span className="live-dot" />Live</span>
          </header>
          <ul className="twin-overview-grid">
            {TWIN_OVERVIEW.blocks.map((b) => (
              <li key={b.label} className="twin-overview-item">
                <span className="twin-overview-icon"><Icon name={b.icon} size={18} /></span>
                <div>
                  <p className="twin-overview-label">{b.label}</p>
                  <p className="twin-overview-hint">{b.hint}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="tab-wrap">
        <StubSection group="home" />
      </div>
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
