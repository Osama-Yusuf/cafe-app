import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PartnershipState {
  roles: Record<number, string[]>;
  sharedRoles: string[];
  updateRole: (partnerIdx: number, roleIdx: number, value: string) => void;
  addRole: (partnerIdx: number) => void;
  removeRole: (partnerIdx: number, roleIdx: number) => void;
  updateSharedRole: (idx: number, value: string) => void;
  addSharedRole: () => void;
  removeSharedRole: (idx: number) => void;
  moveRole: (fromPartner: number | 'shared', roleIdx: number, toPartner: number | 'shared') => void;
}

export const usePartnershipStore = create<PartnershipState>()(
  persist(
    (set) => ({
      roles: {
        0: ['Finance & bookkeeping', 'Tech & systems', 'Strategy & planning'],
        1: ['Daily operations', 'Supplier relationships', 'Staff management'],
      },
      sharedRoles: ['Strategic decisions', 'Hiring decisions', 'Menu & pricing changes'],

      updateRole: (pi, ri, val) =>
        set((s) => {
          const roles = { ...s.roles, [pi]: [...(s.roles[pi] || [])] };
          roles[pi][ri] = val;
          return { roles };
        }),

      addRole: (pi) =>
        set((s) => ({
          roles: { ...s.roles, [pi]: [...(s.roles[pi] || []), 'New responsibility'] },
        })),

      removeRole: (pi, ri) =>
        set((s) => {
          const roles = { ...s.roles, [pi]: (s.roles[pi] || []).filter((_, i) => i !== ri) };
          return { roles };
        }),

      updateSharedRole: (i, val) =>
        set((s) => {
          const sr = [...s.sharedRoles];
          sr[i] = val;
          return { sharedRoles: sr };
        }),

      addSharedRole: () =>
        set((s) => ({ sharedRoles: [...s.sharedRoles, 'New shared responsibility'] })),

      removeSharedRole: (i) =>
        set((s) => ({ sharedRoles: s.sharedRoles.filter((_, idx) => idx !== i) })),

      moveRole: (from, ri, to) =>
        set((s) => {
          const fromList = from === 'shared' ? [...s.sharedRoles] : [...(s.roles[from] || [])];
          const item = fromList[ri];
          if (!item) return s;
          fromList.splice(ri, 1);
          const toList = to === 'shared' ? [...s.sharedRoles] : [...(s.roles[to as number] || [])];
          toList.push(item);
          const roles = { ...s.roles };
          if (from !== 'shared') roles[from] = fromList;
          if (to !== 'shared') roles[to as number] = toList;
          return {
            roles,
            sharedRoles: from === 'shared' ? fromList : to === 'shared' ? toList : s.sharedRoles,
          };
        }),
    }),
    { name: 'cafe-partnership', version: 1 }
  )
);
