'use client';

import OpsSidebar from '@/components/ops/OpsSidebar';
import type { OpsModule } from '@/components/ops/OpsSidebar';

interface OpsShellProps {
  module: OpsModule;
  children: React.ReactNode;
}

export default function OpsShell({ module, children }: OpsShellProps) {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <OpsSidebar module={module} />

      {/* Header */}
      <header
        className="fixed right-0 top-0 z-40 flex items-center justify-between px-8"
        style={{
          left: '260px',
          height: '64px',
          background: 'rgba(248,250,252,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="검색..."
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              style={{ width: '280px' }}
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            title="알림"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
              style={{ background: '#ef4444' }}
            />
          </button>
          <span className="text-[13px] font-medium text-gray-400">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="pt-[64px]"
        style={{ marginLeft: '260px', minHeight: '100vh' }}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
