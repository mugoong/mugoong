'use client';

import OpsShell from '@/components/ops/OpsShell';
import Calendar from '@/components/ops/Calendar';
import type { CalendarEvent } from '@/lib/supabase/ops-types';

const demoEvents: CalendarEvent[] = [
  { id: '1', title: '한지우 연차', date: '2026-06-15', endDate: '2026-06-17', type: 'leave', color: '#8b5cf6', employeeName: '한지우' },
  { id: '2', title: '김서연 반차', date: '2026-06-12', type: 'leave', color: '#8b5cf6', employeeName: '김서연' },
  { id: '3', title: '정하은 연차', date: '2026-06-20', endDate: '2026-06-22', type: 'leave', color: '#8b5cf6', employeeName: '정하은' },
  { id: '4', title: '팀 미팅', date: '2026-06-09', type: 'meeting', color: '#6366f1' },
  { id: '5', title: '현충일', date: '2026-06-06', type: 'holiday', color: '#f43f5e' },
  { id: '6', title: '분기 마감', date: '2026-06-30', type: 'deadline', color: '#f59e0b' },
  { id: '7', title: '전체 회의', date: '2026-06-16', type: 'meeting', color: '#6366f1' },
  { id: '8', title: '최준호 병가', date: '2026-06-05', type: 'leave', color: '#8b5cf6', employeeName: '최준호' },
];

export default function CalendarPage() {
  return (
    <OpsShell module="hr">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">캘린더</h1>
          <p className="mt-1 text-[14px] text-gray-400">인사/노무 — 일정 및 휴가 캘린더</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}
        >
          <span>+</span> 일정 추가
        </button>
      </div>

      <Calendar events={demoEvents} />

      {/* Upcoming Events */}
      <div
        className="mt-6 rounded-2xl p-6"
        style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <h2 className="mb-4 text-[15px] font-bold text-gray-900">다가오는 일정</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {demoEvents
            .filter((e) => e.date >= new Date().toISOString().split('T')[0])
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 6)
            .map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-xl border border-gray-50 p-3 transition-colors hover:bg-gray-50"
              >
                <div
                  className="h-10 w-1 rounded-full"
                  style={{ background: event.color }}
                />
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">{event.title}</p>
                  <p className="text-[11px] text-gray-400">
                    {event.date}{event.endDate ? ` ~ ${event.endDate}` : ''}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </OpsShell>
  );
}
