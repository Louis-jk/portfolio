import Links from '../links/Links';

function Footer() {
  return (
    <footer className='text-center text-sm text-gray-500 py-8 space-y-2'>
      <div>Thank you for visiting my portfolio 💻</div>
      <div>
        Feel free to reach out — I'm always open to new ideas and
        collaborations!
      </div>
      <Links />
      <div className='mt-2'>© 2025 Joonho Kim</div>
    </footer>
  );
}

export default Footer;
