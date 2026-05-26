'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-xl items-center overflow-hidden rounded-full bg-white shadow-2xl"
    >
      <div className="flex flex-1 items-center gap-2 px-4 py-2 sm:px-5 sm:py-3.5">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full text-xs sm:text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
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
  );
}
