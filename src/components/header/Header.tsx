import React, { useEffect, useState } from 'react';
import Nav from '@/components/header/Nav';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  onHomeClick?: () => void;
}

function Header({ onHomeClick }: HeaderProps) {
  const [showHeaderName, setShowHeaderName] = useState(false);
  const [showTimelineTitle, setShowTimelineTitle] = useState(false);
  const t = useTranslations('timeline');

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

  return (
    <header className='fixed top-0 left-0 right-0 z-50'>
      <div className='relative w-full flex flex-row items-center justify-between px-4 py-2 bg-background border-b border-border h-[55px]'>
        <Nav onHomeClick={onHomeClick} />
        {showTimelineTitle && (
          <motion.p
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-foreground'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {t('title')}
          </motion.p>
        )}
        {showHeaderName && !showTimelineTitle && (
          <motion.p
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Joonho Kim
          </motion.p>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
