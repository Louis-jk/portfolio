import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ko', 'ja'],

  // Used when no locale matches
  defaultLocale: 'en',
  pathnames: {
    '/': {
      en: '/',
      ko: '/',
      ja: '/',
    },
  },
});
