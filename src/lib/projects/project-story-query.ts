import type { EditorOutput } from '@/modules/project-detail-page';

export type ProjectStoryData = {
  content: EditorOutput | null;
};

/** Keep prefetched stories in memory; freshness is handled via refetch on open. */
export const PROJECT_STORY_GC_MS = 30 * 60 * 1000;

export function projectStoryQueryKey(projectId: number) {
  return ['project-story', projectId] as const;
}

export async function fetchProjectStory(
  projectId: number,
): Promise<ProjectStoryData> {
  const response = await fetch(`/api/projects/${projectId}/story`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { content: null };
    }
    throw new Error(`Failed to load project story (${response.status})`);
  }

  return (await response.json()) as ProjectStoryData;
}

/** Shared options — stale immediately so overlay can show cache then refetch. */
export function projectStoryQueryOptions(projectId: number) {
  return {
    queryKey: projectStoryQueryKey(projectId),
    queryFn: () => fetchProjectStory(projectId),
    staleTime: 0,
    gcTime: PROJECT_STORY_GC_MS,
  };
}

/** Overlay: instant cached render + always fetch latest from API. */
export function projectStoryOverlayQueryOptions(projectId: number) {
  return {
    ...projectStoryQueryOptions(projectId),
    refetchOnMount: 'always' as const,
  };
}
