import { Locale } from '../i18n/config';
import { messages } from '../i18n/message-types';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
