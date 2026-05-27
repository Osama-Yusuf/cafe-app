import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavStore } from '@/stores/nav-store';
import { Startup } from './startup';
import { Supplies } from './supplies';
import { Suppliers } from './suppliers';
import { Team } from './team';

export function CostsPage() {
  const { getTab, setTab } = useNavStore();
  const activeTab = getTab('costs') || 'startup';
  return (
    <Tabs value={activeTab} onValueChange={(v) => setTab('costs', v)}>
      <TabsList className="bg-bg2 border border-border mb-6">
        <TabsTrigger value="startup">Startup</TabsTrigger>
        <TabsTrigger value="supplies">Supplies</TabsTrigger>
        <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="startup"><Startup /></TabsContent>
      <TabsContent value="supplies"><Supplies /></TabsContent>
      <TabsContent value="suppliers"><Suppliers /></TabsContent>
      <TabsContent value="team"><Team /></TabsContent>
    </Tabs>
  );
}
