'use client';

import { Controller, type Control } from 'react-hook-form';
import {
  PLATFORM_CATEGORIES,
  DOMAIN_TAGS,
} from '@/lib/project-categories';
import type { ProjectFormValues } from '@/types/project-form.type';

function CategoryToggleGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type='button'
            onClick={() => {
              onChange(
                selected
                  ? value.filter((v) => v !== option)
                  : [...value, option],
              );
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              selected
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export function ProjectFormCategoryPicker({
  control,
}: {
  control: Control<ProjectFormValues>;
}) {
  return (
    <div className='space-y-4'>
      <div>
        <label className='text-[10px] font-black text-purple-600 uppercase ml-1 block mb-2'>
          플랫폼 (Web / Mobile / Desktop)
        </label>
        <Controller
          name='platformCategories'
          control={control}
          render={({ field }) => (
            <CategoryToggleGroup
              options={PLATFORM_CATEGORIES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
      <div>
        <label className='text-[10px] font-black text-purple-600 uppercase ml-1 block mb-2'>
          도메인/기술 태그 (Web3, Blockchain, AI)
        </label>
        <Controller
          name='domainTags'
          control={control}
          render={({ field }) => (
            <CategoryToggleGroup
              options={DOMAIN_TAGS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
