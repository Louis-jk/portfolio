'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ADMIN_ROUTES } from '@/lib/constants';
import { requireAuth } from '@/utils/supabase/auth';
import { mapAllFormTranslations } from '@/lib/projects/form-mapper';
import type { ProjectFormData } from '@/lib/projects/types';
import { validateProjectServerPayload } from '@/lib/projects/validate-server-payload';
import { scheduleProjectIndexing } from '@/lib/rag/schedule-project-indexing';

export async function saveProject(data: ProjectFormData) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = validateProjectServerPayload(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  try {

    // ⭐ 트랜잭션 시작
    const validData = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      // 1. 현재 트랜잭션 내에서 가장 큰 sortOrder를 찾음
      const maxOrder = await tx.project.aggregate({
        _max: { sortOrder: true },
      });
      const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

      // 2. 위에서 구한 sortOrder를 사용하여 프로젝트 생성
      return await tx.project.create({
        data: {
          sortOrder,
          imageUrl: validData.imageUrl,
          startDate: new Date(validData.startDate),
          endDate: validData.endDate ? new Date(validData.endDate) : null,
          isPublic: validData.isPublic,
          technologies: validData.technologies,
          platformCategories: validData.platformCategories,
          domainTags: validData.domainTags,

          platforms: {
            create: {
              webLink: validData.platforms?.webLink ?? null,
              iosLink: validData.platforms?.iosLink ?? null,
              androidLink: validData.platforms?.androidLink ?? null,
              desktopLink: validData.platforms?.desktopLink ?? null,
            },
          },

          tools: (() => {
            const tools = validData.tools;
            if (!tools) return undefined;
            const hasTools =
              (tools.development?.length ?? 0) > 0 ||
              (tools.communication?.length ?? 0) > 0 ||
              (tools.design?.length ?? 0) > 0 ||
              (tools.debugging?.length ?? 0) > 0;
            return hasTools
              ? {
                  create: {
                    development: tools.development ?? [],
                    communication: tools.communication ?? [],
                    design: tools.design ?? [],
                    debugging: tools.debugging ?? [],
                  },
                }
              : undefined;
          })(),

          translations: {
            create: mapAllFormTranslations(validData.translations),
          },
        },
      });
    });

    scheduleProjectIndexing(
      {
        projectId: result.id,
        isPublic: validData.isPublic,
        technologies: validData.technologies,
        platformCategories: validData.platformCategories,
        domainTags: validData.domainTags,
        translations: mapAllFormTranslations(validData.translations),
      },
      'Project save',
    );

    // 모든 처리가 성공적으로 DB에 반영된 후 캐시 갱신
    revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
    revalidatePath('/[locale]', 'layout'); // 전 세계 사용자 페이지 갱신

    return { success: true, id: result.id };
  } catch (error) {
    console.error('❌ Project Save Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save project',
    };
  }
}
