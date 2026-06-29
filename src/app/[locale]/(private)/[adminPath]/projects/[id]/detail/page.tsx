import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { readI18n } from '@/entities/projects';
import { getProjectById } from '@/entities/projects/server';
import {
  EMPTY_EDITOR_OUTPUT,
} from '@/entities/project-detail-page';
import { getProjectDetailPage } from '@/entities/project-detail-page/server';
import { parseProjectId } from '@/lib/http/parse-project-id';
import { ProjectDetailEditorClient } from '@/features/projects/admin';

export default async function ProjectDetailEditorPage({
  params,
}: {
  params: Promise<{ id: string; locale: string; adminPath: string }>;
}) {
  const { id, locale } = await params;
  const projectId = parseProjectId(id);
  if (projectId === null) notFound();

  const project = await getProjectById(projectId);
  if (!project) notFound();

  const detailPage = await getProjectDetailPage(projectId);
  const t = await getTranslations('admin.projects');

  return (
    <ProjectDetailEditorClient
      projectId={projectId}
      locale={locale}
      projectTitle={readI18n(project.title, locale) || t('untitledProject')}
      initialContent={detailPage?.content ?? EMPTY_EDITOR_OUTPUT}
      initialIsPublic={detailPage?.isPublic ?? false}
    />
  );
}
