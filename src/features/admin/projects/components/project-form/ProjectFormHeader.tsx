import { Loader2, Send } from 'lucide-react';

export function ProjectFormHeader({
  projectId,
  isSubmitting,
  isProcessing,
  submitPhase,
}: {
  projectId?: number;
  isSubmitting: boolean;
  isProcessing: boolean;
  submitPhase: 'idle' | 'uploading' | 'saving';
}) {
  return (
    <header className='flex justify-between items-end border-b border-zinc-100 dark:border-slate-800 pb-8'>
      <div>
        <h1 className='text-5xl font-black tracking-tighter text-zinc-900 dark:text-slate-100 uppercase'>
          Project{' '}
          <span className='text-purple-600'>
            {projectId ? 'Edit' : 'Registration'}
          </span>
        </h1>
      </div>
      <button
        type='submit'
        disabled={isSubmitting || isProcessing}
        className='bg-purple-600 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-purple-600 disabled:bg-zinc-300 dark:disabled:bg-slate-600 transition-all shadow-2xl flex items-center gap-3 active:scale-95 cursor-pointer'
      >
        {isProcessing || isSubmitting ? (
          <Loader2 className='animate-spin' />
        ) : (
          <Send size={20} />
        )}
        {submitPhase === 'uploading'
          ? 'UPLOADING...'
          : submitPhase === 'saving' || isSubmitting
            ? 'SAVING...'
            : projectId
              ? 'UPDATE PROJECT'
              : 'DEPLOY PROJECT'}
      </button>
    </header>
  );
}
