# Internationalization (i18n) Setup

## Overview
This project uses `next-intl` v4.0 for internationalization with cookie-based locale storage.

## Supported Languages
- English (en) - Default
- French (fr)

## Usage

### Using translations in Client Components

```typescript
'use client';
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  return <button>{t('save')}</button>;
}
```

### Using translations in Server Components

```typescript
import { getTranslations } from 'next-intl/server';

async function MyServerComponent() {
  const t = await getTranslations('tasks');
  return <h1>{t('title')}</h1>;
}
```

### Switching Locales

```typescript
'use client';
import { useLocaleSwitcher } from '@/lib/i18n/use-locale-switcher';

function LanguageSelector() {
  const { locale, switchLocale, isPending } = useLocaleSwitcher();
  
  return (
    <select 
      value={locale} 
      onChange={(e) => switchLocale(e.target.value as 'en' | 'fr')}
      disabled={isPending}
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

## Translation Namespaces

Translations are organized by feature:

- `common` - Common UI terms (save, cancel, edit, delete, etc.)
- `auth` - Authentication related (login, register, logout, etc.)
- `tasks` - Task management specific
- `projects` - Project management specific
- `workspaces` - Workspace management specific

## File Structure

```
apps/front/
├── i18n/
│   ├── config.ts          # Locale configuration
│   └── request.ts         # Message loading config
├── messages/
│   ├── en/                # English translations
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── tasks.json
│   │   ├── projects.json
│   │   └── workspaces.json
│   └── fr/                # French translations
│       ├── common.json
│       ├── auth.json
│       ├── tasks.json
│       ├── projects.json
│       └── workspaces.json
└── lib/
    └── i18n/
        ├── locale-actions.ts      # Server action to set locale
        └── use-locale-switcher.ts # Client hook for locale switching
```

## How It Works

1. **Cookie Storage**: User's locale preference is stored in `NEXT_LOCALE` cookie (persists for 1 year)
2. **Middleware**: Reads locale from cookie and sets it in response headers
3. **Server-side**: `getRequestConfig` in `i18n/request.ts` loads appropriate translation files
4. **Client-side**: `NextIntlClientProvider` provides translations to React components

## Adding New Languages

1. Add locale to `apps/front/i18n/config.ts`:
   ```typescript
   export const locales = ['en', 'fr', 'es'] as const;
   ```

2. Create translation files in `messages/es/` directory

3. Update `i18n/request.ts` to import new locale files

4. Add option to language selector

## Future Enhancements

When backend locale storage is implemented:
- Fetch user's locale preference from API on login
- Update locale switcher to call API endpoint
- Sync cookie with database value
