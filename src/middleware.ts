import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';
import type { Locale } from './i18n/routing';

// Browser language code → supported locale
// 'ko' (Korean) is intentionally absent: Korean browser → English
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
    const primary = lang.split('-')[0]; // e.g. 'zh-TW' → 'zh'
    if (browserLangToLocale[primary]) return browserLangToLocale[primary];
    if (primary === 'en') return 'en';
    // 'ko' and all unmapped languages fall through to English
  }
  return 'en';
}

const intlMiddleware = createMiddleware(routing);

// Admin paths that don't require authentication
const ADMIN_PUBLIC_PATHS = ['/admin/login'];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Admin protection ──────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Allow the login page through unconditionally
    if (ADMIN_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
      return NextResponse.next();
    }

    // For all other /admin/* paths: verify a valid Supabase session exists.
    // The actual admin_users table check happens inside AdminShell (client-side).
    const response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // ── Intl middleware (customer-facing pages) ───────────────────────────
  // If the URL already has an explicit locale prefix (e.g. /ja/..., /zh/...)
  // the user navigated here deliberately — respect it as-is
  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocalePrefix) {
    return intlMiddleware(request);
  }

  // For all other URLs: always detect from the current browser's Accept-Language.
  // Cookies are NOT checked — browser language always wins.
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const detectedLocale = detectLocaleFromBrowser(acceptLanguage);

  if (detectedLocale !== 'en') {
    // Internally rewrite to the locale-prefixed path so next-intl serves the
    // correct language. The browser URL stays unchanged (no visible redirect).
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // English (includes Korean, and any unmapped language): serve as-is
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Admin pages — now handled by this middleware
    '/admin',
    '/admin/:path*',
    // Customer-facing pages (intl)
    '/',
    '/(en|ko|ja|zh|fr|de|es)/:path*',
    '/((?!api|_next|_vercel|admin|ops|.*\\..*).*)'],
};
