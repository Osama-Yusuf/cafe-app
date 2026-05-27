import { useState } from 'react';
import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableNumber } from '@/components/ui/editable-number';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

interface RoleDef {
  label: string;
  salKey: keyof PlanState;
  onKey: keyof PlanState;
  phase: string;
}

const ROLES: RoleDef[] = [
  { label: 'Barista 1 (Lead)', salKey: 'salBarista1', onKey: 'onBarista1', phase: 'Day 1' },
  { label: 'Barista 2', salKey: 'salBarista2', onKey: 'onBarista2', phase: 'Day 1' },
  { label: 'Cleaner', salKey: 'salCleaner', onKey: 'onCleaner', phase: 'Day 1' },
  { label: 'Barista 3', salKey: 'salBarista3', onKey: 'onBarista3', phase: 'Month 3+' },
  { label: 'Shift Lead', salKey: 'salShiftLead', onKey: 'onShiftLead', phase: 'Month 6+' },
  { label: 'Social Media', salKey: 'salSocial', onKey: 'onSocial', phase: 'Month 3+' },
  { label: 'Kitchen Hand', salKey: 'salKitchen', onKey: 'onKitchen', phase: 'Month 6+' },
  { label: 'Manager', salKey: 'salManager', onKey: 'onManager', phase: 'Year 2+' },
];

function RoleRow({ role }: { role: RoleDef }) {
  const isOn = usePlanStore((s) => s[role.onKey] as boolean);
  const salary = usePlanStore((s) => s[role.salKey] as number);
  const set = usePlanStore((s) => s.set);

  return (
    <div
      className={`grid grid-cols-[auto_1fr_100px_80px] gap-3 items-center py-2.5 border-b border-border text-sm transition-opacity ${
        isOn ? '' : 'opacity-40'
      }`}
    >
      <Switch
        checked={isOn}
        onCheckedChange={(c) => set({ [role.onKey]: c })}
      />
      <div>
        <span className="text-text font-medium">{role.label}</span>
        <Badge variant="outline" className="ml-2 text-[0.6rem] py-0 h-4">
          {role.phase}
        </Badge>
      </div>
      <EditableNumber
        value={salary}
        onChange={(v) => set({ [role.salKey]: v })}
        size="sm"
      />
      <span className="text-right text-gold font-semibold tabular-nums">
        {isOn ? fmt(salary) : '--'}
      </span>
    </div>
  );
}

function HiringGuide() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="bg-card border-border">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <CardTitle className="flex items-center justify-between text-text text-sm">
          <span>Hiring Guide</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="space-y-5 text-sm">
          {/* 3-Stage Evaluation */}
          <div>
            <h4 className="font-bold text-text mb-2">3-Stage Evaluation</h4>
            <div className="space-y-3">
              <div className="border-l-2 border-gold/40 pl-3">
                <span className="font-semibold text-gold text-xs uppercase tracking-wider">
                  Stage 1: Phone Screen
                </span>
                <p className="text-text2 mt-1">
                  5-min call. Ask about experience, availability, and salary expectations.
                  Filter out anyone who cannot commit to early shifts or weekend work.
                </p>
              </div>
              <div className="border-l-2 border-gold/40 pl-3">
                <span className="font-semibold text-gold text-xs uppercase tracking-wider">
                  Stage 2: In-Person
                </span>
                <p className="text-text2 mt-1">
                  15-min conversation at the shop. Observe attitude, punctuality, and communication.
                  Ask scenario questions: "A customer complains their drink is wrong -- what do you do?"
                </p>
              </div>
              <div className="border-l-2 border-gold/40 pl-3">
                <span className="font-semibold text-gold text-xs uppercase tracking-wider">
                  Stage 3: Bar Test
                </span>
                <p className="text-text2 mt-1">
                  Paid 2-hour trial shift. Watch espresso technique, milk steaming,
                  speed under pressure, cleanliness, and how they interact with customers.
                </p>
              </div>
            </div>
          </div>

          {/* Red Flags */}
          <div>
            <h4 className="font-bold text-text mb-2">Red Flags</h4>
            <ul className="space-y-1 text-text2">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">&#x2022;</span>
                Cannot name the last 3 places they worked (job hopper)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">&#x2022;</span>
                Arrives late to the interview
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">&#x2022;</span>
                Refuses to do cleaning tasks ("I am a barista only")
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">&#x2022;</span>
                Cannot work Fridays or weekends
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">&#x2022;</span>
                No phone or unreliable contact method
              </li>
            </ul>
          </div>

          {/* SCA Certifications */}
          <div>
            <h4 className="font-bold text-text mb-2">SCA Certifications</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 text-text3 text-xs uppercase font-semibold">Level</th>
                  <th className="text-right py-1.5 text-text3 text-xs uppercase font-semibold">Cost (EGP)</th>
                  <th className="text-left py-1.5 pl-3 text-text3 text-xs uppercase font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text2">Foundation</td>
                  <td className="py-1.5 text-right text-gold tabular-nums">3,000-5,000</td>
                  <td className="py-1.5 pl-3 text-text3">1 day, basics</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text2">Intermediate</td>
                  <td className="py-1.5 text-right text-gold tabular-nums">8,000-12,000</td>
                  <td className="py-1.5 pl-3 text-text3">2 days, hands-on</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-1.5 text-text2">Professional</td>
                  <td className="py-1.5 text-right text-gold tabular-nums">15,000-25,000</td>
                  <td className="py-1.5 pl-3 text-text3">3 days, exam</td>
                </tr>
              </tbody>
            </table>
            <p className="text-text3 text-xs mt-2">
              Consider sponsoring SCA Foundation for your lead barista after 3 months.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function Team() {
  const calc = useCalc();

  return (
    <div className="space-y-6">
      {/* Roles */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text">
            <Users size={16} className="text-gold" />
            Staff Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[auto_1fr_100px_80px] gap-3 mb-2">
            <span className="text-[0.6rem] text-text3 font-semibold uppercase">On</span>
            <span className="text-[0.6rem] text-text3 font-semibold uppercase">Role</span>
            <span className="text-[0.6rem] text-text3 font-semibold uppercase text-right">Salary</span>
            <span className="text-[0.6rem] text-text3 font-semibold uppercase text-right">EGP/mo</span>
          </div>
          {ROLES.map((role) => (
            <RoleRow key={role.salKey} role={role} />
          ))}

          {/* Auto-calculated extras */}
          <div className="mt-4 space-y-2 pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-text3">Base Salaries</span>
              <span className="text-text2 tabular-nums">{fmt(calc.baseSal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text3">Social Insurance (18.75%)</span>
              <span className="text-text2 tabular-nums">{fmt(calc.socialInsurance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text3">Transport Allowance (400 x {calc.activeCount})</span>
              <span className="text-text2 tabular-nums">{fmt(calc.transport)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text3">Eid Bonus Provision (base / 12)</span>
              <span className="text-text2 tabular-nums">{fmt(calc.eidBonus)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-4 mt-3 border-t-2 border-gold">
            <span className="text-base font-extrabold text-text uppercase tracking-wider">
              Total Monthly Labor
            </span>
            <span className="text-lg font-extrabold text-gold tabular-nums">
              {fmt(calc.totalLabor)} EGP/mo
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Hiring Guide */}
      <HiringGuide />
    </div>
  );
}
