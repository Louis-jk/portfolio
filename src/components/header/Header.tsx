import React from 'react';
import Nav from '@/components/header/Nav';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface HeaderProps {
  onHomeClick?: () => void;
}

function Header({ onHomeClick }: HeaderProps) {
  return (
    <header className='flex flex-row items-center justify-between px-4 py-2 fixed top-0 left-0 right-0 z-50 bg-background border-b border-border'>
      <Nav onHomeClick={onHomeClick} />
      <ThemeToggle />
    </header>
  );
}

export default Header;
