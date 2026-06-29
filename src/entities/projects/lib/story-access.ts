import type { ProjectView } from '@/entities/projects';

/** Whether the public site may show the “view story” entry point. */
export function canShowPublicStoryLink(
  project: Pick<ProjectView, 'storyIsPublic'> | null | undefined,
): boolean {
  return Boolean(project?.storyIsPublic);
}
