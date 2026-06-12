import {
  PROJECT_LOCALES,
  type ProjectFormData,
  type TranslationInput,
} from './projects.types';
import type {
  I18nStringArrayDto,
  I18nStringDto,
  NestPlatformsDto,
  NestProjectWriteDto,
  NestToolsDto,
  ProjectLocale,
} from './projects.types';

function optionalUrl(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toI18nString(
  translations: ProjectFormData['translations'],
  field: keyof TranslationInput,
): I18nStringDto {
  return Object.fromEntries(
    PROJECT_LOCALES.map((locale) => [
      locale,
      translations?.[locale]?.[field]?.toString() ?? '',
    ]),
  ) as I18nStringDto;
}

function toI18nStringArray(
  translations: ProjectFormData['translations'],
  field: 'description' | 'challenges' | 'achievements',
): I18nStringArrayDto {
  return Object.fromEntries(
    PROJECT_LOCALES.map((locale) => [
      locale,
      translations?.[locale]?.[field] ?? [],
    ]),
  ) as I18nStringArrayDto;
}

function toPlatforms(
  platforms: ProjectFormData['platforms'],
): NestPlatformsDto | undefined {
  if (!platforms) return undefined;

  const mapped = {
    webLink: optionalUrl(platforms.webLink),
    iosLink: optionalUrl(platforms.iosLink),
    androidLink: optionalUrl(platforms.androidLink),
    desktopLink: optionalUrl(platforms.desktopLink),
  };

  return Object.values(mapped).some(Boolean) ? mapped : undefined;
}

function toTools(tools: ProjectFormData['tools']): NestToolsDto | undefined {
  if (!tools) return undefined;

  const mapped = {
    development: tools.development ?? [],
    communication: tools.communication ?? [],
    design: tools.design ?? [],
    debugging: tools.debugging ?? [],
  };

  return Object.values(mapped).some((items) => items.length > 0)
    ? mapped
    : undefined;
}

export function toNestProjectWritePayload(
  data: ProjectFormData,
  options?: { sortOrder?: number },
): NestProjectWriteDto {
  return {
    ...(options?.sortOrder !== undefined ? { sortOrder: options.sortOrder } : {}),
    imageUrl: data.imageUrl ?? '',
    startDate: data.startDate ?? '',
    endDate: data.endDate ?? null,
    isPublic: data.isPublic ?? false,
    technologies: data.technologies ?? [],
    platformCategories: data.platformCategories ?? [],
    domainTags: data.domainTags ?? [],
    title: toI18nString(data.translations, 'title'),
    company: toI18nString(data.translations, 'company'),
    region: toI18nString(data.translations, 'region'),
    role: toI18nString(data.translations, 'role'),
    overview: toI18nString(data.translations, 'overview'),
    description: toI18nStringArray(data.translations, 'description'),
    challenges: toI18nStringArray(data.translations, 'challenges'),
    achievements: toI18nStringArray(data.translations, 'achievements'),
    platforms: toPlatforms(data.platforms),
    tools: toTools(data.tools),
  };
}

export function toIndexingTranslationsFromWritePayload(
  payload: NestProjectWriteDto,
): Array<{
  locale: ProjectLocale;
  title: string;
  company: string;
  region: string;
  role: string;
  overview: string;
  description: string[];
  challenges: string[];
  achievements: string[];
}> {
  return PROJECT_LOCALES.flatMap((locale) => {
    const title = payload.title[locale];
    if (!title) return [];

    return [
      {
        locale,
        title,
        company: payload.company[locale] ?? '',
        region: payload.region[locale] ?? '',
        role: payload.role[locale] ?? '',
        overview: payload.overview[locale] ?? '',
        description: payload.description[locale] ?? [],
        challenges: payload.challenges[locale] ?? [],
        achievements: payload.achievements[locale] ?? [],
      },
    ];
  });
}
