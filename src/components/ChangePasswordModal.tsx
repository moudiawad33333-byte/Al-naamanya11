import React, { useState } from 'react';
import { useAccounting } from '../context/AccountingContext';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RotateCcw, X } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { changePassword, hasCustomPassword, resetPasswordToDefault } = useAccounting();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('يرجى إدخال كلمة المرور الحالية');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('كلمة المرور الجديدة يجب أن تكون 4 خانات على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('تأكيد كلمة المرور غير متطابق مع كلمة المرور الجديدة');
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    if (res.success) {
      setSuccess('تم تغيير وحفظ كلمة المرور بنجاح! سيتم طلبها في كل مرة تفتح فيها البرنامج.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
    } else {
      setError(res.error || 'تعذر تغيير كلمة المرور، تأكد من صحة الكلمة الحالية');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('هل أنت متأكد من استعادة كلمة المرور الافتراضية (222326)؟')) {
      resetPasswordToDefault();
      setSuccess('تمت استعادة كلمة المرور المعتمدة: 222326');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div
      id="change-password-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-700/60 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">أمان وحماية النظام</h2>
              <p className="text-xs text-teal-100">تغيير وتعيين كلمة المرور الخاصة بك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 rounded-lg hover:bg-teal-700/50 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Status Badge */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">حالة الأمان الحالية:</span>
            {hasCustomPassword ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                كلمة سر خاصة مفعّلة
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                كلمة السر المعتمدة (222326)
              </span>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              كلمة المرور الحالية:
            </label>
            <div className="relative">
              <input
                id="input-current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الحالية (222326)"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition font-sans text-slate-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              كلمة المرور الجديدة:
            </label>
            <div className="relative">
              <input
                id="input-new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="أدخل كلمة مرور جديدة قوية (أرقام أو أحرف)"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition font-sans text-slate-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تأكيد كلمة المرور الجديدة:
            </label>
            <input
              id="input-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد كتابة كلمة المرور الجديدة"
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition font-sans text-slate-900"
              required
            />
          </div>

          {/* Information */}
          <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-900 text-xs leading-relaxed">
            <p className="font-semibold">تذكير بالأمان:</p>
            <p className="text-[11px] text-teal-800 mt-0.5">
              سيتم طلب كلمة المرور في كل مرة يتم فيها فتح الصفحة أو المتصفح لمنع دخول أي شخص آخر لحسابات المركز وسندات القبض والصرف.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            {hasCustomPassword && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition border border-slate-200 cursor-pointer flex items-center gap-1"
                title="استعادة كلمة المرور الافتراضية"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                استعادة الافتراضية
              </button>
            )}

            <div className="flex items-center gap-2 mr-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                id="btn-save-password"
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                حفظ كلمة المرور
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
