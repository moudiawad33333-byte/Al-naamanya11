import React from 'react';
import { Briefcase, FileSpreadsheet, GraduationCap, Icon, Landmark, LayoutDashboard, Receipt, ShieldCheck, Stethoscope, Users } from "lucide-react";

export type TabId =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'specialists'
  | 'admin_staff'
  | 'expenses'
  | 'treasury'
  | 'reports'
  | 'audit';

interface NavigationTabsProps {
  activeView: TabId;
  onViewChange: (view: TabId) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeView, onViewChange }) => {
  const tabs = [
    { id: 'dashboard' as TabId, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'students' as TabId, label: 'الطلاب والأهالي', icon: GraduationCap },
    { id: 'teachers' as TabId, label: 'المعلمات (4 أشهر)', icon: Users },
    { id: 'specialists' as TabId, label: 'الأخصائيون', icon: Stethoscope },
    { id: 'admin_staff' as TabId, label: 'كادر الإدارة', icon: Briefcase },
    { id: 'expenses' as TabId, label: 'المصاريف اليومية', icon: Receipt },
    { id: 'treasury' as TabId, label: 'الصندوق والبنك', icon: Landmark },
    { id: 'reports' as TabId, label: 'التقارير والطباعة', icon: FileSpreadsheet },
    { id: 'audit' as TabId, label: 'الأمان والتدقيق', icon: ShieldCheck },
  ];

  return (
    <nav className="no-print bg-white border border-slate-200 rounded-2xl p-1.5 shadow-2xs overflow-x-auto">
      <div className="flex space-x-1 space-x-reverse min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onViewChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
