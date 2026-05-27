import { usePlanStore } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostRow, CostCategory } from './cost-row';

export function Startup() {
  const depositMonths = usePlanStore((s) => s.depositMonths);
  const monthlyRent = usePlanStore((s) => s.monthlyRent);
  const calc = useCalc();

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Startup Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <CostCategory title="Equipment" subtotal={calc.eqTotal}>
            <CostRow label="Espresso Machine" storeKey="eqEspresso" tip="La Marzocca / Victoria Arduino range" />
            <CostRow label="Grinders" storeKey="eqGrinders" tip="EK43 or Mahlkonig" />
            <CostRow label="Water Filtration" storeKey="eqWater" />
            <CostRow label="Fridge / Freezer" storeKey="eqFridge" />
            <CostRow label="Ice Machine" storeKey="eqIce" />
            <CostRow label="Blenders" storeKey="eqBlenders" />
            <CostRow label="Pour-over Setup" storeKey="eqPourover" />
            <CostRow label="Cold Brew System" storeKey="eqColdbrew" />
          </CostCategory>

          <CostCategory title="Space & Fitout" subtotal={calc.spTotal}>
            <CostRow label="Renovation" storeKey="spRenovation" />
            <CostRow label="Furniture" storeKey="spFurniture" />
            <CostRow label="Lighting" storeKey="spLighting" />
            <CostRow label="Signage" storeKey="spSignage" />
            <CostRow label="POS Hardware" storeKey="spPOS" />
            <CostRow label="AC System" storeKey="spAC" />
            <CostRow label="Sound System" storeKey="spSound" />
          </CostCategory>

          <CostCategory title="Launch" subtotal={calc.laTotal}>
            <CostRow label="Branding & Design" storeKey="laBrand" />
            <CostRow label="Opening Inventory" storeKey="laInventory" />
            <CostRow label="Marketing Launch" storeKey="laMarketing" />
            <CostRow label="Photography" storeKey="laPhoto" />
          </CostCategory>

          <CostCategory title="Legal" subtotal={calc.lgTotal}>
            <CostRow label="Licenses & Permits" storeKey="lgLicense" />
            <CostRow label="Lawyer Fees" storeKey="lgLawyer" />
          </CostCategory>

          <CostCategory title="Rent & Entry" subtotal={calc.deposit}>
            <CostRow label="Monthly Rent" storeKey="monthlyRent" />
            <CostRow label="Deposit Months" storeKey="depositMonths" tip="Number of months upfront" />
            <div className="flex items-center justify-between py-2 border-b border-border text-sm">
              <span className="text-text3 flex-1 italic">Deposit Total (Rent x Months)</span>
              <span className="w-24" />
              <span className="w-20 text-right text-text2 font-semibold text-sm tabular-nums">
                {fmt(monthlyRent * depositMonths)}
              </span>
            </div>
            <CostRow label="Key Money" storeKey="keyMoney" />
          </CostCategory>

          {/* Grand total */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gold">
            <span className="text-base font-extrabold text-text uppercase tracking-wider">
              Total Startup
            </span>
            <span className="text-lg font-extrabold text-gold tabular-nums">
              {fmt(calc.totalStartup)} EGP
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
