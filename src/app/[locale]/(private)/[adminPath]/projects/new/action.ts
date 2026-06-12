'use server';

import { revalidatePath } from 'next/cache';
import { ADMIN_ROUTES } from '@/lib/constants';
import { requireAuth } from '@/utils/supabase/auth';
import type { ProjectFormData } from '@/modules/projects';
import { validateProjectServerPayload } from '@/modules/projects';
import { scheduleProjectIndexing } from '@/lib/rag/schedule-project-indexing';
import {
  buildProjectIndexingInput,
  createProject,
} from '@/modules/projects/projects.service';

export async function saveProject(data: ProjectFormData) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = validateProjectServerPayload(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  try {
    const validData = parsed.data;
    const result = await createProject(validData);

    scheduleProjectIndexing(
      buildProjectIndexingInput(result.id, validData),
      'Project save',
    );

    revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
    revalidatePath('/[locale]', 'layout');

    return { success: true, id: result.id };
  } catch (error) {
    console.error('❌ Project Save Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save project',
    };
  }
}
