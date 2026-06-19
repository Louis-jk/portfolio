export type I18nLocale = 'ko' | 'ja' | 'en';

export type PartialI18n = Partial<Record<I18nLocale, string>>;

export const I18N_TEXT_BLOCK_TYPES = [
  'paragraph',
  'header',
  'list',
  'quote',
  'details',
] as const;

export const SHARED_BLOCK_TYPES = [
  'image',
  'embed',
  'code',
  'delimiter',
  'table',
] as const;

export type I18nTextBlockType = (typeof I18N_TEXT_BLOCK_TYPES)[number];
export type SharedBlockType = (typeof SHARED_BLOCK_TYPES)[number];

export interface EditorBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface EditorOutput {
  time: number;
  version: string;
  blocks: EditorBlock[];
}

export interface ProjectDetailPage {
  id: number;
  projectId: number;
  /** Admin metadata only — not used to gate public rendering. */
  isPublic: boolean;
  content: EditorOutput;
  createdAt: string;
  updatedAt: string;
}

export type UpsertProjectDetailPageInput = {
  content: EditorOutput;
  isPublic?: boolean;
};

export type PatchProjectDetailPageInput = {
  content?: EditorOutput;
  isPublic?: boolean;
};

export const EMPTY_EDITOR_OUTPUT: EditorOutput = {
  time: 0,
  version: '2.29.0',
  blocks: [],
};
