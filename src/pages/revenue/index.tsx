import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavStore } from '@/stores/nav-store';
import { Menu } from './menu';
import { PnL } from './pnl';

export function RevenuePage() {
  const { getTab, setTab } = useNavStore();
  const activeTab = getTab('revenue') || 'menu';
  return (
    <Tabs value={activeTab} onValueChange={(v) => setTab('revenue', v)}>
      <TabsList className="bg-bg2 border border-border mb-6">
        <TabsTrigger value="menu">Menu & Pricing</TabsTrigger>
        <TabsTrigger value="pnl">P&L Analysis</TabsTrigger>
      </TabsList>
      <TabsContent value="menu"><Menu /></TabsContent>
      <TabsContent value="pnl"><PnL /></TabsContent>
    </Tabs>
  );
}
