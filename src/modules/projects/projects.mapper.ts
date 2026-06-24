import type {
  I18nStringArrayDto,
  I18nStringDto,
  NestProjectDto,
  ProjectAdminView,
  ProjectLocale,
  ProjectPlatformView,
  ProjectToolsView,
  ProjectView,
} from './projects.types';

const LOCALES: ProjectLocale[] = ['ko', 'ja', 'en'];
const FALLBACK_LOCALE: ProjectLocale = 'ko';

export function readI18n(
  value: I18nStringDto | undefined,
  locale: string,
  fallbackLocale: ProjectLocale = FALLBACK_LOCALE,
): string {
  const loc = locale as ProjectLocale;
  return value?.[loc] ?? value?.[fallbackLocale] ?? '';
}

export function readI18nArray(
  value: I18nStringArrayDto | undefined,
  locale: string,
  fallbackLocale: ProjectLocale = FALLBACK_LOCALE,
): string[] {
  const loc = locale as ProjectLocale;
  return value?.[loc] ?? value?.[fallbackLocale] ?? [];
}

export function hasLocaleTitle(dto: NestProjectDto, locale: string): boolean {
  const title = dto.title?.[locale as ProjectLocale];
  return typeof title === 'string' && title.length > 0;
}

function toPlatforms(dto: NestProjectDto): ProjectPlatformView | null {
  const links = {
    webLink: dto.platforms?.webLink ?? null,
    iosLink: dto.platforms?.iosLink ?? null,
    androidLink: dto.platforms?.androidLink ?? null,
    desktopLink: dto.platforms?.desktopLink ?? null,
  };
  if (!Object.values(links).some(Boolean)) return null;

  const at = new Date(dto.updatedAt);
  return {
    id: dto.id,
    projectId: dto.id,
    ...links,
    createdAt: at,
    updatedAt: at,
  };
}

function toTools(dto: NestProjectDto): ProjectToolsView | null {
  const tools = {
    development: dto.tools?.development ?? [],
    communication: dto.tools?.communication ?? [],
    design: dto.tools?.design ?? [],
    debugging: dto.tools?.debugging ?? [],
  };
  if (!Object.values(tools).some((arr) => arr.length > 0)) return null;

  const at = new Date(dto.updatedAt);
  return {
    id: dto.id,
    projectId: dto.id,
    ...tools,
    createdAt: at,
    updatedAt: at,
  };
}

function baseProjectFields(dto: NestProjectDto) {
  return {
    id: dto.id,
    sortOrder: dto.sortOrder,
    imageUrl: dto.imageUrl,
    startDate: new Date(dto.startDate),
    endDate: dto.endDate ? new Date(dto.endDate) : null,
    isPublic: dto.isPublic,
    technologies: dto.technologies ?? [],
    platformCategories: dto.platformCategories ?? [],
    domainTags: dto.domainTags ?? [],
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    platforms: toPlatforms(dto),
    tools: toTools(dto),
  };
}

export function toProjectView(dto: NestProjectDto, locale: string): ProjectView {
  return {
    ...baseProjectFields(dto),
    locale,
    title: readI18n(dto.title, locale),
    company: readI18n(dto.company, locale),
    region: readI18n(dto.region, locale),
    role: readI18n(dto.role, locale),
    overview: readI18n(dto.overview, locale),
    description: readI18nArray(dto.description, locale),
    challenges: readI18nArray(dto.challenges, locale),
    achievements: readI18nArray(dto.achievements, locale),
    storyIsPublic: false,
  };
}

export function toProjectAdminView(dto: NestProjectDto): ProjectAdminView {
  return {
    ...baseProjectFields(dto),
    title: dto.title ?? {},
    company: dto.company ?? {},
    region: dto.region ?? {},
    role: dto.role ?? {},
    overview: dto.overview ?? {},
    description: dto.description ?? {},
    challenges: dto.challenges ?? {},
    achievements: dto.achievements ?? {},
  };
}

export function toIndexingTranslations(project: ProjectAdminView) {
  return LOCALES.flatMap((locale) => {
    const title = project.title[locale];
    if (!title) return [];

    return [
      {
        locale,
        title,
        company: project.company[locale] ?? '',
        region: project.region[locale] ?? '',
        role: project.role[locale] ?? '',
        overview: project.overview[locale] ?? '',
        description: project.description[locale] ?? [],
        challenges: project.challenges[locale] ?? [],
        achievements: project.achievements[locale] ?? [],
      },
    ];
  });
}
