/* ──────────────────────────────────────────────
   Mugoong OPS – Supabase Type Definitions
   ────────────────────────────────────────────── */

// ─── HR / 인사노무 ───────────────────────────
export type EmployeeStatus = 'active' | 'on_leave' | 'resigned';

export interface Employee {
  id: string;
  created_at: string;
  updated_at: string;
  auth_user_id: string | null;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  status: EmployeeStatus;
  annual_leave_total: number;
  annual_leave_used: number;
  profile_image: string;
  notes: string;
}

export type LeaveType = 'annual' | 'sick' | 'personal' | 'half_day';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  created_at: string;
  employee_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approved_by: string | null;
  // joined
  employee?: Employee;
}

// ─── Partners / 협력사 ──────────────────────
export type PartnerStatus = 'pending' | 'active' | 'suspended';

export interface Partner {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  business_registration_number: string;
  representative_name: string;
  business_type: string;
  phone: string;
  email: string;
  address: string;
  bank_name: string;
  bank_account: string;
  bank_holder: string;
  status: PartnerStatus;
  notes: string;
}

export type PartnerUserRole = 'owner' | 'manager';

export interface PartnerUser {
  id: string;
  created_at: string;
  auth_user_id: string;
  partner_id: string;
  name: string;
  email: string;
  role: PartnerUserRole;
  // joined
  partner?: Partner;
}

// ─── Finance / 재무회계 ─────────────────────
export type SettlementStatus = 'pending' | 'settled' | 'cancelled';

export interface RevenueRecord {
  id: string;
  created_at: string;
  booking_id: string | null;
  partner_id: string | null;
  listing_id: string | null;
  amount: number;
  currency: string;
  commission_rate: number;
  commission_amount: number;
  settlement_status: SettlementStatus;
  settled_at: string | null;
  notes: string;
  // joined
  listing_title?: string;
  partner_name?: string;
}

// ─── OPS User Role ──────────────────────────
export type OpsRole = 'super_admin' | 'hr_manager' | 'finance_manager' | 'partner';

export interface OpsUser {
  id: string;
  email: string;
  name: string;
  role: OpsRole;
  partner_id?: string;
}

// ─── Dashboard KPIs ─────────────────────────
export interface DashboardKPIs {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  monthlyRevenue: number;
  totalPartners: number;
  activePartners: number;
  pendingSettlements: number;
  totalBookings: number;
}

// ─── Calendar Event ─────────────────────────
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'leave' | 'meeting' | 'holiday' | 'deadline';
  color: string;
  employeeId?: string;
  employeeName?: string;
}

// ─── Stats ──────────────────────────────────
export interface MonthlyStat {
  month: string;
  revenue: number;
  bookings: number;
  commission: number;
}

export interface CategoryStat {
  category: string;
  revenue: number;
  percentage: number;
  color: string;
}
