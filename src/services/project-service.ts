import { prisma } from '@/lib/prisma';
import type {
  Project,
  ProjectPlatform,
  ProjectTranslation,
  ProjectTools,
} from '@/generated/prisma/client';

export type ProjectWithTranslations = Project & {
  translations: ProjectTranslation[];
  tools: ProjectTools | null;
  platforms: ProjectPlatform | null;
};

export async function getProjectsByLocale(
  locale: string,
): Promise<ProjectWithTranslations[]> {
  return prisma.project.findMany({
    where: {
      translations: {
        some: { locale },
      },
    },
    include: {
      translations: true,
      tools: true,
      platforms: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });
}
