import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProjectById, readI18n } from '@/modules/projects';
import {
  EMPTY_EDITOR_OUTPUT,
  getProjectDetailPage,
} from '@/modules/project-detail-page';
import { parseProjectId } from '@/lib/http/parse-project-id';
import { ProjectDetailEditorClient } from '@/features/admin/projects/components/project-detail/ProjectDetailEditorClient';

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
