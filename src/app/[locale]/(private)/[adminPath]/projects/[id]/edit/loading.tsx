export default function ProjectEditLoading() {
  return (
    <div className='max-w-7xl mx-auto p-8 space-y-10 animate-pulse'>
      <div className='flex justify-between border-b border-zinc-100 dark:border-slate-800 pb-8'>
        <div className='h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded' />
        <div className='h-14 w-48 bg-slate-200 dark:bg-slate-800 rounded-full' />
      </div>
      <div className='space-y-6'>
        <div className='h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-xl' />
        <div className='h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-xl' />
        <div className='h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-xl' />
      </div>
    </div>
  );
}
