import React, { useEffect, useState } from 'react';
import Nav from '@/components/header/Nav';
import ThemeToggle from '@/components/theme/ThemeToggle';
import FilterPanel from '@/components/header/FilterPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

interface HeaderProps {
  onHomeClick?: () => void;
  platformFilter?: string | null;
  domainFilter?: string | null;
  onPlatformFilter?: (cat: string | null) => void;
  onDomainFilter?: (tag: string | null) => void;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
}

function Header({
  onHomeClick,
  platformFilter = null,
  domainFilter = null,
  onPlatformFilter = () => {},
  onDomainFilter = () => {},
  isFilterOpen: controlledFilterOpen,
  onFilterOpenChange,
}: HeaderProps) {
  const [showHeaderName, setShowHeaderName] = useState(false);
  const [showTimelineTitle, setShowTimelineTitle] = useState(false);
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);
  const isControlled = onFilterOpenChange !== undefined;
  const isFilterOpen = isControlled
    ? (controlledFilterOpen ?? false)
    : internalFilterOpen;
  const setIsFilterOpen = isControlled
    ? (v: boolean | ((prev: boolean) => boolean)) =>
        onFilterOpenChange(typeof v === 'function' ? v(isFilterOpen) : v)
    : setInternalFilterOpen;
  const t = useTranslations('timeline');
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });

  // 스크롤 감지하여 헤더 이름 애니메이션 (1024px 미만에서만)
  useEffect(() => {
    const handleScroll = () => {
      // 모바일/태블릿에서만 동작
      if (window.innerWidth >= 1024) {
        setShowHeaderName(false);
        setShowTimelineTitle(false);
        return;
      }

      // 타임라인 제목이 헤더를 지나갈 때부터 타임라인 섹션이 끝날 때까지
      const timelineTitle = document.querySelector('[data-timeline-title]');
      const timelineSection = document.querySelector('[data-timeline-section]');

      if (timelineTitle && timelineSection) {
        const titleRect = timelineTitle.getBoundingClientRect();
        const sectionRect = timelineSection.getBoundingClientRect();

        // 타임라인 제목이 헤더를 지나갔고, 타임라인 섹션이 아직 화면에 있을 때
        const isTitlePassedHeader = titleRect.top <= 0;
        const isSectionStillVisible = sectionRect.bottom > 55;

        setShowTimelineTitle(isTitlePassedHeader && isSectionStillVisible);
      }

      // 타임라인 제목이 표시되지 않을 때만 이름 표시
      if (window.scrollY > 400 && !showTimelineTitle) {
        setShowHeaderName(true);
      } else {
        setShowHeaderName(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showTimelineTitle]);

  const handleResetFilter = () => {
    onPlatformFilter(null);
    onDomainFilter(null);
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50'>
      <div className='relative w-full flex flex-row items-center justify-between px-4 py-2 bg-background border-b border-border min-h-[55px]'>
        <div className='flex items-center gap-2 min-w-0 flex-1'>
          <Nav onHomeClick={onHomeClick} />
          <button
            type='button'
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className='p-1.5 rounded-lg text-foreground hover:bg-muted transition-colors shrink-0'
            aria-label='Filter'
          >
            <SlidersHorizontal className='w-5 h-5' />
          </button>
          {/* PC: Filter panel expands inline within header row */}
          {isDesktop && (
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ maxWidth: 0, opacity: 0 }}
                  animate={{ maxWidth: '85vw', opacity: 1 }}
                  exit={{ maxWidth: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className='overflow-hidden flex items-center ml-2'
                >
                  <div className='py-1 pr-2'>
                    <FilterPanel
                      platformFilter={platformFilter}
                      domainFilter={domainFilter}
                      onPlatformFilter={onPlatformFilter}
                      onDomainFilter={onDomainFilter}
                      onReset={handleResetFilter}
                      inline
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        {showTimelineTitle && (
          <motion.p
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-foreground pointer-events-none'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {t('mobileHeaderTimelineTitle')}
          </motion.p>
        )}
        {showHeaderName && !showTimelineTitle && (
          <motion.p
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg pointer-events-none'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Joonho
          </motion.p>
        )}
        <ThemeToggle />
      </div>

      {/* Mobile/Tablet: Accordion dropdown */}
      {!isDesktop && (
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className='overflow-hidden bg-background border-b border-border'
            >
              <div className='py-3 px-4'>
                <FilterPanel
                  platformFilter={platformFilter}
                  domainFilter={domainFilter}
                  onPlatformFilter={onPlatformFilter}
                  onDomainFilter={onDomainFilter}
                  onReset={handleResetFilter}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </header>
  );
}

export default Header;
