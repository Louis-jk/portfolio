'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/utils/supabase/auth';
import type {
  EditorOutput,
  StoryContentDocument,
} from '@/entities/project-detail-page';
import { broadcastStoryVisibilityChange } from '@/lib/supabase/broadcast-story-visibility';
import { describeSupabaseEnvMismatch } from '@/lib/supabase/env-alignment';
import { upsertProjectDetailPage } from '@/entities/project-detail-page/server';

export async function saveProjectDetailPageAction(input: {
  projectId: number;
  locale: string;
  content: EditorOutput | StoryContentDocument;
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

    const envMismatch = describeSupabaseEnvMismatch();
    if (envMismatch) {
      console.warn(`[story-visibility] ${envMismatch}`);
    } else {
      try {
        await broadcastStoryVisibilityChange({
          projectId: input.projectId,
          isPublic: input.isPublic,
        });
      } catch (error) {
        console.warn('[story-visibility] Broadcast failed:', error);
      }
    }

    // Do not revalidate the admin editor page — it remounts the client editor.
    revalidatePath(`/${input.locale}/projects/${input.projectId}/story`);
    revalidatePath(`/${input.locale}`);

    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Save failed',
    };
  }
}
