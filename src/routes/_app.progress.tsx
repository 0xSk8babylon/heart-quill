import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { InProgress } from "@/components/twin-layer/InProgress";
import { RegistrySection } from "@/components/twin-layer/RegistryCard";
import { StubSection } from "@/components/twin-layer/StubSection";
import { Badge } from "@/components/twin-layer/atoms";
import { Icon } from "@/components/twin-layer/Icon";
import { useTwin } from "@/lib/twin-layer/store";
import { PROJECT_OBJECT } from "@/lib/twin-layer/objects";

export const Route = createFileRoute("/_app/progress")({
  head: () => ({
    meta: [
      { title: "Builder — Twin Layer" },
      { name: "description", content: "Your selected plan moving toward install — confirmations, contractor handoff, and post-install state." },
      { property: "og:title", content: "Builder — Twin Layer" },
      { property: "og:description", content: "Your selected plan moving toward install — confirmations, contractor handoff, and post-install state." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const navigate = useNavigate();
  const { showToast } = useTwin();
  return (
    <>
      <div className="tab-wrap">
        <header className="tab-head">
          <div>
            <p className="eyebrow">Builder · Project</p>
            <h2 className="tab-title">{PROJECT_OBJECT.name}</h2>
            <p className="tab-lede">
              The selected plan you're moving toward install. This is where confirmations land,
              contractors join, and post-install records get written back to your Energy Twin.
            </p>
          </div>
          <div className="tab-head-meta">
            <span className="live-dot" />
            Mock project · contractor not yet engaged
          </div>
        </header>

        <section className="card project-card">
          <header className="card-head">
            <div>
              <p className="eyebrow">Selected scenario</p>
              <h3 className="card-title">{PROJECT_OBJECT.selectedScenario}</h3>
              <p className="project-sub">
                Came from a <Link to="/planner">Validated Scenario</Link> in the Planner.
              </p>
            </div>
            <Badge tone="ok">Validated</Badge>
          </header>

          <ul className="project-fields">
            {PROJECT_OBJECT.fields.map((f) => (
              <li key={f.label} className="project-field">
                <span className="project-field-label">{f.label}</span>
                <span className="project-field-value">
                  <Badge tone={f.tone ?? "default"}>{f.value}</Badge>
                </span>
              </li>
            ))}
          </ul>

          <div className="project-questions">
            <p className="eyebrow">This page answers</p>
            <ul>
              {PROJECT_OBJECT.questions.map((q) => (
                <li key={q}><Icon name="check" size={14} /> {q}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <InProgress
        onJump={() => {
          showToast("Open a flagged system to confirm it");
          navigate({ to: "/twin" });
        }}
      />
      <div className="tab-wrap">
        <StubSection group="builder" />
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
