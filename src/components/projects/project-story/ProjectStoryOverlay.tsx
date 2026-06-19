'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import type { I18nLocale } from '@/modules/project-detail-page';
import { projectStoryOverlayQueryOptions } from '@/lib/projects/project-story-query';
import { ProjectStoryShell } from './ProjectStoryShell';

type ProjectStoryOverlayProps = {
  projectId: number;
  projectTitle: string;
  onClose: () => void;
};

export function ProjectStoryOverlay({
  projectId,
  projectTitle,
  onClose,
}: ProjectStoryOverlayProps) {
  const locale = useLocale() as I18nLocale;
  const t = useTranslations('projectStory');

  const { data, isPending, isFetching } = useQuery({
    ...projectStoryOverlayQueryOptions(projectId),
  });

  const content = data?.content ?? null;
  const isLoading = isPending && !data;

  return (
    <ProjectStoryShell
      locale={locale}
      projectId={projectId}
      projectTitle={projectTitle || t('untitled')}
      content={content}
      emptyMessage={isLoading ? t('loading') : t('empty')}
      isLoading={isLoading}
      isRefreshing={Boolean(data && isFetching)}
      onClose={onClose}
    />
  );
}
