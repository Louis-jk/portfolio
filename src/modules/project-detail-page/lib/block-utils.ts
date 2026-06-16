import type {
  EditorBlock,
  EditorOutput,
  I18nLocale,
  I18nTextBlockType,
  PartialI18n,
} from '../types';
import { I18N_TEXT_BLOCK_TYPES } from '../types';

export function isI18nTextBlock(type: string): type is I18nTextBlockType {
  return (I18N_TEXT_BLOCK_TYPES as readonly string[]).includes(type);
}

export function getBlockI18n(block: EditorBlock): PartialI18n | undefined {
  const i18n = block.data?.i18n;
  if (!i18n || typeof i18n !== 'object') return undefined;
  return i18n as PartialI18n;
}

/** Resolve locale text with ko → en → ja fallbacks. */
export function getBlockText(block: EditorBlock, locale: I18nLocale): string {
  const i18n = getBlockI18n(block);
  if (!i18n) return '';
  return i18n[locale] ?? i18n.ko ?? i18n.en ?? i18n.ja ?? '';
}

export function hasRenderableBlocks(content: EditorOutput | null | undefined): boolean {
  return (content?.blocks?.length ?? 0) > 0;
}
