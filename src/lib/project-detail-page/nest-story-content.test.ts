import { describe, expect, it } from 'vitest';
import { buildStoryContentDocument } from './story-content-document';
import {
  serializeDetailPagePayloadForNest,
  serializeStoryContentForNest,
} from './nest-story-content';

describe('serializeStoryContentForNest', () => {
  it('passes legacy EditorOutput unchanged', () => {
    const legacy = {
      time: 1,
      version: '2.29.0',
      blocks: [{ type: 'paragraph', data: { html: 'ko' } }],
    };

    expect(serializeStoryContentForNest(legacy)).toEqual(legacy);
  });

  it('strips top-level blocks from per-locale documents', () => {
    const document = buildStoryContentDocument({
      ko: {
        time: 1,
        version: '2.29.0',
        blocks: [{ type: 'paragraph', data: { html: 'ko' } }],
      },
      ja: {
        time: 1,
        version: '2.29.0',
        blocks: [{ type: 'paragraph', data: { html: 'ja' } }],
      },
      en: { time: 1, version: '2.29.0', blocks: [] },
    });

    const serialized = serializeStoryContentForNest(document);
    expect(serialized).toEqual({
      time: document.time,
      version: document.version,
      locales: document.locales,
    });
    expect('blocks' in serialized).toBe(false);
  });

  it('wraps upsert payloads', () => {
    const document = buildStoryContentDocument({
      ko: { time: 1, version: '2.29.0', blocks: [] },
      ja: { time: 1, version: '2.29.0', blocks: [] },
      en: { time: 1, version: '2.29.0', blocks: [] },
    });

    const payload = serializeDetailPagePayloadForNest({
      content: document,
      isPublic: true,
    });

    expect(payload.isPublic).toBe(true);
    expect('blocks' in payload.content).toBe(false);
    expect('locales' in payload.content).toBe(true);
  });
});
