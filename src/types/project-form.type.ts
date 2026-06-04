export interface TranslationFormValues {
  title: string;
  role: string;
  overview: string;
  region: string;
  company: string;
  description: { value: string }[];
  challenges: { value: string }[];
  achievements: { value: string }[];
  detailImage: string;
}

export interface ProjectFormValues {
  imageUrl: string;
  startDate: string;
  endDate?: string;
  isPublic: boolean;
  technologies: string;
  tools: {
    development: string;
    communication: string;
    design: string;
    debugging: string;
  };
  platformCategories: string[];
  domainTags: string[];
  platforms: {
    webLink: string;
    iosLink: string;
    androidLink: string;
    desktopLink: string;
  };
  translations: {
    ko: TranslationFormValues;
    ja: TranslationFormValues;
    en: TranslationFormValues;
  };
}
