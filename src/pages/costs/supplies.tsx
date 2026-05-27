import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function SupplyRow({
  label,
  qtyKey,
  qtyLabel,
  priceKey,
  priceLabel,
  multiplier = 1,
}: {
  label: string;
  qtyKey: keyof PlanState;
  qtyLabel: string;
  priceKey: keyof PlanState;
  priceLabel: string;
  multiplier?: number;
}) {
  const qty = usePlanStore((s) => s[qtyKey] as number);
  const price = usePlanStore((s) => s[priceKey] as number);
  const set = usePlanStore((s) => s.set);
  const monthly = qty * price * multiplier;

  return (
    <div className="grid grid-cols-[1fr_80px_80px_90px] gap-2 items-center py-1.5 border-b border-border text-sm">
      <span className="text-text2">{label}</span>
      <div className="relative">
        <Input
          type="number"
          inputMode="numeric"
          value={qty || ''}
          onChange={(e) => set({ [qtyKey]: Number(e.target.value) || 0 })}
          className="h-7 text-right bg-bg border-border text-xs pr-1"
        />
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[0.6rem] text-text3 pointer-events-none">
          {qtyLabel}
        </span>
      </div>
      <div className="relative">
        <Input
          type="number"
          inputMode="numeric"
          value={price || ''}
          onChange={(e) => set({ [priceKey]: Number(e.target.value) || 0 })}
          className="h-7 text-right bg-bg border-border text-xs pr-1"
        />
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[0.6rem] text-text3 pointer-events-none">
          {priceLabel}
        </span>
      </div>
      <span className="text-right text-gold font-semibold tabular-nums">{fmt(monthly)}</span>
    </div>
  );
}

function SimpleRow({
  label,
  storeKey,
}: {
  label: string;
  storeKey: keyof PlanState;
}) {
  const value = usePlanStore((s) => s[storeKey] as number);
  const set = usePlanStore((s) => s.set);

  return (
    <div className="grid grid-cols-[1fr_80px_80px_90px] gap-2 items-center py-1.5 border-b border-border text-sm">
      <span className="text-text2">{label}</span>
      <span />
      <Input
        type="number"
        inputMode="numeric"
        value={value || ''}
        onChange={(e) => set({ [storeKey]: Number(e.target.value) || 0 })}
        className="h-7 text-right bg-bg border-border text-xs"
      />
      <span className="text-right text-gold font-semibold tabular-nums">{fmt(value)}</span>
    </div>
  );
}

function SupplyCategory({
  title,
  subtotal,
  children,
}: {
  title: string;
  subtotal: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-gold/30">
        <h3 className="text-sm font-bold text-text uppercase tracking-wider">{title}</h3>
        <span className="text-sm font-bold text-gold tabular-nums">{fmt(subtotal)}/mo</span>
      </div>
      <div className="grid grid-cols-[1fr_80px_80px_90px] gap-2 mb-1">
        <span className="text-[0.6rem] text-text3 font-semibold uppercase">Item</span>
        <span className="text-[0.6rem] text-text3 font-semibold uppercase text-right">Qty</span>
        <span className="text-[0.6rem] text-text3 font-semibold uppercase text-right">Price</span>
        <span className="text-[0.6rem] text-text3 font-semibold uppercase text-right">Monthly</span>
      </div>
      {children}
    </div>
  );
}

export function Supplies() {
  const calc = useCalc();

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Monthly Supplies</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplyCategory title="Coffee Beans" subtotal={calc.supCoffee}>
            <SupplyRow
              label="Espresso Blend"
              qtyKey="supEspressoKg"
              qtyLabel="kg"
              priceKey="supEspressoPrice"
              priceLabel="/kg"
            />
            <SupplyRow
              label="Single Origin"
              qtyKey="supOriginKg"
              qtyLabel="kg"
              priceKey="supOriginPrice"
              priceLabel="/kg"
            />
            <SupplyRow
              label="Decaf"
              qtyKey="supDecafKg"
              qtyLabel="kg"
              priceKey="supDecafPrice"
              priceLabel="/kg"
            />
          </SupplyCategory>

          <SupplyCategory title="Milk" subtotal={calc.supMilk}>
            <SupplyRow
              label="Full Fat Milk"
              qtyKey="supFullMilkL"
              qtyLabel="L/d"
              priceKey="supFullMilkPrice"
              priceLabel="/L"
              multiplier={30}
            />
            <SupplyRow
              label="Oat Milk"
              qtyKey="supOatMilkL"
              qtyLabel="L/d"
              priceKey="supOatMilkPrice"
              priceLabel="/L"
              multiplier={30}
            />
            <SupplyRow
              label="Almond Milk"
              qtyKey="supAlmondMilkL"
              qtyLabel="L/d"
              priceKey="supAlmondMilkPrice"
              priceLabel="/L"
              multiplier={30}
            />
          </SupplyCategory>

          <SupplyCategory title="Syrups & Flavors" subtotal={calc.supSyrups}>
            <SimpleRow label="Vanilla Syrup" storeKey="supVanilla" />
            <SimpleRow label="Caramel Syrup" storeKey="supCaramel" />
            <SimpleRow label="Hazelnut Syrup" storeKey="supHazelnut" />
            <SimpleRow label="Chocolate Sauce" storeKey="supChocolate" />
            <SimpleRow label="Honey" storeKey="supHoney" />
          </SupplyCategory>

          <SupplyCategory title="Disposables" subtotal={calc.supDisp}>
            <SimpleRow label="Hot Cups" storeKey="supHotCups" />
            <SimpleRow label="Cold Cups" storeKey="supColdCups" />
            <SimpleRow label="Napkins" storeKey="supNapkins" />
            <SimpleRow label="Bags" storeKey="supBags" />
            <SimpleRow label="Straws" storeKey="supStraws" />
            <SimpleRow label="Stirrers" storeKey="supStirrers" />
          </SupplyCategory>

          <SupplyCategory title="Food / Bakery" subtotal={calc.supFood}>
            <SupplyRow
              label="Bakery Items"
              qtyKey="supBakeryQty"
              qtyLabel="/day"
              priceKey="supBakeryCost"
              priceLabel="/ea"
              multiplier={30}
            />
          </SupplyCategory>

          {/* Grand total */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gold">
            <span className="text-base font-extrabold text-text uppercase tracking-wider">
              Total Monthly Supplies
            </span>
            <span className="text-lg font-extrabold text-gold tabular-nums">
              {fmt(calc.totalSupplies)} EGP/mo
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
