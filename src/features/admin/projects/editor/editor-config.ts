import type { OutputData } from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import type { ToolConstructable } from '@editorjs/editorjs';
import {
  createI18nHeaderTool,
  createI18nTextTool,
} from './i18n-text-tools';
import { createEditorImageTool } from './editor-image-tool';

export function createEditorTools(
  uploadByFile: (file: File) => Promise<{ success: boolean; file?: { url: string } }>,
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
        className: 'prose prose-zinc dark:prose-invert max-w-none',
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
    embed: {
      class: Embed as unknown as ToolConstructable,
      config: {
        services: {
          youtube: true,
          vimeo: true,
        },
      },
    },
    code: CodeTool as unknown as ToolConstructable,
    delimiter: Delimiter as unknown as ToolConstructable,
    table: {
      class: Table as unknown as ToolConstructable,
      inlineToolbar: true,
    },
  };
}

export type { OutputData };
