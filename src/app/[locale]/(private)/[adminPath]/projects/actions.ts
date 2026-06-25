'use server';

import { revalidateProjectsList } from '@/lib/revalidate-projects';
import { requireAuth } from '@/utils/supabase/auth';
import { deleteProjectDocuments } from '@/lib/rag/portfolio-documents';
import { notifyProjectCatalogChange } from '@/lib/supabase/notify-project-catalog';
import {
  deleteProject as deleteProjectFromApi,
  reorderProjects,
} from '@/modules/projects/server';

export async function updateProjectOrder(projectIds: number[]) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await reorderProjects(projectIds);
    void notifyProjectCatalogChange({ projectId: 0, event: 'reorder' });
    revalidateProjectsList();
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
    void notifyProjectCatalogChange({ projectId, event: 'delete' });
    revalidateProjectsList();
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
