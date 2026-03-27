export default function ProjectDetailLoading() {
  return (
    <div className='max-w-4xl mx-auto p-8 space-y-6 animate-pulse'>
      <div className='flex gap-4 items-center'>
        <div className='h-48 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl' />
        <div className='flex-1 space-y-3'>
          <div className='h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded' />
          <div className='h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded' />
          <div className='h-4 w-full bg-slate-200 dark:bg-slate-800 rounded' />
        </div>
      </div>
      <div className='h-32 bg-slate-200 dark:bg-slate-800 rounded-xl' />
      <div className='h-48 bg-slate-200 dark:bg-slate-800 rounded-xl' />
    </div>
  );
}
