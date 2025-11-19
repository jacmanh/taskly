import { Sidebar } from '../components/Sidebar';
import { WorkspaceProvider } from '@features/workspaces/contexts/WorkspaceContext';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-neutral-50">{children}</main>
      </div>
    </WorkspaceProvider>
  );
}
