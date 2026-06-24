import { describe, expect, it } from 'vitest';
import {
  extractCodeFromHtml,
  extractFencedCode,
  looksLikePreformattedPlainText,
} from './editor-code-paste';

describe('extractFencedCode', () => {
  it('unwraps markdown fences', () => {
    expect(extractFencedCode('```\ncode? text?\n```')).toBe('code? text?');
    expect(extractFencedCode('```text\ntree\nline\n```')).toBe('tree\nline');
  });

  it('ignores normal text', () => {
    expect(extractFencedCode('hello')).toBeNull();
    expect(extractFencedCode('```not closed')).toBeNull();
  });
});

describe('extractCodeFromHtml', () => {
  it('reads pre and multiline code tags', () => {
    expect(extractCodeFromHtml('<pre>line1\nline2</pre>')).toBe('line1\nline2');
    expect(
      extractCodeFromHtml('<code>project/\n├── src/</code>'),
    ).toBe('project/\n├── src/');
  });
});

describe('looksLikePreformattedPlainText', () => {
  it('detects gemini-style tree structures', () => {
    const tree = `project/
├── src/
│   └── app/
└── package.json`;

    expect(looksLikePreformattedPlainText(tree)).toBe(true);
  });

  it('ignores regular paragraphs', () => {
    expect(looksLikePreformattedPlainText('Hello\nWorld')).toBe(false);
  });
});
