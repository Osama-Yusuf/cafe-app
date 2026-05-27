import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RAMADAN_ITEMS = [
  {
    name: 'Dates + Arabic Coffee',
    desc: 'Traditional iftar opener. Serve 3 ajwa dates with a small cup of Arabic coffee with cardamom.',
    color: 'text-amber-400',
  },
  {
    name: 'Sahlab Latte',
    desc: 'Warm sahlab with espresso, topped with cinnamon and crushed pistachios. Perfect post-iftar comfort.',
    color: 'text-orange-300',
  },
  {
    name: 'Qamar el-Din',
    desc: 'Classic apricot juice — the Ramadan staple. Serve chilled with a slice of dried apricot.',
    color: 'text-yellow-400',
  },
  {
    name: 'Kunafa / Qatayef',
    desc: 'Partner with a local sweets vendor. Offer fresh kunafa slices and qatayef as add-ons.',
    color: 'text-gold',
  },
  {
    name: 'Ramadan Combo Deal',
    desc: 'Dates + Arabic coffee + kunafa slice at a bundled price. Great perceived value.',
    color: 'text-green-400',
  },
];

export function RamadanMenu() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-text">Special Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RAMADAN_ITEMS.map((item) => (
            <div key={item.name} className="p-3 rounded-lg bg-bg2 border border-border">
              <div className={`text-sm font-bold mb-1 ${item.color}`}>{item.name}</div>
              <p className="text-xs text-text2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
