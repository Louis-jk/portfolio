import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// export default createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. next-intl 미들웨어 인스턴스 생성
  const handleI18nRouting = createMiddleware(routing);

  // 2. 실행 (여기서 i18n 관련 rewrite/redirect가 결정됨)
  const response = handleI18nRouting(request);

  if (pathname.includes('success-gate')) {
    console.log('✅ Admin Path Detected:', pathname);
  }

  // next-intl 미들웨어 실행
  const countryCode = request.headers.get('x-vercel-ip-country') ?? 'US';
  // const response = createMiddleware(routing)(request);

  // countryCode 쿠키 저장 (HttpOnly 빼야 프론트에서 읽을 수 있음)
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
