import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/layout/LanguageSelector';
import { UserCheck, Phone, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

interface CustomerLoginProps {
  onSwitchToAdmin: () => void;
  onGoToRegister: () => void;
}

export const CustomerLogin: React.FC<CustomerLoginProps> = ({ onSwitchToAdmin, onGoToRegister }) => {
  const { loginCustomer, settings } = useAuth();
  const { t } = useTranslation();
  const [username, setUsername] = useState('SPD-1001');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await loginCustomer(username, password);
    if (!success) {
      setError(t('auth.invalid_customer_credentials'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector portalType="customer" />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200/80 animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-500/30 mb-3">
            S
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {settings?.companyName || t('common.app_name')}
          </h2>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mt-1 flex items-center justify-center gap-1">
            <UserCheck className="w-4 h-4" /> {t('auth.customer_portal_access')}
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
              {t('auth.customer_id_phone_username')}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. SPD-1001 or 01711223344"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
              <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
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
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? t('common.loading') : t('auth.sign_in_customer')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-xs text-slate-600 font-medium">{t('auth.new_customer_question')}</p>
          <button
            onClick={onGoToRegister}
            className="mt-1 text-xs font-bold text-emerald-700 hover:underline"
          >
            {t('auth.apply_new_connection')}
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={onSwitchToAdmin}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            {t('auth.switch_to_admin_login')}
          </button>
        </div>
      </div>
    </div>
  );
};
