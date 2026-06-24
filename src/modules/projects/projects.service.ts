import 'server-only';
import { RecordNotFoundError } from '@/lib/prisma/errors';
import type { ProjectFormData } from './projects.types';
import {
  createProject as createProjectRequest,
  deleteProject as deleteProjectRequest,
  fetchAllProjects,
  fetchProjectById,
  updateProject as updateProjectRequest,
} from './projects.repository';
import { fetchStoryPublicFlags } from '@/modules/project-detail-page/detail-page.repository';
import {
  hasLocaleTitle,
  toIndexingTranslations,
  toProjectAdminView,
  toProjectView,
} from './projects.mapper';
import {
  toIndexingTranslationsFromWritePayload,
  toNestProjectWritePayload,
} from './projects-payload.mapper';
import type {
  NestProjectDto,
  ProjectAdminView,
  ProjectView,
} from './projects.types';

function sortByOrder<T extends { sortOrder: number }>(projects: T[]): T[] {
  return [...projects].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Public portfolio list — locale fields are resolved in the mapper. */
export async function listProjects(locale: string): Promise<ProjectView[]> {
  const raw = await fetchAllProjects();
  const filtered = sortByOrder(
    raw.filter((dto) => hasLocaleTitle(dto, locale)),
  );
  const views = filtered.map((dto) => toProjectView(dto, locale));
  const storyFlags = await fetchStoryPublicFlags(views.map((view) => view.id));

  return views.map((view) => ({
    ...view,
    storyIsPublic: storyFlags.get(view.id) ?? false,
  }));
}

/** Admin list — keeps Nest i18n shape for multi-locale CMS. */
export async function listAllProjects(): Promise<ProjectAdminView[]> {
  const raw = await fetchAllProjects();
  return sortByOrder(raw.map(toProjectAdminView));
}

export async function getProjectById(
  id: number,
): Promise<ProjectAdminView | null> {
  try {
    const dto = await fetchProjectById(id);
    return toProjectAdminView(dto);
  } catch (error) {
    if (error instanceof RecordNotFoundError) {
      return null;
    }
    throw error;
  }
}

async function nextSortOrder(): Promise<number> {
  const projects = await fetchAllProjects();
  const maxOrder = projects.reduce(
    (max, project) => Math.max(max, project.sortOrder),
    -1,
  );
  return maxOrder + 1;
}

export async function createProject(
  data: ProjectFormData,
): Promise<NestProjectDto> {
  const payload = toNestProjectWritePayload(data, {
    sortOrder: await nextSortOrder(),
  });
  return createProjectRequest(payload);
}

export async function updateProject(
  id: number,
  data: ProjectFormData,
): Promise<NestProjectDto> {
  return updateProjectRequest(id, toNestProjectWritePayload(data));
}

export async function deleteProject(id: number): Promise<void> {
  return deleteProjectRequest(id);
}

export async function reorderProjects(projectIds: number[]): Promise<void> {
  await Promise.all(
    projectIds.map((projectId, index) =>
      updateProjectRequest(projectId, { sortOrder: index }),
    ),
  );
}

export function buildProjectIndexingInput(
  projectId: number,
  data: ProjectFormData,
) {
  const payload = toNestProjectWritePayload(data);

  return {
    projectId,
    isPublic: payload.isPublic ?? false,
    technologies: payload.technologies,
    platformCategories: payload.platformCategories ?? [],
    domainTags: payload.domainTags ?? [],
    translations: toIndexingTranslationsFromWritePayload(payload),
  };
}

export function buildProjectIndexingInputFromAdmin(project: ProjectAdminView) {
  return {
    projectId: project.id,
    isPublic: project.isPublic,
    technologies: project.technologies,
    platformCategories: project.platformCategories,
    domainTags: project.domainTags,
    translations: toIndexingTranslations(project),
  };
}
