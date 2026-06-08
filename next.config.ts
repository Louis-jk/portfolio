import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { getSupabaseStorageHostname } from './src/lib/supabase-hostname';

const withNextIntl = createNextIntlPlugin();

const adminPath = (process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH ?? '').replace(
  /^\//,
  '',
);
const newProjectSlug =
  process.env.ADMIN_PROJECT_NEW_SLUG ||
  process.env.NEXT_PUBLIC_ADMIN_PROJECT_NEW_SLUG ||
  'new';

const supabaseHostname = getSupabaseStorageHostname();

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },

  /* config options here */
  async rewrites() {
    if (!adminPath || newProjectSlug === 'new') return [];
    return [
      {
        source: `/:locale/${adminPath}/projects/${newProjectSlug}`,
        destination: `/:locale/${adminPath}/projects/new`,
      },
      {
        source: `/:locale/${adminPath}/projects/${newProjectSlug}/:path*`,
        destination: `/:locale/${adminPath}/projects/new/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      ...(supabaseHostname
        ? [{ protocol: 'https' as const, hostname: supabaseHostname }]
        : []),
    ],
  },
};

const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;

export default withSentryConfig(withNextIntl(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: sentryOrg ?? '',
  project: sentryProject ?? '',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
