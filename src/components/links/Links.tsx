'use client';

import Image from 'next/image';
import { useTheme } from '../theme/ThemeProvider';

const links = [
  {
    name: 'github',
    src: '/icons/github.svg',
    alt: 'github',
    href: 'https://github.com/louis-jk',
  },
  {
    name: 'linkedin',
    src: '/icons/linkedin.svg',
    alt: 'linkedin',
    href: 'https://www.linkedin.com/in/louis-jk/',
  },
  {
    name: 'stack overflow',
    src: '/icons/stackoverflow.svg',
    alt: 'stack overflow',
    href: 'https://stackoverflow.com/users/15318755/jkim',
  },
  {
    name: 'mail',
    src: '/icons/mail.svg',
    alt: 'mail',
    href: 'mailto:lippoint.surf0622@gmail.com',
  },
];

function Links() {
  const { theme } = useTheme();

  return (
    <div className='flex flex-row items-center justify-center gap-4 text-gray-800'>
      {links.map((link) => (
        <a
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
          key={link.name}
        >
          <Image
            className={`${
              theme === 'dark' ? 'invert' : ''
            } hover:scale-110 transition-all duration-300`}
            src={link.src}
            alt={link.alt}
            width={20}
            height={20}
          />
        </a>
      ))}
    </div>
  );
}

export default Links;
