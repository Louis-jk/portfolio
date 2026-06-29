'use client';

import { useTranslations } from 'next-intl';

export default function ProjectDetailEmptyState() {
  const t = useTranslations('projects');

  return (
    <section
      className='flex items-center justify-center h-full min-h-[500px]'
      aria-labelledby='detail-empty-state-title'
    >
      <div className='text-center' role='status'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center'>
          <svg
            className='w-8 h-8 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
            />
          </svg>
        </div>
        <p
          id='detail-empty-state-title'
          className='text-gray-500 dark:text-gray-400 text-lg font-medium'
        >
          {t('emptyState.title')}
        </p>
        <p className='text-gray-400 dark:text-gray-500 text-sm mt-2'>
          {t('emptyState.hint')}
        </p>
      </div>
    </section>
  );
}
