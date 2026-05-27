import { Card, CardContent } from '@/components/ui/card';

const SIGNATURE_DRINKS = [
  { name: 'Hibiscus Cold Brew', desc: 'Cold brew steeped with dried hibiscus, served over ice with a honey rim. Tart, floral, unmistakably Egyptian.' },
  { name: 'Date-Spiced Latte', desc: 'Espresso with steamed milk, date syrup, and a pinch of cardamom. Sweet without sugar.' },
  { name: 'Sahlab Latte', desc: 'Winter warmer — espresso meets sahlab orchid powder, topped with cinnamon and crushed pistachios.' },
  { name: 'Orange Blossom Iced', desc: 'Iced latte with orange blossom water and vanilla. Light, fragrant, Instagrammable.' },
  { name: 'Egyptian Mocha', desc: 'Double espresso, dark chocolate, tahini drizzle, sea salt. Rich and deeply local.' },
];

const QUICK_WINS = [
  'Offer a free pour-over tasting every Saturday morning',
  'Name drinks after Cairo landmarks (Citadel Cortado, Nile Cold Brew)',
  'Display "Roasted on" dates on every bag — transparency wins trust',
  'Train every barista on 60-second coffee origin stories',
  'Partner with one local bakery for exclusive pastry collab',
  'Handwritten "thank you" on every takeaway cup sleeve',
  'Free upsize for any customer who brings a reusable cup',
  'Weekly "Barista\'s Pick" board with tasting notes',
  'Loyalty card: 8th drink free (not 10th — feels faster)',
  'Host one "Coffee 101" workshop per month — free, 30 min',
];

const MOONSHOT = [
  { label: 'Year 1-2', pct: 25, desc: 'Become the best cup in the neighborhood' },
  { label: 'Year 2-3', pct: 50, desc: 'The place people recommend to friends' },
  { label: 'Year 3-5', pct: 75, desc: 'Recognized specialty brand in Cairo' },
  { label: 'Year 5+', pct: 100, desc: 'Multi-location, own roastery, wholesale' },
];

export function SignatureDrinks() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-text">How to Stand Out</h3>

      {/* Signature Drinks */}
      <div>
        <h4 className="text-sm font-semibold text-text2 uppercase tracking-wider mb-3">
          Signature Drinks
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SIGNATURE_DRINKS.map((drink) => (
            <Card key={drink.name} className="bg-card border-border">
              <CardContent className="pt-4">
                <div className="text-gold font-bold text-sm mb-1">{drink.name}</div>
                <p className="text-xs text-text2 leading-relaxed">{drink.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Wins */}
      <div>
        <h4 className="text-sm font-semibold text-text2 uppercase tracking-wider mb-3">
          10 Quick Wins
        </h4>
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <ol className="space-y-2">
              {QUICK_WINS.map((win, i) => (
                <li key={i} className="flex gap-3 text-sm text-text2">
                  <span className="text-gold font-bold tabular-nums shrink-0 w-5 text-right">
                    {i + 1}.
                  </span>
                  <span>{win}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Moon Shot */}
      <div>
        <h4 className="text-sm font-semibold text-text2 uppercase tracking-wider mb-3">
          Moon Shot Growth
        </h4>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 space-y-4">
            {MOONSHOT.map((phase) => (
              <div key={phase.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-text">{phase.label}</span>
                  <span className="text-xs text-text3">{phase.desc}</span>
                </div>
                <div className="h-2 bg-bg2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all"
                    style={{ width: `${phase.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
