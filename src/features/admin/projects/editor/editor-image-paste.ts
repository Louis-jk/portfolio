import type EditorJS from '@editorjs/editorjs';

type UploadByFile = (
  file: File,
) => Promise<{ success: boolean; file?: { url: string } }>;

const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export function getClipboardImageFile(
  clipboardData: DataTransfer | null,
): File | null {
  if (!clipboardData) return null;

  for (const item of Array.from(clipboardData.items)) {
    if (!item.type.startsWith('image/')) continue;
    const file = item.getAsFile();
    if (file) return file;
  }

  return null;
}

function emptyImageBlockData(url: string) {
  return {
    file: { url },
    caption: '',
    withBorder: false,
    stretched: false,
    withBackground: false,
  };
}

export function attachEditorImagePaste(
  holder: HTMLElement,
  editor: EditorJS,
  uploadByFile: UploadByFile,
): () => void {
  const onPaste = (event: ClipboardEvent) => {
    const clipboard = event.clipboardData;
    const file = getClipboardImageFile(clipboard);
    if (!file) return;

    const target = event.target;
    if (target instanceof HTMLElement && target.isContentEditable) {
      const plain = clipboard?.getData('text/plain').trim() ?? '';
      const html = clipboard?.getData('text/html').trim() ?? '';
      if (plain.length > 0 || html.length > 0) return;
    }

    event.preventDefault();
    event.stopPropagation();

    void uploadByFile(file).then((result) => {
      if (!result.success || !result.file?.url) return;

      void editor.isReady.then(() => {
        const index = editor.blocks.getCurrentBlockIndex();
        const insertAt = index >= 0 ? index + 1 : undefined;
        void editor.blocks.insert(
          'image',
          emptyImageBlockData(result.file!.url),
          {},
          insertAt,
          true,
        );
      });
    });
  };

  holder.addEventListener('paste', onPaste, true);
  return () => holder.removeEventListener('paste', onPaste, true);
}

export const editorImagePasteMimeTypes = IMAGE_MIME_TYPES;
