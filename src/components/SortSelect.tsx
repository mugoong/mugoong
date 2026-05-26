'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@/lib/sort-listings';

export default function SortSelect({ activeSort }: { activeSort?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = activeSort || 'top';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'top') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="relative shrink-0">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M10 17h4" />
        </svg>
      </span>
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none cursor-pointer rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-8 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-primary-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
}
