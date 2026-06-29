import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';

export function ProjectFormImageUpload({
  previewUrl,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemoveImage,
}: {
  previewUrl: string;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}) {
  return (
    <>
      <label className='text-[10px] font-black text-purple-600 uppercase ml-1 mb-0'>
        Project Assets
      </label>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative group aspect-[6/3] rounded-md overflow-hidden border-2 border-dashed transition-all duration-300 flex items-center justify-center
          ${isDragging ? 'border-purple-500 bg-blue-50 dark:bg-blue-900/30 scale-[1.02] shadow-inner' : 'border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-500'}
          ${previewUrl ? 'border-none' : ''}
        `}
      >
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt='Preview'
              fill
              className='object-cover'
              unoptimized
            />
            <button
              type='button'
              onClick={onRemoveImage}
              className='absolute top-2 right-2 bg-black/70 backdrop-blur-md p-2 rounded-full text-white shadow-xl hover:scale-110 transition-transform z-10 cursor-pointer'
              aria-label='Remove Image'
            >
              <X size={20} />
            </button>
            <div className='absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-md text-[10px] text-white font-bold uppercase tracking-widest'>
              Preview Mode
            </div>
          </>
        ) : (
          <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-zinc-100/50 dark:group-hover:bg-slate-700/50 transition-colors'>
            <ImagePlus
              className={`w-14 h-14 mb-4 transition-all duration-500 ${isDragging ? 'text-blue-500 scale-125 rotate-12' : 'text-zinc-200 dark:text-zinc-600'}`}
            />
            <p
              className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight transition-colors ${isDragging ? 'text-blue-600' : 'text-zinc-400 dark:text-zinc-500'}`}
            >
              {isDragging ? 'Drop Image Now' : 'Choose Image or Drag & Drop'}
              <br />
              <span className='text-zinc-300 dark:text-zinc-600 font-medium'>
                (Max 5MB)
              </span>
            </p>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={onFileChange}
            />
          </label>
        )}
      </div>
    </>
  );
}
