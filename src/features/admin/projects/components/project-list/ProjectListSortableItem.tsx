'use client';

import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProjectListItem } from './ProjectListItem';
import type { AdminProjectListItem } from '@/features/admin/projects/types';

export function ProjectListSortableItem({
  project,
  locale,
  untitledLabel,
  onDelete,
}: {
  project: AdminProjectListItem;
  locale: string;
  untitledLabel: string;
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

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? 'opacity-50 z-50' : ''}
    >
      <ProjectListItem
        project={project}
        locale={locale}
        untitledLabel={untitledLabel}
        onDelete={onDelete}
        dragHandle={
          <div
            {...attributes}
            {...listeners}
            className='p-2 rounded-lg cursor-grab active:cursor-grabbing text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 touch-none shrink-0'
          >
            <GripVertical size={20} />
          </div>
        }
      />
    </div>
  );
}
