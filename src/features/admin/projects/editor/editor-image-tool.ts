import type {
  BlockTool,
  BlockToolConstructorOptions,
  PasteEvent,
} from '@editorjs/editorjs';
import { editorImagePasteMimeTypes } from './editor-image-paste';

type UploadResult = {
  success: boolean;
  file?: { url: string };
};

type ImageData = {
  file?: { url?: string };
  caption?: string;
  withBorder?: boolean;
  stretched?: boolean;
  withBackground?: boolean;
};

export function createEditorImageTool(
  uploadByFile: (file: File) => Promise<UploadResult>,
) {
  return class EditorImageTool implements BlockTool {
    static get toolbox() {
      return {
        title: 'Image',
        icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
      };
    }

    static get pasteConfig() {
      return {
        files: {
          mimeTypes: [...editorImagePasteMimeTypes],
        },
        patterns: {
          image: /https?:\/\/\S+\.(?:gif|jpe?g|png|webp)(?:\?\S*)?$/i,
        },
      };
    }

    private data: ImageData;
    private wrapper: HTMLElement | null = null;

    constructor({ data }: BlockToolConstructorOptions<ImageData>) {
      this.data = data ?? {};
    }

    render() {
      const wrapper = document.createElement('div');
      wrapper.className = 'space-y-3';

      if (this.data.file?.url) {
        const img = document.createElement('img');
        img.src = this.data.file.url;
        img.className = 'h-auto w-full rounded-xl object-contain';
        wrapper.appendChild(img);
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', () => {
          const file = input.files?.[0];
          if (!file) return;
          void uploadByFile(file).then((result) => {
            if (!result.success || !result.file?.url) return;
            this.data.file = { url: result.file.url };
            this.rerender();
          });
        });
        wrapper.appendChild(input);
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
      wrapper.appendChild(caption);
      return wrapper;
    }

    onPaste(event: PasteEvent) {
      if (event.type === 'file' && 'file' in event.detail) {
        const file = event.detail.file as File;
        void uploadByFile(file).then((result) => {
          if (!result.success || !result.file?.url) return;
          this.data.file = { url: result.file.url };
          this.rerender();
        });
        return;
      }

      if (event.type === 'pattern' && 'data' in event.detail) {
        const url = String(event.detail.data);
        this.data.file = { url };
        this.rerender();
      }
    }

    save() {
      return {
        file: this.data.file,
        caption: this.data.caption ?? '',
        withBorder: this.data.withBorder ?? false,
        stretched: this.data.stretched ?? false,
        withBackground: this.data.withBackground ?? false,
      };
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
