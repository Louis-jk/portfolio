import type { I18nLocale } from '@/modules/project-detail-page';

let activeLocale: I18nLocale = 'ko';

export function setActiveLocale(locale: I18nLocale): void {
  activeLocale = locale;
}

export function getActiveLocale(): I18nLocale {
  return activeLocale;
}

export type I18nToolInstance = {
  updateLocale: () => void;
};

const i18nToolInstances = new Set<I18nToolInstance>();

export function registerI18nTool(instance: I18nToolInstance): () => void {
  i18nToolInstances.add(instance);
  return () => i18nToolInstances.delete(instance);
}

export function refreshAllI18nTools(): void {
  i18nToolInstances.forEach((instance) => instance.updateLocale());
}
