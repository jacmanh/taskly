import type { Metadata } from 'next';
import '@taskly/design-system/styles/globals.css';
import { QueryProvider } from '../lib/providers/QueryProvider';
import { AuthProvider } from '@features/auth/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Taskly',
  description: 'Task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
