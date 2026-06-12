import { nestClient } from '@/lib/http/nest-client';
import type { NestProjectDto, NestProjectWriteDto } from './projects.types';

export async function fetchAllProjects(): Promise<NestProjectDto[]> {
  return nestClient.get<NestProjectDto[]>('/projects');
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
