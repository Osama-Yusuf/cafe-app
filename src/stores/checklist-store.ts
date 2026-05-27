import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

export interface ChecklistPhase {
  name: string;
  color: string;
  subtitle: string;
  items: ChecklistItem[];
}

const DEFAULT_PHASES: Record<number, ChecklistPhase> = {
  1: {
    name: 'Foundation',
    color: '#d4a54a',
    subtitle: 'Months 1-3',
    items: [
      { id: 'p1_1', title: 'Open savings account', description: 'Choose your savings vehicle', checked: false },
      { id: 'p1_2', title: 'Set up monthly savings transfers', description: 'Automate contributions', checked: false },
      { id: 'p1_3', title: 'Draft partnership agreement', description: 'See Partnership tab', checked: false },
      { id: 'p1_4', title: 'Visit 30+ local cafes', description: 'Take notes on each', checked: false },
      { id: 'p1_5', title: 'Take a barista course', description: 'SCA Foundation or equivalent', checked: false },
      { id: 'p1_6', title: 'Research competitors', description: 'Visit them, note prices and vibe', checked: false },
      { id: 'p1_7', title: 'Shortlist 3-5 locations', description: 'Visit in person, check foot traffic', checked: false },
      { id: 'p1_8', title: 'Create shared cloud folder', description: 'All business documents', checked: false },
      { id: 'p1_9', title: 'Start inspiration board', description: 'Design, menu, branding ideas', checked: false },
      { id: 'p1_s25', title: 'Reach 25% of savings target', description: 'Track in Log tab', checked: false },
      { id: 'p1_s50', title: 'Reach 50% of savings target', description: 'Halfway there', checked: false },
      { id: 'p1_s75', title: 'Reach 75% of savings target', description: 'Almost there', checked: false },
      { id: 'p1_s100', title: 'Reach 100% of savings target', description: 'Ready to move forward', checked: false },
    ],
  },
  2: {
    name: 'Planning',
    color: '#5ba872',
    subtitle: 'Months 4-6',
    items: [
      { id: 'p2_1', title: 'Finalize location choice', description: 'Based on Areas research', checked: false },
      { id: 'p2_2', title: 'Scout key money and lease terms', description: 'Always ask about خلو رجل', checked: false },
      { id: 'p2_3', title: 'Hire a lawyer', description: 'For licensing process', checked: false },
      { id: 'p2_4', title: 'Apply for Commercial Register', description: 'سجل تجاري', checked: false },
      { id: 'p2_5', title: 'Apply for Tax Card', description: 'بطاقة ضريبية', checked: false },
      { id: 'p2_6', title: 'Begin brand identity work', description: 'Hire freelance designer', checked: false },
      { id: 'p2_7', title: 'Finalize name, logo, colors', description: 'Lock in the brand', checked: false },
      { id: 'p2_8', title: 'Contact coffee roasters', description: 'Get samples and wholesale pricing', checked: false },
      { id: 'p2_9', title: 'Set up social media accounts', description: 'Start posting behind-the-scenes', checked: false },
    ],
  },
  3: {
    name: 'Build-Out',
    color: '#5b8fc7',
    subtitle: 'Months 7-9',
    items: [
      { id: 'p3_1', title: 'Sign lease or close purchase', description: 'Secure the space', checked: false },
      { id: 'p3_2', title: 'Hire architect/contractor', description: '3+ quotes, check past work', checked: false },
      { id: 'p3_3', title: 'Submit permits', description: 'Health, operating license, civil defense', checked: false },
      { id: 'p3_4', title: 'Order espresso machine', description: '4-8 week lead time!', checked: false },
      { id: 'p3_5', title: 'Order all equipment', description: 'Grinders, fridges, POS', checked: false },
      { id: 'p3_6', title: 'Install water filtration', description: 'Test water quality first', checked: false },
      { id: 'p3_7', title: 'Furniture and decor', description: 'Tables, chairs, shelving', checked: false },
      { id: 'p3_8', title: 'Set up WiFi + power outlets', description: 'Reliable internet, visible password', checked: false },
      { id: 'p3_9', title: 'Hire and train staff', description: 'Use 3-stage evaluation', checked: false },
      { id: 'p3_10', title: 'Order initial inventory', description: 'Beans, milk, syrups, cups', checked: false },
    ],
  },
  4: {
    name: 'Launch',
    color: '#c08b5c',
    subtitle: 'Opening month',
    items: [
      { id: 'p4_1', title: 'Equipment tested and dialed in', description: 'Every machine calibrated', checked: false },
      { id: 'p4_2', title: 'Full menu test run', description: 'Make every item, taste, adjust', checked: false },
      { id: 'p4_3', title: 'Soft opening — friends and family', description: '2-3 days, invite-only', checked: false },
      { id: 'p4_4', title: 'Google Maps listing live', description: 'Essential for discoverability', checked: false },
      { id: 'p4_5', title: 'Professional photography', description: 'Space + drinks for social media', checked: false },
      { id: 'p4_6', title: 'Set up delivery apps', description: 'Talabat, Elmenus', checked: false },
      { id: 'p4_7', title: 'GRAND OPENING', description: 'Bismillah!', checked: false },
    ],
  },
  5: {
    name: 'Post-Launch',
    color: '#9b7dd4',
    subtitle: 'First 6 months',
    items: [
      { id: 'p5_1', title: 'Be present every day for 2 weeks', description: 'At least one founder on-site', checked: false },
      { id: 'p5_2', title: 'Track daily sales in POS', description: 'Revenue, transactions, avg ticket', checked: false },
      { id: 'p5_3', title: 'Month 1: actual vs projected P&L', description: 'Compare real numbers', checked: false },
      { id: 'p5_4', title: 'Cut slow-selling menu items', description: 'Less than 3/day after a month', checked: false },
      { id: 'p5_5', title: 'Learn 20 regulars by name', description: 'Personal connection = retention', checked: false },
      { id: 'p5_6', title: 'Month 3: first menu refresh', description: 'Add 1-2 new, remove 1-2 dead', checked: false },
      { id: 'p5_7', title: 'Host first community event', description: 'Coffee cupping or latte art night', checked: false },
      { id: 'p5_8', title: 'Month 6: comprehensive P&L review', description: 'On track to break even?', checked: false },
    ],
  },
};

