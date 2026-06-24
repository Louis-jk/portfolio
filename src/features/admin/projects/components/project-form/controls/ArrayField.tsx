'use client';

import { Plus } from 'lucide-react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import {
  useFieldArray,
  type Control,
  type UseFormGetValues,
  type UseFormSetValue,
} from 'react-hook-form';
import { useSortableSensors } from '@/features/admin/projects/lib/sortable-sensors';
import type { ProjectFormValues } from '@/types/project-form.type';
import { SortableArrayItem } from './SortableArrayItem';

export type ArrayFieldKey = 'description' | 'challenges' | 'achievements';

export function ArrayField({
  lang,
  fieldKey,
  label,
  control,
  setValue,
  getValues,
}: {
  lang: 'ko' | 'ja' | 'en';
  fieldKey: ArrayFieldKey;
  label: string;
  control: Control<ProjectFormValues>;
  setValue: UseFormSetValue<ProjectFormValues>;
  getValues: UseFormGetValues<ProjectFormValues>;
}) {
  const koName = `translations.ko.${fieldKey}` as const;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: koName,
  });
  const sensors = useSortableSensors();
  const dndContextId = `array-${fieldKey}-${lang}`;
  const sortableItems = fields.map((_, i) => `${dndContextId}-${i}`);

  const syncMove = (fromIndex: number, toIndex: number) => {
    move(fromIndex, toIndex);
    const jaArr = getValues(`translations.ja.${fieldKey}`);
    const enArr = getValues(`translations.en.${fieldKey}`);
    setValue(`translations.ja.${fieldKey}`, arrayMove(jaArr, fromIndex, toIndex));
    setValue(`translations.en.${fieldKey}`, arrayMove(enArr, fromIndex, toIndex));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortableItems.indexOf(String(active.id));
      const newIndex = sortableItems.indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        syncMove(oldIndex, newIndex);
      }
    }
  };

  const syncAppend = () => {
    const empty = { value: '' };
    append(empty);
    setValue(`translations.ja.${fieldKey}`, [
      ...getValues(`translations.ja.${fieldKey}`),
      empty,
    ]);
    setValue(`translations.en.${fieldKey}`, [
      ...getValues(`translations.en.${fieldKey}`),
      empty,
    ]);
  };

  const syncRemove = (i: number) => {
    remove(i);
    setValue(
      `translations.ja.${fieldKey}`,
      getValues(`translations.ja.${fieldKey}`).filter((_, idx) => idx !== i),
    );
    setValue(
      `translations.en.${fieldKey}`,
      getValues(`translations.en.${fieldKey}`).filter((_, idx) => idx !== i),
    );
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest ml-1'>
          {label}
        </label>
        <button
          type='button'
          onClick={syncAppend}
          className='p-2 rounded-lg bg-purple-400 hover:bg-purple-500 text-white transition-colors cursor-pointer'
        >
          <Plus size={16} />
        </button>
      </div>
      <DndContext
        id={dndContextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortableItems}>
          <div className='space-y-2 rounded-xl bg-zinc-50/30 dark:bg-slate-800/50 p-3 min-h-[80px]'>
            {fields.map((field, i) => (
              <SortableArrayItem
                key={field.id}
                id={sortableItems[i]}
                lang={lang}
                fieldKey={fieldKey}
                index={i}
                control={control}
                onRemove={() => syncRemove(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
