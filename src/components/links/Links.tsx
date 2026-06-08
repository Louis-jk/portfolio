'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useMounted } from '@/hooks/useMounted';

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
    href: 'https://www.linkedin.com/in/joonhokim0506/',
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
    href: 'mailto:joonhokim.dev@gmail.com',
  },
];

function Links() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  return (
    <motion.nav
      aria-label='Social and contact links'
      className='flex flex-row items-center justify-center gap-4 text-gray-800'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
    >
      {links.map((link, index) => (
        <motion.a
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
          key={link.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.5 + index * 0.1,
            ease: 'easeOut',
          }}
        >
          <Image
            className={`hover:scale-110 transition-all duration-300 ${
              mounted && resolvedTheme === 'dark' ? 'invert' : ''
            }`}
            src={link.src}
            alt={link.alt}
            width={20}
            height={20}
          />
        </motion.a>
      ))}
    </motion.nav>
  );
}

export default Links;
