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
        className={`rounded-lg px-4 py-2 text-sm transition-colors ${
          !activeCity
            ? 'bg-primary-500 text-white border border-primary-500 font-bold shadow-sm'
            : 'bg-white text-gray-400 border border-gray-200 font-medium opacity-60 hover:opacity-100 hover:border-primary-300 hover:text-primary-600'
        }`}
      >
        📍 {t('nav.allCities')}
      </Link>
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`${basePath}?city=${city.slug}`}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${
            activeCity === city.slug
              ? 'bg-primary-500 text-white border border-primary-500 font-bold shadow-sm'
              : 'bg-white text-gray-400 border border-gray-200 font-medium opacity-60 hover:opacity-100 hover:border-primary-300 hover:text-primary-600'
          }`}
        >
          {t(city.labelKey)}
        </Link>
      ))}
    </div>
  );
}
