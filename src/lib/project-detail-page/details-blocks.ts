import type {
  EditorBlock,
  EditorOutput,
} from '@/modules/project-detail-page/types';

export const DETAILS_START_BLOCK_TYPE = 'details';
export const DETAILS_END_BLOCK_TYPE = 'detailsEnd';

export type StorySegment =
  | { kind: 'block'; block: EditorBlock }
  | {
      kind: 'details';
      summaryBlock: EditorBlock;
      innerBlocks: EditorBlock[];
    };

function normalizeBlockType(type: string): string {
  switch (type) {
    case 'details-end':
    case 'details_end':
      return DETAILS_END_BLOCK_TYPE;
    default:
      return type;
  }
}

function normalizeBlock(block: EditorBlock): EditorBlock {
  const type = normalizeBlockType(block.type);
  return type === block.type ? block : { ...block, type };
}

function stripDetailsChildren(data: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...data };
  delete rest.children;
  return rest;
}

function extractDetailsInnerBlocks(
  blocks: EditorBlock[],
  startIndex: number,
): { innerBlocks: EditorBlock[]; nextIndex: number } {
  const innerBlocks: EditorBlock[] = [];
  let index = startIndex;
  let depth = 1;

  while (index < blocks.length && depth > 0) {
    const block = normalizeBlock(blocks[index]);

    if (block.type === DETAILS_START_BLOCK_TYPE) {
      innerBlocks.push(block);
      depth += 1;
      index += 1;
      continue;
    }

    if (block.type === DETAILS_END_BLOCK_TYPE) {
      depth -= 1;
      index += 1;
      if (depth === 0) {
        return { innerBlocks, nextIndex: index };
      }
      innerBlocks.push(block);
      continue;
    }

    innerBlocks.push(block);
    index += 1;
  }

  return { innerBlocks, nextIndex: index };
}

/** Group flat Editor.js blocks into top-level segments with nested details sections. */
export function parseStorySegments(blocks: EditorBlock[]): StorySegment[] {
  const segments: StorySegment[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = normalizeBlock(blocks[index]);

    if (block.type === DETAILS_END_BLOCK_TYPE) {
      index += 1;
      continue;
    }

    if (block.type === DETAILS_START_BLOCK_TYPE) {
      const storedChildren = block.data.children;
      if (Array.isArray(storedChildren)) {
        segments.push({
          kind: 'details',
          summaryBlock: block,
          innerBlocks: storedChildren as EditorBlock[],
        });
        index += 1;
        continue;
      }

      const { innerBlocks, nextIndex } = extractDetailsInnerBlocks(
        blocks,
        index + 1,
      );
      segments.push({
        kind: 'details',
        summaryBlock: block,
        innerBlocks,
      });
      index = nextIndex;
      continue;
    }

    segments.push({ kind: 'block', block });
    index += 1;
  }

  return segments;
}

function nestDetailsBlockList(blocks: EditorBlock[]): EditorBlock[] {
  const nested: EditorBlock[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = normalizeBlock(blocks[index]);

    if (block.type === DETAILS_END_BLOCK_TYPE) {
      index += 1;
      continue;
    }

    if (block.type === DETAILS_START_BLOCK_TYPE) {
      const { innerBlocks, nextIndex } = extractDetailsInnerBlocks(
        blocks,
        index + 1,
      );
      nested.push({
        ...block,
        data: {
          ...stripDetailsChildren(block.data),
          children: nestDetailsBlockList(innerBlocks),
        },
      });
      index = nextIndex;
      continue;
    }

    nested.push(block);
    index += 1;
  }

  return nested;
}

/** Persist grouped children on each details block; removes flat markers. */
export function nestDetailsBlocks(content: EditorOutput): EditorOutput {
  return {
    ...content,
    blocks: nestDetailsBlockList(content.blocks),
    time: Date.now(),
  };
}

function flattenDetailsBlockList(blocks: EditorBlock[]): EditorBlock[] {
  const flat: EditorBlock[] = [];

  for (const raw of blocks) {
    const block = normalizeBlock(raw);

    if (block.type === DETAILS_START_BLOCK_TYPE) {
      flat.push({
        ...block,
        data: stripDetailsChildren(block.data),
      });

      const children = block.data.children;
      if (Array.isArray(children) && children.length > 0) {
        flat.push(...flattenDetailsBlockList(children as EditorBlock[]));
      }

      flat.push({ type: DETAILS_END_BLOCK_TYPE, data: {} });
      continue;
    }

    if (block.type === DETAILS_END_BLOCK_TYPE) {
      continue;
    }

    flat.push(block);
  }

  return flat;
}

/** Expand stored children back into flat editor blocks for Admin. */
export function flattenDetailsBlocks(content: EditorOutput): EditorOutput {
  return {
    ...content,
    blocks: flattenDetailsBlockList(content.blocks),
  };
}

export function findEmptyDetailsSections(content: EditorOutput): EditorBlock[] {
  return content.blocks.filter((block) => {
    if (normalizeBlockType(block.type) !== DETAILS_START_BLOCK_TYPE) return false;
    const children = block.data.children;
    return !Array.isArray(children) || children.length === 0;
  });
}
