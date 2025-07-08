'use client';

import Links from '../links/Links';
import { useTheme } from '../theme/ThemeProvider';

function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className='text-center text-sm py-8 space-y-3 mt-20'
      style={{
        borderTop: `1px solid ${theme === 'dark' ? '#222222' : '#e5e7eb'}`,
      }}
    >
      <div>Thank you for visiting my portfolio 💻</div>
      <div>
        Feel free to reach out — I&apos;m always open to new ideas and
        collaborations!
      </div>
      <Links />
      <div className='mt-2'>© 2025 Joonho Kim. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
