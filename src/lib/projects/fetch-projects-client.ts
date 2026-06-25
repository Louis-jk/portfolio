import type { ProjectView } from '@/modules/projects';

export async function fetchProjectsClient(
  locale: string,
): Promise<ProjectView[]> {
  const response = await fetch(
    `/api/projects?locale=${encodeURIComponent(locale)}`,
    { cache: 'no-store' },
  );

  if (!response.ok) {
    throw new Error(`Failed to load projects (${response.status})`);
  }

  return (await response.json()) as ProjectView[];
}
