import type { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';
import type {
  StoryMediaKind,
  StoryMediaRowBlockData,
  StoryMediaSlotData,
} from '@/entities/project-detail-page/lib/story-layout-types';
import { readStoryMediaRowData } from '@/entities/project-detail-page/lib/story-layout-types';
import {
  type MediaUploader,
  renderMediaSlotControls,
  uploadMediaFile,
} from './editor-media-slot';

type UploadBundle = {
  uploadImage: MediaUploader;
  uploadVideo: MediaUploader;
};

type SlotSide = 'left' | 'right';

export function createEditorMediaRowTool({
  uploadImage,
  uploadVideo,
}: UploadBundle) {
  return class EditorMediaRowTool implements BlockTool {
    static get toolbox() {
      return {
        title: 'Media Row',
        icon: '<svg width="18" height="14" viewBox="0 0 18 14" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="2" width="7" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="2" width="7" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
      };
    }

    static get isReadOnlySupported() {
      return true;
    }

    private data: StoryMediaRowBlockData;
    private wrapper: HTMLElement | null = null;
    private leftMount: HTMLElement | null = null;
    private rightMount: HTMLElement | null = null;
    private uploadingSide: SlotSide | null = null;
    private uploadError: Partial<Record<SlotSide, string | null>> = {};

    constructor({
      data,
    }: BlockToolConstructorOptions<StoryMediaRowBlockData>) {
      this.data = readStoryMediaRowData((data ?? {}) as Record<string, unknown>);
    }

    render() {
      const wrapper = document.createElement('div');
      wrapper.className =
        'story-layout-admin rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40';

      const hint = document.createElement('p');
      hint.className = 'mb-3 text-xs text-zinc-500 dark:text-zinc-400';
      hint.textContent =
        '한 행에 미디어 2개 — 데스크톱은 가로 2열, 모바일은 세로로 쌓입니다.';
      wrapper.appendChild(hint);

      const grid = document.createElement('div');
      grid.className = 'story-layout-admin__row grid gap-4';

      const leftMount = document.createElement('div');
      leftMount.className = 'min-w-0';
      const rightMount = document.createElement('div');
      rightMount.className = 'min-w-0';

      this.renderSlot('left', leftMount);
      this.renderSlot('right', rightMount);

      grid.appendChild(leftMount);
      grid.appendChild(rightMount);
      wrapper.appendChild(grid);

      this.wrapper = wrapper;
      this.leftMount = leftMount;
      this.rightMount = rightMount;
      return wrapper;
    }

    save() {
      return {
        left: this.data.left,
        right: this.data.right,
      };
    }

    private getSlot(side: SlotSide): StoryMediaSlotData {
      return this.data[side];
    }

    private setSlot(side: SlotSide, next: StoryMediaSlotData) {
      this.data[side] = next;
    }

    private renderSlot(side: SlotSide, mount: HTMLElement) {
      const slot = this.getSlot(side);
      renderMediaSlotControls(mount, {
        label: side === 'left' ? 'Left' : 'Right',
        kind: slot.kind,
        url: slot.file?.url,
        caption: slot.caption,
        isUploading: this.uploadingSide === side,
        uploadError: this.uploadError[side] ?? null,
        onKindChange: (kind: StoryMediaKind) => {
          this.setSlot(side, { kind, file: undefined, caption: slot.caption ?? '' });
          this.uploadError[side] = null;
          this.rerenderSlot(side);
        },
        onUpload: (file) => {
          void this.handleUpload(side, file);
        },
        onCaptionChange: (caption) => {
          this.setSlot(side, { ...slot, caption });
        },
      });
    }

    private async handleUpload(side: SlotSide, file: File) {
      const slot = this.getSlot(side);
      this.uploadingSide = side;
      this.uploadError[side] = null;
      this.rerenderSlot(side);

      const result = await uploadMediaFile(
        file,
        slot.kind,
        uploadImage,
        uploadVideo,
        (message) => {
          const mount = side === 'left' ? this.leftMount : this.rightMount;
          const status = mount?.querySelector('[data-upload-status]');
          if (status) status.textContent = message;
        },
      );

      this.uploadingSide = null;

      if (!result.success || !result.file?.url) {
        this.uploadError[side] = result.error ?? '업로드에 실패했습니다.';
        this.rerenderSlot(side);
        return;
      }

      this.setSlot(side, {
        ...slot,
        file: { url: result.file.url },
      });
      this.uploadError[side] = null;
      this.rerenderSlot(side);
    }

    private rerenderSlot(side: SlotSide) {
      const mount = side === 'left' ? this.leftMount : this.rightMount;
      if (!mount) return;
      this.renderSlot(side, mount);
    }
  };
}
