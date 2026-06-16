import { NestApiError } from '@/lib/http/nest-client';
import {
  deleteProjectDetailPage as deleteProjectDetailPageRequest,
  fetchProjectDetailPage,
  patchProjectDetailPage as patchProjectDetailPageRequest,
  upsertProjectDetailPage as upsertProjectDetailPageRequest,
} from './detail-page.repository';
import type {
  PatchProjectDetailPageInput,
  ProjectDetailPage,
  UpsertProjectDetailPageInput,
} from './types';

/** Returns null when Nest responds 404 (no detail page row yet). */
export async function getProjectDetailPage(
  projectId: number,
): Promise<ProjectDetailPage | null> {
  try {
    return await fetchProjectDetailPage(projectId);
  } catch (error) {
    if (error instanceof NestApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function upsertProjectDetailPage(
  projectId: number,
  payload: UpsertProjectDetailPageInput,
): Promise<ProjectDetailPage> {
  return upsertProjectDetailPageRequest(projectId, payload);
}

export async function patchProjectDetailPage(
  projectId: number,
  payload: PatchProjectDetailPageInput,
): Promise<ProjectDetailPage> {
  return patchProjectDetailPageRequest(projectId, payload);
}

export async function deleteProjectDetailPage(
  projectId: number,
): Promise<void> {
  return deleteProjectDetailPageRequest(projectId);
}
