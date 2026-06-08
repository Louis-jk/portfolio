'use client';

import Image from 'next/image';
import { CiLink } from 'react-icons/ci';
import type { ProjectWithTranslations } from '@/lib/projects';
import { getProjectTitle } from '@/lib/projects/translation';

export function renderProjectLinkLabel(
  project: ProjectWithTranslations,
  locale: string,
) {
  return (
    <p className='flex items-center gap-3 w-full min-w-0'>
      <span className='relative size-10 rounded-md overflow-hidden border border-white/20 flex-shrink-0 bg-black/10'>
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={getProjectTitle(project, locale)}
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
        {getProjectTitle(project, locale)}
      </span>
    </p>
  );
}

export function normalizeProjectLinkForLocale(
  link: { text: React.ReactNode; url: string },
  projects: ProjectWithTranslations[],
  locale: string,
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
      text: renderProjectLinkLabel(project, locale),
      url: `${pathname}?item=${projectId}`,
    };
  } catch {
    return link;
  }
}

export function buildProjectLinksFromIds(
  projectIds: number[],
  projects: ProjectWithTranslations[],
  locale: string,
  basePath: string,
) {
  return projectIds
    .map((projectId) => projects.find((project) => project.id === projectId))
    .filter((project): project is ProjectWithTranslations => Boolean(project))
    .map((project) => ({
      text: renderProjectLinkLabel(project, locale),
      url: `${basePath}?item=${project.id}`,
    }));
}
