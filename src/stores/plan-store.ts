import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Area } from '@/lib/constants';
import { AREA_DEFAULTS, MENU_DEFAULTS } from '@/lib/constants';

export interface Partner {
  name: string;
  monthly: number;
  current: number;
}

export interface MenuItem {
  name: string;
  category: string;
  price: number;
  cost: number;
}

export interface SavingsLogEntry {
  month: string;
  entries: Record<number, number>;
  rental: number;
}

export interface PlanState {
  // Meta
  cafeName: string;
  strategy: 'rent' | 'buy';

  // Partners
  partners: Partner[];

  // Savings
  goldReserves: number;
  savingsTarget: number;
  splitMode: boolean;
  savingsVehicle: string;
  savingsReturn: number;
  allocGold: number;
  allocMudarabah: number;
  allocForex: number;
  allocStocks: number;
  allocEgp: number;
  returnGold: number;
  returnMudarabah: number;
  returnForex: number;
  returnStocks: number;
  returnEgp: number;

  // Rental income
  hasRentalIncome: boolean;
  rentalPhase: 'own' | 'saving';
  rentalIncome: number;
  rentalPropertyPrice: number;
  rentalExpectedRent: number;

  // Areas
  selectedArea: string;
  areas: Area[];

  // Startup costs
  monthlyRent: number;
  depositMonths: number;
  keyMoney: number;
  eqEspresso: number;
  eqGrinders: number;
  eqWater: number;
  eqFridge: number;
  eqIce: number;
  eqBlenders: number;
  eqPourover: number;
  eqColdbrew: number;
  spRenovation: number;
  spFurniture: number;
  spLighting: number;
  spSignage: number;
  spPOS: number;
  spAC: number;
  spSound: number;
  laBrand: number;
  laInventory: number;
  laMarketing: number;
  laPhoto: number;
  lgLicense: number;
  lgLawyer: number;

  // Supplies
  supEspressoKg: number;
  supEspressoPrice: number;
  supOriginKg: number;
  supOriginPrice: number;
  supDecafKg: number;
  supDecafPrice: number;
  supFullMilkL: number;
  supFullMilkPrice: number;
  supOatMilkL: number;
  supOatMilkPrice: number;
  supAlmondMilkL: number;
  supAlmondMilkPrice: number;
  supVanilla: number;
  supCaramel: number;
  supHazelnut: number;
  supChocolate: number;
  supHoney: number;
  supHotCups: number;
  supColdCups: number;
  supNapkins: number;
  supBags: number;
  supStraws: number;
  supStirrers: number;
  supBakeryQty: number;
  supBakeryCost: number;

  // Team
  salBarista1: number; onBarista1: boolean;
  salBarista2: number; onBarista2: boolean;
  salCleaner: number; onCleaner: boolean;
  salBarista3: number; onBarista3: boolean;
  salShiftLead: number; onShiftLead: boolean;
  salSocial: number; onSocial: boolean;
  salKitchen: number; onKitchen: boolean;
  salManager: number; onManager: boolean;

  // Menu
  menu: Record<string, MenuItem>;

  // Revenue
  dailyCustomers: number;
  avgTicket: number;

  // P&L fixed costs
  opUtilities: number;
  opInternet: number;
  opMarketing: number;
  opMaintenance: number;
  opAccounting: number;
  opInsurance: number;
  opPOS: number;
  opMisc: number;

  // Revenue growth
  revenueGrowthPct: number;

  // Partnership
  partnerReinvest: number;
  partnerDayThreshold: number;

  // Zakat
  zkCash: number;
  zkInventory: number;
  zkReceivables: number;
  zkDebts: number;
  zkExpenses: number;
  zkNisab: number;

  // Savings log
  savingsLog: SavingsLogEntry[];

  // Actions
  set: (partial: Partial<PlanState>) => void;
  updatePartner: (index: number, partner: Partial<Partner>) => void;
  addPartner: () => void;
  removePartner: (index: number) => void;
  updateMenuItem: (key: string, update: Partial<MenuItem>) => void;
  selectArea: (areaId: string) => void;
  addLogEntry: () => void;
  removeLogEntry: (index: number) => void;
  updateLogEntry: (index: number, key: string | number, value: string | number) => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      cafeName: 'Café Planner',
      strategy: 'rent',

      partners: [
        { name: 'You', monthly: 30000, current: 300000 },
      ],

      goldReserves: 0,
      savingsTarget: 3500000,
      splitMode: false,
      savingsVehicle: 'gold',
      savingsReturn: 15,
      allocGold: 40, allocMudarabah: 20, allocForex: 30, allocStocks: 0, allocEgp: 10,
      returnGold: 15, returnMudarabah: 15, returnForex: 0, returnStocks: 12, returnEgp: 0,

