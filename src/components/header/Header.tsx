import React, { useEffect, useState } from 'react';
import Nav from '@/components/header/Nav';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { motion } from 'framer-motion';

interface HeaderProps {
  onHomeClick?: () => void;
}

function Header({ onHomeClick }: HeaderProps) {
  const [showHeaderName, setShowHeaderName] = useState(false);

  // 스크롤 감지하여 헤더 이름 애니메이션 (1024px 미만에서만)
  useEffect(() => {
    const handleScroll = () => {
      // 모바일/태블릿에서만 동작
      if (window.innerWidth >= 1024) {
        setShowHeaderName(false);
        return;
      }
      // 스크롤이 100px 이상이면 표시, 아니면 숨김
      if (window.scrollY > 400) {
        setShowHeaderName(true);
      } else {
        setShowHeaderName(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className='fixed top-0 left-0 right-0 z-50'>
      <div className='relative w-full flex flex-row items-center justify-between px-4 py-2 bg-background border-b border-border h-[55px]'>
        <Nav onHomeClick={onHomeClick} />
        {showHeaderName && (
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
