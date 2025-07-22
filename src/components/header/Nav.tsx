'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiHome } from 'react-icons/hi2';
import { IoLanguage } from 'react-icons/io5';
import LanguageSelector from '@/components/modal/LanguageSelector';
import { useLocale } from 'next-intl';
import Flag from 'react-world-flags';
import {
  COUNTRY_CODE_TO_NUMERIC_CODE,
  getCookieValue,
  LOCALE_TO_NUMERIC_CODE,
} from '@/util/get-code';
import { motion } from 'framer-motion';

interface NavProps {
  onHomeClick?: () => void;
  isDrawerOpen: boolean;
}

function Nav({ onHomeClick, isDrawerOpen }: NavProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('840');
  const [showHeaderName, setShowHeaderName] = useState(false);
  // setHeaderNameStyle 관련 코드와 상태 정의 제거
  const locale = useLocale();

  useEffect(() => {
    if (LOCALE_TO_NUMERIC_CODE[locale]) {
      setCode(LOCALE_TO_NUMERIC_CODE[locale]);
    } else if (locale === 'en') {
      const countryCode = getCookieValue();
      setCode(COUNTRY_CODE_TO_NUMERIC_CODE[countryCode ?? 'US'] ?? '840');
    } else {
      setCode('840');
    }
  }, [locale]);

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

  const handleHomeClick = (e: React.MouseEvent) => {
    // 현재 홈 페이지에 있다면 URL 파라미터 제거 후 새로고침
    if (
      window.location.pathname === '/' ||
      window.location.pathname === '/en' ||
      window.location.pathname === '/ko' ||
      window.location.pathname === '/ja'
    ) {
      e.preventDefault();

      // URL에서 item 파라미터 제거
      const url = new URL(window.location.href);
      if (url.searchParams.has('item')) {
        url.searchParams.delete('item');
        window.history.replaceState({}, '', url.toString());
      }

      // 잠시 후 새로고침 (URL 업데이트가 반영되도록)
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }

    // 콜백 함수가 있다면 실행
    if (onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <nav className='flex flex-row items-center justify-center gap-4 z-20'>
      <ul className='flex flex-row items-center justify-center gap-8'>
        <li>
          <Link
            href='/'
            onClick={handleHomeClick}
            className='text-foreground hover:text-foreground/80 transition-colors'
          >
            <HiHome className='w-6 h-6' />
          </Link>
        </li>
        <li>
          <div
            className='flex flex-row justify-center items-center gap-2 cursor-pointer'
            onClick={() => {
              setOpen(true);
              if (isDrawerOpen) {
                setOpen(false);
              }
            }}
          >
            <IoLanguage className='w-6 h-6' />
            <Flag code={code} className='w-8 h-5' />
          </div>
        </li>
      </ul>

      <LanguageSelector open={open} setOpen={setOpen} />

      {(isDrawerOpen || showHeaderName) && (
        <motion.p
          className='font-bold text-lg text-center ml-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          Joonho Kim
        </motion.p>
      )}
    </nav>
  );
}

export default Nav;
