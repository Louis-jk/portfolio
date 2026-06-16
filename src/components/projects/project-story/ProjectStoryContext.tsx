'use client';

import { createContext, useContext } from 'react';
import type { ProjectView } from '@/modules/projects';
import { useProjectStory } from '@/hooks/useProjectStory';
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
  const { storyProjectId, openStory, closeStory } = useProjectStory();

  const activeProject =
    storyProjectId != null
      ? projects.find((project) => project.id === storyProjectId)
      : null;

  return (
    <ProjectStoryContext.Provider value={{ openStory }}>
      {children}
      {storyProjectId != null && (
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
