'use client';

import { useLocaleSwitcher } from '../../lib/i18n/use-locale-switcher';
import { locales } from '../../i18n/config';

export function LanguageSwitcher() {
  const { locale, switchLocale, isPending } = useLocaleSwitcher();

  return (
    <select
      value={locale}
      onChange={(e) => switchLocale(e.target.value as (typeof locales)[number])}
      disabled={isPending}
      className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
      aria-label="Select language"
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
}
