'use client';

import Image from 'next/image';
import {
  Controller,
  type Control,
  type UseFormRegister,
  type UseFormWatch,
} from 'react-hook-form';
import {
  Globe,
  ImagePlus,
  Laptop,
  Monitor,
  Smartphone,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PLATFORM_CATEGORIES,
  DOMAIN_TAGS,
} from '@/lib/project-categories';
import type { ProjectFormValues } from '@/types/project-form.type';
import { TagInput } from './project-form-controls';

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
              Start Date
            </label>
            <input
              type='date'
              required
              {...register('startDate', { required: true })}
              className='w-full p-3 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
              End Date
            </label>
            <input
              type='date'
              {...register('endDate')}
              className='w-full p-3 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100'
            />
          </div>
        </div>

        <label className='text-[10px] font-black text-purple-600 uppercase ml-1 mb-0'>
          Project Assets
        </label>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
                relative group aspect-[6/3] rounded-md overflow-hidden border-2 border-dashed transition-all duration-300 flex items-center justify-center
                ${isDragging ? 'border-purple-500 bg-blue-50 dark:bg-blue-900/30 scale-[1.02] shadow-inner' : 'border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-500'}
                ${previewUrl ? 'border-none' : ''}
              `}
        >
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt='Preview'
                fill
                className='object-cover'
                unoptimized
              />
              <button
                type='button'
                onClick={onRemoveImage}
                className='absolute top-2 right-2 bg-black/70 backdrop-blur-md p-2 rounded-full text-white shadow-xl hover:scale-110 transition-transform z-10 cursor-pointer'
              >
                <X size={20} />
              </button>
              <div className='absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-md text-[10px] text-white font-bold uppercase tracking-widest'>
                Preview Mode
              </div>
            </>
          ) : (
            <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-zinc-100/50 dark:group-hover:bg-slate-700/50 transition-colors'>
              <ImagePlus
                className={`w-14 h-14 mb-4 transition-all duration-500 ${isDragging ? 'text-blue-500 scale-125 rotate-12' : 'text-zinc-200 dark:text-zinc-600'}`}
              />
              <p
                className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight transition-colors ${isDragging ? 'text-blue-600' : 'text-zinc-400 dark:text-zinc-500'}`}
              >
                {isDragging
                  ? 'Drop Image Now'
                  : 'Choose Image or Drag & Drop'}
                <br />
                <span className='text-zinc-300 dark:text-zinc-600 font-medium'>
                  (Max 5MB)
                </span>
              </p>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={onFileChange}
              />
            </label>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <label className='text-[12px] font-black text-black dark:text-white uppercase tracking-widest'>
              {t('visibilityLabel')}
            </label>
            {watch('isPublic') ? (
              <Badge className='bg-indigo-600 text-white border-none py-1 px-2'>
                PUBLIC
              </Badge>
            ) : (
              <Badge
                variant='outline'
                className='bg-red-700 text-white border-none py-1 px-2'
              >
                PRIVATE
              </Badge>
            )}
          </div>
          <Controller
            name='isPublic'
            control={control}
            render={({ field }) => (
              <button
                type='button'
                role='switch'
                aria-checked={field.value}
                onClick={() => field.onChange(!field.value)}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  field.value
                    ? 'border-purple-600 bg-purple-600'
                    : 'border-zinc-200 dark:border-slate-600 bg-zinc-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    field.value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
                <span className='sr-only'>
                  {field.value ? t('publicProject') : t('confidentialProject')}
                </span>
              </button>
            )}
          />
        </div>
        <p className='text-[12px] text-black dark:text-zinc-300 -mt-8'>
          {watch('isPublic') ? t('publicProjectDesc') : t('confidentialProjectDesc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='text-[10px] font-black text-purple-600 uppercase ml-1 block mb-2'>
              플랫폼 (Web / Mobile / Desktop)
            </label>
            <Controller
              name='platformCategories'
              control={control}
              render={({ field }) => (
                <div className='flex flex-wrap gap-2'>
                  {PLATFORM_CATEGORIES.map((cat) => {
                    const selected = field.value.includes(cat);
                    return (
                      <button
                        key={cat}
                        type='button'
                        onClick={() => {
                          const next = selected
                            ? field.value.filter((v) => v !== cat)
                            : [...field.value, cat];
                          field.onChange(next);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          selected
                            ? 'bg-purple-600 text-white'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {cat.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
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
                <div className='flex flex-wrap gap-2'>
                  {DOMAIN_TAGS.map((tag) => {
                    const selected = field.value.includes(tag);
                    return (
                      <button
                        key={tag}
                        type='button'
                        onClick={() => {
                          const next = selected
                            ? field.value.filter((v) => v !== tag)
                            : [...field.value, tag];
                          field.onChange(next);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          selected
                            ? 'bg-purple-600 text-white'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {tag.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>

        <div className='space-y-1'>
          <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
            Technologies
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

      <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
        <h2 className='font-black text-xs uppercase tracking-widest text-purple-600'>
          Tools & Stack
        </h2>
        <div className='space-y-4'>
          {(
            [
              ['tools.development', 'Development', 'toolsDevelopmentPlaceholder'],
              ['tools.communication', 'Communication', 'toolsCommunicationPlaceholder'],
              ['tools.design', 'Design', 'toolsDesignPlaceholder'],
              ['tools.debugging', 'Debugging', 'toolsDebuggingPlaceholder'],
            ] as const
          ).map(([name, label, placeholderKey]) => (
            <div key={name} className='space-y-1'>
              <label className='text-[10px] font-black text-purple-600 uppercase ml-1'>
                {label}
              </label>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t(placeholderKey)}
                    addMorePlaceholder={t('addAfterCommaOrEnter')}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
        <h2 className='font-black text-xs uppercase tracking-widest text-purple-600'>
          External Links
        </h2>
        <div className='space-y-4'>
          {(
            [
              ['platforms.webLink', 'Website URL', Globe],
              ['platforms.iosLink', 'App Store', Laptop],
              ['platforms.androidLink', 'Play Store', Smartphone],
              ['platforms.desktopLink', 'Desktop App URL', Monitor],
            ] as const
          ).map(([name, placeholder, Icon]) => (
            <div
              key={name}
              className='flex items-center gap-3 bg-zinc-50 dark:bg-slate-800 p-1.5 rounded-2xl'
            >
              <div className='bg-white p-2.5 rounded-xl shadow-sm'>
                <Icon size={16} className='text-zinc-400 dark:text-zinc-500' />
              </div>
              <input
                {...register(name)}
                placeholder={placeholder}
                className='flex-1 bg-transparent border-none text-xs outline-none'
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
