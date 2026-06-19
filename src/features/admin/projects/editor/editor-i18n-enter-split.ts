import type EditorJS from '@editorjs/editorjs';
import type { PartialI18n } from '@/modules/project-detail-page';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { getActiveLocale } from './locale-context';
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

function extractI18nFromSave(
  saved: Awaited<ReturnType<import('@editorjs/editorjs').BlockAPI['save']>>,
): PartialI18n {
  if (
    saved &&
    typeof saved === 'object' &&
    'data' in saved &&
    saved.data &&
    typeof saved.data === 'object' &&
    'i18n' in saved.data &&
    saved.data.i18n &&
    typeof saved.data.i18n === 'object'
  ) {
    return saved.data.i18n as PartialI18n;
  }
  return {};
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
      const locale = getActiveLocale();
      const saved = await block.save();
      const existingI18n = extractI18nFromSave(saved);
      const index = editor.blocks.getBlockIndex(block.id);
      if (index < 0) return;

      const beforeHtml = sanitizeHtml(split.beforeHtml);
      const afterHtml = sanitizeHtml(split.afterHtml);

      if (block.name === 'header') {
        const level =
          saved &&
          typeof saved === 'object' &&
          'data' in saved &&
          saved.data &&
          typeof saved.data === 'object' &&
          'level' in saved.data
            ? Number(saved.data.level) || 2
            : 2;

        await editor.blocks.update(block.id, {
          i18n: { ...existingI18n, [locale]: beforeHtml },
          level,
        });

        const inserted = editor.blocks.insert(
          'paragraph',
          { i18n: { [locale]: afterHtml } },
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
        i18n: { ...existingI18n, [locale]: beforeHtml },
      });

      const inserted = editor.blocks.insert(
        'paragraph',
        { i18n: { [locale]: afterHtml } },
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
