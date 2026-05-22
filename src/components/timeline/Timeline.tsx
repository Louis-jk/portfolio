'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import LiquidButton from '../button/LiquidButton';
import { Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Lenis from 'lenis';
import { cn } from '@/lib/utils';
import type { ProjectWithTranslations } from '@/services/project-service';
import type { ProjectTranslation } from '@/generated/prisma/client';
import { format } from 'date-fns';
import ProjectCategoryBadges from './ProjectCategoryBadges';

function getTranslation(project: ProjectWithTranslations, locale: string) {
  return (
    project.translations.find(
      (tr: ProjectTranslation) => tr.locale === locale,
    ) ??
    project.translations.find((tr: ProjectTranslation) => tr.locale === 'ko') ??
    project.translations[0]
  );
}

function formatDateRange(project: ProjectWithTranslations, locale: string) {
  const dateFormat = locale === 'en' ? 'MMM yyyy' : 'yyyy.MM';
  const end = project.endDate ? format(project.endDate, dateFormat) : 'PRESENT';
  return `${format(project.startDate, dateFormat)} ~ ${end}`;
}

interface TimelineProps {
  items: ProjectWithTranslations[];
  selectedItem: ProjectWithTranslations | null;
  onItemClick: (item: ProjectWithTranslations) => void;
}

export default function Timeline({
  items,
  selectedItem,
  onItemClick,
}: TimelineProps) {
  const t = useTranslations('timeline');
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const lenisRef = useRef<Lenis | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);

  const [hoveredItem, setHoveredItem] =
    useState<ProjectWithTranslations | null>(null);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [target, setTarget] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [visibleItems, setVisibleItems] = useState(5); // 모바일에서 처음 5개만 보이기
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isKeyboardSelection, setIsKeyboardSelection] = useState(false);
  const [isTabletDevice, setIsTabletDevice] = useState(false); // 실제 태블릿 디바이스 감지

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const selectedIndex = items.findIndex(
    (item) => item.id.toString() === selectedItem?.id.toString(),
  );

  // 마지막 항목 감지를 위한 ref
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  // 태블릿 디바이스 감지
  useEffect(() => {
    const checkTabletDevice = () => {
      const isTabletByUA = /iPad|Android|Tablet/i.test(navigator.userAgent);
      const isTabletByTouch =
        'ontouchstart' in window && window.innerWidth >= 768;
      const isTabletByPointer = window.matchMedia('(pointer: coarse)').matches;

      setIsTabletDevice(isTabletByUA || (isTabletByTouch && isTabletByPointer));
    };

    checkTabletDevice();
    window.addEventListener('resize', checkTabletDevice);
    return () => window.removeEventListener('resize', checkTabletDevice);
  }, []);

  // 디바이스 체크
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const wasTablet = isTablet;
      setIsMobile(width < 768);
      setIsTablet(width >= 1024 && width < 1280); // 1024px-1279px에서만 태블릿 (가로형)

      // 태블릿 상태가 변경되면 스크롤 위치 초기화
      if (wasTablet !== (width >= 1024 && width < 1280)) {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
        setVisibleItems(5); // 초기 아이템 수로 리셋
      }

      // 1024px 이상에서는 모든 아이템 표시 (데스크톱에서만)
      if (width >= 1024 && !isTabletDevice) {
        setVisibleItems(items.length);
      }

      // 모바일에서는 처음 5개만 표시 (인피니트 스크롤) - 초기 로드시에만
      if (width < 768 && visibleItems === items.length) {
        setVisibleItems(5);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [isTablet, isTabletDevice, items.length, visibleItems]);

  // Lenis 초기화
  useEffect(() => {
    if (!scrollRef.current || isMobile || isTablet) return;

    const wrapper = scrollRef.current;

    lenisRef.current = new Lenis({
      wrapper,
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
  }, [isMobile, isTablet, isTabletDevice, items.length, visibleItems]);

  // 키보드 방향키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!items.length || selectedIndex === -1) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIsKeyboardSelection(true);
        const prevIndex = Math.max(selectedIndex - 1, 0);
        onItemClick(items[prevIndex]);
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsKeyboardSelection(true);
        const nextIndex = Math.min(selectedIndex + 1, items.length - 1);
        onItemClick(items[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemClick]);

  useEffect(() => {
    if (!showThumbnail) return;
    const interval = setInterval(() => {
      // pathIdx 업데이트 로직은 LiquidButton에서 처리
    }, 400);
    return () => clearInterval(interval);
  }, [showThumbnail]);

  useEffect(() => {
    if (hoveredItem) {
      mouseX.set(target.x, false);
      mouseY.set(target.y, false);

      if (!showThumbnail) {
        const timer = setTimeout(() => {
          setShowThumbnail(true);
        }, 30);
        return () => clearTimeout(timer);
      }
    } else {
      setShowThumbnail(false);
    }
  }, [target.x, target.y, hoveredItem, showThumbnail, mouseX, mouseY]);

  // 선택된 아이템 위치로 Lenis 스크롤 이동
  useEffect(() => {
    if (!selectedItem || isMobile || isTablet) return;

    const scrollContainer = scrollRef.current;
    const itemEl = itemRefs.current.get(selectedItem.id.toString());
    const lenis = lenisRef.current;

    if (!scrollContainer || !itemEl || !lenis) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();

    // 아이템이 완전히 보이는지 확인 (약간의 여백 허용)
    const margin = 5;
    const isFullyVisible =
      itemRect.top >= containerRect.top - margin &&
      itemRect.bottom <= containerRect.bottom + margin;

    // 아이템이 부분적으로만 보이는 경우에만 스크롤
    if (!isFullyVisible) {
      let offset: number;

      if (itemRect.top < containerRect.top - margin) {
        // 🔼 위쪽에 가려진 경우 → 아이템을 상단에 위치시킴
        offset = Math.max(0, itemEl.offsetTop);
      } else if (itemRect.bottom > containerRect.bottom + margin) {
        // 🔽 아래쪽에 가려진 경우 → 아이템을 하단에 위치시킴
        offset =
          itemEl.offsetTop - scrollContainer.clientHeight + itemEl.offsetHeight;
      } else {
        // 아이템이 완전히 보이므로 스크롤하지 않음
        return;
      }

      setTimeout(() => {
        lenis.scrollTo(offset);
      }, 20);
    }
  }, [selectedItem, isMobile, isTablet, isTabletDevice]);

  // 키보드 선택 시 자연스러운 스크롤
  useEffect(() => {
    if (!isKeyboardSelection || !selectedItem || isMobile || isTablet) return;

    const scrollContainer = scrollRef.current;
    const itemEl = itemRefs.current.get(selectedItem.id.toString());
    const lenis = lenisRef.current;

    if (!scrollContainer || !itemEl || !lenis) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const itemHeight = itemRect.height;
    const itemTop = itemEl.offsetTop;

    // 키보드 선택 시 아이템을 중앙에 위치시킴
    const targetOffset = itemTop - (containerHeight - itemHeight) / 2;

    setTimeout(() => {
      lenis.scrollTo(targetOffset);
      setIsKeyboardSelection(false); // 키보드 선택 플래그 리셋
    }, 20);
  }, [selectedItem, isKeyboardSelection, isMobile, isTablet, isTabletDevice]);

  const handleMouseEnter = (
    e: React.MouseEvent,
    item: ProjectWithTranslations,
  ) => {
    if (selectedItem?.id.toString() === item.id.toString()) {
      return;
    }

    const x = e.clientX + 20;
    const y = e.clientY - 40;
    setTarget({ x, y });
    setHoveredItem(item);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX + 20;
    const y = e.clientY - 40;
    setTarget({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setShowThumbnail(false);
    setTarget({ x: 0, y: 0 });
  };

  // 모든 디바이스에서 모든 아이템 렌더링
  const itemsToRender = items;

  const handleItemClick = (item: ProjectWithTranslations) => {
    onItemClick(item);

    // GTM 이벤트 전송
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'timeline_item_click',
        timeline_id: item.id.toString(),
        timeline_title: getTranslation(item, locale).title,
      });
    }
  };

  if (itemsToRender.length === 0) {
    return (
      <section className='flex flex-col h-[calc(100vh-275px)] items-center justify-center'>
        <p className='text-center'>{t('noItemsFound')}</p>
      </section>
    );
  }

  return (
    <section
      className='flex flex-col'
      data-timeline-section
      aria-labelledby='timeline-heading'
    >
      {/* 제목 - 모든 화면에서 표시, 모바일에서는 Header 아래에 sticky */}
      <div
        ref={titleRef}
        data-timeline-title
        className={cn(
          'dark:bg-[#0a0a0a] h-[70px] flex items-center justify-center border-b border-gray-200 dark:border-gray-800 transition-all duration-200',
          isMobile && 'sticky top-[55px] z-30',
        )}
      >
        <h2
          id='timeline-heading'
          className={cn(
            'text-2xl font-bold text-center text-gray-900 dark:text-gray-100',
            locale === 'ja' && 'tracking-[.25em]',
          )}
        >
          {t('title')}
        </h2>
      </div>

      {/* 모바일에서는 스크롤 컨테이너 없이 직접 렌더링 */}
      {isMobile ? (
        <div role='list'>
          {itemsToRender.map((item, index) => (
            <div
              key={item.id}
              ref={index === itemsToRender.length - 1 ? lastItemRef : null}
              role='listitem'
            >
              <motion.article
                ref={(el) => {
                  itemRefs.current.set(item.id.toString(), el);
                }}
                initial={{ opacity: 0, y: 1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: Math.min(index * 0.01, 0.1),
                  ease: 'easeOut',
                }}
                className={`relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-4  ${
                  selectedItem?.id.toString() === item.id.toString()
                    ? 'bg-gray-100 dark:bg-gray-800/70'
                    : ''
                }`}
                aria-current={
                  selectedItem?.id.toString() === item.id.toString()
                    ? 'true'
                    : undefined
                }
                onClick={() => handleItemClick(item)}
              >
                <div className='pr-0'>
                  <div className='flex items-start gap-3'>
                    <div className='flex-1 min-w-0'>
                      <ProjectCategoryBadges
                        project={item}
                        className='mb-1.5'
                      />
                      <div className='flex items-center gap-2 justify-between'>
                        <h3
                          className={`font-bold text-lg max-w-4/6 truncate transition-colors duration-200 flex-8 ${
                            selectedItem?.id.toString() === item.id.toString()
                              ? 'text-purple-700 dark:text-purple-500 font-bold'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {getTranslation(item, locale).title}
                        </h3>
                        <p className='text-base font-medium dark:text-gray-400 mt-1 flex-4 text-right'>
                          {getTranslation(item, locale).region}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 justify-between'>
                        <p className='text-sm font-bold text-gray-700 dark:text-gray-100 mt-1 whitespace-pre-line flex-7'>
                          {getTranslation(item, locale).role}
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1 flex-5 text-right'>
                          {formatDateRange(item, locale)}
                        </p>
                      </div>
                      <ul className='list-disc ml-5 mt-3 text-sm space-y-1 text-gray-600 dark:text-gray-300'>
                        {getTranslation(item, locale).description.map(
                          (line: string, i: number) => (
                            <li key={i}>{line}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.article>
              {index < itemsToRender.length - 1 && (
                <div className='h-px border-t border-dashed border-gray-200 dark:border-gray-700 mx-4' />
              )}
            </div>
          ))}
        </div>
      ) : (
        /* PC/태블릿에서는 스크롤 컨테이너 사용 */
        <div
          ref={scrollRef}
          data-timeline-container
          role='list'
          aria-labelledby='timeline-heading'
          className={cn(
            'pr-2 h-[calc(100vh-275px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent will-change-scroll',
            isTablet && 'pr-0',
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'scroll-position',
          }}
        >
          {itemsToRender.map((item, index) => (
            <div
              key={item.id}
              ref={index === itemsToRender.length - 1 ? lastItemRef : null}
              role='listitem'
            >
              <motion.article
                ref={(el) => {
                  itemRefs.current.set(item.id.toString(), el);
                }}
                initial={{ opacity: 0, y: 1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: Math.min(index * 0.01, 0.1),
                  ease: 'easeOut',
                }}
                className={`relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg p-4  ${
                  selectedItem?.id === item.id
                    ? 'bg-gray-200 dark:bg-gray-800/70'
                    : ''
                }`}
                aria-current={selectedItem?.id === item.id ? 'true' : undefined}
                onClick={() => handleItemClick(item)}
                onMouseEnter={
                  !isTabletDevice ? (e) => handleMouseEnter(e, item) : undefined
                }
                onMouseMove={!isTabletDevice ? handleMouseMove : undefined}
                onMouseLeave={!isTabletDevice ? handleMouseLeave : undefined}
              >
                <div className={`${isMobile ? 'pr-0' : ''}`}>
                  <div className='flex items-start gap-3'>
                    {!isTabletDevice && (
                      <div className='flex-shrink-0 mt-1'>
                        {selectedItem?.id === item.id ? (
                          <Check className='w-4 h-4 text-purple-700 dark:text-purple-500' />
                        ) : (
                          <div className='w-4 h-4' />
                        )}
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <ProjectCategoryBadges
                        project={item}
                        className='mb-1.5'
                      />
                      <div className='flex items-center gap-2 justify-between'>
                        <h3
                          className={`font-bold text-lg max-w-4/6 truncate transition-colors duration-200 flex-8 ${
                            selectedItem?.id === item.id
                              ? 'text-purple-700 dark:text-purple-500 font-bold'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {getTranslation(item, locale).title}
                        </h3>
                        <p className='text-base font-medium dark:text-gray-400 mt-1 flex-4 text-right'>
                          {getTranslation(item, locale).region}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 justify-between'>
                        <p className='text-sm font-bold text-gray-700 dark:text-gray-100 mt-1 whitespace-pre-line flex-7'>
                          {getTranslation(item, locale).role}
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1 flex-5 text-right'>
                          {formatDateRange(item, locale)}
                        </p>
                      </div>
                      <ul className='list-disc ml-5 mt-3 text-sm space-y-1 text-gray-600 dark:text-gray-300'>
                        {getTranslation(item, locale).description.map(
                          (line: string, i: number) => (
                            <li key={i}>{line}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.article>
              {index < itemsToRender.length - 1 && (
                <div className='h-px border-t border-dashed border-gray-200 dark:border-gray-700 mx-4' />
              )}
            </div>
          ))}
        </div>
      )}

      {showThumbnail &&
        hoveredItem &&
        !isMobile &&
        !isTabletDevice && // 태블릿 디바이스에서는 표시하지 않음
        createPortal(
          <LiquidButton x={springX} y={springY}>
            Click!
          </LiquidButton>,
          document.body,
        )}
    </section>
  );
}
