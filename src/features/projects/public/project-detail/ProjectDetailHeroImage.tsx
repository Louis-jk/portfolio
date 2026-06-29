'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { detailSectionMotion } from '@/entities/projects/lib/detail-motion';

type ProjectDetailHeroImageProps = {
  imageUrl: string;
  title: string;
  isVisible: boolean;
  onLoad?: () => void;
};

export default function ProjectDetailHeroImage({
  imageUrl,
  title,
  isVisible,
  onLoad,
}: ProjectDetailHeroImageProps) {
  const tL = useTranslations('loading');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <motion.div
      {...detailSectionMotion(isVisible, 0.6)}
      className='relative w-full aspect-[1200/579]'
    >
      {!imageLoaded && (
        <div className='absolute inset-0 rounded-sm flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <div className='relative flex items-center justify-center'>
              <div className='w-12 h-12 border-4 border-purple-200 dark:border-purple-800 rounded-full' />
              <div className='absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin' />
              <div
                className='absolute top-2 left-2 w-8 h-8 border-2 border-transparent border-b-purple-400 rounded-full animate-spin'
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '1.5s',
                }}
              />
            </div>
            <p className='text-sm text-purple-600 dark:text-purple-400 font-medium text-center'>
              {tL('image')}
            </p>
          </div>
        </div>
      )}

      <Image
        key={imageUrl}
        src={imageUrl}
        alt={title}
        className={cn(
          'object-contain rounded-sm select-none pointer-events-none w-full h-full mx-auto transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0',
        )}
        width={1200}
        height={579}
        onLoad={() => {
          setImageLoaded(true);
          onLoad?.();
        }}
        priority
        unoptimized={imageUrl.endsWith('.gif')}
      />
    </motion.div>
  );
}
