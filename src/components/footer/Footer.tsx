'use client';

import Links from '../links/Links';

function Footer() {
  return (
    <footer className='flex flex-col items-center justify-center gap-4 text-sm border-t h-[150px] py-6 bg-white dark:bg-[#0a0a0a] z-50 mt-auto'>
      <div>Open to new opportunities.</div>
      <Links />
      <div>© 2025 Joonho Kim. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
