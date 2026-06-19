import type EditorJS from '@editorjs/editorjs';
import type { BlockAPI } from '@editorjs/editorjs';
import type { PartialI18n } from '@/modules/project-detail-page';
import { getActiveLocale } from './locale-context';

type MarkdownConversion = {
  type: string;
  data: Record<string, unknown>;
};

type EditableContext = {
  editable: HTMLElement;
  beforeCursor: string;
  fullText: string;
};

function getEditableFromEvent(
  event: Event,
  holder: HTMLElement,
): HTMLElement | null {
  const target = event.target;
  if (target instanceof HTMLElement && target.isContentEditable) {
    return holder.contains(target) ? target : null;
  }
  return null;
}

function getEditableContext(editable: HTMLElement): EditableContext {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return {
      editable,
      beforeCursor: '',
      fullText: editable.textContent ?? '',
    };
  }

  const range = selection.getRangeAt(0);
  if (!editable.contains(range.startContainer)) {
    return {
      editable,
      beforeCursor: '',
      fullText: editable.textContent ?? '',
    };
  }

  const preRange = range.cloneRange();
  preRange.selectNodeContents(editable);
  preRange.setEnd(range.endContainer, range.endOffset);

  return {
    editable,
    beforeCursor: preRange.toString(),
    fullText: editable.textContent ?? '',
  };
}

function i18nHtml(html: string) {
  const locale = getActiveLocale();
  return { i18n: { [locale]: html } };
}

function plainTextToI18nHtml(text: string) {
  if (!text) {
    return i18nHtml('');
  }

  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return i18nHtml(escaped);
}

/** Line-start prefix before cursor (handles soft line breaks inside a block). */
export function getLinePrefixBeforeCursor(beforeCursor: string): string {
  const normalized = beforeCursor.replace(/\u00a0/g, ' ');
  const lineStart = normalized.lastIndexOf('\n') + 1;
  return normalized.slice(lineStart).replace(/\s+$/, '');
}

function getRestOfLineAfterMarker(
  beforeCursor: string,
  fullText: string,
  markerLength: number,
): string {
  const lineStart = beforeCursor.lastIndexOf('\n') + 1;
  return fullText.slice(lineStart + markerLength);
}

export function buildListI18nData(
  itemText: string,
  kind: 'ul' | 'ol' = 'ul',
): Record<string, unknown> {
  const locale = getActiveLocale();
  const tag = kind === 'ol' ? 'ol' : 'ul';
  const liInner = itemText
    ? itemText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    : '<br>';
  return { i18n: { [locale]: `<${tag}><li>${liInner}</li></${tag}>` } };
}

