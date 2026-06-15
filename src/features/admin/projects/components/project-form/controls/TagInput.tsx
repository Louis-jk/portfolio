'use client';

import { useState, useCallback, useEffect } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useMounted } from '@/hooks/useMounted';
import { useSortableSensors } from '@/features/admin/projects/lib/sortable-sensors';
import { StaticTag } from './StaticTag';
import { SortableTag } from './SortableTag';

type TagInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  addMorePlaceholder?: string;
};

export function TagInput({
  value,
  onChange,
  placeholder,
  addMorePlaceholder,
}: TagInputProps) {
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
  const sensors = useSortableSensors();

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
