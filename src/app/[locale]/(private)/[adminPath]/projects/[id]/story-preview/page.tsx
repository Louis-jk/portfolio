import { notFound, redirect } from 'next/navigation';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { getPublicLocaleEditorOutput } from '@/lib/project-detail-page/story-content-document';
import { parseProjectId } from '@/lib/http/parse-project-id';
import { getProjectById, readI18n } from '@/modules/projects';
import { getProjectDetailPage } from '@/modules/project-detail-page';
import { requireAuth } from '@/utils/supabase/auth';
import { AdminStoryPreviewClient } from '@/features/admin/projects/components/project-detail/AdminStoryPreviewClient';
import type { I18nLocale } from '@/modules/project-detail-page';

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
