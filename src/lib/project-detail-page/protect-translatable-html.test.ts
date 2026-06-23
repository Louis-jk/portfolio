import { describe, expect, it } from 'vitest';
import {
  protectNonTranslatableHtml,
  restoreNonTranslatableHtml,
} from './protect-translatable-html';

describe('protectNonTranslatableHtml', () => {
  it('shields fenced mermaid blocks', () => {
    const source =
      '<p>설명</p>```mermaid\nflowchart LR\n  A[시작] --> B[끝]\n```';
    const { html, segments } = protectNonTranslatableHtml(source);

    expect(html).not.toContain('flowchart');
    expect(html).toContain('___NT_0___');
    expect(segments[0]).toContain('flowchart LR');
    expect(restoreNonTranslatableHtml(html, segments)).toBe(source);
  });

  it('shields pre/code markup', () => {
    const source = '<p>before</p><pre><code>mermaid\nA-->B</code></pre>';
    const { html, segments } = protectNonTranslatableHtml(source);
    const restored = restoreNonTranslatableHtml(html, segments);

    expect(restored).toBe(source);
    expect(segments.length).toBeGreaterThan(0);
  });
});
