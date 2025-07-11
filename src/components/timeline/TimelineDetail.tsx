'use client';

import { motion } from 'framer-motion';
import { type TimelineItem } from '@/types/timeline.type';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaBuilding } from 'react-icons/fa6';
import { FaExternalLinkAlt, FaGooglePlay, FaDesktop } from 'react-icons/fa';
import { IoLogoAppleAppstore } from 'react-icons/io5';
import { TbBrowserShare } from 'react-icons/tb';

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

  const webLink =
    item &&
    !item.isNDA &&
    item.isCommercial &&
    item.commercialPlatforms.web &&
    item.commercialLinks.web;
  const iosLink =
    item &&
    !item.isNDA &&
    item.isCommercial &&
    item.commercialPlatforms.mobile &&
    item.commercialLinks.ios;
  const androidLink =
    item &&
    !item.isNDA &&
    item.isCommercial &&
    item.commercialPlatforms.mobile &&
    item.commercialLinks.android;
  const desktopLink =
    item &&
    !item.isNDA &&
    item.isCommercial &&
    item.commercialPlatforms.desktop &&
    item.commercialLinks.desktop;

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
      className='h-full overflow-y-auto flex flex-col gap-7'
    >
      <div>
        {/* Header */}
        <div>
          <h3 className='text-2xl font-bold mb-2'>{t(item.title)}</h3>

          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2 justify-between w-full'>
              {item.company && (
                <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center'>
                  <FaBuilding className='inline-block w-3 h-3 mr-1' />
                  {t(item.company)}&nbsp;&nbsp;&nbsp;
                </p>
              )}
              <p
                className={cn(
                  'text-sm text-gray-600 dark:text-gray-400',
                  !item.company && 'ml-auto'
                )}
              >
                {t(item.region)}
              </p>
            </div>

            <div className='flex items-center gap-2 justify-between'>
              {item.role && (
                <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center'>
                  {t(item.role)}
                </p>
              )}
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {t(item.date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      {item.details.image && (
        <div className='relative rounded-sm overflow-hidden'>
          <Image
            src={item.details.image}
            alt={item.title}
            className='w-full h-full object-contain select-none pointer-events-none'
            width={1000}
            height={1000}
            objectFit='contain'
          />
        </div>
      )}

      {/* Full Description */}
      <div>
        {!item.isNDA && item.isCommercial && (
          <div className='mb-5 flex'>
            {webLink && (
              <a
                href={item.commercialLinks.web}
                target='_blank'
                rel='noopener noreferrer'
                className='mr-5'
              >
                <div className='flex items-center gap-1'>
                  <TbBrowserShare className='w-3 h-3 text-purple-500' />
                  <span className='text-sm underline text-purple-500'>
                    Website
                  </span>
                </div>
              </a>
            )}
            {iosLink && (
              <a
                href={item.commercialLinks.ios}
                target='_blank'
                rel='noopener noreferrer'
                className='mr-5'
              >
                <div className='flex items-center gap-1'>
                  <IoLogoAppleAppstore className='w-3 h-3 text-purple-500' />
                  <span className='text-sm underline text-purple-500'>
                    App Store
                  </span>
                </div>
              </a>
            )}
            {androidLink && (
              <a
                href={item.commercialLinks.android}
                target='_blank'
                rel='noopener noreferrer'
                className='mr-5'
              >
                <div className='flex items-center gap-1'>
                  <FaGooglePlay className='w-3 h-3 text-purple-500' />
                  <span className='text-sm underline text-purple-500'>
                    Google Play
                  </span>
                </div>
              </a>
            )}
            {desktopLink && (
              <a
                href={item.commercialLinks.desktop}
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='flex items-center gap-1'>
                  <FaDesktop className='w-3 h-3 text-purple-500' />
                  <span className='text-sm underline text-purple-500'>
                    Desktop
                  </span>
                </div>
              </a>
            )}
          </div>
        )}

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
    </motion.div>
  );
}
