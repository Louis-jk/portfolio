import { Globe, Laptop, Monitor, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { UseFormRegister } from 'react-hook-form';
import type { ProjectFormValues } from '@/types/project-form.type';

export function ProjectFormLinksSection({
  register,
  t,
}: {
  register: UseFormRegister<ProjectFormValues>;
  t: (key: string) => string;
}) {
  return (
    <Card className='p-8 space-y-6 border-none shadow-2xl shadow-zinc-100/50 dark:shadow-slate-900/50 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
      <h2 className='font-black text-xs uppercase tracking-widest text-purple-600'>
        {t('externalLinks')}
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
  );
}
