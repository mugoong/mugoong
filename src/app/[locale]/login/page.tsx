'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<'signin' | 'signup'>(
    searchParams.get('tab') === 'signup' ? 'signup' : 'signin'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const callbackError = searchParams.get('error');

  // ── Sign In state ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // ── Sign Up state ──
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [showSuPassword, setShowSuPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const switchTab = (t: 'signin' | 'signup') => {
    setError('');
    setTab(t);
  };

  // ── Handlers ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message);
      setLoading(false);
      return;
    }
    router.push(`/${locale}/account`);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleAppleAuth = async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/account`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setResetSent(true);
    setLoading(false);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (suPassword !== suConfirm) { setError('Passwords do not match.'); return; }
    if (suPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: suEmail,
      password: suPassword,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setEmailSent(true);
    setLoading(false);
  };

  // ── Email sent confirmation ──
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
          <p className="mb-6 font-semibold text-gray-900">{suEmail}</p>
          <p className="text-sm text-gray-400">Click the link in the email to activate your account. After verifying, you'll complete your profile.</p>
          <p className="mt-6 text-sm text-gray-400">
            Didn't receive it?{' '}
            <button onClick={handleEmailSignup as never} className="font-medium text-primary-600 hover:underline">Resend</button>
          </p>
        </div>
      </div>
    );
  }

  // ── Password reset view ──
  if (showReset) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            {resetSent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Email sent!</h2>
                <p className="mt-2 text-sm text-gray-500">Check your inbox for a password reset link.</p>
                <button onClick={() => { setShowReset(false); setResetSent(false); setError(''); }} className="mt-6 text-sm font-medium text-primary-600 hover:underline">
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => { setShowReset(false); setError(''); }} className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                <h2 className="mb-1 text-xl font-bold text-gray-900">Reset password</h2>
                <p className="mb-6 text-sm text-gray-500">Enter your email and we'll send a reset link.</p>
                {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                  <button type="submit" disabled={loading} className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50">
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Main auth page ──
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {tab === 'signin' ? 'Welcome back' : 'Join MUGOONG'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {tab === 'signin' ? 'Sign in to your account' : 'Create your free account'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-xl border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => switchTab('signin')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {(error || callbackError) && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error || 'Authentication failed. Please try again.'}</span>
            </div>
          )}

          {/* Social login buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
            >
              <GoogleIcon />
              {tab === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
            </button>
            <button
              onClick={handleAppleAuth}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-900 bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black disabled:opacity-50"
            >
              <AppleIcon />
              {tab === 'signin' ? 'Continue with Apple' : 'Sign up with Apple'}
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">or continue with email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* ── SIGN IN FORM ── */}
          {tab === 'signin' && (
            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <button type="button" onClick={() => { setError(''); setShowReset(true); }} className="text-xs text-primary-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* ── SIGN UP FORM ── */}
          {tab === 'signup' && (
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showSuPassword ? 'text' : 'password'}
                    value={suPassword}
                    onChange={(e) => setSuPassword(e.target.value)}
                    required
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                  <button type="button" onClick={() => setShowSuPassword(!showSuPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <EyeIcon open={showSuPassword} />
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm password</label>
                <input
                  type={showSuPassword ? 'text' : 'password'}
                  value={suConfirm}
                  onChange={(e) => setSuConfirm(e.target.value)}
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
          )}

          <p className="mt-6 text-center text-xs text-gray-400">
            {tab === 'signin' ? (
              <>No account?{' '}<button onClick={() => switchTab('signup')} className="font-semibold text-primary-600 hover:underline">Create one free</button></>
            ) : (
              <>Already have an account?{' '}<button onClick={() => switchTab('signin')} className="font-semibold text-primary-600 hover:underline">Sign in</button></>
            )}
          </p>
        </div>

        {/* Guest booking lookup */}
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-700">Booked as a guest?</p>
          <p className="mt-1 text-xs text-gray-400">Track your booking without an account</p>
          <Link
            href="/booking-lookup"
            className="mt-3 inline-block rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Guest Booking Lookup →
          </Link>
        </div>
      </div>
    </div>
  );
}
