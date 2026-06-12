'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ADMIN_ROUTES } from '@/lib/constants';
import { requireAuth } from '@/utils/supabase/auth';
import { mapTranslation } from '@/lib/projects/form-mapper';
import { getProjectById } from '@/lib/projects/queries';
import { PROJECT_LOCALES, type ProjectFormData } from '@/lib/projects/types';
import { validateProjectServerPayload } from '@/lib/projects/validate-server-payload';
import { scheduleProjectIndexing } from '@/lib/rag/schedule-project-indexing';

export async function updateProject(projectId: number, data: ProjectFormData) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = validateProjectServerPayload(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  try {
    const id = Number(projectId);
    if (!Number.isInteger(id) || id <= 0) {
      return {
        success: false,
        error: 'Invalid project ID',
      };
    }

    const validData = parsed.data;

    await prisma.$transaction(async (tx) => {
      const projectData: {
        imageUrl?: string;
        startDate?: Date;
        endDate?: Date | null;
        isPublic?: boolean;
        technologies?: string[];
        platformCategories?: string[];
        domainTags?: string[];
      } = {};
      projectData.imageUrl = validData.imageUrl;
      projectData.startDate = new Date(validData.startDate);
      projectData.endDate = validData.endDate ? new Date(validData.endDate) : null;
      projectData.isPublic = validData.isPublic ?? false;
      projectData.technologies = validData.technologies ?? [];
      projectData.platformCategories = validData.platformCategories ?? [];
      projectData.domainTags = validData.domainTags ?? [];

      if (Object.keys(projectData).length > 0) {
        await tx.project.update({
          where: { id },
          data: projectData,
        });
      }

      await tx.projectPlatform.upsert({
        where: { projectId: id },
        create: {
          projectId: id,
          webLink: validData.platforms?.webLink ?? null,
          iosLink: validData.platforms?.iosLink ?? null,
          androidLink: validData.platforms?.androidLink ?? null,
          desktopLink: validData.platforms?.desktopLink ?? null,
        },
        update: {
          webLink: validData.platforms?.webLink ?? null,
          iosLink: validData.platforms?.iosLink ?? null,
          androidLink: validData.platforms?.androidLink ?? null,
          desktopLink: validData.platforms?.desktopLink ?? null,
        },
      });

      const tools = validData.tools;
      if (
        tools &&
        (tools.development?.length ||
          tools.communication?.length ||
          tools.design?.length ||
          tools.debugging?.length)
      ) {
        await tx.projectTools.upsert({
          where: { projectId: id },
          create: {
            projectId: id,
            development: tools.development ?? [],
            communication: tools.communication ?? [],
            design: tools.design ?? [],
            debugging: tools.debugging ?? [],
          },
          update: {
            development: tools.development ?? [],
            communication: tools.communication ?? [],
            design: tools.design ?? [],
            debugging: tools.debugging ?? [],
          },
        });
      }

      for (const locale of PROJECT_LOCALES) {
        const t = validData.translations?.[locale];
        if (!t) continue;

        await tx.projectTranslation.upsert({
          where: {
            projectId_locale: { projectId: id, locale },
          },
          create: {
            projectId: id,
            ...mapTranslation(locale, t),
          },
          update: mapTranslation(locale, t),
        });
      }
    });

    const projectForIndex = await getProjectById(id);

    if (!projectForIndex) {
      throw new Error('Project not found after update');
    }

    scheduleProjectIndexing(
      {
        projectId: projectForIndex.id,
        isPublic: projectForIndex.isPublic,
        technologies: projectForIndex.technologies,
        platformCategories: projectForIndex.platformCategories,
        domainTags: projectForIndex.domainTags,
        translations: projectForIndex.translations.map((translation) => ({
          locale: translation.locale,
          title: translation.title,
          company: translation.company,
          region: translation.region,
          role: translation.role,
          overview: translation.overview,
          description: translation.description,
          challenges: translation.challenges,
          achievements: translation.achievements,
        })),
      },
      'Project update',
    );

    revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
    revalidatePath('/[locale]', 'layout');
    return { success: true, id };
  } catch (error) {
    console.error('❌ Project Update Error:', error);
    const err = error as Error & { cause?: unknown };
    const message =
      err.message ||
      (typeof err.cause === 'string' ? err.cause : 'Failed to update project');
    return { success: false, error: message };
  }
}
