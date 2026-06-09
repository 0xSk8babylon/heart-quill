import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { NODES, SCENARIOS, type NodeModel } from "./data";

type Ctx = {
  nodes: NodeModel[];
  selectedId: string | null;
  selectNode: (id: string | null) => void;
  selectedNode: NodeModel | null;
  confirmNode: (id: string) => void;
  scenarioId: string;
  setScenarioId: (id: string) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  needs: number;
};

const TwinCtx = createContext<Ctx | null>(null);

export function TwinProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<NodeModel[]>(() => NODES.map((n) => ({ ...n })));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState<string>(
    () => (SCENARIOS.find((s) => s.recommended) || SCENARIOS[0]).id,
  );
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const confirmNode = useCallback((id: string) => {
    let label = "System";
    setNodes((cur) =>
      cur.map((n) => {
        if (n.id !== id) return n;
        label = n.label;
        return {
          ...n,
          status: "known",
          trust: "user_created",
          confidence: "medium",
          missing: [],
          facts: n.facts.map((f) => f.replace(/: assumed|: unknown/i, ": confirmed")),
        };
      }),
    );
    setSelectedId(null);
    showToast(`${label} confirmed — passport updated`);
  }, [showToast]);

  const selectedNode = useMemo(
    () => (selectedId ? nodes.find((n) => n.id === selectedId) ?? null : null),
    [selectedId, nodes],
  );
  const needs = useMemo(() => nodes.filter((n) => n.status === "needs_confirmation").length, [nodes]);

  const value: Ctx = {
    nodes, selectedId, selectNode: setSelectedId, selectedNode, confirmNode,
    scenarioId, setScenarioId, toast, showToast, needs,
  };

  return <TwinCtx.Provider value={value}>{children}</TwinCtx.Provider>;
}

export function useTwin() {
  const ctx = useContext(TwinCtx);
  if (!ctx) throw new Error("useTwin must be used inside TwinProvider");
  return ctx;
}
