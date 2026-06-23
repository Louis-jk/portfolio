import { describe, expect, it } from 'vitest';
import {
  decodeEscapedStoryHtml,
  normalizeStoryInlineCodeInHtml,
  prepareStoryRichTextHtml,
} from './story-inline-code-html';

describe('normalizeStoryInlineCodeInHtml', () => {
  it('converts paired backticks in plain text', () => {
    expect(normalizeStoryInlineCodeInHtml('`api-client`')).toBe(
      '<code class="story-inline-code">api-client</code>',
    );
    expect(
      normalizeStoryInlineCodeInHtml('use `service` here'),
    ).toBe('use <code class="story-inline-code">service</code> here');
  });

  it('still converts backticks when code tags already exist elsewhere', () => {
    expect(
      normalizeStoryInlineCodeInHtml(
        '<code class="story-inline-code">api</code> and `service`',
      ),
    ).toBe(
      '<code class="story-inline-code">api</code> and <code class="story-inline-code">service</code>',
    );
  });

  it('ignores unclosed backticks', () => {
    expect(normalizeStoryInlineCodeInHtml('`api-client')).toBe('`api-client');
  });
});

describe('decodeEscapedStoryHtml', () => {
  it('decodes escaped code markup', () => {
    expect(
      decodeEscapedStoryHtml(
        '&lt;code class="story-inline-code"&gt;api-client&lt;/code&gt;',
      ),
    ).toBe('<code class="story-inline-code">api-client</code>');
  });
});

describe('prepareStoryRichTextHtml', () => {
  it('trims and normalizes backticks', () => {
    expect(prepareStoryRichTextHtml(' `foo` ')).toBe(
      '<code class="story-inline-code">foo</code>',
    );
  });
});
