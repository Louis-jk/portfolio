import type {
  EditorBlock,
  EditorOutput,
  I18nLocale,
  I18nTextBlockType,
  PartialI18n,
} from '@/modules/project-detail-page/types';
import { I18N_TEXT_BLOCK_TYPES } from '@/modules/project-detail-page/types';

export function isI18nTextBlock(type: string): type is I18nTextBlockType {
  return (I18N_TEXT_BLOCK_TYPES as readonly string[]).includes(type);
}

export function getBlockI18n(block: EditorBlock): PartialI18n | undefined {
  const i18n = block.data?.i18n;
  if (!i18n || typeof i18n !== 'object') return undefined;
  return i18n as PartialI18n;
}

/** Public story: locale → ko → en → ja fallback chain. */
export function resolveI18nText(
  i18n: PartialI18n | undefined,
  locale: I18nLocale,
): string {
  if (!i18n) return '';
  return i18n[locale] ?? i18n.ko ?? i18n.en ?? i18n.ja ?? '';
}

/**
 * Admin editor: non-KO tabs fall back to Korean source text only
 * so translators see the same layout with KO copy to replace.
 */
export function resolveAdminI18nText(
  i18n: PartialI18n | undefined,
  locale: I18nLocale,
): string {
  if (!i18n) return '';
  const own = i18n[locale]?.trim();
  if (own) return i18n[locale]!;
  if (locale !== 'ko') return i18n.ko?.trim() ?? '';
  return '';
}

export function isAdminI18nFallback(
  i18n: PartialI18n | undefined,
  locale: I18nLocale,
): boolean {
  if (locale === 'ko' || !i18n) return false;
  if (i18n[locale]?.trim()) return false;
  return Boolean(i18n.ko?.trim());
}

/** Resolve locale text with ko → en → ja fallbacks. */
export function getBlockText(block: EditorBlock, locale: I18nLocale): string {
  return resolveI18nText(getBlockI18n(block), locale);
}

export function hasRenderableBlocks(
  content: EditorOutput | null | undefined,
): boolean {
  return (content?.blocks?.length ?? 0) > 0;
}
