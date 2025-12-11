'use server';

import { cookies } from 'next/headers';
import type { Locale } from '../../i18n/config';

export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', locale, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
  });
}
