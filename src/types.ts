export type Branch = 'halba' | 'minieh' | 'all';

export type UserRole = 'admin' | 'accountant' | 'viewer';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  title: string;
  branch: Branch;
}

export interface Student {
  id: string;
  code?: string;
  name: string;
  fatherName?: string;
  motherName?: string;
  phone?: string;
  branch: 'halba' | 'minieh';
  totalRequired: number;
  discount?: number;
  notes?: string;
  createdAt?: string;
  isActive?: boolean;
  program?: string;
}

export interface StudentPayment {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  branch: 'halba' | 'minieh';
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank';
  notes?: string;
  isCancelled?: boolean;
  cancelReason?: string;
  createdBy?: string;
  createdAt?: string;
}

export type StaffRole = 'teacher' | 'specialist' | 'admin_staff';

export interface StaffMember {
  id: string;
  code?: string;
  name: string;
  jobTitle: string;
  role: StaffRole;
  branch: 'halba' | 'minieh';
  phone?: string;
  calculationType?: string;
  monthlySalary?: number;
  ratePerSession?: number;
  sessionsCount?: number;
  periodRequiredAmount: number;
  periodLabel?: string;
  notes?: string;
  isActive: boolean;
}

export interface StaffPayment {
  id: string;
  receiptNumber: string;
  staffId: string;
  staffName: string;
  staffRole: StaffRole | string;
  branch: 'halba' | 'minieh';
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank';
  periodLabel?: string;
  notes?: string;
  isCancelled?: boolean;
  cancelReason?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Expense {
  id: string;
  receiptNumber: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'bank';
  branch: 'halba' | 'minieh';
  recordedBy: string;
  notes?: string;
  isCancelled?: boolean;
  cancelReason?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  actionType: 'CREATE' | 'UPDATE' | 'CANCEL' | 'LOGIN' | 'DELETE' | 'BACKUP';
  entityName: string;
  details: string;
}

export interface TreasuryTransfer {
  id: string;
  from: 'cash' | 'bank';
  to: 'cash' | 'bank';
  fromBranch: 'halba' | 'minieh';
  toBranch: 'halba' | 'minieh';
  amount: number;
  date: string;
  note: string;
}

export interface ActiveReceipt {
  type: 'student' | 'staff' | 'expense';
  data: any;
  studentOrStaff?: any;
}

export interface TreasuryBalance {
  cashBalance: number;
  bankBalance: number;
  total: number;
  cash: number;
  bank: number;
}

export interface BranchTreasury {
  halba: TreasuryBalance;
  minieh: TreasuryBalance;
  combined: TreasuryBalance;
  all: TreasuryBalance;
}

export interface BranchStats {
  branchId: Branch;
  name: string;
  manager: string;
  totalStudents: number;
  totalStudentCollected: number;
  totalStudentRemaining: number;
  totalStaffCount: number;
  totalStaffPaid: number;
  totalStaffRemaining: number;
  totalExpenses: number;
  cashBalance: number;
  bankBalance: number;
  netTreasury: number;
  netFinancialBalance: number;
}
