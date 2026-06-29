import type {
  EditorOutput,
  I18nLocale,
  StoryContentDocument,
  UpsertProjectDetailPageInput,
} from '@/entities/project-detail-page/model/types';
import { isStoryContentDocument } from './story-content-document';

/** Nest `StoryContentDto` — legacy `blocks` or per-locale `locales`. */
export type NestStoryContentPayload = EditorOutput | StoryContentDocument;

function isStoryContentPayload(
  content: NestStoryContentPayload,
): content is StoryContentDocument {
  return isStoryContentDocument(content);
}

/**
 * Serialize story content for Nest `PUT /detail-page`.
 * Per-locale documents must send `locales` only (not legacy `blocks`).
 */
export function serializeStoryContentForNest(
  content: NestStoryContentPayload,
): NestStoryContentPayload {
  if (!isStoryContentPayload(content)) {
    return content;
  }

  return serializeStoryDocumentForNest(content);
}

export function serializeDetailPagePayloadForNest(
  payload: UpsertProjectDetailPageInput,
): UpsertProjectDetailPageInput {
  return {
    ...payload,
    content: serializeStoryContentForNest(payload.content),
  };
}

/** Strip accidental `blocks` from nested locale docs before validation. */
export function normalizeNestLocaleOutputs(
  locales: Record<I18nLocale, EditorOutput>,
): Record<I18nLocale, EditorOutput> {
  const next = {} as Record<I18nLocale, EditorOutput>;
  for (const locale of ['ko', 'ja', 'en'] as const) {
    const doc = locales[locale];
    next[locale] = {
      time: doc.time,
      version: doc.version,
      blocks: doc.blocks,
    };
  }
  return next;
}

export function serializeStoryDocumentForNest(
  document: StoryContentDocument,
): StoryContentDocument {
  return {
    time: document.time,
    version: document.version,
    locales: normalizeNestLocaleOutputs(document.locales),
  };
}
