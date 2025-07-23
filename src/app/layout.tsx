import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Hanalei_Fill,
} from 'next/font/google';

import { ThemeProvider } from 'next-themes';
import './globals.css';

const geist = Geist({
  variable: '--font-en',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

const hanaleiFill = Hanalei_Fill({
  variable: '--font-hanalei-fill',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
});

const notoSansJP = Noto_Sans_JP({
  variable: '--font-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const notoSansKR = Noto_Sans_KR({
  variable: '--font-kr',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: 'Joonho Kim',
  description: 'Frontend Engineer Joonho Kim',
  keywords: 'Joonho Kim, Frontend Engineer, Web Developer, Web3 Developer',
  authors: [{ name: 'Joonho Kim', url: 'https://joonhokim.dev' }],
  openGraph: {
    title: 'Joonho Kim',
    description: 'Frontend Engineer Joonho Kim',
    url: 'https://joonhokim.dev',
    images: [
      {
        url: '/images/og_image.png',
        width: 800,
        height: 600,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${notoSansJP.variable} ${notoSansKR.variable} ${geist.variable} ${geistMono.variable} ${hanaleiFill.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
