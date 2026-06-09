import { ACTIVITY, CONTRACTOR, LANE_STATUS, LANES, type Lane } from "@/lib/twin-layer/data";
import { useTwin } from "@/lib/twin-layer/store";
import { Badge, Confidence } from "./atoms";
import { Icon } from "./Icon";

export function InProgress({ onJump }: { onJump: () => void }) {
  const { nodes } = useTwin();
  const needsNodes = nodes.filter((n) => n.status === "needs_confirmation");
  const needs = needsNodes.length;

  const lanes: Lane[] = LANES.map((lane) => {
    if (lane.id === "confirmation_gate_review") {
      return {
        ...lane,
        count: needs,
        status: needs ? "blocked_or_deferred" : "review_context_available",
        items: needs ? needsNodes.map((n) => `Confirm ${n.label.toLowerCase()}`) : ["All systems confirmed"],
        homeowner: needs
          ? `${needs} system${needs > 1 ? "s" : ""} still need your confirmation before a proposal can move forward.`
          : "Every system is confirmed — this gate is clear.",
      };
    }
    if (lane.id === "proposal_prep_blocked_deferred") {
      return {
        ...lane,
        count: needs ? 1 : 0,
        status: needs ? "blocked_or_deferred" : "review_context_available",
        items: needs ? ["Blocked by: confirmation gate review"] : ["Ready for contractor proposal prep"],
        homeowner: needs
          ? "Proposal prep is waiting on the confirmation gate above."
          : "The gate is clear — your contractor can begin proposal prep.",
      };
    }
    return lane;
  });

  const blocked = lanes.filter((l) => l.status === "blocked_or_deferred").length;

  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">In progress</p>
          <h2 className="tab-title">Shared with your contractor</h2>
          <p className="tab-lede">
            A read-only view of your twin, organized into the review lanes your contractor works through. Nothing here changes your plan.
          </p>
        </div>
      </header>

      <div className="contractor-bar">
        <div className="contractor-id">
          <span className="contractor-avatar">
            {CONTRACTOR.contact.split(" ").map((w) => w[0]).join("")}
          </span>
          <div>
            <strong>{CONTRACTOR.name}</strong>
            <span>{CONTRACTOR.contact} · {CONTRACTOR.role}</span>
          </div>
        </div>
        <div className="contractor-meta">
          <span className="contractor-shared"><Icon name="link" size={15} />{CONTRACTOR.sharedAt}</span>
          <Badge tone={blocked ? "warn" : "ok"}>{blocked ? `${blocked} lanes blocked` : "All lanes clear"}</Badge>
        </div>
      </div>

      <div className="progress-layout">
        <div className="lanes">
          {lanes.map((lane) => {
            const cfg = LANE_STATUS[lane.status];
            const isGate = lane.id === "confirmation_gate_review";
            return (
              <article key={lane.id} className={`lane lane-${cfg.tone}`}>
                <div className="lane-head">
                  <div className="lane-title">
                    <span className={`lane-rail lane-rail-${cfg.tone}`} />
                    <h3>{lane.label}</h3>
                  </div>
                  <span className={`lane-status lane-status-${cfg.tone}`}>{cfg.label}</span>
                </div>
                <p className="lane-summary">{lane.homeowner}</p>
                {lane.items ? (
                  <ul className="lane-items">
                    {lane.items.map((it) => (
                      <li key={it}>
                        <span className={`lane-dot lane-dot-${cfg.tone}`} />{it}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="lane-foot">
                  <span className="lane-prompt"><Icon name="users" size={14} />{lane.prompt}</span>
                  <Confidence level={lane.confidence} />
                </div>
                {isGate && lane.count > 0 ? (
                  <button className="btn btn-primary btn-wide" onClick={onJump}>
                    <Icon name="check" size={16} />Resolve {lane.count} in Home
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>

        <aside className="progress-side">
          <section className="card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Activity</p>
                <h3 className="card-title">Recent on this share</h3>
              </div>
            </div>
            <ul className="timeline">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="timeline-row">
                  <span className="timeline-node" />
                  <div>
                    <p className="timeline-text"><strong>{a.who}</strong> {a.what}</p>
                    <span className="timeline-when"><Icon name="clock" size={12} />{a.when}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card readiness-card">
            <p className="eyebrow">Readiness summary</p>
            <div className="readiness-row"><span>Lanes ready</span><strong>{lanes.length - blocked} / {lanes.length}</strong></div>
            <div className="readiness-row"><span>Confirmation gates</span><strong className={needs ? "warn-text" : ""}>{needs} open</strong></div>
            <div className="readiness-row"><span>Proposal prep</span><strong>{needs ? "Deferred" : "Ready"}</strong></div>
            <p className="readiness-note">
              This view is non-authoritative and derived at request time. It is not a permit, quote, or final design.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
