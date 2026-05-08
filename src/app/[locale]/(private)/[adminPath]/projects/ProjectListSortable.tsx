'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ADMIN_ROUTES } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { GripVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import { updateProjectOrder, deleteProject } from './actions';
import { useTranslations } from 'next-intl';

type Project = {
  id: number;
  imageUrl: string;
  startDate: Date;
  endDate: Date | null;
  isPublic: boolean;
  platformCategories?: string[];
  domainTags?: string[];
  translations: { locale: string; title: string }[];
};

function SortableProjectCard({
  project,
  locale,
  onDelete,
}: {
  project: Project;
  locale: string;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const t = useTranslations('admin.projects');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50 z-50' : ''}
    >
      <Card className='p-4 flex flex-row items-center gap-6 hover:shadow-md transition'>
        <div
          {...attributes}
          {...listeners}
          className='p-2 rounded-lg cursor-grab active:cursor-grabbing text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 touch-none shrink-0'
        >
          <GripVertical size={20} />
        </div>
        <Link
          href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${project.id}`}
          className='flex flex-1 items-center gap-6 min-w-0'
        >
          <div className='w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0'>
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt='Project thumbnail'
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
                {project.translations.find((tr) => tr.locale === locale)
                  ?.title ||
                  project.translations.find((tr) => tr.locale === 'ko')
                    ?.title ||
                  t('untitledLabel')}
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
                    className={`px-1 rounded ${project.translations.some((t) => t.locale === lang && t.title) ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-zinc-300 dark:text-zinc-600'}`}
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
          <button
            type='button'
            onClick={() => onDelete(project.id)}
            className='p-2 rounded-lg text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors'
            title='삭제'
          aria-label='Delete project'
          >
            <Trash2 size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
}

export default function ProjectListSortable({
  projects,
  locale,
}: {
  projects: Project[];
  locale: string;
}) {
  const t = useTranslations('admin.projects');
  const [items, setItems] = useState(projects);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setItems(projects);
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);

    const projectIds = newOrder.map((p) => p.id);
    const res = await updateProjectOrder(projectIds);
    if (!res?.success) {
      setItems(items);
      toast.error(res?.error ?? t('orderChangeFailed'));
    } else {
      toast.success(t('orderChanged'));
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('이 프로젝트를 삭제하시겠습니까?')) return;
    const res = await deleteProject(projectId);
    if (res?.success) {
      setItems((prev) => prev.filter((p) => p.id !== projectId));
    } else {
      alert(res?.error ?? '삭제에 실패했습니다.');
    }
  };

  // dnd-kit의 aria-describedby ID가 서버/클라이언트에서 달라 hydration mismatch 발생
  // 클라이언트 마운트 후에만 DndContext 렌더링
  if (!isMounted) {
    return (
      <div className='space-y-4'>
        {items.map((project) => (
          <Card key={project.id} className='p-4 flex flex-row items-center gap-6'>
            <div className='p-2 rounded-lg text-zinc-400 shrink-0'>
              <GripVertical size={20} />
            </div>
            <Link
              href={`/${locale}${ADMIN_ROUTES.PROJECTS}/${project.id}`}
              className='flex flex-1 items-center gap-6 min-w-0'
            >
              <div className='w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0'>
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt='Project thumbnail'
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
                <h3 className='font-bold text-lg text-slate-900 dark:text-slate-100'>
                  {project.translations.find((tr) => tr.locale === locale)?.title ||
                    project.translations.find((tr) => tr.locale === 'ko')?.title ||
                    'Untitled'}
                </h3>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((p) => p.id)}>
        <div className='space-y-4'>
          {items.map((project) => (
            <SortableProjectCard
              key={project.id}
              project={project}
              locale={locale}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
