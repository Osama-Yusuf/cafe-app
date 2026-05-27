import { AppLayout } from '@/components/layout/app-layout';
import { useNavStore } from '@/stores/nav-store';
import { DashboardPage } from '@/pages/dashboard';
import { PlanningPage } from '@/pages/planning';
import { CostsPage } from '@/pages/costs';
import { RevenuePage } from '@/pages/revenue';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-[50vh] text-text3">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm">Coming soon — being ported from the prototype.</p>
      </div>
    </div>
  );
}

function PageRouter() {
  const currentPage = useNavStore((s) => s.currentPage);

  switch (currentPage) {
    case 'dashboard': return <DashboardPage />;
    case 'planning': return <PlanningPage />;
    case 'costs': return <CostsPage />;
    case 'revenue': return <RevenuePage />;
    case 'strategy': return <PlaceholderPage title="Strategy" />;
    case 'faith': return <PlaceholderPage title="Faith" />;
    default: return <DashboardPage />;
  }
}

export default function App() {
  return (
    <div className="dark">
      <AppLayout>
        <PageRouter />
      </AppLayout>
    </div>
  );
}
