import { describe, expect, it } from 'vitest';
import {
  getLinePrefixBeforeCursor,
  matchMarkdownHeader,
  matchMarkdownOnEnter,
  matchMarkdownOnSpace,
} from './editor-markdown-shortcuts';

describe('matchMarkdownHeader', () => {
  it('converts hash-only at cursor', () => {
    expect(matchMarkdownHeader('###', '###')).toEqual({ level: 3, text: '' });
    expect(matchMarkdownHeader('##', '##Hello')).toEqual({
      level: 2,
      text: 'Hello',
    });
  });

  it('keeps trailing text on the same line', () => {
    expect(matchMarkdownHeader('### ', '### Hello')).toEqual({
      level: 3,
      text: 'Hello',
    });
  });
});

describe('matchMarkdownOnSpace', () => {
  it('converts headings from cursor position', () => {
    expect(matchMarkdownOnSpace('###', '###')?.type).toBe('header');
    expect(matchMarkdownOnSpace('###', '###')?.data.level).toBe(3);
  });

  it('converts list markers', () => {
    expect(matchMarkdownOnSpace('-', '-')?.type).toBe('list');
    expect(matchMarkdownOnSpace('*', '*')?.type).toBe('list');
    expect(matchMarkdownOnSpace('-', '- hello')?.type).toBe('list');
    expect(
      (matchMarkdownOnSpace('-', '- hello')?.data as { html?: string })?.html,
    ).toContain('hello');
  });

  it('converts ordered list markers', () => {
    expect(matchMarkdownOnSpace('1.', '1.')?.type).toBe('list');
    expect(
      (matchMarkdownOnSpace('1.', '1.')?.data as { html?: string })?.html,
    ).toContain('<ol>');
  });

  it('detects line-start markers after soft breaks', () => {
    expect(getLinePrefixBeforeCursor('hello\n-')).toBe('-');
    expect(matchMarkdownOnSpace('hello\n-', 'hello\n-')?.type).toBe('list');
  });

  it('converts quote marker', () => {
    expect(matchMarkdownOnSpace('>', '>')?.type).toBe('quote');
  });

  it('ignores normal text', () => {
    expect(matchMarkdownOnSpace('hello', 'hello')).toBeNull();
  });

  it('does not convert when space is pressed after heading text', () => {
    expect(matchMarkdownOnSpace('### Hello', '### Hello')).toBeNull();
  });
});

describe('matchMarkdownOnEnter', () => {
  it('converts delimiter and code fences', () => {
    expect(matchMarkdownOnEnter('---')).toBe('delete-and-insert-delimiter');
    expect(matchMarkdownOnEnter('```')).toBe('delete-and-insert-code');
    expect(matchMarkdownOnEnter('```mermaid')).toBe('delete-and-insert-code');
  });
});
