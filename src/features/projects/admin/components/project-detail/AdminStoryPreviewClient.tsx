'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ProjectStoryShell } from '@/features/projects/public/project-story/ProjectStoryShell';
import type { EditorOutput, I18nLocale } from '@/entities/project-detail-page';

type AdminStoryPreviewClientProps = {
  projectId: number;
  projectTitle: string;
  content: EditorOutput | null;
  backHref: string;
};

export function AdminStoryPreviewClient({
  projectId,
  projectTitle,
  content,
  backHref,
}: AdminStoryPreviewClientProps) {
  const router = useRouter();
  const locale = useLocale() as I18nLocale;
  const t = useTranslations('projectStory');

  return (
    <ProjectStoryShell
      locale={locale}
      projectId={projectId}
      projectTitle={projectTitle || t('untitled')}
      content={content}
      emptyMessage={t('empty')}
      onClose={() => router.push(backHref)}
    />
  );
}
