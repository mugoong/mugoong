'use client';

import OpsShell from '@/components/ops/OpsShell';
import Chart from '@/components/ops/Chart';

const monthlyTrend = [
  { label: 'Jan', value: 8200000 },
  { label: 'Feb', value: 9400000 },
  { label: 'Mar', value: 11000000 },
  { label: 'Apr', value: 10500000 },
  { label: 'May', value: 13200000 },
  { label: 'Jun', value: 14200000 },
  { label: 'Jul', value: 12800000 },
  { label: 'Aug', value: 15600000 },
  { label: 'Sep', value: 13900000 },
  { label: 'Oct', value: 11200000 },
  { label: 'Nov', value: 10800000 },
  { label: 'Dec', value: 16400000 },
];

const categoryBreakdown = [
  { label: '레스토랑', value: 58000000, color: '#6366f1' },
  { label: '웰니스', value: 42000000, color: '#8b5cf6' },
  { label: '액티비티', value: 31000000, color: '#10b981' },
  { label: '트래블 팁', value: 11000000, color: '#f59e0b' },
];

const partnerRevenue = [
  { label: '한옥스테이', value: 12400000, color: '#6366f1' },
  { label: '서울스파', value: 9800000, color: '#8b5cf6' },
  { label: '제주투어', value: 8200000, color: '#10b981' },
  { label: '부산맛집', value: 6500000, color: '#f59e0b' },
  { label: '기타', value: 5100000, color: '#94a3b8' },
];

const cityBookings = [
  { label: 'Seoul', value: 245 },
  { label: 'Busan', value: 120 },
  { label: 'Jeju', value: 180 },
  { label: 'Gyeongju', value: 65 },
  { label: 'Jeonju', value: 48 },
];

const keyMetrics = [
  { label: '연간 총 매출', value: '₩147.2M', change: '+23.5%', isUp: true, icon: '💰' },
  { label: '연간 예약 건수', value: '1,598건', change: '+18.2%', isUp: true, icon: '🎫' },
  { label: '평균 객단가', value: '₩92,115', change: '+4.5%', isUp: true, icon: '📊' },
  { label: '연간 수수료 수익', value: '₩18.4M', change: '+28.1%', isUp: true, icon: '🏦' },
  { label: '리피트 고객 비율', value: '34.2%', change: '+6.8%', isUp: true, icon: '🔄' },
  { label: '취소율', value: '5.3%', change: '-2.1%', isUp: false, icon: '📉' },
];

export default function StatsPage() {
  return (
    <OpsShell module="finance">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">통계</h1>
        <p className="mt-1 text-[14px] text-gray-400">재무/회계 — 상세 통계 및 분석</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {keyMetrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl p-5"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="mb-2 text-lg">{m.icon}</div>
            <p className="text-xl font-bold text-gray-900">{m.value}</p>
            <p className="mt-1 text-[12px] text-gray-400">{m.label}</p>
            <p
              className="mt-1 text-[12px] font-semibold"
              style={{ color: m.isUp ? '#10b981' : '#f43f5e' }}
            >
              {m.change}
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Trend */}
      <div
        className="mb-8 rounded-2xl p-6"
        style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="mb-4">
          <h2 className="text-[15px] font-bold text-gray-900">월별 매출 트렌드 (연간)</h2>
          <p className="text-[12px] text-gray-400">2026년</p>
        </div>
        <Chart type="bar" data={monthlyTrend} color="#6366f1" height={250} />
      </div>

      {/* 3-Column Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div
          className="rounded-2xl p-6"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">카테고리별 매출</h2>
            <p className="text-[12px] text-gray-400">연간 비중</p>
          </div>
          <Chart type="donut" data={categoryBreakdown} height={220} />
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">협력사별 매출</h2>
            <p className="text-[12px] text-gray-400">상위 5개</p>
          </div>
          <Chart type="donut" data={partnerRevenue} height={220} />
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-gray-900">도시별 예약</h2>
            <p className="text-[12px] text-gray-400">예약 건수</p>
          </div>
          <Chart type="bar" data={cityBookings} color="#8b5cf6" height={220} />
        </div>
      </div>
    </OpsShell>
  );
}
