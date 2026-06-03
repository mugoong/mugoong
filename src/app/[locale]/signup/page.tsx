'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

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

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-0">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
            s < step ? 'bg-gray-900 text-white' :
            s === step ? 'bg-primary-500 text-white ring-4 ring-primary-100' :
            'bg-gray-100 text-gray-400'
          }`}>
            {s < step ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : s}
          </div>
          {s < 3 && (
            <div className={`h-0.5 w-12 sm:w-16 transition-all ${s < step ? 'bg-gray-900' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const stepLabels = ['Create Account', 'Personal Info', 'Your Interests'];

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const initialStep = parseInt(searchParams.get('step') ?? '1', 10);
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Step 1
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [nationalityOpen, setNationalityOpen] = useState(false);

  // Step 3
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (initialStep >= 2) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) router.push(`/${locale}/signup`);
      });
    }
  }, [initialStep, locale, router]);

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setEmailSent(true);
    setLoading(false);
  };

  const handlePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!nationality) { setError('Please select your nationality.'); return; }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInterests = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Session expired. Please log in again.'); setLoading(false); return; }

    const { error } = await supabase.from('user_profiles').upsert({
      id: user.id,
      email: user.email ?? '',
      name: name.trim(),
      nationality,
      phone: phone.trim(),
      birthday: birthday || null,
      interests,
      profile_complete: true,
    });

    if (error) { setError(error.message); setLoading(false); return; }
    router.push(`/${locale}/account`);
  };

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredNationalities = nationalitySearch
    ? NATIONALITIES.filter((n) => n.toLowerCase().includes(nationalitySearch.toLowerCase()))
    : NATIONALITIES;

  if (emailSent) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
            <svg className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="mb-1 text-gray-500">We sent a verification link to</p>
          <p className="mb-6 font-semibold text-gray-900">{email}</p>
          <p className="text-sm text-gray-400">Click the link in the email to activate your account. After verifying, you'll complete your profile.</p>
          <p className="mt-6 text-sm text-gray-400">
            Didn't receive it?{' '}
            <button onClick={handleEmailSignup as any} className="font-medium text-primary-600 hover:underline">Resend</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">{stepLabels[step - 1]}</p>
        </div>

        <StepIndicator step={step} />

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ─── STEP 1: Create Account ─── */}
          {step === 1 && (
            <div>
              <button
                onClick={handleGoogleSignup}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">or sign up with email</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Min. 8 characters"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
                >
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary-600 hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* ─── STEP 2: Personal Info ─── */}
          {step === 2 && (
            <form onSubmit={handlePersonalInfo} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="relative">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Nationality <span className="text-red-400">*</span></label>
                <button
                  type="button"
                  onClick={() => setNationalityOpen(!nationalityOpen)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition focus:ring-2 focus:ring-primary-100 ${
                    nationality ? 'border-gray-200 text-gray-900' : 'border-gray-200 text-gray-400'
                  }`}
                >
                  <span>{nationality || 'Select your country'}</span>
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
                            className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-primary-50 hover:text-primary-700 ${
                              nationality === n ? 'bg-primary-50 font-medium text-primary-700' : 'text-gray-700'
                            }`}
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
                className="mt-2 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Continue →
              </button>
            </form>
          )}

          {/* ─── STEP 3: Interests ─── */}
          {step === 3 && (
            <form onSubmit={handleInterests}>
              <p className="mb-5 text-sm text-gray-500">Select everything that interests you — we'll personalise your MUGOONG experience.</p>
              <div className="space-y-5">
                {INTEREST_GROUPS.map((group) => (
                  <div key={group}>
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">{group}</p>
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
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-2.5 text-sm text-primary-700">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{interests.length} interest{interests.length > 1 ? 's' : ''} selected</span>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
                >
                  {loading ? 'Saving…' : 'Complete Setup 🎉'}
                </button>
              </div>

              {interests.length === 0 && (
                <p className="mt-3 text-center text-xs text-gray-400">You can always update your interests later</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
