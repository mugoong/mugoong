'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n/routing';
import { categories, cities } from '@/lib/categories';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      {/* Top bar */}
      <div className="container-main">
        <div className="relative flex items-center justify-between py-2 lg:py-4">
          {/* Mobile Spacer (for flex balance) */}
          <div className="w-10 lg:hidden" />

          {/* Mobile Logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center lg:hidden">
            <img src="/logo.png" alt="MUGOONG" className="h-[54px] w-auto" />
          </Link>

          {/* Desktop Navigation Structure */}
          <div className="hidden w-full items-center justify-between lg:flex">
            
            {/* Left Nav */}
            <nav className="flex flex-1 items-center justify-end gap-1 pr-6">
              {categories.slice(0, 2).map((cat) => (
                <div
                  key={cat.slug}
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
                  {/* Dropdown */}
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
              ))}
            </nav>

            {/* Center Logo */}
            <Link href="/" className="flex flex-shrink-0 items-center justify-center px-4">
              <img src="/logo.png" alt="MUGOONG" className="h-[80px] w-auto py-1" />
            </Link>

            {/* Right Nav & Utilities */}
            <div className="flex flex-1 items-center justify-between pl-6 text-nowrap">
              <nav className="flex items-center gap-1">
                {categories.slice(2).map((cat) => (
                  <div
                    key={cat.slug}
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
                    {/* Dropdown */}
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
                ))}
              </nav>

              {/* City & Language Selectors */}
              <div className="flex shrink-0 items-center gap-2">
                {/* City selector */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setCityMenuOpen(!cityMenuOpen)}
                    className="flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="whitespace-nowrap">{t('nav.allCities')}</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {cityMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                      <Link
                        href="/"
                        onClick={() => setCityMenuOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
                      >
                        {t('nav.allCities')}
                      </Link>
                      {cities.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/?city=${city.slug}`}
                          onClick={() => setCityMenuOpen(false)}
                          className="block rounded-lg px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
                        >
                          {t(city.labelKey)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language selector */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className="flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="whitespace-nowrap">{localeNames[locale]}</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {langMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                      {locales.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => switchLocale(loc)}
                          className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary-50 hover:text-primary-600 ${
                            loc === locale ? 'font-medium text-primary-600' : 'text-gray-600'
                          }`}
                        >
                          {localeNames[loc]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 lg:hidden"
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
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="container-main py-4">
            {/* City pills */}
            <div className="mb-4 flex flex-wrap gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-primary-500 px-4 py-1.5 text-xs font-medium text-white"
              >
                {t('nav.allCities')}
              </Link>
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/?city=${city.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600"
                >
                  {t(city.labelKey)}
                </Link>
              ))}
            </div>

            {/* Categories */}
            {categories.map((cat) => (
              <div key={cat.slug} className="border-t border-gray-50 py-3">
                <Link
                  href={`/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  {cat.icon} {t(cat.labelKey)}
                </Link>
                <div className="flex flex-wrap gap-2 pl-6">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${cat.slug}/${sub.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
                    >
                      {t(sub.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Language switcher mobile */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                {t('nav.language')}
              </p>
              <div className="flex flex-wrap gap-2">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      switchLocale(loc);
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      loc === locale
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-200 text-gray-600 hover:border-primary-500'
                    }`}
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
