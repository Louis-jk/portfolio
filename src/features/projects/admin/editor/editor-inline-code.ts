import type EditorJS from '@editorjs/editorjs';
import { syncAllI18nToolsToActiveLocale } from './locale-context';

const INLINE_CODE_PATTERN = /`([^`\n]+)$/;

const INLINE_CODE_BLOCKS = new Set([
  'paragraph',
  'header',
  'quote',
  'list',
  'table',
]);

function getEditableFromEvent(
  event: Event,
  holder: HTMLElement,
): HTMLElement | null {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return null;

  const editable = target.isContentEditable
    ? target
    : target.closest('[contenteditable="true"]');
  if (!(editable instanceof HTMLElement) || !holder.contains(editable)) {
    return null;
  }
  return editable;
}

function getTextBeforeCursor(editable: HTMLElement): string | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!editable.contains(range.startContainer)) return null;

  const preRange = range.cloneRange();
  preRange.selectNodeContents(editable);
  preRange.setEnd(range.startContainer, range.startOffset);
  return preRange.toString();
}

function isInsideInlineCode(editable: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const node = selection.anchorNode;
  if (!node) return false;

  const element =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as Element)
      : node.parentElement;
  const code = element?.closest('code');
  return Boolean(code && editable.contains(code));
}

function getRangeForCharOffsets(
  root: HTMLElement,
  startOffset: number,
  endOffset: number,
): Range | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let charCount = 0;
  let startNode: Text | null = null;
  let startOff = 0;
  let endNode: Text | null = null;
  let endOff = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const len = node.length;

    if (!startNode && charCount + len > startOffset) {
      startNode = node;
      startOff = startOffset - charCount;
    }

    if (charCount + len >= endOffset) {
      endNode = node;
      endOff = endOffset - charCount;
      break;
    }

    charCount += len;
  }

  if (!startNode || !endNode) return null;

  const range = document.createRange();
  range.setStart(startNode, startOff);
  range.setEnd(endNode, endOff);
  return range;
}

export function matchInlineCodeBeforeCursor(
  beforeCursor: string,
): { text: string; markerLength: number } | null {
  const match = INLINE_CODE_PATTERN.exec(beforeCursor);
  if (!match) return null;
  return { text: match[1], markerLength: match[0].length };
}

export function tryWrapInlineCode(editable: HTMLElement): boolean {
  if (isInsideInlineCode(editable)) return false;

  const beforeCursor = getTextBeforeCursor(editable);
  if (beforeCursor === null) return false;

  const matched = matchInlineCodeBeforeCursor(beforeCursor);
  if (!matched) return false;

  const startOffset = beforeCursor.length - matched.markerLength;
  const endOffset = beforeCursor.length;
  const range = getRangeForCharOffsets(editable, startOffset, endOffset);
  if (!range) return false;

  range.deleteContents();

  const code = document.createElement('code');
  code.className = 'story-inline-code';
  code.textContent = matched.text;
  range.insertNode(code);

  const selection = window.getSelection();
  if (selection) {
    const after = document.createRange();
    after.setStartAfter(code);
    after.collapse(true);
    selection.removeAllRanges();
    selection.addRange(after);
  }

  editable.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}

export function attachEditorInlineCode(
  holder: HTMLElement,
  editor: EditorJS,
): () => void {
  const onBeforeInput = (event: InputEvent) => {
    if (event.isComposing) return;
    if (event.inputType !== 'insertText' || event.data !== '`') return;

    const editable = getEditableFromEvent(event, holder);
    if (!editable) return;

    const block = editor.blocks.getBlockByElement(editable);
    if (!block || !INLINE_CODE_BLOCKS.has(block.name)) return;

    if (tryWrapInlineCode(editable)) {
      event.preventDefault();
      event.stopPropagation();
      syncAllI18nToolsToActiveLocale();
    }
  };

  holder.addEventListener('beforeinput', onBeforeInput, true);
  return () => holder.removeEventListener('beforeinput', onBeforeInput, true);
}
