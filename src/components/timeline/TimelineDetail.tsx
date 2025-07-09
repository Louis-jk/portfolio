'use client';

import { motion } from 'framer-motion';
import { type TimelineItem } from '@/types/timeline.type';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaBuilding, FaPerson } from 'react-icons/fa6';

interface TimelineDetailProps {
  item: TimelineItem | null;
  isVisible: boolean;
}

export default function TimelineDetail({
  item,
  isVisible,
}: TimelineDetailProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations('timeline');

  if (!item || !item.details) {
    return (
      <div className='flex items-center justify-center h-full min-h-[500px]'>
        <div className='text-center'>
          <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
          </div>
          <p className='text-gray-500 dark:text-gray-400 text-lg font-medium'>
            Select a project to view details
          </p>
          <p className='text-gray-400 dark:text-gray-500 text-sm mt-2'>
            Click on any timeline item to see more information
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className='h-full overflow-y-auto'
    >
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h3 className='text-2xl font-bold mb-2'>{t(item.title)}</h3>

          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center gap-2'>
              <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center'>
                {item.company && (
                  <>
                    <FaBuilding className='inline-block w-3 h-3 mr-1' />
                    {t(item.company)}&nbsp;&nbsp;&nbsp;
                  </>
                )}
                {item.role && (
                  <>
                    <FaPerson className='inline-block w-3 h-3 mr-1' />
                    {t(item.role)}
                  </>
                )}
              </p>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {item.date}
            </p>
          </div>
        </div>

        {/* Image */}
        {item.details.image && (
          <div className='relative h-48 rounded-lg overflow-hidden mb-10'>
            <Image
              src={item.details.image}
              alt={item.title}
              className='w-full h-full object-cover'
              width={1000}
              height={1000}
              objectFit='contain'
            />
          </div>
        )}

        {/* Full Description */}
        <div>
          <h4 className='text-lg font-semibold mb-3'>Overview</h4>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            {t(item.details.fullDescription)}
          </p>
        </div>

        {/* Technologies */}
        <div>
          <h4 className='text-lg font-semibold mb-3'>Technologies</h4>
          <div className='flex flex-wrap gap-2'>
            {item.details.technologies.map((tech, index) => (
              <span
                key={index}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium',
                  resolvedTheme === 'dark'
                    ? 'bg-gray-700 text-gray-200'
                    : 'bg-gray-200 text-gray-800'
                )}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <h4 className='text-lg font-semibold mb-3'>Challenges</h4>
          <ul className='space-y-2'>
            {item.details.challenges.map((challenge, index) => (
              <li key={index} className='flex items-start'>
                <span className='text-red-500 mr-2 mt-1'>•</span>
                <span className='text-gray-700 dark:text-gray-300'>
                  {t(challenge)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Achievements */}
        <div>
          <h4 className='text-lg font-semibold mb-3'>Achievements</h4>
          <ul className='space-y-2'>
            {item.details.achievements.map((achievement, index) => (
              <li key={index} className='flex items-start'>
                <span className='text-green-500 mr-2 mt-1'>✓</span>
                <span className='text-gray-700 dark:text-gray-300'>
                  {t(achievement)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
