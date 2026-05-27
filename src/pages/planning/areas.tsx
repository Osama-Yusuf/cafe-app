import { useCallback, useMemo } from 'react';
import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt, fmtK } from '@/lib/format';
import { AREA_DEFAULTS, type Area } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Plus, Trash2, RotateCcw } from 'lucide-react';

function BudgetBar({ areas }: { areas: Area[] }) {
  const sorted = useMemo(
    () => [...areas].sort((a, b) => a.budgetMin - b.budgetMin),
    [areas]
  );
  const maxBudget = sorted.length > 0 ? sorted[sorted.length - 1].budgetMin : 1;

  return (
    <div className="space-y-2">
      {sorted.map((area) => {
        const pct = maxBudget > 0 ? (area.budgetMin / maxBudget) * 100 : 0;
        return (
          <div key={area.id} className="flex items-center gap-3">
            <span className="text-xs text-text2 w-28 truncate shrink-0">{area.name}</span>
            <div className="flex-1 h-2 bg-bg2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold/70 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-text3 tabular-nums shrink-0 w-16 text-right">
              {area.budgetMin}M+
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AreaCard({
  area,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
}: {
  area: Area;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (field: keyof Area, value: string | number) => void;
}) {
  return (
    <Card className={`bg-card border-border relative ${isSelected ? 'ring-1 ring-gold/40' : ''}`}>
      {isSelected && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-gold/20 text-gold text-[0.6rem]">
            <CheckCircle size={10} className="mr-1" />
            Selected
          </Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-text text-sm pr-16">
          <Input
            value={area.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="border-transparent bg-transparent px-0 h-auto text-sm font-semibold text-text focus-visible:bg-bg2 focus-visible:border-border focus-visible:px-2"
          />
          <Input
            value={area.tagline}
            onChange={(e) => onUpdate('tagline', e.target.value)}
            className="border-transparent bg-transparent px-0 h-auto text-xs text-text3 font-normal mt-0.5 focus-visible:bg-bg2 focus-visible:border-border focus-visible:px-2"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-text3 text-[0.6rem] uppercase tracking-wider">Rent/mo</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={area.defaultRent || ''}
                onChange={(e) => onUpdate('defaultRent', Number(e.target.value) || 0)}
                className="bg-bg2 border-border text-text text-xs mt-0.5"
              />
            </div>
            <div>
              <Label className="text-text3 text-[0.6rem] uppercase tracking-wider">Key Money</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={area.defaultKeyMoney || ''}
                onChange={(e) => onUpdate('defaultKeyMoney', Number(e.target.value) || 0)}
                className="bg-bg2 border-border text-text text-xs mt-0.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="text-text3">Budget Range</div>
            <div className="text-text2 text-right">{area.budgetRange}</div>
            <div className="text-text3">Rent Range</div>
            <div className="text-text2 text-right">{area.rentRange}</div>
            <div className="text-text3">Key Money</div>
            <div className="text-text2 text-right">{area.keyMoneyRange}</div>
          </div>

          <div>
            <span className="text-[0.6rem] text-text3 uppercase tracking-wider">Best Spots</span>
            <p className="text-xs text-text2 mt-0.5">{area.bestSpots}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gold font-semibold block mb-1">Pros</span>
              {area.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-1 text-text2 mb-0.5">
                  <span className="text-gold mt-0.5">+</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div>
              <span className="text-destructive font-semibold block mb-1">Cons</span>
              {area.cons.map((c, i) => (
                <div key={i} className="flex items-start gap-1 text-text2 mb-0.5">
                  <span className="text-destructive mt-0.5">-</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {!isSelected && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSelect}
                className="flex-1 border-gold/30 text-gold hover:bg-gold/10"
              >
                <MapPin size={12} />
                Select This Area
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-text3 hover:text-destructive"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Areas() {
  const areas = usePlanStore((s) => s.areas);
  const selectedArea = usePlanStore((s) => s.selectedArea);
  const selectArea = usePlanStore((s) => s.selectArea);
  const set = usePlanStore((s) => s.set);
  const calc = useCalc();

  const selected = calc.selectedArea;

  const handleDelete = useCallback(
    (id: string) => {
      const newAreas = areas.filter((a) => a.id !== id);
      const update: Partial<PlanState> = { areas: newAreas };
      if (selectedArea === id && newAreas.length > 0) {
        update.selectedArea = newAreas[0].id;
      }
      set(update);
    },
    [areas, selectedArea, set]
  );

  const handleUpdate = useCallback(
    (id: string, field: keyof Area, value: string | number) => {
      const newAreas = areas.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      );
      set({ areas: newAreas });
    },
    [areas, set]
  );

  const handleAdd = useCallback(() => {
    const newArea: Area = {
      id: `custom_${Date.now()}`,
      name: 'New Area',
      tagline: 'Add a tagline',
      defaultRent: 30000,
      defaultKeyMoney: 500000,
      budgetMin: 2,
      budgetRange: '2-4M',
      rentRange: '20,000-50,000',
      keyMoneyRange: '300,000-1,000,000',
      buyRange: '3-8M',
      bestSpots: 'Research and add best spots',
      pros: ['Add pros'] as readonly string[],
      cons: ['Add cons'] as readonly string[],
    };
    set({ areas: [...areas, newArea] });
  }, [areas, set]);

  const handleReset = useCallback(() => {
    set({ areas: [...AREA_DEFAULTS] as Area[], selectedArea: 'maadi' });
  }, [set]);

  return (
    <div className="space-y-6">
      {/* Reality check */}
      {selected && (
        <Card className="bg-card border-border border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold">
              <MapPin size={16} />
              Area Reality Check — {selected.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-bg2 rounded-lg p-3 text-center">
                <div className="text-lg font-extrabold text-gold">{fmtK(selected.defaultRent)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">rent/mo</div>
              </div>
              <div className="bg-bg2 rounded-lg p-3 text-center">
                <div className="text-lg font-extrabold text-gold">{fmtK(selected.defaultKeyMoney)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">key money</div>
              </div>
              <div className="bg-bg2 rounded-lg p-3 text-center">
                <div className="text-lg font-extrabold text-text2">{selected.budgetRange}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">total budget</div>
              </div>
              <div className="bg-bg2 rounded-lg p-3 text-center">
                <div className="text-lg font-extrabold text-text2">{fmt(calc.totalStartup)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">your startup</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected area summary */}
      {selected && (
        <div className="flex items-center gap-3 bg-bg2 rounded-lg px-4 py-3 border border-border">
          <CheckCircle size={16} className="text-gold shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-text">{selected.name}</span>
            <span className="text-xs text-text3 ml-2">{selected.tagline}</span>
          </div>
          <Badge className="bg-gold/20 text-gold text-[0.6rem] shrink-0">Active</Badge>
        </div>
      )}

      {/* Budget ranking */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-text text-sm">Budget Ranking (Min Entry)</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetBar areas={areas} />
        </CardContent>
      </Card>

      {/* Area cards grid */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text2">All Areas ({areas.length})</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAdd} className="border-border text-text2">
            <Plus size={14} />
            Add Area
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-text3 hover:text-destructive">
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
            isSelected={area.id === selectedArea}
            onSelect={() => selectArea(area.id)}
            onDelete={() => handleDelete(area.id)}
            onUpdate={(field, value) => handleUpdate(area.id, field, value)}
          />
        ))}
      </div>
    </div>
  );
}
