import { describe, expect, it } from 'vitest';
import {
  getBlockText,
  hasRenderableBlocks,
  isI18nTextBlock,
} from './block-utils';
import type { EditorBlock, EditorOutput } from '../types';

describe('block-utils', () => {
  const paragraphBlock: EditorBlock = {
    type: 'paragraph',
    data: {
      i18n: {
        ko: '한국어',
        en: 'English',
      },
    },
  };

  it('detects i18n text blocks', () => {
    expect(isI18nTextBlock('paragraph')).toBe(true);
    expect(isI18nTextBlock('image')).toBe(false);
  });

  it('resolves locale text with fallback chain', () => {
    expect(getBlockText(paragraphBlock, 'ko')).toBe('한국어');
    expect(getBlockText(paragraphBlock, 'en')).toBe('English');
    expect(getBlockText(paragraphBlock, 'ja')).toBe('한국어');
  });

  it('returns empty string when i18n is missing', () => {
    expect(getBlockText({ type: 'paragraph', data: {} }, 'ko')).toBe('');
  });

  it('detects renderable blocks', () => {
    const empty: EditorOutput = { time: 0, version: '2.29.0', blocks: [] };
    const filled: EditorOutput = {
      time: 1,
      version: '2.29.0',
      blocks: [paragraphBlock],
    };
    expect(hasRenderableBlocks(empty)).toBe(false);
    expect(hasRenderableBlocks(filled)).toBe(true);
    expect(hasRenderableBlocks(null)).toBe(false);
  });
});
