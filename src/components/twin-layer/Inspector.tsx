import { Fragment } from "react";
import { STATUS, type NodeModel } from "@/lib/twin-layer/data";
import { Confidence, StatusDot, TrustBadge } from "./atoms";
import { Icon } from "./Icon";

export function Inspector({
  node, onClose, onConfirm,
}: {
  node: NodeModel;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  const status = STATUS[node.status];
  const needs = node.status === "needs_confirmation";
  const off = node.status === "not_added";

  return (
    <Fragment>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={`${node.label} details`}>
        <div className="drawer-head">
          <div className="drawer-head-id">
            <span className={`node-mini node-${status.dot}`}><Icon name={node.glyph} size={20} /></span>
            <div>
              <p className="eyebrow">{node.system.replaceAll("_", " ")}</p>
              <h3>{node.label}</h3>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="plus" size={18} className="rot45" />
          </button>
        </div>

        <div className="drawer-status">
          <span className={`statline statline-${status.dot}`}>
            <StatusDot status={node.status} size={9} />{status.label}
          </span>
          <Confidence level={node.confidence} />
        </div>

        <p className="drawer-headline">{node.headline}</p>
        <p className="drawer-summary">{node.summary}</p>

        <div className="drawer-section">
          <p className="eyebrow">On record</p>
          <ul className="fact-list">
            {node.facts.map((f) => (
              <li key={f}><Icon name="check" size={15} className="fact-ok" />{f}</li>
            ))}
          </ul>
        </div>

        {node.missing.length ? (
          <div className="drawer-section">
            <p className="eyebrow">Still needed</p>
            <ul className="fact-list">
              {node.missing.map((m) => (
                <li key={m}><span className="fact-miss" />{m}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="drawer-basis">
          <TrustBadge state={node.trust} />
          <span className="basis-text">Source: {node.basis}</span>
        </div>

        <div className="drawer-actions">
          {needs ? (
            <Fragment>
              <button className="btn btn-primary" onClick={() => onConfirm(node.id)}>
                <Icon name="check" size={17} />Confirm this system
              </button>
              <button className="btn btn-ghost" onClick={onClose}>Not now</button>
            </Fragment>
          ) : off ? (
            <button className="btn btn-primary" onClick={() => onConfirm(node.id)}>
              <Icon name="plus" size={17} />Add to twin
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={onClose}>
              <Icon name="check" size={16} />Verified — close
            </button>
          )}
        </div>
      </aside>
    </Fragment>
  );
}
