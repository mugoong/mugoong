'use client';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: number; isUp: boolean };
  color: string;
  onClick?: () => void;
}

const colorMap: Record<string, { bg: string; border: string; iconBg: string; text: string }> = {
  indigo: {
    bg: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(129,140,248,0.1))',
    border: 'rgba(99,102,241,0.15)',
    iconBg: 'linear-gradient(135deg, #6366f1, #818cf8)',
    text: '#6366f1',
  },
  violet: {
    bg: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(167,139,250,0.1))',
    border: 'rgba(139,92,246,0.15)',
    iconBg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    text: '#8b5cf6',
  },
  emerald: {
    bg: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(52,211,153,0.1))',
    border: 'rgba(16,185,129,0.15)',
    iconBg: 'linear-gradient(135deg, #10b981, #34d399)',
    text: '#10b981',
  },
  amber: {
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(251,191,36,0.1))',
    border: 'rgba(245,158,11,0.15)',
    iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    text: '#f59e0b',
  },
  rose: {
    bg: 'linear-gradient(135deg, rgba(244,63,94,0.05), rgba(251,113,133,0.1))',
    border: 'rgba(244,63,94,0.15)',
    iconBg: 'linear-gradient(135deg, #f43f5e, #fb7185)',
    text: '#f43f5e',
  },
  sky: {
    bg: 'linear-gradient(135deg, rgba(14,165,233,0.05), rgba(56,189,248,0.1))',
    border: 'rgba(14,165,233,0.15)',
    iconBg: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
    text: '#0ea5e9',
  },
};

export default function StatsCard({ label, value, icon, trend, color, onClick }: StatsCardProps) {
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="group cursor-pointer rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className="text-[12px] font-semibold"
                style={{ color: trend.isUp ? '#10b981' : '#ef4444' }}
              >
                {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-[11px] text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{ background: c.iconBg }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
