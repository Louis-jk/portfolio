import type { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';
import { STORY_EDITOR_BODY_CLASS } from '@/constants/story-typography';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { normalizeParagraphHtml } from '@/entities/project-detail-page/lib/paragraph-html';
import type { StoryMediaTextBlockData } from '@/entities/project-detail-page/lib/story-layout-types';
import {
  normalizeStoryMediaTextLayout,
  readStoryMediaTextData,
} from '@/entities/project-detail-page/lib/story-layout-types';
import { getLeafContentEditable } from './editor-html-persistence';
import {
  getActiveLocale,
  registerI18nTool,
  type I18nToolInstance,
} from './locale-context';
import { attachContentEditableTextPaste } from './editor-text-paste';
import {
  type MediaUploader,
  renderMediaSlotControls,
  uploadMediaFile,
} from './editor-media-slot';

type UploadBundle = {
  uploadImage: MediaUploader;
  uploadVideo: MediaUploader;
};

function readHtmlFromData(data: Record<string, unknown> | undefined): string {
  if (typeof data?.html === 'string') return data.html;
  return '';
}

function readHtmlFromRoot(root: HTMLElement): string {
  const editable = getLeafContentEditable(root) ?? root;
  return normalizeParagraphHtml(sanitizeHtml(editable.innerHTML));
}

export function createEditorMediaTextTool({
  uploadImage,
  uploadVideo,
}: UploadBundle) {
  return class EditorMediaTextTool implements BlockTool, I18nToolInstance {
    static get toolbox() {
      return {
        title: 'Media + Text',
        icon: '<svg width="18" height="14" viewBox="0 0 18 14" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="2" width="7" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M11 4h6M11 7h6M11 10h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      };
    }

    static get isReadOnlySupported() {
      return true;
    }

    private data: StoryMediaTextBlockData;
    private html = '';
    private readOnly: boolean;
    private wrapper: HTMLElement | null = null;
    private mediaMount: HTMLElement | null = null;
    private textEl: HTMLElement | null = null;
    private isUploading = false;
    private uploadError: string | null = null;
    private unregister: (() => void) | null = null;
    private detachTextPaste: (() => void) | null = null;

    constructor({
      data,
      readOnly,
    }: BlockToolConstructorOptions<StoryMediaTextBlockData>) {
      this.data = readStoryMediaTextData((data ?? {}) as Record<string, unknown>);
      this.html = readHtmlFromData(data as Record<string, unknown>);
      this.readOnly = Boolean(readOnly);
    }

    render() {
      const wrapper = document.createElement('div');
      wrapper.className =
        'story-layout-admin space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40';

      const controls = document.createElement('div');
      controls.className = 'flex flex-wrap items-center gap-3';

      const layoutSelect = document.createElement('select');
      layoutSelect.className =
        'rounded border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900';
      layoutSelect.innerHTML =
        '<option value="media-left">미디어 왼쪽</option><option value="media-right">미디어 오른쪽</option>';
      layoutSelect.value = this.data.layout;
      layoutSelect.addEventListener('change', () => {
        this.data.layout = normalizeStoryMediaTextLayout(layoutSelect.value);
        this.applyLayoutClass();
      });
      controls.appendChild(layoutSelect);

      const localeHint = document.createElement('span');
      localeHint.className = 'text-xs text-zinc-400';
      localeHint.textContent = `텍스트: ${getActiveLocale().toUpperCase()}`;
      controls.appendChild(localeHint);

      wrapper.appendChild(controls);

      const grid = document.createElement('div');
      grid.className = 'story-layout-admin__grid gap-4';
      grid.dataset.layout = this.data.layout;

      const mediaMount = document.createElement('div');
      mediaMount.className = 'story-layout-admin__media min-w-0';
      this.renderMediaSlot(mediaMount);

      const textMount = document.createElement('div');
      textMount.className = 'story-layout-admin__text min-w-0';

      const textEl = document.createElement('div');
      textEl.contentEditable = this.readOnly ? 'false' : 'true';
      textEl.dataset.placeholder = '설명 텍스트를 입력하세요…';
      textEl.className = [
        'outline-none min-h-[6rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950',
        STORY_EDITOR_BODY_CLASS,
      ].join(' ');
      textEl.innerHTML = sanitizeHtml(this.html);

      if (!this.readOnly) {
        const syncHtml = () => {
          if (!this.textEl) return;
          this.html = readHtmlFromRoot(this.textEl);
        };
        textEl.addEventListener('input', syncHtml);
        this.detachTextPaste = attachContentEditableTextPaste(textEl, syncHtml);
      }

      textMount.appendChild(textEl);
      grid.appendChild(mediaMount);
      grid.appendChild(textMount);
      wrapper.appendChild(grid);

      this.wrapper = wrapper;
      this.mediaMount = mediaMount;
      this.textEl = textEl;
      this.unregister = registerI18nTool(this);
      this.applyLayoutClass();
      return wrapper;
    }

    updateLocale() {
      if (!this.textEl) return;
      this.textEl.innerHTML = sanitizeHtml(this.html);
    }

    syncActiveLocaleToData() {
      if (!this.textEl || this.readOnly) return;
      this.html = readHtmlFromRoot(this.textEl);
    }

    save() {
      this.syncActiveLocaleToData();
      return {
        layout: this.data.layout,
        mediaType: this.data.mediaType,
        file: this.data.file,
        html: this.html,
      };
    }

    destroy() {
      this.detachTextPaste?.();
      this.detachTextPaste = null;
      this.unregister?.();
      this.unregister = null;
      this.wrapper = null;
      this.mediaMount = null;
      this.textEl = null;
    }

    private applyLayoutClass() {
      const grid = this.wrapper?.querySelector('.story-layout-admin__grid');
      if (!(grid instanceof HTMLElement)) return;
      grid.dataset.layout = this.data.layout;
    }

    private renderMediaSlot(mount: HTMLElement) {
      renderMediaSlotControls(mount, {
        label: 'Media',
        kind: this.data.mediaType,
        url: this.data.file?.url,
        isUploading: this.isUploading,
        uploadError: this.uploadError,
        onKindChange: (kind) => {
          this.data.mediaType = kind;
          this.data.file = undefined;
          this.uploadError = null;
          this.rerenderMedia();
        },
        onUpload: (file) => {
          void this.handleUpload(file);
        },
        showKindToggle: true,
      });
    }

    private async handleUpload(file: File) {
      this.isUploading = true;
      this.uploadError = null;
      this.rerenderMedia();

      const result = await uploadMediaFile(
        file,
        this.data.mediaType,
        uploadImage,
        uploadVideo,
        (message) => {
          const status = this.mediaMount?.querySelector('[data-upload-status]');
          if (status) status.textContent = message;
        },
      );

      this.isUploading = false;

      if (!result.success || !result.file?.url) {
        this.uploadError = result.error ?? '업로드에 실패했습니다.';
        this.rerenderMedia();
        return;
      }

      this.data.file = { url: result.file.url };
      this.uploadError = null;
      this.rerenderMedia();
    }

    private rerenderMedia() {
      if (!this.mediaMount) return;
      this.renderMediaSlot(this.mediaMount);
    }
  };
}
