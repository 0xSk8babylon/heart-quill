import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { SEED_ECOSYSTEMS, type Ecosystem } from "./ecosystems";

type Ctx = {
  ecosystems: Ecosystem[];
  addEcosystem: (e: Ecosystem) => void;
  replaceAll: (list: Ecosystem[]) => void;
  removeEcosystem: (id: string) => void;
};

const EcoCtx = createContext<Ctx | null>(null);

export function EcosystemProvider({ children }: { children: ReactNode }) {
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>(() => SEED_ECOSYSTEMS);

  const addEcosystem = useCallback((e: Ecosystem) => {
    setEcosystems((prev) => [...prev.filter((x) => x.id !== e.id), e].sort((a, b) => a.rank - b.rank));
  }, []);
  const replaceAll = useCallback((list: Ecosystem[]) => setEcosystems(list), []);
  const removeEcosystem = useCallback(
    (id: string) => setEcosystems((prev) => prev.filter((e) => e.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({ ecosystems, addEcosystem, replaceAll, removeEcosystem }),
    [ecosystems, addEcosystem, replaceAll, removeEcosystem],
  );

  return <EcoCtx.Provider value={value}>{children}</EcoCtx.Provider>;
}

export function useEcosystems() {
  const ctx = useContext(EcoCtx);
  if (!ctx) throw new Error("useEcosystems must be used inside EcosystemProvider");
  return ctx;
}
