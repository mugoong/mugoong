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
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          !activeCity
            ? 'bg-primary-50 text-primary-600 border border-primary-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-200 hover:text-primary-600'
        }`}
      >
        📍 {t('nav.allCities')}
      </Link>
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`${basePath}?city=${city.slug}`}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeCity === city.slug
              ? 'bg-primary-50 text-primary-600 border border-primary-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-200 hover:text-primary-600'
          }`}
        >
          {t(city.labelKey)}
        </Link>
      ))}
    </div>
  );
}
