import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GlanceWorkspace } from "@/components/twin-layer/GlanceWorkspace";
import { Badge } from "@/components/twin-layer/atoms";
import { Icon } from "@/components/twin-layer/Icon";
import { useTwin } from "@/lib/twin-layer/store";

export const Route = createFileRoute("/_app/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Twin Layer" },
      { name: "description", content: "Profile, goals, priorities, and Learn — understand what's possible before you plan." },
      { property: "og:title", content: "Explore — Twin Layer" },
      { property: "og:description", content: "Profile, goals, priorities, and Learn — understand what's possible before you plan." },
    ],
  }),
  component: ExplorePage,
});

type LearnTopic = {
  id: string;
  title: string;
  summary: string;
  body: string;
  source: string; // future backend router that will provide content
};

const LEARN: LearnTopic[] = [
  {
    id: "energy-passport",
    title: "What's an Energy Passport?",
    summary: "A homeowner-safe summary of your home's energy systems you can share or revisit later.",
    body: "It's a planning-level snapshot — not a title, permit, or warranty document. Once your twin has enough structured facts, the passport assembles itself from what's known.",
    source: "energy_passport",
  },
  {
    id: "nem-3",
    title: "How NEM 3.0 changes export value",
    summary: "California's net-billing tariff pays much less for solar exported mid-day than the old NEM 2.0 plan.",
    body: "Battery storage matters more under NEM 3.0 because shifting solar into evening hours captures higher export credit. Your scenarios reflect this for PG&E addresses.",
    source: "program_intelligence",
  },
  {
    id: "compatibility",
    title: "Why ecosystems aren't interchangeable",
    summary: "Tesla, Enphase, and SolarEdge each have rules about which inverters, batteries, and panels work together.",
    body: "Compatibility rules check architecture (AC- vs DC-coupled), inverter pairing, and backup behavior before a pathway is shown as viable.",
    source: "compatibility_rules",
  },
  {
    id: "nec-load",
    title: "NEC load calc & service capacity",
    summary: "Adding an EV charger or heat pump may exceed your 200A service — the NEC load calculation checks first.",
    body: "Section 220 of the NEC sets the math. Heart-quill flags when a scenario would push past your panel's rated capacity.",
    source: "nec_load_calculation",
  },
  {
    id: "sources",
    title: "Where the numbers come from",
    summary: "Every fact carries a source: manufacturer datasheet, utility account, homeowner photo, or derived estimate.",
    body: "Trust badges on the diagram show the basis for each value so you always know what's verified vs. assumed.",
    source: "source_documents",
  },
];

function ExplorePage() {
  const navigate = useNavigate();
  const { showToast } = useTwin();
  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Explore</p>
          <h2 className="tab-title">Profile, goals & learn</h2>
          <p className="tab-lede">
            Keep your twin current, set what matters most, and learn how home energy planning works
            before you commit to a path.
          </p>
        </div>
      </header>

      <GlanceWorkspace
        items={["update", "expand"]}
        onGoals={() => {
          showToast("Let’s set your energy goals");
          navigate({ to: "/scenario" });
        }}
      />

      <section className="registry-section">
        <header className="registry-section-head">
          <p className="eyebrow">Learn</p>
          <h2 className="registry-section-title">How home energy planning actually works</h2>
          <p className="registry-section-lede">
            Short explainers tied to the systems on your twin. Content is mocked today — the Learn
            backend (<code>source_documents</code>, <code>program_intelligence</code>) will replace
            these once wired.
          </p>
        </header>
        <div className="learn-grid">
          {LEARN.map((t) => (
            <article key={t.id} className="card learn-card">
              <div className="learn-head">
                <h3 className="card-title">{t.title}</h3>
                <Badge tone="info">Mocked</Badge>
              </div>
              <p className="learn-summary">{t.summary}</p>
              <p className="learn-body">{t.body}</p>
              <p className="learn-source">
                <Icon name="link" size={12} />
                Future source: <code>{t.source}</code>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
