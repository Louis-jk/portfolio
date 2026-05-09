'use client';

import Links from '../links/Links';
import { useMediaQuery } from 'react-responsive';

function Footer() {
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)',
  });

  return (
    <footer
      className={`flex flex-col items-center justify-center gap-4 text-sm border-t h-[150px] py-6 bg-white dark:bg-[#0a0a0a] ${
        isMobile ? '' : 'mt-auto'
      }`}
    >
      <p>Open to new opportunities.</p>
      <Links />
      <p>
        © {new Date().getFullYear()} Joonho Kim · Frontend Developer
      </p>
    </footer>
  );
}

export default Footer;
