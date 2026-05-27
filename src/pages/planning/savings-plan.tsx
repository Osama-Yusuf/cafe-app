import { useCallback } from 'react';
import { usePlanStore } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt, fmtK, fmtPct } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditableNumber } from '@/components/ui/editable-number';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Users } from 'lucide-react';

const VEHICLES = [
  { value: 'gold', label: 'Gold' },
  { value: 'mudarabah', label: 'Mudarabah' },
  { value: 'forex', label: 'Forex' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'egp', label: 'EGP Savings' },
];

const SPLIT_ROWS = [
  { key: 'Gold', allocKey: 'allocGold', returnKey: 'returnGold' },
  { key: 'Mudarabah', allocKey: 'allocMudarabah', returnKey: 'returnMudarabah' },
  { key: 'Forex', allocKey: 'allocForex', returnKey: 'returnForex' },
  { key: 'Stocks', allocKey: 'allocStocks', returnKey: 'returnStocks' },
  { key: 'EGP', allocKey: 'allocEgp', returnKey: 'returnEgp' },
] as const;

function ProgressRing({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width="140" height="140" viewBox="0 0 120 120" className="mx-auto">
      <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-bg2" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-gold transition-all duration-700"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="56" textAnchor="middle" className="fill-gold text-lg font-extrabold" fontSize="18">
        {fmtPct(pct)}
      </text>
      <text x="60" y="74" textAnchor="middle" className="fill-text3 text-[10px]" fontSize="10">
        saved
      </text>
    </svg>
  );
}

function PartnerRow({
  index,
  name,
  monthly,
  current,
}: {
  index: number;
  name: string;
  monthly: number;
  current: number;
}) {
  const updatePartner = usePlanStore((s) => s.updatePartner);
  const removePartner = usePlanStore((s) => s.removePartner);
  const partnersCount = usePlanStore((s) => s.partners.length);

  const handleName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updatePartner(index, { name: e.target.value }),
    [index, updatePartner]
  );
  const handleMonthly = useCallback(
    (v: number) => updatePartner(index, { monthly: v }),
    [index, updatePartner]
  );
  const handleCurrent = useCallback(
    (v: number) => updatePartner(index, { current: v }),
    [index, updatePartner]
  );
  const handleRemove = useCallback(() => removePartner(index), [index, removePartner]);

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
      <div>
        <Label className="text-text3 text-xs mb-1">Name</Label>
        <Input value={name} onChange={handleName} className="bg-bg2 border-border text-text" />
      </div>
      <div>
        <Label className="text-text3 text-xs mb-1">Monthly</Label>
        <EditableNumber
          value={monthly}
          onChange={handleMonthly}
          size="sm"
        />
      </div>
      <div>
        <Label className="text-text3 text-xs mb-1">Current</Label>
        <EditableNumber
          value={current}
          onChange={handleCurrent}
          size="sm"
        />
      </div>
      {partnersCount > 1 && (
        <Button variant="ghost" size="icon-sm" onClick={handleRemove} className="text-text3 hover:text-destructive mb-0.5">
          <Trash2 size={14} />
        </Button>
      )}
    </div>
  );
}

function SplitRow({
  label,
  allocKey,
  returnKey,
}: {
  label: string;
  allocKey: string;
  returnKey: string;
}) {
  const alloc = usePlanStore((s) => s[allocKey as keyof typeof s] as number);
  const ret = usePlanStore((s) => s[returnKey as keyof typeof s] as number);
  const set = usePlanStore((s) => s.set);

  const handleAlloc = useCallback(
    (v: number) => set({ [allocKey]: v }),
    [allocKey, set]
  );
  const handleReturn = useCallback(
    (v: number) => set({ [returnKey]: v }),
    [returnKey, set]
  );

  return (
    <div className="grid grid-cols-[1fr_80px_80px] gap-2 items-center">
      <span className="text-sm text-text2">{label}</span>
      <EditableNumber
        value={alloc}
        onChange={handleAlloc}
        size="sm"
        suffix="%"
      />
      <EditableNumber
        value={ret}
        onChange={handleReturn}
        size="sm"
        suffix="%"
      />
    </div>
  );
}

