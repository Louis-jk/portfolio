import { describe, expect, it } from 'vitest';
import type { EditorBlock } from '@/entities/project-detail-page/model/types';
import { walkEditorBlocksWithPaths } from '@/entities/project-detail-page/lib/story-blocks';

function block(type: string, data: Record<string, unknown> = {}): EditorBlock {
  return { type, data };
}

describe('walkEditorBlocksWithPaths', () => {
  it('visits flat blocks with numeric paths', () => {
    const paths: string[] = [];
    walkEditorBlocksWithPaths(
      [block('paragraph'), block('code', { code: 'a' })],
      (_, path) => paths.push(path),
    );
    expect(paths).toEqual(['0', '1']);
  });

  it('visits nested details children', () => {
    const paths: string[] = [];
    walkEditorBlocksWithPaths(
      [
        block('details', {
          i18n: { ko: '제목' },
          children: [block('code', { code: 'mermaid' })],
        }),
      ],
      (_, path) => paths.push(path),
    );
    expect(paths).toEqual(['0', '0.children.0']);
  });
});
