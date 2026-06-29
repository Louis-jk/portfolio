import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { ProjectListItemThumbnail } from './ProjectListItemThumbnail';
import { ProjectListItemMeta } from './ProjectListItemMeta';
import { ProjectListItemActions } from './ProjectListItemActions';
import type { AdminProjectListItem } from '@/features/projects/admin/types';

export function ProjectListItem({
  project,
  locale,
  untitledLabel,
  onDelete,
  dragHandle,
  interactive = true,
}: {
  project: AdminProjectListItem;
  locale: string;
  untitledLabel: string;
  onDelete: (id: number) => void;
  dragHandle: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <Card className='p-4 flex flex-row items-center gap-6 hover:shadow-md transition'>
      {dragHandle}
      <Link
        href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${project.id}`}
        className='flex flex-1 items-center gap-6 min-w-0'
      >
        <ProjectListItemThumbnail imageUrl={project.imageUrl} />
        <ProjectListItemMeta
          project={project}
          locale={locale}
          untitledLabel={untitledLabel}
          showDetails={interactive}
        />
      </Link>
      {interactive && (
        <ProjectListItemActions
          projectId={project.id}
          locale={locale}
          onDelete={onDelete}
        />
      )}
    </Card>
  );
}
