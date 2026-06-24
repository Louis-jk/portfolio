import 'server-only';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { RecordNotFoundError } from '@/lib/prisma/errors';
import { toProjectDetailPageRecord } from '@/lib/prisma/project-mappers';
import { serializeDetailPagePayloadForNest } from '@/lib/project-detail-page/nest-story-content';
import type {
  PatchProjectDetailPageInput,
  ProjectDetailPage,
  UpsertProjectDetailPageInput,
} from './types';

async function assertProjectExists(projectId: number): Promise<void> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) {
    throw new RecordNotFoundError('Project not found');
  }
}

export async function fetchProjectDetailPage(
  projectId: number,
): Promise<ProjectDetailPage | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return null;

  const page = await prisma.projectDetailPage.findUnique({
    where: { projectId },
  });
  if (!page) return null;

  return toProjectDetailPageRecord(page);
}

export async function fetchStoryPublicFlags(
  projectIds: number[],
): Promise<Map<number, boolean>> {
  const flags = new Map<number, boolean>();
  for (const projectId of projectIds) {
    flags.set(projectId, false);
  }

  if (projectIds.length === 0) return flags;

  const pages = await prisma.projectDetailPage.findMany({
    where: { projectId: { in: projectIds } },
    select: { projectId: true, isPublic: true },
  });

  for (const page of pages) {
    flags.set(page.projectId, page.isPublic);
  }

  return flags;
}

export async function upsertProjectDetailPage(
  projectId: number,
  payload: UpsertProjectDetailPageInput,
): Promise<ProjectDetailPage> {
  await assertProjectExists(projectId);

  const serialized = serializeDetailPagePayloadForNest(payload);
  const page = await prisma.projectDetailPage.upsert({
    where: { projectId },
    create: {
      projectId,
      content: serialized.content as unknown as Prisma.InputJsonValue,
      isPublic: serialized.isPublic ?? false,
    },
    update: {
      content: serialized.content as unknown as Prisma.InputJsonValue,
      ...(serialized.isPublic !== undefined
        ? { isPublic: serialized.isPublic }
        : {}),
    },
  });

  return toProjectDetailPageRecord(page);
}

export async function patchProjectDetailPage(
  projectId: number,
  payload: PatchProjectDetailPageInput,
): Promise<ProjectDetailPage> {
  await assertProjectExists(projectId);

  const existing = await prisma.projectDetailPage.findUnique({
    where: { projectId },
  });
  if (!existing) {
    throw new RecordNotFoundError('Project detail page not found');
  }

  const data: Prisma.ProjectDetailPageUpdateInput = {};

  if (payload.content !== undefined) {
    const serialized = serializeDetailPagePayloadForNest({
      content: payload.content,
    });
    data.content = serialized.content as unknown as Prisma.InputJsonValue;
  }
  if (payload.isPublic !== undefined) {
    data.isPublic = payload.isPublic;
  }

  const page = await prisma.projectDetailPage.update({
    where: { projectId },
    data,
  });

  return toProjectDetailPageRecord(page);
}

export async function deleteProjectDetailPage(projectId: number): Promise<void> {
  await assertProjectExists(projectId);

  const existing = await prisma.projectDetailPage.findUnique({
    where: { projectId },
  });
  if (!existing) {
    throw new RecordNotFoundError('Project detail page not found');
  }

  await prisma.projectDetailPage.delete({ where: { projectId } });
}
