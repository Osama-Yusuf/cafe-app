import { useRef, useState } from 'react';
import { usePlanStore } from '@/stores/plan-store';
import { usePartnershipStore } from '@/stores/partnership-store';
import { useCalc } from '@/hooks/use-calc';
import { fmt, fmtPct } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableNumber } from '@/components/ui/editable-number';
import { PieChart, Briefcase, Shield, FileText, DoorOpen } from 'lucide-react';

function KanbanBoard() {
  const partners = usePlanStore((s) => s.partners);
  const { roles, sharedRoles, updateRole, addRole, removeRole, updateSharedRole, addSharedRole, removeSharedRole, moveRole } = usePartnershipStore();
  const [dragOver, setDragOver] = useState<string | null>(null);

  const dragRef = useRef<{ from: number | 'shared'; idx: number } | null>(null);

  const colors = ['#d4a54a', '#5ba872', '#5b8fc7', '#c08b5c', '#9b7dd4'];

  const columns: { id: number | 'shared'; name: string; color: string; items: string[] }[] = [
    ...partners.map((p, i) => ({ id: i as number, name: p.name, color: colors[i % colors.length], items: roles[i] || [] })),
    { id: 'shared' as const, name: 'Shared', color: '#d4a54a', items: sharedRoles },
  ];

  const handleDragStart = (from: number | 'shared', idx: number) => {
    dragRef.current = { from, idx };
  };

  const handleDrop = (toCol: number | 'shared') => {
    setDragOver(null);
    if (!dragRef.current) return;
    const { from, idx } = dragRef.current;
    if (from === toCol) return;
    moveRole(from, idx, toCol);
    dragRef.current = null;
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {columns.map((col) => {
        const colKey = String(col.id);
        const isOver = dragOver === colKey;
        return (
          <div
            key={colKey}
            className={`flex-1 min-w-[180px] rounded-xl border transition-colors ${isOver ? 'border-[#d4a54a] bg-[#d4a54a]/5' : 'border-[#252525] bg-[#131313]'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(colKey); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(col.id)}
          >
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#252525]">
              <div className="w-2 h-2 rounded-sm" style={{ background: col.color }} />
              <span className="text-xs font-bold text-[#ece5db]">{col.name}</span>
              <span className="ml-auto text-[0.6rem] text-[#6b6158]">{col.items.length}</span>
            </div>
            <div className="p-2 space-y-1.5 min-h-[60px]">
              {col.items.map((item, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(col.id, idx)}
                  className="group flex items-center gap-1.5 bg-[#181818] border border-[#252525] rounded-md px-2.5 py-1.5 cursor-grab active:cursor-grabbing hover:border-[#333] transition-colors"
                >
                  <span className="text-[#6b6158] text-[0.65rem] cursor-grab shrink-0">⠿</span>
                  <input
                    value={item}
                    onChange={(e) => col.id === 'shared' ? updateSharedRole(idx, e.target.value) : updateRole(col.id as number, idx, e.target.value)}
                    className="flex-1 bg-transparent border-none text-[#a09889] text-xs outline-none focus:text-[#ece5db] min-w-0"
                  />
                  <button
                    onClick={() => col.id === 'shared' ? removeSharedRole(idx) : removeRole(col.id as number, idx)}
                    className="text-[#6b6158] hover:text-[#c75b3a] text-sm opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >&times;</button>
                </div>
              ))}
            </div>
            <button
              onClick={() => col.id === 'shared' ? addSharedRole() : addRole(col.id as number)}
              className="w-full text-left px-3 py-2 text-[0.65rem] text-[#6b6158] hover:text-[#d4a54a] transition-colors"
            >+ Add</button>
          </div>
        );
      })}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-text text-sm">
          <Icon size={14} className="text-gold" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-text2">
              <div className="w-1 h-1 rounded-full bg-text3 shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function Partnership() {
  const partners = usePlanStore((s) => s.partners);
  const partnerReinvest = usePlanStore((s) => s.partnerReinvest);
  const set = usePlanStore((s) => s.set);
  const calc = useCalc();

  const partnerCount = partners.length;
  const equalSplit = partnerCount > 0 ? 100 / partnerCount : 0;
  const totalContrib = calc.partnerCurrent;

  return (
    <div className="space-y-6">
      {/* Ownership */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text">
            <PieChart size={16} className="text-gold" />
            Ownership Split
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partners.map((p, i) => {
              const capitalPct = totalContrib > 0 ? (p.current / totalContrib) * 100 : equalSplit;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-text2 w-24 truncate">{p.name}</span>
                  <div className="flex-1 h-2 bg-bg2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${equalSplit}%` }}
                    />
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-gold tabular-nums">
                      {fmtPct(equalSplit)}
                    </span>
                    <span className="text-[0.6rem] text-text3 block">
                      {fmtPct(capitalPct)} by capital
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-text3 mt-3">
            Equal split: {fmtPct(equalSplit)} each. Capital-based split shown for reference.
          </p>
        </CardContent>
      </Card>

      {/* Roles — Kanban */}
      <div>
        <h3 className="text-sm font-bold text-[#a09889] mb-1 flex items-center gap-2">
          <Briefcase size={14} className="text-[#d4a54a]" />
          Roles & Responsibilities
        </h3>
        <p className="text-xs text-[#6b6158] mb-3">Drag items between columns to reassign. Click text to edit.</p>
        <KanbanBoard />
      </div>

      {/* Profit Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text">
            <PieChart size={16} className="text-gold" />
            Profit Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-text3 text-xs">Reinvestment Rate</span>
              <EditableNumber
                value={partnerReinvest}
                onChange={(v) => set({ partnerReinvest: v })}
                suffix="%"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg2 rounded-lg p-3 text-center">
                <div className="text-lg font-extrabold text-gold">{fmtPct(partnerReinvest)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">reinvested</div>
              </div>
              <div className="bg-bg2 rounded-lg p-3 text-center">
                <div className="text-lg font-extrabold text-text2">{fmtPct(100 - partnerReinvest)}</div>
                <div className="text-[0.6rem] text-text3 uppercase tracking-wider">distributed</div>
              </div>
            </div>
            {calc.monthlyPL > 0 && (
              <div className="text-xs text-text3">
                Estimated monthly distribution:{' '}
                <span className="text-gold font-semibold">
                  {fmt(Math.round((calc.monthlyPL * (100 - partnerReinvest)) / 100 / partnerCount))} EGP
                </span>{' '}
                per partner
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Static info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          icon={Shield}
          title="What If One Leaves?"
          items={[
            'Buyout at book value or agreed formula',
            'First right of refusal to remaining partners',
            'Transition period: 3-6 months notice',
            'Non-compete clause: 2 years, same area',
          ]}
        />
        <InfoCard
          icon={DoorOpen}
          title="Exit Strategy"
          items={[
            'Minimum 2-year commitment before exit',
            'Valuation by independent accountant',
            'Structured payout over 6-12 months',
            'Assets split proportional to ownership',
          ]}
        />
        <InfoCard
          icon={FileText}
          title="Documentation"
          items={[
            'Partnership agreement (notarized)',
            'Profit/loss sharing terms',
            'Decision-making authority matrix',
            'Dispute resolution: mediation first',
            'Annual review of terms',
          ]}
        />
      </div>
    </div>
  );
}
