export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export type I18nNamespaces = (typeof i18nNamespaces)[number];
export const i18nNamespaces = [
  'common',
  'auth',
  'tasks',
  'projects',
  'workspaces',
  'draftbatches',
] as const;
