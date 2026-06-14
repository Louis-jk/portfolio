import Image from 'next/image';

export function ProjectListItemThumbnail({ imageUrl }: { imageUrl: string }) {
  return (
    <div className='w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0'>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt='Project thumbnail'
          className='w-full h-full object-cover'
          width={96}
          height={96}
          unoptimized
        />
      ) : (
        <div className='w-full h-full flex items-center justify-center text-[10px] text-zinc-400 dark:text-zinc-500'>
          NO IMAGE
        </div>
      )}
    </div>
  );
}
