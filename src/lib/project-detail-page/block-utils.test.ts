import { describe, expect, it } from 'vitest';
import type { EditorBlock, EditorOutput } from '@/modules/project-detail-page/types';
import {
  getBlockI18n,
  getBlockText,
  hasRenderableBlocks,
  isI18nCodeBlock,
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
    expect(isI18nCodeBlock('code')).toBe(true);
    expect(isI18nTextBlock('code')).toBe(false);
  });

  it('resolves locale text with fallback chain', () => {
    expect(getBlockText(paragraphBlock, 'ko')).toBe('한국어');
    expect(getBlockText(paragraphBlock, 'en')).toBe('English');
    expect(getBlockText(paragraphBlock, 'ja')).toBe('한국어');
  });

  it('skips blank locale values when falling back', () => {
    const block: EditorBlock = {
      type: 'paragraph',
      data: { i18n: { ko: '한국어', ja: '' } },
    };
    expect(getBlockText(block, 'ja')).toBe('한국어');
  });

  it('shows only the active locale in admin editor', () => {
    const i18n = paragraphBlock.data.i18n as {
      ko: string;
      en: string;
    };
    expect(resolveAdminI18nText(i18n, 'ja')).toBe('');
    expect(resolveAdminI18nText(i18n, 'en')).toBe('English');
  });

  it('migrates legacy shared code blocks to Korean i18n', () => {
    expect(
      getBlockI18n({ type: 'code', data: { code: 'flowchart LR' } }),
    ).toEqual({ ko: 'flowchart LR' });
    expect(getBlockText({ type: 'code', data: { code: 'flowchart LR' } }, 'ja')).toBe(
      'flowchart LR',
    );
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
