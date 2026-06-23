import { describe, expect, it } from 'vitest';
import type { EditorBlock, EditorOutput } from '@/modules/project-detail-page/types';
import { preserveSharedBlockData } from './story-blocks';

function block(type: string, data: Record<string, unknown> = {}): EditorBlock {
  return { type, data };
}

const output = (blocks: EditorBlock[]): EditorOutput => ({
  time: 0,
  version: '2.29.0',
  blocks,
});

describe('preserveSharedBlockData', () => {
  it('keeps image blocks from the pre-translate snapshot', () => {
    const original = output([
      block('paragraph', { i18n: { ko: '한국어' } }),
      block('image', { file: { url: 'https://example.com/a.png' } }),
    ]);
    const translated = output([
      block('paragraph', { i18n: { ko: '한국어', ja: '日本語' } }),
      block('image', { file: { url: 'https://example.com/b.png' } }),
    ]);

    const merged = preserveSharedBlockData(original, translated);
    expect(merged.blocks[1]?.data.file).toEqual({
      url: 'https://example.com/a.png',
    });
    expect(merged.blocks[0]?.data.i18n).toEqual({ ko: '한국어', ja: '日本語' });
  });

  it('does not overwrite locale-specific code blocks', () => {
    const original = output([
      block('code', { i18n: { ko: 'flowchart LR\n  A --> B' } }),
    ]);
    const translated = output([
      block('code', {
        i18n: {
          ko: 'flowchart LR\n  A --> B',
          ja: 'flowchart LR\n  A --> B\n  C[上書き]',
        },
      }),
    ]);

    const merged = preserveSharedBlockData(original, translated);
    expect(merged.blocks[0]?.data.i18n).toEqual({
      ko: 'flowchart LR\n  A --> B',
      ja: 'flowchart LR\n  A --> B\n  C[上書き]',
    });
  });
});
