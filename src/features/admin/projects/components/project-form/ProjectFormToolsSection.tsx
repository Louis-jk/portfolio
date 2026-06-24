'use client';

import { Controller, type Control } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import type { ProjectFormValues } from '@/types/project-form.type';
import { TagInput } from './controls/TagInput';

type ProjectFormToolsSectionProps = {
  control: Control<ProjectFormValues>;
  t: (key: string) => string;
};

export function ProjectFormToolsSection({
  control,
  t,
}: ProjectFormToolsSectionProps) {
  const TOOL_FIELDS = [
    ['tools.development', t('development'), t('toolsDevelopmentPlaceholder')],
    [
      'tools.communication',
      t('communication'),
      t('toolsCommunicationPlaceholder'),
    ],
    ['tools.design', t('design'), t('toolsDesignPlaceholder')],
    ['tools.debugging', t('debugging'), t('toolsDebuggingPlaceholder')],
  ] as const satisfies ReadonlyArray<[string, string, string]>;

  return (
    <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
      <h2 className='font-black text-xs uppercase tracking-widest text-purple-600'>
        {t('toolsAndStack')}
      </h2>
      <div className='space-y-4'>
        {TOOL_FIELDS.map(([name, label, placeholder]) => (
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
                  placeholder={placeholder}
                  addMorePlaceholder={t('addAfterCommaOrEnter')}
                />
              )}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
