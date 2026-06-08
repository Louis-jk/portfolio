import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const ogLocales: Record<string, string> = {
  ko: 'ko_KR',
  ja: 'ja_JP',
  en: 'en_US',
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'meta' });
  const keywords = t('keywords')
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    title: t('title'),
    description: t('description'),
    keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ko: '/ko',
        ja: '/ja',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('ogDescription'),
      url: `/${locale}`,
      siteName: 'Joonho Kim Portfolio',
      locale: ogLocales[locale] ?? 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/og_image.png',
          width: 1200,
          height: 630,
          alt: 'Joonho Kim Portfolio Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og_image.png'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: 'meta' });
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Joonho Kim',
        url: 'https://joonhokim.dev',
        jobTitle: t('title'),
        description: t('description'),
        sameAs: [
          'https://github.com/Louis-jk',
          'https://www.linkedin.com/in/joonhokim0506',
        ],
      },
      {
        '@type': 'WebSite',
        name: 'Joonho Kim Portfolio',
        url: `https://joonhokim.dev/${locale}`,
        inLanguage: locale,
      },
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
    </>
  );
}
