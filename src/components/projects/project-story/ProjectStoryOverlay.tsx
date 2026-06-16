'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { EditorOutput, I18nLocale } from '@/modules/project-detail-page';
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
  const [content, setContent] = useState<EditorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStory() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/projects/${projectId}/story`);
        if (!response.ok) {
          if (!cancelled) setContent(null);
          return;
        }

        const data = (await response.json()) as { content: EditorOutput | null };
        if (!cancelled) {
          setContent(data.content ?? null);
        }
      } catch {
        if (!cancelled) setContent(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadStory();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <ProjectStoryShell
      locale={locale}
      projectId={projectId}
      projectTitle={projectTitle || t('untitled')}
      content={content}
      emptyMessage={isLoading ? t('loading') : t('empty')}
      isLoading={isLoading}
      onClose={onClose}
    />
  );
}
