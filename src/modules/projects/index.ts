/**
 * Projects domain module — single public entry point.
 *
 * UI / routes should import from `@/modules/projects` only.
 * Internal files (repository, mappers) stay private to this folder.
 */

// Types
export type {
  I18nStringArrayDto,
  I18nStringDto,
  NestProjectDto,
  NestProjectWriteDto,
  ProjectAdminView,
  ProjectFormData,
  ProjectLocale,
  ProjectPlatformView,
  ProjectToolsView,
  ProjectView,
  TranslationInput,
} from './projects.types';
export { PROJECT_LOCALES } from './projects.types';

// i18n + presentation helpers (client-safe)
export { readI18n, readI18nArray } from './projects.mapper';
export { formatProjectDateRange } from './format-date';

// Admin form pipeline (client-safe validators / mappers)
export { mapAllFormTranslations, mapTranslation } from './form-mapper';
export { validateProjectServerPayload } from './validate-server-payload';
export type { ParsedProjectServerPayload } from './validate-server-payload';

// Server-only data access: import from `@/modules/projects/server`
