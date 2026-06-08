'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n/routing';
import { categories, cities } from '@/lib/categories';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
  };

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setLangMenuOpen(false);
  };

  const CategoryDropdown = ({ cat }: { cat: (typeof categories)[number] }) => (
    <div
      className="relative shrink-0"
      onMouseEnter={() => setActiveDropdown(cat.slug)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <Link
        href={`/${cat.slug}`}
        className="block whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600"
      >
        {t(cat.labelKey)}
      </Link>
      {activeDropdown === cat.slug && (
        <div className="absolute left-0 top-full z-50 min-w-[220px] rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
          {cat.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/${cat.slug}/${sub.slug}`}
              className="block rounded-lg px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
            >
              {t(sub.labelKey)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="container-main">

        {/* ─── DESKTOP ─── */}
        {/* Logo is absolute at left:50% — always perfect center.            */}
        {/* Left 50% = cats 1&2 (right-aligned). Right 50% = cats 3&4 (left-aligned) + utilities pinned far right. */}
        <div className="relative hidden w-full items-center py-2 lg:flex" style={{ minHeight: '104px' }}>

          {/* Logo: absolute center — untouched by any sibling */}
          <Link href="/" className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <img src="/logo.png" alt="MUGOONG" className="h-[96px] w-auto py-1" />
          </Link>

          {/* Left 50%: categories 1 & 2, pushed toward logo */}
          <div className="flex w-1/2 items-center justify-end pr-[120px]">
            {categories.slice(0, 2).map((cat) => (
              <CategoryDropdown key={cat.slug} cat={cat} />
            ))}
          </div>

          {/* Right 50%: categories 3 & 4 close to logo, utilities at far right */}
          <div className="flex w-1/2 items-center pl-[120px]">
            {categories.slice(2).map((cat) => (
              <CategoryDropdown key={cat.slug} cat={cat} />
            ))}

            {/* Utilities: always pinned to right edge */}
            <div className="ml-auto flex items-center gap-1">

              {/* City selector */}
              <div
                className="relative"
                onMouseEnter={() => { setCityMenuOpen(true); setLangMenuOpen(false); }}
                onMouseLeave={() => setCityMenuOpen(false)}
              >
                <button className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{t('nav.allCities')}</span>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {cityMenuOpen && (
                  <div className="absolute right-0 top-full z-50 min-w-[180px] rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                    <Link href="/" onClick={() => setCityMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50">
                      {t('nav.allCities')}
                    </Link>
                    {cities.map((city) => (
                      <Link key={city.slug} href={`/city/${city.slug}`} onClick={() => setCityMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600">
                        {t(city.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Language selector */}
              <div
                className="relative"
                onMouseEnter={() => { setLangMenuOpen(true); setCityMenuOpen(false); }}
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                <button className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>{localeNames[locale]}</span>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full z-50 min-w-[160px] rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary-50 hover:text-primary-600 ${loc === locale ? 'font-medium text-primary-600' : 'text-gray-600'}`}
                      >
                        {localeNames[loc]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="mx-1 h-5 w-px bg-gray-200" />

              {/* Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setCityMenuOpen(false); setLangMenuOpen(false); }}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                      {(user.email ?? '?')[0].toUpperCase()}
                    </div>
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                      <p className="truncate px-3 py-1.5 text-xs text-gray-400">{user.email}</p>
                      <div className="my-1 border-t border-gray-100" />
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600">
                        My Account
                      </Link>
                      <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link href="/login" className="whitespace-nowrap rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── MOBILE ─── */}
        <div className="flex items-center justify-between py-3 lg:hidden">
          {/* Left: hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Center: logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img src="/logo.png" alt="MUGOONG" className="h-[60px] w-auto" />
          </Link>

          {/* Right: auth icon */}
          {user ? (
            <Link href="/account" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
              {(user.email ?? '?')[0].toUpperCase()}
            </Link>
          ) : (
            <Link href="/login" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* ─── MOBILE MENU (drawer) ─── */}
      {mobileMenuOpen && (
        <div
          className="overflow-y-auto border-t border-gray-100 bg-white lg:hidden"
          style={{ maxHeight: 'calc(100dvh - 70px)' }}
        >
          <div className="container-main py-4">

            {/* City pills */}
            <div className="mb-4 flex flex-wrap gap-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-primary-500 px-4 py-1.5 text-xs font-medium text-white">
                {t('nav.allCities')}
              </Link>
              {cities.map((city) => (
                <Link key={city.slug} href={`/city/${city.slug}`} onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600">
                  {t(city.labelKey)}
                </Link>
              ))}
            </div>

            {/* Categories */}
            {categories.map((cat) => (
              <div key={cat.slug} className="border-t border-gray-50 py-3">
                <Link href={`/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="mb-2 block text-sm font-semibold text-gray-800">
                  {cat.icon} {t(cat.labelKey)}
                </Link>
                <div className="flex flex-wrap gap-2 pl-6">
                  {cat.subcategories.map((sub) => (
                    <Link key={sub.slug} href={`/${cat.slug}/${sub.slug}`} onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600">
                      {t(sub.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Auth */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                      {(user.email ?? '?')[0].toUpperCase()}
                    </div>
                    <span className="max-w-[160px] truncate text-sm font-medium text-gray-700">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                      Account
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-xl bg-gray-900 py-2.5 text-center text-sm font-semibold text-white hover:bg-black">
                    Sign In / Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Language */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">{t('nav.language')}</p>
              <div className="flex flex-wrap gap-2">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { switchLocale(loc); setMobileMenuOpen(false); }}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${loc === locale ? 'bg-primary-500 text-white' : 'border border-gray-200 text-gray-600 hover:border-primary-500'}`}
                  >
                    {localeNames[loc]}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
