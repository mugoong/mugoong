'use client';

import { useState } from 'react';
import OpsShell from '@/components/ops/OpsShell';
import StatsCard from '@/components/ops/StatsCard';
import DataTable from '@/components/ops/DataTable';
import type { Employee } from '@/lib/supabase/ops-types';

const demoEmployees: Employee[] = [
  { id: '1', created_at: '', updated_at: '', auth_user_id: null, name: '박경면', email: 'km.park@mugoong.com', phone: '010-1234-5678', position: '대표이사', department: '경영', hire_date: '2024-01-15', status: 'active', annual_leave_total: 15, annual_leave_used: 3, profile_image: '', notes: '' },
  { id: '2', created_at: '', updated_at: '', auth_user_id: null, name: '이동원', email: 'dw.lee@mugoong.com', phone: '010-2345-6789', position: '이사', department: '기획', hire_date: '2024-01-15', status: 'active', annual_leave_total: 15, annual_leave_used: 5, profile_image: '', notes: '' },
  { id: '3', created_at: '', updated_at: '', auth_user_id: null, name: '이원희', email: 'wh.lee@mugoong.com', phone: '010-3456-7890', position: '이사', department: '운영', hire_date: '2024-02-01', status: 'active', annual_leave_total: 15, annual_leave_used: 2, profile_image: '', notes: '' },
  { id: '4', created_at: '', updated_at: '', auth_user_id: null, name: '김서연', email: 'sy.kim@mugoong.com', phone: '010-4567-8901', position: '매니저', department: '마케팅', hire_date: '2024-03-10', status: 'active', annual_leave_total: 15, annual_leave_used: 7, profile_image: '', notes: '' },
  { id: '5', created_at: '', updated_at: '', auth_user_id: null, name: '최준호', email: 'jh.choi@mugoong.com', phone: '010-5678-9012', position: '매니저', department: '개발', hire_date: '2024-04-01', status: 'active', annual_leave_total: 15, annual_leave_used: 1, profile_image: '', notes: '' },
  { id: '6', created_at: '', updated_at: '', auth_user_id: null, name: '정하은', email: 'he.jung@mugoong.com', phone: '010-6789-0123', position: '사원', department: '고객지원', hire_date: '2024-05-15', status: 'active', annual_leave_total: 15, annual_leave_used: 4, profile_image: '', notes: '' },
  { id: '7', created_at: '', updated_at: '', auth_user_id: null, name: '한지우', email: 'jw.han@mugoong.com', phone: '010-7890-1234', position: '사원', department: '운영', hire_date: '2024-06-01', status: 'on_leave', annual_leave_total: 15, annual_leave_used: 8, profile_image: '', notes: '' },
  { id: '8', created_at: '', updated_at: '', auth_user_id: null, name: '송민재', email: 'mj.song@mugoong.com', phone: '010-8901-2345', position: '인턴', department: '마케팅', hire_date: '2025-01-10', status: 'active', annual_leave_total: 11, annual_leave_used: 0, profile_image: '', notes: '' },
];

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', label: '재직' },
    on_leave: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: '휴직' },
    resigned: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: '퇴사' },
  };
  const s = map[status] || map.active;
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
};

export default function HRPage() {
  const [showModal, setShowModal] = useState(false);

  const activeCount = demoEmployees.filter((e) => e.status === 'active').length;
  const onLeaveCount = demoEmployees.filter((e) => e.status === 'on_leave').length;
  const avgLeaveUsed = Math.round(demoEmployees.reduce((s, e) => s + e.annual_leave_used, 0) / demoEmployees.length);

  const columns = [
    {
      key: 'name',
      label: '이름',
      render: (row: Employee) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}
          >
            {row.name[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-[11px] text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'position', label: '직급' },
    { key: 'department', label: '부서' },
    { key: 'hire_date', label: '입사일' },
    {
      key: 'annual_leave',
      label: '연차 (사용/전체)',
      render: (row: Employee) => {
        const pct = (row.annual_leave_used / row.annual_leave_total) * 100;
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: pct > 80 ? '#f43f5e' : pct > 50 ? '#f59e0b' : '#10b981',
                }}
              />
            </div>
            <span className="text-[12px] text-gray-600">
              {row.annual_leave_used}/{row.annual_leave_total}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: '상태',
      render: (row: Employee) => statusBadge(row.status),
    },
  ];

  return (
    <OpsShell module="hr">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">직원 관리</h1>
          <p className="mt-1 text-[14px] text-gray-400">인사/노무 — 직원 정보 관리</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
          }}
        >
          <span>+</span> 직원 추가
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="전체 직원" value={demoEmployees.length} icon="👥" color="violet" />
        <StatsCard label="재직 중" value={activeCount} icon="✅" color="emerald" />
        <StatsCard label="휴직" value={onLeaveCount} icon="🌴" color="amber" />
        <StatsCard label="평균 연차 사용" value={`${avgLeaveUsed}일`} icon="📊" color="indigo" />
      </div>

      <DataTable columns={columns} data={demoEmployees} pageSize={10} />

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">직원 추가</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['이름', '이메일', '전화번호', '직급', '부서', '입사일'].map((label) => (
                <div key={label}>
                  <label className="mb-1 block text-[12px] font-medium text-gray-500">{label}</label>
                  <input
                    type={label === '입사일' ? 'date' : label === '이메일' ? 'email' : 'text'}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] outline-none transition-all focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50">취소</button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-5 py-2 text-[13px] font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </OpsShell>
  );
}
