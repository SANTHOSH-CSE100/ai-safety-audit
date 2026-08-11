import { create } from "zustand";
import type { FactoryResponse } from "../types/api";

interface FactoryState {
  selected: FactoryResponse | null;
  factories: FactoryResponse[];
  setFactories: (factories: FactoryResponse[]) => void;
  select: (factory: FactoryResponse) => void;
}

export const useFactoryStore = create<FactoryState>((set, get) => ({
  selected: null,
  factories: [],
  setFactories: (factories) => {
    const current = get().selected;
    const stillValid = current && factories.some((f) => f.id === current.id);
    set({ factories, selected: stillValid ? current : factories[0] ?? null });
  },
  select: (factory) => set({ selected: factory }),
}));
