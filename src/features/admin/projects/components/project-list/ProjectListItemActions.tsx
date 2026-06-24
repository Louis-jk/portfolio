import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { ProjectStoryAdminLinks } from '@/features/admin/projects/components/shared/ProjectStoryAdminLinks';

export function ProjectListItemActions({
  projectId,
  locale,
  onDelete,
}: {
  projectId: number;
  locale: string;
  onDelete: (id: number) => void;
}) {
  return (
    <div className='flex items-center gap-2 shrink-0'>
      <Link
        href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${projectId}`}
        className='p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'
        title='미리보기'
        aria-label='Preview project'
      >
        <Eye size={18} />
      </Link>
      <Link
        href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${projectId}/edit`}
        className='p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'
        title='편집'
        aria-label='Edit project'
      >
        <Pencil size={18} />
      </Link>
      <ProjectStoryAdminLinks
        projectId={projectId}
        locale={locale}
        variant='icon'
      />
      <button
        type='button'
        onClick={() => onDelete(projectId)}
        className='p-2 rounded-lg text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors'
        title='삭제'
        aria-label='Delete project'
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
