'use client';

import {
  type Control,
  type UseFormRegister,
  type UseFormWatch,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import type { ProjectFormValues } from '@/types/project-form.type';
import { TagInput } from './controls/TagInput';
import { ProjectFormImageUpload } from './ProjectFormImageUpload';
import { ProjectFormVisibilityToggle } from './ProjectFormVisibilityToggle';
import { ProjectFormCategoryPicker } from './ProjectFormCategoryPicker';
import { ProjectFormToolsSection } from './ProjectFormToolsSection';
import { ProjectFormLinksSection } from './ProjectFormLinksSection';

type ProjectFormSidebarProps = {
  register: UseFormRegister<ProjectFormValues>;
  control: Control<ProjectFormValues>;
  watch: UseFormWatch<ProjectFormValues>;
  t: (key: string) => string;
  previewUrl: string;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
};

export function ProjectFormSidebar({
  register,
  control,
  watch,
  t,
  previewUrl,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemoveImage,
}: ProjectFormSidebarProps) {
  return (
    <div className='col-span-12 lg:col-span-4 space-y-8'>
      <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
              {t('startDate')}
            </label>
            <input
              aria-label='Start Date'
              type='date'
              required
              {...register('startDate', { required: true })}
              className='w-full p-3 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
              {t('endDate')}
            </label>
            <input
              aria-label='End Date'
              type='date'
              {...register('endDate')}
              className='w-full p-3 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100'
            />
          </div>
        </div>

        <ProjectFormImageUpload
          previewUrl={previewUrl}
          isDragging={isDragging}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onFileChange={onFileChange}
          onRemoveImage={onRemoveImage}
        />

        <ProjectFormVisibilityToggle control={control} watch={watch} t={t} />
        <ProjectFormCategoryPicker control={control} />

        <div className='space-y-1'>
          <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
            {t('technologies')}
          </label>
          <Controller
            name='technologies'
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                placeholder={t('technologiesPlaceholder')}
                addMorePlaceholder={t('addAfterCommaOrEnter')}
              />
            )}
          />
        </div>
      </Card>

      <ProjectFormToolsSection control={control} t={t} />
      <ProjectFormLinksSection register={register} t={t} />
    </div>
  );
}
