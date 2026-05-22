'use client';

import React, { useEffect, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePathname, useRouter } from '@/i18n/navigation';
import Flag from 'react-world-flags';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  getEnglishLanguageCode,
  LOCALE_TO_NUMERIC_CODE,
} from '@/utils/get-code';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const LANGUAGES = [
  { locale: 'en', label: 'English', code: getEnglishLanguageCode() },
  { locale: 'ja', label: '日本語', code: LOCALE_TO_NUMERIC_CODE['ja'] },
  { locale: 'ko', label: '한국어', code: LOCALE_TO_NUMERIC_CODE['ko'] },
];

const LanguageSelector = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const t = useTranslations('modal.languageSelector');
  const currentLocale = useLocale();
  const pathname = usePathname(); // next-intl: locale 제외한 경로
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const sortedLanguages = [
    ...LANGUAGES.filter((l) => l.locale === currentLocale),
    ...LANGUAGES.filter((l) => l.locale !== currentLocale),
  ];
  const handleLocaleChange = (e: React.MouseEvent, targetLocale: string) => {
    e.preventDefault();
    if (isPending) return;

    setSelectedTarget(targetLocale);

    const query = searchParams.toString()
      ? Object.fromEntries(searchParams.entries())
      : undefined;

    startTransition(() => {
      router.replace({ pathname, query }, { locale: targetLocale });
    });
  };

  useEffect(() => {
    if (!open) {
      setSelectedTarget(null);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const query = searchParams.toString()
        ? Object.fromEntries(searchParams.entries())
        : undefined;

      LANGUAGES.forEach((lang) => {
        if (lang.locale !== currentLocale) {
          router.prefetch({ pathname, query }, { locale: lang.locale });
        }
      });
    }
  }, [open, currentLocale, pathname, searchParams, router]);

  return (
    <Dialog open={open} onOpenChange={isPending ? () => {} : setOpen}>
      <DialogContent
        className={cn(
          isPending && 'pointer-events-none transition-all duration-200',
        )}
      >
        <DialogHeader className='mb-5'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <ul className='flex flex-col text-foreground'>
          {sortedLanguages.map((lang) => {
            const isActive = lang.locale === currentLocale;
            const isJustSelected = selectedTarget === lang.locale;

            return (
              <li
                key={lang.locale}
                className={cn(
                  'px-4 py-6 border-dashed',
                  sortedLanguages.indexOf(lang) === sortedLanguages.length - 1
                    ? 'border-b-0'
                    : 'border-b',
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800/70 font-bold cursor-default'
                    : isJustSelected
                      ? 'bg-purple-700 dark:bg-purple-500 text-white font-bold cursor-default'
                      : isPending
                        ? 'cursor-default text-muted-foreground'
                        : 'hover:bg-purple-700 dark:hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer',
                )}
                tabIndex={isActive ? 0 : -1}
                aria-current={isActive ? 'true' : undefined}
                onClick={(e) => !isActive && handleLocaleChange(e, lang.locale)}
              >
                <div className='flex flex-row items-center gap-2 pointer-events-none select-none'>
                  <Flag code={lang.code} className='w-9 h-7' />
                  <p className='text-lg font-semibold'>{lang.label}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;
