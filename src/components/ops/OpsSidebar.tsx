'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type OpsModule = 'hr' | 'finance' | 'partners';

interface OpsSidebarProps {
  module: OpsModule;
}

const moduleConfig: Record<OpsModule, {
  title: string;
  badge: string;
  color: string;
  gradient: string;
  navItems: { href: string; label: string; icon: string }[];
}> = {
  hr: {
    title: '인사 / 노무',
    badge: 'HR',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    navItems: [
      { href: '/ops/hr', label: '직원 관리', icon: '👤' },
      { href: '/ops/hr/leave', label: '연차 관리', icon: '🌴' },
      { href: '/ops/hr/calendar', label: '캘린더', icon: '📅' },
    ],
  },
  finance: {
    title: '재무 / 회계',
    badge: 'FINANCE',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    navItems: [
      { href: '/ops/finance', label: '매출 대시보드', icon: '💰' },
      { href: '/ops/finance/bookings', label: '예약 매출', icon: '🎫' },
      { href: '/ops/finance/stats', label: '통계', icon: '📊' },
    ],
  },
  partners: {
    title: '협력사',
    badge: 'PARTNERS',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    navItems: [
      { href: '/ops/partners', label: '협력사 관리', icon: '🤝' },
      { href: '/ops/partners/portal', label: '포털 홈', icon: '🏪' },
      { href: '/ops/partners/portal/listings', label: '리스팅 관리', icon: '📋' },
      { href: '/ops/partners/portal/listings/new', label: '새 리스팅', icon: '➕' },
      { href: '/ops/partners/portal/settings', label: '비즈니스 설정', icon: '⚙️' },
    ],
  },
};

export default function OpsSidebar({ module }: OpsSidebarProps) {
  const pathname = usePathname();
  const config = moduleConfig[module];

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6"
        style={{
          height: '64px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ background: config.gradient }}
        >
          M
        </div>
        <div>
          <span className="text-sm font-bold tracking-wide text-white">MUGOONG</span>
          <span
            className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
            style={{ background: config.color + '30', color: config.color }}
          >
            {config.badge}
          </span>
        </div>
      </div>

      {/* Back to Hub */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/ops"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200"
          style={{ color: '#64748b' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          통합 페이지로
        </Link>
      </div>

      {/* Module Title */}
      <div className="px-6 pb-2 pt-2">
        <h2 className="text-[15px] font-bold text-white">{config.title}</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-0.5">
          {config.navItems.map((item) => {
            const isActive =
              item.href === `/ops/${module}` || item.href === '/ops/partners'
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: config.color + '20',
                          color: config.color,
                          boxShadow: `inset 3px 0 0 ${config.color}`,
                        }
                      : { color: '#94a3b8' }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#e2e8f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: config.gradient }}
          >
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">Admin</p>
            <p className="truncate text-[11px]" style={{ color: '#64748b' }}>
              {config.title}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
