'use server';

import { revalidatePath } from 'next/cache';
import { ADMIN_ROUTES } from '@/lib/constants';
import { requireAuth } from '@/utils/supabase/auth';
import { deleteProjectDocuments } from '@/lib/rag/portfolio-documents';
import {
  deleteProject as deleteProjectFromApi,
  reorderProjects,
} from '@/modules/projects/projects.service';

export async function updateProjectOrder(projectIds: number[]) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await reorderProjects(projectIds);
    revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('❌ Project Order Update Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order',
    };
  }
}

export async function deleteProject(projectId: number) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await deleteProjectFromApi(projectId);
    try {
      await deleteProjectDocuments(projectId);
    } catch (indexError) {
      console.error('⚠️ Project deleted but document cleanup failed:', {
        projectId,
        error: indexError,
      });
    }
    revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('❌ Project Delete Error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete project',
    };
  }
}
