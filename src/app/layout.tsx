import { Suspense } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import {
  Geist,
  Geist_Mono,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Hanalei_Fill,
} from 'next/font/google';
import { storyCodeFont } from '@/lib/fonts/story-code-font';
import Script from 'next/script';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/lib/query/query-provider';
import './globals.css';
import Ga4PageViewTracker from './ga4-page-view-tracker';
import { GA4_ENABLED, GA4_MEASUREMENT_ID } from '@/lib/analytics/ga4';

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
  authors: [{ name: 'Joonho Kim', url: 'https://joonhokim.dev' }],
  metadataBase: new URL('https://joonhokim.dev'),
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get('x-app-locale') ?? 'en';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel='icon'
          type='image/png'
          href='/favicon-96x96.png'
          sizes='96x96'
        />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <meta name='apple-mobile-web-app-title' content="J.K's Works" />
        <link rel='manifest' href='/site.webmanifest' />

        {GA4_ENABLED ? (
          <>
            <Script
              id='ga4'
              strategy='afterInteractive'
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
            />
            <Script
              id='ga4-init'
              strategy='afterInteractive'
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_MEASUREMENT_ID}', { send_page_view: false });
            `,
              }}
            />
          </>
        ) : null}
      </head>
      <body
        className={`${notoSansJP.variable} ${notoSansKR.variable} ${geist.variable} ${geistMono.variable} ${storyCodeFont.variable} ${storyCodeFont.className} ${hanaleiFill.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>

        <Toaster richColors position='top-center' />

        {GA4_ENABLED ? (
          <Suspense fallback={null}>
            <Ga4PageViewTracker />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
