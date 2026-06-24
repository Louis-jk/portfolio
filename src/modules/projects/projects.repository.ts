import 'server-only';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { RecordNotFoundError } from '@/lib/prisma/errors';
import {
  toNestProjectDto,
  toProjectCreateInput,
  toProjectUpdateInput,
} from '@/lib/prisma/project-mappers';
import { PROJECTS_LIST_CACHE_TAG } from '@/lib/cache-tags';
import type { NestProjectDto, NestProjectWriteDto } from './projects.types';

async function fetchAllProjectsFromDb(): Promise<NestProjectDto[]> {
  const rows = await prisma.project.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map(toNestProjectDto);
}

const fetchAllProjectsCached = unstable_cache(
  fetchAllProjectsFromDb,
  ['prisma-all-projects'],
  { revalidate: 30, tags: [PROJECTS_LIST_CACHE_TAG] },
);

export async function fetchAllProjects(): Promise<NestProjectDto[]> {
  // Dev: always read live DB (avoids stale cache after DATABASE_URL / data changes).
  if (process.env.NODE_ENV === 'development') {
    return fetchAllProjectsFromDb();
  }
  return fetchAllProjectsCached();
}

export async function fetchProjectById(id: number): Promise<NestProjectDto> {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new RecordNotFoundError('Project not found');
  }
  return toNestProjectDto(project);
}

export async function createProject(
  payload: NestProjectWriteDto,
): Promise<NestProjectDto> {
  const project = await prisma.project.create({
    data: toProjectCreateInput(payload),
  });
  return toNestProjectDto(project);
}

export async function updateProject(
  id: number,
  payload: Partial<NestProjectWriteDto>,
): Promise<NestProjectDto> {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    throw new RecordNotFoundError('Project not found');
  }

  const project = await prisma.project.update({
    where: { id },
    data: toProjectUpdateInput(payload, existing),
  });
  return toNestProjectDto(project);
}

export async function deleteProject(id: number): Promise<void> {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    throw new RecordNotFoundError('Project not found');
  }
  await prisma.project.delete({ where: { id } });
}
