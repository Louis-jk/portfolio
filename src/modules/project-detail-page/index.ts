export type {
  EditorBlock,
  EditorOutput,
  I18nLocale,
  I18nTextBlockType,
  PartialI18n,
  PatchProjectDetailPageInput,
  ProjectDetailPage,
  SharedBlockType,
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

export {
  getBlockI18n,
  getBlockText,
  hasRenderableBlocks,
  isI18nTextBlock,
} from './lib/block-utils';

export { EditorJsRenderer } from './components/EditorJsRenderer';
export { renderBlock } from './components/render-block';
