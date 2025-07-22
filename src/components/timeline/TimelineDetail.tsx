'use client';

import { motion } from 'framer-motion';
import { type TimelineItem } from '@/types/timeline.type';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaBuilding } from 'react-icons/fa6';
import { FaGooglePlay, FaDesktop } from 'react-icons/fa';
import { IoLogoAppleAppstore } from 'react-icons/io5';
import { TbBrowserShare } from 'react-icons/tb';
import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useMediaQuery } from 'react-responsive';
import { Button } from '../ui/button';

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
  const tD = useTranslations('details');
  const [imageLoaded, setImageLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  });

  // 이미지가 변경될 때마다 로딩 상태를 리셋
  useEffect(() => {
    setImageLoaded(false);
  }, [item?.details?.image]);

  // Lenis 초기화
  useEffect(() => {
    if (!scrollRef.current || window.innerWidth < 1024) return;

    lenisRef.current = new Lenis({
      wrapper: scrollRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [item]);

  // item 변경 시 Lenis로 스크롤 위치 초기화
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [item]);

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
    <div className='flex flex-col h-full'>
      {/* PC에서만 보이는 제목 - 스크롤되지 않음 */}

      {isDesktopOrLaptop && (
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100 mt-6'>
          <p>{t('details.title')}</p>
        </h2>
      )}

      {/* PC에서만 스크롤 가능한 컨테이너 */}
      <div
        ref={scrollRef}
        className='pr-2 h-[calc(100vh-14rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col gap-7 pb-4'
        >
          <div>
            {/* Header */}
            <div>
              <h3 className='text-2xl font-bold mb-2'>{t(item.title)}</h3>

              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2 justify-between w-full'>
                  {item.company && (
                    <p className='text-sm text-gray-900 dark:text-gray-200 flex items-center'>
                      <FaBuilding className='inline-block w-3 h-3 mr-1' />
                      {t(item.company)}&nbsp;&nbsp;&nbsp;
                    </p>
                  )}
                  <p
                    className={cn(
                      'text-sm text-gray-900 dark:text-gray-200',
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
              {/* 로딩 스켈레톤 */}
              {!imageLoaded && (
                <div className='w-full h-[300px] rounded-sm flex items-center justify-center'>
                  <div className='flex flex-col items-center gap-4'>
                    {/* 옵션 1: 더블 링 스피너 */}
                    <div className='relative'>
                      <div className='w-12 h-12 border-4 border-purple-200 dark:border-purple-800 rounded-full'></div>
                      <div className='absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin'></div>
                      <div
                        className='absolute top-2 left-2 w-8 h-8 border-2 border-transparent border-b-purple-400 rounded-full animate-spin'
                        style={{
                          animationDirection: 'reverse',
                          animationDuration: '1.5s',
                        }}
                      ></div>
                    </div>

                    <p className='text-sm text-purple-600 dark:text-purple-400 font-medium'>
                      Loading image...
                    </p>
                  </div>
                </div>
              )}

              <Image
                key={item.details.image} // 이미지가 변경될 때마다 컴포넌트를 새로 렌더링
                src={item.details.image}
                alt={item.title}
                className={cn(
                  'w-full h-auto object-contain select-none pointer-events-none transition-opacity duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                width={1200}
                height={579}
                onLoad={() => setImageLoaded(true)}
                priority={true} // 우선순위 로딩
              />
            </div>
          )}

          {/* Full Description */}
          <div>
            {!item.isNDA && item.isCommercial && (
              <div className='mb-5 flex gap-2'>
                {webLink && (
                  <Button
                    variant='default'
                    className='px-2 py-1 dark:border-purple-500 bg-purple-700 dark:bg-purple-500 text-white hover:bg-purple-800 dark:hover:bg-purple-600 cursor-pointer transition-colors duration-200'
                    size='sm'
                    onClick={() => {
                      window.open(item.commercialLinks.web, '_blank');
                    }}
                  >
                    <div className='flex items-center gap-1'>
                      <TbBrowserShare className='w-3 h-3' />
                      <span>Website</span>
                    </div>
                  </Button>
                )}
                {iosLink && (
                  <Button
                    variant='default'
                    className='px-2 py-1 dark:border-purple-500 bg-purple-700 dark:bg-purple-500 text-white hover:bg-purple-800 dark:hover:bg-purple-600 cursor-pointer transition-colors duration-200'
                    size='sm'
                    onClick={() => {
                      window.open(item.commercialLinks.ios, '_blank');
                    }}
                  >
                    <div className='flex items-center gap-1'>
                      <IoLogoAppleAppstore className='w-3 h-3' />
                      <span>App Store</span>
                    </div>
                  </Button>
                )}
                {androidLink && (
                  <Button
                    variant='default'
                    className='px-2 py-1 dark:border-purple-500 bg-purple-700 dark:bg-purple-500 text-white hover:bg-purple-800 dark:hover:bg-purple-600 cursor-pointer transition-colors duration-200'
                    size='sm'
                    onClick={() => {
                      window.open(item.commercialLinks.android, '_blank');
                    }}
                  >
                    <div className='flex items-center gap-1'>
                      <FaGooglePlay className='w-3 h-3' />
                      <span>Google Play</span>
                    </div>
                  </Button>
                )}
                {desktopLink && (
                  <Button
                    variant='default'
                    className='px-2 py-1 dark:border-purple-500 bg-purple-700 dark:bg-purple-500 text-white hover:bg-purple-800 dark:hover:bg-purple-600 cursor-pointer transition-colors duration-200'
                    size='sm'
                    onClick={() => {
                      window.open(item.commercialLinks.desktop, '_blank');
                    }}
                  >
                    <div className='flex items-center gap-1'>
                      <FaDesktop className='w-3 h-3' />
                      <span>Desktop</span>
                    </div>
                  </Button>
                )}
              </div>
            )}

            <h4 className='text-lg font-semibold mb-3'>{tD('overview')}</h4>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              {t(item.details.fullDescription)}
            </p>
          </div>

          {/* Technologies */}
          <div>
            <h4 className='text-lg font-semibold mb-3'>{tD('technologies')}</h4>
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

          {/* Tools */}
          {item.details.tools && Object.keys(item.details.tools).length > 0 && (
            <div>
              <h4 className='text-lg font-semibold mb-3'>
                {tD('toolsAndEnvironments')}
              </h4>
              {item.details.tools.development.length > 0 && (
                <div className='mb-5'>
                  <h5 className='text-sm font-medium mb-2'>
                    {tD('development')}
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {item.details.tools.development.map((tool, index) => (
                      <span
                        key={index}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          resolvedTheme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-200 text-gray-800'
                        )}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.details.tools.debugging.length > 0 && (
                <div className='mb-5'>
                  <h5 className='text-sm font-medium mb-2'>
                    {tD('debugging')}
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {item.details.tools.debugging.map((tool, index) => (
                      <span
                        key={index}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          resolvedTheme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-200 text-gray-800'
                        )}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.details.tools.communication.length > 0 && (
                <div className='mb-5'>
                  <h5 className='text-sm font-medium mb-2'>
                    {tD('communication')}
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {item.details.tools.communication.map((tool, index) => (
                      <span
                        key={index}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          resolvedTheme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-200 text-gray-800'
                        )}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.details.tools.design.length > 0 && (
                <div className='mb-5'>
                  <h5 className='text-sm font-medium mb-2'>{tD('design')}</h5>
                  <div className='flex flex-wrap gap-2'>
                    {item.details.tools.design.map((tool, index) => (
                      <span
                        key={index}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          resolvedTheme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-200 text-gray-800'
                        )}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Challenges */}
          <div>
            <h4 className='text-lg font-semibold mb-3'>{tD('challenges')}</h4>
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
            <h4 className='text-lg font-semibold mb-3'>{tD('achievements')}</h4>
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

          {/* 하단 여백 */}
          {isDesktopOrLaptop && <div className='h-18'></div>}
        </motion.div>
      </div>
    </div>
  );
}
