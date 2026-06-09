'use client';

import { useState } from 'react';
import type { CalendarEvent } from '@/lib/supabase/ops-types';

interface CalendarProps {
  events?: CalendarEvent[];
}

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const typeColors: Record<string, string> = {
  leave: '#8b5cf6',
  meeting: '#6366f1',
  holiday: '#f43f5e',
  deadline: '#f59e0b',
};

export default function Calendar({ events = [] }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((ev) => ev.date <= dateStr && (ev.endDate ? ev.endDate >= dateStr : ev.date === dateStr));
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h3 className="text-lg font-bold text-gray-900">
            {year}년 {MONTHS_KO[month]}
          </h3>
          <button onClick={nextMonth} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <button
          onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-500 transition-colors hover:bg-gray-50"
        >
          오늘
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7" style={{ background: '#f8fafc' }}>
        {DAYS_KO.map((d, i) => (
          <div
            key={d}
            className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider"
            style={{ color: i === 0 ? '#f43f5e' : i === 6 ? '#3b82f6' : '#94a3b8' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="min-h-[80px] border-b border-r border-gray-50" />;
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const dayEvents = getEventsForDay(day);
          const dayOfWeek = (firstDay + day - 1) % 7;

          return (
            <div
              key={day}
              className="min-h-[80px] border-b border-r border-gray-50 p-1.5 transition-colors hover:bg-indigo-50/30"
            >
              <div className="flex justify-end">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={
                    isToday
                      ? { background: '#6366f1', color: '#fff' }
                      : { color: dayOfWeek === 0 ? '#f43f5e' : dayOfWeek === 6 ? '#3b82f6' : '#374151' }
                  }
                >
                  {day}
                </span>
              </div>
              <div className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className="truncate rounded px-1 py-0.5 text-[10px] font-medium text-white"
                    style={{ background: typeColors[ev.type] || '#6366f1' }}
                    title={ev.title}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="px-1 text-[10px] font-medium text-gray-400">
                    +{dayEvents.length - 2}건
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 border-t border-gray-100 px-6 py-3">
        {Object.entries({ leave: '휴가', meeting: '미팅', holiday: '공휴일', deadline: '마감' }).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: typeColors[key] }} />
            <span className="text-[11px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
