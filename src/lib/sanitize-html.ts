import DOMPurify from 'dompurify';
import {
  decodeEscapedStoryHtml,
  normalizeStoryInlineCodeInHtml,
} from '@/lib/project-detail-page/story-inline-code-html';

const STORY_INLINE_CODE_CLASS = 'story-inline-code';

/** Encode `<`/`>` inside `<code>` so DOMPurify does not treat generics as tags. */
function encodeInlineCodeContents(html: string): string {
  return html.replace(
    /<code\b[^>]*>([\s\S]*?)<\/code>/gi,
    (_match, inner: string) => {
      const decoded = inner
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      const encoded = decoded
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<code class="${STORY_INLINE_CODE_CLASS}">${encoded}</code>`;
    },
  );
}

/** Escape stray `<` that are not allowed story markup tags. */
function escapeStrayAngleBrackets(html: string): string {
  return html.replace(
    /<(?!\/?(?:code|br|span|strong|em|b|i|a|ul|ol|li|p|div)\b)/gi,
    '&lt;',
  );
}

export function sanitizeStoryHtml(html: string): string {
  if (!html) return '';

  const prepared = escapeStrayAngleBrackets(encodeInlineCodeContents(html));

  return DOMPurify.sanitize(prepared, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['class'],
  });
}

/** Persist rich text from the admin editor (paragraph, list, table cell, …). */
export function persistEditorHtml(html: string): string {
  const decoded = decodeEscapedStoryHtml(html.trim());
  const withCode = normalizeStoryInlineCodeInHtml(decoded);
  return sanitizeStoryHtml(withCode);
}

/**
 * Prepare stored HTML for `contenteditable` / table `innerHTML` assignment.
 * Encodes generics inside `<code>` so the browser parser does not strip them.
 */
export function prepareEditorHtmlForRender(html: string): string {
  if (!html) return '';

  const decoded = decodeEscapedStoryHtml(html.trim());
  const withCode = normalizeStoryInlineCodeInHtml(decoded);
  return escapeStrayAngleBrackets(encodeInlineCodeContents(withCode));
}

export function sanitizeHtml(html: string): string {
  return persistEditorHtml(html);
}
