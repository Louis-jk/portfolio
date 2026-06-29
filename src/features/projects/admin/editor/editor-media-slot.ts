type UploadResult = {
  success: boolean;
  file?: { url: string };
  error?: string;
};

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v']);

export function isImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return Boolean(ext && IMAGE_EXTENSIONS.has(ext));
}

export function isVideoFile(file: File): boolean {
  if (file.type.startsWith('video/')) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return Boolean(ext && VIDEO_EXTENSIONS.has(ext));
}

type RenderMediaSlotOptions = {
  label: string;
  kind: 'image' | 'video';
  url?: string;
  isUploading: boolean;
  uploadError: string | null;
  onKindChange: (kind: 'image' | 'video') => void;
  onUpload: (file: File) => void;
  onCaptionChange?: (caption: string) => void;
  caption?: string;
  showKindToggle?: boolean;
};

export function renderMediaSlotControls(
  container: HTMLElement,
  options: RenderMediaSlotOptions,
): void {
  container.replaceChildren();

  const header = document.createElement('div');
  header.className = 'flex flex-wrap items-center justify-between gap-2';

  const title = document.createElement('p');
  title.className = 'text-xs font-semibold uppercase tracking-wide text-zinc-500';
  title.textContent = options.label;
  header.appendChild(title);

  if (options.showKindToggle !== false) {
    const kindSelect = document.createElement('select');
    kindSelect.className =
      'rounded border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900';
    kindSelect.innerHTML =
      '<option value="image">Image</option><option value="video">Video</option>';
    kindSelect.value = options.kind;
    kindSelect.addEventListener('change', () => {
      options.onKindChange(kindSelect.value === 'video' ? 'video' : 'image');
    });
    header.appendChild(kindSelect);
  }

  container.appendChild(header);

  if (options.url) {
    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900';

    if (options.kind === 'video') {
      const video = document.createElement('video');
      video.src = options.url;
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      video.className = 'block h-auto max-h-80 w-full bg-black object-contain';
      mediaWrap.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = options.url;
      img.className = 'block h-auto max-h-80 w-full object-contain';
      mediaWrap.appendChild(img);
    }

    container.appendChild(mediaWrap);
  } else if (options.isUploading) {
    const status = document.createElement('p');
    status.className = 'text-sm font-medium text-purple-600 dark:text-purple-400';
    status.dataset.uploadStatus = 'true';
    status.textContent = '업로드 중…';
    container.appendChild(status);
  } else {
    const zone = document.createElement('div');
    zone.className =
      'flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 text-center transition hover:border-purple-400 hover:bg-purple-50/50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-purple-500 dark:hover:bg-purple-950/20';

    const hint = document.createElement('p');
    hint.className = 'text-xs text-zinc-500 dark:text-zinc-400';
    hint.textContent =
      options.kind === 'video'
        ? '영상 드래그 또는 클릭 (mp4, webm, mov)'
        : '이미지 드래그 또는 클릭';

    const input = document.createElement('input');
    input.type = 'file';
    input.className = 'hidden';
    input.accept =
      options.kind === 'video'
        ? 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov'
        : 'image/*';

    zone.appendChild(hint);
    zone.appendChild(input);

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('border-purple-500');
    });
    zone.addEventListener('dragleave', () => {
      zone.classList.remove('border-purple-500');
    });
    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();
      zone.classList.remove('border-purple-500');
      const file = event.dataTransfer?.files?.[0];
      if (file) options.onUpload(file);
    });
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file) options.onUpload(file);
    });

    container.appendChild(zone);
  }

  if (options.uploadError) {
    const error = document.createElement('p');
    error.className = 'text-sm text-red-500';
    error.textContent = options.uploadError;
    container.appendChild(error);
  }

  if (options.onCaptionChange) {
    const caption = document.createElement('input');
    caption.type = 'text';
    caption.placeholder = 'Caption (optional)';
    caption.value = options.caption ?? '';
    caption.className =
      'w-full rounded border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900';
    caption.addEventListener('input', () => {
      options.onCaptionChange?.(caption.value);
    });
    container.appendChild(caption);
  }
}

export type MediaUploader = (
  file: File,
  onProgress?: (message: string) => void,
) => Promise<UploadResult>;

export async function uploadMediaFile(
  file: File,
  kind: 'image' | 'video',
  uploadImage: MediaUploader,
  uploadVideo: MediaUploader,
  onProgress?: (message: string) => void,
): Promise<UploadResult> {
  if (kind === 'video') {
    if (!isVideoFile(file)) {
      return { success: false, error: 'mp4, webm, mov 영상만 업로드할 수 있습니다.' };
    }
    return uploadVideo(file, onProgress);
  }

  if (!isImageFile(file)) {
    return { success: false, error: '이미지 파일만 업로드할 수 있습니다.' };
  }
  return uploadImage(file);
}
