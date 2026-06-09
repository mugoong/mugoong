'use client';

import OpsShell from '@/components/ops/OpsShell';
import StatsCard from '@/components/ops/StatsCard';
import Chart from '@/components/ops/Chart';

const dailyRevenue = [
  { label: '1일', value: 520000 },
  { label: '5일', value: 680000 },
  { label: '10일', value: 450000 },
  { label: '15일', value: 920000 },
  { label: '20일', value: 780000 },
  { label: '25일', value: 1100000 },
  { label: '30일', value: 850000 },
];

const monthlyBookings = [
  { label: 'Jan', value: 82 },
  { label: 'Feb', value: 94 },
  { label: 'Mar', value: 110 },
  { label: 'Apr', value: 105 },
  { label: 'May', value: 132 },
  { label: 'Jun', value: 156 },
];

const categoryBreakdown = [
  { label: '레스토랑', value: 5800000, color: '#6366f1' },
  { label: '웰니스', value: 4200000, color: '#8b5cf6' },
  { label: '액티비티', value: 3100000, color: '#10b981' },
  { label: '트래블 팁', value: 1100000, color: '#f59e0b' },
];

const recentTransactions = [
  { id: '1', customer: 'James Wilson', listing: '경복궁 가이드 투어', amount: 89000, currency: 'KRW', status: 'completed', date: '2026-06-09' },
  { id: '2', customer: 'Yuki Tanaka', listing: '강남 스파 프리미엄', amount: 150000, currency: 'KRW', status: 'confirmed', date: '2026-06-09' },
  { id: '3', customer: 'Marie Dubois', listing: '전통 한식 코스', amount: 65000, currency: 'KRW', status: 'pending', date: '2026-06-08' },
  { id: '4', customer: 'Alex Chen', listing: '한옥 마을 투어', amount: 55000, currency: 'KRW', status: 'completed', date: '2026-06-08' },
  { id: '5', customer: 'Emma Brown', listing: '해운대 서핑 클래스', amount: 120000, currency: 'KRW', status: 'confirmed', date: '2026-06-07' },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', label: '완료' },
  confirmed: { bg: 'rgba(99,102,241,0.1)', text: '#6366f1', label: '확인' },
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: '대기' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: '취소' },
};

export default function FinancePage() {
  const totalRevenue = 14200000;
  const lastMonthRevenue = 13200000;
  const growthPct = ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1);

  return (
    <OpsShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">매출 대시보드</h1>
        <p className="mt-1 text-[14px] text-gray-400">재무/회계 — 매출 현황 및 분석</p>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="이번 달 매출" value="₩14.2M" icon="💰" color="emerald" trend={{ value: parseFloat(growthPct), isUp: true }} />
        <StatsCard label="이번 달 예약" value="156건" icon="🎫" color="indigo" trend={{ value: 18.2, isUp: true }} />
        <StatsCard label="평균 객단가" value="₩91,026" icon="📊" color="violet" trend={{ value: 5.3, isUp: true }} />
        <StatsCard label="미정산" value="₩3.8M" icon="🧾" color="rose" trend={{ value: 12.0, isUp: false }} />
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-2xl p-6"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">일별 매출 추이</h2>
            <p className="text-[12px] text-gray-400">이번 달</p>
          </div>
          <Chart type="line" data={dailyRevenue} color="#10b981" height={200} />
        </div>
        <div
          className="rounded-2xl p-6"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">월별 예약 건수</h2>
            <p className="text-[12px] text-gray-400">최근 6개월</p>
          </div>
          <Chart type="bar" data={monthlyBookings} color="#6366f1" height={200} />
        </div>
      </div>

      {/* Category + Transactions */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div
          className="rounded-2xl p-6 lg:col-span-2"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">카테고리별 매출</h2>
            <p className="text-[12px] text-gray-400">이번 달</p>
          </div>
          <Chart type="donut" data={categoryBreakdown} height={220} />
        </div>

        <div
          className="rounded-2xl p-6 lg:col-span-3"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-gray-900">최근 거래</h2>
            <a href="/ops/finance/bookings" className="text-[12px] font-medium text-indigo-500 hover:text-indigo-700">전체 보기 →</a>
          </div>
          <div className="space-y-2">
            {recentTransactions.map((tx) => {
              const st = statusColors[tx.status];
              return (
                <div key={tx.id} className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}
                    >
                      ₩
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-800">{tx.listing}</p>
                      <p className="text-[11px] text-gray-400">{tx.customer} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold text-gray-900">
                      ₩{tx.amount.toLocaleString()}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: st.bg, color: st.text }}
                    >
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </OpsShell>
  );
}
