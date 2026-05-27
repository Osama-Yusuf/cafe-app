import { usePlanStore } from '@/stores/plan-store';
import { useCompetitorsStore } from '@/stores/competitors-store';
import { fmt } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { SignatureDrinks } from './competition-standout';

function CilantroComparison() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text">Cilantro VS You</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Their Weaknesses */}
        <Card className="bg-card border-2 border-red-500/40">
          <CardHeader>
            <CardTitle className="text-red-400 text-sm uppercase tracking-wider">
              Their Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Generic commercial-grade coffee',
              'Inconsistent, untrained service',
              'Cookie-cutter atmosphere',
              'No specialty options',
              '"Overpriced for what you get"',
              'Faceless corporate brand',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-text2">
                <span className="text-red-400 shrink-0 mt-0.5">&#10005;</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Your Advantages */}
        <Card className="bg-card border-2 border-green-500/40">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm uppercase tracking-wider">
              Your Advantages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Specialty-grade beans (SCA 80+)',
              'Trained baristas, latte art',
              'Designed space with character',
              'Pour-over, cold brew, single origins',
              'Better quality at similar price',
              'Founders present, personal',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-text2">
                <span className="text-green-400 shrink-0 mt-0.5">&#10003;</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PriceCompare({ yours, theirs }: { yours: number; theirs: number }) {
  if (theirs === 0 || yours === 0) return null;
  const diff = theirs - yours;
  if (diff === 0) return <span className="text-xs text-text3">Same price</span>;
  if (diff > 0) {
    return <span className="text-xs text-green-400">You&apos;re {fmt(diff)} cheaper</span>;
  }
  return <span className="text-xs text-red-400">You&apos;re {fmt(Math.abs(diff))} pricier</span>;
}

function CompetitorCard({ index }: { index: number }) {
  const competitor = useCompetitorsStore((s) => s.competitors[index]);
  const update = useCompetitorsStore((s) => s.updateCompetitor);
  const remove = useCompetitorsStore((s) => s.removeCompetitor);
  const menu = usePlanStore((s) => s.menu);

  const yourLatte = menu.latte?.price ?? 0;
  const yourAmericano = menu.americano?.price ?? 0;
  const yourCappuccino = menu.cappuccino?.price ?? 0;

  return (
    <Card className="bg-card border-border group relative">
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <Input
            value={competitor.name}
            onChange={(e) => update(index, { name: e.target.value })}
            className="border-none text-base font-bold text-text bg-transparent p-0 h-auto focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => remove(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 h-7 w-7 p-0"
          >
            <Trash2 size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {([
            { key: 'latte' as const, label: 'Latte', yours: yourLatte },
            { key: 'americano' as const, label: 'Americano', yours: yourAmericano },
            { key: 'cappuccino' as const, label: 'Cappuccino', yours: yourCappuccino },
          ]).map(({ key, label, yours }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs text-text3 uppercase tracking-wider">{label}</label>
              <Input
                type="number"
                inputMode="numeric"
                value={competitor[key] || ''}
                onChange={(e) => update(index, { [key]: Number(e.target.value) || 0 })}
                className="h-8 text-right bg-bg border-border text-sm"
              />
              <PriceCompare yours={yours} theirs={competitor[key]} />
            </div>
          ))}
        </div>

        <Input
          value={competitor.notes}
          onChange={(e) => update(index, { notes: e.target.value })}
          placeholder="Notes..."
          className="text-sm text-text2 bg-bg border-border"
        />
      </CardContent>
    </Card>
  );
}

function YourCompetitors() {
  const competitors = useCompetitorsStore((s) => s.competitors);
  const addCompetitor = useCompetitorsStore((s) => s.addCompetitor);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text">Your Competitors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitors.map((_, i) => (
          <CompetitorCard key={i} index={i} />
        ))}
      </div>
      <Button
        variant="outline"
        onClick={addCompetitor}
        className="border-border text-text2 w-full"
      >
        <Plus size={14} className="mr-1" />
        Add Competitor
      </Button>
    </div>
  );
}

export function Competition() {
  return (
    <div className="space-y-8">
      <CilantroComparison />
      <YourCompetitors />
      <SignatureDrinks />
    </div>
  );
}
