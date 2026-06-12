'use client';

import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type ProjectListTitleProps = {
  sticky?: boolean;
};

export default function ProjectListTitle({ sticky = false }: ProjectListTitleProps) {
  const t = useTranslations('projects');
  const locale = useLocale();

  return (
    <div
      data-project-list-title
      className={cn(
        'dark:bg-[#0a0a0a] h-[70px] flex items-center justify-center border-b border-gray-200 dark:border-gray-800 transition-all duration-200',
        sticky && 'sticky top-[55px] z-30',
      )}
    >
      <h2
        id='project-list-heading'
        className={cn(
          'text-2xl font-bold text-center text-gray-900 dark:text-gray-100',
          locale === 'ja' && 'tracking-[.25em]',
        )}
      >
        {t('title')}
      </h2>
    </div>
  );
}