export function matchMarkdownHeader(
  beforeCursor: string,
  fullText: string,
): { level: number; text: string } | null {
  const hashOnly = /^(#{1,6})$/.exec(beforeCursor);
  if (hashOnly) {
    const rest = fullText.slice(beforeCursor.length).trim();
    return { level: hashOnly[1].length, text: rest };
  }

  const hashThenSpace = /^(#{1,6})\s$/.exec(beforeCursor);
  if (hashThenSpace) {
    const rest = fullText.slice(beforeCursor.length).trim();
    return { level: hashThenSpace[1].length, text: rest };
  }

  return null;
}

export function matchMarkdownOnSpace(
  beforeCursor: string,
  fullText: string,
): MarkdownConversion | null {
  const header = matchMarkdownHeader(beforeCursor, fullText);
  if (header) {
    return {
      type: 'header',
      data: {
        ...plainTextToI18nHtml(header.text),
        level: header.level,
      },
    };
  }

  const linePrefix = getLinePrefixBeforeCursor(beforeCursor);

  if (linePrefix === '-' || linePrefix === '*') {
    const rest = getRestOfLineAfterMarker(
      beforeCursor,
      fullText,
      linePrefix.length,
    );
    return {
      type: 'list',
      data: buildListI18nData(rest.trimStart()),
    };
  }

  const orderedMarker = /^(\d+)\.$/.exec(linePrefix);
  if (orderedMarker) {
    const rest = getRestOfLineAfterMarker(
      beforeCursor,
      fullText,
      linePrefix.length,
    );
    return {
      type: 'list',
      data: buildListI18nData(rest.trimStart(), 'ol'),
    };
  }

  if (linePrefix === '>') {
    const rest = getRestOfLineAfterMarker(
      beforeCursor,
      fullText,
      linePrefix.length,
    );
    return { type: 'quote', data: plainTextToI18nHtml(rest.trimStart()) };
  }

  return null;
}

export function matchMarkdownOnEnter(
  text: string,
): MarkdownConversion | 'delete-and-insert-delimiter' | 'delete-and-insert-code' | null {
  if (text === '---') {
    return 'delete-and-insert-delimiter';
  }

  if (/^```(\S*)?$/.test(text)) {
    return 'delete-and-insert-code';
  }

  return null;
}

function focusBlockEditable(holder: HTMLElement, placeAtEnd: boolean) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const editable = holder.querySelector('[contenteditable="true"]');
      if (!(editable instanceof HTMLElement)) return;

      editable.focus();

      if (!placeAtEnd) return;

      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.selectNodeContents(editable);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });
}

function focusListItemInBlock(holder: HTMLElement) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const editable = holder.querySelector('[contenteditable="true"]');
      if (!(editable instanceof HTMLElement)) return;

      editable.focus();

      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      const li = editable.querySelector('li');

      if (li instanceof HTMLElement) {
        range.selectNodeContents(li);
        range.collapse(false);
      } else {
        range.selectNodeContents(editable);
        range.collapse(false);
      }

      selection.removeAllRanges();
      selection.addRange(range);
    });
  });
}

function replaceParagraphBlock(
  editor: EditorJS,
  index: number,
  type: string,
  data: Record<string, unknown>,
) {
  editor.blocks.delete(index);
  const block = editor.blocks.insert(type, data, {}, index, true);
  if (type === 'list') {
    focusListItemInBlock(block.holder);
    return;
  }
  focusBlockEditable(block.holder, true);
}

async function updateHeaderLevel(
  editor: EditorJS,
  block: BlockAPI,
  header: { level: number; text: string },
) {
  const saved = await block.save();
  const existingI18n =
    saved &&
    typeof saved === 'object' &&
    'data' in saved &&
    saved.data &&
    typeof saved.data === 'object' &&
    'i18n' in saved.data &&
    saved.data.i18n &&
    typeof saved.data.i18n === 'object'
      ? (saved.data.i18n as PartialI18n)
      : {};

  const { i18n: nextI18n } = plainTextToI18nHtml(header.text);

  const updated = await editor.blocks.update(block.id, {
    i18n: { ...existingI18n, ...nextI18n },
    level: header.level,
  });
  focusBlockEditable(updated.holder, true);
}

function tryMarkdownOnSpace(
  editor: EditorJS,
  holder: HTMLElement,
  event: Event,
): boolean {
  const editable = getEditableFromEvent(event, holder);
  if (!editable) return false;

  const block = editor.blocks.getBlockByElement(editable);
  if (!block) return false;

  const context = getEditableContext(editable);

  if (block.name === 'header') {
    const header = matchMarkdownHeader(context.beforeCursor, context.fullText);
    if (!header) return false;

    event.preventDefault();
    event.stopPropagation();
    void updateHeaderLevel(editor, block, header);
    return true;
  }

  if (block.name !== 'paragraph') return false;

  const index = editor.blocks.getBlockIndex(block.id);
  if (index < 0) return false;

  const conversion = matchMarkdownOnSpace(
    context.beforeCursor,
    context.fullText,
  );
  if (!conversion) return false;

  event.preventDefault();
  event.stopPropagation();
  replaceParagraphBlock(editor, index, conversion.type, conversion.data);
  return true;
}

export function attachEditorMarkdownShortcuts(
  holder: HTMLElement,
  editor: EditorJS,
): () => void {
  const onBeforeInput = (event: InputEvent) => {
    if (event.isComposing) return;
    if (event.inputType !== 'insertText' || event.data !== ' ') return;
    tryMarkdownOnSpace(editor, holder, event);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing) return;

    const editable = getEditableFromEvent(event, holder);
    if (!editable) return;

    const block = editor.blocks.getBlockByElement(editable);
    if (!block) return;

    if (event.key !== 'Enter' || block.name !== 'paragraph') return;

    const index = editor.blocks.getBlockIndex(block.id);
    if (index < 0) return;

    const { fullText, beforeCursor } = getEditableContext(editable);
    const trimmed = fullText.trim();
    const enterAction = matchMarkdownOnEnter(trimmed);
    if (!enterAction) return;

    // Only convert when the whole block is exactly the marker and cursor is at the end.
    if (trimmed !== fullText || beforeCursor.length !== fullText.length) return;

    event.preventDefault();
    event.stopPropagation();

    if (enterAction === 'delete-and-insert-delimiter') {
      editor.blocks.delete(index);
      const inserted = editor.blocks.insert('delimiter', {}, {}, index, true);
      focusBlockEditable(inserted.holder, false);
      return;
    }

    if (enterAction === 'delete-and-insert-code') {
      editor.blocks.delete(index);
      const inserted = editor.blocks.insert('code', { code: '' }, {}, index, true);
      focusBlockEditable(inserted.holder, true);
    }
  };

  holder.addEventListener('beforeinput', onBeforeInput, true);
  holder.addEventListener('keydown', onKeyDown, true);

  return () => {
    holder.removeEventListener('beforeinput', onBeforeInput, true);
    holder.removeEventListener('keydown', onKeyDown, true);
  };
}
