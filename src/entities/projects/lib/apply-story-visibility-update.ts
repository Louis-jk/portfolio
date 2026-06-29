import type { ProjectView } from '@/entities/projects';

export type StoryVisibilityChange = {
  projectId: number;
  isPublic: boolean;
};

export function applyStoryVisibilityUpdate(
  projects: ProjectView[],
  change: StoryVisibilityChange,
): ProjectView[] {
  const { projectId, isPublic } = change;
  let changed = false;

  const next = projects.map((project) => {
    if (project.id !== projectId) return project;
    if (project.storyIsPublic === isPublic) return project;
    changed = true;
    return { ...project, storyIsPublic: isPublic };
  });

  return changed ? next : projects;
}
