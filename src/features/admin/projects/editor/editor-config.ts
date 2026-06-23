import type { OutputData } from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import type { ToolConstructable } from '@editorjs/editorjs';
import {
  createI18nHeaderTool,
  createI18nTextTool,
} from './i18n-text-tools';
import { createI18nCodeTool } from './editor-i18n-code-tool';
import { createEditorImageTool } from './editor-image-tool';
import { createEditorVideoTool } from './editor-video-tool';
import { createEditorDetailsTool } from './editor-details-tool';
import { createEditorDetailsEndTool } from './editor-details-end-tool';

type UploadResult = {
  success: boolean;
  file?: { url: string };
};

export function createEditorTools(
  uploadByFile: (file: File) => Promise<UploadResult>,
  uploadVideo?: (
    file: File,
    onProgress?: (message: string) => void,
  ) => Promise<UploadResult>,
) {
  return {
    paragraph: {
      class: createI18nTextTool({
        toolboxTitle: 'Paragraph',
        toolboxIcon: '¶',
        placeholder: 'Write paragraph…',
      }) as unknown as ToolConstructable,
      inlineToolbar: true,
    },
    header: {
      class: createI18nHeaderTool() as unknown as ToolConstructable,
    },
    list: {
      class: createI18nTextTool({
        toolboxTitle: 'List',
        toolboxIcon: '•',
        className:
          'prose prose-zinc dark:prose-invert max-w-none [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5',
        placeholder: '<ul><li>Item</li></ul>',
      }) as unknown as ToolConstructable,
    },
    quote: {
      class: createI18nTextTool({
        toolboxTitle: 'Quote',
        toolboxIcon: '"',
        className:
          'border-l-4 border-purple-500 pl-4 italic text-zinc-600 dark:text-zinc-400',
        placeholder: 'Quote…',
      }) as unknown as ToolConstructable,
    },
    image: {
      class: createEditorImageTool(uploadByFile) as unknown as ToolConstructable,
    },
    video: {
      class: createEditorVideoTool(
        uploadVideo ?? (async (file) => uploadByFile(file)),
      ) as unknown as ToolConstructable,
    },
    embed: {
      class: Embed as unknown as ToolConstructable,
      config: {
        services: {
          youtube: true,
          vimeo: true,
        },
      },
    },
    code: {
      class: createI18nCodeTool() as unknown as ToolConstructable,
    },
    delimiter: Delimiter as unknown as ToolConstructable,
    table: {
      class: Table as unknown as ToolConstructable,
      inlineToolbar: true,
    },
    details: {
      class: createEditorDetailsTool() as unknown as ToolConstructable,
    },
    detailsEnd: {
      class: createEditorDetailsEndTool() as unknown as ToolConstructable,
    },
  };
}

export type { OutputData };
