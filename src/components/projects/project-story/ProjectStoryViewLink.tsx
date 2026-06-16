'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { useProjectStoryContext } from './ProjectStoryContext';

type ProjectStoryViewLinkProps = {
  projectId: number;
  className?: string;
};

export function ProjectStoryViewLink({
  projectId,
  className = '',
}: ProjectStoryViewLinkProps) {
  const t = useTranslations('projectStory');
  const { openStory } = useProjectStoryContext();

  return (
    <button
      type='button'
      onClick={() => openStory(projectId)}
      className={`inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700 transition hover:bg-purple-100 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-950/70 ${className}`}
    >
      {t('viewStory')}
      <ArrowRight size={16} aria-hidden />
    </button>
  );
}
