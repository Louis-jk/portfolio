import { unstable_cache } from 'next/cache';
import { nestClient } from '@/lib/http/nest-client';
import { PROJECTS_LIST_CACHE_TAG } from '@/lib/cache-tags';
import type { NestProjectDto, NestProjectWriteDto } from './projects.types';

const fetchAllProjectsCached = unstable_cache(
  async () => nestClient.get<NestProjectDto[]>('/projects'),
  ['nest-all-projects'],
  { revalidate: 30, tags: [PROJECTS_LIST_CACHE_TAG] },
);

export async function fetchAllProjects(): Promise<NestProjectDto[]> {
  return fetchAllProjectsCached();
}

export async function fetchProjectById(id: number): Promise<NestProjectDto> {
  return nestClient.get<NestProjectDto>(`/projects/${id}`);
}

export async function createProject(
  payload: NestProjectWriteDto,
): Promise<NestProjectDto> {
  return nestClient.post<NestProjectDto>('/projects', payload);
}

export async function updateProject(
  id: number,
  payload: Partial<NestProjectWriteDto>,
): Promise<NestProjectDto> {
  return nestClient.patch<NestProjectDto>(`/projects/${id}`, payload);
}

export async function deleteProject(id: number): Promise<void> {
  return nestClient.delete(`/projects/${id}`);
}
