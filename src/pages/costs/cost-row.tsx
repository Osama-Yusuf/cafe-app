import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { EditableNumber } from '@/components/ui/editable-number';
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
    <div className="flex items-center justify-between py-2.5 border-b border-[#252525] text-sm group">
      <span className="text-[#a09889] flex-1" title={tip}>
        {label}
      </span>
      <EditableNumber
        value={value}
        onChange={(v) => set({ [storeKey]: v })}
        size="sm"
      />
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
      <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-[#d4a54a]/30">
        <h3 className="text-xs font-bold text-[#ece5db] uppercase tracking-widest">
          {title}
        </h3>
        <span className="text-sm font-bold text-[#d4a54a] tabular-nums">
          {fmt(subtotal)}
        </span>
      </div>
      {children}
    </div>
  );
}
