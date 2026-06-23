export type I18nLocale = 'ko' | 'ja' | 'en';

export type PartialI18n = Partial<Record<I18nLocale, string>>;

export const I18N_TEXT_BLOCK_TYPES = [
  'paragraph',
  'header',
  'list',
  'quote',
  'details',
] as const;

export const I18N_CODE_BLOCK_TYPES = ['code'] as const;

export const SHARED_BLOCK_TYPES = [
  'image',
  'embed',
  'delimiter',
  'table',
] as const;

export type I18nTextBlockType = (typeof I18N_TEXT_BLOCK_TYPES)[number];
export type I18nCodeBlockType = (typeof I18N_CODE_BLOCK_TYPES)[number];
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

/** Per-locale story documents — layout and text are independent per language. */
export interface StoryContentDocument {
  time: number;
  version: string;
  locales: Record<I18nLocale, EditorOutput>;
}

export interface ProjectDetailPage {
  id: number;
  projectId: number;
  /** When false, the public site hides the story and blocks unauthenticated API access. */
  isPublic: boolean;
  content: EditorOutput | StoryContentDocument;
  createdAt: string;
  updatedAt: string;
}

export type UpsertProjectDetailPageInput = {
  content: EditorOutput | StoryContentDocument;
  isPublic?: boolean;
};

export type PatchProjectDetailPageInput = {
  content?: EditorOutput | StoryContentDocument;
  isPublic?: boolean;
};

export const EMPTY_EDITOR_OUTPUT: EditorOutput = {
  time: 0,
  version: '2.29.0',
  blocks: [],
};
