'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pencil, Globe, Smartphone, Laptop, Lock } from 'lucide-react';
import Image from 'next/image';

type Translation = {
  locale: string;
  title: string;
  company: string;
  region: string;
  role: string;
  overview: string;
  description: string[];
  challenges: string[];
  achievements: string[];
  detailImage: string | null;
};

type Project = {
  id: number;
  imageUrl: string;
  startDate: string;
  endDate: string | null;
  isPublic: boolean;
  technologies: string[];
  platformCategories?: string[];
  domainTags?: string[];
  platforms: {
    webLink: string | null;
    iosLink: string | null;
    androidLink: string | null;
    desktopLink: string | null;
  } | null;
  tools: {
    development: string[];
    communication: string[];
    design: string[];
    debugging: string[];
  } | null;
  translations: Translation[];
};

const LOCALES = [
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
] as const;

export default function ProjectPreviewClient({
  project,
  basePath,
  locale,
}: {
  project: Project;
  basePath: string;
  locale: string;
}) {
  const availableLocales = LOCALES.filter((l) =>
    project.translations.some((t) => t.locale === l.value),
  );
  const defaultLocale = availableLocales.some((l) => l.value === locale)
    ? locale
    : (availableLocales[0]?.value ?? project.translations[0]?.locale ?? 'ko');
  const [selectedLocale, setSelectedLocale] = useState(defaultLocale);
  const tAdmin = useTranslations('admin.projects');

  const t =
    project.translations.find((tr) => tr.locale === selectedLocale) ||
    project.translations.find((tr) => tr.locale === 'ko') ||
    project.translations[0];

  return (
    <div className='max-w-7xl mx-auto px-8 py-6 space-y-8'>
      {/* 상단: 뒤로가기 + 수정하기 버튼 */}
      <div className='flex justify-between items-center'>
        <Link
          href={basePath}
          className='text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition'
        >
          {tAdmin('backToList')}
        </Link>
        <Link
          href={`${basePath}/${project.id}/edit`}
          className='inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-purple-600 transition shadow-sm'
        >
          <Pencil size={16} />
          {tAdmin('edit')}
        </Link>
      </div>

      {/* 미리보기 카드 */}
      <Card className='overflow-hidden p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
        {/* 썸네일 */}
        <div className='bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center'>
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={t.title}
              width={1000}
              height={200}
              className='object-cover w-full h-full'
              unoptimized
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500'>
              NO IMAGE
            </div>
          )}
          <div className='absolute top-4 left-4 flex gap-2'>
            {project.isPublic ? (
              <Badge className='bg-indigo-600 text-white border-none p-4 text-md flex items-center gap-1'>
                <Globe size={16} />
                PUBLIC
              </Badge>
            ) : (
              <Badge
                variant='outline'
                className='bg-red-700 text-white border-none p-4 text-md flex items-center gap-1'
              >
                <Lock size={16} />
                PRIVATE
              </Badge>
            )}
          </div>
        </div>

        <div className='p-8 space-y-6'>
          {/* 다국어 선택 탭 */}
          {availableLocales.length > 1 && (
            <div>
              <h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
                {tAdmin('previewLanguage')}
              </h3>
              <Tabs
                value={selectedLocale}
                onValueChange={(v) => setSelectedLocale(v)}
              >
                <TabsList className='bg-purple-600 dark:bg-purple-700 h-10 rounded-md gap-2'>
                  {availableLocales.map((loc) => (
                    <TabsTrigger
                      key={loc.value}
                      value={loc.value}
                      className='data-[state=active]:bg-white data-[state=active]:hover:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-white hover:text-white rounded-[5px] cursor-pointer'
                    >
                      {loc.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={selectedLocale} className='mt-0' />
              </Tabs>
            </div>
          )}

          {/* 카테고리 & 도메인 태그 (제목 위) */}
          {((project.platformCategories?.length ?? 0) > 0 ||
            (project.domainTags?.length ?? 0) > 0) && (
            <div className='flex flex-wrap gap-1.5 mb-3'>
              {(project.platformCategories ?? []).map((cat) => (
                <span
                  key={cat}
                  className='px-2.5 py-1 rounded text-[10px] font-semibold uppercase bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                >
                  {cat}
                </span>
              ))}
              {(project.domainTags ?? []).map((tag) => (
                <span
                  key={tag}
                  className='px-2.5 py-1 rounded text-[10px] font-semibold uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 제목 & 메타 */}
          <div>
            <h1 className='text-2xl font-bold mb-2 break-words text-slate-900 dark:text-slate-100'>
              {t.title}
            </h1>
            <div className='flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400'>
              <span>{t.company}</span>
              <span>•</span>
              <span>{t.region}</span>
              <span>•</span>
              <span>{t.role}</span>
            </div>
            <div className='mt-2 text-sm text-zinc-500 dark:text-zinc-400'>
              📅 {format(new Date(project.startDate), 'yyyy.MM')} ~{' '}
              {project.endDate
                ? format(new Date(project.endDate), 'yyyy.MM')
                : 'PRESENT'}
            </div>
          </div>

          {/* 상세 이미지 (detailImage) */}
          {t.detailImage && (
            <div className='rounded-lg overflow-hidden border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.detailImage}
                alt={`${t.title} 상세`}
                className='w-full max-h-96 object-contain'
              />
            </div>
          )}

          {/* Overview */}
          {t.overview && (
            <div>
              <h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
                {tAdmin('overview')}
              </h3>
              <p className='text-slate-900 dark:text-slate-100 whitespace-pre-wrap'>
                {t.overview}
              </p>
            </div>
          )}

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div>
              <h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
                {tAdmin('technologies')}
              </h3>
              <div className='rounded-lg border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 p-3 flex flex-wrap gap-2'>
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant='secondary'
                    className='bg-purple-600 text-white font-bold p-4'
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Stack */}
          {project.tools && (
            <div>
              <h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
                {tAdmin('toolsAndStack')}
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {project.tools.development.length > 0 && (
                  <div className='rounded-lg border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 p-3'>
                    <p className='text-xs text-zinc-500 dark:text-zinc-400 mb-2'>
                      {tAdmin('development')}
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {project.tools.development.map((tool) => (
                        <Badge
                          key={tool}
                          variant='secondary'
                          className='font-normal bg-purple-600 text-white'
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {project.tools.communication.length > 0 && (
                  <div className='rounded-lg border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 p-3'>
                    <p className='text-xs text-zinc-500 dark:text-zinc-400 mb-2'>
                      {tAdmin('communication')}
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {project.tools.communication.map((tool) => (
                        <Badge
                          key={tool}
                          variant='secondary'
                          className='font-normal bg-purple-600 text-white'
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {project.tools.design.length > 0 && (
                  <div className='rounded-lg border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 p-3'>
                    <p className='text-xs text-zinc-500 dark:text-zinc-400 mb-2'>
                      {tAdmin('design')}
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {project.tools.design.map((tool) => (
                        <Badge
                          key={tool}
                          variant='secondary'
                          className='font-normal bg-purple-600 text-white'
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {project.tools.debugging.length > 0 && (
                  <div className='rounded-lg border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 p-3'>
                    <p className='text-xs text-zinc-500 dark:text-zinc-400 mb-2'>
                      {tAdmin('debugging')}
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {project.tools.debugging.map((tool) => (
                        <Badge
                          key={tool}
                          variant='secondary'
                          className='font-normal bg-purple-600 text-white'
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Platform Links */}
          {project.platforms &&
            (project.platforms.webLink ||
              project.platforms.iosLink ||
              project.platforms.androidLink ||
              project.platforms.desktopLink) && (
              <div>
                <h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
                  {tAdmin('links')}
                </h3>
                <div className='flex flex-wrap gap-3'>
                  {project.platforms.webLink && (
                    <a
                      href={project.platforms.webLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline'
                    >
                      <Globe size={16} />
                      Web
                    </a>
                  )}
                  {project.platforms.iosLink && (
                    <a
                      href={project.platforms.iosLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline'
                    >
                      <Smartphone size={16} />
                      iOS
                    </a>
                  )}
                  {project.platforms.androidLink && (
                    <a
                      href={project.platforms.androidLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline'
                    >
                      <Smartphone size={16} />
                      Android
                    </a>
                  )}
                  {project.platforms.desktopLink && (
                    <a
                      href={project.platforms.desktopLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline'
                    >
                      <Laptop size={16} />
                      Desktop
                    </a>
                  )}
                </div>
              </div>
            )}

          {/* Description */}
          {t.description.length > 0 && (
            <div>
              <h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
                {tAdmin('description')}
              </h3>
              <ul className='list-disc list-outside ml-4 pl-2 space-y-2 text-slate-900 dark:text-slate-100 text-sm'>
                {t.description.map((item, i) => (
                  <li key={i} className='pl-1'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges */}
          {t.challenges.length > 0 && (
            <div>
              <h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
                {tAdmin('challenges')}
              </h3>
              <ul className='list-disc list-outside ml-4 pl-2 space-y-2 text-slate-900 dark:text-slate-100 text-sm'>
                {t.challenges.map((item, i) => (
                  <li key={i} className='pl-1'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {t.achievements.length > 0 && (
            <div>
              <h3 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
                {tAdmin('achievements')}
              </h3>
              <ul className='list-disc list-outside ml-4 pl-2 space-y-2 text-slate-900 dark:text-slate-100 text-sm'>
                {t.achievements.map((item, i) => (
                  <li key={i} className='pl-1'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
