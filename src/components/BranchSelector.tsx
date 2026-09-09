import React from 'react';
import { useAccounting } from '../context/AccountingContext';
import { ArrowLeftRight, Building2, CircleCheck, MapPin } from "lucide-react";
import { Branch } from '../types';

interface BranchSelectorProps {
  onOpenTransfer?: () => void;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({ onOpenTransfer }) => {
  const {
    selectedBranch,
    setSelectedBranch,
    branchTreasury,
    students,
    getStudentBalance,
  } = useAccounting();

  const halbaStudents = students.filter((s) => (s.branch || 'halba') === 'halba');
  const halbaRemaining = halbaStudents.reduce((acc, s) => acc + getStudentBalance(s.id).remaining, 0);

  const miniehStudents = students.filter((s) => (s.branch || 'halba') === 'minieh');
  const miniehRemaining = miniehStudents.reduce((acc, s) => acc + getStudentBalance(s.id).remaining, 0);

  const branchCards: Array<{
    id: Branch;
    name: string;
    manager: string;
    subtext: string;
    badgeColor: string;
    activeBorder: string;
    activeBg: string;
    treasury: { cashBalance: number; bankBalance: number; total: number };
    studentCount: number;
    remaining: number;
  }> = [
    {
      id: 'minieh',
      name: 'محاسبة فرع المنية',
      manager: 'أ. هبة سحمراني (مديرة الفرع)',
      subtext: 'محاسبة مستقلة بالكامل - قاصة وخزينة المنية',
      badgeColor: 'bg-indigo-600 text-white',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40',
      activeBg: 'bg-indigo-700 text-white',
      treasury: branchTreasury.minieh,
      studentCount: miniehStudents.length,
      remaining: miniehRemaining,
    },
    {
      id: 'halba',
      name: 'محاسبة فرع حلبا',
      manager: 'أ. سعد غية (مدير الفرع)',
      subtext: 'محاسبة مستقلة بالكامل - قاصة وخزينة حلبا',
      badgeColor: 'bg-teal-700 text-white',
      activeBorder: 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/40',
      activeBg: 'bg-teal-700 text-white',
      treasury: branchTreasury.halba,
      studentCount: halbaStudents.length,
      remaining: halbaRemaining,
    },
    {
      id: 'all',
      name: 'حساب مجمّع (الفرعين معاً)',
      manager: 'أ. ملك عوض (المحاسبة العامة C.A.L.D)',
      subtext: 'تقرير موحد لفرعي حلبا والمنية مجتمعين',
      badgeColor: 'bg-slate-800 text-white',
      activeBorder: 'border-slate-800 ring-2 ring-slate-700/20 bg-slate-50',
      activeBg: 'bg-slate-800 text-white',
      treasury: branchTreasury.combined,
      studentCount: students.length,
      remaining: halbaRemaining + miniehRemaining,
    },
  ];

  return (
    <div className="no-print space-y-2">
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Top title and quick inter-branch transfer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-teal-700" />
            <div>
              <span className="text-xs font-black text-slate-800">
                فصل المحاسبة المستقلة حسب الفرع (C.A.L.D):
              </span>
              <span className="text-[11px] text-slate-500 mr-2">
                انقر على الفرع لعزل سجلاته وحساباته وخزينته بالكامل
              </span>
            </div>
          </div>
          {onOpenTransfer && (
            <button
              onClick={onOpenTransfer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition cursor-pointer"
              title="تحويل سيولة نقدية أو بنكية بين فرع حلبا وفرع المنية"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>تحويل بين الفرعين (حلبا ⟷ المنية)</span>
            </button>
          )}
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {branchCards.map((b) => {
            const isActive = selectedBranch === b.id;
            return (
              <button
                key={b.id}
                id={`branch-btn-${b.id}`}
                onClick={() => setSelectedBranch(b.id)}
                className={`text-right p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? b.activeBorder
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {isActive && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CircleCheck className="h-3 w-3 inline text-emerald-600" /> نشط حالياً
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin
                      className={`h-4 w-4 ${
                        b.id === 'minieh'
                          ? 'text-indigo-600'
                          : b.id === 'halba'
                          ? 'text-teal-600'
                          : 'text-slate-600'
                      }`}
                    />
                    <span className="text-sm font-black text-slate-900">{b.name}</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 mb-0.5">{b.manager}</div>
                  <div className="text-[10px] text-slate-500 mb-2">{b.subtext}</div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-1 text-center bg-white/70 rounded-lg p-1.5 mt-1">
                  <div>
                    <div className="text-[9px] text-slate-500 font-semibold">الصندوق</div>
                    <div className="text-xs font-black text-emerald-700">
                      {b.treasury.cashBalance.toLocaleString('en-US')}$
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 font-semibold">البنك</div>
                    <div className="text-xs font-black text-sky-700">
                      {b.treasury.bankBalance.toLocaleString('en-US')}$
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 font-semibold">الطلاب</div>
                    <div className="text-xs font-black text-slate-800">
                      {b.studentCount} طالب
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current status banner */}
        <div
          className={`mt-3 px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
            selectedBranch === 'minieh'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
              : selectedBranch === 'halba'
              ? 'bg-teal-50 border-teal-200 text-teal-900'
              : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-black">
              {selectedBranch === 'minieh' &&
                '📍 أنت تعمل حالياً على: محاسبة فرع المنية المستقلة (إدارة أ. هبة سحمراني)'}
              {selectedBranch === 'halba' &&
                '📍 أنت تعمل حالياً على: محاسبة فرع حلبا المستقلة (إدارة أ. سعد غية)'}
              {selectedBranch === 'all' &&
                '🌐 أنت تعرض حالياً: الحسابات الموحدة والمجمعة لكلا الفرعين (C.A.L.D)'}
            </span>
            <span className="hidden md:inline text-[11px] opacity-75">
              {selectedBranch === 'all'
                ? '— تظهر كافة القيود للفرعين معاً مع إمكانية التصفية'
                : '— تظهر فقط قيود هذا الفرع، وخزينته المستقلة، وتقاريره المستقلة'}
            </span>
          </div>
          <div className="text-[11px] font-bold">
            {selectedBranch === 'all' ? 'إجمالي سيولة المركزين:' : 'صافي سيولة هذا الفرع:'}{' '}
            <span className="font-mono text-sm underline">
              {(branchTreasury[selectedBranch]?.total ?? branchTreasury.combined.total).toLocaleString('en-US')}$
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
