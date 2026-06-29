import { describe, expect, it } from 'vitest';
import type { EditorBlock, EditorOutput } from '@/entities/project-detail-page/model/types';
import {
  flattenDetailsBlocks,
  nestDetailsBlocks,
  parseStorySegments,
} from '@/entities/project-detail-page/lib/details-blocks';

function block(type: string, data: Record<string, unknown> = {}): EditorBlock {
  return { type, data };
}

const output = (blocks: EditorBlock[]): EditorOutput => ({
  time: 0,
  version: '2.29.0',
  blocks,
});

describe('parseStorySegments', () => {
  it('returns flat blocks unchanged', () => {
    const blocks = [block('paragraph'), block('code', { code: 'x' })];
    const segments = parseStorySegments(blocks);

    expect(segments).toEqual([
      { kind: 'block', block: blocks[0] },
      { kind: 'block', block: blocks[1] },
    ]);
  });

  it('groups blocks between details and detailsEnd', () => {
    const blocks = [
      block('paragraph'),
      block('details', { i18n: { ko: '제목' } }),
      block('code', { code: 'flowchart LR' }),
      block('image'),
      block('detailsEnd'),
      block('paragraph'),
    ];

    const segments = parseStorySegments(blocks);

    expect(segments).toHaveLength(3);
    expect(segments[0]).toEqual({ kind: 'block', block: blocks[0] });
    expect(segments[1]).toMatchObject({
      kind: 'details',
      summaryBlock: blocks[1],
      innerBlocks: [blocks[2], blocks[3]],
    });
    expect(segments[2]).toEqual({ kind: 'block', block: blocks[5] });
  });

  it('uses stored children on details blocks', () => {
    const details = block('details', {
      i18n: { ko: '제목' },
      children: [block('code', { code: 'a' })],
    });
    const segments = parseStorySegments([details, block('paragraph')]);

    expect(segments).toEqual([
      {
        kind: 'details',
        summaryBlock: details,
        innerBlocks: [block('code', { code: 'a' })],
      },
      { kind: 'block', block: block('paragraph') },
    ]);
  });

  it('supports nested details sections', () => {
    const blocks = [
      block('details', { i18n: { ko: 'Outer' } }),
      block('paragraph'),
      block('details', { i18n: { ko: 'Inner' } }),
      block('code', { code: 'a' }),
      block('detailsEnd'),
      block('image'),
      block('detailsEnd'),
    ];

    const segments = parseStorySegments(blocks);
    expect(segments).toHaveLength(1);

    const outer = segments[0];
    if (outer.kind !== 'details') throw new Error('expected details segment');

    expect(outer.innerBlocks).toEqual([
      blocks[1],
      blocks[2],
      blocks[3],
      blocks[4],
      blocks[5],
    ]);

    const innerSegments = parseStorySegments(outer.innerBlocks);
    expect(innerSegments).toEqual([
      { kind: 'block', block: blocks[1] },
      {
        kind: 'details',
        summaryBlock: blocks[2],
        innerBlocks: [blocks[3]],
      },
      { kind: 'block', block: blocks[5] },
    ]);
  });

  it('skips orphan detailsEnd markers', () => {
    const paragraph = block('paragraph');
    const segments = parseStorySegments([block('detailsEnd'), paragraph]);

    expect(segments).toEqual([{ kind: 'block', block: paragraph }]);
  });
});

describe('nestDetailsBlocks / flattenDetailsBlocks', () => {
  it('round-trips grouped content for the editor', () => {
    const flat = output([
      block('details', { i18n: { ko: '제목' }, defaultOpen: true }),
      block('paragraph', { i18n: { ko: '본문' } }),
      block('code', { code: 'flowchart LR' }),
      block('detailsEnd'),
      block('paragraph', { i18n: { ko: '밖' } }),
    ]);

    const nested = nestDetailsBlocks(flat);
    expect(nested.blocks).toHaveLength(2);
    expect(nested.blocks[0]).toMatchObject({
      type: 'details',
      data: {
        i18n: { ko: '제목' },
        defaultOpen: true,
        children: [
          block('paragraph', { i18n: { ko: '본문' } }),
          block('code', { code: 'flowchart LR' }),
        ],
      },
    });

    expect(flattenDetailsBlocks(nested).blocks.map((item) => item.type)).toEqual([
      'details',
      'paragraph',
      'code',
      'detailsEnd',
      'paragraph',
    ]);
  });

  it('renders nested storage without flat markers', () => {
    const nested = nestDetailsBlocks(
      output([
        block('details', { i18n: { ko: '제목' } }),
        block('code', { code: 'a' }),
        block('detailsEnd'),
      ]),
    );

    const segments = parseStorySegments(nested.blocks);
    expect(segments).toEqual([
      {
        kind: 'details',
        summaryBlock: nested.blocks[0],
        innerBlocks: [block('code', { code: 'a' })],
      },
    ]);
  });
});
