import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Branch,
  User,
  Student,
  StudentPayment,
  StaffMember,
  StaffPayment,
  Expense,
  AuditLog,
  TreasuryTransfer,
  ActiveReceipt,
  BranchTreasury,
  BranchStats,
} from '../types';

export const DEFAULT_USERS: User[] = [
  {
    id: 'u-3',
    username: 'malak_awad',
    fullName: 'أ. ملك عوض (المحاسبة)',
    role: 'accountant',
    title: 'المسؤولة المالية والمحاسبة العامة',
    branch: 'all',
  },
  {
    id: 'u-1',
    username: 'saad_ghieh',
    fullName: 'أ. سعد غية (مدير فرع حلبا)',
    role: 'admin',
    title: 'مدير مركز التوحد - فرع حلبا',
    branch: 'halba',
  },
  {
    id: 'u-2',
    username: 'hiba_sahmarani',
    fullName: 'أ. هبة سحمراني (مديرة فرع المنية)',
    role: 'admin',
    title: 'مديرة مركز التوحد - فرع المنية',
    branch: 'minieh',
  },
  {
    id: 'u-4',
    username: 'viewer',
    fullName: 'زائر تدقيق (مطالعة فقط)',
    role: 'viewer',
    title: 'مساعد إداري / تدقيق ومطالعة',
    branch: 'all',
  },
];

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-init-cald',
    timestamp: '2026-03-01 08:00:00',
    userName: 'النظام المحاسبي',
    userRole: 'admin',
    actionType: 'CREATE',
    entityName: 'system',
    details:
      'تهيئة النظام المحاسبي المالي النظيف لمركز التوحد والصعوبات التعليمية C.A.L.D (جاهز لتسجيل القيود الفعلية لفرعي حلبا والمنية)',
  },
];

const STORAGE_KEY = 'educational_association_accounting_v5_live';
const PASSWORD_STORAGE_KEY = 'cald_security_password_v1';
const DEFAULT_ALLOWED_PASSWORDS = ['222326'];

