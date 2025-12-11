'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { setUserLocale } from './locale-actions';
import type { Locale } from '../../i18n/config';

export function useLocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const switchLocale = (newLocale: Locale) => {
    startTransition(async () => {
      await setUserLocale(newLocale);
      window.location.reload();
    });
  };

  return { locale, switchLocale, isPending };
}
