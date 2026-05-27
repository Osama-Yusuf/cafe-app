import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavStore } from '@/stores/nav-store';
import { SavingsPlan } from './savings-plan';
import { SavingsLog } from './savings-log';
import { Checklist } from './checklist';
import { Partnership } from './partnership';
import { Areas } from './areas';

export function PlanningPage() {
  const { getTab, setTab } = useNavStore();
  const activeTab = getTab('planning') || 'savings';

  return (
    <Tabs value={activeTab} onValueChange={(v) => setTab('planning', String(v))}>
      <TabsList>
        <TabsTrigger value="savings">Plan</TabsTrigger>
        <TabsTrigger value="log">Log</TabsTrigger>
        <TabsTrigger value="checklist">Checklist</TabsTrigger>
        <TabsTrigger value="partnership">Partnership</TabsTrigger>
        <TabsTrigger value="areas">Areas</TabsTrigger>
      </TabsList>

      <TabsContent value="savings"><SavingsPlan /></TabsContent>
      <TabsContent value="log"><SavingsLog /></TabsContent>
      <TabsContent value="checklist"><Checklist /></TabsContent>
      <TabsContent value="partnership"><Partnership /></TabsContent>
      <TabsContent value="areas"><Areas /></TabsContent>
    </Tabs>
  );
}
