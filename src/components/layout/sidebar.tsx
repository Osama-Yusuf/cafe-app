import { Coffee, LayoutDashboard, Compass, DollarSign, TrendingUp, Target, Heart } from 'lucide-react';
import { useNavStore } from '@/stores/nav-store';
import { cn } from '@/lib/utils';
import { usePlanStore } from '@/stores/plan-store';

const NAV_ITEMS = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'planning' as const, label: 'Planning', icon: Compass },
  { id: 'costs' as const, label: 'Costs', icon: DollarSign },
  { id: 'revenue' as const, label: 'Revenue', icon: TrendingUp },
  { id: 'strategy' as const, label: 'Strategy', icon: Target },
  { id: 'faith' as const, label: 'Faith', icon: Heart },
];

export function Sidebar() {
  const { currentPage, setPage } = useNavStore();
  const cafeName = usePlanStore((s) => s.cafeName);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] fixed left-0 top-0 bottom-0 bg-bg2 border-r border-border z-50">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <Coffee size={20} className="text-gold" />
          <span className="font-bold text-sm tracking-tight text-gold">{cafeName.toUpperCase()}</span>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors border-l-[3px] border-transparent',
                currentPage === item.id
                  ? 'text-gold bg-gold-glow border-l-gold'
                  : 'text-text2 hover:text-text hover:bg-white/[0.03]'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-3 border-t border-border text-xs text-text3 text-center">
          All numbers in EGP
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg/97 backdrop-blur-xl border-t border-border z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around py-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-[0.6rem] font-semibold transition-colors relative',
                currentPage === item.id ? 'text-gold' : 'text-text3'
              )}
            >
              {currentPage === item.id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold rounded-full" />
              )}
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
