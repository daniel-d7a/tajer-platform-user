import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const { locales } = routing;

// نوع الـ Locale من next-intl
type Locale = (typeof locales)[number];

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const userLocale = request.cookies.get('user-locale')?.value;
  
  const locale = userLocale as Locale;
  
  if (userLocale && locales.includes(locale)) {
    const { pathname } = request.nextUrl;
    
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
      request.nextUrl.pathname = `/${locale}${pathname}`;
      return NextResponse.redirect(request.nextUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};