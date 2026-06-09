'use client';

import { useState } from 'react';
import OpsShell from '@/components/ops/OpsShell';
import DataTable from '@/components/ops/DataTable';

const demoBookings = [
  { id: '1', customer_name: 'James Wilson', customer_email: 'james@email.com', listing_title: '경복궁 가이드 투어', booking_date: '2026-06-15', booking_time: '10:00', guests: 2, total_price: 178000, status: 'confirmed' },
  { id: '2', customer_name: 'Yuki Tanaka', customer_email: 'yuki@email.com', listing_title: '강남 스파 프리미엄', booking_date: '2026-06-16', booking_time: '14:00', guests: 1, total_price: 150000, status: 'pending' },
  { id: '3', customer_name: 'Marie Dubois', customer_email: 'marie@email.com', listing_title: '전통 한식 코스', booking_date: '2026-06-14', booking_time: '12:00', guests: 4, total_price: 260000, status: 'confirmed' },
  { id: '4', customer_name: 'Alex Chen', customer_email: 'alex@email.com', listing_title: '한옥 마을 투어', booking_date: '2026-06-13', booking_time: '09:00', guests: 3, total_price: 165000, status: 'completed' },
  { id: '5', customer_name: 'Emma Brown', customer_email: 'emma@email.com', listing_title: '해운대 서핑 클래스', booking_date: '2026-06-12', booking_time: '08:00', guests: 2, total_price: 240000, status: 'completed' },
  { id: '6', customer_name: 'Park Soojin', customer_email: 'sj@email.com', listing_title: '제주 올레길 트레킹', booking_date: '2026-06-11', booking_time: '07:00', guests: 5, total_price: 275000, status: 'completed' },
  { id: '7', customer_name: 'Tom Harris', customer_email: 'tom@email.com', listing_title: '이태원 바 투어', booking_date: '2026-06-10', booking_time: '19:00', guests: 6, total_price: 420000, status: 'cancelled' },
  { id: '8', customer_name: 'Lisa Wang', customer_email: 'lisa@email.com', listing_title: '남산 야경 투어', booking_date: '2026-06-09', booking_time: '18:00', guests: 2, total_price: 110000, status: 'completed' },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: '대기' },
  confirmed: { bg: 'rgba(99,102,241,0.1)', text: '#6366f1', label: '확인' },
  completed: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', label: '완료' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: '취소' },
};

type BookingRow = typeof demoBookings[0];

export default function BookingsFinancePage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = statusFilter === 'all'
    ? demoBookings
    : demoBookings.filter((b) => b.status === statusFilter);

  const totalRevenue = filtered.reduce((s, b) => s + (b.status !== 'cancelled' ? b.total_price : 0), 0);

  const columns = [
    {
      key: 'customer_name',
      label: '고객',
      render: (row: BookingRow) => (
        <div>
          <p className="font-semibold text-gray-900">{row.customer_name}</p>
          <p className="text-[11px] text-gray-400">{row.customer_email}</p>
        </div>
      ),
    },
    { key: 'listing_title', label: '상품' },
    { key: 'booking_date', label: '예약일' },
    { key: 'booking_time', label: '시간', width: '80px' },
    {
      key: 'guests',
      label: '인원',
      width: '70px',
      render: (row: BookingRow) => <span>{row.guests}명</span>,
    },
    {
      key: 'total_price',
      label: '금액',
      render: (row: BookingRow) => (
        <span className="font-semibold text-gray-900">₩{row.total_price.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      label: '상태',
      render: (row: BookingRow) => {
        const st = statusColors[row.status];
        return (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: st.bg, color: st.text }}
          >
            {st.label}
          </span>
        );
      },
    },
  ];

  return (
    <OpsShell module="finance">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">예약 매출</h1>
        <p className="mt-1 text-[14px] text-gray-400">재무/회계 — 예약 기반 매출 내역</p>
      </div>

      {/* Summary Bar */}
      <div
        className="mb-6 flex items-center justify-between rounded-2xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(52,211,153,0.1))',
          border: '1px solid rgba(16,185,129,0.15)',
        }}
      >
        <div>
          <p className="text-[13px] font-medium text-gray-500">필터 적용 매출 합계</p>
          <p className="text-2xl font-bold text-gray-900">₩{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: '전체' },
            { key: 'pending', label: '대기' },
            { key: 'confirmed', label: '확인' },
            { key: 'completed', label: '완료' },
            { key: 'cancelled', label: '취소' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
              style={
                statusFilter === tab.key
                  ? { background: '#10b981', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.8)', color: '#64748b' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} pageSize={10} />
    </OpsShell>
  );
}
