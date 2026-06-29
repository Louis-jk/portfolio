'use client';

import { GripVertical, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Control } from 'react-hook-form';
import type { ProjectFormValues } from '@/types/project-form.type';
import type { ArrayFieldKey } from './ArrayField';

export function SortableArrayItem({
  id,
  lang,
  fieldKey,
  index,
  control,
  onRemove,
}: {
  id: string;
  lang: 'ko' | 'ja' | 'en';
  fieldKey: ArrayFieldKey;
  index: number;
  control: Control<ProjectFormValues>;
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
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex gap-2 items-center p-1 -m-1 rounded-xl ${
        isDragging ? 'bg-blue-50 opacity-90 z-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className='p-2 rounded-lg cursor-grab active:cursor-grabbing text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 touch-none shrink-0'
      >
        <GripVertical size={18} />
      </div>
      <input
        {...control.register(`translations.${lang}.${fieldKey}.${index}.value`)}
        placeholder={`항목 ${index + 1}`}
        className='flex-1 p-4 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-slate-100'
      />
      <button
        type='button'
        onClick={onRemove}
        className='p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer'
      >
        <X size={16} />
      </button>
    </div>
  );
}
