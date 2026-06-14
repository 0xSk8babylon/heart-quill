import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GlanceWorkspace } from "@/components/twin-layer/GlanceWorkspace";
import { Badge } from "@/components/twin-layer/atoms";
import { Icon } from "@/components/twin-layer/Icon";
import { useTwin } from "@/lib/twin-layer/store";
import { GOALS, LEARN_TOPICS } from "@/lib/twin-layer/objects";

export const Route = createFileRoute("/_app/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Twin Layer" },
      { name: "description", content: "Set your goals and learn how home energy planning works — before you commit to a path." },
      { property: "og:title", content: "Explore — Twin Layer" },
      { property: "og:description", content: "Set your goals and learn how home energy planning works — before you commit to a path." },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const navigate = useNavigate();
  const { showToast } = useTwin();
  const [picked, setPicked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Explore</p>
          <h2 className="tab-title">Your goals & how this works</h2>
          <p className="tab-lede">
            What do you want your home to do next? Pick the goals that matter most — and read up on
            the systems behind them. Goals here can later seed a guided template or sandbox draft in
            the Planner.
          </p>
        </div>
      </header>

      {/* ── Goals ──────────────────────────────────────────── */}
      <section className="explore-section">
        <header className="explore-section-head">
          <div>
            <p className="eyebrow">Goals</p>
            <h2 className="explore-section-title">What do you want your home to do?</h2>
            <p className="explore-section-lede">
              Pick one or several. Goals shape which templates the Planner surfaces for you.
            </p>
          </div>
          <Link to="/planner" className="cta-link">
            Take goals to Planner <Icon name="arrow" size={14} />
          </Link>
        </header>

        <div className="goals-grid">
          {GOALS.map((g) => {
            const on = picked.has(g.id);
            return (
              <button
                key={g.id}
                type="button"
                className={`goal-card ${on ? "goal-card-on" : ""}`}
                onClick={() => toggle(g.id)}
                aria-pressed={on}
              >
                <span className="goal-card-icon"><Icon name={g.icon} size={20} /></span>
                <span className="goal-card-body">
                  <span className="goal-card-title">{g.title}</span>
                  <span className="goal-card-blurb">{g.blurb}</span>
                </span>
                <span className="goal-card-seeds">
                  {g.seeds.includes("template") ? <Badge tone="info">Template</Badge> : null}
                  {g.seeds.includes("sandbox")  ? <Badge tone="warn">Sandbox</Badge>  : null}
                </span>
              </button>
            );
          })}
        </div>

        {picked.size > 0 ? (
          <div className="goal-selected-bar">
            <span><strong>{picked.size}</strong> goal{picked.size === 1 ? "" : "s"} selected</span>
            <button
              type="button"
              className="btn"
              onClick={() => {
                showToast("Goals carried over to Planner");
                navigate({ to: "/planner" });
              }}
            >
              Open in Planner <Icon name="chevron" size={14} />
            </button>
          </div>
        ) : null}
      </section>

      <GlanceWorkspace items={["update", "expand"]} onGoals={() => showToast("Use the goals above")} />

      {/* ── Learn ──────────────────────────────────────────── */}
      <section className="explore-section">
        <header className="explore-section-head">
          <div>
            <p className="eyebrow">Learn</p>
            <h2 className="explore-section-title">The systems behind your plan</h2>
            <p className="explore-section-lede">
              Short, plain-language explainers tied to what's on your Energy Twin. Open any topic
              to see how it connects to your home.
            </p>
          </div>
        </header>
        <div className="learn-grid">
          {LEARN_TOPICS.map((t) => (
            <article key={t.id} className="card learn-card">
              <div className="learn-head">
                <h3 className="card-title">{t.title}</h3>
                <Badge tone="info">Read</Badge>
              </div>
              <p className="learn-summary">{t.summary}</p>
              <p className="learn-body">{t.ties}</p>
              <Link to="/twin" className="learn-source">
                <Icon name="link" size={12} /> See on your Energy Twin
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
