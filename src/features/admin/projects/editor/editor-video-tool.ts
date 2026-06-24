import type {
  BlockTool,
  BlockToolConstructorOptions,
  PasteEvent,
} from '@editorjs/editorjs';

type UploadResult = {
  success: boolean;
  file?: { url: string };
  error?: string;
};

const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v']);

function isVideoFile(file: File): boolean {
  if (file.type.startsWith('video/')) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return Boolean(ext && VIDEO_EXTENSIONS.has(ext));
}

type VideoData = {
  file?: { url?: string };
  caption?: string;
};

const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
];

function createDropZoneLabel(): HTMLParagraphElement {
  const label = document.createElement('p');
  label.className = 'text-sm text-zinc-500 dark:text-zinc-400';
  label.textContent = '영상을 드래그하거나 클릭해 업로드 (mp4, webm, mov)';
  return label;
}

function createUploadingLabel(message: string): HTMLParagraphElement {
  const label = document.createElement('p');
  label.className = 'text-sm font-medium text-purple-600 dark:text-purple-400';
  label.textContent = message;
  return label;
}

export function createEditorVideoTool(
  uploadByFile: (
    file: File,
    onProgress?: (message: string) => void,
  ) => Promise<UploadResult>,
) {
  return class EditorVideoTool implements BlockTool {
    static get toolbox() {
      return {
        title: 'Video',
        icon: '<svg width="18" height="14" viewBox="0 0 18 14" xmlns="http://www.w3.org/2000/svg"><path d="M16 0H2a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V2a2 2 0 00-2-2zm-1 9.5l-5-3v6l5-3z"/></svg>',
      };
    }

    static get pasteConfig() {
      return {
        files: {
          mimeTypes: VIDEO_MIME_TYPES,
        },
      };
    }

    private data: VideoData;
    private wrapper: HTMLElement | null = null;
    private isUploading = false;
    private uploadError: string | null = null;

    constructor({ data }: BlockToolConstructorOptions<VideoData>) {
      this.data = data ?? {};
    }

    render() {
      const wrapper = document.createElement('div');
      wrapper.className = 'space-y-3';

      let captionParent: HTMLElement = wrapper;

      if (this.data.file?.url) {
        const media = document.createElement('div');
        media.className = 'space-y-1';
        const video = document.createElement('video');
        video.src = this.data.file.url;
        video.controls = true;
        video.preload = 'metadata';
        video.playsInline = true;
        video.className = 'block h-auto w-full rounded-xl bg-black';
        media.appendChild(video);
        wrapper.appendChild(media);
        captionParent = media;
      } else if (this.isUploading) {
        const status = createUploadingLabel('영상 업로드 중…');
        status.dataset.uploadStatus = 'true';
        wrapper.appendChild(status);
      } else {
        const zone = document.createElement('div');
        zone.className =
          'flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 transition hover:border-purple-400 hover:bg-purple-50/50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-purple-500 dark:hover:bg-purple-950/20';

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov';
        input.className = 'hidden';

        zone.appendChild(createDropZoneLabel());
        zone.appendChild(input);

        zone.addEventListener('click', () => {
          input.click();
        });

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
          if (file) void this.handleUpload(file);
        });

        input.addEventListener('change', () => {
          const file = input.files?.[0];
          if (file) void this.handleUpload(file);
        });

        wrapper.appendChild(zone);
      }

      if (this.uploadError) {
        const error = document.createElement('p');
        error.className = 'text-sm text-red-500';
        error.textContent = this.uploadError;
        wrapper.appendChild(error);
      }

      const caption = document.createElement('input');
      caption.type = 'text';
      caption.placeholder = 'Caption';
      caption.value = this.data.caption ?? '';
      caption.className =
        'w-full rounded border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900';
      caption.addEventListener('input', () => {
        this.data.caption = caption.value;
      });

      this.wrapper = wrapper;
      captionParent.appendChild(caption);
      return wrapper;
    }

    onPaste(event: PasteEvent) {
      if (event.type !== 'file' || !('file' in event.detail)) return;
      const file = event.detail.file as File;
      void this.handleUpload(file);
    }

    save() {
      return {
        file: this.data.file,
        caption: this.data.caption ?? '',
      };
    }

    private async handleUpload(file: File) {
      if (!isVideoFile(file)) {
        this.showError('mp4, webm, mov 영상만 업로드할 수 있습니다.');
        return;
      }

      this.isUploading = true;
      this.uploadError = null;
      this.rerender();

      const result = await uploadByFile(file, (message) => {
        const status = this.wrapper?.querySelector('[data-upload-status]');
        if (status) status.textContent = message;
      });

      this.isUploading = false;

      if (!result.success || !result.file?.url) {
        this.uploadError = result.error ?? '영상 업로드에 실패했습니다.';
        this.rerender();
        return;
      }

      this.data.file = { url: result.file.url };
      this.uploadError = null;
      this.rerender();
    }

    private showError(message: string) {
      this.uploadError = message;
      this.isUploading = false;
      this.rerender();
    }

    private rerender() {
      const current = this.wrapper;
      if (!current) return;
      const parent = current.parentElement;
      if (!parent) return;
      const next = this.render();
      parent.replaceChild(next, current);
      this.wrapper = next;
    }
  };
}
