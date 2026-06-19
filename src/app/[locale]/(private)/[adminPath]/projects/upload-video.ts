'use server';

import { requireAuth } from '@/utils/supabase/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const BUCKET = 'project-images';
const MAX_FILE_BYTES = 80 * 1024 * 1024;
const ALLOWED_VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v']);

export async function uploadProjectVideo(
  formData: FormData,
): Promise<
  { success: true; url: string } | { success: false; error: string }
> {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'No file provided' };
  }
  if (file.size > MAX_FILE_BYTES) {
    return {
      success: false,
      error: '영상은 80MB 이하여야 합니다.',
    };
  }

  const MIME_TO_EXT: Record<string, string> = {
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  };

  let fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !ALLOWED_VIDEO_EXTENSIONS.has(fileExt)) {
    fileExt = MIME_TO_EXT[file.type];
  }
  if (!fileExt || !ALLOWED_VIDEO_EXTENSIONS.has(fileExt)) {
    return {
      success: false,
      error: 'mp4, webm, mov 영상만 업로드할 수 있습니다.',
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const fileName = `videos/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Project video upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
