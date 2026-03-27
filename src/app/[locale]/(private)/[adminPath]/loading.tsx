export default function AdminLoading() {
  return (
    <div className='space-y-6 animate-pulse'>
      <div className='h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded' />
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='h-28 bg-slate-200 dark:bg-slate-800 rounded-xl'
          />
        ))}
      </div>
      <div className='h-64 bg-slate-200 dark:bg-slate-800 rounded-xl' />
    </div>
  );
}
