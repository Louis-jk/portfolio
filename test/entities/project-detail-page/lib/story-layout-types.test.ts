import { describe, expect, it } from 'vitest';
import {
  readStoryMediaRowData,
  readStoryMediaTextData,
} from '@/entities/project-detail-page/lib/story-layout-types';

describe('readStoryMediaTextData', () => {
  it('normalizes layout and media type', () => {
    expect(
      readStoryMediaTextData({
        layout: 'media-right',
        mediaType: 'video',
        file: { url: 'https://example.com/a.mp4' },
        html: '<p>Hi</p>',
      }),
    ).toEqual({
      layout: 'media-right',
      mediaType: 'video',
      file: { url: 'https://example.com/a.mp4' },
      html: '<p>Hi</p>',
    });
  });

  it('falls back to media-left and image', () => {
    expect(readStoryMediaTextData({})).toEqual({
      layout: 'media-left',
      mediaType: 'image',
      file: undefined,
      html: '',
    });
  });
});

describe('readStoryMediaRowData', () => {
  it('reads both slots', () => {
    expect(
      readStoryMediaRowData({
        left: { kind: 'image', file: { url: 'https://example.com/a.png' } },
        right: { kind: 'video', file: { url: 'https://example.com/b.mp4' } },
      }),
    ).toEqual({
      left: { kind: 'image', file: { url: 'https://example.com/a.png' }, caption: '' },
      right: { kind: 'video', file: { url: 'https://example.com/b.mp4' }, caption: '' },
    });
  });
});
