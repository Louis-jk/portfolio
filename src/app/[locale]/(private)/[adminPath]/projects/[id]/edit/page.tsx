import { getProjectById } from '@/modules/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import type { ProjectLocale } from '@/modules/projects';
import ProjectEditForm from './ProjectEditForm';

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations('admin.projects');
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) notFound();

  const project = await getProjectById(projectId);

  if (!project) notFound();

  const toFormTranslation = (loc: ProjectLocale) => {
    const desc = (project.description[loc] ?? []).map((v) => ({ value: v }));
    const chall = (project.challenges[loc] ?? []).map((v) => ({ value: v }));
    const achiev = (project.achievements[loc] ?? []).map((v) => ({ value: v }));
    return {
      title: project.title[loc] ?? '',
      role: project.role[loc] ?? '',
      overview: project.overview[loc] ?? '',
      region: project.region[loc] ?? '',
      company: project.company[loc] ?? '',
      description: desc.length ? desc : [{ value: '' }],
      challenges: chall.length ? chall : [{ value: '' }],
      achievements: achiev.length ? achiev : [{ value: '' }],
      detailImage: '',
    };
  };

  const initialData = {
    imageUrl: project.imageUrl,
    startDate: project.startDate.toISOString().slice(0, 10),
    endDate: project.endDate?.toISOString().slice(0, 10) ?? '',
    isPublic: project.isPublic,
    technologies: project.technologies.join(', '),
    platformCategories: project.platformCategories ?? [],
    domainTags: project.domainTags ?? [],
    tools: {
      development: (project.tools?.development ?? []).join(', '),
      communication: (project.tools?.communication ?? []).join(', '),
      design: (project.tools?.design ?? []).join(', '),
      debugging: (project.tools?.debugging ?? []).join(', '),
    },
    platforms: {
      webLink: project.platforms?.webLink ?? '',
      iosLink: project.platforms?.iosLink ?? '',
      androidLink: project.platforms?.androidLink ?? '',
      desktopLink: project.platforms?.desktopLink ?? '',
    },
    translations: {
      ko: toFormTranslation('ko'),
      ja: toFormTranslation('ja'),
      en: toFormTranslation('en'),
    },
  };

  return (
    <div className='py-10 bg-zinc-50 dark:bg-slate-950 min-h-screen'>
      <div className='max-w-7xl mx-auto px-8 mb-6 flex items-center gap-3'>
        <Link
          href={`/${locale}${ADMIN_ROUTES.PROJECTS}`}
          className='text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition'
        >
          {t('backToList')}
        </Link>
        <span className='text-zinc-300 dark:text-zinc-600'>|</span>
        <Link
          href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${projectId}`}
          className='text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition'
        >
          {t('preview')}
        </Link>
      </div>
      <ProjectEditForm
        projectId={projectId}
        initialData={initialData}
        locale={locale}
      />
    </div>
  );
}
