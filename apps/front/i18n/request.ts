import { getRequestConfig, RequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { locales, defaultLocale, i18nNamespaces } from './config';
import { Locale } from 'next-intl';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  let locale: Locale = (localeCookie?.value as Locale) || defaultLocale;

  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  const config: RequestConfig = {
    locale,
    messages: {},
  };

  for (const ns of i18nNamespaces) {
    if (config.messages)
      config.messages[ns] = await loadTranslations(locale, ns);
  }

  return config;
});

const loadTranslations = async (locale: Locale, ns: string) => {
  try {
    return (await import(`../messages/${locale}/${ns}.json`)).default;
  } catch {
    return (await import(`../messages/${defaultLocale}/${ns}.json`)).default;
  }
};
