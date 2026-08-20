import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ISPSettings } from '../../types';
import { Settings as SettingsIcon, Save, Building, CreditCard, Send } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useAuth();
  const [form, setForm] = useState<ISPSettings>({
    companyName: 'Spades Internet',
    logoUrl: '',
    phone: '+880 1885-070504',
    supportNumber: '+880 9612-000111',
    email: 'support@spadesinternet.com',
    address: 'House #42, Road #11, Block-D, Banani, Dhaka-1213',
    facebookPage: 'https://facebook.com/spadesinternet',
    website: 'https://spadesinternet.com',
    bkashNumber: '01885070504 (Merchant)',
    nagadNumber: '01885070504 (Merchant)',
    rocketNumber: '01885070504-7',
    bankInfo: 'Dutch Bangla Bank Ltd, A/C: 104.110.45291, Branch: Banani',
    smsSenderId: 'SPADES_ISP',
    smsApiKey: 'sk_live_spades_bd_9921',
    smsApiUrl: 'https://api.sms-gateway-bd.com/v1/send',
    smsBalance: 118,
    autoBillingDay: 1,
    autoApproveRegistration: false
  });

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await api.updateSettings(form);
    await refreshSettings();
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Configure company branding, payment receiver details, and SMS gateway credentials</p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          Settings updated successfully! Branding and gateway parameters saved.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-xs">
        {/* Company Branding */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Company Branding & Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Company Name</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm font-bold focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Official Support Phone</label>
              <input
                type="text"
                required
                value={form.supportNumber}
                onChange={(e) => setForm({ ...form, supportNumber: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm font-semibold focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Support Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Website URL</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Physical Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Payment Gateways Config */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Payment Accounts (bKash / Nagad / Bank)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">bKash Merchant Account</label>
              <input
                type="text"
                value={form.bkashNumber}
                onChange={(e) => setForm({ ...form, bkashNumber: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nagad Merchant Account</label>
              <input
                type="text"
                value={form.nagadNumber}
                onChange={(e) => setForm({ ...form, nagadNumber: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Rocket Account</label>
              <input
                type="text"
                value={form.rocketNumber}
                onChange={(e) => setForm({ ...form, rocketNumber: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SMS API Config */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> SMS Gateway Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">SMS Sender Mask ID</label>
              <input
                type="text"
                value={form.smsSenderId}
                onChange={(e) => setForm({ ...form, smsSenderId: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm font-mono focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">SMS Provider API Key</label>
              <input
                type="password"
                value={form.smsApiKey}
                onChange={(e) => setForm({ ...form, smsApiKey: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm font-mono focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full min-h-[48px] rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
        </button>
      </form>
    </div>
  );
};
