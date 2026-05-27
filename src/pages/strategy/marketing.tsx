import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { fmt } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableNumber } from '@/components/ui/editable-number';
import { MarketingChannels } from './marketing-channels';

function BudgetRow({ label, storeKey }: { label: string; storeKey: keyof PlanState }) {
  const value = usePlanStore((s) => s[storeKey] as number);
  const set = usePlanStore((s) => s.set);

  return (
    <div className="flex items-center justify-between py-2 border-b border-border text-sm">
      <span className="text-text2 flex-1">{label}</span>
      <EditableNumber
        value={value}
        onChange={(v) => set({ [storeKey]: v })}
        size="sm"
      />
    </div>
  );
}

function BudgetAllocation() {
  const mktSocial = usePlanStore((s) => s.mktSocial);
  const mktInfluencer = usePlanStore((s) => s.mktInfluencer);
  const mktContent = usePlanStore((s) => s.mktContent);
  const mktSEO = usePlanStore((s) => s.mktSEO);
  const mktEvents = usePlanStore((s) => s.mktEvents);
  const mktPrint = usePlanStore((s) => s.mktPrint);
  const opMarketing = usePlanStore((s) => s.opMarketing);

  const total = mktSocial + mktInfluencer + mktContent + mktSEO + mktEvents + mktPrint;
  const matches = total === opMarketing;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text">Budget Allocation</h3>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text text-sm">Marketing Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetRow label="Social Media Ads" storeKey="mktSocial" />
          <BudgetRow label="Influencer Collaborations" storeKey="mktInfluencer" />
          <BudgetRow label="Content Creation" storeKey="mktContent" />
          <BudgetRow label="Google Maps / Local SEO" storeKey="mktSEO" />
          <BudgetRow label="Events & Tastings" storeKey="mktEvents" />
          <BudgetRow label="Print" storeKey="mktPrint" />

          <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gold/30">
            <span className="text-sm font-bold text-text uppercase tracking-wider">Total</span>
            <span className="text-base font-extrabold text-gold tabular-nums">
              {fmt(total)} EGP
            </span>
          </div>

          <div className={`text-xs mt-2 ${matches ? 'text-green-400' : 'text-red-400'}`}>
            {matches
              ? 'Matches your P&L marketing line item.'
              : `P&L marketing is ${fmt(opMarketing)} EGP — difference of ${fmt(Math.abs(total - opMarketing))} EGP.`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Marketing() {
  return (
    <div className="space-y-8">
      <BudgetAllocation />
      <MarketingChannels />
    </div>
  );
}
