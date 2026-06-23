import type {
  EditorBlock,
  EditorOutput,
  I18nLocale,
  StoryContentDocument,
} from '@/modules/project-detail-page/types';
import { flattenDetailsBlocks } from './details-blocks';
import {
  getBlockText,
  isI18nCodeBlock,
  isI18nTextBlock,
} from './block-utils';

const LOCALES: I18nLocale[] = ['ko', 'ja', 'en'];

export function isStoryContentDocument(
  value: unknown,
): value is StoryContentDocument {
  if (!value || typeof value !== 'object') return false;
  const locales = (value as StoryContentDocument).locales;
  return Boolean(locales && typeof locales === 'object' && 'ko' in locales);
}

export function emptyLocaleEditorOutput(): EditorOutput {
  return { time: 0, version: '2.29.0', blocks: [] };
}

function stripI18nFields(data: Record<string, unknown>): Record<string, unknown> {
  const next = { ...data };
  delete next.i18n;
  return next;
}

function extractLocaleBlock(
  block: EditorBlock,
  locale: I18nLocale,
): EditorBlock {
  const base = { ...block, data: { ...block.data } };

  if (isI18nTextBlock(block.type) || block.type === 'details') {
    const text = getBlockText(block, locale);
    const nextData = stripI18nFields(base.data);
    nextData.html = text;
    if (block.type === 'header' && block.data.level != null) {
      nextData.level = block.data.level;
    }
    if (block.type === 'details') {
      const children = block.data.children;
      if (Array.isArray(children)) {
        nextData.children = (children as EditorBlock[]).map((child) =>
          extractLocaleBlock(child, locale),
        );
      }
    }
    return { ...base, data: nextData };
  }

  if (isI18nCodeBlock(block.type)) {
    return {
      ...base,
      data: {
        code: getBlockText(block, locale),
      },
    };
  }

  return base;
}

function extractLocaleDocument(
  content: EditorOutput,
  locale: I18nLocale,
): EditorOutput {
  const flat = flattenDetailsBlocks(content);
  const blocks = flat.blocks.map((block) => extractLocaleBlock(block, locale));
  return {
    time: content.time,
    version: content.version,
    blocks,
  };
}

export function migrateLegacyStoryContent(
  content: EditorOutput,
): StoryContentDocument {
  return {
    time: content.time,
    version: content.version,
    locales: {
      ko: extractLocaleDocument(content, 'ko'),
      ja: extractLocaleDocument(content, 'ja'),
      en: extractLocaleDocument(content, 'en'),
    },
  };
}

export function parseStoryContent(
  content: EditorOutput | StoryContentDocument,
): StoryContentDocument {
  if (isStoryContentDocument(content)) {
    return {
      time: content.time,
      version: content.version,
      locales: {
        ko: content.locales.ko ?? emptyLocaleEditorOutput(),
        ja: content.locales.ja ?? emptyLocaleEditorOutput(),
        en: content.locales.en ?? emptyLocaleEditorOutput(),
      },
    };
  }

  return migrateLegacyStoryContent(content);
}

export function getLocaleEditorOutput(
  content: EditorOutput | StoryContentDocument,
  locale: I18nLocale,
): EditorOutput {
  const document = parseStoryContent(content);
  return document.locales[locale] ?? emptyLocaleEditorOutput();
}

const PUBLIC_FALLBACK_ORDER: Record<I18nLocale, I18nLocale[]> = {
  ko: [],
  ja: ['ko', 'en'],
  en: ['ko', 'ja'],
};

/** Public story: prefer requested locale, then fall back when that doc is empty. */
export function getPublicLocaleEditorOutput(
  content: EditorOutput | StoryContentDocument,
  locale: I18nLocale,
): EditorOutput {
  const document = parseStoryContent(content);
  const primary = document.locales[locale] ?? emptyLocaleEditorOutput();
  if (primary.blocks.length > 0) return primary;

  for (const fallback of PUBLIC_FALLBACK_ORDER[locale]) {
    const candidate = document.locales[fallback];
    if (candidate?.blocks.length) return candidate;
  }

  return primary;
}

export function buildStoryContentDocument(
  locales: Record<I18nLocale, EditorOutput>,
): StoryContentDocument {
  return {
    time: Date.now(),
    version: '2.29.0',
    locales: {
      ko: locales.ko,
      ja: locales.ja,
      en: locales.en,
    },
  };
}

/** True when any locale has at least one block. */
export function hasStoryContentInAnyLocale(
  content: EditorOutput | StoryContentDocument | null | undefined,
): boolean {
  if (!content) return false;
  const document = parseStoryContent(content as EditorOutput | StoryContentDocument);
  return LOCALES.some((locale) => document.locales[locale].blocks.length > 0);
}
