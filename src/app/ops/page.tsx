'use client';

import Link from 'next/link';
import SiteMap from '@/components/ops/SiteMap';

const modules = [
  {
    href: '/ops/hr',
    title: '인사 / 노무',
    desc: '직원 정보, 연차 관리, 일정 캘린더',
    icon: '👤',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    features: ['직원 관리', '연차 관리', '캘린더'],
  },
  {
    href: '/ops/finance',
    title: '재무 / 회계',
    desc: '매출 현황, 예약 매출, 통계 분석',
    icon: '💰',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    features: ['매출 대시보드', '예약 매출', '통계'],
  },
  {
    href: '/ops/partners',
    title: '협력사 포털',
    desc: '협력사 관리, 리스팅, 정산',
    icon: '🤝',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    features: ['협력사 관리', '리스팅 관리', '비즈니스 설정'],
  },
];

export default function OpsHub() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
      }}
    >
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Glow */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full blur-[150px]"
          style={{
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 text-center">
          {/* Logo */}
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
            }}
          >
            M
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">MUGOONG OPS</h1>
          <p className="text-[15px]" style={{ color: '#64748b' }}>
            경영관리 통합 플랫폼
          </p>
        </div>
      </div>

      {/* Module Cards */}
      <div className="mx-auto -mt-4 max-w-6xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = mod.color + '40';
                e.currentTarget.style.boxShadow = `0 20px 40px ${mod.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top gradient accent */}
              <div className="h-1" style={{ background: mod.gradient }} />

              <div className="p-8">
                {/* Icon */}
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: mod.color + '15' }}
                >
                  {mod.icon}
                </div>

                {/* Title */}
                <h2 className="mb-2 text-xl font-bold text-white">{mod.title}</h2>
                <p className="mb-6 text-[13px]" style={{ color: '#94a3b8' }}>
                  {mod.desc}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {mod.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: mod.color }}
                      />
                      <span className="text-[12px]" style={{ color: '#64748b' }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold" style={{ color: mod.color }}>
                  접속하기
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Site Map */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <SiteMap />
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 py-6 text-center">
        <p className="text-[12px]" style={{ color: '#475569' }}>
          © 2026 Blossom Mugoong. All rights reserved.
        </p>
      </div>
    </div>
  );
}
