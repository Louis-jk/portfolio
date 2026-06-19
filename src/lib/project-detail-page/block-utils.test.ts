import { describe, expect, it } from 'vitest';
import type { EditorBlock, EditorOutput } from '@/modules/project-detail-page/types';
import {
  getBlockText,
  hasRenderableBlocks,
  isAdminI18nFallback,
  isI18nTextBlock,
  resolveAdminI18nText,
} from './block-utils';

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

  it('shows Korean source in admin JA/EN tabs when locale is empty', () => {
    const i18n = paragraphBlock.data.i18n as {
      ko: string;
      en: string;
    };
    expect(resolveAdminI18nText(i18n, 'ja')).toBe('한국어');
    expect(resolveAdminI18nText(i18n, 'en')).toBe('English');
    expect(isAdminI18nFallback(i18n, 'ja')).toBe(true);
    expect(isAdminI18nFallback(i18n, 'en')).toBe(false);
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
