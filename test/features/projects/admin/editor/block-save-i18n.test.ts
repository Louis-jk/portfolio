import { describe, expect, it } from 'vitest';
import {
  extractHeaderLevelFromBlockSave,
  extractI18nFromBlockSave,
} from '@/features/projects/admin/editor/block-save-i18n';

describe('extractI18nFromBlockSave', () => {
  it('reads i18n from tool save payload', () => {
    expect(
      extractI18nFromBlockSave({
        i18n: { ko: '한국어', ja: '日本語' },
        level: 2,
      }),
    ).toEqual({ ko: '한국어', ja: '日本語' });
  });

  it('reads i18n from wrapped data payload', () => {
    expect(
      extractI18nFromBlockSave({
        data: { i18n: { ko: '한국어' } },
      }),
    ).toEqual({ ko: '한국어' });
  });

  it('returns empty object for unknown shapes', () => {
    expect(extractI18nFromBlockSave(null)).toEqual({});
    expect(extractI18nFromBlockSave({})).toEqual({});
  });
});

describe('extractHeaderLevelFromBlockSave', () => {
  it('reads level from tool save payload', () => {
    expect(extractHeaderLevelFromBlockSave({ level: 3, i18n: {} })).toBe(3);
  });

  it('reads level from wrapped data payload', () => {
    expect(
      extractHeaderLevelFromBlockSave({ data: { level: 4, i18n: {} } }),
    ).toBe(4);
  });
});
