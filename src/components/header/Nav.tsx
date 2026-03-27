'use client';

import React, { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { HiHome } from 'react-icons/hi2';
import { IoLanguage } from 'react-icons/io5';
import LanguageSelector from '@/components/modal/LanguageSelector';
import { useLocale } from 'next-intl';
import Flag from 'react-world-flags';
import {
  COUNTRY_CODE_TO_NUMERIC_CODE,
  getCookieValue,
  LOCALE_TO_NUMERIC_CODE,
} from '@/utils/get-code';
import { motion } from 'framer-motion';

interface NavProps {
  onHomeClick?: () => void;
}

function Nav({ onHomeClick }: NavProps) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  // locale이 바뀌면 바로 국기 코드 계산 (useEffect 대신 useMemo로 동기 반영)
  const code = useMemo(() => {
    if (LOCALE_TO_NUMERIC_CODE[locale]) {
      return LOCALE_TO_NUMERIC_CODE[locale];
    }
    if (locale === 'en') {
      const countryCode = getCookieValue();
      return COUNTRY_CODE_TO_NUMERIC_CODE[countryCode ?? 'US'] ?? '840';
    }
    return '840';
  }, [locale]);

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
      <ul className='flex flex-row items-center justify-center gap-5'>
        <li>
          <Link
            href='/'
            onClick={handleHomeClick}
            className='text-foreground hover:text-foreground/80 transition-colors'
          >
            <motion.div
              className='flex flex-row justify-center items-center gap-2 cursor-pointer'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiHome className='w-6 h-6' />
            </motion.div>
          </Link>
        </li>
        <li>
          <motion.div
            className='flex flex-row justify-center items-center gap-2 cursor-pointer'
            onClick={() => {
              setOpen(true);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoLanguage className='w-6 h-6' />
            <Flag code={code} className='w-8 h-5' />
          </motion.div>
        </li>
      </ul>

      <LanguageSelector open={open} setOpen={setOpen} />
    </nav>
  );
}

export default Nav;
