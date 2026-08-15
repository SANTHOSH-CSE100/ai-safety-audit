import { create } from "zustand";
import type { FactoryResponse } from "../types/api";

interface FactoryState {
  selected: FactoryResponse | null;
  factories: FactoryResponse[];
  /** True when `factories` is the demo-data fallback rather than real backend rows — see src/mock/. */
  isMockMode: boolean;
  setFactories: (factories: FactoryResponse[], isMockMode?: boolean) => void;
  select: (factory: FactoryResponse) => void;
}

export const useFactoryStore = create<FactoryState>((set, get) => ({
  selected: null,
  factories: [],
  isMockMode: false,
  setFactories: (factories, isMockMode = false) => {
    const current = get().selected;
    const stillValid = current && factories.some((f) => f.id === current.id);
    set({ factories, isMockMode, selected: stillValid ? current : factories[0] ?? null });
  },
  select: (factory) => set({ selected: factory }),
}));
