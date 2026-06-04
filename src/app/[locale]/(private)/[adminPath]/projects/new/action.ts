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

export async function saveProject(data: ProjectFormData) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    if (!data.imageUrl || !data.startDate) {
      return {
        success: false,
        error: 'imageUrl and startDate are required',
      };
    }

    // ⭐ 트랜잭션 시작
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
          imageUrl: data.imageUrl || '',
          startDate: new Date(data.startDate || ''),
          endDate: data.endDate ? new Date(data.endDate) : null,
          isPublic: data.isPublic ?? false,
          technologies: data.technologies || [],
          platformCategories: data.platformCategories || [],
          domainTags: data.domainTags || [],

          platforms: {
            create: {
              webLink: data.platforms?.webLink || null,
              iosLink: data.platforms?.iosLink || null,
              androidLink: data.platforms?.androidLink || null,
              desktopLink: data.platforms?.desktopLink || null,
            },
          },

          tools:
            data.tools &&
            (data.tools.development?.length ||
              data.tools.communication?.length ||
              data.tools.design?.length ||
              data.tools.debugging?.length)
              ? {
                  create: {
                    development: data.tools.development || [],
                    communication: data.tools.communication || [],
                    design: data.tools.design || [],
                    debugging: data.tools.debugging || [],
                  },
                }
              : undefined,

          translations: {
            create: [
              mapTranslation('ko', data.translations?.ko),
              mapTranslation('ja', data.translations?.ja),
              mapTranslation('en', data.translations?.en),
            ],
          },
        },
      });
    });

    void upsertProjectDocuments({
      projectId: result.id,
      isPublic: data.isPublic ?? false,
      technologies: data.technologies || [],
      platformCategories: data.platformCategories || [],
      domainTags: data.domainTags || [],
      translations: [
        mapTranslation('ko', data.translations?.ko),
        mapTranslation('ja', data.translations?.ja),
        mapTranslation('en', data.translations?.en),
      ],
    }).catch((indexError) => {
      console.error('⚠️ Project saved but background indexing failed:', {
        projectId: result.id,
        error: indexError,
      });
    });

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
