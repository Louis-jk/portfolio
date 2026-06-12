export const PROJECT_LOCALES = ['ko', 'ja', 'en'] as const;

/** Nest API가 반환하는 프로젝트 (JSONB i18n) */
export type ProjectLocale = (typeof PROJECT_LOCALES)[number];

export type I18nStringDto = Partial<Record<ProjectLocale, string>>;
export type I18nStringArrayDto = Partial<Record<ProjectLocale, string[]>>;

export type NestPlatformsDto = {
  webLink?: string | null;
  iosLink?: string | null;
  androidLink?: string | null;
  desktopLink?: string | null;
};

export type NestToolsDto = {
  development?: string[];
  communication?: string[];
  design?: string[];
  debugging?: string[];
};

export type NestProjectDto = {
  id: number;
  sortOrder: number;
  imageUrl: string;
  startDate: string;
  endDate: string | null;
  isPublic: boolean;
  technologies: string[];
  platformCategories: string[];
  domainTags: string[];
  title: I18nStringDto;
  company: I18nStringDto;
  region: I18nStringDto;
  role: I18nStringDto;
  overview: I18nStringDto;
  description: I18nStringArrayDto;
  challenges: I18nStringArrayDto;
  achievements: I18nStringArrayDto;
  platforms: NestPlatformsDto;
  tools: NestToolsDto;
  createdAt: string;
  updatedAt: string;
};

export type NestProjectWriteDto = {
  sortOrder?: number;
  imageUrl: string;
  startDate: string;
  endDate?: string | null;
  isPublic?: boolean;
  technologies: string[];
  platformCategories?: string[];
  domainTags?: string[];
  title: I18nStringDto;
  company: I18nStringDto;
  region: I18nStringDto;
  role: I18nStringDto;
  overview: I18nStringDto;
  description: I18nStringArrayDto;
  challenges: I18nStringArrayDto;
  achievements: I18nStringArrayDto;
  platforms?: NestPlatformsDto;
  tools?: NestToolsDto;
};

export type ProjectPlatformView = {
  id: number;
  projectId: number;
  webLink: string | null;
  iosLink: string | null;
  androidLink: string | null;
  desktopLink: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectToolsView = {
  id: number;
  projectId: number;
  development: string[];
  communication: string[];
  design: string[];
  debugging: string[];
  createdAt: Date;
  updatedAt: Date;
};

/** 공개 UI — 요청 locale 기준으로 이미 펼쳐진 필드 */
export type ProjectView = {
  id: number;
  sortOrder: number;
  imageUrl: string;
  startDate: Date;
  endDate: Date | null;
  isPublic: boolean;
  technologies: string[];
  platformCategories: string[];
  domainTags: string[];
  createdAt: Date;
  updatedAt: Date;
  locale: string;
  title: string;
  company: string;
  region: string;
  role: string;
  overview: string;
  description: string[];
  challenges: string[];
  achievements: string[];
  platforms: ProjectPlatformView | null;
  tools: ProjectToolsView | null;
};

/** 어드민 — Nest i18n 필드 그대로 */
export type ProjectAdminView = {
  id: number;
  sortOrder: number;
  imageUrl: string;
  startDate: Date;
  endDate: Date | null;
  isPublic: boolean;
  technologies: string[];
  platformCategories: string[];
  domainTags: string[];
  createdAt: Date;
  updatedAt: Date;
  title: I18nStringDto;
  company: I18nStringDto;
  region: I18nStringDto;
  role: I18nStringDto;
  overview: I18nStringDto;
  description: I18nStringArrayDto;
  challenges: I18nStringArrayDto;
  achievements: I18nStringArrayDto;
  platforms: ProjectPlatformView | null;
  tools: ProjectToolsView | null;
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
  translations?: Partial<Record<ProjectLocale, TranslationInput>>;
};
