'use client';

import { createContext, useCallback, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ProjectView } from '@/entities/projects';
import { canShowPublicStoryLink } from '@/entities/projects/lib/story-access';
import { projectStoryQueryOptions } from '@/entities/projects/lib/project-story-query';
import { useProjectStory } from '@/features/projects/public/hooks/useProjectStory';
import { usePrefetchProjectStory } from '@/features/projects/public/hooks/usePrefetchProjectStory';
import { ProjectStoryOverlay } from './ProjectStoryOverlay';

type ProjectStoryContextValue = {
  openStory: (projectId: number) => void;
};

const ProjectStoryContext = createContext<ProjectStoryContextValue | null>(null);

export function ProjectStoryProvider({
  projects,
  children,
}: {
  projects: ProjectView[];
  children: React.ReactNode;
}) {
  const { storyProjectId, openStory: openStoryFromUrl, closeStory } =
    useProjectStory();
  const queryClient = useQueryClient();

  usePrefetchProjectStory(storyProjectId);

  const openStory = useCallback(
    (projectId: number) => {
      void queryClient.prefetchQuery(projectStoryQueryOptions(projectId));
      openStoryFromUrl(projectId);
    },
    [queryClient, openStoryFromUrl],
  );

  const activeProject =
    storyProjectId != null
      ? projects.find((project) => project.id === storyProjectId)
      : null;

  useEffect(() => {
    if (storyProjectId == null || !activeProject) return;
    if (!canShowPublicStoryLink(activeProject)) {
      closeStory();
    }
  }, [storyProjectId, activeProject, closeStory]);

  const showStoryOverlay =
    storyProjectId != null && canShowPublicStoryLink(activeProject);

  return (
    <ProjectStoryContext.Provider value={{ openStory }}>
      {children}
      {showStoryOverlay && (
        <ProjectStoryOverlay
          projectId={storyProjectId}
          projectTitle={activeProject?.title ?? ''}
          onClose={closeStory}
        />
      )}
    </ProjectStoryContext.Provider>
  );
}

export function useProjectStoryContext() {
  const context = useContext(ProjectStoryContext);
  if (!context) {
    throw new Error('useProjectStoryContext must be used within ProjectStoryProvider');
  }
  return context;
}
