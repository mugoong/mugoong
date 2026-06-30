'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ReviewRow } from '@/lib/supabase/types';

type ReviewsData = {
  reviews: ReviewRow[];
  canReview: boolean;
  isAdmin: boolean;
  myReview: ReviewRow | null;
  bookingDate: string | null;
};

const NATIONALITY_FLAG: Record<string, string> = {
  'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'Canada': '🇨🇦',
  'Australia': '🇦🇺', 'New Zealand': '🇳🇿', 'Japan': '🇯🇵',
  'China (Mainland)': '🇨🇳', 'Taiwan': '🇹🇼', 'Hong Kong': '🇭🇰',
  'South Korea': '🇰🇷', 'Mongolia': '🇲🇳', 'Singapore': '🇸🇬',
  'Malaysia': '🇲🇾', 'Thailand': '🇹🇭', 'Vietnam': '🇻🇳',
  'Philippines': '🇵🇭', 'Indonesia': '🇮🇩', 'India': '🇮🇳',
  'Pakistan': '🇵🇰', 'Bangladesh': '🇧🇩', 'Sri Lanka': '🇱🇰',
  'Nepal': '🇳🇵', 'United Arab Emirates': '🇦🇪', 'Saudi Arabia': '🇸🇦',
  'Qatar': '🇶🇦', 'Kuwait': '🇰🇼', 'Bahrain': '🇧🇭', 'Oman': '🇴🇲',
  'Jordan': '🇯🇴', 'Israel': '🇮🇱', 'Turkey': '🇹🇷', 'Iran': '🇮🇷',
  'France': '🇫🇷', 'Germany': '🇩🇪', 'Spain': '🇪🇸', 'Italy': '🇮🇹',
  'Netherlands': '🇳🇱', 'Belgium': '🇧🇪', 'Switzerland': '🇨🇭',
  'Austria': '🇦🇹', 'Sweden': '🇸🇪', 'Norway': '🇳🇴', 'Denmark': '🇩🇰',
  'Finland': '🇫🇮', 'Poland': '🇵🇱', 'Czech Republic': '🇨🇿',
  'Hungary': '🇭🇺', 'Romania': '🇷🇴', 'Bulgaria': '🇧🇬', 'Greece': '🇬🇷',
  'Portugal': '🇵🇹', 'Ireland': '🇮🇪', 'Russia': '🇷🇺', 'Ukraine': '🇺🇦',
  'Mexico': '🇲🇽', 'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'Colombia': '🇨🇴',
  'Chile': '🇨🇱', 'Peru': '🇵🇪', 'South Africa': '🇿🇦', 'Egypt': '🇪🇬',
  'Nigeria': '🇳🇬', 'Kenya': '🇰🇪', 'Ghana': '🇬🇭', 'Morocco': '🇲🇦',
  'Other': '🌍',
};

const NATIONALITIES = Object.keys(NATIONALITY_FLAG);

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}>
          <svg className={`h-7 w-7 transition-colors ${n <= (hover || value) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={`h-4 w-4 ${n <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewerInfo({ name, nationality }: { name: string; nationality: string }) {
  const flag = nationality ? (NATIONALITY_FLAG[nationality] ?? '🌍') : null;
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
        {name[0]?.toUpperCase() ?? '?'}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          {flag && <span className="text-base leading-none">{flag}</span>}
          <p className="text-sm font-semibold text-gray-800">{name}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({
  listingId,
  listingTitle,
  locale,
}: {
  listingId: string;
  listingTitle: string;
  locale: string;
}) {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [customName, setCustomName] = useState('');
  const [customNationality, setCustomNationality] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`/api/reviews?listing_id=${listingId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [listingId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 10) { setFormError('Please write at least 10 characters.'); return; }
    setSubmitting(true);
    setFormError('');
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listingId,
        listing_title: listingTitle,
        rating,
        title,
        content,
        custom_name: customName,
        nationality: customNationality,
      }),
    });
    const json = await res.json();
    if (!res.ok) { setFormError(json.error || 'Failed to submit'); setSubmitting(false); return; }
    setTitle(''); setContent(''); setRating(5); setCustomName(''); setCustomNationality('');
    setSubmitting(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  const reviews = data?.reviews ?? [];
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div>
      {/* Rating summary */}
      {reviews.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{avgRating}</div>
            <StarDisplay rating={Math.round(Number(avgRating))} />
            <p className="mt-1 text-xs text-gray-400">
              {reviews.length} MUGOONG {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      )}

      {/* Write a review / status */}
      {data === null ? null : !data.canReview && !data.myReview ? (
        <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-5 text-center">
          <p className="text-sm text-gray-500">
            Only confirmed guests can leave a review.{' '}
            <a href={`/${locale}/login`} className="font-medium text-primary-600 hover:underline">Sign in</a>
            {' '}or book this experience first.
          </p>
        </div>
      ) : data.myReview ? (
        <div className="mb-6 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm text-primary-700">
          You have reviewed this listing. Visit{' '}
          <a href={`/${locale}/account`} className="underline">My Account → My Reviews</a>
          {' '}to edit or delete within 2 weeks of your booking date.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Write a Review</h3>

          {/* Admin-only: custom name & nationality */}
          {data.isAdmin && (
            <div className="mb-4 grid gap-3 rounded-lg border border-orange-100 bg-orange-50 p-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-orange-700">Reviewer Name (Admin)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sarah J."
                  className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-orange-700">Nationality (Admin)</label>
                <select
                  value={customNationality}
                  onChange={(e) => setCustomNationality(e.target.value)}
                  className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                >
                  <option value="">Select nationality</option>
                  {NATIONALITIES.map((n) => (
                    <option key={n} value={n}>{NATIONALITY_FLAG[n]} {n}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formError && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
          )}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Rating *</label>
            <StarInput value={rating} onChange={setRating} />
          </div>
          <div className="mb-3">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Title <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Review * <span className="text-xs font-normal text-gray-400">(min. 10 characters)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Share your honest experience..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          No MUGOONG reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <ReviewerInfo name={r.reviewer_name} nationality={r.nationality} />
                <StarDisplay rating={r.rating} />
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                {new Date(r.created_at).toLocaleDateString('en-GB', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
              {r.title && <p className="mt-3 font-semibold text-gray-800">{r.title}</p>}
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{r.content}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-medium text-primary-500">Verified MUGOONG Guest</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
