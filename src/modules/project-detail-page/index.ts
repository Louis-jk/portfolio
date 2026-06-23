export type {
  EditorBlock,
  EditorOutput,
  I18nLocale,
  I18nTextBlockType,
  PartialI18n,
  PatchProjectDetailPageInput,
  ProjectDetailPage,
  SharedBlockType,
  StoryContentDocument,
  UpsertProjectDetailPageInput,
} from './types';
export {
  EMPTY_EDITOR_OUTPUT,
  I18N_TEXT_BLOCK_TYPES,
  SHARED_BLOCK_TYPES,
} from './types';

export {
  deleteProjectDetailPage,
  getProjectDetailPage,
  patchProjectDetailPage,
  upsertProjectDetailPage,
} from './detail-page.service';
