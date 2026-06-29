'use client';

import { ChevronRight } from 'lucide-react';
import { getBlockText } from '@/entities/project-detail-page/lib';
import { sanitizeHtml } from '@/lib/sanitize-html';
import type { EditorBlock, I18nLocale } from '@/entities/project-detail-page';

type StoryDetailsSectionProps = {
  summaryBlock: EditorBlock;
  locale: I18nLocale;
  children: React.ReactNode;
};

export function StoryDetailsSection({
  summaryBlock,
  locale,
  children,
}: StoryDetailsSectionProps) {
  const summary = sanitizeHtml(getBlockText(summaryBlock, locale));
  const defaultOpen = Boolean(summaryBlock.data.defaultOpen);

  if (!summary && !children) return null;

  return (
    <details className='story-details' open={defaultOpen || undefined}>
      <summary className='story-details-summary'>
        <ChevronRight
          aria-hidden
          className='story-details-chevron size-4 shrink-0 text-purple-500'
        />
        {summary ? (
          <span
            className='text-base font-medium text-slate-800 dark:text-slate-100'
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        ) : (
          <span className='text-base font-medium text-zinc-400'>제목 없음</span>
        )}
      </summary>
      <div className='story-details-body'>{children}</div>
    </details>
  );
}
