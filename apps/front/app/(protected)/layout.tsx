import { Suspense } from 'react';
import { Sidebar } from '../components/Sidebar';
import { FullPageLoading } from '../components/FullPageLoading';
import { WorkspaceProvider } from '@features/workspaces/contexts/WorkspaceContext';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <WorkspaceProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-neutral-50">{children}</main>
        </div>
      </WorkspaceProvider>
    </Suspense>
  );
}
