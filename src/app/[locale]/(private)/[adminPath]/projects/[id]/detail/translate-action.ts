'use server';

import { requireAuth } from '@/utils/supabase/auth';
import type { EditorOutput, I18nLocale } from '@/entities/project-detail-page';
import { translateStoryContent } from '@/entities/project-detail-page/lib/translate-story-content';

export async function translateStoryContentAction(input: {
  content: EditorOutput;
  targetLocale: I18nLocale;
  overwrite?: boolean;
}): Promise<
  | { success: true; content: EditorOutput }
  | { success: false; error: string }
> {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  if (input.targetLocale === 'ko') {
    return { success: false, error: 'Source locale is Korean.' };
  }

  try {
    const content = await translateStoryContent(
      input.content,
      input.targetLocale,
      { overwrite: input.overwrite ?? false },
    );
    return { success: true, content };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Translation failed',
    };
  }
}
