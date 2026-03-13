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
    '/success-gate-raon-2019': {
      en: '/success-gate-raon-2019',
      ko: '/success-gate-raon-2019',
      ja: '/success-gate-raon-2019',
    },
  },
});
