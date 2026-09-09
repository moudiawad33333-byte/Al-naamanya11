import React, { useState, useEffect, useRef } from 'react';
import { useAccounting } from '../context/AccountingContext';
import { Emblem } from './Emblem';
import { Lock, Unlock, Eye, EyeOff, AlertCircle, ShieldCheck, UserCheck, KeyRound, Building2 } from 'lucide-react';

export const LockScreen: React.FC = () => {
  const { unlockApp, currentUser, switchUser, users, hasCustomPassword } = useAccounting();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password) {
      setError('يرجى كتابة كلمة المرور');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Brief timeout for realistic verification feel
    setTimeout(() => {
      const res = unlockApp(password);
      if (res.success) {
        // App unlocked successfully!
      } else {
        setError(res.error || 'كلمة المرور غير صحيحة، يرجى إعادة المحاولة');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setIsSubmitting(false);
        setPassword('');
        inputRef.current?.focus();
      }
    }, 200);
  };

  const handleKeypadPress = (val: string) => {
    setError(null);
    if (val === 'clear') {
      setPassword('');
    } else if (val === 'backspace') {
      setPassword((prev) => prev.slice(0, -1));
    } else {
      setPassword((prev) => prev + val);
    }
    inputRef.current?.focus();
  };

  return (
    <div
      id="app-lock-screen"
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-teal-600 selection:text-white relative overflow-hidden"
      dir="rtl"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-500 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg mb-3">
            <Emblem size={56} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            مركز التوحد والصعوبات التعليمية
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-teal-500 text-slate-950 font-black tracking-wider font-mono">
              C.A.L.D
            </span>
            <span className="text-xs font-semibold text-slate-300">
              نظام المحاسبة والإدارة المالية
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-[11px] text-teal-300/80 mt-2 font-medium">
            <span>فرع حلبا (أ. سعد غية)</span>
            <span>•</span>
            <span>فرع المنية (أ. هبة سحمراني)</span>
          </div>
        </div>

        {/* Lock Card */}
        <div
          className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 transition-transform ${
            shake ? 'translate-x-[-10px]' : ''
          }`}
        >
          {/* Card Header with user selector */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">النظام مقفل للأمان</h2>
                <p className="text-[11px] text-slate-400">أدخل كلمة المرور للمتابعة</p>
              </div>
            </div>

            {/* User selector */}
            <div className="relative">
              <select
                id="lock-user-selector"
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
                className="text-xs bg-slate-900/90 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 font-medium cursor-pointer hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
                title="تحديد المستخدم الحالي"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 mb-5 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <UserCheck className="h-4 w-4 text-teal-400" />
              <span>المستخدم:</span>
              <strong className="text-white font-bold">{currentUser.fullName}</strong>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-teal-900/60 text-teal-300 text-[10px] font-bold border border-teal-700/40">
              {currentUser.title}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label
                htmlFor="lock-password-input"
                className="block text-xs font-bold text-slate-300 mb-1.5"
              >
                كلمة سر النظام:
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="lock-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="أدخل كلمة المرور..."
                  autoComplete="current-password"
                  className="w-full text-base tracking-wider px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:bg-slate-950 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition text-center font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-white transition cursor-pointer p-1"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Quick numeric buttons for fast entry */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'مسح', '0', '⌫'].map((btn) => {
                if (btn === 'مسح') {
                  return (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleKeypadPress('clear')}
                      className="py-2.5 text-xs font-bold text-slate-400 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-700/70 hover:border-slate-600 transition cursor-pointer"
                    >
                      مسح
                    </button>
                  );
                }
                if (btn === '⌫') {
                  return (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleKeypadPress('backspace')}
                      className="py-2.5 text-xs font-bold text-slate-400 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-700/70 hover:border-slate-600 transition cursor-pointer"
                    >
                      حذف ⌫
                    </button>
                  );
                }
                return (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => handleKeypadPress(btn)}
                    className="py-2.5 text-sm font-bold font-mono text-slate-200 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-700/70 hover:border-teal-500/50 hover:text-white transition cursor-pointer"
                  >
                    {btn}
                  </button>
                );
              })}
            </div>

            {/* Unlock submit button */}
            <button
              id="btn-unlock-app"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-slate-950 font-extrabold rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري التحقق...</span>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>فتح قفل النظام والدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Password info & helper */}
          <div className="mt-5 p-3 rounded-xl bg-slate-900/70 border border-slate-700/50 text-[11px] text-slate-400 leading-relaxed text-center">
            <div className="flex items-center justify-center gap-1.5 text-teal-400 font-semibold mb-1">
              <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
              <span>كلمة المرور المعتمدة للنظام:</span>
              <span className="font-mono bg-slate-800 px-2.5 py-0.5 rounded text-amber-300 font-bold border border-slate-700 text-xs">
                222326
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              (أدخل الرمز 222326 ثم اضغط على زر "فتح قفل النظام" للدخول)
            </p>
          </div>
        </div>

        {/* Footer reassurance */}
        <div className="text-center mt-4 text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          <span>حماية مشددة لبيانات الطلاب ورواتب الكادر وخزينة المركز</span>
        </div>
      </div>
    </div>
  );
};
