'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TimelineItem } from '@/types/timeline.type';
import LiquidButton from '../button/LiquidButton';
import { Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Lenis from 'lenis';
import { cn } from '@/lib/utils';

interface TimelineProps {
  items: TimelineItem[];
  selectedItem: TimelineItem | null;
  onItemClick: (item: TimelineItem) => void;
}

export default function Timeline({
  items,
  selectedItem,
  onItemClick,
}: TimelineProps) {
  const t = useTranslations('timeline');
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const lenisRef = useRef<Lenis | null>(null);

  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
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

  const selectedIndex = items.findIndex((item) => item.id === selectedItem?.id);

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

      // 1024px 이상에서는 모든 아이템 표시
      if (width >= 1024) {
        setVisibleItems(items.length);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [isTablet, items.length]);

  // 스크롤 감지하여 아이템 점진적 표시 (모바일과 세로형 태블릿에서만 전체 페이지 스크롤)
  useEffect(() => {
    const isMobileOrPortraitTablet = window.innerWidth < 1024; // 1024px 미만 (모바일 + 세로형 태블릿)

    if (!isMobileOrPortraitTablet) {
      return;
    }

    const handleWindowScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // 스크롤이 70% 이상일 때 더 많은 아이템 표시 (모바일과 세로형 태블릿에서만)
      if (scrollPercentage > 0.7 && visibleItems < items.length) {
        setVisibleItems((prev) => Math.min(prev + 3, items.length));
      }
    };

    window.addEventListener('scroll', handleWindowScroll);

    // 초기 로드 시에도 한 번 실행
    handleWindowScroll();

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [items.length, visibleItems]); // visibleItems 제거하여 무한 루프 방지

  // 스크롤 감지하여 아이템 점진적 표시 (가로형 태블릿에서만 인피니트 스크롤)
  useEffect(() => {
    if (
      !isTablet ||
      !scrollRef.current ||
      window.innerWidth >= 1280 ||
      !isTabletDevice
    )
      return;

    const handleScroll = () => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // 스크롤이 70% 이상일 때 더 많은 아이템 표시 (가로형 태블릿에서만)
      if (scrollPercentage > 0.7 && visibleItems < items.length) {
        setVisibleItems((prev) => Math.min(prev + 3, items.length));
      }
    };

    const scrollElement = scrollRef.current;
    scrollElement.addEventListener('scroll', handleScroll);

    // 초기 로드 시에도 한 번 실행
    handleScroll();

    return () => scrollElement.removeEventListener('scroll', handleScroll);
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
    const itemEl = itemRefs.current.get(selectedItem.id);
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
    const itemEl = itemRefs.current.get(selectedItem.id);
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

  const handleMouseEnter = (e: React.MouseEvent, item: TimelineItem) => {
    if (selectedItem?.id === item.id) {
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

  // 모바일과 세로형 태블릿에서는 visibleItems만큼만 렌더링
  const itemsToRender =
    window.innerWidth < 1024 ? items.slice(0, visibleItems) : items;

  return (
    <div className='flex flex-col'>
      {/* 제목 - 모든 화면에서 표시, 모바일에서는 sticky 적용 */}
      <h2
        className={`text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100 mt-6 ${
          window.innerWidth < 1024
            ? 'sticky top-[55px] z-50 bg-white dark:bg-[#0a0a0a] py-4'
            : ''
        }`}
      >
        <p className={cn(locale === 'ja' && 'tracking-[.25em]')}>
          {t('title')}
        </p>
      </h2>

      {/* 스크롤 컨테이너 - 타임라인 항목만 포함 */}
      <div
        ref={scrollRef}
        data-timeline-container
        className={`${
          window.innerWidth < 1024
            ? 'pr-0' // 모바일과 세로형 태블릿에서는 스크롤 제거
            : isTablet
            ? 'pr-0 h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'
            : 'pr-2 h-[calc(100vh-14rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'
        }`}
      >
        {itemsToRender.map((item, index) => (
          <div
            key={item.id}
            ref={index === itemsToRender.length - 1 ? lastItemRef : null}
          >
            <motion.div
              ref={(el) => {
                itemRefs.current.set(item.id, el);
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-4  ${
                selectedItem?.id === item.id
                  ? 'bg-gray-100 dark:bg-gray-800/70'
                  : ''
              }`}
              onClick={() => onItemClick(item)}
              onMouseEnter={
                !isMobile && !isTabletDevice
                  ? (e) => handleMouseEnter(e, item)
                  : undefined
              }
              onMouseMove={
                !isMobile && !isTabletDevice ? handleMouseMove : undefined
              }
              onMouseLeave={
                !isMobile && !isTabletDevice ? handleMouseLeave : undefined
              }
            >
              <div className={`${isMobile ? 'pr-0' : ''}`}>
                <div className='flex items-start gap-3'>
                  {!isMobile && !isTabletDevice && (
                    <div className='flex-shrink-0 mt-1'>
                      {selectedItem?.id === item.id ? (
                        <Check className='w-4 h-4 text-purple-700 dark:text-purple-500' />
                      ) : (
                        <div className='w-4 h-4' />
                      )}
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 justify-between'>
                      <h3
                        className={`font-bold text-lg max-w-4/6 truncate transition-colors duration-200 flex-8 ${
                          selectedItem?.id === item.id
                            ? 'text-purple-700 dark:text-purple-500 font-bold'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {t(item.title)}
                      </h3>
                      <p className='text-base font-medium dark:text-gray-400 mt-1 flex-4 text-right'>
                        {t(item.region)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 justify-between'>
                      <p className='text-sm font-bold text-gray-700 dark:text-gray-100 mt-1 whitespace-pre-line flex-7'>
                        {t(item.role)}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mt-1 flex-5 text-right'>
                        {t(item.date)}
                      </p>
                    </div>
                    <ul className='list-disc ml-5 mt-3 text-sm space-y-1 text-gray-600 dark:text-gray-300'>
                      {item.description.map((line: string, i: number) => (
                        <li key={i}>{t(line)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
            {index < itemsToRender.length - 1 && (
              <div className='h-px border-t border-dashed border-gray-200 dark:border-gray-700 mx-4' />
            )}
          </div>
        ))}

        {/* 모바일과 세로형 태블릿에서 로딩 인디케이터 */}
        {window.innerWidth < 1024 && visibleItems < items.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-4 text-center'
          >
            <div className='flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400'>
              <div className='w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
              <span className='text-sm'>
                더 많은 항목을 불러오는 중... ({visibleItems}/{items.length})
              </span>
            </div>
          </motion.div>
        )}

        {/* 가로형 태블릿에서 로딩 인디케이터 */}
        {isTablet &&
          window.innerWidth < 1280 &&
          visibleItems < items.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='p-4 text-center'
            >
              <div className='flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400'>
                <div className='w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
                <span className='text-sm'>
                  더 많은 항목을 불러오는 중... ({visibleItems}/{items.length})
                </span>
              </div>
            </motion.div>
          )}

        {/* 하단 여백 */}
        <div className={`${isTablet ? 'h-32' : 'h-24'}`}></div>
      </div>

      {showThumbnail &&
        hoveredItem &&
        !isMobile &&
        !isTabletDevice && // 태블릿 디바이스에서는 표시하지 않음
        createPortal(
          <LiquidButton x={springX} y={springY}>
            Click!
          </LiquidButton>,
          document.body
        )}
    </div>
  );
}
