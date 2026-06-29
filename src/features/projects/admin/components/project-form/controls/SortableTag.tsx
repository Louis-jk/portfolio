'use client';

import { GripVertical, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableTag({
  id,
  tag,
  onRemove,
}: {
  id: string;
  tag: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <span
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 border shadow-sm cursor-grab active:cursor-grabbing touch-none ${
        isDragging
          ? 'opacity-50 border-blue-400 z-50'
          : 'border-zinc-200 dark:border-slate-700'
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical size={14} className='text-zinc-400 shrink-0' />
      {tag}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='p-0.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors'
      >
        <X size={14} />
      </button>
    </span>
  );
}
