'use client';

import { useTranslations } from 'next-intl';

export default function ProjectDetailPanelTitle() {
  const t = useTranslations('projects');

  return (
    <div className='dark:bg-[#0a0a0a] h-[70px] flex items-center justify-center border-b border-gray-200 dark:border-gray-800'>
      <h2
        id='detail-panel-heading'
        className='text-2xl font-bold text-center text-gray-900 dark:text-gray-100'
      >
        {t('details.title')}
      </h2>
    </div>
  );
}
