import { useCallback, useMemo } from 'react';
import { useChecklistStore, type ChecklistItem } from '@/stores/checklist-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Plus, Trash2, RotateCcw } from 'lucide-react';
import { fmtPct } from '@/lib/format';

function PhaseStatus({ items }: { items: ChecklistItem[] }) {
  const done = items.filter((i) => i.checked).length;
  const total = items.length;

  if (done === 0) {
    return <Badge variant="secondary" className="text-[0.6rem]">Not Started</Badge>;
  }
  if (done === total) {
    return <Badge className="bg-gold/20 text-gold text-[0.6rem]">Complete</Badge>;
  }
  return (
    <Badge variant="outline" className="border-gold/30 text-gold text-[0.6rem]">
      In Progress
    </Badge>
  );
}

function ChecklistItemRow({
  phase,
  item,
}: {
  phase: number;
  item: ChecklistItem;
}) {
  const { toggleItem, updateItem, removeItem } = useChecklistStore();

  const handleToggle = useCallback(
    () => toggleItem(phase, item.id),
    [phase, item.id, toggleItem]
  );

  const handleTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      updateItem(phase, item.id, { title: e.target.value }),
    [phase, item.id, updateItem]
  );

  const handleDesc = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      updateItem(phase, item.id, { description: e.target.value }),
    [phase, item.id, updateItem]
  );

  const handleRemove = useCallback(
    () => removeItem(phase, item.id),
    [phase, item.id, removeItem]
  );

  return (
    <div className="group flex items-start gap-3 py-2 px-1 rounded-lg hover:bg-bg2/50 transition-colors">
      <div className="pt-1">
        <Checkbox
          checked={item.checked}
          onCheckedChange={handleToggle}
        />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <Input
          value={item.title}
          onChange={handleTitle}
          className={`border-transparent bg-transparent px-1 h-7 text-sm font-medium ${
            item.checked ? 'text-text3 line-through' : 'text-text'
          } focus-visible:bg-bg2 focus-visible:border-border`}
        />
        <Input
          value={item.description}
          onChange={handleDesc}
          className={`border-transparent bg-transparent px-1 h-6 text-xs ${
            item.checked ? 'text-text3/60' : 'text-text3'
          } focus-visible:bg-bg2 focus-visible:border-border`}
        />
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={handleRemove}
        className="opacity-0 group-hover:opacity-100 text-text3 hover:text-destructive transition-opacity shrink-0 mt-1"
      >
        <Trash2 size={12} />
      </Button>
    </div>
  );
}

function PhaseCard({ phaseNum }: { phaseNum: number }) {
  const phase = useChecklistStore((s) => s.phases[phaseNum]);
  const isOpen = useChecklistStore((s) => s.openPhases[phaseNum] || false);
  const { togglePhase, addItem } = useChecklistStore();

  const handleToggle = useCallback(() => togglePhase(phaseNum), [phaseNum, togglePhase]);
  const handleAdd = useCallback(() => addItem(phaseNum), [phaseNum, addItem]);

  if (!phase) return null;

  const done = phase.items.filter((i) => i.checked).length;
  const total = phase.items.length;
  const phasePct = total > 0 ? (done / total) * 100 : 0;

  return (
    <Card className="bg-card border-border overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg2/50 transition-colors cursor-pointer"
      >
        <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: phase.color }} />
        {isOpen ? (
          <ChevronDown size={16} className="text-text3 shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-text3 shrink-0" />
        )}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text">{phase.name}</span>
            <span className="text-xs text-text3">{phase.subtitle}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-bg2 rounded-full overflow-hidden max-w-[120px]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${phasePct}%`, backgroundColor: phase.color }}
              />
            </div>
            <span className="text-[0.6rem] text-text3 tabular-nums">
              {done}/{total}
            </span>
          </div>
        </div>
        <PhaseStatus items={phase.items} />
      </button>

      {isOpen && (
        <CardContent className="pt-0 pb-3">
          <div className="border-t border-border pt-2 space-y-0">
            {phase.items.map((item) => (
              <ChecklistItemRow key={item.id} phase={phaseNum} item={item} />
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdd}
            className="mt-2 text-text3 hover:text-gold"
          >
            <Plus size={14} />
            Add item
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export function Checklist() {
  const phases = useChecklistStore((s) => s.phases);
  const resetToDefaults = useChecklistStore((s) => s.resetToDefaults);

  const { totalItems, checkedItems, overallPct } = useMemo(() => {
    let total = 0;
    let checked = 0;
    Object.values(phases).forEach((p) => {
      total += p.items.length;
      checked += p.items.filter((i) => i.checked).length;
    });
    return {
      totalItems: total,
      checkedItems: checked,
      overallPct: total > 0 ? (checked / total) * 100 : 0,
    };
  }, [phases]);

  const phaseNums = Object.keys(phases).map(Number).sort();

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-text">
            <span>Overall Progress</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="text-text3 hover:text-destructive"
            >
              <RotateCcw size={14} />
              Reset
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-text3 mb-1">
                <span>{checkedItems} of {totalItems} tasks</span>
                <span className="text-gold font-semibold">{fmtPct(overallPct)}</span>
              </div>
              <div className="h-2 bg-bg2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-700"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase cards */}
      {phaseNums.map((num) => (
        <PhaseCard key={num} phaseNum={num} />
      ))}
    </div>
  );
}
