'use client';

const MAX_UPLOAD_BYTES = 80 * 1024 * 1024;

function formatMegabytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

/** Upload-ready video file. Compression is skipped for reliability in the browser. */
export async function prepareVideoForUpload(
  file: File,
  onProgress?: (message: string) => void,
): Promise<File> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `영상은 ${formatMegabytes(MAX_UPLOAD_BYTES)} 이하여야 합니다.`,
    );
  }

  onProgress?.('영상 업로드 준비 중…');
  return file;
}
