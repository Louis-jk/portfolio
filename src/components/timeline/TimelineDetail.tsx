'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { FaBuilding } from 'react-icons/fa6';
import { FaGooglePlay, FaDesktop } from 'react-icons/fa';
import { IoLogoAppleAppstore } from 'react-icons/io5';
import { TbBrowserShare } from 'react-icons/tb';
import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useMediaQuery } from 'react-responsive';
import { Button } from '@/components/ui/button';
import ShareButton from '@/components/button/share/ShareButton';
import ShareModal from '@/components/modal/shareModal';
import type { ProjectWithTranslations } from '@/services/project-service';
import ProjectCategoryBadges from './ProjectCategoryBadges';

interface TimelineDetailProps {
  item: ProjectWithTranslations | null;
  isVisible: boolean;
}

function getTranslation(project: ProjectWithTranslations, locale: string) {
  return (
    project.translations.find((tr) => tr.locale === locale) ??
    project.translations.find((tr) => tr.locale === 'ko') ??
    project.translations[0]
  );
}

function formatDateRange(project: ProjectWithTranslations, locale: string) {
  const dateFormat = locale === 'en' ? 'MMM yyyy' : 'yyyy.MM';
  const end = project.endDate ? format(project.endDate, dateFormat) : 'PRESENT';
  return `${format(project.startDate, dateFormat)} ~ ${end}`;
}

