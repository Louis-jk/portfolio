'use client';

import Image from 'next/image';
import { CiLink } from 'react-icons/ci';
import type { ProjectView } from '@/modules/projects';

export function renderProjectLinkLabel(project: ProjectView) {
  return (
    <p className='flex items-center gap-3 w-full min-w-0'>
      <span className='relative size-10 rounded-md overflow-hidden border border-white/20 flex-shrink-0 bg-black/10'>
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes='40px'
            className='object-cover'
          />
        ) : (
          <span className='absolute inset-0 flex items-center justify-center'>
            <CiLink size={18} />
          </span>
        )}
      </span>
      <span className='flex-1 min-w-0 whitespace-normal break-words leading-snug text-left'>
        {project.title}
      </span>
    </p>
  );
}

export function normalizeProjectLinkForLocale(
  link: { text: React.ReactNode; url: string },
  projects: ProjectView[],
  pathname: string,
) {
  try {
    const itemId = new URL(link.url, window.location.origin).searchParams.get(
      'item',
    );
    const projectId = itemId ? Number(itemId) : undefined;
    if (!projectId || !Number.isInteger(projectId)) return link;

    const project = projects.find((p) => p.id === projectId);
    if (!project) return link;

    return {
      text: renderProjectLinkLabel(project),
      url: `${pathname}?item=${projectId}`,
    };
  } catch {
    return link;
  }
}

export function buildProjectLinksFromIds(
  projectIds: number[],
  projects: ProjectView[],
  basePath: string,
) {
  return projectIds
    .map((projectId) => projects.find((project) => project.id === projectId))
    .filter((project): project is ProjectView => Boolean(project))
    .map((project) => ({
      text: renderProjectLinkLabel(project),
      url: `${basePath}?item=${project.id}`,
    }));
}
