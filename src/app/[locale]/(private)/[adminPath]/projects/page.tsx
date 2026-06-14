import { listAllProjects } from '@/modules/projects';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { getTranslations } from 'next-intl/server';
import { ProjectListSortable } from '@/features/admin/projects';

export default async function ProjectListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin.projects');

  const projects = await listAllProjects();

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-8'>
      <header className='flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6'>
        <div>
          <h1 className='text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-100'>
            {t('listTitle')}
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 text-sm mt-1'>
            {t('projectCount', { count: projects.length })}
          </p>
        </div>
        <Link
          href={`/${locale}${ADMIN_ROUTES.NEW_PROJECT}`}
          className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition shadow-lg'
        >
          {t('newProject')}
        </Link>
      </header>

      <div className='grid grid-cols-1 gap-4'>
        {projects.length === 0 ? (
          <div className='text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800'>
            <p className='text-zinc-400 dark:text-zinc-500'>{t('noProjects')}</p>
          </div>
        ) : (
          <ProjectListSortable projects={projects} locale={locale} />
        )}
      </div>
    </div>
  );
}
