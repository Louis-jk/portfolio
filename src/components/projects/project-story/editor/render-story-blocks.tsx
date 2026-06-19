import type { ReactNode } from 'react';
import { parseStorySegments } from '@/lib/project-detail-page/details-blocks';
import type { EditorBlock, I18nLocale } from '@/modules/project-detail-page';
import { renderBlock } from './render-block';
import { StoryDetailsSection } from './StoryDetailsSection';

function blockKey(block: EditorBlock, index: number): string {
  return block.id ?? `${block.type}-${index}`;
}

export function renderStoryBlocks(
  blocks: EditorBlock[],
  locale: I18nLocale,
): ReactNode {
  const segments = parseStorySegments(blocks);

  return segments.map((segment, index) => {
    if (segment.kind === 'block') {
      const node = renderBlock(segment.block, locale);
      if (!node) return null;
      return (
        <div
          key={blockKey(segment.block, index)}
          className='editor-block'
        >
          {node}
        </div>
      );
    }

    const inner = renderStoryBlocks(segment.innerBlocks, locale);
    if (!inner) return null;

    return (
      <div key={blockKey(segment.summaryBlock, index)} className='editor-block'>
        <StoryDetailsSection
          summaryBlock={segment.summaryBlock}
          locale={locale}
        >
          {inner}
        </StoryDetailsSection>
      </div>
    );
  });
}
