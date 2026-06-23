const INLINE_CODE_IN_TEXT_RE = /`([^`\n]+)`/g;

/** Decode HTML-entity escaped tags (e.g. `&lt;code&gt;`) saved in table cells. */
export function decodeEscapedStoryHtml(html: string): string {
  if (!/&lt;\/?[a-z]/i.test(html)) {
    return html;
  }

  if (typeof document === 'undefined') {
    return html;
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

/**
 * Convert markdown-style `token` to inline code.
 * Runs even when some `<code>` tags already exist (other fragments may still use backticks).
 */
export function normalizeStoryInlineCodeInHtml(html: string): string {
  if (!html) return '';

  return html.replace(
    INLINE_CODE_IN_TEXT_RE,
    '<code class="story-inline-code">$1</code>',
  );
}

export function prepareStoryRichTextHtml(raw: string): string {
  const trimmed = String(raw ?? '').trim();
  const decoded = decodeEscapedStoryHtml(trimmed);
  return normalizeStoryInlineCodeInHtml(decoded);
}

/** @deprecated Use prepareStoryRichTextHtml */
export function prepareStoryTableCellHtml(raw: string): string {
  return prepareStoryRichTextHtml(raw);
}
