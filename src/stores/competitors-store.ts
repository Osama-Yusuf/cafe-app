import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Competitor {
  name: string;
  latte: number;
  americano: number;
  cappuccino: number;
  notes: string;
}

interface CompetitorsState {
  competitors: Competitor[];
  addCompetitor: () => void;
  removeCompetitor: (index: number) => void;
  updateCompetitor: (index: number, update: Partial<Competitor>) => void;
}

export const useCompetitorsStore = create<CompetitorsState>()(
  persist(
    (set) => ({
      competitors: [],
      addCompetitor: () => set((s) => ({
        competitors: [...s.competitors, { name: `Competitor ${s.competitors.length + 1}`, latte: 0, americano: 0, cappuccino: 0, notes: '' }],
      })),
      removeCompetitor: (i) => set((s) => ({
        competitors: s.competitors.filter((_, idx) => idx !== i),
      })),
      updateCompetitor: (i, update) => set((s) => {
        const competitors = [...s.competitors];
        competitors[i] = { ...competitors[i], ...update };
        return { competitors };
      }),
    }),
    { name: 'cafe-competitors', version: 1 }
  )
);
