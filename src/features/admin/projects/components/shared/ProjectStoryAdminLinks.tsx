'use client';

import Link from 'next/link';
import { ExternalLink, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { getPublicStoryUrl } from '@/lib/projects/public-story-url';

type ProjectStoryAdminLinksProps = {
  projectId: number;
  locale: string;
  variant?: 'icon' | 'button';
};

export function ProjectStoryAdminLinks({
  projectId,
  locale,
  variant = 'button',
}: ProjectStoryAdminLinksProps) {
  const t = useTranslations('admin.projects');
  const editHref = `/${locale}${ADMIN_ROUTES.PROJECTS}/${projectId}/detail`;
  const previewHref = getPublicStoryUrl(locale, projectId);

  if (variant === 'icon') {
    return (
      <>
        <Link
          href={editHref}
          className='p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'
          title={t('editStory')}
          aria-label={t('editStory')}
        >
          <FileText size={18} />
        </Link>
        <Link
          href={previewHref}
          target='_blank'
          rel='noopener noreferrer'
          className='p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'
          title={t('detailPreviewStory')}
          aria-label={t('detailPreviewStory')}
        >
          <ExternalLink size={18} />
        </Link>
      </>
    );
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Link
        href={editHref}
        className='inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
      >
        <FileText size={16} />
        {t('editStory')}
      </Link>
      <Link
        href={previewHref}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
      >
        <ExternalLink size={16} />
        {t('detailPreviewStory')}
      </Link>
    </div>
  );
}
