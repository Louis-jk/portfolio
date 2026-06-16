import { createElement, type ReactNode } from 'react';
import Image from 'next/image';
import { sanitizeHtml } from '@/lib/sanitize-html';
import type { EditorBlock, I18nLocale } from '../types';
import { getBlockText } from '../lib/block-utils';
import { CodeBlock } from './CodeBlock';
import { EmbedBlock } from './EmbedBlock';

function getImageUrl(data: Record<string, unknown>): string | null {
  const file = data.file;
  if (file && typeof file === 'object' && 'url' in file) {
    const url = (file as { url?: unknown }).url;
    if (typeof url === 'string' && url.length > 0) return url;
  }
  if (typeof data.url === 'string' && data.url.length > 0) return data.url;
  return null;
}

function renderHeader(block: EditorBlock, locale: I18nLocale): ReactNode {
  const text = getBlockText(block, locale);
  if (!text) return null;
  const safeText = sanitizeHtml(text);
  const level = Math.min(Math.max(Number(block.data.level) || 2, 1), 6);
  return createElement(
    `h${level}`,
    {
      className:
        'font-black tracking-tight text-slate-900 dark:text-slate-100',
    },
    createElement('span', { dangerouslySetInnerHTML: { __html: safeText } }),
  );
}

function renderParagraph(block: EditorBlock, locale: I18nLocale): ReactNode {
  const text = getBlockText(block, locale);
  if (!text) return null;
  const safeText = sanitizeHtml(text);
  return (
    <p
      className='leading-relaxed text-slate-700 dark:text-slate-300'
      dangerouslySetInnerHTML={{ __html: safeText }}
    />
  );
}

function renderQuote(block: EditorBlock, locale: I18nLocale): ReactNode {
  const text = getBlockText(block, locale);
  if (!text) return null;
  const safeText = sanitizeHtml(text);
  return (
    <blockquote className='border-l-4 border-purple-500 pl-4 italic text-slate-600 dark:text-slate-400'>
      <span dangerouslySetInnerHTML={{ __html: safeText }} />
    </blockquote>
  );
}

function renderList(block: EditorBlock, locale: I18nLocale): ReactNode {
  const text = getBlockText(block, locale);
  if (!text) return null;
  const safeText = sanitizeHtml(text);
  const style = block.data.style === 'ordered' ? 'ol' : 'ul';
  return (
    <div
      className='prose prose-zinc dark:prose-invert max-w-none [&_li]:my-1'
      dangerouslySetInnerHTML={{ __html: `<${style}>${safeText}</${style}>` }}
    />
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
        } ${stretched ? 'w-full' : 'mx-auto max-w-3xl'}`}
      >
        <Image
          src={url}
          alt={caption || ''}
          width={1200}
          height={675}
          className={`h-auto w-full object-cover ${stretched ? '' : 'mx-auto'}`}
          unoptimized={url.startsWith('http://localhost')}
        />
      </div>
      {caption ? (
        <figcaption className='text-center text-sm text-zinc-500'>{caption}</figcaption>
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
    <div className='overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800'>
      <table className='min-w-full text-left text-sm'>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className='border-b border-zinc-100 last:border-0 dark:border-zinc-800'
            >
              {row.map((cell, cellIndex) => {
                const CellTag =
                  withHeadings && rowIndex === 0 ? 'th' : 'td';
                return (
                  <CellTag
                    key={cellIndex}
                    className='px-4 py-3 align-top text-slate-700 dark:text-slate-300'
                  >
                    {cell}
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
      return (
        <CodeBlock
          code={typeof block.data.code === 'string' ? block.data.code : ''}
        />
      );
    case 'delimiter':
      return <hr className='border-zinc-200 dark:border-zinc-800' />;
    case 'table':
      return renderTable(block.data);
    default:
      return null;
  }
}
