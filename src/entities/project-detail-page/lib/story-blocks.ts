import type { EditorBlock, EditorOutput } from '@/entities/project-detail-page/model/types';
import { SHARED_BLOCK_TYPES } from '@/entities/project-detail-page/model/types';

export function isSharedBlockType(type: string): boolean {
  return (SHARED_BLOCK_TYPES as readonly string[]).includes(type);
}

export function walkEditorBlocksWithPaths(
  blocks: EditorBlock[],
  visitor: (block: EditorBlock, path: string) => void,
  parentPath = '',
): void {
  blocks.forEach((block, index) => {
    const path = parentPath ? `${parentPath}.${index}` : String(index);
    visitor(block, path);

    const children = block.data?.children;
    if (Array.isArray(children) && children.length > 0) {
      walkEditorBlocksWithPaths(
        children as EditorBlock[],
        visitor,
        `${path}.children`,
      );
    }
  });
}

export function mapEditorBlocksWithPaths(
  blocks: EditorBlock[],
  mapper: (block: EditorBlock, path: string) => EditorBlock,
  parentPath = '',
): EditorBlock[] {
  return blocks.map((block, index) => {
    const path = parentPath ? `${parentPath}.${index}` : String(index);
    const mapped = mapper(block, path);
    const children = mapped.data?.children;

    if (Array.isArray(children) && children.length > 0) {
      return {
        ...mapped,
        data: {
          ...mapped.data,
          children: mapEditorBlocksWithPaths(
            children as EditorBlock[],
            mapper,
            `${path}.children`,
          ),
        },
      };
    }

    return mapped;
  });
}

function collectSharedBlocksByPath(
  blocks: EditorBlock[],
): Map<string, EditorBlock> {
  const shared = new Map<string, EditorBlock>();
  walkEditorBlocksWithPaths(blocks, (block, path) => {
    if (isSharedBlockType(block.type)) {
      shared.set(path, block);
    }
  });
  return shared;
}

/** Keep image/embed/etc. from the pre-translate snapshot (locale-agnostic). */
export function preserveSharedBlockData(
  original: EditorOutput,
  translated: EditorOutput,
): EditorOutput {
  const originalShared = collectSharedBlocksByPath(original.blocks);

  return {
    ...translated,
    blocks: mapEditorBlocksWithPaths(translated.blocks, (block, path) => {
      if (!isSharedBlockType(block.type)) return block;

      const snapshot = originalShared.get(path);
      if (!snapshot || snapshot.type !== block.type) return block;

      return {
        ...block,
        data: snapshot.data,
      };
    }),
  };
}
