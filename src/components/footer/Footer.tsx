'use client';

import Links from '../links/Links';
import { useTheme } from '../theme/ThemeProvider';
import { useEffect, useState } from 'react';

function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer
      className='text-center text-sm py-8 space-y-3 mt-5'
      style={{
        borderTop: `1px solid ${
          mounted && theme === 'dark' ? '#222222' : '#e5e7eb'
        }`,
      }}
    >
      <div>Thank you for visiting my portfolio 💻</div>
      <Links />
      <div className='mt-2'>© 2025 Joonho Kim. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
