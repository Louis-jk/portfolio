import { revalidatePath, revalidateTag } from 'next/cache';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { PROJECTS_LIST_CACHE_TAG } from '@/lib/cache-tags';

export function revalidateProjectsList() {
  revalidateTag(PROJECTS_LIST_CACHE_TAG);
  revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
  revalidatePath(`/[locale]${ADMIN_ROUTES.DASHBOARD}`, 'page');
  revalidatePath('/[locale]', 'layout');
}
