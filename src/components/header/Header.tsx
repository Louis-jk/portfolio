import React from 'react';
import Nav from './Nav';
import ThemeToggle from '@/components/theme/ThemeToggle';

function Header() {
  return (
    <header className='flex flex-row items-center justify-between px-4 py-2 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#000]'>
      <Nav />
      <ThemeToggle />
    </header>
  );
}

export default Header;
