import { useState } from 'react';
import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt, fmtK } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Save, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PnLSnapshot {
  monthlyRevenue: number;
  totalMonthlyOp: number;
  monthlyPL: number;
  rent: number;
  labor: number;
  supplies: number;
  fixed: number;
  breakEvenCustomers: number;
  savedAt: string;
}

function OpRow({ label, storeKey }: { label: string; storeKey: keyof PlanState }) {
  const value = usePlanStore((s) => s[storeKey] as number);
  const set = usePlanStore((s) => s.set);

  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-text2">{label}</span>
      <Input
        type="number"
        inputMode="numeric"
        value={value || ''}
        onChange={(e) => set({ [storeKey]: Number(e.target.value) || 0 })}
        className="w-24 h-7 text-right bg-bg border-border text-xs"
      />
    </div>
  );
}

function ReadOnlyRow({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className={muted ? 'text-text3' : 'text-text2'}>{label}</span>
      <span className={`tabular-nums ${muted ? 'text-text3' : 'text-text2 font-medium'}`}>
        {fmt(value)}
      </span>
    </div>
  );
}

function DeltaBadge({ current, previous, label }: { current: number; previous: number; label: string }) {
  const delta = current - previous;
  const isUp = delta >= 0;

  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-text3">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-text2 tabular-nums">{fmt(current)}</span>
        <Badge
          variant="outline"
          className={`text-[0.6rem] py-0 h-4 ${
            isUp ? 'border-green-600 text-green-400' : 'border-red-600 text-red-400'
          }`}
        >
          {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {isUp ? '+' : ''}{fmt(delta)}
        </Badge>
      </div>
    </div>
  );
}

export function PnL() {
  const calc = useCalc();
  const monthlyRent = usePlanStore((s) => s.monthlyRent);

  const [snapshot, setSnapshot] = useState<PnLSnapshot | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('cafe-pnl-snapshot') || 'null');
    } catch {
      return null;
    }
  });

  const saveSnapshot = () => {
    const snap: PnLSnapshot = {
      monthlyRevenue: calc.monthlyRevenue,
      totalMonthlyOp: calc.totalMonthlyOp,
      monthlyPL: calc.monthlyPL,
      rent: monthlyRent,
      labor: calc.totalLabor,
      supplies: calc.totalSupplies,
      fixed: calc.fixedCosts,
      breakEvenCustomers: calc.breakEvenCustomers,
      savedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    localStorage.setItem('cafe-pnl-snapshot', JSON.stringify(snap));
    setSnapshot(snap);
  };

  const chartData = [
    { name: 'Revenue', value: calc.monthlyRevenue },
    { name: 'Costs', value: calc.totalMonthlyOp },
  ];

  const chartColors = ['#22c55e', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Revenue */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <span className="text-text2 text-sm">Monthly Revenue</span>
            <span className="text-xl font-extrabold text-green-400 tabular-nums">
              {fmt(calc.monthlyRevenue)} EGP
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Costs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Monthly Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <ReadOnlyRow label="Rent" value={monthlyRent} />
          <ReadOnlyRow label="Labor (Team)" value={calc.totalLabor} />
          <ReadOnlyRow label="Supplies" value={calc.totalSupplies} />

          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-[0.6rem] text-text3 uppercase tracking-wider font-semibold mb-2">
              Operational Costs (editable)
            </div>
            <OpRow label="Utilities" storeKey="opUtilities" />
            <OpRow label="Internet" storeKey="opInternet" />
            <OpRow label="Marketing" storeKey="opMarketing" />
            <OpRow label="Maintenance" storeKey="opMaintenance" />
            <OpRow label="Accounting" storeKey="opAccounting" />
            <OpRow label="Insurance" storeKey="opInsurance" />
            <OpRow label="POS Subscription" storeKey="opPOS" />
            <OpRow label="Miscellaneous" storeKey="opMisc" />
          </div>

          <div className="flex items-center justify-between pt-4 mt-3 border-t-2 border-gold">
            <span className="text-base font-extrabold text-text uppercase tracking-wider">
              Total Monthly Cost
            </span>
            <span className="text-lg font-extrabold text-red-400 tabular-nums">
              {fmt(calc.totalMonthlyOp)} EGP
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Analysis */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div
                className={`text-2xl font-extrabold tabular-nums ${
                  calc.monthlyPL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {calc.monthlyPL >= 0 ? '+' : ''}
                {fmt(calc.monthlyPL)}
              </div>
              <div className="text-[0.6rem] text-text3 uppercase tracking-wider">
                monthly profit/loss
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-gold tabular-nums">
                {calc.breakEvenCustomers}
              </div>
              <div className="text-[0.6rem] text-text3 uppercase tracking-wider">
                break-even customers/day
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-extrabold tabular-nums ${
                calc.monthlyPL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {calc.monthlyRevenue > 0
                  ? ((calc.monthlyPL / calc.monthlyRevenue) * 100).toFixed(1)
                  : '0'}%
              </div>
              <div className="text-[0.6rem] text-text3 uppercase tracking-wider">
                net margin
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} />
                <YAxis
                  tick={{ fill: '#888', fontSize: 11 }}
                  axisLine={false}
                  tickFormatter={(v: number) => fmtK(v)}
                />
                <Tooltip
                  formatter={(value) => [fmt(Number(value)) + ' EGP', '']}
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#ccc',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  {chartData.map((_entry, index) => (
                    <Cell key={index} fill={chartColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Comparison */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-text">
            <span>Scenario Comparison</span>
            <Button
              variant="outline"
              size="sm"
              onClick={saveSnapshot}
              className="border-border text-text2"
            >
              <Save size={14} className="mr-1" />
              Save Plan A
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {snapshot ? (
            <div className="space-y-2">
              <div className="text-xs text-text3 mb-3">
                Saved: {snapshot.savedAt}
              </div>
              <DeltaBadge label="Revenue" current={calc.monthlyRevenue} previous={snapshot.monthlyRevenue} />
              <DeltaBadge label="Total Cost" current={calc.totalMonthlyOp} previous={snapshot.totalMonthlyOp} />
              <DeltaBadge label="Profit/Loss" current={calc.monthlyPL} previous={snapshot.monthlyPL} />
              <DeltaBadge label="Rent" current={monthlyRent} previous={snapshot.rent} />
              <DeltaBadge label="Labor" current={calc.totalLabor} previous={snapshot.labor} />
              <DeltaBadge label="Supplies" current={calc.totalSupplies} previous={snapshot.supplies} />
              <DeltaBadge label="Break-even" current={calc.breakEvenCustomers} previous={snapshot.breakEvenCustomers} />
            </div>
          ) : (
            <div className="text-center text-text3 text-sm py-6">
              Save a snapshot to compare different scenarios.
              <br />
              <span className="text-xs">
                Adjust costs/revenue, then save to see deltas.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