interface ChecklistState {
  phases: Record<number, ChecklistPhase>;
  openPhases: Record<number, boolean>;
  toggleItem: (phase: number, itemId: string) => void;
  addItem: (phase: number) => void;
  removeItem: (phase: number, itemId: string) => void;
  updateItem: (phase: number, itemId: string, update: Partial<ChecklistItem>) => void;
  togglePhase: (phase: number) => void;
  resetToDefaults: () => void;
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      phases: structuredClone(DEFAULT_PHASES),
      openPhases: { 1: true },

      toggleItem: (phase, itemId) =>
        set((s) => {
          const phases = structuredClone(s.phases);
          const item = phases[phase]?.items.find((i) => i.id === itemId);
          if (item) item.checked = !item.checked;

          const openPhases = { ...s.openPhases };
          const phaseData = phases[phase];
          if (phaseData && phaseData.items.every((i) => i.checked)) {
            openPhases[phase] = false;
            const nextPhase = phase + 1;
            if (phases[nextPhase]) openPhases[nextPhase] = true;
          }

          return { phases, openPhases };
        }),

      addItem: (phase) =>
        set((s) => {
          const phases = structuredClone(s.phases);
          if (!phases[phase]) return s;
          phases[phase].items.push({
            id: `custom_${Date.now()}`,
            title: 'New task',
            description: 'Add details...',
            checked: false,
          });
          return { phases };
        }),

      removeItem: (phase, itemId) =>
        set((s) => {
          const phases = structuredClone(s.phases);
          if (!phases[phase]) return s;
          phases[phase].items = phases[phase].items.filter((i) => i.id !== itemId);
          return { phases };
        }),

      updateItem: (phase, itemId, update) =>
        set((s) => {
          const phases = structuredClone(s.phases);
          const item = phases[phase]?.items.find((i) => i.id === itemId);
          if (item) Object.assign(item, update);
          return { phases };
        }),

      togglePhase: (phase) =>
        set((s) => ({
          openPhases: { ...s.openPhases, [phase]: !s.openPhases[phase] },
        })),

      resetToDefaults: () =>
        set({
          phases: structuredClone(DEFAULT_PHASES),
          openPhases: { 1: true },
        }),
    }),
    { name: 'cafe-checklist', version: 1 }
  )
);
