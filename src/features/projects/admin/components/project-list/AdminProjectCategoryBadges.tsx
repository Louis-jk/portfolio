import type { AdminProjectListItem } from '@/features/projects/admin/types';
import { AdminVisibilityBadge } from '../shared/AdminVisibilityBadge';

export function AdminProjectCategoryBadges({
  project,
  showDetails = true,
}: {
  project: Pick<
    AdminProjectListItem,
    'platformCategories' | 'domainTags' | 'isPublic'
  >;
  showDetails?: boolean;
}) {
  const hasCategories =
    (project.platformCategories?.length ?? 0) > 0 ||
    (project.domainTags?.length ?? 0) > 0;

  if (!hasCategories) return null;

  return (
    <div className='flex flex-wrap gap-1.5 mb-1.5'>
      {showDetails && <AdminVisibilityBadge isPublic={project.isPublic} />}
      {(project.platformCategories ?? []).map((cat) => (
        <span
          key={cat}
          className='px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
        >
          {cat}
        </span>
      ))}
      {(project.domainTags ?? []).map((tag) => (
        <span
          key={tag}
          className='px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
