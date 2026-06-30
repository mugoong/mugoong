'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import type { User } from '@supabase/supabase-js';
import type { UserProfileRow, BookingRow, ReviewRow } from '@/lib/supabase/types';

const INTEREST_LABELS: Record<string, { label: string; emoji: string }> = {
  'korean-food': { label: 'Korean Food', emoji: '🍜' },
  'korean-bbq': { label: 'Korean BBQ', emoji: '🥩' },
  'street-food': { label: 'Street Food', emoji: '🥘' },
  'bars-nightlife': { label: 'Bars & Nightlife', emoji: '🍺' },
  'vegetarian-halal': { label: 'Vegetarian / Halal', emoji: '🌿' },
  'cafes-coffee': { label: 'Cafes & Coffee', emoji: '☕' },
  'skin-clinic': { label: 'Skin Clinic', emoji: '✨' },
  'hair-makeup': { label: 'Hair & Makeup', emoji: '💇' },
  'massage-spa': { label: 'Massage & Spa', emoji: '💆' },
  'jjimjilbang': { label: 'Jjimjilbang / Sauna', emoji: '🛁' },
  'traditional-culture': { label: 'Traditional Culture', emoji: '🏯' },
  'kpop-entertainment': { label: 'K-Pop & Entertainment', emoji: '🎵' },
  'cooking-classes': { label: 'Cooking Classes', emoji: '👨‍🍳' },
  'local-experience': { label: 'Local Experiences', emoji: '🎭' },
  'historical-temples': { label: 'Historical Sites & Temples', emoji: '⛩️' },
  'hiking-nature': { label: 'Hiking & Nature', emoji: '🥾' },
  'sports-adventure': { label: 'Sports & Adventure', emoji: '🏄' },
  'fashion-shopping': { label: 'Fashion & Shopping', emoji: '🛍️' },
  'markets-souvenirs': { label: 'Markets & Souvenirs', emoji: '🏪' },
  'public-transport': { label: 'Public Transportation', emoji: '🚇' },
  'day-trips': { label: 'Day Trips', emoji: '🗺️' },
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  confirmed: 'bg-green-50 text-green-700 ring-green-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
  completed: 'bg-blue-50 text-blue-700 ring-blue-200',
};

const NATIONALITIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand',
  'Japan', 'China (Mainland)', 'Taiwan', 'Hong Kong', 'South Korea', 'Mongolia',
  'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia',
  'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'Jordan', 'Israel', 'Turkey', 'Iran',
  'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Belgium',
  'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece',
  'Portugal', 'Ireland', 'Russia', 'Ukraine',
  'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru',
  'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Ghana', 'Morocco',
  'Other',
];

