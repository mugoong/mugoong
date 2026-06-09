'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    title: '통합',
    items: [
      { href: '/ops', label: 'Dashboard', icon: '🏠' },
    ],
  },
  {
    title: '인사 / 노무',
    items: [
      { href: '/ops/hr', label: '직원 관리', icon: '👤' },
      { href: '/ops/hr/leave', label: '연차 관리', icon: '🌴' },
      { href: '/ops/hr/calendar', label: '캘린더', icon: '📅' },
    ],
  },
  {
    title: '재무 / 회계',
    items: [
      { href: '/ops/finance', label: '매출 대시보드', icon: '💰' },
      { href: '/ops/finance/bookings', label: '예약 매출', icon: '🎫' },
      { href: '/ops/finance/stats', label: '통계', icon: '📊' },
    ],
  },
  {
    title: '협력사',
    items: [
      { href: '/ops/partners', label: '협력사 관리', icon: '🤝' },
      { href: '/ops/partners/portal', label: '협력사 포털', icon: '🏪' },
    ],
  },
];

const externalLinks = [
  { href: 'https://www.mugoong.com', label: 'Mugoong 메인', icon: '🌸' },
  { href: 'https://www.mugoong.com/admin', label: 'CMS Admin', icon: '📝' },
];

export default function OpsSidebar() {
  const pathname = usePathname();

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
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          M
        </div>
        <div>
          <span className="text-sm font-bold tracking-wide text-white">MUGOONG</span>
          <span
            className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
            style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}
          >
            OPS
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-5">
            <p
              className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'rgba(148,163,184,0.6)' }}
            >
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === '/ops'
                    ? pathname === '/ops'
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200"
                      style={
                        isActive
                          ? {
                              background: 'rgba(99,102,241,0.15)',
                              color: '#a5b4fc',
                              boxShadow: 'inset 3px 0 0 #6366f1',
                            }
                          : {
                              color: '#94a3b8',
                            }
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
          </div>
        ))}

        {/* External Links */}
        <div className="mb-4 mt-2">
          <p
            className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'rgba(148,163,184,0.6)' }}
          >
            외부 링크
          </p>
          <ul className="space-y-0.5">
            {externalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200"
                  style={{ color: '#94a3b8' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                  <svg className="ml-auto h-3 w-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">Admin</p>
            <p className="truncate text-[11px]" style={{ color: '#64748b' }}>
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
