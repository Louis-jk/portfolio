import { prisma } from '@/lib/prisma';
import type { ProjectWithTranslations } from '@/lib/projects/types';

export const fullProjectInclude = {
  translations: true,
  tools: true,
  platforms: true,
} as const;

export async function listPublicProjectsByLocale(
  locale: string,
): Promise<ProjectWithTranslations[]> {
  return prisma.project.findMany({
    where: {
      translations: {
        some: { locale },
      },
    },
    include: fullProjectInclude,
    orderBy: {
      sortOrder: 'asc',
    },
  });
}

export async function listAdminProjects() {
  return prisma.project.findMany({
    include: {
      translations: true,
    },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getProjectById(id: number) {
  return prisma.project.findUnique({
    where: { id },
    include: fullProjectInclude,
  });
}

/** @alias listPublicProjectsByLocale */
export const getProjectsByLocale = listPublicProjectsByLocale;
