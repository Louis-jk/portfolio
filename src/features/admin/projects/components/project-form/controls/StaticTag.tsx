import { GripVertical, X } from 'lucide-react';

export function StaticTag({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove: () => void;
}) {
  return (
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-slate-700 shadow-sm'>
      <GripVertical size={14} className='text-zinc-400 shrink-0' />
      {tag}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='p-0.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors'
      >
        <X size={14} />
      </button>
    </span>
  );
}
