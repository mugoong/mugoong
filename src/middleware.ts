import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import type { Locale } from './i18n/routing';

// Map country codes to locales
const countryToLocale: Record<string, Locale> = {
  // Japanese
  JP: 'ja',
  // Chinese
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', SG: 'zh',
  // French
  FR: 'fr', BE: 'fr', CH: 'fr', CA: 'fr', LU: 'fr',
  // German
  DE: 'de', AT: 'de',
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
};

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Skip locale detection if user already has a locale in the URL
  const pathname = request.nextUrl.pathname;
  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocalePrefix && pathname === '/') {
    // Try to detect locale from Vercel's geo headers or Accept-Language
    const country = request.headers.get('x-vercel-ip-country') ?? '';
    const detectedLocale = countryToLocale[country.toUpperCase()];

    if (detectedLocale) {
      // Set cookie so next-intl picks it up
      const response = intlMiddleware(request);
      response.cookies.set('NEXT_LOCALE', detectedLocale, {
        maxAge: 365 * 24 * 60 * 60,
      });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|ja|zh|fr|de|es)/:path*'],
};
