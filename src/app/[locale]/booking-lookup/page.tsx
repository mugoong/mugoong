'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  confirmed: 'bg-green-50 text-green-700 ring-green-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
  completed: 'bg-blue-50 text-blue-700 ring-blue-200',
};

type BookingResult = {
  id: string;
  booking_number: string;
  listing_title: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  total_price: number;
  currency: string;
  status: string;
  created_at: string;
  customer_name: string;
};

export default function BookingLookupPage() {
  const locale = useLocale();
  const [bookingNumber, setBookingNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BookingResult | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    const res = await fetch(
      `/api/bookings/lookup?booking_number=${encodeURIComponent(bookingNumber.trim())}&email=${encodeURIComponent(email.trim())}`
    );
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || 'Booking not found.');
      return;
    }
    setResult(json);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Guest Booking Lookup</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the booking number from your confirmation email
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {!result ? (
            <form onSubmit={handleLookup} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Booking Number
                </label>
                <input
                  type="text"
                  value={bookingNumber}
                  onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. MG-ABC123"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm uppercase tracking-wider outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email used at booking
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                {loading ? 'Looking up…' : 'Find My Booking'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Have an account?{' '}
                <Link href="/login" className="font-semibold text-primary-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Booking Found</p>
                  <p className="font-mono text-xs text-gray-400">#{result.booking_number}</p>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[result.status] ?? 'bg-gray-50 text-gray-600 ring-gray-200'}`}
                  >
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Booked{' '}
                    {new Date(result.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900">{result.listing_title}</h2>

                <dl className="divide-y divide-gray-100">
                  {[
                    {
                      label: 'Date',
                      value: new Date(result.booking_date + 'T00:00:00').toLocaleDateString('en-GB', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      }),
                    },
                    { label: 'Time', value: result.booking_time },
                    { label: 'Guests', value: `${result.guests} guest${result.guests !== 1 ? 's' : ''}` },
                    {
                      label: 'Total',
                      value: result.total_price > 0
                        ? `₩${result.total_price.toLocaleString()}`
                        : 'Free / Request',
                    },
                    { label: 'Name', value: result.customer_name },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5 text-sm">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-medium text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="mt-5 text-center text-sm text-gray-500">
                Questions?{' '}
                <a href="mailto:support@mugoong.com" className="font-semibold text-primary-600 hover:underline">
                  support@mugoong.com
                </a>
              </p>

              <button
                onClick={() => { setResult(null); setBookingNumber(''); setEmail(''); }}
                className="mt-4 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Look up another booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
