'use client';

import { useState } from 'react';
import OpsShell from '@/components/ops/OpsShell';
import StatsCard from '@/components/ops/StatsCard';

const demoLeaves = [
  { id: '1', employee: '한지우', department: '운영', type: '연차', start: '2026-06-15', end: '2026-06-17', days: 3, reason: '가족 행사', status: 'pending' },
  { id: '2', employee: '김서연', department: '마케팅', type: '반차', start: '2026-06-12', end: '2026-06-12', days: 0.5, reason: '병원 방문', status: 'pending' },
  { id: '3', employee: '정하은', department: '고객지원', type: '연차', start: '2026-06-20', end: '2026-06-22', days: 3, reason: '여행', status: 'pending' },
  { id: '4', employee: '최준호', department: '개발', type: '병가', start: '2026-06-05', end: '2026-06-05', days: 1, reason: '감기', status: 'approved' },
  { id: '5', employee: '송민재', department: '마케팅', type: '개인사유', start: '2026-06-03', end: '2026-06-03', days: 1, reason: '개인 사정', status: 'approved' },
  { id: '6', employee: '이동원', department: '기획', type: '연차', start: '2026-05-28', end: '2026-05-30', days: 3, reason: '휴가', status: 'approved' },
  { id: '7', employee: '박경면', department: '경영', type: '반차', start: '2026-05-20', end: '2026-05-20', days: 0.5, reason: '미팅', status: 'rejected' },
];

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: '대기' },
  approved: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', label: '승인' },
  rejected: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: '반려' },
};

const typeMap: Record<string, string> = {
  연차: '#8b5cf6',
  반차: '#6366f1',
  병가: '#f43f5e',
  개인사유: '#f59e0b',
};

export default function LeavePage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? demoLeaves : demoLeaves.filter((l) => l.status === filter);
  const pendingCount = demoLeaves.filter((l) => l.status === 'pending').length;
  const approvedCount = demoLeaves.filter((l) => l.status === 'approved').length;
  const totalDays = demoLeaves.filter((l) => l.status === 'approved').reduce((s, l) => s + l.days, 0);

  return (
    <OpsShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">연차 관리</h1>
        <p className="mt-1 text-[14px] text-gray-400">인사/노무 — 연차/휴가 신청 관리</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="승인 대기" value={pendingCount} icon="⏳" color="amber" />
        <StatsCard label="승인 완료" value={approvedCount} icon="✅" color="emerald" />
        <StatsCard label="이번 달 사용 일수" value={`${totalDays}일`} icon="📊" color="violet" />
        <StatsCard label="전체 신청" value={demoLeaves.length} icon="📋" color="indigo" />
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {[
          { key: 'all', label: '전체' },
          { key: 'pending', label: '대기' },
          { key: 'approved', label: '승인' },
          { key: 'rejected', label: '반려' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="rounded-lg px-4 py-2 text-[13px] font-medium transition-all"
            style={
              filter === tab.key
                ? { background: '#6366f1', color: '#fff' }
                : { background: '#f1f5f9', color: '#64748b' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leave Cards */}
      <div className="space-y-3">
        {filtered.map((leave) => {
          const st = statusMap[leave.status];
          return (
            <div
              key={leave.id}
              className="flex items-center justify-between rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}
                >
                  {leave.employee[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-gray-900">{leave.employee}</p>
                    <span className="text-[11px] text-gray-400">{leave.department}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[12px] text-gray-500">
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: typeMap[leave.type] || '#6366f1' }}
                    >
                      {leave.type}
                    </span>
                    <span>{leave.start}{leave.start !== leave.end ? ` ~ ${leave.end}` : ''}</span>
                    <span>({leave.days}일)</span>
                  </div>
                  {leave.reason && (
                    <p className="mt-1 text-[12px] text-gray-400">사유: {leave.reason}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{ background: st.bg, color: st.text }}
                >
                  {st.label}
                </span>
                {leave.status === 'pending' && (
                  <div className="flex gap-1.5">
                    <button
                      className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white transition-colors"
                      style={{ background: '#10b981' }}
                    >
                      승인
                    </button>
                    <button
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      반려
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </OpsShell>
  );
}
