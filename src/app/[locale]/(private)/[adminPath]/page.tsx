import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { listAllProjects, readI18n } from '@/modules/projects';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { format } from 'date-fns';
import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil } from 'lucide-react';
import { ProjectStoryAdminLinks } from '@/features/admin/projects/components/shared/ProjectStoryAdminLinks';

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const projects = await listAllProjects();

  const t = await getTranslations('admin.projects');

  const recentProjects = projects.slice(0, 5);
  const publicCount = projects.filter((p) => p.isPublic).length;
  const koCount = projects.filter((p) => p.title.ko).length;
  const jaCount = projects.filter((p) => p.title.ja).length;
  const enCount = projects.filter((p) => p.title.en).length;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-end'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
            Welcome back, Joonho!
          </h2>
          <p className='text-slate-500 dark:text-slate-400'>
            현재 포트폴리오의 실시간 현황입니다.
          </p>
        </div>
        <div className='text-sm text-slate-400 dark:text-slate-500'>
          Last updated: {format(new Date(), 'yyyy.MM.dd')}
        </div>
      </div>

      {/* 통계 카드 섹션 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <StatCard
          title='Active Projects'
          value={String(projects.length)}
          sub={`KR: ${koCount} | JP: ${jaCount} | EN: ${enCount}`}
        />
        <StatCard
          title='Public Projects'
          value={String(publicCount)}
          sub={`of ${projects.length} total`}
        />
        <StatCard
          title='Storage Usage'
          value='-'
          sub='Images & GIFs in Supabase'
        />
      </div>

      {/* 최근 프로젝트 섹션 */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
          Recent Projects
        </h3>
        {recentProjects.length === 0 ? (
          <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center'>
            <p className='text-slate-500 dark:text-slate-400'>
              등록된 프로젝트가 없습니다.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {recentProjects.map((project) => {
              const title = readI18n(project.title, locale) || t('untitledProject');
              return (
                <Card
                  key={project.id}
                  className='p-4 flex flex-row items-center gap-6 hover:shadow-md transition'
                >
                  <Link
                    href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${project.id}`}
                    className='flex flex-1 items-center gap-6 min-w-0'
                  >
                    <div className='w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0'>
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={`${title} thumbnail`}
                          className='w-full h-full object-cover'
                          width={96}
                          height={96}
                          unoptimized
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-[10px] text-zinc-400 dark:text-zinc-500'>
                          NO IMAGE
                        </div>
                      )}
                    </div>
                    <div className='flex-grow'>
                      {((project.platformCategories?.length ?? 0) > 0 ||
                        (project.domainTags?.length ?? 0) > 0) && (
                        <div className='flex flex-wrap gap-1.5 mb-1.5'>
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
                      )}
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='font-bold text-lg break-words min-w-0 text-slate-900 dark:text-slate-100'>
                          {title}
                        </h3>
                        {project.isPublic ? (
                          <Badge className='bg-indigo-600 text-white border-none'>
                            PUBLIC
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='bg-red-700 text-white border-none'
                          >
                            PRIVATE
                          </Badge>
                        )}
                      </div>
                      <div className='text-xs text-zinc-500 flex gap-4'>
                        <span>
                          📅 {format(new Date(project.startDate), 'yyyy.MM')} ~{' '}
                          {project.endDate
                            ? format(new Date(project.endDate), 'yyyy.MM')
                            : 'PRESENT'}
                        </span>
                        <span className='flex gap-1'>
                          {['ko', 'ja', 'en'].map((lang) => (
                            <span
                              key={lang}
                              className={`px-1 rounded ${
                                project.title[lang as 'ko' | 'ja' | 'en']
                                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                                  : 'text-zinc-300 dark:text-zinc-600'
                              }`}
                            >
                              {lang.toUpperCase()}
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className='flex items-center gap-2 shrink-0'>
                    <Link
                      href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${project.id}`}
                      className='p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'
                      title='미리보기'
                      aria-label='Preview project'
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${project.id}/edit`}
                      className='p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'
                      title='편집'
                      aria-label='Edit project'
                    >
                      <Pencil size={18} />
                    </Link>
                    <ProjectStoryAdminLinks
                      projectId={project.id}
                      locale={locale}
                      variant='icon'
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {projects.length > 0 && (
          <Link
            href={`/${locale}${ADMIN_ROUTES.PROJECTS}`}
            className='block text-sm text-purple-600 dark:text-purple-400 hover:underline'
          >
            전체 프로젝트 보기 →
          </Link>
        )}
      </div>
    </div>
  );
}

// 간단한 통계 카드 컴포넌트
function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className='bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm'>
      <p className='text-sm text-slate-500 dark:text-slate-400 mb-1'>
        {title}
      </p>
      <h4 className='text-3xl font-bold mb-1 text-slate-900 dark:text-slate-100'>
        {value}
      </h4>
      <p className='text-xs text-slate-400 dark:text-slate-500'>{sub}</p>
    </div>
  );
}
