import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'as-needed'
});

export function middleware(request: NextRequest) {
  const userLocale = request.cookies.get('user-locale')?.value;

  const locale = routing.locales.find((loc) => loc === userLocale);

  if (locale) {
    const { pathname } = request.nextUrl;
    const hasLocaleInPath = routing.locales.some((loc) =>
      pathname.startsWith(`/${loc}`)
    );

    if (!hasLocaleInPath) {
      const newUrl = new URL(`/${locale}${pathname}`, request.url);
      return NextResponse.redirect(newUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
