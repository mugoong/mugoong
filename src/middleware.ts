import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import type { Locale } from './i18n/routing';

// Supported locales and their matching browser language codes
// Korean (ko) is intentionally absent — Korean browsers get English
const browserLangToLocale: Record<string, Locale> = {
  ja: 'ja',
  zh: 'zh',
  fr: 'fr',
  de: 'de',
  es: 'es',
};

function detectLocaleFromBrowser(acceptLanguage: string): Locale {
  const langs = acceptLanguage
    .split(',')
    .map((part) => {
      const [lang, q] = part.trim().split(';q=');
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of langs) {
    const primary = lang.split('-')[0]; // 'zh-TW' → 'zh'
    if (browserLangToLocale[primary]) return browserLangToLocale[primary];
    if (primary === 'en') return 'en';
    // 'ko' and all other unmapped languages → fall through to English
  }
  return 'en';
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // If URL explicitly has a locale prefix (e.g. /ja/...) the user navigated here directly
  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocalePrefix) {
    return intlMiddleware(request);
  }

  // For all other visits: detect locale from browser Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const detectedLocale = detectLocaleFromBrowser(acceptLanguage);

  const response = intlMiddleware(request);
  response.cookies.set('NEXT_LOCALE', detectedLocale, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return response;
}

export const config = {
  matcher: ['/', '/(en|ja|zh|fr|de|es)/:path*', '/((?!api|_next|_vercel|admin|ops|.*\\..*).*)'],
};
