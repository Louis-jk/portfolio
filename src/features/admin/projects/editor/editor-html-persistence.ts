import type { EditorBlock, EditorOutput } from '@/modules/project-detail-page/types';
import { mapEditorBlocksWithPaths } from '@/lib/project-detail-page/story-blocks';
import {
  persistEditorHtml,
  prepareEditorHtmlForRender,
} from '@/lib/sanitize-html';

const I18N_HTML_BLOCK_TYPES = new Set(['paragraph', 'header', 'quote', 'list']);

function collectContentEditables(root: HTMLElement): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const editables: HTMLElement[] = [];

  const add = (el: HTMLElement) => {
    if (seen.has(el)) return;
    seen.add(el);
    editables.push(el);
  };

  if (root.isContentEditable || root.getAttribute('contenteditable') === 'true') {
    add(root);
  }

  root
    .querySelectorAll<HTMLElement>('[contenteditable]:not([contenteditable="false"])')
    .forEach(add);

  return editables;
}

/** Deepest contenteditable in a block (Editor.js inline toolbar nests an inner field). */
export function getLeafContentEditable(root: HTMLElement): HTMLElement | null {
  const editables = collectContentEditables(root);
  if (editables.length === 0) {
    return root.isContentEditable ? root : null;
  }

  const leaf = editables.find(
    (el) => !editables.some((other) => other !== el && el.contains(other)),
  );
  return leaf ?? editables[editables.length - 1] ?? null;
}

type EditorBlocksReader = {
  blocks: {
    getBlocksCount: () => number;
    getBlockByIndex: (
      index: number,
    ) => { name?: string; holder?: HTMLElement | null } | null | undefined;
  };
};

/**
 * Read live HTML from i18n text blocks — paragraph save can miss inline markup
 * when Editor.js inline toolbar uses a nested contenteditable.
 */
export function captureI18nTextBlocksFromDom(
  editor: EditorBlocksReader,
  output: EditorOutput,
): EditorOutput {
  const blocks = output.blocks.map((block, index) => {
    if (!I18N_HTML_BLOCK_TYPES.has(block.type)) return block;

    const apiBlock = editor.blocks.getBlockByIndex(index);
    const holder = apiBlock?.holder;
    if (!(holder instanceof HTMLElement)) return block;

    const editable = getLeafContentEditable(holder);
    if (!(editable instanceof HTMLElement)) return block;

    const { text: _text, ...restData } = block.data as Record<string, unknown>;
    const html = persistEditorHtml(editable.innerHTML);

    return {
      ...block,
      data: {
        ...restData,
        html,
      },
    };
  });

  return { ...output, blocks };
}

function normalizeTableBlockForSave(block: EditorBlock): EditorBlock {
  const content = block.data.content;
  if (!Array.isArray(content)) return block;

  return {
    ...block,
    data: {
      ...block.data,
      content: content.map((row) =>
        Array.isArray(row)
          ? row.map((cell) =>
              typeof cell === 'string' ? persistEditorHtml(cell) : String(cell ?? ''),
            )
          : row,
      ),
    },
  };
}

/**
 * Read live table cell HTML from the DOM — Editor.js table save can miss inline markup.
 */
export function captureTableCellsFromHolder(
  holder: HTMLElement,
  output: EditorOutput,
): EditorOutput {
  const tableElements = Array.from(holder.querySelectorAll('.tc-table'));
  let tableIndex = 0;

  const blocks = output.blocks.map((block) => {
    if (block.type !== 'table') return block;

    const tableEl = tableElements[tableIndex];
    tableIndex += 1;

    if (!(tableEl instanceof HTMLElement)) {
      return normalizeTableBlockForSave(block);
    }

    const content: string[][] = [];

    tableEl.querySelectorAll('.tc-row').forEach((row) => {
      const rowContent: string[] = [];
      let rowHasText = false;

      row.querySelectorAll('.tc-cell').forEach((cell) => {
        const html = cell instanceof HTMLElement ? cell.innerHTML : '';
        if ((cell.textContent ?? '').trim().length > 0) {
          rowHasText = true;
        }
        rowContent.push(persistEditorHtml(html));
      });

      if (rowHasText) {
        content.push(rowContent);
      }
    });

    return {
      ...block,
      data: {
        ...block.data,
        content,
      },
    };
  });

  return { ...output, blocks };
}

export function normalizeEditorOutputForSave(output: EditorOutput): EditorOutput {
  return {
    ...output,
    blocks: mapEditorBlocksWithPaths(output.blocks, (block) => {
      if (typeof block.data?.html === 'string') {
        return {
          ...block,
          data: {
            ...block.data,
            html: persistEditorHtml(block.data.html),
          },
        };
      }

      if (block.type === 'table') {
        return normalizeTableBlockForSave(block);
      }

      return block;
    }),
  };
}

export function prepareEditorOutputForLoad(output: EditorOutput): EditorOutput {
  return {
    ...output,
    blocks: mapEditorBlocksWithPaths(output.blocks, (block) => {
      if (typeof block.data?.html === 'string') {
        return {
          ...block,
          data: {
            ...block.data,
            html: prepareEditorHtmlForRender(block.data.html),
          },
        };
      }

      if (block.type === 'table' && Array.isArray(block.data.content)) {
        return {
          ...block,
          data: {
            ...block.data,
            content: (block.data.content as string[][]).map((row) =>
              Array.isArray(row)
                ? row.map((cell) => prepareEditorHtmlForRender(String(cell ?? '')))
                : row,
            ),
          },
        };
      }

      return block;
    }),
  };
}
