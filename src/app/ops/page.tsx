'use client';

import OpsShell from '@/components/ops/OpsShell';
import StatsCard from '@/components/ops/StatsCard';
import Chart from '@/components/ops/Chart';
import SiteMap from '@/components/ops/SiteMap';

// Demo KPI data
const kpis = [
  { label: '총 직원 수', value: 12, icon: '👥', color: 'violet', trend: { value: 8.3, isUp: true } },
  { label: '이번 달 매출', value: '₩14.2M', icon: '💰', color: 'emerald', trend: { value: 12.5, isUp: true } },
  { label: '활성 협력사', value: 8, icon: '🤝', color: 'amber', trend: { value: 33.3, isUp: true } },
  { label: '대기 예약', value: 23, icon: '📅', color: 'indigo', trend: { value: 5.2, isUp: false } },
  { label: '미정산 건수', value: 5, icon: '🧾', color: 'rose', trend: { value: 16.7, isUp: false } },
  { label: '이번 달 예약', value: 156, icon: '🎫', color: 'sky', trend: { value: 22.1, isUp: true } },
];

const monthlyRevenue = [
  { label: 'Jan', value: 8200000 },
  { label: 'Feb', value: 9400000 },
  { label: 'Mar', value: 11000000 },
  { label: 'Apr', value: 10500000 },
  { label: 'May', value: 13200000 },
  { label: 'Jun', value: 14200000 },
];

const categoryRevenue = [
  { label: '레스토랑', value: 5800000, color: '#6366f1' },
  { label: '웰니스', value: 4200000, color: '#8b5cf6' },
  { label: '액티비티', value: 3100000, color: '#10b981' },
  { label: '트래블 팁', value: 1100000, color: '#f59e0b' },
];

const recentActivity = [
  { time: '10분 전', text: '새 예약 — 경복궁 투어 (2명)', type: 'booking' },
  { time: '32분 전', text: '김서연 연차 승인됨', type: 'leave' },
  { time: '1시간 전', text: '협력사 "한옥스테이" 리스팅 등록', type: 'partner' },
  { time: '2시간 전', text: '매출 정산 완료 — ₩2,340,000', type: 'finance' },
  { time: '3시간 전', text: '신규 직원 등록 — 이민호', type: 'hr' },
];

const activityColors: Record<string, string> = {
  booking: '#6366f1',
  leave: '#8b5cf6',
  partner: '#f59e0b',
  finance: '#10b981',
  hr: '#f43f5e',
};

export default function OpsDashboard() {
  return (
    <OpsShell>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">통합 대시보드</h1>
        <p className="mt-1 text-[14px] text-gray-400">
          무궁 경영 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <StatsCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-5">
        <div
          className="rounded-2xl p-6 lg:col-span-3"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">월별 매출 추이</h2>
              <p className="text-[12px] text-gray-400">최근 6개월</p>
            </div>
            <div
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
            >
              ↑ 12.5%
            </div>
          </div>
          <Chart type="line" data={monthlyRevenue} color="#6366f1" height={220} />
        </div>

        <div
          className="rounded-2xl p-6 lg:col-span-2"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">카테고리별 매출</h2>
            <p className="text-[12px] text-gray-400">이번 달 분포</p>
          </div>
          <Chart type="donut" data={categoryRevenue} height={220} />
        </div>
      </div>

      {/* Activity + Quick Access */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div
          className="rounded-2xl p-6 lg:col-span-1"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <h2 className="mb-4 text-[15px] font-bold text-gray-900">최근 활동</h2>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: activityColors[a.type], marginTop: '5px' }}
                  />
                  {i < recentActivity.length - 1 && (
                    <div className="w-px flex-1" style={{ background: '#e2e8f0', marginTop: '4px' }} />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-4">
                  <p className="text-[13px] font-medium text-gray-700">{a.text}</p>
                  <p className="text-[11px] text-gray-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl p-6"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h2 className="mb-4 text-[15px] font-bold text-gray-900">빠른 실행</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/ops/hr', label: '직원 관리', desc: '직원 추가 및 정보 관리', icon: '👤', color: '#8b5cf6' },
                { href: '/ops/finance', label: '매출 확인', desc: '오늘의 매출 현황 보기', icon: '💰', color: '#10b981' },
                { href: '/ops/partners', label: '협력사 관리', desc: '협력사 승인 및 관리', icon: '🤝', color: '#f59e0b' },
                { href: '/ops/hr/calendar', label: '캘린더', desc: '일정 및 휴가 확인', icon: '📅', color: '#6366f1' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-transform group-hover:scale-110"
                    style={{ background: item.color + '15' }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-800">{item.label}</p>
                    <p className="text-[11px] text-gray-400">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Site Map */}
      <SiteMap />
    </OpsShell>
  );
}