      hasRentalIncome: false,
      rentalPhase: 'own',
      rentalIncome: 0,
      rentalPropertyPrice: 1500000,
      rentalExpectedRent: 15000,

      selectedArea: 'maadi',
      areas: [...AREA_DEFAULTS] as Area[],

      monthlyRent: 50000, depositMonths: 3, keyMoney: 1000000,
      eqEspresso: 300000, eqGrinders: 60000, eqWater: 8000, eqFridge: 50000,
      eqIce: 15000, eqBlenders: 5000, eqPourover: 8000, eqColdbrew: 4000,
      spRenovation: 400000, spFurniture: 150000, spLighting: 25000, spSignage: 25000,
      spPOS: 20000, spAC: 50000, spSound: 10000,
      laBrand: 30000, laInventory: 40000, laMarketing: 15000, laPhoto: 8000,
      lgLicense: 35000, lgLawyer: 15000,

      supEspressoKg: 18, supEspressoPrice: 1000,
      supOriginKg: 6, supOriginPrice: 1200,
      supDecafKg: 3, supDecafPrice: 1200,
      supFullMilkL: 10, supFullMilkPrice: 25,
      supOatMilkL: 3, supOatMilkPrice: 80,
      supAlmondMilkL: 0, supAlmondMilkPrice: 90,
      supVanilla: 1500, supCaramel: 1500, supHazelnut: 800,
      supChocolate: 1000, supHoney: 700,
      supHotCups: 2500, supColdCups: 2000, supNapkins: 400,
      supBags: 700, supStraws: 300, supStirrers: 200,
      supBakeryQty: 20, supBakeryCost: 15,

      salBarista1: 6000, onBarista1: true,
      salBarista2: 5000, onBarista2: true,
      salCleaner: 3500, onCleaner: true,
      salBarista3: 6000, onBarista3: false,
      salShiftLead: 9000, onShiftLead: false,
      salSocial: 4000, onSocial: false,
      salKitchen: 4000, onKitchen: false,
      salManager: 14000, onManager: false,

      menu: Object.fromEntries(
        Object.entries(MENU_DEFAULTS).map(([k, v]) => [k, { ...v }])
      ),

      dailyCustomers: 50,
      avgTicket: 0,

      opUtilities: 8000, opInternet: 1000, opMarketing: 10000,
      opMaintenance: 5000, opAccounting: 3000, opInsurance: 3000,
      opPOS: 1500, opMisc: 5000,

      revenueGrowthPct: 5,
      partnerReinvest: 50,
      partnerDayThreshold: 5000,

      zkCash: 0, zkInventory: 0, zkReceivables: 0,
      zkDebts: 0, zkExpenses: 0, zkNisab: 350000,

      savingsLog: [],

      set: (partial) => set(partial),

      updatePartner: (index, update) => set((state) => {
        const partners = [...state.partners];
        partners[index] = { ...partners[index], ...update };
        return { partners };
      }),

      addPartner: () => set((state) => ({
        partners: [...state.partners, { name: `Partner ${state.partners.length + 1}`, monthly: 0, current: 0 }],
      })),

      removePartner: (index) => set((state) => ({
        partners: state.partners.filter((_, i) => i !== index),
      })),

      updateMenuItem: (key, update) => set((state) => ({
        menu: { ...state.menu, [key]: { ...state.menu[key], ...update } },
      })),

      selectArea: (areaId) => {
        const state = get();
        const area = state.areas.find((a) => a.id === areaId);
        if (area) {
          set({
            selectedArea: areaId,
            monthlyRent: area.defaultRent,
            keyMoney: area.defaultKeyMoney,
          });
        }
      },

      addLogEntry: () => set((state) => {
        const now = new Date();
        const last = state.savingsLog[state.savingsLog.length - 1];
        let newMonth: string;
        if (last) {
          const [y, m] = last.month.split('-').map(Number);
          const d = new Date(y, m, 1);
          newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        } else {
          newMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
        const entries: Record<number, number> = {};
        state.partners.forEach((p, i) => { entries[i] = p.monthly; });
        return {
          savingsLog: [...state.savingsLog, { month: newMonth, entries, rental: state.hasRentalIncome && state.rentalPhase === 'own' ? state.rentalIncome : 0 }],
        };
      }),

      removeLogEntry: (index) => set((state) => ({
        savingsLog: state.savingsLog.filter((_, i) => i !== index),
      })),

      updateLogEntry: (index, key, value) => set((state) => {
        const log = [...state.savingsLog];
        const entry = { ...log[index] };
        if (key === 'month') {
          entry.month = value as string;
        } else if (key === 'rental') {
          entry.rental = Number(value) || 0;
        } else {
          entry.entries = { ...entry.entries, [key]: Number(value) || 0 };
        }
        log[index] = entry;
        return { savingsLog: log };
      }),
    }),
    {
      name: 'cafe-planner-state',
      version: 1,
    }
  )
);