export function SavingsPlan() {
  const {
    partners,
    goldReserves,
    savingsTarget,
    splitMode,
    savingsVehicle,
    savingsReturn,
    hasRentalIncome,
    rentalPhase,
    rentalIncome,
    rentalPropertyPrice,
    rentalExpectedRent,
    set,
    addPartner,
  } = usePlanStore();

  const calc = useCalc();

  const estDate = new Date();
  estDate.setMonth(estDate.getMonth() + calc.savMonths);
  const estDateStr = estDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ProgressRing pct={calc.savPct} />
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-extrabold text-gold">{calc.savMonths >= 240 ? '240+' : calc.savMonths}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">months to target</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-gold">{fmtK(calc.totalCurrent)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">total current</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-gold">{fmtK(savingsTarget)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">target</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-text2">{fmtK(calc.effectiveMonthly)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">monthly savings</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-text2">{estDateStr}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">estimated date</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-text2">{fmtK(savingsTarget - calc.totalCurrent)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text">
            <Users size={16} className="text-gold" />
            Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partners.map((p, i) => (
              <PartnerRow key={i} index={i} name={p.name} monthly={p.monthly} current={p.current} />
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 border-border text-text2" onClick={addPartner}>
            <Plus size={14} />
            Add Partner
          </Button>
        </CardContent>
      </Card>

      {/* Gold reserves + target */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Reserves & Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-text3 text-xs mb-1">Gold Reserves (EGP)</Label>
              <EditableNumber
                value={goldReserves}
                onChange={(v) => set({ goldReserves: v })}
              />
            </div>
            <div>
              <Label className="text-text3 text-xs mb-1">Savings Target (EGP)</Label>
              <EditableNumber
                value={savingsTarget}
                onChange={(v) => set({ savingsTarget: v })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings vehicles */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-text">
            <span>Savings Vehicle</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text3 font-normal">Split Mode</span>
              <Switch checked={splitMode} onCheckedChange={(c) => set({ splitMode: c })} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {splitMode ? (
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_80px_80px] gap-2 mb-1">
                <span className="text-xs text-text3 font-semibold">Vehicle</span>
                <span className="text-xs text-text3 font-semibold text-center">Alloc %</span>
                <span className="text-xs text-text3 font-semibold text-center">Return %</span>
              </div>
              {SPLIT_ROWS.map((row) => (
                <SplitRow key={row.key} label={row.key} allocKey={row.allocKey} returnKey={row.returnKey} />
              ))}
              <div className="mt-2 text-xs text-text3">
                Total allocation:{' '}
                <span className="text-gold font-semibold">
                  {usePlanStore.getState().allocGold +
                    usePlanStore.getState().allocMudarabah +
                    usePlanStore.getState().allocForex +
                    usePlanStore.getState().allocStocks +
                    usePlanStore.getState().allocEgp}
                  %
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-text3 text-xs mb-1">Vehicle</Label>
                <Select value={savingsVehicle} onValueChange={(v) => set({ savingsVehicle: String(v) })}>
                  <SelectTrigger className="w-full bg-bg2 border-border text-text">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLES.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-text3 text-xs mb-1">Expected Return (%/yr)</Label>
                <EditableNumber
                  value={savingsReturn}
                  onChange={(v) => set({ savingsReturn: v })}
                  suffix="%"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rental income */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-text">
            <span>Rental Income</span>
            <Switch checked={hasRentalIncome} onCheckedChange={(c) => set({ hasRentalIncome: c })} />
          </CardTitle>
        </CardHeader>
        {hasRentalIncome && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-text3 text-xs">Phase:</Label>
                <div className="flex gap-2">
                  <Button
                    variant={rentalPhase === 'own' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => set({ rentalPhase: 'own' })}
                    className={rentalPhase === 'own' ? 'bg-gold text-bg' : 'border-border text-text2'}
                  >
                    Already Own
                  </Button>
                  <Button
                    variant={rentalPhase === 'saving' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => set({ rentalPhase: 'saving' })}
                    className={rentalPhase === 'saving' ? 'bg-gold text-bg' : 'border-border text-text2'}
                  >
                    Saving to Buy
                  </Button>
                </div>
              </div>
              {rentalPhase === 'own' ? (
                <div>
                  <Label className="text-text3 text-xs mb-1">Monthly Rental Income (EGP)</Label>
                  <EditableNumber
                    value={rentalIncome}
                    onChange={(v) => set({ rentalIncome: v })}
                    suffix=" EGP"
                  />
                  <p className="text-xs text-text3 mt-1">This amount will be added to your monthly savings.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text3 text-xs mb-1">Property Price (EGP)</Label>
                    <EditableNumber
                      value={rentalPropertyPrice}
                      onChange={(v) => set({ rentalPropertyPrice: v })}
                      suffix=" EGP"
                    />
                  </div>
                  <div>
                    <Label className="text-text3 text-xs mb-1">Expected Rent (EGP/mo)</Label>
                    <EditableNumber
                      value={rentalExpectedRent}
                      onChange={(v) => set({ rentalExpectedRent: v })}
                      suffix=" EGP"
                    />
                  </div>
                  <div className="md:col-span-2 text-xs text-text3">
                    Rental yield: {rentalPropertyPrice > 0 ? ((rentalExpectedRent * 12) / rentalPropertyPrice * 100).toFixed(1) : '0'}%/yr
                    {' '} — ROI: {rentalExpectedRent > 0 ? Math.ceil(rentalPropertyPrice / rentalExpectedRent) : '--'} months
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary footer */}
      <div className="text-center text-xs text-text3 pt-2">
        All amounts in EGP — {fmt(calc.partnerMonthly)}/mo from partners
        {hasRentalIncome && rentalPhase === 'own' && ` + ${fmt(rentalIncome)}/mo rental`}
      </div>
    </div>
  );
}
