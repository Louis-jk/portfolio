'use client';

import { AdminVisibilityBadge } from '@/features/admin/projects/components/shared/AdminVisibilityBadge';

type StoryEditorVisibilityToggleProps = {
  isPublic: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
  publicDesc: string;
  privateDesc: string;
  publicAria: string;
  privateAria: string;
};

export function StoryEditorVisibilityToggle({
  isPublic,
  onChange,
  disabled = false,
  label,
  publicDesc,
  privateDesc,
  publicAria,
  privateAria,
}: StoryEditorVisibilityToggleProps) {
  return (
    <div className='flex min-w-[220px] flex-col gap-1 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/60'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <span className='text-[11px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-200'>
            {label}
          </span>
          <AdminVisibilityBadge isPublic={isPublic} />
        </div>
        <button
          type='button'
          role='switch'
          aria-checked={isPublic}
          disabled={disabled}
          onClick={() => onChange(!isPublic)}
          className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isPublic
              ? 'border-purple-600 bg-purple-600'
              : 'border-zinc-200 bg-zinc-200 dark:border-slate-600 dark:bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
              isPublic ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
          <span className='sr-only'>
            {isPublic ? publicAria : privateAria}
          </span>
        </button>
      </div>
      <p className='text-[11px] leading-snug text-zinc-500 dark:text-zinc-400'>
        {isPublic ? publicDesc : privateDesc}
      </p>
    </div>
  );
}
