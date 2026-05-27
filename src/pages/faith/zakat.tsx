import { useState } from 'react';
import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

function ZakatInput({ label, storeKey }: { label: string; storeKey: keyof PlanState }) {
  const value = usePlanStore((s) => s[storeKey] as number);
  const set = usePlanStore((s) => s.set);

  return (
    <div className="flex items-center justify-between py-2 border-b border-border text-sm">
      <span className="text-text2 flex-1">{label}</span>
      <Input
        type="number"
        inputMode="numeric"
        value={value || ''}
        onChange={(e) => set({ [storeKey]: Number(e.target.value) || 0 })}
        className="w-28 text-right bg-bg border-border text-sm h-8"
      />
    </div>
  );
}

function ZakatResults() {
  const { zkNet, zkDue } = useCalc();
  const zkNisab = usePlanStore((s) => s.zkNisab);
  const meetsNisab = zkNet >= zkNisab;
  const monthly = zkDue / 12;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-text">Zakat Calculation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-bg2 border border-border">
            <div className="text-xs text-text3 uppercase tracking-wider mb-1">Net Zakatable Assets</div>
            <div className="text-xl font-extrabold text-text tabular-nums">{fmt(zkNet)} EGP</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-bg2 border border-border">
            <div className="text-xs text-text3 uppercase tracking-wider mb-1">Nisab Threshold</div>
            <div className={`text-xl font-extrabold tabular-nums ${meetsNisab ? 'text-gold' : 'text-text3'}`}>
              {fmt(zkNisab)} EGP
            </div>
          </div>
        </div>

        <div className={`text-center text-sm py-2 px-4 rounded-lg ${
          meetsNisab
            ? 'bg-gold/10 border border-gold/20 text-gold'
            : 'bg-bg2 border border-border text-text3'
        }`}>
          {meetsNisab
            ? 'Net assets exceed nisab — zakat is due.'
            : 'Net assets below nisab — no zakat due at this time.'}
        </div>

        <div className="text-center py-6">
          <div className="text-xs text-text3 uppercase tracking-wider mb-2">Annual Zakat Due (2.5%)</div>
          <div className="text-4xl font-extrabold text-gold tabular-nums">
            {fmt(zkDue)} EGP
          </div>
        </div>

        <div className="text-center p-4 rounded-lg bg-bg2 border border-border">
          <div className="text-xs text-text3 uppercase tracking-wider mb-1">Monthly Set-Aside</div>
          <div className="text-lg font-bold text-text2 tabular-nums">{fmt(Math.round(monthly))} EGP/mo</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ImportantNotes() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-text">
          <span>Important Notes</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
            className="text-text3 h-7 w-7 p-0"
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2 text-sm text-text2">
            <span className="text-gold shrink-0 font-bold">1.</span>
            <span>This is a simplified calculator for planning purposes only.</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-text2">
            <span className="text-gold shrink-0 font-bold">2.</span>
            <span>Consult a qualified scholar for your specific situation — business zakat has nuances.</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-text2">
            <span className="text-gold shrink-0 font-bold">3.</span>
            <span>Paying zakat in Ramadan carries extra reward, but it is due when one lunar year passes on your wealth reaching nisab.</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function Zakat() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text">Zakat Calculator</h3>
      <p className="text-sm text-text3">
        Calculate your business zakat based on assets, debts, and the nisab threshold.
      </p>

      {/* Inputs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text text-sm">Zakatable Assets & Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-text3 uppercase tracking-wider font-semibold mb-2">Assets</div>
          <ZakatInput label="Cash in bank" storeKey="zkCash" />
          <ZakatInput label="Inventory value (at cost)" storeKey="zkInventory" />
          <ZakatInput label="Receivables" storeKey="zkReceivables" />

          <div className="text-xs text-text3 uppercase tracking-wider font-semibold mt-4 mb-2">Deductions</div>
          <ZakatInput label="Debts owed" storeKey="zkDebts" />
          <ZakatInput label="Expenses due" storeKey="zkExpenses" />

          <div className="text-xs text-text3 uppercase tracking-wider font-semibold mt-4 mb-2">Threshold</div>
          <ZakatInput label="Nisab threshold" storeKey="zkNisab" />
        </CardContent>
      </Card>

      {/* Results */}
      <ZakatResults />

      {/* Notes */}
      <ImportantNotes />
    </div>
  );
}
