import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Hanalei_Fill,
} from 'next/font/google';
import Script from 'next/script';

import { ThemeProvider } from 'next-themes';
import './globals.css';
import GTMTracker from './gtm-tracker';

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
      <head>
        {/* GTM Head */}
        <Script
          id='gtm-head'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-52GRS4X');
            `,
          }}
        />

        {/* GA4 gtag.js 추가 */}
        <Script
          id='ga4'
          strategy='afterInteractive'
          src='https://www.googletagmanager.com/gtag/js?id=G-CKP70PTE30'
        />
        <Script
          id='ga4-init'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CKP70PTE30', { send_page_view: false });
            `,
          }}
        />
      </head>
      <body
        className={`${notoSansJP.variable} ${notoSansKR.variable} ${geist.variable} ${geistMono.variable} ${hanaleiFill.variable} antialiased`}
      >
        {/* GTM Body */}
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-52GRS4X'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* SPA 페이지뷰 & 이벤트 추적 */}
        <GTMTracker />
      </body>
    </html>
  );
}
