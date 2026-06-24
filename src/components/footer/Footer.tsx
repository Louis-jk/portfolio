'use client';

import Links from '../links/Links';
import { useLayoutBreakpoints } from '@/hooks/useLayoutBreakpoints';

function Footer() {
  const { isLayoutMobile } = useLayoutBreakpoints();

  return (
    <footer
      className={`flex flex-col items-center justify-center gap-4 text-sm border-t h-[150px] py-6 dark:bg-[#0a0a0a] ${
        isLayoutMobile ? '' : 'mt-auto'
      }`}
    >
      <p>Open to new opportunities.</p>
      <Links />
      <p>© {new Date().getFullYear()} Joonho Kim · Frontend Developer</p>
    </footer>
  );
}

export default Footer;
