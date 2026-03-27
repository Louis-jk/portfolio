export default function ProjectsLoading() {
  return (
    <div className='max-w-6xl mx-auto p-6 space-y-8 animate-pulse'>
      <div className='flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6'>
        <div>
          <div className='h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-2' />
          <div className='h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded' />
        </div>
        <div className='h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-full' />
      </div>
      <div className='grid grid-cols-1 gap-4'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='h-28 bg-slate-200 dark:bg-slate-800 rounded-xl'
          />
        ))}
      </div>
    </div>
  );
}
