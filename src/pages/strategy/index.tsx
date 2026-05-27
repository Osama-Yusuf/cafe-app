import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavStore } from '@/stores/nav-store';
import { Competition } from './competition';
import { Milestones } from './milestones';
import { Marketing } from './marketing';

export function StrategyPage() {
  const { getTab, setTab } = useNavStore();
  const activeTab = getTab('strategy') || 'competition';

  return (
    <Tabs value={activeTab} onValueChange={(v) => setTab('strategy', v)}>
      <TabsList className="bg-bg2 border border-border mb-6">
        <TabsTrigger value="competition">Competition</TabsTrigger>
        <TabsTrigger value="milestones">Milestones</TabsTrigger>
        <TabsTrigger value="marketing">Marketing</TabsTrigger>
      </TabsList>

      <TabsContent value="competition"><Competition /></TabsContent>
      <TabsContent value="milestones"><Milestones /></TabsContent>
      <TabsContent value="marketing"><Marketing /></TabsContent>
    </Tabs>
  );
}
