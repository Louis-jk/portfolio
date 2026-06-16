'use client';

import type { EditorOutput, I18nLocale } from '../types';
import { renderBlock } from './render-block';

type EditorJsRendererProps = {
  content: EditorOutput;
  locale: I18nLocale;
};

export function EditorJsRenderer({ content, locale }: EditorJsRendererProps) {
  if (!content.blocks.length) return null;

  return (
    <article className='space-y-8'>
      {content.blocks.map((block, index) => {
        const node = renderBlock(block, locale);
        if (!node) return null;
        return (
          <div key={block.id ?? `${block.type}-${index}`} className='editor-block'>
            {node}
          </div>
        );
      })}
    </article>
  );
}
