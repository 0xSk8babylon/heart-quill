import { useMemo } from "react";
import { EDGES, STATUS, type NodeModel } from "@/lib/twin-layer/data";
import { Icon } from "./Icon";

export type EcoOverlay = {
  color: string;
  /** node ids to highlight via lines from the hub */
  nodeIds: string[];
};

export function HomeDiagram({
  nodes, selectedId, onSelect, compact = false, overlay,
}: {
  nodes: NodeModel[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
  overlay?: EcoOverlay;
}) {
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const hub = useMemo(() => nodes.find((n) => n.hub) ?? null, [nodes]);

  return (
    <div className={`diagram ${compact ? "diagram-compact" : ""}`}>
      <svg className="diagram-edges" viewBox="0 0 100 100" preserveAspectRatio="none">
        {EDGES.map(([a, b]) => {
          const na = byId[a], nb = byId[b];
          if (!na || !nb) return null;
          const lead = na.hub ? nb : na;
          const tone = STATUS[lead.status]?.dot || "off";
          const active = selectedId === a || selectedId === b;
          return (
            <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              className={`edge edge-${tone} ${active ? "edge-active" : ""}`} />
          );
        })}
        {overlay && hub
          ? overlay.nodeIds.map((id) => {
              const target = byId[id];
              if (!target || target.id === hub.id) return null;
              return (
                <line
                  key={`overlay-${id}`}
                  x1={hub.x}
                  y1={hub.y}
                  x2={target.x}
                  y2={target.y}
                  className="edge-overlay"
                  stroke={overlay.color}
                />
              );
            })
          : null}
      </svg>

      {nodes.map((n) => {
        const tone = STATUS[n.status]?.dot || "off";
        const selected = selectedId === n.id;
        return (
          <button key={n.id} type="button"
            className={`node node-${tone} ${n.hub ? "node-hub" : ""} ${selected ? "node-selected" : ""}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            onClick={() => onSelect(n.id)}
            aria-label={`${n.label} — ${STATUS[n.status]?.label}`}>
            <span className="node-ring">
              <Icon name={n.glyph} size={n.hub ? 26 : 20} />
              {n.status === "needs_confirmation" ? <span className="node-flag">!</span> : null}
            </span>
            <span className="node-label">{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}
