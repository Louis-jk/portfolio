import type EditorJS from '@editorjs/editorjs';

const FENCED_CODE_RE = /^```([^\n`]*)\r?\n([\s\S]*?)\r?\n?```\s*$/;

const TREE_CHARS_RE = /[├└│┬┴┤┐┌┘─╰╯╭╮]/;

const ASCII_TREE_RE = /(?:^|\s)(?:\|[-─]|\+[-─]|`[-─]|[-─]{2,})/;

const PASTE_TARGET_BLOCKS = new Set(['paragraph', 'header', 'quote', 'list']);

export function extractFencedCode(text: string): string | null {
  if (!text) return null;
  const match = FENCED_CODE_RE.exec(text.trim());
  if (!match) return null;

  let code = match[2].replace(/\r\n/g, '\n');
  if (code.endsWith('\n')) code = code.slice(0, -1);
  return code;
}

export function extractCodeFromHtml(html: string): string | null {
  if (!html) return null;

  const template = document.createElement('template');
  template.innerHTML = html;

  const pre = template.content.querySelector('pre');
  if (pre) {
    return (pre.textContent ?? '').replace(/\r\n/g, '\n');
  }

  const code = template.content.querySelector('code');
  if (!code?.textContent) return null;

  const value = code.textContent.replace(/\r\n/g, '\n');
  if (value.includes('\n') || value.length > 48) {
    return value;
  }

  return null;
}

export function looksLikePreformattedPlainText(text: string): boolean {
  if (!text || !text.includes('\n')) return false;

  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return false;

  const treeLines = lines.filter((line) => TREE_CHARS_RE.test(line)).length;
  if (treeLines >= 2) return true;
  if (treeLines >= 1 && lines.length >= 3) return true;

  const asciiTreeLines = lines.filter((line) => ASCII_TREE_RE.test(line)).length;
  if (asciiTreeLines >= 2) return true;

  const indentedLines = lines.filter((line) => /^ {2,}|\t/.test(line)).length;
  if (indentedLines >= Math.ceil(lines.length * 0.6) && lines.length >= 3) {
    return true;
  }

  return false;
}

export function extractCodeFromPaste(clipboard: DataTransfer): string | null {
  const plain = clipboard.getData('text/plain');
  const html = clipboard.getData('text/html').trim();

  const fenced = extractFencedCode(plain);
  if (fenced !== null) return fenced;

  const fromHtml = extractCodeFromHtml(html);
  if (fromHtml !== null) return fromHtml;

  if (looksLikePreformattedPlainText(plain)) {
    return plain.replace(/\r\n/g, '\n').replace(/\n$/, '');
  }

  return null;
}

function clipboardHasImageFile(clipboard: DataTransfer): boolean {
  return Array.from(clipboard.items).some(
    (item) => item.kind === 'file' && item.type.startsWith('image/'),
  );
}

function isEditableEmpty(editable: HTMLElement): boolean {
  return (editable.textContent?.trim() ?? '').length === 0;
}

function focusCodeTextarea(holder: HTMLElement) {
  requestAnimationFrame(() => {
    const textarea = holder.querySelector('textarea');
    if (!(textarea instanceof HTMLTextAreaElement)) return;
    textarea.focus();
    const length = textarea.value.length;
    textarea.setSelectionRange(length, length);
  });
}

export function attachEditorCodePaste(
  holder: HTMLElement,
  editor: EditorJS,
): () => void {
  const onPaste = (event: ClipboardEvent) => {
    const clipboard = event.clipboardData;
    if (!clipboard) return;

    if (clipboardHasImageFile(clipboard)) return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const editable = target.isContentEditable
      ? target
      : target.closest('[contenteditable="true"]');
    if (!(editable instanceof HTMLElement) || !holder.contains(editable)) return;

    const block = editor.blocks.getBlockByElement(editable);
    if (!block || !PASTE_TARGET_BLOCKS.has(block.name)) return;

    const code = extractCodeFromPaste(clipboard);
    if (code === null) return;

    event.preventDefault();
    event.stopPropagation();

    void editor.isReady.then(() => {
      const index = editor.blocks.getBlockIndex(block.id);
      if (index < 0) return;

      const insertAt = isEditableEmpty(editable) ? index : index + 1;

      if (isEditableEmpty(editable)) {
        editor.blocks.delete(index);
      }

      const inserted = editor.blocks.insert(
        'code',
        { code },
        {},
        insertAt,
        true,
      );
      focusCodeTextarea(inserted.holder);
    });
  };

  holder.addEventListener('paste', onPaste, true);
  return () => holder.removeEventListener('paste', onPaste, true);
}
