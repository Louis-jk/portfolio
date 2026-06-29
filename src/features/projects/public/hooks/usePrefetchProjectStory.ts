'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { projectStoryQueryOptions } from '@/entities/projects/lib/project-story-query';

/** Prefetch story when `projectId` becomes available (e.g. project selected). */
export function usePrefetchProjectStory(projectId: number | null | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (projectId == null) return;
    void queryClient.prefetchQuery(projectStoryQueryOptions(projectId));
  }, [projectId, queryClient]);
}

/** Imperative prefetch for hover / click handlers. */
export function usePrefetchProjectStoryCallback() {
  const queryClient = useQueryClient();

  return useCallback(
    (projectId: number) => {
      void queryClient.prefetchQuery(projectStoryQueryOptions(projectId));
    },
    [queryClient],
  );
}
