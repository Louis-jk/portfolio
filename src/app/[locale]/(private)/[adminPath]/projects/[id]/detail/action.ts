'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/utils/supabase/auth';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  upsertProjectDetailPage,
  type EditorOutput,
} from '@/modules/project-detail-page';

export async function saveProjectDetailPageAction(input: {
  projectId: number;
  locale: string;
  content: EditorOutput;
  isPublic: boolean;
}) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false as const, error: 'Unauthorized' };
  }

  try {
    await upsertProjectDetailPage(input.projectId, {
      content: input.content,
      isPublic: input.isPublic,
    });

    revalidatePath(
      `/${input.locale}${ADMIN_ROUTES.PROJECTS}/${input.projectId}/detail`,
    );
    revalidatePath(`/${input.locale}/projects/${input.projectId}/story`);

    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Save failed',
    };
  }
}
