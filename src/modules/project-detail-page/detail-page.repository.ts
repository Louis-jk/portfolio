import { nestClient } from '@/lib/http/nest-client';
import type {
  PatchProjectDetailPageInput,
  ProjectDetailPage,
  UpsertProjectDetailPageInput,
} from './types';

export async function fetchProjectDetailPage(
  projectId: number,
): Promise<ProjectDetailPage> {
  return nestClient.get<ProjectDetailPage>(
    `/projects/${projectId}/detail-page`,
  );
}

export async function upsertProjectDetailPage(
  projectId: number,
  payload: UpsertProjectDetailPageInput,
): Promise<ProjectDetailPage> {
  return nestClient.put<ProjectDetailPage>(
    `/projects/${projectId}/detail-page`,
    payload,
  );
}

export async function patchProjectDetailPage(
  projectId: number,
  payload: PatchProjectDetailPageInput,
): Promise<ProjectDetailPage> {
  return nestClient.patch<ProjectDetailPage>(
    `/projects/${projectId}/detail-page`,
    payload,
  );
}

export async function deleteProjectDetailPage(projectId: number): Promise<void> {
  return nestClient.delete(`/projects/${projectId}/detail-page`);
}
