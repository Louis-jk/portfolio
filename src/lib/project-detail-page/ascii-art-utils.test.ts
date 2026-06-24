import { describe, expect, it } from 'vitest';
import { normalizeFixedWidthAscii } from './ascii-art-utils';

describe('normalizeFixedWidthAscii', () => {
  it('converts fullwidth spaces and punctuation to halfwidth', () => {
    expect(normalizeFixedWidthAscii('｜Ａ－＞Ｂ')).toBe('|A->B');
    expect(normalizeFixedWidthAscii('　hello')).toBe(' hello');
  });

  it('expands tabs and normalizes box-drawing characters', () => {
    expect(normalizeFixedWidthAscii('a\tb')).toBe('a    b');
    expect(normalizeFixedWidthAscii('───▶')).toBe('--->');
    expect(normalizeFixedWidthAscii('│')).toBe('|');
  });
});
