import React, { useState } from 'react';
import { AccountingProvider, useAccounting } from './context/AccountingContext';
import { Header } from './components/Header';
import { BranchSelector } from './components/BranchSelector';
import { NavigationTabs, TabId } from './components/NavigationTabs';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { TeachersView } from './components/TeachersView';
import { SpecialistsView } from './components/SpecialistsView';
import { AdminStaffView } from './components/AdminStaffView';
import { ExpensesView } from './components/ExpensesView';
import { TreasuryView } from './components/TreasuryView';
import { ReportsView } from './components/ReportsView';
import { AuditView } from './components/AuditView';

import { ReceiptPrintModal } from './components/ReceiptPrintModal';
import { StudentStatementModal } from './components/StudentStatementModal';
import { AddPaymentModal } from './components/AddPaymentModal';
import { AddStudentModal } from './components/AddStudentModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { PayStaffModal } from './components/PayStaffModal';
import { TreasuryTransferModal } from './components/TreasuryTransferModal';
import { AddStaffModal } from './components/AddStaffModal';
import { LockScreen } from './components/LockScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';

const AppContent: React.FC = () => {
  const { isLocked } = useAccounting();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Modals state
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<any>(null);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const [isPayStaffOpen, setIsPayStaffOpen] = useState(false);
  const [selectedStaffForPay, setSelectedStaffForPay] = useState<any>(null);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffRoleToAdd, setStaffRoleToAdd] = useState<'teacher' | 'specialist' | 'admin_staff'>('teacher');

  if (isLocked) {
    return <LockScreen />;
  }

  const handleOpenAddPayment = (student?: any) => {
    setSelectedStudentForPayment(student || null);
    setIsAddPaymentOpen(true);
  };

  const handleOpenPayStaff = (staff: any) => {
    setSelectedStaffForPay(staff);
    setIsPayStaffOpen(true);
  };

  const handleOpenAddStaff = (role: 'teacher' | 'specialist' | 'admin_staff') => {
    setStaffRoleToAdd(role);
    setIsAddStaffOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-teal-700 selection:text-white"
      dir="rtl"
    >
      <Header
        onOpenTransferModal={() => setIsTransferOpen(true)}
        onOpenPasswordModal={() => setIsChangePasswordOpen(true)}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col space-y-6">
        <BranchSelector onOpenTransfer={() => setIsTransferOpen(true)} />
        <NavigationTabs activeView={activeTab} onViewChange={setActiveTab} />

        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAddPayment={() => handleOpenAddPayment()}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
              onOpenTransfer={() => setIsTransferOpen(true)}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onOpenAddPayment={(student) => handleOpenAddPayment(student)}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersView
              onOpenAddTeacher={() => handleOpenAddStaff('teacher')}
              onOpenPayTeacher={(staff) => handleOpenPayStaff(staff)}
            />
          )}

          {activeTab === 'specialists' && (
            <SpecialistsView
              onOpenAddSpecialist={() => handleOpenAddStaff('specialist')}
              onOpenPaySpecialist={(staff) => handleOpenPayStaff(staff)}
            />
          )}

          {activeTab === 'admin_staff' && (
            <AdminStaffView
              onOpenAddAdminStaff={() => handleOpenAddStaff('admin_staff')}
              onOpenPayAdminStaff={(staff) => handleOpenPayStaff(staff)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView onOpenAddExpense={() => setIsAddExpenseOpen(true)} />
          )}

          {activeTab === 'treasury' && (
            <TreasuryView onOpenTransfer={() => setIsTransferOpen(true)} />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'audit' && <AuditView />}
        </main>
      </div>

      {/* Global Modals & Print Overlays */}
      <ReceiptPrintModal />
      <StudentStatementModal />
      <AddPaymentModal
        isOpen={isAddPaymentOpen}
        onClose={() => {
          setIsAddPaymentOpen(false);
          setSelectedStudentForPayment(null);
        }}
        selectedStudent={selectedStudentForPayment}
      />
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />
      <PayStaffModal
        isOpen={isPayStaffOpen}
        onClose={() => {
          setIsPayStaffOpen(false);
          setSelectedStaffForPay(null);
        }}
        staffMember={selectedStaffForPay}
      />
      <TreasuryTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        defaultRole={staffRoleToAdd}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AccountingProvider>
      <AppContent />
    </AccountingProvider>
  );
}
