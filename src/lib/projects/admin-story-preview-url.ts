import { ADMIN_ROUTES } from '@/constants/admin-routes';

/** Admin-only story preview (works when detail page is PRIVATE). */
export function getAdminStoryPreviewUrl(locale: string, projectId: number) {
  return `/${locale}${ADMIN_ROUTES.PROJECTS}/${projectId}/story-preview`;
}
