export type StoryMediaKind = 'image' | 'video';

export type StoryMediaTextLayout = 'media-left' | 'media-right';

export type StoryMediaFile = {
  url?: string;
};

export type StoryMediaSlotData = {
  kind: StoryMediaKind;
  file?: StoryMediaFile;
  caption?: string;
};

export type StoryMediaTextBlockData = {
  layout: StoryMediaTextLayout;
  mediaType: StoryMediaKind;
  file?: StoryMediaFile;
  html?: string;
};

export type StoryMediaRowBlockData = {
  left: StoryMediaSlotData;
  right: StoryMediaSlotData;
};

export const STORY_MEDIA_TEXT_BLOCK_TYPE = 'mediaText';
export const STORY_MEDIA_ROW_BLOCK_TYPE = 'mediaRow';

export function normalizeStoryMediaKind(value: unknown): StoryMediaKind {
  return value === 'video' ? 'video' : 'image';
}

export function normalizeStoryMediaTextLayout(
  value: unknown,
): StoryMediaTextLayout {
  return value === 'media-right' ? 'media-right' : 'media-left';
}

export function readStoryMediaFile(
  data: Record<string, unknown>,
): StoryMediaFile | undefined {
  const file = data.file;
  if (!file || typeof file !== 'object') return undefined;
  const url = (file as { url?: unknown }).url;
  if (typeof url !== 'string' || !url) return undefined;
  return { url };
}

export function readStoryMediaSlot(
  value: unknown,
  fallbackKind: StoryMediaKind = 'image',
): StoryMediaSlotData {
  if (!value || typeof value !== 'object') {
    return { kind: fallbackKind };
  }

  const record = value as Record<string, unknown>;
  const file = record.file;
  const url =
    file && typeof file === 'object' && 'url' in file
      ? (file as { url?: unknown }).url
      : undefined;

  return {
    kind: normalizeStoryMediaKind(record.kind ?? fallbackKind),
    file: typeof url === 'string' && url ? { url } : undefined,
    caption: typeof record.caption === 'string' ? record.caption : '',
  };
}

export function readStoryMediaTextData(
  data: Record<string, unknown>,
): StoryMediaTextBlockData {
  return {
    layout: normalizeStoryMediaTextLayout(data.layout),
    mediaType: normalizeStoryMediaKind(data.mediaType),
    file: readStoryMediaFile(data),
    html: typeof data.html === 'string' ? data.html : '',
  };
}

export function readStoryMediaRowData(
  data: Record<string, unknown>,
): StoryMediaRowBlockData {
  return {
    left: readStoryMediaSlot(data.left, 'image'),
    right: readStoryMediaSlot(data.right, 'image'),
  };
}
