import { describe, expect, it } from 'vitest';
import {
  buildStoryContentDocument,
  getLocaleEditorOutput,
  getPublicLocaleEditorOutput,
  migrateLegacyStoryContent,
  parseStoryContent,
} from './story-content-document';

describe('parseStoryContent', () => {
  it('migrates legacy shared blocks into per-locale documents', () => {
    const legacy = {
      time: 1,
      version: '2.29.0',
      blocks: [
        {
          type: 'paragraph',
          data: { i18n: { ko: '안녕', ja: 'こんにちは', en: 'Hello' } },
        },
      ],
    };

    const document = parseStoryContent(legacy);
    expect(document.locales.ko.blocks[0]?.data.html).toBe('안녕');
    expect(document.locales.ja.blocks[0]?.data.html).toBe('こんにちは');
    expect(document.locales.en.blocks[0]?.data.html).toBe('Hello');
    expect(document.locales.ko.blocks[0]?.data.i18n).toBeUndefined();
  });

  it('keeps per-locale documents as-is', () => {
    const existing = buildStoryContentDocument({
      ko: { time: 1, version: '2.29.0', blocks: [{ type: 'paragraph', data: { html: 'ko' } }] },
      ja: { time: 1, version: '2.29.0', blocks: [{ type: 'paragraph', data: { html: 'ja' } }] },
      en: { time: 1, version: '2.29.0', blocks: [] },
    });

    const parsed = parseStoryContent(existing);
    expect(parsed.locales.ja.blocks[0]?.data.html).toBe('ja');
    expect(parsed.locales.en.blocks).toHaveLength(0);
  });
});

describe('getPublicLocaleEditorOutput', () => {
  it('falls back to Korean when the requested locale is empty', () => {
    const document = buildStoryContentDocument({
      ko: {
        time: 1,
        version: '2.29.0',
        blocks: [{ type: 'paragraph', data: { html: 'ko only' } }],
      },
      ja: { time: 1, version: '2.29.0', blocks: [] },
      en: { time: 1, version: '2.29.0', blocks: [] },
    });

    const ja = getPublicLocaleEditorOutput(document, 'ja');
    expect(ja.blocks[0]?.data.html).toBe('ko only');
  });

  it('returns the requested locale when it has blocks', () => {
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

    expect(getLocaleEditorOutput(document, 'ja').blocks[0]?.data.html).toBe('ja');
    expect(getPublicLocaleEditorOutput(document, 'ja').blocks[0]?.data.html).toBe(
      'ja',
    );
  });
});

describe('migrateLegacyStoryContent', () => {
  it('extracts code blocks per locale', () => {
    const legacy = {
      time: 1,
      version: '2.29.0',
      blocks: [
        {
          type: 'code',
          data: { i18n: { ko: 'graph TD', ja: 'graph TD ja' } },
        },
      ],
    };

    const document = migrateLegacyStoryContent(legacy);
    expect(document.locales.ko.blocks[0]?.data.code).toBe('graph TD');
    expect(document.locales.ja.blocks[0]?.data.code).toBe('graph TD ja');
  });
});
