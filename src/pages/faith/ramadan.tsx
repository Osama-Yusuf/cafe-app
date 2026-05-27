import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RamadanMenu } from './ramadan-menu';

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-text">
          <span>{title}</span>
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
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}

function HoursSchedule() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-text">Hours & Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-text2">
          <span className="text-gold shrink-0 mt-0.5 font-bold">Recommended:</span>
          <span>Close 2PM-6PM, open 6PM-2AM</span>
        </div>
        <div className="text-sm text-text2">
          Staff shifts need complete restructuring for the month. Plan two shifts:
          a morning shift (8AM-2PM) and an evening shift (6PM-2AM).
        </div>
      </CardContent>
    </Card>
  );
}

function Staffing() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-text">Staffing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-text2">
          Fasting staff means shorter active shifts. Expect reduced productivity during daytime hours.
          Schedule heavier staffing for the evening rush after iftar.
        </div>
        <div className="flex items-start gap-2 text-sm text-text2">
          <span className="text-gold shrink-0 font-bold">Key:</span>
          <span>Provide iftar meal for evening shift staff. This builds loyalty and is the right thing to do.</span>
        </div>
      </CardContent>
    </Card>
  );
}

function RamadanMarketing() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-text">Marketing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Decorations', desc: 'Fanous lanterns, crescent displays, warm lighting' },
            { label: 'Positioning', desc: '"Iftar at your cafe" — suhoor and iftar combos' },
            { label: 'Loyalty', desc: 'Double loyalty stamps during Ramadan' },
            { label: 'Charity', desc: 'Suspended coffee program — pay it forward' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-bg2 border border-border">
              <div className="text-sm font-bold text-gold mb-1">{item.label}</div>
              <div className="text-xs text-text2">{item.desc}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FinancialImpact() {
  return (
    <CollapsibleSection title="Financial Impact">
      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-text2">
          <span className="text-red-400 shrink-0 font-bold">Daytime:</span>
          <span>Significantly lower revenue — most people are fasting</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-text2">
          <span className="text-green-400 shrink-0 font-bold">Evening:</span>
          <span>Higher revenue — post-iftar socializing peaks</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-text2">
          <span className="text-gold shrink-0 font-bold">Net effect:</span>
          <span>Usually neutral to slightly positive if managed well</span>
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="text-sm font-bold text-green-400 mb-1">Eid al-Fitr</div>
          <div className="text-xs text-text2">
            Massive day — plan a special event, extended hours, and limited-edition Eid drinks.
            This can be one of the highest revenue days of the year.
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}

export function Ramadan() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text">Ramadan Operations Guide</h3>
      <p className="text-sm text-text3">
        Adapt your cafe for the holy month — adjusted hours, special menu, and community focus.
      </p>
      <HoursSchedule />
      <RamadanMenu />
      <Staffing />
      <RamadanMarketing />
      <FinancialImpact />
    </div>
  );
}
