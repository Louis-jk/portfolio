'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import type { ProjectView } from '@/modules/projects';
import { applyStoryVisibilityUpdate } from '@/lib/projects/apply-story-visibility-update';
import { fetchProjectsClient } from '@/lib/projects/fetch-projects-client';
import { projectStoryQueryKey } from '@/lib/projects/project-story-query';
import { useProjectCatalogRealtime } from '@/hooks/useProjectCatalogRealtime';
import { useStoryVisibilityRealtime } from '@/hooks/useStoryVisibilityRealtime';

const CATALOG_REFETCH_DEBOUNCE_MS = 300;

/**
 * SSR project list + live updates via Supabase Realtime:
 * - project catalog (title, detail fields, order, visibility)
 * - story visibility + story content when detail page changes
 */
export function useLiveProjects(initialProjects: ProjectView[]): ProjectView[] {
  const locale = useLocale();
  const [projects, setProjects] = useState(initialProjects);
  const queryClient = useQueryClient();
  const refetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    return () => {
      if (refetchTimerRef.current) {
        clearTimeout(refetchTimerRef.current);
      }
    };
  }, []);

  const scheduleCatalogRefetch = useCallback(() => {
    if (refetchTimerRef.current) {
      clearTimeout(refetchTimerRef.current);
    }

    refetchTimerRef.current = setTimeout(() => {
      refetchTimerRef.current = null;
      void fetchProjectsClient(locale)
        .then(setProjects)
        .catch((error) => {
          console.warn('[project-catalog] Refetch failed:', error);
        });
    }, CATALOG_REFETCH_DEBOUNCE_MS);
  }, [locale]);

  const handleCatalogChange = useCallback(() => {
    scheduleCatalogRefetch();
  }, [scheduleCatalogRefetch]);

  const handleStorySignal = useCallback(
    (change: Parameters<typeof applyStoryVisibilityUpdate>[1]) => {
      setProjects((current) => applyStoryVisibilityUpdate(current, change));

      void queryClient.invalidateQueries({
        queryKey: projectStoryQueryKey(change.projectId),
      });

      if (!change.isPublic) {
        void queryClient.removeQueries({
          queryKey: projectStoryQueryKey(change.projectId),
        });
      }
    },
    [queryClient],
  );

  useProjectCatalogRealtime(handleCatalogChange);
  useStoryVisibilityRealtime(handleStorySignal);

  return projects;
}
