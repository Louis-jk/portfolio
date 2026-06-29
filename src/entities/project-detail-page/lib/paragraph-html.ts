import type {
  EditorOutput,
  I18nLocale,
  PartialI18n,
} from '@/entities/project-detail-page/model/types';
import { mapEditorBlocksWithPaths } from '@/entities/project-detail-page/lib/story-blocks';

/** Persisted marker for intentional blank lines between paragraphs. */
export const STORY_SPACER_HTML = '<br class="story-spacer" aria-hidden="true" />';

const LOCALES: I18nLocale[] = ['ko', 'ja', 'en'];

/** True when HTML has no visible text (empty spacer paragraphs). */
export function isBlankStoryHtml(html: string | undefined | null): boolean {
  if (!html) return true;

  const stripped = html
    .replace(/<br\s+[^>]*class="[^"]*story-spacer[^"]*"[^>]*\/?>/gi, '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();

  return stripped.length === 0;
}

/** Normalize blank editor HTML to a stable spacer marker. */
export function normalizeParagraphHtml(html: string): string {
  return isBlankStoryHtml(html) ? STORY_SPACER_HTML : html;
}

/** Update only the active locale — each tab is edited independently. */
export function mergeParagraphI18n(
  existing: PartialI18n,
  locale: I18nLocale,
  html: string,
): PartialI18n {
  return {
    ...existing,
    [locale]: normalizeParagraphHtml(html),
  };
}

/** On save: normalize each locale's paragraph HTML independently. */
export function normalizeParagraphBlockI18n(
  i18n: PartialI18n | undefined,
): PartialI18n {
  if (!i18n) return {};

  const next: PartialI18n = {};
  for (const locale of LOCALES) {
    const value = i18n[locale];
    if (typeof value === 'string') {
      next[locale] = normalizeParagraphHtml(value);
    }
  }
  return next;
}

export function normalizeStoryParagraphBlocks(
  content: EditorOutput,
): EditorOutput {
  return {
    ...content,
    blocks: mapEditorBlocksWithPaths(content.blocks, (block) => {
      if (block.type !== 'paragraph') return block;

      if (typeof block.data?.html === 'string') {
        return {
          ...block,
          data: {
            ...block.data,
            html: normalizeParagraphHtml(block.data.html),
          },
        };
      }

      const i18n = block.data?.i18n;
      if (!i18n || typeof i18n !== 'object') return block;

      return {
        ...block,
        data: {
          ...block.data,
          i18n: normalizeParagraphBlockI18n(i18n as PartialI18n),
        },
      };
    }),
  };
}
