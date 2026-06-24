import { createElement, type ReactNode } from 'react';
import Image from 'next/image';
import {
  getStoryHeaderLevelClass,
  STORY_BODY_CLASS,
  STORY_QUOTE_CLASS,
} from '@/constants/story-typography';
import { sanitizeStoryHtml } from '@/lib/sanitize-html';
import { getBlockText } from '@/lib/project-detail-page';
import { prepareStoryRichTextHtml } from '@/lib/project-detail-page/story-inline-code-html';
import { isBlankStoryHtml } from '@/lib/project-detail-page/paragraph-html';
import type { EditorBlock, I18nLocale } from '@/modules/project-detail-page';
import { CodeBlock } from './CodeBlock';
import { EmbedBlock } from './EmbedBlock';
import { StoryDelimiterBlock } from './StoryDelimiterBlock';

function getImageUrl(data: Record<string, unknown>): string | null {
  const file = data.file;
  if (file && typeof file === 'object' && 'url' in file) {
    const url = (file as { url?: unknown }).url;
    if (typeof url === 'string' && url.length > 0) return url;
  }
  if (typeof data.url === 'string' && data.url.length > 0) return data.url;
  return null;
}

function storyHtml(text: string): string {
  return sanitizeStoryHtml(prepareStoryRichTextHtml(text));
}

function renderHeader(block: EditorBlock, locale: I18nLocale): ReactNode {
  const text = getBlockText(block, locale);
  if (!text) return null;
  const safeText = storyHtml(text);
  const level = Math.min(Math.max(Number(block.data.level) || 2, 1), 6);
  return createElement(
    `h${level}`,
    {
      className: `${getStoryHeaderLevelClass(level)} text-slate-900 dark:text-slate-100`,
    },
    createElement('span', { dangerouslySetInnerHTML: { __html: safeText } }),
  );
}

function renderParagraph(block: EditorBlock, locale: I18nLocale): ReactNode {
  const text = getBlockText(block, locale);
  if (isBlankStoryHtml(text)) {
    return <div className='story-paragraph-break' aria-hidden />;
  }
  const safeText = storyHtml(text);
  return (
    <div
      className={STORY_BODY_CLASS}
      dangerouslySetInnerHTML={{ __html: safeText }}
    />
  );
}

function renderQuote(block: EditorBlock, locale: I18nLocale): ReactNode {
  const text = getBlockText(block, locale);
  if (!text) return null;
  const safeText = storyHtml(text);
  return (
    <blockquote className={`${STORY_QUOTE_CLASS} ${STORY_BODY_CLASS}`}>
      <span dangerouslySetInnerHTML={{ __html: safeText }} />
    </blockquote>
  );
}

function renderList(block: EditorBlock, locale: I18nLocale): ReactNode {
  const text = getBlockText(block, locale);
  if (!text) return null;
  const safeText = storyHtml(text);
  const listClassName = `prose prose-zinc dark:prose-invert max-w-none ${STORY_BODY_CLASS} [&_li]:my-0.25 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5`;

  if (/^\s*<[uo]l[\s>]/i.test(safeText)) {
    return (
      <div
        className={listClassName}
        dangerouslySetInnerHTML={{ __html: safeText }}
      />
    );
  }

  const style = block.data.style === 'ordered' ? 'ol' : 'ul';
  return (
    <div
      className={listClassName}
      dangerouslySetInnerHTML={{ __html: `<${style}>${safeText}</${style}>` }}
    />
  );
}

function getVideoUrl(data: Record<string, unknown>): string | null {
  const file = data.file;
  if (file && typeof file === 'object' && 'url' in file) {
    const url = (file as { url?: unknown }).url;
    if (typeof url === 'string' && url.length > 0) return url;
  }
  if (typeof data.url === 'string' && data.url.length > 0) return data.url;
  return null;
}

function renderVideo(data: Record<string, unknown>): ReactNode {
  const url = getVideoUrl(data);
  if (!url) return null;
  const caption = typeof data.caption === 'string' ? data.caption : '';

  return (
    <figure className='space-y-1'>
      <video
        src={url}
        controls
        playsInline
        preload='metadata'
        className='block h-auto w-full rounded-xl bg-black'
      />
      {caption ? (
        <figcaption className='mt-1 text-center text-sm text-zinc-500'>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function renderImage(data: Record<string, unknown>): ReactNode {
  const url = getImageUrl(data);
  if (!url) return null;
  const caption = typeof data.caption === 'string' ? data.caption : '';
  const withBorder = Boolean(data.withBorder);
  const stretched = Boolean(data.stretched);

  return (
    <figure className='space-y-2'>
      <div
        className={`relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 ${
          withBorder ? 'border border-zinc-200 dark:border-zinc-800' : ''
        } ${stretched ? 'w-full' : 'w-full'}`}
      >
        <Image
          src={url}
          alt={caption || ''}
          width={1200}
          height={675}
          className={`h-auto w-full object-contain ${stretched ? '' : 'mx-auto'}`}
          unoptimized={url.startsWith('http://localhost')}
        />
      </div>
      {caption ? (
        <figcaption className='text-center text-sm text-zinc-500'>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function renderTable(data: Record<string, unknown>): ReactNode {
  const content = data.content;
  if (!Array.isArray(content) || content.length === 0) return null;
  const withHeadings = Boolean(data.withHeadings);
  const rows = content as string[][];

  return (
    <div className='story-table-wrap overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800'>
      <table className='story-table min-w-full border-collapse text-left text-sm'>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const CellTag = withHeadings && rowIndex === 0 ? 'th' : 'td';
                const cellHtml = storyHtml(String(cell ?? ''));
                return (
                  <CellTag
                    key={cellIndex}
                    className='px-4 py-3 align-top text-slate-700 dark:text-slate-300'
                  >
                    <div
                      className='story-table-cell'
                      dangerouslySetInnerHTML={{ __html: cellHtml }}
                    />
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function renderBlock(block: EditorBlock, locale: I18nLocale): ReactNode {
  switch (block.type) {
    case 'header':
      return renderHeader(block, locale);
    case 'paragraph':
      return renderParagraph(block, locale);
    case 'quote':
      return renderQuote(block, locale);
    case 'list':
      return renderList(block, locale);
    case 'image':
      return renderImage(block.data);
    case 'video':
      return renderVideo(block.data);
    case 'embed':
      return (
        <EmbedBlock
          service={block.data.service as string | undefined}
          source={block.data.source as string | undefined}
          embed={block.data.embed as string | undefined}
          caption={block.data.caption as string | undefined}
        />
      );
    case 'code':
      return <CodeBlock code={getBlockText(block, locale)} />;
    case 'delimiter':
      return <StoryDelimiterBlock />;
    case 'table':
      return renderTable(block.data);
    case 'details':
    case 'detailsEnd':
      return null;
    default:
      return null;
  }
}
