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

/** Batch lookup for public story link visibility on the portfolio list. */
export async function getStoryPublicFlags(
  projectIds: number[],
): Promise<Map<number, boolean>> {
  if (projectIds.length === 0) return new Map();

  const results = await Promise.allSettled(
    projectIds.map(async (projectId) => {
      const page = await getProjectDetailPage(projectId);
      return { projectId, isPublic: page?.isPublic ?? false };
    }),
  );

  const flags = new Map<number, boolean>();
  for (const projectId of projectIds) {
    flags.set(projectId, false);
  }
  for (const result of results) {
    if (result.status === 'fulfilled') {
      flags.set(result.value.projectId, result.value.isPublic);
    }
  }
  return flags;
}
