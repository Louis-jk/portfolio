'use client';

import type { I18nLocale } from '@/modules/project-detail-page';

const LOCALES: I18nLocale[] = ['ko', 'ja', 'en'];

const LABELS: Record<I18nLocale, string> = {
  ko: 'KO',
  ja: 'JA',
  en: 'EN',
};

type LocaleTabSwitcherProps = {
  activeLocale: I18nLocale;
  onChange: (locale: I18nLocale) => void;
};

export function LocaleTabSwitcher({
  activeLocale,
  onChange,
}: LocaleTabSwitcherProps) {
  return (
    <div className='inline-flex rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900'>
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type='button'
          onClick={() => onChange(locale)}
          className={`rounded-full px-4 py-1.5 text-xs font-black transition ${
            activeLocale === locale
              ? 'bg-purple-600 text-white'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          {LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
