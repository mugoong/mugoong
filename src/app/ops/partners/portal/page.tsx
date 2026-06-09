'use client';

import OpsShell from '@/components/ops/OpsShell';
import StatsCard from '@/components/ops/StatsCard';
import Chart from '@/components/ops/Chart';

const monthlyRevenue = [
  { label: 'Jan', value: 1200000 },
  { label: 'Feb', value: 1500000 },
  { label: 'Mar', value: 1800000 },
  { label: 'Apr', value: 1600000 },
  { label: 'May', value: 2100000 },
  { label: 'Jun', value: 2400000 },
];

export default function PartnerPortal() {
  return (
    <OpsShell>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="rounded-lg px-2 py-1 text-[10px] font-bold uppercase"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
          >
            Partner Portal
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">한옥스테이</h1>
        <p className="mt-1 text-[14px] text-gray-400">협력사 대시보드</p>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="내 리스팅" value={3} icon="📋" color="amber" />
        <StatsCard label="이번 달 예약" value={18} icon="🎫" color="indigo" trend={{ value: 28.6, isUp: true }} />
        <StatsCard label="이번 달 매출" value="₩2.4M" icon="💰" color="emerald" trend={{ value: 14.3, isUp: true }} />
        <StatsCard label="다음 정산" value="₩2.1M" icon="💳" color="violet" />
      </div>

      {/* Revenue Chart */}
      <div
        className="mb-8 rounded-2xl p-6"
        style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="mb-4">
          <h2 className="text-[15px] font-bold text-gray-900">월별 매출 추이</h2>
          <p className="text-[12px] text-gray-400">최근 6개월</p>
        </div>
        <Chart type="line" data={monthlyRevenue} color="#f59e0b" height={200} />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/ops/partners/portal/listings"
          className="group rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110"
            style={{ background: 'rgba(245,158,11,0.1)' }}
          >
            📋
          </div>
          <h3 className="text-[14px] font-bold text-gray-900">내 리스팅 관리</h3>
          <p className="mt-1 text-[12px] text-gray-400">상품 등록, 수정, 상태 관리</p>
        </a>

        <a
          href="/ops/partners/portal/listings/new"
          className="group rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110"
            style={{ background: 'rgba(99,102,241,0.1)' }}
          >
            ➕
          </div>
          <h3 className="text-[14px] font-bold text-gray-900">새 리스팅 등록</h3>
          <p className="mt-1 text-[12px] text-gray-400">새 상품 또는 서비스 등록</p>
        </a>

        <a
          href="/ops/partners/portal/settings"
          className="group rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110"
            style={{ background: 'rgba(139,92,246,0.1)' }}
          >
            ⚙️
          </div>
          <h3 className="text-[14px] font-bold text-gray-900">비즈니스 설정</h3>
          <p className="mt-1 text-[12px] text-gray-400">사업자 정보, 정산 계좌 관리</p>
        </a>
      </div>
    </OpsShell>
  );
}
