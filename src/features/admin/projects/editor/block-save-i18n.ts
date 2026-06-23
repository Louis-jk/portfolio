import type { PartialI18n } from '@/modules/project-detail-page';

/** Editor.js `block.save()` returns the tool `save()` payload directly. */
export function extractI18nFromBlockSave(saved: unknown): PartialI18n {
  if (!saved || typeof saved !== 'object') return {};

  if (
    'i18n' in saved &&
    saved.i18n &&
    typeof saved.i18n === 'object'
  ) {
    return saved.i18n as PartialI18n;
  }

  if (
    'data' in saved &&
    saved.data &&
    typeof saved.data === 'object' &&
    'i18n' in saved.data &&
    saved.data.i18n &&
    typeof saved.data.i18n === 'object'
  ) {
    return saved.data.i18n as PartialI18n;
  }

  return {};
}

export function extractHtmlFromBlockSave(saved: unknown): string {
  if (!saved || typeof saved !== 'object') return '';

  if ('html' in saved && typeof saved.html === 'string') {
    return saved.html;
  }

  if (
    'data' in saved &&
    saved.data &&
    typeof saved.data === 'object' &&
    'html' in saved.data &&
    typeof saved.data.html === 'string'
  ) {
    return saved.data.html;
  }

  return '';
}

export function extractHeaderLevelFromBlockSave(saved: unknown): number {
  if (!saved || typeof saved !== 'object') return 2;

  if ('level' in saved) {
    return Math.min(Math.max(Number(saved.level) || 2, 1), 6);
  }

  if (
    'data' in saved &&
    saved.data &&
    typeof saved.data === 'object' &&
    'level' in saved.data
  ) {
    return Math.min(Math.max(Number(saved.data.level) || 2, 1), 6);
  }

  return 2;
}
