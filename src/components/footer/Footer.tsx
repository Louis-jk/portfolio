'use client';

import Links from '../links/Links';

function Footer() {
  return (
    <footer className='text-center text-sm py-8 space-y-3 mt-5 border-t border-border'>
      <div>Thank you for visiting my portfolio 💻</div>
      <Links />
      <div className='mt-2'>© 2025 Joonho Kim. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
