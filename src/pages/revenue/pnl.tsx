import { useState } from 'react';
import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt, fmtK } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditableNumber } from '@/components/ui/editable-number';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Save, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';

interface PnLSnapshot {
  monthlyRevenue: number;
  totalMonthlyOp: number;
  monthlyPL: number;
  rent: number;
  labor: number;
  supplies: number;
  breakEvenCustomers: number;
  savedAt: string;
}

function OpRow({ label, storeKey }: { label: string; storeKey: keyof PlanState }) {
  const value = usePlanStore((s) => s[storeKey] as number);
  const set = usePlanStore((s) => s.set);
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#252525]/60">
      <span className="text-[#a09889] text-sm">{label}</span>
      <EditableNumber value={value} onChange={(v) => set({ [storeKey]: v })} size="sm" />
    </div>
  );
}

function DeltaBadge({ current, previous, label }: { current: number; previous: number; label: string }) {
  const delta = current - previous;
  const isUp = delta >= 0;
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-[#6b6158]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[#a09889] tabular-nums">{fmt(current)}</span>
        <Badge variant="outline" className={`text-[0.6rem] py-0 h-5 ${isUp ? 'border-[#5ba872]/40 text-[#5ba872]' : 'border-[#c75b3a]/40 text-[#c75b3a]'}`}>
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
    try { return JSON.parse(localStorage.getItem('cafe-pnl-snapshot') || 'null'); } catch { return null; }
  });

  const saveSnapshot = () => {
    const snap: PnLSnapshot = {
      monthlyRevenue: calc.monthlyRevenue, totalMonthlyOp: calc.totalMonthlyOp, monthlyPL: calc.monthlyPL,
      rent: monthlyRent, labor: calc.totalLabor, supplies: calc.totalSupplies,
      breakEvenCustomers: calc.breakEvenCustomers,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    localStorage.setItem('cafe-pnl-snapshot', JSON.stringify(snap));
    setSnapshot(snap);
  };

  const clearSnapshot = () => { localStorage.removeItem('cafe-pnl-snapshot'); setSnapshot(null); };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#d4a54a] font-semibold tracking-widest uppercase mb-1">Financial Engine</p>
        <h2 className="text-2xl font-black tracking-tight text-[#ece5db]">Live P&L Analysis</h2>
        <p className="text-sm text-[#a09889] mt-1">Everything flows here. All values pulled from other pages.</p>
      </div>

      {/* Scenario */}
      <div className="bg-[#181818] border border-[#9b7dd4]/20 rounded-xl p-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <div className="text-sm font-bold text-[#ece5db]">Compare Scenarios</div>
            <div className="text-[0.65rem] text-[#6b6158]">Save current numbers, then change things to see the difference</div>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveSnapshot} size="sm" className="bg-[#9b7dd4] text-[#0b0b0b] hover:bg-[#9b7dd4]/80 text-xs font-semibold">
              <Save size={12} className="mr-1" /> Save Plan A
            </Button>
            {snapshot && <Button onClick={clearSnapshot} variant="ghost" size="sm" className="text-[#6b6158] hover:text-[#c75b3a]"><X size={14} /></Button>}
          </div>
        </div>
        {snapshot && <span className="text-[0.65rem] text-[#9b7dd4] block mt-1">Saved: {snapshot.savedAt}</span>}
      </div>
      {snapshot && (
        <Card className="bg-[#181818] border-[#9b7dd4]/15">
          <CardContent className="pt-4">
            <DeltaBadge label="Revenue" current={calc.monthlyRevenue} previous={snapshot.monthlyRevenue} />
            <DeltaBadge label="Total Cost" current={calc.totalMonthlyOp} previous={snapshot.totalMonthlyOp} />
            <DeltaBadge label="Profit/Loss" current={calc.monthlyPL} previous={snapshot.monthlyPL} />
            <DeltaBadge label="Break-even" current={calc.breakEvenCustomers} previous={snapshot.breakEvenCustomers} />
          </CardContent>
        </Card>
      )}

      {/* Revenue + Costs side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#181818] border-[#252525]">
          <CardContent className="pt-5">
            <h3 className="text-sm font-bold text-[#ece5db] mb-3">Revenue</h3>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#a09889] text-sm">Monthly Revenue</span>
              <span className="text-xl font-extrabold text-[#5ba872] tabular-nums">{fmt(calc.monthlyRevenue)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#181818] border-[#252525]">
          <CardContent className="pt-5">
            <h3 className="text-sm font-bold text-[#ece5db] mb-3">Summary</h3>
            <div className="flex items-center justify-between py-2 border-b border-[#252525]">
              <span className="text-[#a09889] text-sm">Rent</span>
              <span className="text-sm font-semibold text-[#a09889] tabular-nums">{fmt(monthlyRent)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#252525]">
              <span className="text-[#a09889] text-sm">Labor</span>
              <span className="text-sm font-semibold text-[#a09889] tabular-nums">{fmt(calc.totalLabor)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#a09889] text-sm">Supplies</span>
              <span className="text-sm font-semibold text-[#a09889] tabular-nums">{fmt(calc.totalSupplies)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational costs */}
      <Card className="bg-[#181818] border-[#252525]">
        <CardContent className="pt-5">
          <div className="text-[0.6rem] text-[#6b6158] uppercase tracking-widest font-bold mb-3">Operational Costs (click to edit)</div>
          <OpRow label="Utilities" storeKey="opUtilities" />
          <OpRow label="Internet" storeKey="opInternet" />
          <OpRow label="Marketing" storeKey="opMarketing" />
          <OpRow label="Maintenance" storeKey="opMaintenance" />
          <OpRow label="Accounting" storeKey="opAccounting" />
          <OpRow label="Insurance" storeKey="opInsurance" />
          <OpRow label="POS Subscription" storeKey="opPOS" />
          <OpRow label="Miscellaneous" storeKey="opMisc" />
          <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-[#d4a54a]/30">
            <span className="text-xs font-bold text-[#ece5db] uppercase tracking-widest">Total Monthly Cost</span>
            <span className="text-lg font-extrabold text-[#c75b3a] tabular-nums">{fmt(calc.totalMonthlyOp)} EGP</span>
          </div>
        </CardContent>
      </Card>

      {/* Analysis */}
      <div className="grid grid-cols-3 gap-px bg-[#252525] rounded-xl overflow-hidden">
        <div className="bg-[#0b0b0b] p-5 text-center">
          <div className={`text-2xl font-extrabold tabular-nums ${calc.monthlyPL >= 0 ? 'text-[#5ba872]' : 'text-[#c75b3a]'}`}>
            {calc.monthlyPL >= 0 ? '+' : ''}{fmtK(calc.monthlyPL)}
          </div>
          <div className="text-[0.55rem] text-[#6b6158] uppercase tracking-wider mt-1">Profit/Loss</div>
        </div>
        <div className="bg-[#0b0b0b] p-5 text-center">
          <div className="text-2xl font-extrabold text-[#d4a54a] tabular-nums">{calc.breakEvenCustomers}</div>
          <div className="text-[0.55rem] text-[#6b6158] uppercase tracking-wider mt-1">Break-even/day</div>
        </div>
        <div className="bg-[#0b0b0b] p-5 text-center">
          <div className={`text-2xl font-extrabold tabular-nums ${calc.monthlyPL >= 0 ? 'text-[#5ba872]' : 'text-[#c75b3a]'}`}>
            {calc.monthlyRevenue > 0 ? ((calc.monthlyPL / calc.monthlyRevenue) * 100).toFixed(1) : '0'}%
          </div>
          <div className="text-[0.55rem] text-[#6b6158] uppercase tracking-wider mt-1">Net Margin</div>
        </div>
      </div>

      {/* Chart */}
      <Card className="bg-[#181818] border-[#252525]">
        <CardContent className="pt-5">
          <h3 className="text-sm font-bold text-[#ece5db] mb-4">Revenue vs Costs</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Revenue', value: calc.monthlyRevenue }, { name: 'Costs', value: calc.totalMonthlyOp }]} barGap={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
                <XAxis dataKey="name" tick={{ fill: '#6b6158', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#6b6158', fontSize: 11 }} axisLine={false} tickFormatter={(v: number) => fmtK(v)} />
                <Tooltip formatter={(value) => [fmt(Number(value)) + ' EGP', '']} contentStyle={{ backgroundColor: '#131313', border: '1px solid #252525', borderRadius: 8, color: '#ece5db', fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  <Cell fill="#5ba872" />
                  <Cell fill="#c75b3a" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
