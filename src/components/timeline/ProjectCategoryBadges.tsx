'use client';

import { useTranslations } from 'next-intl';
import { Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectWithTranslations } from '@/lib/projects';

interface ProjectCategoryBadgesProps {
  project: ProjectWithTranslations;
  className?: string;
}

export default function ProjectCategoryBadges({
  project,
  className,
}: ProjectCategoryBadgesProps) {
  const t = useTranslations('timeline.categories');
  const platformCategories = project.platformCategories ?? [];
  const domainTags = project.domainTags ?? [];

  return (
    <div className={cn('flex flex-wrap gap-1.5 items-center', className)}>
      {/* Public/Private - 제일 앞 */}
      {project.isPublic ? (
        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'>
          <Globe size={10} />
          PUBLIC
        </span>
      ) : (
        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'>
          <Lock size={10} />
          PRIVATE
        </span>
      )}
      {platformCategories.map((cat) => (
        <span
          key={cat}
          className='px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
        >
          {t(`platform.${cat}`)}
        </span>
      ))}
      {domainTags.map((tag) => (
        <span
          key={tag}
          className='px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
        >
          {t(`domain.${tag}`)}
        </span>
      ))}
    </div>
  );
}
