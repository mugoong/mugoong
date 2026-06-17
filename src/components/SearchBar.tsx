'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

type Result = {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  image_url: string;
  price: number;
  city: string;
};

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url =
          process.env.NEXT_PUBLIC_SUPABASE_URL +
          `/rest/v1/listings?published=eq.true&title=ilike.*${encodeURIComponent(q)}*&select=id,slug,title,category,subcategory,image_url,price,city&limit=6&order=featured.desc`;
        const res = await fetch(url, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
            Authorization: 'Bearer ' + (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''),
          },
        });
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSelect = (item: Result) => {
    setOpen(false);
    setQuery('');
    router.push(`/${item.category}/${item.subcategory}/${item.slug}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const cityLabel = (city: string) =>
    city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex items-center overflow-hidden rounded-full bg-white shadow-2xl"
      >
        <div className="flex flex-1 items-center gap-2 px-4 py-2 sm:px-5 sm:py-3.5">
          <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder={placeholder}
            className="w-full text-xs sm:text-sm text-gray-700 placeholder-gray-400 outline-none"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={handleClear} className="flex-shrink-0 text-gray-300 hover:text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 transition hover:bg-black sm:h-10 sm:w-10"
          style={{ margin: '4px' }}
        >
          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-5 text-sm text-gray-400">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-gray-400">No results for "{query}"</div>
          ) : (
            <ul>
              {results.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseDown={() => handleSelect(item)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-primary-50 ${i < results.length - 1 ? 'border-b border-gray-50' : ''}`}
                  >
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=80&q=60'}
                      alt={item.title}
                      className="h-11 w-11 flex-shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-400">{cityLabel(item.city)} · {item.category}</p>
                    </div>
                    {item.price > 0 && (
                      <span className="flex-shrink-0 text-sm font-semibold text-primary-600">
                        From ${item.price}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onMouseDown={handleSubmit as never}
                  className="flex w-full items-center justify-center gap-2 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  See all results for "{query}"
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
