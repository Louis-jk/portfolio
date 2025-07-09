'use client';

import React from 'react';
import Link from 'next/link';
import { IoHome } from 'react-icons/io5';

interface NavProps {
  onHomeClick?: () => void;
}

function Nav({ onHomeClick }: NavProps) {
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
    <nav className='flex flex-row items-center justify-center gap-4'>
      <ul className='flex flex-row items-center justify-center gap-4'>
        <li>
          <Link
            href='/'
            onClick={handleHomeClick}
            className='text-foreground hover:text-foreground/80 transition-colors'
          >
            <IoHome className='w-5 h-5' />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
