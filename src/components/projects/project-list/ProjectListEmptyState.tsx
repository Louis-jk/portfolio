'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type ProjectListEmptyStateProps = {
  compact?: boolean;
};

export default function ProjectListEmptyState({
  compact = false,
}: ProjectListEmptyStateProps) {
  const t = useTranslations('projects');

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center',
        compact ? 'py-12' : 'h-[calc(100vh-275px)]',
      )}
    >
      <p className='text-center'>{t('noItemsFound')}</p>
    </section>
  );
}
