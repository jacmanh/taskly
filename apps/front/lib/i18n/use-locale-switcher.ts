'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { setUserLocale } from './locale-actions';
import type { Locale } from '../../i18n/config';

export function useLocaleSwitcher() {
  const [isPending, setIsPending] = useState(false);
  const locale = useLocale();

  const switchLocale = async (newLocale: Locale) => {
    setIsPending(true);
    await setUserLocale(newLocale);
    window.location.reload();
  };

  return { locale, switchLocale, isPending };
}
