'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cities } from '@/lib/categories';

export default function CityFilter({
  activeCity,
  basePath,
}: {
  activeCity?: string;
  basePath: string;
}) {
  const t = useTranslations();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Link
        href={basePath}
        className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          !activeCity
            ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-200'
            : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-200 hover:text-primary-600'
        }`}
      >
        📍 {t('nav.allCities')}
      </Link>
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`${basePath}?city=${city.slug}`}
          className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeCity === city.slug
              ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-200'
              : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-200 hover:text-primary-600'
          }`}
        >
          {t(city.labelKey)}
        </Link>
      ))}
    </div>
  );
}
