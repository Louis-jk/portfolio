'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMounted } from '@/hooks/useMounted';
import {
  useFieldArray,
  type Control,
  type UseFormSetValue,
  type UseFormGetValues,
} from 'react-hook-form';
import { Plus, GripVertical, X } from 'lucide-react';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ProjectFormValues } from '@/types/project-form.type';

type ArrayFieldKey = 'description' | 'challenges' | 'achievements';

function SortableArrayItem({
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
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

function StaticTag({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  return (
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-slate-700 shadow-sm'>
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

function SortableTag({
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 border shadow-sm cursor-grab active:cursor-grabbing touch-none ${
        isDragging ? 'opacity-50 border-blue-400 z-50' : 'border-zinc-200 dark:border-slate-700'
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

export function TagInput({
  value,
  onChange,
  placeholder,
  addMorePlaceholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  addMorePlaceholder?: string;
}) {
  const parseToTags = useCallback(
    (s: string) =>
      s
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    [],
  );

  const [tags, setTags] = useState<string[]>(() => parseToTags(value));
  const [inputValue, setInputValue] = useState('');
  const mounted = useMounted();

  useEffect(() => {
    const parsed = parseToTags(value);
    setTags((prev) =>
      JSON.stringify(parsed) !== JSON.stringify(prev) ? parsed : prev,
    );
  }, [value, parseToTags]);

  const syncToForm = useCallback(
    (newTags: string[]) => {
      setTags(newTags);
      onChange(newTags.join(', '));
    },
    [onChange],
  );

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (trimmed) {
      syncToForm([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (i: number) => {
    syncToForm(tags.filter((_, idx) => idx !== i));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) addTag(inputValue);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tags.findIndex((_, i) => String(i) === active.id);
      const newIndex = tags.findIndex((_, i) => String(i) === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        syncToForm(arrayMove(tags, oldIndex, newIndex));
      }
    }
  };

  const tagsContent = (
    <div className='flex flex-wrap gap-2 mb-2'>
      {tags.map((tag, i) =>
        mounted ? (
          <SortableTag
            key={`${tag}-${i}`}
            id={String(i)}
            tag={tag}
            onRemove={() => removeTag(i)}
          />
        ) : (
          <StaticTag
            key={`${tag}-${i}`}
            tag={tag}
            onRemove={() => removeTag(i)}
          />
        ),
      )}
    </div>
  );

  return (
    <div className='min-h-[140px] p-4 bg-zinc-50 dark:bg-slate-800 rounded-xl border border-transparent focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/50 focus-within:border-blue-200 dark:focus-within:border-slate-600 transition-shadow'>
      {mounted ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tags.map((_, i) => String(i))}
            strategy={rectSortingStrategy}
          >
            {tagsContent}
          </SortableContext>
        </DndContext>
      ) : (
        tagsContent
      )}
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={
          tags.length === 0 ? placeholder : (addMorePlaceholder ?? placeholder)
        }
        className='w-full min-h-[48px] p-2 bg-transparent border-none resize-none text-xs outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-slate-900 dark:text-slate-100'
        rows={3}
      />
    </div>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const dndContextId = `array-${fieldKey}-${lang}`;
  const sortableItems = fields.map((_, i) => `${dndContextId}-${i}`);

  const syncMove = (fromIndex: number, toIndex: number) => {
    move(fromIndex, toIndex);
    const jaArr = getValues(`translations.ja.${fieldKey}`);
    const enArr = getValues(`translations.en.${fieldKey}`);
    const jaMoved = arrayMove(jaArr, fromIndex, toIndex);
    const enMoved = arrayMove(enArr, fromIndex, toIndex);
    setValue(`translations.ja.${fieldKey}`, jaMoved);
    setValue(`translations.en.${fieldKey}`, enMoved);
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
    const jaArr = getValues(`translations.ja.${fieldKey}`).filter(
      (_, idx) => idx !== i,
    );
    const enArr = getValues(`translations.en.${fieldKey}`).filter(
      (_, idx) => idx !== i,
    );
    setValue(`translations.ja.${fieldKey}`, jaArr);
    setValue(`translations.en.${fieldKey}`, enArr);
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
