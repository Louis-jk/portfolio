/**
 * Projects entity — catalog model, client helpers, and query utilities.
 * Server persistence: `@/entities/projects/server`
 */
export * from './model';
export { readI18n, readI18nArray } from './lib/projects.mapper';
export { formatProjectDateRange } from './lib/format-date';
export { mapAllFormTranslations, mapTranslation } from './lib/form-mapper';
export { validateProjectServerPayload } from './lib/validate-server-payload';
export type { ParsedProjectServerPayload } from './lib/validate-server-payload';
export * from './lib';
