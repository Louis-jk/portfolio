'use client';

import {
  type Control,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import type { ProjectFormValues } from '@/types/project-form.type';
import { ArrayField } from './controls/ArrayField';

type ProjectFormTranslationsProps = {
  defaultLocale: 'ko' | 'ja' | 'en';
  register: UseFormRegister<ProjectFormValues>;
  control: Control<ProjectFormValues>;
  setValue: UseFormSetValue<ProjectFormValues>;
  getValues: UseFormGetValues<ProjectFormValues>;
};

export function ProjectFormTranslations({
  defaultLocale,
  register,
  control,
  setValue,
  getValues,
}: ProjectFormTranslationsProps) {
  return (
    <div className='col-span-12 lg:col-span-8'>
      <Tabs defaultValue={defaultLocale} className='w-full gap-0'>
        <TabsList className='w-full grid grid-cols-3 bg-purple-600 rounded-xs backdrop-blur-md h-10!'>
          {(
            [
              ['ko', '한국어'],
              ['ja', '日本語'],
              ['en', 'English'],
            ] as const
          ).map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className='rounded-xs font-black text-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg text-white hover:text-white data-[state=active]:hover:text-black dark:data-[state=active]:hover:text-white cursor-pointer'
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {(['ko', 'ja', 'en'] as const).map((lang) => (
          <TabsContent
            key={lang}
            value={lang}
            className='mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700'
          >
            <Card className='p-12 space-y-10 border-none shadow-2xl shadow-zinc-100/80 dark:shadow-slate-900/50 rounded-xs bg-white dark:bg-slate-900'>
              <div className='space-y-2'>
                <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                  Project Title
                </label>
                <div className='mt-2'>
                  <textarea
                    {...register(`translations.${lang}.title`)}
                    placeholder='Amazing Project Name'
                    rows={2}
                    className='w-full text-2xl leading-4xl font-black border-none outline-none focus:ring-0 placeholder:text-zinc-100 dark:placeholder:text-zinc-500 tracking-tighter bg-transparent resize-none overflow-y-auto break-words text-slate-900 dark:text-slate-100'
                  />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-6 border-t border-zinc-300 dark:border-slate-700 pt-5'>
                {(
                  [
                    ['company', 'Client/Company', 'Client Name'],
                    ['role', 'Your Role', 'Full-Stack Dev'],
                    ['region', 'Region', 'Seoul, Korea'],
                  ] as const
                ).map(([field, label, placeholder]) => (
                  <div key={field} className='space-y-2'>
                    <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                      {label}
                    </label>
                    <input
                      {...register(`translations.${lang}.${field}`)}
                      placeholder={placeholder}
                      className='w-full p-4 bg-zinc-50 dark:bg-slate-800 border-none rounded-xs text-sm text-slate-900 dark:text-slate-100'
                    />
                  </div>
                ))}
              </div>

              <div className='space-y-2'>
                <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                  Overview
                </label>
                <textarea
                  {...register(`translations.${lang}.overview`)}
                  className='w-full h-48 p-6 bg-zinc-50 dark:bg-slate-800 rounded-xs border-none resize-none focus:ring-2 ring-blue-50/50 dark:ring-blue-900/30 transition-all text-black dark:text-slate-100 leading-relaxed'
                  placeholder='프로젝트 개요를 작성해 주세요.'
                />
              </div>

              {(
                [
                  ['description', 'Description'],
                  ['challenges', 'Challenges'],
                  ['achievements', 'Achievements'],
                ] as const
              ).map(([fieldKey, label]) => (
                <ArrayField
                  key={fieldKey}
                  lang={lang}
                  fieldKey={fieldKey}
                  label={label}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                />
              ))}

              <div className='space-y-2'>
                <label className='text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1'>
                  Detail Image URL (선택)
                </label>
                <input
                  {...register(`translations.${lang}.detailImage`)}
                  placeholder='https://...'
                  className='w-full p-4 bg-zinc-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-slate-100'
                />
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
