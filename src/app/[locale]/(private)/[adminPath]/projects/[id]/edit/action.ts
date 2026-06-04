'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ADMIN_ROUTES } from '@/lib/constants';
import { requireAuth } from '@/utils/supabase/auth';
import { upsertProjectDocuments } from '@/lib/rag/portfolio-documents';

type TranslationInput = {
  title?: string;
  company?: string;
  region?: string;
  role?: string;
  overview?: string;
  description?: string[];
  challenges?: string[];
  achievements?: string[];
  detailImage?: string | null;
};

function mapTranslation(locale: string, t: TranslationInput | undefined) {
  return {
    locale,
    title: t?.title || '',
    company: t?.company || '',
    region: t?.region || '',
    role: t?.role || '',
    overview: t?.overview || '',
    description: Array.isArray(t?.description) ? t.description : [],
    challenges: Array.isArray(t?.challenges) ? t.challenges : [],
    achievements: Array.isArray(t?.achievements) ? t.achievements : [],
    detailImage: t?.detailImage || null,
  };
}

type ProjectFormData = {
  imageUrl?: string;
  startDate?: string;
  endDate?: string | null;
  isPublic?: boolean;
  technologies?: string[];
  platformCategories?: string[];
  domainTags?: string[];
  platforms?: {
    webLink?: string | null;
    iosLink?: string | null;
    androidLink?: string | null;
    desktopLink?: string | null;
  };
  tools?: {
    development?: string[];
    communication?: string[];
    design?: string[];
    debugging?: string[];
  };
  translations?: {
    ko?: TranslationInput;
    ja?: TranslationInput;
    en?: TranslationInput;
  };
};

export async function updateProject(projectId: number, data: ProjectFormData) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const id = Number(projectId);
    if (!Number.isInteger(id) || id <= 0) {
      return {
        success: false,
        error: 'Invalid project ID',
      };
    }

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
      if (data.imageUrl !== undefined) projectData.imageUrl = data.imageUrl;
      if (data.startDate) projectData.startDate = new Date(data.startDate);
      if (data.endDate !== undefined)
        projectData.endDate = data.endDate ? new Date(data.endDate) : null;
      if (data.isPublic !== undefined) projectData.isPublic = data.isPublic;
      if (data.technologies !== undefined)
        projectData.technologies = Array.isArray(data.technologies)
          ? data.technologies
          : [];
      if (data.platformCategories !== undefined)
        projectData.platformCategories = Array.isArray(data.platformCategories)
          ? data.platformCategories.filter((v): v is string => typeof v === 'string')
          : [];
      if (data.domainTags !== undefined)
        projectData.domainTags = Array.isArray(data.domainTags)
          ? data.domainTags.filter((v): v is string => typeof v === 'string')
          : [];

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
          webLink: data.platforms?.webLink || null,
          iosLink: data.platforms?.iosLink || null,
          androidLink: data.platforms?.androidLink || null,
          desktopLink: data.platforms?.desktopLink || null,
        },
        update: {
          webLink: data.platforms?.webLink || null,
          iosLink: data.platforms?.iosLink || null,
          androidLink: data.platforms?.androidLink || null,
          desktopLink: data.platforms?.desktopLink || null,
        },
      });

      if (
        data.tools &&
        (data.tools.development?.length ||
          data.tools.communication?.length ||
          data.tools.design?.length ||
          data.tools.debugging?.length)
      ) {
        await tx.projectTools.upsert({
          where: { projectId: id },
          create: {
            projectId: id,
            development: data.tools.development || [],
            communication: data.tools.communication || [],
            design: data.tools.design || [],
            debugging: data.tools.debugging || [],
          },
          update: {
            development: data.tools.development || [],
            communication: data.tools.communication || [],
            design: data.tools.design || [],
            debugging: data.tools.debugging || [],
          },
        });
      }

      for (const locale of ['ko', 'ja', 'en'] as const) {
        const t = data.translations?.[locale];
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

    const projectForIndex = await prisma.project.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!projectForIndex) {
      throw new Error('Project not found after update');
    }

    void upsertProjectDocuments({
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
    }).catch((indexError) => {
      console.error('⚠️ Project updated but background indexing failed:', {
        projectId: id,
        error: indexError,
      });
    });

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
