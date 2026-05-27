import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavStore } from '@/stores/nav-store';
import { Ramadan } from './ramadan';
import { Zakat } from './zakat';

export function FaithPage() {
  const { getTab, setTab } = useNavStore();
  const activeTab = getTab('faith') || 'ramadan';

  return (
    <Tabs value={activeTab} onValueChange={(v) => setTab('faith', v)}>
      <TabsList>
        <TabsTrigger value="ramadan">Ramadan</TabsTrigger>
        <TabsTrigger value="zakat">Zakat</TabsTrigger>
      </TabsList>

      <TabsContent value="ramadan"><Ramadan /></TabsContent>
      <TabsContent value="zakat"><Zakat /></TabsContent>
    </Tabs>
  );
}
