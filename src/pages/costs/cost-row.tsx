import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { Input } from '@/components/ui/input';
import { fmt } from '@/lib/format';

export function CostRow({
  label,
  storeKey,
  tip,
}: {
  label: string;
  storeKey: keyof PlanState;
  tip?: string;
}) {
  const value = usePlanStore((s) => s[storeKey] as number);
  const set = usePlanStore((s) => s.set);

  return (
    <div className="flex items-center justify-between py-2 border-b border-border text-sm">
      <span className="text-text2 flex-1" title={tip}>
        {label}
      </span>
      <Input
        type="number"
        inputMode="numeric"
        value={value || ''}
        onChange={(e) => set({ [storeKey]: Number(e.target.value) || 0 })}
        className="w-24 text-right bg-bg border-border text-sm h-8"
      />
      <span className="w-20 text-right text-gold font-semibold text-sm tabular-nums">
        {fmt(value)}
      </span>
    </div>
  );
}

export function CostCategory({
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
        <h3 className="text-sm font-bold text-text uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-sm font-bold text-gold tabular-nums">
          {fmt(subtotal)}
        </span>
      </div>
      {children}
    </div>
  );
}
