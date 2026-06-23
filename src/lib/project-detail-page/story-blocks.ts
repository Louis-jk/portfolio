import type { EditorBlock, EditorOutput } from '@/modules/project-detail-page/types';
import { SHARED_BLOCK_TYPES } from '@/modules/project-detail-page/types';

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

function collectSharedBlocksInWalkOrder(blocks: EditorBlock[]): EditorBlock[] {
  const shared: EditorBlock[] = [];
  walkEditorBlocksWithPaths(blocks, (block) => {
    if (isSharedBlockType(block.type)) {
      shared.push(block);
    }
  });
  return shared;
}

/** Keep image/embed/etc. from the pre-translate snapshot (locale-agnostic). */
export function preserveSharedBlockData(
  original: EditorOutput,
  translated: EditorOutput,
): EditorOutput {
  const originalShared = collectSharedBlocksInWalkOrder(original.blocks);
  let sharedIndex = 0;

  return {
    ...translated,
    blocks: mapEditorBlocksWithPaths(translated.blocks, (block) => {
      if (!isSharedBlockType(block.type)) return block;

      const snapshot = originalShared[sharedIndex++];
      if (!snapshot || snapshot.type !== block.type) return block;

      return {
        ...block,
        data: snapshot.data,
      };
    }),
  };
}
