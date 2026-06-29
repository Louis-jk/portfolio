'use client';

import { Controller, type Control, type UseFormWatch } from 'react-hook-form';
import { AdminVisibilityBadge } from '../shared/AdminVisibilityBadge';
import type { ProjectFormValues } from '@/types/project-form.type';

export function ProjectFormVisibilityToggle({
  control,
  watch,
  t,
}: {
  control: Control<ProjectFormValues>;
  watch: UseFormWatch<ProjectFormValues>;
  t: (key: string) => string;
}) {
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <label className='text-[12px] font-black text-black dark:text-white uppercase tracking-widest'>
            {t('visibilityLabel')}
          </label>
          <AdminVisibilityBadge isPublic={watch('isPublic')} />
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
    </>
  );
}
