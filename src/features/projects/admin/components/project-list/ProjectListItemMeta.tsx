import { format } from 'date-fns';
import { readI18n } from '@/entities/projects';
import { AdminProjectCategoryBadges } from './AdminProjectCategoryBadges';
import type { AdminProjectListItem } from '@/features/projects/admin/types';

export function ProjectListItemMeta({
  project,
  locale,
  untitledLabel,
  showDetails = true,
}: {
  project: AdminProjectListItem;
  locale: string;
  untitledLabel: string;
  showDetails?: boolean;
}) {
  return (
    <div className='flex-grow'>
      <AdminProjectCategoryBadges project={project} showDetails={showDetails} />
      <div className='flex items-center gap-2 mb-1'>
        <h3 className='font-bold text-lg break-words min-w-0 text-slate-900 dark:text-slate-100'>
          {readI18n(project.title, locale) || untitledLabel}
        </h3>
      </div>
      {showDetails && (
        <div className='text-xs text-zinc-500 flex gap-4'>
          <span>
            📅 {format(new Date(project.startDate), 'yyyy.MM')} ~{' '}
            {project.endDate
              ? format(new Date(project.endDate), 'yyyy.MM')
              : 'PRESENT'}
          </span>
          <span className='flex gap-1'>
            {(['ko', 'ja', 'en'] as const).map((lang) => (
              <span
                key={lang}
                className={`px-1 rounded ${project.title[lang] ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-zinc-300 dark:text-zinc-600'}`}
              >
                {lang.toUpperCase()}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
