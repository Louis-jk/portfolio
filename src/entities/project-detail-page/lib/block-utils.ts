import type {
  EditorBlock,
  EditorOutput,
  I18nCodeBlockType,
  I18nLocale,
  I18nTextBlockType,
  PartialI18n,
} from '@/entities/project-detail-page/model/types';
import { I18N_TEXT_BLOCK_TYPES } from '@/entities/project-detail-page/model/types';
import { isBlankStoryHtml } from '@/entities/project-detail-page/lib/paragraph-html';

export function isI18nTextBlock(type: string): type is I18nTextBlockType {
  return (I18N_TEXT_BLOCK_TYPES as readonly string[]).includes(type);
}

export function getBlockI18n(block: EditorBlock): PartialI18n | undefined {
  const i18n = block.data?.i18n;
  if (i18n && typeof i18n === 'object') {
    return i18n as PartialI18n;
  }

  // Legacy shared code blocks: `{ code: "..." }` → treat as Korean source.
  if (block.type === 'code' && typeof block.data?.code === 'string') {
    return { ko: block.data.code };
  }

  return undefined;
}

export function isI18nCodeBlock(type: string): type is I18nCodeBlockType {
  return type === 'code';
}

/** Public story: locale → ko → en → ja fallback chain (skips blank values). */
export function resolveI18nText(
  i18n: PartialI18n | undefined,
  locale: I18nLocale,
): string {
  if (!i18n) return '';

  const order: I18nLocale[] =
    locale === 'ko'
      ? ['ko', 'en', 'ja']
      : locale === 'ja'
        ? ['ja', 'ko', 'en']
        : ['en', 'ko', 'ja'];

  for (const loc of order) {
    const value = i18n[loc];
    if (typeof value === 'string' && !isBlankStoryHtml(value)) {
      return value;
    }
  }

  return '';
}

/**
 * Admin editor: show only the active locale's own text (no KO preview on JA/EN).
 */
export function resolveAdminI18nText(
  i18n: PartialI18n | undefined,
  locale: I18nLocale,
): string {
  if (!i18n) return '';
  return i18n[locale] ?? '';
}

/** Read visible text/code from a block in a single-locale document (or legacy i18n). */
export function getBlockText(block: EditorBlock, locale: I18nLocale): string {
  if (typeof block.data.html === 'string') {
    return block.data.html;
  }
  if (block.type === 'code' && typeof block.data.code === 'string') {
    return block.data.code;
  }
  return resolveI18nText(getBlockI18n(block), locale);
}

export function hasRenderableBlocks(
  content: EditorOutput | null | undefined,
): boolean {
  return (content?.blocks?.length ?? 0) > 0;
}
