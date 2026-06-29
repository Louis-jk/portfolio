import 'server-only';
import { RecordNotFoundError } from '@/lib/prisma/errors';
import {
  deleteProjectDetailPage as deleteProjectDetailPageRequest,
  fetchProjectDetailPage,
  fetchStoryPublicFlags,
  patchProjectDetailPage as patchProjectDetailPageRequest,
  upsertProjectDetailPage as upsertProjectDetailPageRequest,
} from './detail-page.repository';
import type {
  PatchProjectDetailPageInput,
  ProjectDetailPage,
  UpsertProjectDetailPageInput,
} from '@/entities/project-detail-page/model/types';

export async function getProjectDetailPage(
  projectId: number,
): Promise<ProjectDetailPage | null> {
  return fetchProjectDetailPage(projectId);
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

/** Batch lookup for public story link visibility on the portfolio list. */
export async function getStoryPublicFlags(
  projectIds: number[],
): Promise<Map<number, boolean>> {
  return fetchStoryPublicFlags(projectIds);
}

export { RecordNotFoundError };
