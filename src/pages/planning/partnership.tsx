import { useCallback } from 'react';
import { usePlanStore } from '@/stores/plan-store';
import { usePartnershipStore } from '@/stores/partnership-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt, fmtPct } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users, PieChart, Briefcase, Shield, FileText, DoorOpen } from 'lucide-react';

function RoleItem({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (val: string) => void;
  onRemove: () => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="group flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0" />
      <Input
        value={value}
        onChange={handleChange}
        className="flex-1 border-transparent bg-transparent px-1 h-7 text-sm text-text focus-visible:bg-bg2 focus-visible:border-border"
      />
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 text-text3 hover:text-destructive transition-opacity shrink-0"
      >
        <Trash2 size={12} />
      </Button>
    </div>
  );
}

function PartnerRolesCard({ partnerIdx, name }: { partnerIdx: number; name: string }) {
  const roles = usePartnershipStore((s) => s.roles[partnerIdx] || []);
  const { updateRole, addRole, removeRole } = usePartnershipStore();

  const handleAdd = useCallback(() => addRole(partnerIdx), [partnerIdx, addRole]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-text text-sm">
          <div className="w-2 h-2 rounded-full bg-gold" />
          {name}
          <Badge variant="secondary" className="ml-auto text-[0.6rem]">
            {roles.length} roles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {roles.map((role, ri) => (
            <RoleItem
              key={ri}
              value={role}
              onChange={(val) => updateRole(partnerIdx, ri, val)}
              onRemove={() => removeRole(partnerIdx, ri)}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAdd}
          className="mt-2 text-text3 hover:text-gold"
        >
          <Plus size={14} />
          Add role
        </Button>
      </CardContent>
    </Card>
  );
}

function SharedRolesCard() {
  const sharedRoles = usePartnershipStore((s) => s.sharedRoles);
  const { updateSharedRole, addSharedRole, removeSharedRole } = usePartnershipStore();

  return (
    <Card className="bg-card border-border border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-text text-sm">
          <Users size={14} className="text-gold" />
          Shared Decisions
          <Badge variant="secondary" className="ml-auto text-[0.6rem]">
            {sharedRoles.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {sharedRoles.map((role, i) => (
            <RoleItem
              key={i}
              value={role}
              onChange={(val) => updateSharedRole(i, val)}
              onRemove={() => removeSharedRole(i)}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={addSharedRole}
          className="mt-2 text-text3 hover:text-gold"
        >
          <Plus size={14} />
          Add shared role
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoCard({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-text text-sm">
          <Icon size={14} className="text-gold" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-text2">
              <div className="w-1 h-1 rounded-full bg-text3 shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function Partnership() {
  const partners = usePlanStore((s) => s.partners);
  const partnerReinvest = usePlanStore((s) => s.partnerReinvest);
  const set = usePlanStore((s) => s.set);
  const calc = useCalc();

  const partnerCount = partners.length;
  const equalSplit = partnerCount > 0 ? 100 / partnerCount : 0;
  const totalContrib = calc.partnerCurrent;

  return (
    <div className="space-y-6">
      {/* Ownership */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text">
            <PieChart size={16} className="text-gold" />
            Ownership Split
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partners.map((p, i) => {
              const capitalPct = totalContrib > 0 ? (p.current / totalContrib) * 100 : equalSplit;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-text2 w-24 truncate">{p.name}</span>
                  <div className="flex-1 h-2 bg-bg2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${equalSplit}%` }}
                    />
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-gold tabular-nums">
                      {fmtPct(equalSplit)}
                    </span>
                    <span className="text-[0.6rem] text-text3 block">
                      {fmtPct(capitalPct)} by capital
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-text3 mt-3">
            Equal split: {fmtPct(equalSplit)} each. Capital-based split shown for reference.
          </p>
        </CardContent>
      </Card>

      {/* Roles */}
      <div>
        <h3 className="text-sm font-bold text-text2 mb-3 flex items-center gap-2">
          <Briefcase size={14} className="text-gold" />
          Roles & Responsibilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((p, i) => (
            <PartnerRolesCard key={i} partnerIdx={i} name={p.name} />
          ))}
          <SharedRolesCard />
        </div>
      </div>

      {/* Profit Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text">
            <PieChart size={16} className="text-gold" />
            Profit Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-text3 text-xs mb-1">Reinvestment Rate (%)</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={partnerReinvest || ''}
                onChange={(e) => set({ partnerReinvest: Number(e.target.value) || 0 })}
                className="bg-bg2 border-border text-text max-w-[200px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg2 rounded-lg p-3 text-center">
                <div className="text-lg font-extrabold text-gold">{fmtPct(partnerReinvest)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">reinvested</div>
              </div>
              <div className="bg-bg2 rounded-lg p-3 text-center">
                <div className="text-lg font-extrabold text-text2">{fmtPct(100 - partnerReinvest)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">distributed</div>
              </div>
            </div>
            {calc.monthlyPL > 0 && (
              <div className="text-xs text-text3">
                Estimated monthly distribution:{' '}
                <span className="text-gold font-semibold">
                  {fmt(Math.round((calc.monthlyPL * (100 - partnerReinvest)) / 100 / partnerCount))} EGP
                </span>{' '}
                per partner
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Static info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          icon={Shield}
          title="What If One Leaves?"
          items={[
            'Buyout at book value or agreed formula',
            'First right of refusal to remaining partners',
            'Transition period: 3-6 months notice',
            'Non-compete clause: 2 years, same area',
          ]}
        />
        <InfoCard
          icon={DoorOpen}
          title="Exit Strategy"
          items={[
            'Minimum 2-year commitment before exit',
            'Valuation by independent accountant',
            'Structured payout over 6-12 months',
            'Assets split proportional to ownership',
          ]}
        />
        <InfoCard
          icon={FileText}
          title="Documentation"
          items={[
            'Partnership agreement (notarized)',
            'Profit/loss sharing terms',
            'Decision-making authority matrix',
            'Dispute resolution: mediation first',
            'Annual review of terms',
          ]}
        />
      </div>
    </div>
  );
}
