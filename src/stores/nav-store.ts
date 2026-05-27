import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PageId = 'dashboard' | 'planning' | 'costs' | 'revenue' | 'strategy' | 'faith';

interface NavState {
  currentPage: PageId;
  currentTabs: Record<string, string>;
  setPage: (page: PageId) => void;
  setTab: (page: string, tab: string) => void;
  getTab: (page: string) => string | undefined;
}

export const useNavStore = create<NavState>()(
  persist(
    (set, get) => ({
      currentPage: 'dashboard',
      currentTabs: {},
      setPage: (page) => set({ currentPage: page }),
      setTab: (page, tab) => set((s) => ({ currentTabs: { ...s.currentTabs, [page]: tab } })),
      getTab: (page) => get().currentTabs[page],
    }),
    { name: 'cafe-planner-nav' }
  )
);