export default function AccountPage() {
  const router = useRouter();
  const locale = useLocale();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [tab, setTab] = useState<'profile' | 'bookings' | 'reviews'>('profile');
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNationality, setEditNationality] = useState('');
  const [editBirthday, setEditBirthday] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push(`/${locale}/login`);
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileData || !profileData.profile_complete) {
        router.push(`/${locale}/signup?step=2`);
        return;
      }

      setProfile(profileData as UserProfileRow);
      setEditName(profileData.name || '');
      setEditPhone(profileData.phone || '');
      setEditNationality(profileData.nationality || '');
      setEditBirthday(profileData.birthday || '');
      setLoading(false);
    });
  }, [locale, router]);

  useEffect(() => {
    if (!user || tab !== 'bookings') return;
    loadBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, tab, statusFilter]);

  useEffect(() => {
    if (!user || tab !== 'reviews') return;
    loadReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, tab]);

  const loadBookings = async () => {
    if (!user) return;
    setBookingsLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('bookings')
      .select('id, booking_number, listing_title, booking_date, booking_time, guests, total_price, currency, status, created_at')
      .order('created_at', { ascending: false });

    if (statusFilter) query = query.eq('status', statusFilter);

    const { data } = await query;
    setBookings((data ?? []) as BookingRow[]);
    setBookingsLoading(false);
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    const res = await fetch('/api/reviews?user=me');
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
    setReviewsLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setEditLoading(true);
    setEditError('');
    const supabase = createClient();
    const { error } = await supabase
      .from('user_profiles')
      .update({
        name: editName.trim(),
        phone: editPhone.trim(),
        nationality: editNationality,
        birthday: editBirthday || null,
      })
      .eq('id', user.id);

    if (error) { setEditError(error.message); setEditLoading(false); return; }

    setProfile((prev) =>
      prev
        ? { ...prev, name: editName.trim(), phone: editPhone.trim(), nationality: editNationality, birthday: editBirthday || null }
        : prev
    );
    setEditing(false);
    setEditLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const initials = profile.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email ?? '?')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-main">
          <div className="flex items-center gap-4 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex">
            {(['profile', 'bookings', 'reviews'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  tab === t
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'profile' ? 'Profile' : t === 'bookings' ? 'My Bookings' : 'My Reviews'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main py-8">

        {/* ─── PROFILE TAB ─── */}
        {tab === 'profile' && (
          <div className="mx-auto max-w-2xl space-y-5">

            {/* Personal info card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  {editError && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{editError}</div>
                  )}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">Full Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">Nationality</label>
                    <select
                      value={editNationality}
                      onChange={(e) => setEditNationality(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="">Select nationality</option>
                      {NATIONALITIES.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">Phone</label>
                    <input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+82 10 1234 5678"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">Date of Birth</label>
                    <input
                      type="date"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setEditing(false); setEditError(''); }}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={editLoading}
                      className="flex-1 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                    >
                      {editLoading ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <dl className="divide-y divide-gray-50">
                  {[
                    { label: 'Full Name', value: profile.name || '—' },
                    { label: 'Nationality', value: profile.nationality || '—' },
                    { label: 'Phone', value: profile.phone || '—' },
                    {
                      label: 'Date of Birth',
                      value: profile.birthday
                        ? new Date(profile.birthday + 'T00:00:00').toLocaleDateString('en-GB', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })
                        : '—',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 text-sm">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-medium text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-base font-semibold text-gray-900">My Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((id: string) => {
                    const info = INTEREST_LABELS[id];
                    if (!info) return null;
                    return (
                      <span
                        key={id}
                        className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 ring-1 ring-primary-200"
                      >
                        <span>{info.emoji}</span>
                        <span>{info.label}</span>
                      </span>
                    );
                  })}
                </div>
                <Link
                  href="/signup?step=3"
                  className="mt-4 inline-block text-xs text-primary-600 hover:underline"
                >
                  Update interests →
                </Link>
              </div>
            )}

            {/* Account info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-base font-semibold text-gray-900">Account</h2>
              <dl className="divide-y divide-gray-50">
                <div className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{user.email}</dd>
                </div>
                <div className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-gray-500">Member since</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* ─── MY BOOKINGS TAB ─── */}
        {tab === 'bookings' && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap gap-2">
              {(['', 'pending', 'confirmed', 'cancelled', 'completed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-300'
                  }`}
                >
                  {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {bookingsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
                <p className="text-5xl">🗺️</p>
                <h3 className="mt-4 text-lg font-semibold text-gray-700">No bookings yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your reservations will appear here once you make a booking.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-block rounded-xl bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
                >
                  Explore Experiences
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-gray-400">
                            #{booking.booking_number ?? booking.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[booking.status] ?? 'bg-gray-50 text-gray-600 ring-gray-200'}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <h3 className="mt-1.5 truncate text-base font-semibold text-gray-900">
                          {booking.listing_title}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>
                            {new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-GB', {
                              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </span>
                          <span>{booking.booking_time}</span>
                          <span>
                            {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {booking.total_price > 0 ? (
                          <p className="text-lg font-bold text-gray-900">
                            ₩{booking.total_price.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-green-600">Free / Request</p>
                        )}
                        <p className="mt-0.5 text-xs text-gray-400">
                          {new Date(booking.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── MY REVIEWS TAB ─── */}
        {tab === 'reviews' && (
          <div className="mx-auto max-w-2xl">
            {reviewsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
                <p className="text-4xl">⭐</p>
                <h3 className="mt-4 text-lg font-semibold text-gray-700">No reviews yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  After your booking you can leave a review within 2 weeks.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const editable = (() => {
                    const deadline = new Date(review.booking_date + 'T00:00:00');
                    deadline.setDate(deadline.getDate() + 14);
                    return new Date() <= deadline;
                  })();
                  const isEditing = editingReviewId === review.id;

                  const startEdit = () => {
                    setEditingReviewId(review.id);
                    setEditRating(review.rating);
                    setEditTitle(review.title);
                    setEditContent(review.content);
                    setReviewError('');
                  };

                  const cancelEdit = () => {
                    setEditingReviewId(null);
                    setReviewError('');
                  };

                  const saveEdit = async () => {
                    if (editContent.trim().length < 10) { setReviewError('At least 10 characters required.'); return; }
                    setReviewSaving(true);
                    setReviewError('');
                    const res = await fetch(`/api/reviews/${review.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ rating: editRating, title: editTitle, content: editContent }),
                    });
                    const json = await res.json();
                    if (!res.ok) { setReviewError(json.error || 'Failed to save'); setReviewSaving(false); return; }
                    setReviews(prev => prev.map(r => r.id === review.id ? json : r));
                    setEditingReviewId(null);
                    setReviewSaving(false);
                  };

                  const deleteReview = async () => {
                    if (!confirm('Delete this review?')) return;
                    const res = await fetch(`/api/reviews/${review.id}`, { method: 'DELETE' });
                    if (res.ok) setReviews(prev => prev.filter(r => r.id !== review.id));
                  };

                  return (
                    <div key={review.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.listing_title}</p>
                          <p className="text-xs text-gray-400">
                            Booked:{' '}
                            {new Date(review.booking_date + 'T00:00:00').toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                            {editable ? (
                              <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">
                                Editable
                              </span>
                            ) : (
                              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                                Edit window closed
                              </span>
                            )}
                          </p>
                        </div>
                        {editable && !isEditing && (
                          <div className="flex gap-2">
                            <button
                              onClick={startEdit}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={deleteReview}
                              className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
                          {reviewError && (
                            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{reviewError}</p>
                          )}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button key={n} type="button" onClick={() => setEditRating(n)}>
                                <svg className={`h-7 w-7 ${n <= editRating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            placeholder="Title (optional)"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                          />
                          <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={cancelEdit}
                              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveEdit}
                              disabled={reviewSaving}
                              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                            >
                              {reviewSaving ? 'Saving…' : 'Save'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <svg key={n} className={`h-4 w-4 ${n <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          {review.title && <p className="mt-2 font-semibold text-gray-800">{review.title}</p>}
                          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{review.content}</p>
                          <p className="mt-2 text-xs text-gray-400">
                            Written:{' '}
                            {new Date(review.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
