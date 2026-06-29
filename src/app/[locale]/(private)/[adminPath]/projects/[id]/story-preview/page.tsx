import { notFound, redirect } from 'next/navigation';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { getPublicLocaleEditorOutput } from '@/entities/project-detail-page/lib/story-content-document';
import { parseProjectId } from '@/lib/http/parse-project-id';
import { readI18n } from '@/entities/projects';
import { getProjectById } from '@/entities/projects/server';
import { getProjectDetailPage } from '@/entities/project-detail-page/server';
import { requireAuth } from '@/utils/supabase/auth';
import { AdminStoryPreviewClient } from '@/features/projects/admin';
import type { I18nLocale } from '@/entities/project-detail-page';

export default async function AdminStoryPreviewPage({
  params,
}: {
  params: Promise<{ id: string; locale: string; adminPath: string }>;
}) {
  const auth = await requireAuth();
  const { id, locale } = await params;

  if (!auth.authorized) {
    redirect(`/${locale}${ADMIN_ROUTES.LOGIN}`);
  }

  const projectId = parseProjectId(id);
  if (projectId === null) notFound();

  const [project, detailPage] = await Promise.all([
    getProjectById(projectId),
    getProjectDetailPage(projectId),
  ]);
  if (!project) notFound();

  const content = detailPage?.content
    ? getPublicLocaleEditorOutput(detailPage.content, locale as I18nLocale)
    : null;

  return (
    <AdminStoryPreviewClient
      projectId={projectId}
      projectTitle={readI18n(project.title, locale)}
      content={content}
      backHref={`/${locale}${ADMIN_ROUTES.PROJECTS}/${projectId}/detail`}
    />
  );
}
