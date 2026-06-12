'use server';

import { revalidatePath } from 'next/cache';
import { ADMIN_ROUTES } from '@/lib/constants';
import { requireAuth } from '@/utils/supabase/auth';
import type { ProjectFormData } from '@/modules/projects';
import { validateProjectServerPayload } from '@/modules/projects';
import { scheduleProjectIndexing } from '@/lib/rag/schedule-project-indexing';
import {
  buildProjectIndexingInputFromAdmin,
  getProjectById,
  updateProject as updateProjectViaApi,
} from '@/modules/projects/projects.service';

export async function updateProject(
  projectId: number,
  data: ProjectFormData,
) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = validateProjectServerPayload(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  try {
    const id = Number(projectId);
    if (!Number.isInteger(id) || id <= 0) {
      return {
        success: false,
        error: 'Invalid project ID',
      };
    }

    const validData = parsed.data;
    await updateProjectViaApi(id, validData);

    const projectForIndex = await getProjectById(id);
    if (!projectForIndex) {
      throw new Error('Project not found after update');
    }

    scheduleProjectIndexing(
      buildProjectIndexingInputFromAdmin(projectForIndex),
      'Project update',
    );

    revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
    revalidatePath('/[locale]', 'layout');
    return { success: true, id };
  } catch (error) {
    console.error('❌ Project Update Error:', error);
    const err = error as Error & { cause?: unknown };
    const message =
      err.message ||
      (typeof err.cause === 'string' ? err.cause : 'Failed to update project');
    return { success: false, error: message };
  }
}
