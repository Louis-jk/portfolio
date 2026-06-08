import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createClient } from '@/utils/supabase/middleware';
import { isAdminSignupEnabled } from '@/lib/admin-signup';
import { ADMIN_ROUTES } from '@/lib/constants';

const EXPECTED_ADMIN_PATH = (
  process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH ?? ''
).replace(/^\//, '');

function isAdminRoute(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  return segments[1] === EXPECTED_ADMIN_PATH && EXPECTED_ADMIN_PATH.length > 0;
}

function isAdminLoginRoute(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  return (
    segments[1] === EXPECTED_ADMIN_PATH &&
    segments[2] === 'login' &&
    EXPECTED_ADMIN_PATH.length > 0
  );
}

function isAdminSignupRoute(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  return (
    segments[1] === EXPECTED_ADMIN_PATH &&
    segments[2] === 'signup' &&
    EXPECTED_ADMIN_PATH.length > 0
  );
}

function isAdminAuthRoute(pathname: string): boolean {
  return isAdminLoginRoute(pathname) || isAdminSignupRoute(pathname);
}

export async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  const response = await handleI18nRouting(request);
  const requestedLocale = request.nextUrl.pathname.split('/')[1];
  const locale = routing.locales.includes(requestedLocale as (typeof routing.locales)[number])
    ? requestedLocale
    : routing.defaultLocale;
  response.headers.set('x-app-locale', locale);

  // Admin 경로 보호: Supabase Auth 세션 검증
  if (EXPECTED_ADMIN_PATH && isAdminRoute(request.nextUrl.pathname)) {
    if (isAdminSignupRoute(request.nextUrl.pathname) && !isAdminSignupEnabled()) {
      const locale = request.nextUrl.pathname.split('/')[1] ?? 'en';
      const loginUrl = new URL(
        `/${locale}${ADMIN_ROUTES.LOGIN}`,
        request.url,
      );
      return NextResponse.redirect(loginUrl);
    }

    const supabase = createClient(request, response as NextResponse);
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims ?? null;

    const isAuthPage = isAdminAuthRoute(request.nextUrl.pathname);

    if (!claims && !isAuthPage) {
      // 비로그인: 로그인 페이지로 리다이렉트
      const locale = request.nextUrl.pathname.split('/')[1] ?? 'en';
      const loginUrl = new URL(
        `/${locale}${ADMIN_ROUTES.DASHBOARD}/login`,
        request.url,
      );
      const redirectResponse = NextResponse.redirect(loginUrl);
      response.headers.getSetCookie?.()?.forEach((cookie) =>
        redirectResponse.headers.append('Set-Cookie', cookie),
      );
      return redirectResponse;
    }

    if (claims && isAuthPage) {
      // 이미 로그인됨: 대시보드로 리다이렉트
      const locale = request.nextUrl.pathname.split('/')[1] ?? 'en';
      const dashboardUrl = new URL(
        `/${locale}${ADMIN_ROUTES.DASHBOARD}`,
        request.url,
      );
      const redirectResponse = NextResponse.redirect(dashboardUrl);
      response.headers.getSetCookie?.()?.forEach((cookie) =>
        redirectResponse.headers.append('Set-Cookie', cookie),
      );
      return redirectResponse;
    }
  }

  const countryCode = request.headers.get('x-vercel-ip-country') ?? 'US';
  if (countryCode) {
    response.headers.append(
      'Set-Cookie',
      `countryCode=${countryCode}; Path=/; SameSite=Lax`,
    );
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
