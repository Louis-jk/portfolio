import type { TranslationFormValues } from '@/types/project-form.type';

export function emptyTranslation(): TranslationFormValues {
  return {
    title: '',
    role: '',
    overview: '',
    region: '',
    company: '',
    description: [{ value: '' }],
    challenges: [{ value: '' }],
    achievements: [{ value: '' }],
    detailImage: '',
  };
}

export const PROJECT_FORM_DEFAULT_VALUES = {
  imageUrl: '',
  startDate: '',
  isPublic: true,
  technologies: '',
  tools: {
    development: '',
    communication: '',
    design: '',
    debugging: '',
  },
  platformCategories: [] as string[],
  domainTags: [] as string[],
  platforms: {
    webLink: '',
    iosLink: '',
    androidLink: '',
    desktopLink: '',
  },
  translations: {
    ko: emptyTranslation(),
    ja: emptyTranslation(),
    en: emptyTranslation(),
  },
};
