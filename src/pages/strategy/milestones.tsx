import { usePlanStore } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PhaseData {
  num: number;
  name: string;
  focus: string;
  color: string;
  borderColor: string;
  triggers: Array<{ label: string; autoCheck?: (dailyCustomers: number, monthlyPL: number) => boolean }>;
}

const PHASES: PhaseData[] = [
  {
    num: 0,
    name: 'Preparation',
    focus: 'Lease, fitout, equipment, branding, licensing, hiring',
    color: 'text-text3',
    borderColor: 'border-l-text3',
    triggers: [
      { label: 'Space built out' },
      { label: 'Licenses obtained' },
      { label: 'Equipment tested' },
      { label: 'Staff trained' },
    ],
  },
  {
    num: 1,
    name: 'Launch',
    focus: 'Get the coffee right. 15 items. Survival mode.',
    color: 'text-red-400',
    borderColor: 'border-l-red-400',
    triggers: [
      { label: '40+ customers/day', autoCheck: (dc) => dc >= 40 },
      { label: 'Drink quality stable' },
      { label: 'No operational fires' },
      { label: 'Staff run shifts solo' },
    ],
  },
  {
    num: 2,
    name: 'Stabilize',
    focus: 'Build the habit. 20 items. Loyalty card.',
    color: 'text-orange-400',
    borderColor: 'border-l-orange-400',
    triggers: [
      { label: '25-35% repeat rate' },
      { label: '60+ customers/day', autoCheck: (dc) => dc >= 60 },
      { label: 'Revenue growing MoM' },
    ],
  },
  {
    num: 3,
    name: 'Differentiate',
    focus: 'Why us and nobody else. Signature drinks. Events.',
    color: 'text-yellow-400',
    borderColor: 'border-l-yellow-400',
    triggers: [
      { label: '80+ customers/day', autoCheck: (dc) => dc >= 80 },
      { label: 'Signature drink in top 5' },
      { label: 'Approaching break-even' },
    ],
  },
  {
    num: 4,
    name: 'Profitability',
    focus: 'Sustainable business. Full menu. Retail beans.',
    color: 'text-green-400',
    borderColor: 'border-l-green-400',
    triggers: [
      { label: '3+ months net profit' },
      { label: '100+ customers/day', autoCheck: (dc) => dc >= 100 },
      { label: 'Profitable', autoCheck: (_dc, pl) => pl > 0 },
      { label: 'Cafe runs without you 2+ days' },
    ],
  },
  {
    num: 5,
    name: 'Growth',
    focus: 'Scale what works. Merchandise. Location #2.',
    color: 'text-blue-400',
    borderColor: 'border-l-blue-400',
    triggers: [
      { label: '6+ months profitability' },
      { label: 'Location #2 identified' },
      { label: 'Brand known city-wide' },
    ],
  },
];

function PhaseCard({ phase }: { phase: PhaseData }) {
  const dailyCustomers = usePlanStore((s) => s.dailyCustomers);
  const { monthlyPL } = useCalc();

  return (
    <Card className={`bg-card border-border border-l-4 ${phase.borderColor}`}>
      <CardContent className="pt-4 space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${phase.color}`}>
              Phase {phase.num}
            </span>
            <span className="text-base font-bold text-text">{phase.name}</span>
          </div>
          <p className="text-sm text-text2">{phase.focus}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {phase.triggers.map((trigger) => {
            const isActive = trigger.autoCheck?.(dailyCustomers, monthlyPL) ?? false;
            return (
              <Badge
                key={trigger.label}
                variant={isActive ? 'default' : 'outline'}
                className={
                  isActive
                    ? 'bg-green-500/20 text-green-400 border-green-500/40'
                    : 'border-border text-text3'
                }
              >
                {trigger.label}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function Milestones() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text">Growth Milestones</h3>
      <p className="text-sm text-text3">
        Triggers that auto-highlight are based on your current daily customers and P&L.
      </p>
      <div className="space-y-4">
        {PHASES.map((phase) => (
          <PhaseCard key={phase.num} phase={phase} />
        ))}
      </div>
    </div>
  );
}
