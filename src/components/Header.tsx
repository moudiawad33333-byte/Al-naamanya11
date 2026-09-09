import React from 'react';
import { useAccounting } from '../context/AccountingContext';
import { Emblem } from './Emblem';
import { ArrowLeftRight, Building2, MapPin, Wallet, Lock, KeyRound } from "lucide-react";

interface HeaderProps {
  onOpenTransferModal?: () => void;
  onOpenPasswordModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTransferModal, onOpenPasswordModal }) => {
  const {
    currentUser,
    switchUser,
    users,
    selectedBranch,
    setSelectedBranch,
    cashBalance,
    bankBalance,
    lockApp,
    hasCustomPassword,
  } = useAccounting();

  const roleBadge = (() => {
    switch (currentUser.role) {
      case 'admin':
        return { label: 'مدير مركز', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'accountant':
        return { label: 'المسؤولة المالية', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'مطالعة وتدقيق', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  })();

  const branchLabel =
    selectedBranch === 'minieh'
      ? 'فرع المنية'
      : selectedBranch === 'halba'
      ? 'فرع حلبا'
      : 'كلا الفرعين (مجمع)';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-3 gap-3">
          {/* Logo and Titles */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
            <Emblem size={46} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  مركز التوحد والصعوبات التعليمية
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-teal-800 text-white font-extrabold tracking-wider font-mono">
                  C.A.L.D
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-extrabold border flex items-center gap-1 ${
                    selectedBranch === 'minieh'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      : selectedBranch === 'halba'
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  <span>محاسبة {branchLabel}</span>
                </span>
              </div>

              {/* Branch Quick links */}
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5 flex-wrap">
                <span
                  onClick={() => setSelectedBranch('halba')}
                  className={`cursor-pointer transition-all px-1.5 py-0.5 rounded ${
                    selectedBranch === 'halba'
                      ? 'bg-teal-100 text-teal-900 font-black'
                      : 'hover:text-teal-700 text-slate-600'
                  }`}
                  title="التبديل لمحاسبة حلبا"
                >
                  <MapPin className="h-3 w-3 text-teal-600 inline ml-0.5" />
                  <strong>فرع حلبا:</strong> أ. سعد غية
                </span>
                <span className="text-slate-300">|</span>
                <span
                  onClick={() => setSelectedBranch('minieh')}
                  className={`cursor-pointer transition-all px-1.5 py-0.5 rounded ${
                    selectedBranch === 'minieh'
                      ? 'bg-indigo-100 text-indigo-900 font-black'
                      : 'hover:text-indigo-700 text-slate-600'
                  }`}
                  title="التبديل لمحاسبة المنية"
                >
                  <MapPin className="h-3 w-3 text-indigo-600 inline ml-0.5" />
                  <strong>فرع المنية:</strong> أ. هبة سحمراني
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-teal-800 font-bold">
                  <strong>المحاسبة:</strong> ملك عوض
                </span>
              </div>
            </div>
          </div>

          {/* Quick Balances & User selector */}
          <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-end">
            {/* Cash Box */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="p-1 rounded-md bg-emerald-600 text-white">
                <Wallet className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold text-emerald-700 leading-tight">
                  صندوق {selectedBranch === 'minieh' ? 'المنية' : selectedBranch === 'halba' ? 'حلبا' : 'العام'}
                </div>
                <div className="text-sm font-extrabold text-emerald-900 leading-none">
                  {cashBalance.toLocaleString('en-US')}{' '}
                  <span className="text-[10px] font-normal">$</span>
                </div>
              </div>
            </div>

            {/* Bank */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900">
              <div className="p-1 rounded-md bg-sky-600 text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold text-sky-700 leading-tight">
                  بنك {selectedBranch === 'minieh' ? 'المنية' : selectedBranch === 'halba' ? 'حلبا' : 'العام'}
                </div>
                <div className="text-sm font-extrabold text-sky-900 leading-none">
                  {bankBalance.toLocaleString('en-US')}{' '}
                  <span className="text-[10px] font-normal">$</span>
                </div>
              </div>
            </div>

            {/* Quick transfer button */}
            {currentUser.role !== 'viewer' && onOpenTransferModal && (
              <button
                id="btn-quick-transfer"
                onClick={onOpenTransferModal}
                title="تحويل بين الصندوق والبنك"
                className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200 cursor-pointer"
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-slate-600" />
                <span className="hidden sm:inline">تحويل خزينة</span>
              </button>
            )}

            {/* Change Password / Security button */}
            {onOpenPasswordModal && (
              <button
                id="btn-open-password-modal"
                onClick={onOpenPasswordModal}
                title="تغيير وإدارة كلمة سر النظام"
                className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition border cursor-pointer ${
                  hasCustomPassword
                    ? 'text-teal-800 bg-teal-50 hover:bg-teal-100 border-teal-200'
                    : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200'
                }`}
              >
                <KeyRound className="h-3.5 w-3.5 text-current" />
                <span className="hidden md:inline">كلمة السر</span>
              </button>
            )}

            {/* Lock App Now button */}
            <button
              id="btn-lock-app-now"
              onClick={lockApp}
              title="قفل شاشة النظام فوراً (لحماية البيانات عند مغادرة الجهاز)"
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-200 cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-rose-600" />
              <span>قفل النظام</span>
            </button>

            {/* Current user & Switcher */}
            <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
              <div className="text-left hidden xl:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.fullName}
                </div>
                <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${roleBadge.color}`}>
                  {currentUser.title}
                </span>
              </div>
              <div className="relative">
                <select
                  id="user-role-selector"
                  value={currentUser.id}
                  onChange={(e) => switchUser(e.target.value)}
                  className="text-xs bg-slate-100 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 font-bold cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  title="محاكاة تبديل المستخدم والصلاحيات"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      👤 {u.fullName} - ({u.title})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
