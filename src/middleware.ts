import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// export default createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const countryCode = await fetch('http://ip-api.com/json/')
    .then((res) => res.json())
    .then((data) => {
      return data.countryCode;
    })
    .catch((error) => console.error('Error fetching country:', error));

  // next-intl 미들웨어 실행
  const response = createMiddleware(routing)(request);

  // countryCode 쿠키 저장 (HttpOnly 빼야 프론트에서 읽을 수 있음)
  if (countryCode) {
    response.headers.append(
      'Set-Cookie',
      `countryCode=${countryCode}; Path=/; SameSite=Lax`
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
