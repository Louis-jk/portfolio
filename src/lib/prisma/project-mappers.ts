import type { Prisma, Project as PrismaProject, ProjectDetailPage as PrismaDetailPage } from '@/generated/prisma/client';
import type {
  I18nStringArrayDto,
  I18nStringDto,
  NestPlatformsDto,
  NestProjectDto,
  NestToolsDto,
} from '@/entities/projects/model/projects.types';
import type {
  EditorOutput,
  ProjectDetailPage,
  StoryContentDocument,
} from '@/entities/project-detail-page/model/types';

function asI18nString(value: Prisma.JsonValue): I18nStringDto {
  return (value ?? {}) as I18nStringDto;
}

function asI18nStringArray(value: Prisma.JsonValue): I18nStringArrayDto {
  return (value ?? {}) as I18nStringArrayDto;
}

function asPlatforms(value: Prisma.JsonValue): NestPlatformsDto {
  return (value ?? {}) as NestPlatformsDto;
}

function asTools(value: Prisma.JsonValue): NestToolsDto {
  return (value ?? {}) as NestToolsDto;
}

export function toNestProjectDto(project: PrismaProject): NestProjectDto {
  return {
    id: project.id,
    sortOrder: project.sortOrder,
    imageUrl: project.imageUrl,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString() ?? null,
    isPublic: project.isPublic,
    technologies: project.technologies,
    platformCategories: project.platformCategories,
    domainTags: project.domainTags,
    title: asI18nString(project.title),
    company: asI18nString(project.company),
    region: asI18nString(project.region),
    role: asI18nString(project.role),
    overview: asI18nString(project.overview),
    description: asI18nStringArray(project.description),
    challenges: asI18nStringArray(project.challenges),
    achievements: asI18nStringArray(project.achievements),
    platforms: asPlatforms(project.platforms),
    tools: asTools(project.tools),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function toProjectDetailPageRecord(
  row: PrismaDetailPage,
): ProjectDetailPage {
  return {
    id: row.id,
    projectId: row.projectId,
    isPublic: row.isPublic,
    // JsonValue cast: content is always written via serializeDetailPagePayloadForNest on upsert.
    content: row.content as unknown as EditorOutput | StoryContentDocument,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

type ProjectJsonField = keyof Pick<
  PrismaProject,
  | 'title'
  | 'company'
  | 'region'
  | 'role'
  | 'overview'
  | 'description'
  | 'challenges'
  | 'achievements'
  | 'platforms'
  | 'tools'
>;

function mergeJson(
  existing: Prisma.JsonValue,
  patch: Record<string, unknown>,
): Prisma.InputJsonValue {
  const base =
    existing !== null &&
    typeof existing === 'object' &&
    !Array.isArray(existing)
      ? (existing as Record<string, unknown>)
      : {};

  return { ...base, ...patch } as Prisma.InputJsonValue;
}

function applyJsonMerge(
  data: Prisma.ProjectUpdateInput,
  field: ProjectJsonField,
  existing: Prisma.JsonValue,
  patch: Record<string, unknown> | undefined,
): void {
  if (patch === undefined) return;
  data[field] = mergeJson(existing, patch);
}

export function toProjectCreateInput(
  payload: import('@/entities/projects/model/projects.types').NestProjectWriteDto,
): Prisma.ProjectCreateInput {
  return {
    sortOrder: payload.sortOrder ?? 0,
    imageUrl: payload.imageUrl,
    startDate: new Date(payload.startDate),
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    isPublic: payload.isPublic ?? false,
    technologies: payload.technologies,
    platformCategories: payload.platformCategories ?? [],
    domainTags: payload.domainTags ?? [],
    title: payload.title as Prisma.InputJsonValue,
    company: payload.company as Prisma.InputJsonValue,
    region: payload.region as Prisma.InputJsonValue,
    role: payload.role as Prisma.InputJsonValue,
    overview: payload.overview as Prisma.InputJsonValue,
    description: payload.description as Prisma.InputJsonValue,
    challenges: payload.challenges as Prisma.InputJsonValue,
    achievements: payload.achievements as Prisma.InputJsonValue,
    platforms: (payload.platforms ?? {}) as Prisma.InputJsonValue,
    tools: (payload.tools ?? {}) as Prisma.InputJsonValue,
  };
}

export function toProjectUpdateInput(
  payload: Partial<import('@/entities/projects/model/projects.types').NestProjectWriteDto>,
  existing: PrismaProject,
): Prisma.ProjectUpdateInput {
  const data: Prisma.ProjectUpdateInput = {};

  if (payload.sortOrder !== undefined) data.sortOrder = payload.sortOrder;
  if (payload.imageUrl !== undefined) data.imageUrl = payload.imageUrl;
  if (payload.startDate !== undefined) {
    data.startDate = new Date(payload.startDate);
  }
  if (payload.endDate !== undefined) {
    data.endDate = payload.endDate ? new Date(payload.endDate) : null;
  }
  if (payload.isPublic !== undefined) data.isPublic = payload.isPublic;
  if (payload.technologies !== undefined) {
    data.technologies = payload.technologies;
  }
  if (payload.platformCategories !== undefined) {
    data.platformCategories = payload.platformCategories;
  }
  if (payload.domainTags !== undefined) data.domainTags = payload.domainTags;

  applyJsonMerge(data, 'title', existing.title, payload.title);
  applyJsonMerge(data, 'company', existing.company, payload.company);
  applyJsonMerge(data, 'region', existing.region, payload.region);
  applyJsonMerge(data, 'role', existing.role, payload.role);
  applyJsonMerge(data, 'overview', existing.overview, payload.overview);
  applyJsonMerge(
    data,
    'description',
    existing.description,
    payload.description,
  );
  applyJsonMerge(data, 'challenges', existing.challenges, payload.challenges);
  applyJsonMerge(
    data,
    'achievements',
    existing.achievements,
    payload.achievements,
  );
  applyJsonMerge(data, 'platforms', existing.platforms, payload.platforms);
  applyJsonMerge(data, 'tools', existing.tools, payload.tools);

  return data;
}
