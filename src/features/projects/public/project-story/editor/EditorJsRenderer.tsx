'use client';

import type { EditorOutput, I18nLocale } from '@/entities/project-detail-page';
import { renderStoryBlocks } from './render-story-blocks';

type EditorJsRendererProps = {
  content: EditorOutput;
  locale: I18nLocale;
};

export function EditorJsRenderer({ content, locale }: EditorJsRendererProps) {
  if (!content.blocks.length) return null;

  return (
    <article className='story-prose'>
      {renderStoryBlocks(content.blocks, locale)}
    </article>
  );
}
