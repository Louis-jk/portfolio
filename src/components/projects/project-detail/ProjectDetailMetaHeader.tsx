'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { FaBuilding } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import type { ProjectView } from '@/modules/projects';
import { formatProjectDateRange } from '@/modules/projects';
import ProjectCategoryBadges from '../ProjectCategoryBadges';

type ProjectDetailMetaHeaderProps = {
  item: ProjectView;
  isVisible: boolean;
  sticky: boolean;
  isDesktopOrLaptop: boolean;
};

export default function ProjectDetailMetaHeader({
  item,
  isVisible,
  sticky,
  isDesktopOrLaptop,
}: ProjectDetailMetaHeaderProps) {
  const locale = useLocale();

  return (
    <div
      className={cn(
        sticky &&
          'sticky top-0 z-10 bg-white dark:bg-[#0a0a0a] py-3 -mx-4 px-4 border-b border-gray-200 dark:border-gray-800',
      )}
    >
      <ProjectCategoryBadges project={item} className='mb-2' />
      <motion.h3
        id='detail-project-title'
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn('text-2xl font-bold mb-2', !isDesktopOrLaptop && 'mt-0')}
      >
        {item.title}
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='flex flex-col gap-1'
      >
        <div className='flex items-center gap-2 justify-between w-full'>
          {item.company && (
            <p className='text-sm text-gray-900 dark:text-gray-200 flex items-center flex-8'>
              <FaBuilding className='inline-block w-3 h-3 mr-1' />
              {item.company}&nbsp;&nbsp;&nbsp;
            </p>
          )}
          <p
            className={cn(
              'text-sm text-gray-900 dark:text-gray-200 flex-4 text-right',
              !item.company && 'ml-auto',
            )}
          >
            {item.region}
          </p>
        </div>

        <div className='flex items-center gap-2 justify-between'>
          {item.role && (
            <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center whitespace-pre-line flex-7'>
              {item.role}
            </p>
          )}
          <p className='text-sm text-gray-600 dark:text-gray-400 flex-5 text-right'>
            {formatProjectDateRange(item, locale)}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
