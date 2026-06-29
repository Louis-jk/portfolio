'use client';

import { GripVertical } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useTranslations } from 'next-intl';
import { useSortableSensors } from '@/features/projects/admin/lib/sortable-sensors';
import { useProjectListSortable } from '@/features/projects/admin/hooks/useProjectListSortable';
import type { AdminProjectListItem } from '@/features/projects/admin/types';
import { ProjectListItem } from './ProjectListItem';
import { ProjectListSortableItem } from './ProjectListSortableItem';

export default function ProjectListSortable({
  projects,
  locale,
}: {
  projects: AdminProjectListItem[];
  locale: string;
}) {
  const t = useTranslations('admin.projects');
  const sensors = useSortableSensors();
  const { items, isMounted, handleDragEnd, handleDelete } =
    useProjectListSortable(projects);

  const staticDragHandle = (
    <div className='p-2 rounded-lg text-zinc-400 shrink-0'>
      <GripVertical size={20} />
    </div>
  );

  if (!isMounted) {
    return (
      <div className='space-y-4'>
        {items.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            locale={locale}
            untitledLabel={t('untitledProject')}
            onDelete={handleDelete}
            dragHandle={staticDragHandle}
            interactive={false}
          />
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
            <ProjectListSortableItem
              key={project.id}
              project={project}
              locale={locale}
              untitledLabel={t('untitledProject')}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
