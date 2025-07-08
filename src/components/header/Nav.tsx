import React from 'react';
import Link from 'next/link';

function Nav() {
  return (
    <nav className='flex flex-row items-center justify-center gap-4 dark:text-white'>
      <ul className='flex flex-row items-center justify-center gap-4'>
        <li>
          <Link
            href='/'
            className='text-black dark:text-white hover:text-black dark:hover:text-white'
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href='/about'
            className='text-black dark:text-white hover:text-black dark:hover:text-white'
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href='/work'
            className='text-black dark:text-white hover:text-black dark:hover:text-white'
          >
            Work
          </Link>
        </li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}

export default Nav;
