import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import Flag from 'react-world-flags';
import { useLocale } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  getEnglishLanguageCode,
  LOCALE_TO_NUMERIC_CODE,
} from '@/util/get-code';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const LanguageSelector = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const t = useTranslations('modal.languageSelector');
  const currentLocale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const LANGUAGES = [
    { locale: 'en', label: 'English', code: getEnglishLanguageCode() },
    { locale: 'ja', label: '日本語', code: LOCALE_TO_NUMERIC_CODE['ja'] },
    { locale: 'ko', label: '한국어', code: LOCALE_TO_NUMERIC_CODE['ko'] },
  ];
  const sortedLanguages = [
    ...LANGUAGES.filter((l) => l.locale === currentLocale),
    ...LANGUAGES.filter((l) => l.locale !== currentLocale),
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='mb-5'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <ul className='flex flex-col text-foreground'>
          {sortedLanguages.map((lang) => {
            const isActive = lang.locale === currentLocale;
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
                    : 'hover:bg-purple-700 dark:hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer'
                )}
                tabIndex={isActive ? 0 : -1}
                aria-current={isActive ? 'true' : undefined}
              >
                {isActive ? (
                  <div className='flex flex-row items-center gap-2 pointer-events-none select-none'>
                    <Flag code={lang.code} className='w-9 h-7' />
                    <p className='text-lg font-semibold'>{lang.label}</p>
                  </div>
                ) : (
                  <Link
                    href={`/${lang.locale}${pathname.replace(
                      `/${currentLocale}`,
                      ''
                    )}${
                      searchParams.toString()
                        ? `?${searchParams.toString()}`
                        : ''
                    }`}
                    className='flex flex-row items-center gap-2'
                    tabIndex={-1}
                  >
                    <Flag code={lang.code} className='w-9 h-7' />
                    <p className='text-lg font-semibold'>{lang.label}</p>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;
