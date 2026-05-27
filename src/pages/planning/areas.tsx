import { useCallback, useMemo, useState } from 'react';
import { usePlanStore, type PlanState } from '@/stores/plan-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt, fmtK } from '@/lib/format';
import { AREA_DEFAULTS, type Area } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { EditableNumber } from '@/components/ui/editable-number';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw, ChevronRight } from 'lucide-react';

function BudgetRanking({ areas, selectedId, onSelect }: { areas: Area[]; selectedId: string; onSelect: (id: string) => void }) {
  const sorted = useMemo(() => [...areas].sort((a, b) => a.budgetMin - b.budgetMin), [areas]);
  const maxB = sorted.length > 0 ? sorted[sorted.length - 1].budgetMin : 1;
  const colors = ['#5ba872','#5ba872','#d4a54a','#d4a54a','#c08b5c','#c08b5c','#c75b3a','#c75b3a','#c75b3a','#c75b3a'];

  return (
    <div className="flex items-end gap-2 h-[140px]">
      {sorted.map((a, i) => {
        const sel = a.id === selectedId;
        const h = Math.max(24, Math.round((a.budgetMin / maxB) * 100));
        return (
          <button key={a.id} onClick={() => onSelect(a.id)} className="flex-1 min-w-0 text-center cursor-pointer transition-all hover:scale-[1.03]">
            <div className={`text-[0.7rem] font-bold mb-1.5 truncate ${sel ? 'text-[#d4a54a]' : 'text-[#a09889]'}`}>
              {a.budgetRange}
            </div>
            <div
              className="rounded-t-md transition-all duration-300"
              style={{
                height: h,
                background: sel ? '#d4a54a' : colors[Math.min(i, colors.length - 1)],
                opacity: sel ? 1 : 0.85,
                width: '100%',
              }}
            />
            <div className={`text-[0.6rem] mt-1.5 leading-tight truncate ${sel ? 'text-[#d4a54a] font-bold' : 'text-[#6b6158]'}`}>
              {a.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function AreaCard({ area, isSelected, onSelect, onDelete, onUpdate }: {
  area: Area; isSelected: boolean; onSelect: () => void; onDelete: () => void;
  onUpdate: (field: keyof Area, value: string | number) => void;
}) {
  const [showPros, setShowPros] = useState(false);

  return (
    <div className={`group relative rounded-xl p-5 transition-all ${isSelected ? 'border-2 border-[#d4a54a] bg-gradient-to-br from-[#181818] to-[#1a1508] shadow-[0_0_20px_rgba(212,165,74,0.08)]' : 'border border-[#252525] bg-[#181818] hover:border-[#333]'}`}>
      {isSelected && (
        <div className="absolute top-3 right-3 text-[0.6rem] font-bold uppercase tracking-widest text-[#0b0b0b] bg-[#d4a54a] px-2.5 py-1 rounded-md shadow-sm">
          Selected
        </div>
      )}
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className={`absolute top-3.5 text-[#6b6158] hover:text-[#c75b3a] text-lg transition-all opacity-0 group-hover:opacity-100 ${isSelected ? 'right-[6.5rem]' : 'right-3'}`}>
        &times;
      </button>

      <input value={area.name} onChange={(e) => onUpdate('name', e.target.value)}
        className="bg-transparent border-none text-[#ece5db] text-base font-bold w-full p-0 mb-0.5 outline-none focus:border-b focus:border-[#252525]" />
      <input value={area.tagline} onChange={(e) => onUpdate('tagline', e.target.value)}
        className="bg-transparent border-none text-[#d4a54a] text-xs w-full p-0 mb-4 outline-none opacity-80" />

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#0b0b0b] border border-[#333] rounded-lg p-3 text-center">
          <EditableNumber value={area.defaultRent} onChange={(v) => onUpdate('defaultRent', v)} size="sm" />
          <div className="text-[0.6rem] text-[#6b6158] uppercase mt-1.5 tracking-wider">Rent/mo (EGP)</div>
        </div>
        <div className="bg-[#0b0b0b] border border-[#333] rounded-lg p-3 text-center">
          <EditableNumber value={area.defaultKeyMoney} onChange={(v) => onUpdate('defaultKeyMoney', v)} size="sm" />
          <div className="text-[0.6rem] text-[#6b6158] uppercase mt-1.5 tracking-wider">Key Money (EGP)</div>
        </div>
        <div className="bg-[#0b0b0b] border border-[#333] rounded-lg p-3 text-center">
          <input value={area.budgetRange} onChange={(e) => onUpdate('budgetRange', e.target.value)}
            className="bg-transparent border border-[#444] rounded text-[#d4a54a] text-sm font-bold text-center w-full p-1.5 outline-none focus:border-[#d4a54a]" />
          <div className="text-[0.6rem] text-[#6b6158] uppercase mt-1.5 tracking-wider">Budget Range</div>
        </div>
      </div>

      <div className="text-xs text-[#a09889] mb-3">
        <span className="font-semibold text-[#6b6158]">Best spots: </span>
        <span contentEditable suppressContentEditableWarning onBlur={(e) => onUpdate('bestSpots', e.currentTarget.textContent || '')}>{area.bestSpots}</span>
      </div>

      <button onClick={() => setShowPros(!showPros)} className="text-[0.65rem] font-bold text-[#6b6158] uppercase tracking-wider flex items-center gap-1 mb-2 cursor-pointer hover:text-[#a09889] transition-colors">
        <ChevronRight size={12} className={`transition-transform ${showPros ? 'rotate-90' : ''}`} />
        Pros & Cons
      </button>
      {showPros && (
        <div className="grid grid-cols-2 gap-3 text-xs mb-3 animate-in fade-in-0 duration-200">
          <div>
            {area.pros.map((p, i) => (
              <div key={i} className="flex items-start gap-1 text-[#a09889] mb-1">
                <span className="text-[#5ba872]">✓</span><span>{p}</span>
              </div>
            ))}
          </div>
          <div>
            {area.cons.map((c, i) => (
              <div key={i} className="flex items-start gap-1 text-[#a09889] mb-1">
                <span className="text-[#c75b3a]">✗</span><span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onSelect}
        className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
          isSelected
            ? 'bg-[#d4a54a] text-[#0b0b0b] shadow-[0_2px_12px_rgba(212,165,74,0.25)]'
            : 'bg-[#1e1e1e] text-[#a09889] border border-[#252525] hover:border-[#d4a54a] hover:text-[#d4a54a] hover:shadow-[0_0_12px_rgba(212,165,74,0.08)]'
        }`}
      >
        {isSelected ? '✓ Selected' : 'Select This Area'}
      </button>
    </div>
  );
}

export function Areas() {
  const areas = usePlanStore((s) => s.areas);
  const selectedArea = usePlanStore((s) => s.selectedArea);
  const selectArea = usePlanStore((s) => s.selectArea);
  const set = usePlanStore((s) => s.set);
  const calc = useCalc();
  const selected = calc.selectedArea;
  const [toast, setToast] = useState('');

  const handleSelect = useCallback((id: string) => {
    selectArea(id);
    const area = areas.find(a => a.id === id);
    if (area) {
      setToast(`${area.name} selected — rent & key money updated`);
      setTimeout(() => setToast(''), 2500);
    }
  }, [areas, selectArea]);

  const handleDelete = useCallback((id: string) => {
    if (areas.length <= 1) return;
    const newAreas = areas.filter(a => a.id !== id);
    const update: Partial<PlanState> = { areas: newAreas };
    if (selectedArea === id) { update.selectedArea = newAreas[0].id; }
    set(update);
  }, [areas, selectedArea, set]);

  const handleUpdate = useCallback((id: string, field: keyof Area, value: string | number) => {
    const newAreas = areas.map(a => a.id === id ? { ...a, [field]: value } : a);
    set({ areas: newAreas });
    if ((field === 'defaultRent' || field === 'defaultKeyMoney') && id === selectedArea) {
      const updated = newAreas.find(a => a.id === id);
      if (updated) set({ monthlyRent: updated.defaultRent, keyMoney: updated.defaultKeyMoney });
    }
  }, [areas, selectedArea, set]);

  const handleAdd = useCallback(() => {
    const newArea: Area = { id: `area_${Date.now()}`, name: 'New Area', tagline: 'Edit details', defaultRent: 30000, defaultKeyMoney: 500000, budgetMin: 2, budgetRange: '2–4M', rentRange: '20,000–50,000', keyMoneyRange: '300K–1M', buyRange: '3–6M', bestSpots: 'Research and add...', pros: ['Add pros'] as unknown as readonly string[], cons: ['Add cons'] as unknown as readonly string[] };
    set({ areas: [...areas, newArea] });
  }, [areas, set]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#d4a54a] font-semibold tracking-widest uppercase mb-1">Strategy</p>
        <h2 className="text-2xl font-black tracking-tight text-[#ece5db]">Prospect Areas</h2>
        <p className="text-sm text-[#a09889] mt-1">Select your target area. Rent and key money update across all calculations.</p>
      </div>

      {/* Reality Check */}
      {selected && (
        <div className="bg-[#181818] border border-[#d4a54a]/15 rounded-xl p-5">
          <h3 className="font-bold text-sm mb-3">Area Reality Check</h3>
          <p className="text-[0.65rem] text-[#6b6158] mb-3">Based on your selected area</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0b0b0b] rounded-lg p-3 text-center">
              <div className="text-lg font-extrabold text-[#c75b3a]">{selected.buyRange}</div>
              <div className="text-[0.55rem] text-[#6b6158] uppercase mt-1">Buy Price Range</div>
            </div>
            <div className="bg-[#0b0b0b] rounded-lg p-3 text-center">
              <div className="text-lg font-extrabold text-[#d4a54a]">{selected.rentRange}</div>
              <div className="text-[0.55rem] text-[#6b6158] uppercase mt-1">Rent/month Range</div>
            </div>
            <div className="bg-[#0b0b0b] rounded-lg p-3 text-center">
              <div className="text-lg font-extrabold text-[#c08b5c]">{selected.keyMoneyRange}</div>
              <div className="text-[0.55rem] text-[#6b6158] uppercase mt-1">Key Money Range</div>
            </div>
          </div>
          <p className="text-xs text-[#a09889] mt-3"><strong className="text-[#d4a54a]">Buying is expensive</strong> — rent a Tier 2 spot, buy in Year 3-5 once profitable.</p>
          <p className="text-xs text-[#a09889] mt-1"><strong className="text-[#c75b3a]">Always ask: "إيه قيمة الخلو؟"</strong> — Key money can add millions to "reasonable" rent.</p>
        </div>
      )}

      {/* Selected summary */}
      {selected && (
        <div className="flex items-center gap-3 bg-[#d4a54a]/10 border border-[#d4a54a]/25 rounded-lg px-4 py-3 text-sm">
          <span className="text-[#a09889]">Selected:</span>
          <strong className="text-[#d4a54a]">{selected.name}</strong>
          <span className="text-[#6b6158]">|</span>
          <span className="text-[#ece5db]">Rent: <strong>{fmt(selected.defaultRent)}</strong>/mo</span>
          <span className="text-[#6b6158]">|</span>
          <span className="text-[#ece5db]">Key Money: <strong>{fmtK(selected.defaultKeyMoney)}</strong></span>
        </div>
      )}

      {/* Budget Ranking */}
      <Card className="bg-[#181818] border-[#252525]">
        <CardContent className="pt-5">
          <h3 className="text-sm font-bold text-[#a09889] mb-4">Budget Ranking — Cheapest to Most Expensive</h3>
          <BudgetRanking areas={areas} selectedId={selectedArea} onSelect={handleSelect} />
        </CardContent>
      </Card>

      {/* Area cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => (
          <AreaCard key={area.id} area={area} isSelected={area.id === selectedArea}
            onSelect={() => handleSelect(area.id)} onDelete={() => handleDelete(area.id)}
            onUpdate={(field, value) => handleUpdate(area.id, field, value)} />
        ))}

        {/* Add card */}
        <button onClick={handleAdd} className="border-2 border-dashed border-[#252525] rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-[#6b6158] hover:border-[#d4a54a] hover:text-[#d4a54a] transition-colors cursor-pointer min-h-[200px]">
          <Plus size={24} />
          <span className="text-sm">Add New Area</span>
        </button>
      </div>

      {/* Reset */}
      <div className="text-right">
        <Button variant="ghost" size="sm" onClick={() => { set({ areas: [...AREA_DEFAULTS] as Area[], selectedArea: 'maadi' }); }}
          className="text-[#6b6158] hover:text-[#c75b3a] text-xs">
          <RotateCcw size={12} className="mr-1" /> Reset All Areas to Defaults
        </Button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#d4a54a] text-[#0b0b0b] px-5 py-2.5 rounded-lg text-sm font-bold z-50 shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          {toast}
        </div>
      )}
    </div>
  );
}
