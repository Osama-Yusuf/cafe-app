import { useCallback, useMemo } from 'react';
import { usePlanStore } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt, fmtK, fmtPct } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EditableNumber } from '@/components/ui/editable-number';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, TrendingUp, Target } from 'lucide-react';

function MilestoneRow({ logTotal, target }: { logTotal: number; target: number }) {
  const milestones = [25, 50, 75, 100];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {milestones.map((m) => {
        const mTarget = target * (m / 100);
        const reached = logTotal >= mTarget;
        return (
          <div
            key={m}
            className={`rounded-lg p-3 text-center border ${
              reached ? 'border-gold/30 bg-gold-glow' : 'border-border bg-bg2'
            }`}
          >
            <div className={`text-lg font-extrabold ${reached ? 'text-gold' : 'text-text3'}`}>
              {m}%
            </div>
            <div className="text-[0.6rem] text-text3 uppercase tracking-wider mt-0.5">
              {fmtK(mTarget)}
            </div>
            <Badge
              variant={reached ? 'default' : 'secondary'}
              className={`mt-1 text-[0.55rem] ${reached ? 'bg-gold/20 text-gold' : ''}`}
            >
              {reached ? 'Reached' : 'Pending'}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

function LogEntryRow({
  index,
  entry,
  partnerNames,
  showRental,
}: {
  index: number;
  entry: { month: string; entries: Record<number, number>; rental: number };
  partnerNames: string[];
  showRental: boolean;
}) {
  const { removeLogEntry, updateLogEntry } = usePlanStore();

  const handleMonth = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updateLogEntry(index, 'month', e.target.value),
    [index, updateLogEntry]
  );

  const handlePartner = useCallback(
    (partnerIdx: number, val: number) => updateLogEntry(index, partnerIdx, val),
    [index, updateLogEntry]
  );

  const handleRental = useCallback(
    (v: number) => updateLogEntry(index, 'rental', v),
    [index, updateLogEntry]
  );

  const handleRemove = useCallback(() => removeLogEntry(index), [index, removeLogEntry]);

  const rowTotal = useMemo(() => {
    let t = 0;
    Object.values(entry.entries || {}).forEach((v) => {
      t += v || 0;
    });
    t += entry.rental || 0;
    return t;
  }, [entry]);

  return (
    <tr className="border-b border-border/50 hover:bg-bg2/50 transition-colors">
      <td className="py-2 px-2">
        <Input
          type="month"
          value={entry.month}
          onChange={handleMonth}
          className="bg-bg2 border-border text-text text-xs w-[130px]"
        />
      </td>
      {partnerNames.map((_, pi) => (
        <td key={pi} className="py-2 px-1">
          <EditableNumber
            value={entry.entries[pi] || 0}
            onChange={(v) => handlePartner(pi, v)}
            size="sm"
          />
        </td>
      ))}
      {showRental && (
        <td className="py-2 px-1">
          <EditableNumber
            value={entry.rental || 0}
            onChange={handleRental}
            size="sm"
          />
        </td>
      )}
      <td className="py-2 px-2 text-sm font-semibold text-gold tabular-nums text-right">
        {fmt(rowTotal)}
      </td>
      <td className="py-2 px-1">
        <Button variant="ghost" size="icon-xs" onClick={handleRemove} className="text-text3 hover:text-destructive">
          <Trash2 size={12} />
        </Button>
      </td>
    </tr>
  );
}

export function SavingsLog() {
  const { savingsLog, partners, hasRentalIncome, rentalPhase, savingsTarget, addLogEntry } =
    usePlanStore();
  const calc = useCalc();

  const showRental = hasRentalIncome && rentalPhase === 'own';
  const partnerNames = partners.map((p) => p.name);

  const actualMonthlyAvg = useMemo(() => {
    if (savingsLog.length === 0) return 0;
    let total = 0;
    savingsLog.forEach((e) => {
      Object.values(e.entries || {}).forEach((v) => {
        total += v || 0;
      });
      total += e.rental || 0;
    });
    return total / savingsLog.length;
  }, [savingsLog]);

  const progressBarPct = Math.min(calc.logPct, 100);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text">
            <Target size={16} className="text-gold" />
            Savings Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-xs text-text3 mb-1">
            <span>{fmtK(calc.logTotal)} saved</span>
            <span>{fmtK(savingsTarget)} target</span>
          </div>
          <div className="relative h-3 bg-bg2 rounded-full overflow-hidden border border-border">
            <div
              className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all duration-700"
              style={{ width: `${progressBarPct}%` }}
            />
            {[25, 50, 75].map((m) => (
              <div
                key={m}
                className="absolute top-0 bottom-0 w-px bg-text3/30"
                style={{ left: `${m}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[0.55rem] text-text3 mt-1 px-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <div className="text-center mt-3">
            <span className="text-2xl font-extrabold text-gold">{fmtPct(calc.logPct)}</span>
            <span className="text-text3 text-xs ml-2">complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text">Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <MilestoneRow logTotal={calc.logTotal} target={savingsTarget} />
        </CardContent>
      </Card>

      {/* Plan vs Actual */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text">
            <TrendingUp size={16} className="text-gold" />
            Plan vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg2 rounded-lg p-4 text-center">
              <div className="text-lg font-extrabold text-text2">{fmt(calc.effectiveMonthly)}</div>
              <div className="text-[0.6rem] text-text3 uppercase tracking-wider mt-1">planned/month</div>
            </div>
            <div className="bg-bg2 rounded-lg p-4 text-center">
              <div className={`text-lg font-extrabold ${actualMonthlyAvg >= calc.effectiveMonthly ? 'text-gold' : 'text-destructive'}`}>
                {fmt(Math.round(actualMonthlyAvg))}
              </div>
              <div className="text-[0.6rem] text-text3 uppercase tracking-wider mt-1">actual avg/month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly log table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-text">
            <span>Monthly Log</span>
            <Button variant="outline" size="sm" className="border-border text-text2" onClick={addLogEntry}>
              <Plus size={14} />
              Add Month
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savingsLog.length === 0 ? (
            <div className="text-center py-8 text-text3 text-sm">
              No entries yet. Click "Add Month" to start tracking.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-border text-text3 text-xs uppercase tracking-wider">
                    <th className="py-2 px-2 text-left font-semibold">Month</th>
                    {partnerNames.map((name, i) => (
                      <th key={i} className="py-2 px-1 text-center font-semibold">
                        {name}
                      </th>
                    ))}
                    {showRental && <th className="py-2 px-1 text-center font-semibold">Rental</th>}
                    <th className="py-2 px-2 text-right font-semibold">Total</th>
                    <th className="py-2 px-1 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {savingsLog.map((entry, i) => (
                    <LogEntryRow
                      key={i}
                      index={i}
                      entry={entry}
                      partnerNames={partnerNames}
                      showRental={showRental}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
