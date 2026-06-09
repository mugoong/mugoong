'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OpsLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // For now, simple redirect. Auth integration later.
    setTimeout(() => {
      router.push('/ops');
    }, 800);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Glow Effect */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
            }}
          >
            M
          </div>
          <h1 className="text-2xl font-bold text-white">MUGOONG OPS</h1>
          <p className="mt-1 text-[14px]" style={{ color: '#64748b' }}>
            경영관리 플랫폼에 로그인하세요
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          }}
        >
          <div className="mb-5">
            <label className="mb-1.5 block text-[13px] font-medium" style={{ color: '#94a3b8' }}>
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mugoong.com"
              className="w-full rounded-xl px-4 py-3 text-[14px] text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-[13px] font-medium" style={{ color: '#94a3b8' }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-[14px] text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-[14px] font-semibold text-white transition-all duration-300 hover:translate-y-[-1px] disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[12px]" style={{ color: '#475569' }}>
          © 2026 Blossom Mugoong. All rights reserved.
        </p>
      </div>
    </div>
  );
}
