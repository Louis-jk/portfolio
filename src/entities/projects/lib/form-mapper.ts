import {
  PROJECT_LOCALES,
  type ProjectFormData,
  type TranslationInput,
} from '../model/projects.types';

export function mapTranslation(
  locale: string,
  translation: TranslationInput | undefined,
) {
  return {
    locale,
    title: translation?.title || '',
    company: translation?.company || '',
    region: translation?.region || '',
    role: translation?.role || '',
    overview: translation?.overview || '',
    description: Array.isArray(translation?.description)
      ? translation.description
      : [],
    challenges: Array.isArray(translation?.challenges)
      ? translation.challenges
      : [],
    achievements: Array.isArray(translation?.achievements)
      ? translation.achievements
      : [],
    detailImage: translation?.detailImage || null,
  };
}

export function mapAllFormTranslations(
  translations: ProjectFormData['translations'],
) {
  return PROJECT_LOCALES.map((locale) =>
    mapTranslation(locale, translations?.[locale]),
  );
}
