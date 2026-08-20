import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { InternetPackage } from '../../types';
import { User, Phone, Mail, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';

interface CustomerRegisterProps {
  onBackToLogin: () => void;
}

export const CustomerRegister: React.FC<CustomerRegisterProps> = ({ onBackToLogin }) => {
  const { settings } = useAuth();
  const { t } = useTranslation();
  const [packages, setPackages] = useState<InternetPackage[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    username: '',
    password: '',
    packageId: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getPackages().then((pkgs) => {
      setPackages(pkgs);
      if (pkgs.length > 0) {
        setFormData((prev) => ({ ...prev, packageId: pkgs[0].id }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.registerCustomer(formData);
      setSuccess(true);
    } catch {
      // Error
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-slate-200 animate-fade-in">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{t('auth.registration_submitted')}</h2>
            <p className="text-sm text-slate-600 mt-2">
              {t('auth.thank_you_for_choosing')}
            </p>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-left space-y-1 font-mono">
              <p>Name: {formData.name}</p>
              <p>Username: {formData.username}</p>
              <p>Phone: {formData.phone}</p>
            </div>
            <button
              onClick={onBackToLogin}
              className="mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md"
            >
              {t('auth.sign_in_customer')}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">{t('auth.new_connection_registration')}</h2>
              <p className="text-xs text-slate-500 mt-1">{t('auth.fill_details_for_broadband')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('auth.full_name')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shakib Al Hasan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('auth.phone_number')}</label>
                  <input
                    type="text"
                    required
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('auth.email')}</label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('auth.installation_address')}</label>
                <textarea
                  required
                  rows={2}
                  placeholder="House no, Flat, Road, Area..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('auth.desired_package')}</label>
                <select
                  value={formData.packageId}
                  onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-semibold focus:border-indigo-600 focus:outline-hidden"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.speedMbps} Mbps (৳{pkg.price}/month)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('auth.choose_username')}</label>
                  <input
                    type="text"
                    required
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t('auth.create_password')}</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 transition"
                >
                  {loading ? t('common.submitting') : t('auth.complete_registration')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
