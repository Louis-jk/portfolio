import type {
  Project,
  ProjectPlatform,
  ProjectTranslation,
  ProjectTools,
} from '@/generated/prisma/client';

export type ProjectWithTranslations = Project & {
  translations: ProjectTranslation[];
  tools: ProjectTools | null;
  platforms: ProjectPlatform | null;
};

export type TranslationInput = {
  title?: string;
  company?: string;
  region?: string;
  role?: string;
  overview?: string;
  description?: string[];
  challenges?: string[];
  achievements?: string[];
  detailImage?: string | null;
};

export type ProjectFormData = {
  imageUrl?: string;
  startDate?: string;
  endDate?: string | null;
  isPublic?: boolean;
  technologies?: string[];
  platformCategories?: string[];
  domainTags?: string[];
  platforms?: {
    webLink?: string | null;
    iosLink?: string | null;
    androidLink?: string | null;
    desktopLink?: string | null;
  };
  tools?: {
    development?: string[];
    communication?: string[];
    design?: string[];
    debugging?: string[];
  };
  translations?: {
    ko?: TranslationInput;
    ja?: TranslationInput;
    en?: TranslationInput;
  };
};

export const PROJECT_LOCALES = ['ko', 'ja', 'en'] as const;
