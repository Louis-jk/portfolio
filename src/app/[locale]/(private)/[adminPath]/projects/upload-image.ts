'use server';

import { requireAuth } from '@/utils/supabase/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const BUCKET = 'project-images';
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

export async function uploadProjectImage(
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
      error: '이미지는 5MB 이하여야 합니다.',
    };
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !ALLOWED_IMAGE_EXTENSIONS.has(fileExt)) {
    return {
      success: false,
      error: 'jpg, png, webp, gif 이미지만 업로드할 수 있습니다.',
    };
  }
  if (file.type && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      success: false,
      error: '허용되지 않은 이미지 형식입니다.',
    };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

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
    console.error('Project image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
