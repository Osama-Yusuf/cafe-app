import { useCalc } from '@/hooks/use-calc';
import { usePlanStore } from '@/stores/plan-store';
import { fmtK, fmt } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#131313] rounded-xl p-5 text-center border border-[#252525]">
      <div className="text-2xl font-extrabold tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[0.6rem] text-[#6b6158] uppercase tracking-widest mt-2">{label}</div>
    </div>
  );
}

export function DashboardPage() {
  const calc = useCalc();
  const { cafeName, monthlyRent, opMarketing } = usePlanStore();

  const pieData = [
    { name: 'Rent', value: monthlyRent, color: '#c75b3a' },
    { name: 'Labor', value: calc.totalLabor, color: '#d4a54a' },
    { name: 'Supplies', value: calc.totalSupplies, color: '#c08b5c' },
    { name: 'Marketing', value: opMarketing, color: '#5ba872' },
    { name: 'Other', value: calc.fixedCosts - opMarketing, color: '#5b8fc7' },
  ].filter(d => d.value > 0);

  return (
    <div>
      <p className="text-xs text-[#d4a54a] font-semibold tracking-widest uppercase mb-1 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#d4a54a] animate-pulse" />
        {cafeName} — Business Plan
      </p>
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#d4a54a] mb-1">
        {cafeName}
      </h1>
      <p className="text-[#a09889] text-sm mb-8 max-w-lg">
        Your specialty café business planner. Every number is editable. Every calculation updates live.
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <MetricCard label="Total Startup Cost" value={calc.fmt.totalStartup} color="#d4a54a" />
        <MetricCard label="Monthly Operating Cost" value={calc.fmt.totalMonthlyOp} color="#c08b5c" />
        <MetricCard label="Monthly Revenue Est." value={calc.fmt.monthlyRevenue} color="#5ba872" />
        <MetricCard label="Monthly Profit/Loss" value={calc.fmt.monthlyPL} color={calc.monthlyPL >= 0 ? '#5ba872' : '#c75b3a'} />
        <MetricCard label="Break-even Customers/Day" value={String(calc.breakEvenCustomers)} color="#5b8fc7" />
        <MetricCard label="Months to Save Target" value={calc.savMonths >= 240 ? '240+' : String(calc.savMonths)} color="#9b7dd4" />
      </div>

      {/* Cost Pie Chart */}
      <h3 className="text-sm font-bold text-[#a09889] mb-3">Where Your Money Goes (Monthly)</h3>
      <Card className="mb-8 bg-[#181818] border-[#252525]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-8 flex-wrap justify-center">
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(value) => fmt(Number(value)) + ' EGP'}
                    contentStyle={{ background: '#131313', border: '1px solid #252525', borderRadius: 8, fontSize: 12, color: '#ece5db' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {pieData.map((d) => {
                const pct = calc.totalMonthlyOp > 0 ? (d.value / calc.totalMonthlyOp * 100).toFixed(0) : '0';
                return (
                  <div key={d.name} className="flex items-center gap-2.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                    <span className="text-[#a09889]">{d.name} ({pct}%)</span>
                    <span className="ml-auto text-[#d4a54a] font-semibold tabular-nums">{fmtK(d.value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Context */}
      <h3 className="text-sm font-bold text-[#a09889] mb-3">Egypt Market Context</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { val: '2×', desc: 'Coffee consumption doubled in 5 years', color: '#d4a54a' },
          { val: 'Top 3', desc: 'Fastest-growing coffee market in MENA', color: '#5ba872' },
          { val: '110M', desc: 'Population, 60% reaching middle-class', color: '#5b8fc7' },
          { val: 'Under 35', desc: 'Young see coffee as lifestyle', color: '#c08b5c' },
        ].map((m) => (
          <div key={m.val} className="bg-[#181818] border border-[#252525] rounded-xl p-4 text-center">
            <div className="text-2xl font-extrabold" style={{ color: m.color }}>{m.val}</div>
            <p className="text-xs text-[#a09889] mt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 pt-4 border-t border-[#252525] flex justify-between items-center">
        <span className="text-xs text-[#6b6158]">
          Built by <a href="mailto:osama9mohamed5@gmail.com" className="text-[#d4a54a] hover:opacity-70 transition-opacity">Osama Yusuf</a>
        </span>
        <span className="text-[0.6rem] text-[#333] tracking-wide">&copy; 2026</span>
      </div>
    </div>
  );
}
