'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import type { User } from '@supabase/supabase-js';

const NATIONALITIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand',
  'Japan', 'China (Mainland)', 'Taiwan', 'Hong Kong', 'South Korea', 'Mongolia',
  'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia',
  'Myanmar', 'Cambodia', 'Laos', 'Brunei', 'Timor-Leste',
  'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan',
  'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'Jordan', 'Israel', 'Turkey', 'Iran', 'Iraq', 'Lebanon', 'Syria', 'Yemen',
  'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Belgium',
  'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece',
  'Portugal', 'Ireland', 'Scotland', 'Wales', 'Russia', 'Ukraine', 'Belarus',
  'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Venezuela',
  'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay',
  'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Ghana', 'Morocco', 'Ethiopia',
  'Other',
];

const INTERESTS = [
  { id: 'korean-food', label: 'Korean Food', emoji: '🍜', group: 'Food & Drink' },
  { id: 'korean-bbq', label: 'Korean BBQ', emoji: '🥩', group: 'Food & Drink' },
  { id: 'street-food', label: 'Street Food', emoji: '🥘', group: 'Food & Drink' },
  { id: 'bars-nightlife', label: 'Bars & Nightlife', emoji: '🍺', group: 'Food & Drink' },
  { id: 'vegetarian-halal', label: 'Vegetarian / Halal', emoji: '🌿', group: 'Food & Drink' },
  { id: 'cafes-coffee', label: 'Cafes & Coffee', emoji: '☕', group: 'Food & Drink' },
  { id: 'skin-clinic', label: 'Skin Clinic', emoji: '✨', group: 'K-Beauty & Wellness' },
  { id: 'hair-makeup', label: 'Hair & Makeup', emoji: '💇', group: 'K-Beauty & Wellness' },
  { id: 'massage-spa', label: 'Massage & Spa', emoji: '💆', group: 'K-Beauty & Wellness' },
  { id: 'jjimjilbang', label: 'Jjimjilbang / Sauna', emoji: '🛁', group: 'K-Beauty & Wellness' },
  { id: 'traditional-culture', label: 'Traditional Culture', emoji: '🏯', group: 'Culture & Activities' },
  { id: 'kpop-entertainment', label: 'K-Pop & Entertainment', emoji: '🎵', group: 'Culture & Activities' },
  { id: 'cooking-classes', label: 'Cooking Classes', emoji: '👨‍🍳', group: 'Culture & Activities' },
  { id: 'local-experience', label: 'Local Experiences', emoji: '🎭', group: 'Culture & Activities' },
  { id: 'historical-temples', label: 'Historical Sites & Temples', emoji: '⛩️', group: 'Culture & Activities' },
  { id: 'hiking-nature', label: 'Hiking & Nature', emoji: '🥾', group: 'Outdoor & Sports' },
  { id: 'sports-adventure', label: 'Sports & Adventure', emoji: '🏄', group: 'Outdoor & Sports' },
  { id: 'fashion-shopping', label: 'Fashion & Shopping', emoji: '🛍️', group: 'Shopping & Travel' },
  { id: 'markets-souvenirs', label: 'Markets & Souvenirs', emoji: '🏪', group: 'Shopping & Travel' },
  { id: 'public-transport', label: 'Public Transportation', emoji: '🚇', group: 'Shopping & Travel' },
  { id: 'day-trips', label: 'Day Trips', emoji: '🗺️', group: 'Shopping & Travel' },
];

const INTEREST_GROUPS = ['Food & Drink', 'K-Beauty & Wellness', 'Culture & Activities', 'Outdoor & Sports', 'Shopping & Travel'];

type Profile = {
  name: string;
  nationality: string;
  phone: string;
  birthday: string | null;
  interests: string[];
  profile_complete: boolean;
};

export default function AccountPage() {
  const router = useRouter();
  const locale = useLocale();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'interests'>('profile');

  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalitySearch, setNationalitySearch] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push(`/${locale}/login`); return; }
      setUser(user);
      const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setName(data.name);
        setNationality(data.nationality);
        setPhone(data.phone);
        setBirthday(data.birthday ?? '');
        setInterests(data.interests ?? []);
      }
      setLoading(false);
    });
  }, [locale, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    const supabase = createClient();
    const { error } = await supabase.from('user_profiles').upsert({
      id: user!.id,
      email: user!.email ?? '',
      name: name.trim(),
      nationality,
      phone: phone.trim(),
      birthday: birthday || null,
      interests,
      profile_complete: true,
    });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const toggleInterest = (id: string) => {
    setInterests((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  const filteredNationalities = nationalitySearch
    ? NATIONALITIES.filter((n) => n.toLowerCase().includes(nationalitySearch.toLowerCase()))
    : NATIONALITIES;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  const initials = name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Profile header */}
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-xl font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{name || 'Your Account'}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {nationality && (
              <p className="mt-0.5 text-xs text-gray-400">{nationality}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl border border-gray-200 bg-white p-1">
          {(['profile', 'interests'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'profile' ? 'Personal Info' : 'My Interests'}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSaveProfile}>
          {/* ── Profile tab ── */}
          {activeTab === 'profile' && (
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400"
                />
                <p className="mt-1 text-xs text-gray-400">Email cannot be changed here.</p>
              </div>

              <div className="relative">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Nationality</label>
                <button
                  type="button"
                  onClick={() => setNationalityOpen(!nationalityOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm transition focus:ring-2 focus:ring-primary-100"
                >
                  <span className={nationality ? 'text-gray-900' : 'text-gray-400'}>{nationality || 'Select country'}</span>
                  <svg className={`h-4 w-4 text-gray-400 transition-transform ${nationalityOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {nationalityOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="p-2">
                      <input
                        type="text"
                        value={nationalitySearch}
                        onChange={(e) => setNationalitySearch(e.target.value)}
                        placeholder="Search country..."
                        autoFocus
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                      />
                    </div>
                    <ul className="max-h-52 overflow-y-auto pb-2">
                      {filteredNationalities.map((n) => (
                        <li key={n}>
                          <button
                            type="button"
                            onClick={() => { setNationality(n); setNationalityOpen(false); setNationalitySearch(''); }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-primary-50 hover:text-primary-700 ${nationality === n ? 'bg-primary-50 font-medium text-primary-700' : 'text-gray-700'}`}
                          >
                            {n}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+82 10 1234 5678"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Date of birth</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* ── Interests tab ── */}
          {activeTab === 'interests' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="mb-6 text-sm text-gray-500">Select everything that interests you — we'll personalise your MUGOONG experience.</p>
              <div className="space-y-6">
                {INTEREST_GROUPS.map((group) => (
                  <div key={group}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{group}</p>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.filter((i) => i.group === group).map((interest) => {
                        const selected = interests.includes(interest.id);
                        return (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => toggleInterest(interest.id)}
                            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                              selected
                                ? 'bg-primary-500 text-white shadow-sm ring-2 ring-primary-200'
                                : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-primary-50 hover:text-primary-600 hover:ring-primary-200'
                            }`}
                          >
                            <span>{interest.emoji}</span>
                            <span>{interest.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {interests.length > 0 && (
                <div className="mt-5 flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-2.5 text-sm text-primary-700">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{interests.length} interest{interests.length > 1 ? 's' : ''} selected</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-6 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Interests'}
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to MUGOONG
          </Link>
        </div>
      </div>
    </div>
  );
}
