import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Supplier {
  name: string;
  product: string;
  price: string;
  notes: string;
}

interface SupplierCategory {
  title: string;
  color: string;
  items: Supplier[];
}

const SUPPLIERS: SupplierCategory[] = [
  {
    title: 'Coffee Roasters',
    color: 'bg-amber-900/30 text-amber-400',
    items: [
      { name: 'La Marzocco Roastery', product: 'Espresso Blend', price: '800-1,200/kg', notes: 'Premium, consistent supply' },
      { name: 'Cairokee Roasters', product: 'Single Origin', price: '1,000-1,500/kg', notes: 'Local specialty roaster' },
      { name: 'Hany Coffee', product: 'Commercial Blend', price: '500-800/kg', notes: 'Budget option, bulk discounts' },
      { name: 'Ibrik Coffee', product: 'Specialty Beans', price: '1,200-2,000/kg', notes: 'Direct trade, SCA scored' },
    ],
  },
  {
    title: 'Equipment Dealers',
    color: 'bg-zinc-700/40 text-zinc-300',
    items: [
      { name: 'CoffeTec Egypt', product: 'Espresso Machines', price: 'Varies', notes: 'La Marzocco, Victoria Arduino' },
      { name: 'El-Nile Trading', product: 'Grinders & Tools', price: 'Varies', notes: 'Mahlkonig, Eureka authorized' },
      { name: 'Smart Cafe Solutions', product: 'Full Fit-out', price: 'Package deals', notes: 'Turnkey solutions' },
    ],
  },
  {
    title: 'Milk & Dairy',
    color: 'bg-sky-900/30 text-sky-400',
    items: [
      { name: 'Juhayna', product: 'Full Fat Milk', price: '22-28/L', notes: 'Most common, reliable delivery' },
      { name: 'Beyti', product: 'Full Fat Milk', price: '24-30/L', notes: 'Premium option' },
      { name: 'Oatly (imported)', product: 'Oat Milk', price: '75-95/L', notes: 'Import via distributors' },
      { name: 'Minor Figures', product: 'Barista Oat Milk', price: '80-100/L', notes: 'Froths better than Oatly' },
    ],
  },
  {
    title: 'Syrups',
    color: 'bg-purple-900/30 text-purple-400',
    items: [
      { name: 'Monin (imported)', product: 'Full Range', price: '1,200-1,800/bottle', notes: 'Industry standard, 700ml' },
      { name: 'DaVinci', product: 'Full Range', price: '900-1,200/bottle', notes: 'Good budget alternative' },
      { name: '1883 Maison Routin', product: 'Premium Syrups', price: '1,500-2,000/bottle', notes: 'Premium French brand' },
    ],
  },
  {
    title: 'Disposables',
    color: 'bg-green-900/30 text-green-400',
    items: [
      { name: 'Papyrus Egypt', product: 'Cups & Lids', price: 'Bulk pricing', notes: 'Custom branding available' },
      { name: 'El Wady Plastics', product: 'Cold Cups', price: 'Bulk pricing', notes: 'Cheapest option' },
      { name: 'EcoCup', product: 'Biodegradable', price: '30-50% premium', notes: 'Eco-friendly, good branding' },
    ],
  },
  {
    title: 'POS Systems',
    color: 'bg-blue-900/30 text-blue-400',
    items: [
      { name: 'Foodics', product: 'Full POS', price: '1,200-2,500/mo', notes: 'Most popular in Egypt F&B' },
      { name: 'iOrder', product: 'POS + Online', price: '800-1,500/mo', notes: 'Good for delivery integration' },
      { name: 'POSRocket', product: 'Cloud POS', price: '600-1,200/mo', notes: 'Budget friendly' },
    ],
  },
  {
    title: 'Bakery Partners',
    color: 'bg-orange-900/30 text-orange-400',
    items: [
      { name: 'Patchi Bakery', product: 'Croissants & Pastries', price: '12-20/piece', notes: 'Daily delivery, consistent' },
      { name: 'Nola Cupcakes', product: 'Cupcakes & Cakes', price: '20-35/piece', notes: 'Premium, good display' },
      { name: 'Local Bakery', product: 'Cookies & Basics', price: '8-15/piece', notes: 'Negotiate bulk rates' },
    ],
  },
  {
    title: 'Design & Branding',
    color: 'bg-pink-900/30 text-pink-400',
    items: [
      { name: 'Studio Meem', product: 'Full Brand Identity', price: '25,000-50,000', notes: 'Experienced in F&B' },
      { name: 'Mashrou3', product: 'Logo + Menu Design', price: '15,000-30,000', notes: 'Budget-friendly studio' },
      { name: 'Freelance (Upwork)', product: 'Logo Only', price: '5,000-15,000', notes: 'Variable quality' },
    ],
  },
];

function SupplierTable({ category }: { category: SupplierCategory }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-text">
          <Badge className={category.color}>{category.title}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-text3 font-semibold text-xs uppercase tracking-wider">Supplier</th>
                <th className="text-left py-2 text-text3 font-semibold text-xs uppercase tracking-wider">Product</th>
                <th className="text-right py-2 text-text3 font-semibold text-xs uppercase tracking-wider">Price (EGP)</th>
                <th className="text-left py-2 pl-4 text-text3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {category.items.map((item) => (
                <tr key={item.name} className="border-b border-border/50 hover:bg-bg2/50">
                  <td className="py-2 text-text font-medium">{item.name}</td>
                  <td className="py-2 text-text2">{item.product}</td>
                  <td className="py-2 text-right text-gold tabular-nums">{item.price}</td>
                  <td className="py-2 pl-4 text-text3 text-xs hidden md:table-cell">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function Suppliers() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-text3 mb-2">
        Reference directory of Cairo-based suppliers. Prices are approximate and should be verified.
      </div>
      {SUPPLIERS.map((cat) => (
        <SupplierTable key={cat.title} category={cat} />
      ))}
    </div>
  );
}
