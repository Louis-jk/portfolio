import { sanitizeHtml } from '@/lib/sanitize-html';

function clipboardHasImageFile(clipboard: DataTransfer | null): boolean {
  if (!clipboard) return false;
  return Array.from(clipboard.items).some(
    (item) => item.kind === 'file' && item.type.startsWith('image/'),
  );
}

function clipboardHasMeaningfulText(clipboard: DataTransfer | null): boolean {
  if (!clipboard) return false;
  const plain = clipboard.getData('text/plain').trim();
  if (plain.length > 0) return true;
  const html = clipboard.getData('text/html').trim();
  return html.length > 0;
}

function insertTextAtSelection(text: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(text));
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function insertHtmlAtSelection(html: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const template = document.createElement('template');
  template.innerHTML = sanitizeHtml(html);
  const fragment = template.content;
  const lastNode = fragment.lastChild;
  range.insertNode(fragment);

  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
  }

  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Editor.js intercepts paste at the holder level. Handle text paste locally
 * so Ctrl/Cmd+V works inside our custom contenteditable blocks.
 */
export function attachContentEditableTextPaste(
  el: HTMLElement,
  onPaste?: () => void,
): () => void {
  const onPasteEvent = (event: ClipboardEvent) => {
    const clipboard = event.clipboardData;
    if (!clipboard) return;

    if (clipboardHasImageFile(clipboard) && !clipboardHasMeaningfulText(clipboard)) {
      return;
    }

    const html = clipboard.getData('text/html').trim();
    const plain = clipboard.getData('text/plain');
    if (!html && !plain) return;

    event.preventDefault();
    event.stopPropagation();

    if (html) {
      insertHtmlAtSelection(html);
    } else {
      insertTextAtSelection(plain);
    }

    onPaste?.();
  };

  el.addEventListener('paste', onPasteEvent);
  return () => el.removeEventListener('paste', onPasteEvent);
}
