'use client';

import OpsShell from '@/components/ops/OpsShell';

export default function EmployeeDetailPage() {
  const employee = {
    name: '김서연',
    email: 'sy.kim@mugoong.com',
    phone: '010-4567-8901',
    position: '매니저',
    department: '마케팅',
    hire_date: '2024-03-10',
    status: 'active',
    annual_leave_total: 15,
    annual_leave_used: 7,
  };

  const leaveHistory = [
    { date: '2025-05-20 ~ 2025-05-22', type: '연차', days: 3, status: 'approved' },
    { date: '2025-04-10', type: '반차', days: 0.5, status: 'approved' },
    { date: '2025-03-15 ~ 2025-03-17', type: '개인사유', days: 3, status: 'approved' },
    { date: '2025-02-05', type: '병가', days: 0.5, status: 'approved' },
  ];

  const pct = (employee.annual_leave_used / employee.annual_leave_total) * 100;

  return (
    <OpsShell module="hr">
      <div className="mb-6">
        <a href="/ops/hr" className="text-[13px] font-medium text-indigo-500 hover:text-indigo-700">
          ← 직원 목록
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}
            >
              {employee.name[0]}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
            <p className="text-[13px] text-gray-400">{employee.position} · {employee.department}</p>
            <span
              className="mt-2 rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
            >
              재직 중
            </span>
          </div>

          <div className="space-y-3 text-[13px]">
            {[
              { label: '이메일', value: employee.email },
              { label: '전화번호', value: employee.phone },
              { label: '입사일', value: employee.hire_date },
              { label: '부서', value: employee.department },
            ].map((info) => (
              <div key={info.label} className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400">{info.label}</span>
                <span className="font-medium text-gray-700">{info.value}</span>
              </div>
            ))}
          </div>

          <button
            className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            정보 수정
          </button>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Annual Leave */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="mb-4 text-[15px] font-bold text-gray-900">연차 현황</h3>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: '#f8fafc' }}>
                <p className="text-2xl font-bold text-gray-900">{employee.annual_leave_total}</p>
                <p className="text-[11px] text-gray-400">총 연차</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: '#f8fafc' }}>
                <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{employee.annual_leave_used}</p>
                <p className="text-[11px] text-gray-400">사용</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: '#f8fafc' }}>
                <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{employee.annual_leave_total - employee.annual_leave_used}</p>
                <p className="text-[11px] text-gray-400">잔여</p>
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: pct > 80 ? '#f43f5e' : pct > 50 ? '#f59e0b' : '#10b981',
                }}
              />
            </div>
            <p className="mt-2 text-right text-[11px] text-gray-400">{pct.toFixed(0)}% 사용</p>
          </div>

          {/* Leave History */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="mb-4 text-[15px] font-bold text-gray-900">휴가 사용 내역</h3>
            <div className="space-y-3">
              {leaveHistory.map((leave, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-gray-50 p-3 transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sm"
                      style={{ background: 'rgba(139,92,246,0.1)' }}
                    >
                      🌴
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-800">{leave.type}</p>
                      <p className="text-[11px] text-gray-400">{leave.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-medium text-gray-600">{leave.days}일</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                    >
                      승인
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OpsShell>
  );
}