export default function TimelineDetail({
  item,
  isVisible,
}: TimelineDetailProps) {
  const [openShareModal, setOpenShareModal] = useState(false);
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const t = useTranslations('timeline');
  const tD = useTranslations('details');
  const tL = useTranslations('loading');
  const [imageLoaded, setImageLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  });

  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1223px)',
  });

  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  // 이미지가 변경될 때마다 로딩 상태를 리셋
  useEffect(() => {
    setImageLoaded(false);
  }, [item?.imageUrl]);

  // Lenis 초기화 (한 번만)
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
  }, []); // 의존성 배열에서 item 제거

  // item 변경 시 Lenis로 스크롤 위치 초기화 (Lenis 초기화 후 실행)
  useEffect(() => {
    if (lenisRef.current) {
      // 약간의 지연을 두고 스크롤 초기화
      setTimeout(() => {
        lenisRef.current?.scrollTo(0, { immediate: true });
      }, 100);
    }
  }, [item]);

  const webLink = item && item.isPublic && item.platforms?.webLink;
  const iosLink = item && item.isPublic && item.platforms?.iosLink;
  const androidLink = item && item.isPublic && item.platforms?.androidLink;
  const desktopLink = item && item.isPublic && item.platforms?.desktopLink;

  if (!item || !item.translations) {
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
        <div className='bg-white dark:bg-[#0a0a0a] h-[70px] flex items-center justify-center'>
          <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-gray-100'>
            {t('details.title')}
          </h2>
        </div>
      )}

      <div
        ref={scrollRef}
        className={cn(
          'h-[calc(100vh-135px)] overflow-y-auto overflow-x-hidden',
          isDesktopOrLaptop && 'h-[calc(100vh-275px)]',
          isMobile && 'pb-36',
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'flex flex-col gap-7 px-0 lg:px-4 overflow-hidden',
            isDesktopOrLaptop && 'mb-5',
          )}
        >
          <div>
            {/* Header - 태블릿과 모바일에서 sticky 처리 */}
            <div
              className={cn(
                isTablet &&
                  'sticky top-0 z-10 bg-white dark:bg-[#0a0a0a] py-3 -mx-4 px-4 border-b border-gray-200 dark:border-gray-800',
                isMobile &&
                  'sticky top-0 z-10 bg-white dark:bg-[#0a0a0a] py-3 -mx-4 px-4 border-b border-gray-200 dark:border-gray-800',
              )}
            >
              <ProjectCategoryBadges project={item} className='mb-2' />
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.2 }}
                className={cn(
                  'text-2xl font-bold mb-2',
                  !isDesktopOrLaptop && 'mt-0',
                )}
              >
                {getTranslation(item, locale).title}
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.4 }}
                className='flex flex-col gap-1'
              >
                <div className='flex items-center gap-2 justify-between w-full'>
                  {getTranslation(item, locale).company && (
                    <p className='text-sm text-gray-900 dark:text-gray-200 flex items-center flex-8'>
                      <FaBuilding className='inline-block w-3 h-3 mr-1' />
                      {getTranslation(item, locale).company}&nbsp;&nbsp;&nbsp;
                    </p>
                  )}
                  <p
                    className={cn(
                      'text-sm text-gray-900 dark:text-gray-200 flex-4 text-right',
                      !getTranslation(item, locale).company && 'ml-auto',
                    )}
                  >
                    {getTranslation(item, locale).region}
                  </p>
                </div>

                <div className='flex items-center gap-2 justify-between'>
                  {getTranslation(item, locale).role && (
                    <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center whitespace-pre-line flex-7'>
                      {getTranslation(item, locale).role}
                    </p>
                  )}
                  <p className='text-sm text-gray-600 dark:text-gray-400 flex-5 text-right'>
                    {formatDateRange(item, locale)}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Image */}
          {item.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className='relative w-full'
            >
              {/* 로딩 스켈레톤 */}
              {!imageLoaded && (
                <div
                  className={cn(
                    'w-full h-[150px] rounded-sm flex items-center justify-center bg-gray-50 dark:bg-gray-900',
                    isDesktopOrLaptop && 'h-[300px]',
                  )}
                >
                  <div className='flex flex-col items-center justify-center gap-4'>
                    {/* 더블 링 스피너 */}
                    <div className='relative flex items-center justify-center'>
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

                    <p className='text-sm text-purple-600 dark:text-purple-400 font-medium text-center'>
                      {tL('image')}
                    </p>
                  </div>
                </div>
              )}

              {/* 이미지 - 로드되면 스피너 위에 표시 */}
              <div
                className={cn(
                  'transition-opacity duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0',
                )}
              >
                <Image
                  key={item.imageUrl}
                  src={item.imageUrl}
                  alt={getTranslation(item, locale).title}
                  className='object-contain rounded-sm select-none pointer-events-none w-full mx-auto'
                  width={1200}
                  height={579}
                  onLoad={() => setImageLoaded(true)}
                  priority={true} // 우선순위 로딩
                  unoptimized={item.imageUrl?.endsWith('.gif')} // 애니메이션 GIF는 최적화 비활성화
                />
              </div>
            </motion.div>
          )}

          {/* Full Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {item.isPublic && (
              <div className='mb-5 flex gap-2'>
                {webLink && (
                  <Button
                    variant='default'
                    className='px-2 py-1 dark:border-purple-500 bg-purple-700 dark:bg-purple-500 text-white hover:bg-purple-800 dark:hover:bg-purple-600 cursor-pointer transition-colors duration-200'
                    size='sm'
                    onClick={() => {
                      window.open(item.platforms?.webLink ?? '', '_blank');
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
                      window.open(item.platforms?.iosLink ?? '', '_blank');
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
                      window.open(item.platforms?.androidLink ?? '', '_blank');
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
                      window.open(item.platforms?.desktopLink ?? '', '_blank');
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

            <div className='flex items-center justify-between mb-3'>
              <h4 className='text-lg font-semibold'>{tD('overview')}</h4>
              <ShareButton onShareClick={() => setOpenShareModal(true)} />
            </div>
            <p className='text-gray-700 dark:text-gray-300 leading-[1.5] whitespace-pre-line'>
              {getTranslation(item, locale).overview}
            </p>
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <h4 className='text-lg font-semibold mb-3'>{tD('technologies')}</h4>
            <div className='flex flex-wrap gap-2'>
              {item.technologies.map((tech, index) => (
                <span
                  key={index}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    resolvedTheme === 'dark'
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-100 text-gray-800',
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Tools */}
          {item.tools && Object.keys(item.tools).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <h4 className='text-lg font-semibold mb-3'>
                {tD('toolsAndEnvironments')}
              </h4>
              {item.tools.development.length > 0 && (
                <div className='mb-5'>
                  <h5 className='text-sm font-medium mb-2'>
                    {tD('development')}
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {item.tools.development.map((tool, index) => (
                      <span
                        key={index}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          resolvedTheme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-800',
                        )}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.tools.debugging.length > 0 && (
                <div className='mb-5'>
                  <h5 className='text-sm font-medium mb-2'>
                    {tD('debugging')}
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {item.tools.debugging.map((tool, index) => (
                      <span
                        key={index}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          resolvedTheme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-800',
                        )}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.tools.communication.length > 0 && (
                <div className='mb-5'>
                  <h5 className='text-sm font-medium mb-2'>
                    {tD('communication')}
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {item.tools.communication.map((tool, index) => (
                      <span
                        key={index}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          resolvedTheme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-800',
                        )}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.tools.design.length > 0 && (
                <div className='mb-5'>
                  <h5 className='text-sm font-medium mb-2'>{tD('design')}</h5>
                  <div className='flex flex-wrap gap-2'>
                    {item.tools.design.map((tool, index) => (
                      <span
                        key={index}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          resolvedTheme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-800',
                        )}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <h4 className='text-lg font-semibold mb-3'>{tD('challenges')}</h4>
            <ul className='space-y-2'>
              {getTranslation(item, locale).challenges.map(
                (challenge, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='text-red-500 mr-2 mt-1'>•</span>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {challenge}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <h4 className='text-lg font-semibold mb-3'>{tD('achievements')}</h4>
            <ul className='space-y-2'>
              {getTranslation(item, locale).achievements.map(
                (achievement, index) => (
                  <li key={index} className='flex items-start'>
                    <span className='text-green-500 mr-2 mt-1'>✓</span>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {achievement}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <ShareModal
        open={openShareModal}
        setOpen={setOpenShareModal}
        url={window.location.href}
        title='Joonho Kim Portfolio'
        text='Frontend Developer Joonho Kim'
      />
    </div>
  );
}
