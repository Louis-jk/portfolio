'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ProjectView } from '@/modules/projects';
import { applyStoryVisibilityUpdate } from '@/lib/projects/apply-story-visibility-update';
import { projectStoryQueryKey } from '@/lib/projects/project-story-query';
import { useStoryVisibilityRealtime } from '@/hooks/useStoryVisibilityRealtime';

/**
 * SSR project list + live `storyIsPublic` updates via Supabase Realtime.
 */
export function useLiveProjects(initialProjects: ProjectView[]): ProjectView[] {
  const [projects, setProjects] = useState(initialProjects);
  const queryClient = useQueryClient();

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleVisibilityChange = useCallback(
    (change: Parameters<typeof applyStoryVisibilityUpdate>[1]) => {
      setProjects((current) => applyStoryVisibilityUpdate(current, change));

      if (!change.isPublic) {
        void queryClient.removeQueries({
          queryKey: projectStoryQueryKey(change.projectId),
        });
      }
    },
    [queryClient],
  );

  useStoryVisibilityRealtime(handleVisibilityChange);

  return projects;
}
