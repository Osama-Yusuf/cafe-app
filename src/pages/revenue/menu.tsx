import { usePlanStore } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { EditableNumber } from '@/components/ui/editable-number';

const CATEGORIES = [
  { key: 'hot', label: 'Hot Drinks', color: '#c08b5c' },
  { key: 'cold', label: 'Cold Drinks', color: '#5b8fc7' },
  { key: 'fresh', label: 'Fresh', color: '#5ba872' },
  { key: 'food', label: 'Food', color: '#9b7dd4' },
];

function MenuItemRow({ itemKey, name, price, cost, margin }: {
  itemKey: string; name: string; price: number; cost: number; margin: number;
}) {
  const updateMenuItem = usePlanStore((s) => s.updateMenuItem);

  return (
    <div className="grid grid-cols-[1fr_80px_80px_60px] gap-2 items-center py-2 border-b border-[#252525]/60 hover:bg-[#1e1e1e]/30 transition-colors">
      <span className="text-[#a09889] text-sm">{name}</span>
      <div className="text-right">
        <EditableNumber value={price} onChange={(v) => updateMenuItem(itemKey, { price: v })} size="sm" />
      </div>
      <div className="text-right">
        <EditableNumber value={cost} onChange={(v) => updateMenuItem(itemKey, { cost: v })} size="sm" className="!text-[#a09889]" />
      </div>
      <div className="text-right">
        <span className={`text-xs font-bold tabular-nums ${margin >= 75 ? 'text-[#5ba872]' : margin >= 60 ? 'text-[#d4a54a]' : 'text-[#c75b3a]'}`}>
          {margin.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export function Menu() {
  const calc = useCalc();
  const dailyCustomers = usePlanStore((s) => s.dailyCustomers);
  const avgTicketOverride = usePlanStore((s) => s.avgTicket);
  const set = usePlanStore((s) => s.set);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#d4a54a] font-semibold tracking-widest uppercase mb-1">Products</p>
        <h2 className="text-2xl font-black tracking-tight text-[#ece5db]">Menu & Pricing</h2>
        <p className="text-sm text-[#a09889] mt-1">Click any number to edit. Margins update live.</p>
      </div>

      <Card className="bg-[#181818] border-[#252525]">
        <CardContent className="pt-5">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_80px_60px] gap-2 pb-2 border-b-2 border-[#252525] text-[0.6rem] font-bold text-[#6b6158] uppercase tracking-widest">
            <span>Item</span>
            <span className="text-right">Sell</span>
            <span className="text-right">Cost</span>
            <span className="text-right">Margin</span>
          </div>

          {CATEGORIES.map((cat) => {
            const items = calc.menuMargins.filter((m) => m.category === cat.key);
            if (items.length === 0) return null;
            return (
              <div key={cat.key}>
                <div className="flex items-center gap-2 pt-4 pb-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cat.color }}>{cat.label}</span>
                </div>
                {items.map((item) => (
                  <MenuItemRow key={item.key} itemKey={item.key} name={item.name} price={item.price} cost={item.cost} margin={item.margin} />
                ))}
              </div>
            );
          })}

          {/* Average margin */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-[#d4a54a]/30">
            <span className="text-xs font-bold text-[#ece5db] uppercase tracking-widest">Average Margin</span>
            <span className="text-lg font-extrabold text-[#d4a54a] tabular-nums">{calc.avgMargin.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Projection */}
      <Card className="bg-[#181818] border-[#252525]">
        <CardContent className="pt-5">
          <h3 className="text-sm font-bold text-[#ece5db] mb-4">Revenue Projection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-between py-2 border-b border-[#252525]">
              <span className="text-[#a09889] text-sm">Daily Customers</span>
              <EditableNumber value={dailyCustomers} onChange={(v) => set({ dailyCustomers: v })} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#252525]">
              <span className="text-[#a09889] text-sm">Avg Ticket</span>
              <EditableNumber
                value={avgTicketOverride || calc.avgTicket}
                onChange={(v) => set({ avgTicket: v })}
                suffix=" EGP"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-[#252525] rounded-lg overflow-hidden">
            <div className="bg-[#0b0b0b] p-4 text-center">
              <div className="text-xl font-extrabold text-[#d4a54a] tabular-nums">{fmt(calc.avgTicket)}</div>
              <div className="text-[0.55rem] text-[#6b6158] uppercase tracking-wider mt-1">Avg Ticket</div>
            </div>
            <div className="bg-[#0b0b0b] p-4 text-center">
              <div className="text-xl font-extrabold text-[#5ba872] tabular-nums">{fmt(calc.dailyRevenue)}</div>
              <div className="text-[0.55rem] text-[#6b6158] uppercase tracking-wider mt-1">Daily Revenue</div>
            </div>
            <div className="bg-[#0b0b0b] p-4 text-center">
              <div className="text-xl font-extrabold text-[#5ba872] tabular-nums">{fmt(calc.monthlyRevenue)}</div>
              <div className="text-[0.55rem] text-[#6b6158] uppercase tracking-wider mt-1">Monthly Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
