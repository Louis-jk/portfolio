import { describe, expect, it } from 'vitest';
import {
  isBlankStoryHtml,
  mergeParagraphI18n,
  normalizeParagraphBlockI18n,
  normalizeParagraphHtml,
  STORY_SPACER_HTML,
} from './paragraph-html';

describe('isBlankStoryHtml', () => {
  it('detects empty and whitespace-only html', () => {
    expect(isBlankStoryHtml('')).toBe(true);
    expect(isBlankStoryHtml('   ')).toBe(true);
    expect(isBlankStoryHtml('<br>')).toBe(true);
    expect(isBlankStoryHtml('<div><br></div>')).toBe(true);
    expect(isBlankStoryHtml(STORY_SPACER_HTML)).toBe(true);
  });

  it('keeps paragraphs with visible text', () => {
    expect(isBlankStoryHtml('hello')).toBe(false);
    expect(isBlankStoryHtml('<p>hello</p>')).toBe(false);
    expect(isBlankStoryHtml('line<br>break')).toBe(false);
  });
});

describe('normalizeParagraphHtml', () => {
  it('stores blank lines as spacer markers', () => {
    expect(normalizeParagraphHtml('')).toBe(STORY_SPACER_HTML);
    expect(normalizeParagraphHtml('<br>')).toBe(STORY_SPACER_HTML);
  });
});

describe('mergeParagraphI18n', () => {
  it('updates only the active locale', () => {
    expect(mergeParagraphI18n({ ko: '본문' }, 'ja', '日本語')).toEqual({
      ko: '본문',
      ja: '日本語',
    });
  });

  it('stores blank lines for the active locale only', () => {
    expect(mergeParagraphI18n({ ko: '본문' }, 'ja', '')).toEqual({
      ko: '본문',
      ja: STORY_SPACER_HTML,
    });
  });
});

describe('normalizeParagraphBlockI18n', () => {
  it('normalizes each locale independently', () => {
    expect(
      normalizeParagraphBlockI18n({
        ko: '본문',
        ja: '',
        en: '<br>',
      }),
    ).toEqual({
      ko: '본문',
      ja: STORY_SPACER_HTML,
      en: STORY_SPACER_HTML,
    });
  });
});
