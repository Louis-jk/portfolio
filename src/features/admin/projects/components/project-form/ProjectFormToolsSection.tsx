'use client';

import { Controller, type Control } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import type { ProjectFormValues } from '@/types/project-form.type';
import { TagInput } from './controls/TagInput';

const TOOL_FIELDS = [
  ['tools.development', 'Development', 'toolsDevelopmentPlaceholder'],
  ['tools.communication', 'Communication', 'toolsCommunicationPlaceholder'],
  ['tools.design', 'Design', 'toolsDesignPlaceholder'],
  ['tools.debugging', 'Debugging', 'toolsDebuggingPlaceholder'],
] as const;

export function ProjectFormToolsSection({
  control,
  t,
}: {
  control: Control<ProjectFormValues>;
  t: (key: string) => string;
}) {
  return (
    <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
      <h2 className='font-black text-xs uppercase tracking-widest text-purple-600'>
        Tools & Stack
      </h2>
      <div className='space-y-4'>
        {TOOL_FIELDS.map(([name, label, placeholderKey]) => (
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
  );
}
