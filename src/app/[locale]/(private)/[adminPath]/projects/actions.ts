'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ADMIN_ROUTES } from '@/lib/constants';
import { requireAuth } from '@/utils/supabase/auth';

export async function updateProjectOrder(projectIds: number[]) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(
      projectIds.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
    revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('❌ Project Order Update Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order',
    };
  }
}

export async function deleteProject(projectId: number) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    revalidatePath(`/[locale]${ADMIN_ROUTES.PROJECTS}`, 'page');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('❌ Project Delete Error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete project',
    };
  }
}
