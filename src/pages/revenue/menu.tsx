import { usePlanStore } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CATEGORIES: { key: string; label: string; color: string }[] = [
  { key: 'hot', label: 'Hot Drinks', color: 'bg-orange-900/30 text-orange-400 border-orange-800/40' },
  { key: 'cold', label: 'Cold Drinks', color: 'bg-sky-900/30 text-sky-400 border-sky-800/40' },
  { key: 'fresh', label: 'Fresh', color: 'bg-green-900/30 text-green-400 border-green-800/40' },
  { key: 'food', label: 'Food', color: 'bg-amber-900/30 text-amber-400 border-amber-800/40' },
];

function MenuRow({ itemKey, name, price, cost, margin }: {
  itemKey: string;
  name: string;
  price: number;
  cost: number;
  margin: number;
}) {
  const updateMenuItem = usePlanStore((s) => s.updateMenuItem);

  return (
    <tr className="border-b border-border/50 hover:bg-bg2/30">
      <td className="py-2 text-text2">{name}</td>
      <td className="py-2">
        <Input
          type="number"
          inputMode="numeric"
          value={price || ''}
          onChange={(e) => updateMenuItem(itemKey, { price: Number(e.target.value) || 0 })}
          className="h-7 w-20 text-right bg-bg border-border text-xs"
        />
      </td>
      <td className="py-2">
        <Input
          type="number"
          inputMode="numeric"
          value={cost || ''}
          onChange={(e) => updateMenuItem(itemKey, { cost: Number(e.target.value) || 0 })}
          className="h-7 w-20 text-right bg-bg border-border text-xs"
        />
      </td>
      <td className="py-2 text-right tabular-nums">
        <span
          className={`font-semibold text-sm ${
            margin >= 70 ? 'text-green-400' : margin >= 50 ? 'text-gold' : 'text-orange-400'
          }`}
        >
          {margin.toFixed(0)}%
        </span>
      </td>
    </tr>
  );
}

export function Menu() {
  const calc = useCalc();
  const dailyCustomers = usePlanStore((s) => s.dailyCustomers);
  const avgTicketOverride = usePlanStore((s) => s.avgTicket);
  const set = usePlanStore((s) => s.set);

  const menuMargins = calc.menuMargins;

  return (
    <div className="space-y-6">
      {/* Menu Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-text3 font-semibold text-xs uppercase tracking-wider">Item</th>
                  <th className="text-right py-2 text-text3 font-semibold text-xs uppercase tracking-wider">Sell (EGP)</th>
                  <th className="text-right py-2 text-text3 font-semibold text-xs uppercase tracking-wider">Cost (EGP)</th>
                  <th className="text-right py-2 text-text3 font-semibold text-xs uppercase tracking-wider">Margin</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => {
                  const items = menuMargins.filter((m) => m.category === cat.key);
                  if (items.length === 0) return null;
                  return (
                    <CategorySection
                      key={cat.key}
                      label={cat.label}
                      color={cat.color}
                      items={items}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Average margin */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gold">
            <span className="text-sm font-bold text-text uppercase tracking-wider">
              Average Margin
            </span>
            <span className="text-lg font-extrabold text-gold tabular-nums">
              {calc.avgMargin.toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Projection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Revenue Projection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-text3 text-xs mb-1">Daily Customers</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={dailyCustomers || ''}
                onChange={(e) => set({ dailyCustomers: Number(e.target.value) || 0 })}
                className="bg-bg2 border-border text-text"
              />
            </div>
            <div>
              <Label className="text-text3 text-xs mb-1">
                Avg Ticket (EGP){' '}
                <span className="text-text3 font-normal">
                  {avgTicketOverride ? '(manual)' : '(auto-calculated)'}
                </span>
              </Label>
              <Input
                type="number"
                inputMode="numeric"
                value={avgTicketOverride || ''}
                onChange={(e) => set({ avgTicket: Number(e.target.value) || 0 })}
                placeholder={String(calc.avgTicket)}
                className="bg-bg2 border-border text-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-xl font-extrabold text-gold tabular-nums">
                {fmt(calc.avgTicket)}
              </div>
              <div className="text-[0.6rem] text-text3 uppercase tracking-wider">avg ticket</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-extrabold text-gold tabular-nums">
                {fmt(calc.dailyRevenue)}
              </div>
              <div className="text-[0.6rem] text-text3 uppercase tracking-wider">daily revenue</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-extrabold text-gold tabular-nums">
                {fmt(calc.monthlyRevenue)}
              </div>
              <div className="text-[0.6rem] text-text3 uppercase tracking-wider">monthly revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CategorySection({
  label,
  color,
  items,
}: {
  label: string;
  color: string;
  items: { key: string; name: string; price: number; cost: number; margin: number }[];
}) {
  return (
    <>
      <tr>
        <td colSpan={4} className="pt-4 pb-1">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${color}`}>
            {label}
          </span>
        </td>
      </tr>
      {items.map((item) => (
        <MenuRow
          key={item.key}
          itemKey={item.key}
          name={item.name}
          price={item.price}
          cost={item.cost}
          margin={item.margin}
        />
      ))}
    </>
  );
}
