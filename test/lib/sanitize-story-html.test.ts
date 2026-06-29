import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { sanitizeStoryHtml } from '@/lib/sanitize-html';

describe('sanitizeStoryHtml', () => {
  it('preserves generics inside inline code', () => {
    const input =
      '<code class="story-inline-code">ApiResponse&lt;T, ErrorCode&gt;</code> + Zod';
    expect(sanitizeStoryHtml(input)).toContain(
      'ApiResponse&lt;T, ErrorCode&gt;',
    );
    expect(sanitizeStoryHtml(input)).toContain('<code');
  });

  it('encodes angle brackets inside code before sanitizing', () => {
    const dom = new JSDOM('');
    const DOMPurify = createDOMPurify(dom.window);
    const broken = DOMPurify.sanitize(
      '<code class="story-inline-code">ApiResponse<T, ErrorCode></code>',
      { USE_PROFILES: { html: true } },
    );
    expect(broken).not.toContain('ErrorCode');

    const fixed = sanitizeStoryHtml(
      '<code class="story-inline-code">ApiResponse<T, ErrorCode></code>',
    );
    expect(fixed).toContain('ApiResponse&lt;T, ErrorCode&gt;');
  });

  it('keeps simple inline code', () => {
    expect(sanitizeStoryHtml('<code class="story-inline-code">api-client</code>')).toBe(
      '<code class="story-inline-code">api-client</code>',
    );
  });
});