interface AccountingContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  users: User[];
  selectedBranch: Branch;
  setSelectedBranch: (branch: Branch) => void;
  branchTreasury: BranchTreasury;
  getBranchStats: (branch: Branch) => BranchStats;
  students: Student[];
  studentPayments: StudentPayment[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'isActive'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  addStudentPayment: (payment: {
    studentId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'cash' | 'bank';
    notes?: string;
  }) => StudentPayment;
  cancelStudentPayment: (paymentId: string, reason: string) => void;
  getStudentBalance: (studentId: string) => { totalRequired: number; paid: number; remaining: number };
  staff: StaffMember[];
  staffPayments: StaffPayment[];
  addStaff: (staff: Omit<StaffMember, 'id' | 'isActive'>) => void;
  addStaffMember: (staff: Omit<StaffMember, 'id' | 'isActive'>) => void;
  updateStaff: (id: string, data: Partial<StaffMember>) => void;
  addStaffPayment: (payment: {
    staffId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'cash' | 'bank';
    periodLabel?: string;
    notes?: string;
  }) => StaffPayment;
  cancelStaffPayment: (paymentId: string, reason: string) => void;
  getStaffBalance: (staffId: string) => { totalDue: number; paid: number; remaining: number };
  expenses: Expense[];
  addExpense: (expense: {
    category: string;
    description: string;
    amount: number;
    paymentMethod: 'cash' | 'bank';
    branch?: 'halba' | 'minieh';
    date: string;
    notes?: string;
  }) => Expense;
  cancelExpense: (expenseId: string, reason: string) => void;
  baseCash: number;
  baseBank: number;
  cashBalance: number;
  bankBalance: number;
  transferFunds: (
    from: 'cash' | 'bank',
    to: 'cash' | 'bank',
    amount: number,
    note: string,
    fromBranch?: 'halba' | 'minieh',
    toBranch?: 'halba' | 'minieh'
  ) => void;
  auditLogs: AuditLog[];
  activeReceipt: ActiveReceipt | null;
  openReceiptModal: (type: 'student' | 'staff' | 'expense', data: any, studentOrStaff?: any) => void;
  closeReceiptModal: () => void;
  activeStudentStatementId: string | null;
  openStudentStatement: (studentId: string) => void;
  closeStudentStatement: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
  // Security & Lock Screen
  isLocked: boolean;
  unlockApp: (password: string) => { success: boolean; error?: string };
  lockApp: () => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; error?: string };
  hasCustomPassword: boolean;
  resetPasswordToDefault: () => void;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentPayments, setStudentPayments] = useState<StudentPayment[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [transfers, setTransfers] = useState<TreasuryTransfer[]>([]);

  const [selectedBranch, setSelectedBranchState] = useState<Branch>(() => {
    try {
      const saved = localStorage.getItem('cald_active_branch');
      if (saved === 'halba' || saved === 'minieh' || saved === 'all') return saved;
    } catch {}
    return 'minieh';
  });

  const setSelectedBranch = (branch: Branch) => {
    setSelectedBranchState(branch);
    try {
      localStorage.setItem('cald_active_branch', branch);
    } catch {}
    logAction(
      'UPDATE',
      'system',
      `تم التبديل إلى: ${
        branch === 'minieh'
          ? 'محاسبة فرع المنية المستقلة (أ. هبة سحمراني)'
          : branch === 'halba'
          ? 'محاسبة فرع حلبا المستقلة (أ. سعد غية)'
          : 'الحساب المجمّع الموحد لفرعي C.A.L.D'
      }`
    );
  };

  const [activeReceipt, setActiveReceipt] = useState<ActiveReceipt | null>(null);
  const [activeStudentStatementId, setActiveStudentStatementId] = useState<string | null>(null);

  // Security & Lock State (Default to locked on every entry/visit as requested)
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [hasCustomPassword, setHasCustomPassword] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(PASSWORD_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  // Ensure 222326 is the active configured password
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PASSWORD_STORAGE_KEY);
      if (!stored || stored !== '222326') {
        localStorage.setItem(PASSWORD_STORAGE_KEY, '222326');
        setHasCustomPassword(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Auto-lock after 15 minutes of inactivity
  useEffect(() => {
    if (isLocked) return;
    let timer: any;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsLocked(true);
        logAction('LOGIN', 'security', 'تم قفل النظام تلقائياً لحماية البيانات بسبب عدم النشاط');
      }, 15 * 60 * 1000);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [isLocked, currentUser]);

  const unlockApp = (password: string): { success: boolean; error?: string } => {
    try {
      const stored = localStorage.getItem(PASSWORD_STORAGE_KEY);
      const trimmed = (password || '').trim();

      const isValid = trimmed === '222326' || (stored ? trimmed === stored : false);

      if (isValid) {
        setIsLocked(false);
        logAction('LOGIN', 'security', `تم فك قفل النظام بنجاح بواسطة: ${currentUser.fullName}`);
        return { success: true };
      } else {
        logAction('LOGIN', 'security', 'محاولة فاشلة لفك قفل النظام برمز خاطئ');
        return {
          success: false,
          error: 'كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة',
        };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'حدث خطأ غير متوقع أثناء التحقق' };
    }
  };

  const lockApp = () => {
    setIsLocked(true);
    logAction('LOGIN', 'security', 'تم قفل النظام يدوياً لحماية سرية الحسابات');
  };

  const changePassword = (
    currentPass: string,
    newPass: string
  ): { success: boolean; error?: string } => {
    try {
      const stored = localStorage.getItem(PASSWORD_STORAGE_KEY);
      const trimmedCurrent = (currentPass || '').trim();
      const trimmedNew = (newPass || '').trim();

      const isCurrentValid = trimmedCurrent === '222326' || (stored ? trimmedCurrent === stored : false);

      if (!isCurrentValid) {
        return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
      }

      if (trimmedNew.length < 4) {
        return {
          success: false,
          error: 'كلمة المرور الجديدة يجب أن تتكون من 4 أحرف أو أرقام على الأقل',
        };
      }

      localStorage.setItem(PASSWORD_STORAGE_KEY, trimmedNew);
      setHasCustomPassword(true);
      logAction(
        'UPDATE',
        'security',
        `تم تغيير كلمة مرور النظام بنجاح بواسطة: ${currentUser.fullName}`
      );
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'تعذر حفظ كلمة المرور الجديدة' };
    }
  };

  const resetPasswordToDefault = () => {
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, '222326');
      setHasCustomPassword(true);
      logAction('UPDATE', 'security', 'تمت استعادة كلمة المرور المعتمدة للنظام (222326)');
    } catch (e) {
      console.error(e);
    }
  };

  // Load from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('educational_association_accounting_v2_cald');
      localStorage.removeItem('educational_association_accounting_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.students && Array.isArray(data.students)) setStudents(data.students);
        if (data.studentPayments && Array.isArray(data.studentPayments)) setStudentPayments(data.studentPayments);
        if (data.staff && Array.isArray(data.staff)) setStaff(data.staff);
        if (data.staffPayments && Array.isArray(data.staffPayments)) setStaffPayments(data.staffPayments);
        if (data.expenses && Array.isArray(data.expenses)) setExpenses(data.expenses);
        if (data.auditLogs && Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
        if (data.transfers && Array.isArray(data.transfers)) setTransfers(data.transfers);
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const data = {
        students,
        studentPayments,
        staff,
        staffPayments,
        expenses,
        auditLogs,
        transfers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  }, [students, studentPayments, staff, staffPayments, expenses, auditLogs, transfers, isLoaded]);

  const logAction = (
    actionType: 'CREATE' | 'UPDATE' | 'CANCEL' | 'LOGIN' | 'DELETE' | 'BACKUP',
    entityName: string,
    details: string
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      actionType,
      entityName,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchUser = (userId: string) => {
    const user = DEFAULT_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.branch && (user.branch === 'halba' || user.branch === 'minieh')) {
        setSelectedBranch(user.branch);
      }
      logAction('LOGIN', 'system', `تم تغيير جلسة المستخدم إلى: ${user.fullName} (${user.role})`);
    }
  };

  const normBranch = (b?: string) => (b === 'minieh' ? 'minieh' : 'halba');

  // Halba Treasury
  const halbaStudentCash = studentPayments
    .filter((p) => !p.isCancelled && p.paymentMethod === 'cash' && normBranch(p.branch) === 'halba')
    .reduce((acc, p) => acc + p.amount, 0);
  const halbaStudentBank = studentPayments
    .filter((p) => !p.isCancelled && p.paymentMethod === 'bank' && normBranch(p.branch) === 'halba')
    .reduce((acc, p) => acc + p.amount, 0);
  const halbaStaffCash = staffPayments
    .filter((p) => !p.isCancelled && p.paymentMethod === 'cash' && normBranch(p.branch) === 'halba')
    .reduce((acc, p) => acc + p.amount, 0);
  const halbaStaffBank = staffPayments
    .filter((p) => !p.isCancelled && p.paymentMethod === 'bank' && normBranch(p.branch) === 'halba')
    .reduce((acc, p) => acc + p.amount, 0);
  const halbaExpCash = expenses
    .filter((p) => !p.isCancelled && p.paymentMethod === 'cash' && normBranch(p.branch) === 'halba')
    .reduce((acc, p) => acc + p.amount, 0);
  const halbaExpBank = expenses
    .filter((p) => !p.isCancelled && p.paymentMethod === 'bank' && normBranch(p.branch) === 'halba')
    .reduce((acc, p) => acc + p.amount, 0);

  const halbaTransfersInCash = transfers
    .filter((t) => t.to === 'cash' && normBranch(t.toBranch) === 'halba')
    .reduce((acc, t) => acc + t.amount, 0);
  const halbaTransfersOutCash = transfers
    .filter((t) => t.from === 'cash' && normBranch(t.fromBranch) === 'halba')
    .reduce((acc, t) => acc + t.amount, 0);
  const halbaTransfersInBank = transfers
    .filter((t) => t.to === 'bank' && normBranch(t.toBranch) === 'halba')
    .reduce((acc, t) => acc + t.amount, 0);
  const halbaTransfersOutBank = transfers
    .filter((t) => t.from === 'bank' && normBranch(t.fromBranch) === 'halba')
    .reduce((acc, t) => acc + t.amount, 0);

  const halbaCashBalance = halbaStudentCash - halbaStaffCash - halbaExpCash + halbaTransfersInCash - halbaTransfersOutCash;
  const halbaBankBalance = halbaStudentBank - halbaStaffBank - halbaExpBank + halbaTransfersInBank - halbaTransfersOutBank;

  // Minieh Treasury
  const miniehStudentCash = studentPayments
    .filter((p) => !p.isCancelled && p.paymentMethod === 'cash' && normBranch(p.branch) === 'minieh')
    .reduce((acc, p) => acc + p.amount, 0);
  const miniehStudentBank = studentPayments
    .filter((p) => !p.isCancelled && p.paymentMethod === 'bank' && normBranch(p.branch) === 'minieh')
    .reduce((acc, p) => acc + p.amount, 0);
  const miniehStaffCash = staffPayments
    .filter((p) => !p.isCancelled && p.paymentMethod === 'cash' && normBranch(p.branch) === 'minieh')
    .reduce((acc, p) => acc + p.amount, 0);
  const miniehStaffBank = staffPayments
    .filter((p) => !p.isCancelled && p.paymentMethod === 'bank' && normBranch(p.branch) === 'minieh')
    .reduce((acc, p) => acc + p.amount, 0);
  const miniehExpCash = expenses
    .filter((p) => !p.isCancelled && p.paymentMethod === 'cash' && normBranch(p.branch) === 'minieh')
    .reduce((acc, p) => acc + p.amount, 0);
  const miniehExpBank = expenses
    .filter((p) => !p.isCancelled && p.paymentMethod === 'bank' && normBranch(p.branch) === 'minieh')
    .reduce((acc, p) => acc + p.amount, 0);

  const miniehTransfersInCash = transfers
    .filter((t) => t.to === 'cash' && normBranch(t.toBranch) === 'minieh')
    .reduce((acc, t) => acc + t.amount, 0);
  const miniehTransfersOutCash = transfers
    .filter((t) => t.from === 'cash' && normBranch(t.fromBranch) === 'minieh')
    .reduce((acc, t) => acc + t.amount, 0);
  const miniehTransfersInBank = transfers
    .filter((t) => t.to === 'bank' && normBranch(t.toBranch) === 'minieh')
    .reduce((acc, t) => acc + t.amount, 0);
  const miniehTransfersOutBank = transfers
    .filter((t) => t.from === 'bank' && normBranch(t.fromBranch) === 'minieh')
    .reduce((acc, t) => acc + t.amount, 0);

  const miniehCashBalance = miniehStudentCash - miniehStaffCash - miniehExpCash + miniehTransfersInCash - miniehTransfersOutCash;
  const miniehBankBalance = miniehStudentBank - miniehStaffBank - miniehExpBank + miniehTransfersInBank - miniehTransfersOutBank;

  const combinedTreasury = {
    cashBalance: halbaCashBalance + miniehCashBalance,
    bankBalance: halbaBankBalance + miniehBankBalance,
    total: halbaCashBalance + miniehCashBalance + halbaBankBalance + miniehBankBalance,
    cash: halbaCashBalance + miniehCashBalance,
    bank: halbaBankBalance + miniehBankBalance,
  };

  const branchTreasury: BranchTreasury = {
    halba: {
      cashBalance: halbaCashBalance,
      bankBalance: halbaBankBalance,
      total: halbaCashBalance + halbaBankBalance,
      cash: halbaCashBalance,
      bank: halbaBankBalance,
    },
    minieh: {
      cashBalance: miniehCashBalance,
      bankBalance: miniehBankBalance,
      total: miniehCashBalance + miniehBankBalance,
      cash: miniehCashBalance,
      bank: miniehBankBalance,
    },
    combined: combinedTreasury,
    all: combinedTreasury,
  };

  const cashBalance =
    selectedBranch === 'minieh'
      ? miniehCashBalance
      : selectedBranch === 'halba'
      ? halbaCashBalance
      : halbaCashBalance + miniehCashBalance;

  const bankBalance =
    selectedBranch === 'minieh'
      ? miniehBankBalance
      : selectedBranch === 'halba'
      ? halbaBankBalance
      : halbaBankBalance + miniehBankBalance;

  const baseCash = 0;
  const baseBank = 0;

  const getStudentBalance = (studentId: string) => {
    const std = students.find((s) => s.id === studentId);
    if (!std) return { totalRequired: 0, paid: 0, remaining: 0 };
    const paid = studentPayments
      .filter((p) => p.studentId === studentId && !p.isCancelled)
      .reduce((acc, p) => acc + p.amount, 0);
    return {
      totalRequired: std.totalRequired,
      paid,
      remaining: Math.max(0, std.totalRequired - paid),
    };
  };

  const getStaffBalance = (staffId: string) => {
    const member = staff.find((s) => s.id === staffId);
    if (!member) return { totalDue: 0, paid: 0, remaining: 0 };
    const totalDue =
      member.calculationType === 'session_based'
        ? (member.sessionsCount || 0) * (member.ratePerSession || 0)
        : member.periodRequiredAmount;
    const paid = staffPayments
      .filter((p) => p.staffId === staffId && !p.isCancelled)
      .reduce((acc, p) => acc + p.amount, 0);
    return {
      totalDue,
      paid,
      remaining: Math.max(0, totalDue - paid),
    };
  };

  const getBranchStats = (branch: Branch): BranchStats => {
    const isMinieh = branch === 'minieh';
    const isHalba = branch === 'halba';

    const branchStudents = students.filter((s) =>
      isMinieh ? (s.branch || 'halba') === 'minieh' : isHalba ? (s.branch || 'halba') === 'halba' : true
    );
    const branchPayments = studentPayments.filter((p) =>
      p.isCancelled ? false : isMinieh ? (p.branch || 'halba') === 'minieh' : isHalba ? (p.branch || 'halba') === 'halba' : true
    );
    const branchStaff = staff.filter((s) =>
      isMinieh ? (s.branch || 'halba') === 'minieh' : isHalba ? (s.branch || 'halba') === 'halba' : true
    );
    const branchStaffPayments = staffPayments.filter((p) =>
      p.isCancelled ? false : isMinieh ? (p.branch || 'halba') === 'minieh' : isHalba ? (p.branch || 'halba') === 'halba' : true
    );
    const branchExpenses = expenses.filter((e) =>
      e.isCancelled ? false : isMinieh ? (e.branch || 'halba') === 'minieh' : isHalba ? (e.branch || 'halba') === 'halba' : true
    );

    const totalStudentCollected = branchPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalStudentRemaining = branchStudents.reduce((acc, s) => acc + getStudentBalance(s.id).remaining, 0);
    const totalStaffPaid = branchStaffPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalStaffRemaining = branchStaff.reduce((acc, s) => acc + getStaffBalance(s.id).remaining, 0);
    const totalExpenses = branchExpenses.reduce((acc, e) => acc + e.amount, 0);

    const cBalance = isMinieh ? miniehCashBalance : isHalba ? halbaCashBalance : halbaCashBalance + miniehCashBalance;
    const bBalance = isMinieh ? miniehBankBalance : isHalba ? halbaBankBalance : halbaBankBalance + miniehBankBalance;

    return {
      branchId: branch,
      name: isMinieh ? 'فرع المنية' : isHalba ? 'فرع حلبا' : 'مركز C.A.L.D الموحد (الفرعين)',
      manager: isMinieh ? 'أ. هبة سحمراني' : isHalba ? 'أ. سعد غية' : 'إدارة الفرعين المشتركة',
      totalStudents: branchStudents.length,
      totalStudentCollected,
      totalStudentRemaining,
      totalStaffCount: branchStaff.length,
      totalStaffPaid,
      totalStaffRemaining,
      totalExpenses,
      cashBalance: cBalance,
      bankBalance: bBalance,
      netTreasury: cBalance + bBalance,
      netFinancialBalance: totalStudentCollected - (totalExpenses + totalStaffPaid),
    };
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'isActive'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    setStudents((prev) => [newStudent, ...prev]);
    logAction('CREATE', 'student', `إضافة ملف طالب جديد: ${studentData.name} بإجمالي مطلوب ${studentData.totalRequired}$`);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    logAction('UPDATE', 'student', `تحديث بيانات الطالب كود: ${id}`);
  };

  const addStudentPayment = (paymentData: {
    studentId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'cash' | 'bank';
    notes?: string;
  }): StudentPayment => {
    const std = students.find((s) => s.id === paymentData.studentId);
    const receiptNum = `REC-${new Date().getFullYear()}-${String(studentPayments.length + 1).padStart(3, '0')}`;
    const newPayment: StudentPayment = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: paymentData.studentId,
      studentName: std?.name || 'طالب',
      branch: std?.branch || 'halba',
      amount: paymentData.amount,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      notes: paymentData.notes,
      createdBy: currentUser.fullName,
      createdAt: new Date().toISOString(),
    };
    setStudentPayments((prev) => [newPayment, ...prev]);
    logAction(
      'CREATE',
      'payment',
      `تسجيل دفعة قبض للطالب: ${std?.name || ''} بمبلغ ${paymentData.amount}$ في (${
        paymentData.paymentMethod === 'cash' ? 'الصندوق' : 'البنك'
      }) برقم إيصال ${receiptNum}`
    );
    return newPayment;
  };

  const cancelStudentPayment = (paymentId: string, reason: string) => {
    setStudentPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, isCancelled: true, cancelReason: reason } : p))
    );
    const p = studentPayments.find((item) => item.id === paymentId);
    logAction(
      'CANCEL',
      'payment',
      `إلغاء دفعة الطالب: ${p?.studentName} رقم الإيصال ${p?.receiptNumber} بمبلغ ${p?.amount}$. السبب: ${reason}`
    );
  };

  const addStaff = (staffData: Omit<StaffMember, 'id' | 'isActive'>) => {
    const newStaff: StaffMember = {
      ...staffData,
      id: `stf-${Date.now()}`,
      isActive: true,
    };
    setStaff((prev) => [...prev, newStaff]);
    logAction('CREATE', 'staff', `إضافة كادر جديد: ${staffData.name} (${staffData.jobTitle})`);
  };

  const updateStaff = (id: string, data: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    logAction('UPDATE', 'staff', `تحديث بيانات الموظف/الكادر كود: ${id}`);
  };

  const addStaffPayment = (paymentData: {
    staffId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'cash' | 'bank';
    periodLabel?: string;
    notes?: string;
  }): StaffPayment => {
    const member = staff.find((s) => s.id === paymentData.staffId);
    const receiptNum = `DIS-${new Date().getFullYear()}-${String(staffPayments.length + 1).padStart(3, '0')}`;
    const newPayment: StaffPayment = {
      id: `pay-stf-${Date.now()}`,
      receiptNumber: receiptNum,
      staffId: paymentData.staffId,
      staffName: member?.name || 'كادر',
      staffRole: member?.role || 'teacher',
      branch: member?.branch || 'halba',
      amount: paymentData.amount,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      periodLabel: paymentData.periodLabel,
      notes: paymentData.notes,
      createdBy: currentUser.fullName,
      createdAt: new Date().toISOString(),
    };
    setStaffPayments((prev) => [newPayment, ...prev]);
    logAction(
      'CREATE',
      'staff',
      `صرف دفعة مستحقات للموظف/المعلمة: ${member?.name} بمبلغ ${paymentData.amount}$ من (${
        paymentData.paymentMethod === 'cash' ? 'الصندوق' : 'البنك'
      }) برقم سند ${receiptNum}`
    );
    return newPayment;
  };

  const cancelStaffPayment = (paymentId: string, reason: string) => {
    setStaffPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, isCancelled: true, cancelReason: reason } : p))
    );
    const p = staffPayments.find((item) => item.id === paymentId);
    logAction(
      'CANCEL',
      'staff',
      `إلغاء سند صرف للموظف: ${p?.staffName} رقم ${p?.receiptNumber} بمبلغ ${p?.amount}$. السبب: ${reason}`
    );
  };

  const addExpense = (expenseData: {
    category: string;
    description: string;
    amount: number;
    paymentMethod: 'cash' | 'bank';
    branch?: 'halba' | 'minieh';
    date: string;
    notes?: string;
  }): Expense => {
    const receiptNum = `EXP-${new Date().getFullYear()}-${String(expenses.length + 1).padStart(3, '0')}`;
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      receiptNumber: receiptNum,
      date: expenseData.date,
      category: expenseData.category,
      description: expenseData.description,
      amount: expenseData.amount,
      paymentMethod: expenseData.paymentMethod,
      branch: expenseData.branch || (currentUser.branch === 'minieh' ? 'minieh' : 'halba'),
      recordedBy: currentUser.fullName,
      notes: expenseData.notes,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    logAction(
      'CREATE',
      'expense',
      `تسجيل مصروف جديد [${expenseData.category}]: "${expenseData.description}" بمبلغ ${expenseData.amount}$ عبر (${
        expenseData.paymentMethod === 'cash' ? 'الصندوق' : 'البنك'
      })`
    );
    return newExpense;
  };

  const cancelExpense = (expenseId: string, reason: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === expenseId ? { ...e, isCancelled: true, cancelReason: reason } : e))
    );
    const e = expenses.find((item) => item.id === expenseId);
    logAction(
      'CANCEL',
      'expense',
      `إلغاء قيد مصروف: "${e?.description}" سند رقم ${e?.receiptNumber} بمبلغ ${e?.amount}$. السبب: ${reason}`
    );
  };

  const transferFunds = (
    from: 'cash' | 'bank',
    to: 'cash' | 'bank',
    amount: number,
    note: string,
    fromBranch?: 'halba' | 'minieh',
    toBranch?: 'halba' | 'minieh'
  ) => {
    if (amount <= 0) return;
    const fBranch = fromBranch || (selectedBranch === 'minieh' ? 'minieh' : 'halba');
    const tBranch = toBranch || fBranch;
    if (from === to && fBranch === tBranch) return;

    const newTransfer: TreasuryTransfer = {
      id: `trans-${Date.now()}`,
      from,
      to,
      amount,
      date: new Date().toISOString().split('T')[0],
      note,
      fromBranch: fBranch,
      toBranch: tBranch,
    };
    setTransfers((prev) => [...prev, newTransfer]);
    logAction(
      'UPDATE',
      'treasury',
      `تحويل مالي: من ${from === 'cash' ? 'صندوق' : 'بنك'} (${
        fBranch === 'minieh' ? 'المنية' : 'حلبا'
      }) إلى ${to === 'cash' ? 'صندوق' : 'بنك'} (${
        tBranch === 'minieh' ? 'المنية' : 'حلبا'
      }) بمبلغ ${amount}$. ملاحظة: ${note}`
    );
  };

  const openReceiptModal = (type: 'student' | 'staff' | 'expense', data: any, studentOrStaff?: any) => {
    setActiveReceipt({ type, data, studentOrStaff });
  };

  const closeReceiptModal = () => {
    setActiveReceipt(null);
  };

  const openStudentStatement = (studentId: string) => {
    setActiveStudentStatementId(studentId);
  };

  const closeStudentStatement = () => {
    setActiveStudentStatementId(null);
  };

  const exportDatabaseJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      system: 'برنامج المحاسبة والإدارة المالية - مركز التوحد والصعوبات التعليمية C.A.L.D',
      version: '2.0.0',
      data: {
        students,
        studentPayments,
        staff,
        staffPayments,
        expenses,
        transfers,
        auditLogs,
      },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `نسخة_احتياطية_الجمعية_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logAction('BACKUP', 'system', 'تصدير نسخة احتياطية كاملة لقاعدة البيانات كملف JSON');
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;
      if (data.students && Array.isArray(data.students)) setStudents(data.students);
      if (data.studentPayments && Array.isArray(data.studentPayments)) setStudentPayments(data.studentPayments);
      if (data.staff && Array.isArray(data.staff)) setStaff(data.staff);
      if (data.staffPayments && Array.isArray(data.staffPayments)) setStaffPayments(data.staffPayments);
      if (data.expenses && Array.isArray(data.expenses)) setExpenses(data.expenses);
      if (data.auditLogs && Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      if (data.transfers && Array.isArray(data.transfers)) setTransfers(data.transfers);
      logAction('BACKUP', 'system', 'استيراد واستعادة قاعدة بيانات من ملف نسخة احتياطية بنجاح');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setStudents([]);
    setStudentPayments([]);
    setStaff([]);
    setStaffPayments([]);
    setExpenses([]);
    setTransfers([]);
    setAuditLogs([
      {
        id: `log-reset-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        userName: currentUser.fullName,
        userRole: currentUser.role,
        actionType: 'UPDATE',
        entityName: 'system',
        details: 'تفريغ وتصفير النظام المالي لكافة الفروع والبدء بقاعدة بيانات نظيفة',
      },
    ]);
  };

  return (
    <AccountingContext.Provider
      value={{
        currentUser,
        switchUser,
        users: DEFAULT_USERS,
        selectedBranch,
        setSelectedBranch,
        branchTreasury,
        getBranchStats,
        students,
        studentPayments,
        addStudent,
        updateStudent,
        addStudentPayment,
        cancelStudentPayment,
        getStudentBalance,
        staff,
        staffPayments,
        addStaff,
        addStaffMember: addStaff,
        updateStaff,
        addStaffPayment,
        cancelStaffPayment,
        getStaffBalance,
        expenses,
        addExpense,
        cancelExpense,
        baseCash,
        baseBank,
        cashBalance,
        bankBalance,
        transferFunds,
        auditLogs,
        activeReceipt,
        openReceiptModal,
        closeReceiptModal,
        activeStudentStatementId,
        openStudentStatement,
        closeStudentStatement,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToDefaultData,
        isLocked,
        unlockApp,
        lockApp,
        changePassword,
        hasCustomPassword,
        resetPasswordToDefault,
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
};
