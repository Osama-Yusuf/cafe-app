import { AppLayout } from '@/components/layout/app-layout';
import { useNavStore } from '@/stores/nav-store';
import { DashboardPage } from '@/pages/dashboard';
import { PlanningPage } from '@/pages/planning';
import { CostsPage } from '@/pages/costs';
import { RevenuePage } from '@/pages/revenue';
import { StrategyPage } from '@/pages/strategy';
import { FaithPage } from '@/pages/faith';

function PageRouter() {
  const currentPage = useNavStore((s) => s.currentPage);

  switch (currentPage) {
    case 'dashboard': return <DashboardPage />;
    case 'planning': return <PlanningPage />;
    case 'costs': return <CostsPage />;
    case 'revenue': return <RevenuePage />;
    case 'strategy': return <StrategyPage />;
    case 'faith': return <FaithPage />;
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
