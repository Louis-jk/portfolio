import type EditorJS from '@editorjs/editorjs';
import { sanitizeHtml } from '@/lib/sanitize-html';
import {
  extractHeaderLevelFromBlockSave,
  extractHtmlFromBlockSave,
} from './block-save-i18n';
import { normalizeParagraphHtml } from '@/lib/project-detail-page/paragraph-html';
import { matchMarkdownOnEnter } from './editor-markdown-shortcuts';

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

function splitEditableHtmlAtSelection(
  editable: HTMLElement,
): { beforeHtml: string; afterHtml: string } | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!editable.contains(range.startContainer)) return null;

  const beforeRange = document.createRange();
  beforeRange.setStart(editable, 0);
  beforeRange.setEnd(range.startContainer, range.startOffset);

  const afterRange = document.createRange();
  afterRange.setStart(range.startContainer, range.startOffset);
  afterRange.setEnd(editable, editable.childNodes.length);

  const beforeEl = document.createElement('div');
  const afterEl = document.createElement('div');
  beforeEl.appendChild(beforeRange.cloneContents());
  afterEl.appendChild(afterRange.cloneContents());

  return {
    beforeHtml: beforeEl.innerHTML,
    afterHtml: afterEl.innerHTML,
  };
}

function focusEditable(editable: HTMLElement, atStart: boolean) {
  requestAnimationFrame(() => {
    editable.focus();
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(atStart);
    selection.removeAllRanges();
    selection.addRange(range);
  });
}

export function attachEditorI18nEnterSplit(
  holder: HTMLElement,
  editor: EditorJS,
): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.key !== 'Enter' ||
      event.shiftKey
    ) {
      return;
    }

    const editable = getEditableFromEvent(event, holder);
    if (!editable) return;

    const block = editor.blocks.getBlockByElement(editable);
    if (!block) return;

    if (block.name === 'paragraph') {
      const fullText = editable.textContent ?? '';
      if (matchMarkdownOnEnter(fullText.trim())) return;
    }

    if (block.name !== 'paragraph' && block.name !== 'header') return;

    const split = splitEditableHtmlAtSelection(editable);
    if (!split) return;

    event.preventDefault();
    event.stopPropagation();

    void (async () => {
      const saved = await block.save();
      const existingHtml = extractHtmlFromBlockSave(saved);
      const index = editor.blocks.getBlockIndex(block.id);
      if (index < 0) return;

      const beforeHtml = normalizeParagraphHtml(sanitizeHtml(split.beforeHtml));
      const afterHtml = normalizeParagraphHtml(sanitizeHtml(split.afterHtml));

      if (block.name === 'header') {
        const level = extractHeaderLevelFromBlockSave(saved);

        await editor.blocks.update(block.id, {
          html: beforeHtml || existingHtml,
          level,
        });

        const inserted = editor.blocks.insert(
          'paragraph',
          { html: afterHtml },
          {},
          index + 1,
          true,
        );
        const nextEditable = inserted.holder.querySelector(
          '[contenteditable="true"]',
        );
        if (nextEditable instanceof HTMLElement) {
          focusEditable(nextEditable, afterHtml.length === 0);
        }
        return;
      }

      await editor.blocks.update(block.id, {
        html: beforeHtml,
      });

      const inserted = editor.blocks.insert(
        'paragraph',
        { html: afterHtml },
        {},
        index + 1,
        true,
      );
      const nextEditable = inserted.holder.querySelector(
        '[contenteditable="true"]',
      );
      if (nextEditable instanceof HTMLElement) {
        focusEditable(nextEditable, afterHtml.length === 0);
      }
    })();
  };

  holder.addEventListener('keydown', onKeyDown, true);

  return () => {
    holder.removeEventListener('keydown', onKeyDown, true);
  };
}
