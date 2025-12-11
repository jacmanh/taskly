import type { Metadata } from 'next';
import '@taskly/design-system/styles/globals.css';
import { QueryProvider } from '../lib/providers/QueryProvider';
import { AuthProvider } from '@features/auth/contexts/AuthContext';
import {
  DrawerProvider,
  DrawerContainer,
  ConfirmationModalProvider,
} from '@taskly/design-system';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Taskly',
  description: 'Task management application',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <DrawerProvider>
                <ConfirmationModalProvider>
                  {children}
                  <DrawerContainer />
                </ConfirmationModalProvider>
              </DrawerProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
