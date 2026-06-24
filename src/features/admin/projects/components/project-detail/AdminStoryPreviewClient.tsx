'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ProjectStoryShell } from '@/components/projects/project-story/ProjectStoryShell';
import type { EditorOutput, I18nLocale } from '@/modules/project-detail-page';

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
