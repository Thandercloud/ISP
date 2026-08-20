import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/layout/LanguageSelector';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onSwitchToCustomer: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSwitchToCustomer }) => {
  const { loginAdmin, settings } = useAuth();
  const { t } = useTranslation();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [roleSelect, setRoleSelect] = useState('Super Admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await loginAdmin(username, password);
    if (!success) {
      setError(t('auth.invalid_admin_credentials'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector portalType="admin" />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/40 mb-3">
            S
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {settings?.companyName || t('common.app_name')}
          </h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> {t('auth.admin_portal_access')}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-center gap-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('auth.select_role_level')}
            </label>
            <select
              value={roleSelect}
              onChange={(e) => setRoleSelect(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="Super Admin">{t('auth.super_admin')}</option>
              <option value="Manager">{t('auth.manager')}</option>
              <option value="Collector">{t('auth.collector')}</option>
              <option value="Support Staff">{t('auth.support_staff')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('auth.admin_username_email')}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or mukul"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              />
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              />
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.99] transition disabled:opacity-50"
            >
              {loading ? t('common.submitting') : t('auth.sign_in_admin')}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">{t('auth.new_customer_question')}</p>
          <button
            onClick={onSwitchToCustomer}
            className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            {t('auth.go_to_customer_login')}
          </button>
        </div>
      </div>
    </div>
  );
};
