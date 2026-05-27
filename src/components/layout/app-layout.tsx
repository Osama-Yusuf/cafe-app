import { Sidebar } from './sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 md:ml-[220px] px-4 md:px-8 py-6 pb-20 md:pb-6 min-h-dvh">
        {children}
      </main>
    </div>
  );
}
