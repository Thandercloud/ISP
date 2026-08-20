import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Subscriber } from '../../types';
import { LanguageSelector } from '../../components/layout/LanguageSelector';
import { User, Phone, Mail, MapPin, KeyRound, Globe, LogOut, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const CustomerProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [saved, setSaved] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [newPass, setNewPass] = useState('');

  useEffect(() => {
    api.getSubscribers().then((subs) => {
      const found = subs.find(s => s.customerId === user?.customerId || s.username === user?.username) || subs[0];
      setSubscriber(found);
    });
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setIsEditOpen(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePassChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPassOpen(false);
    setNewPass('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!subscriber) return <div className="py-12 text-center text-slate-400 font-semibold animate-pulse">Loading Profile...</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      {/* Profile Photo Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-indigo-500/30">
            {subscriber.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{subscriber.name}</h2>
        <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
          Customer ID: {subscriber.customerId}
        </p>

        <div className="mt-3 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Service Plan • {subscriber.packageName}</span>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Info Cards List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
        <div className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone Number</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{subscriber.phone}</span>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">{subscriber.email || 'N/A'}</span>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Installation Address</span>
            <span className="font-bold text-slate-900 dark:text-white leading-snug block">{subscriber.address}</span>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">System Language</span>
              <span className="font-bold text-slate-900 dark:text-white">Bangla / English</span>
            </div>
          </div>
          <LanguageSelector portalType="customer" />
        </div>

        <div 
          onClick={() => setIsPassOpen(true)}
          className="p-4 flex items-center justify-between gap-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Change Password</span>
              <span className="text-[10px] text-slate-400">Update account portal password</span>
            </div>
          </div>
          <KeyRound className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => setIsEditOpen(true)}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>

        <button
          onClick={logout}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 font-extrabold text-xs transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile Details" maxWidth="max-w-md">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={subscriber.name}
              onChange={(e) => setSubscriber({ ...subscriber, name: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm font-semibold focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Phone Number</label>
            <input
              type="text"
              required
              value={subscriber.phone}
              onChange={(e) => setSubscriber({ ...subscriber, phone: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm font-semibold focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email</label>
            <input
              type="email"
              value={subscriber.email}
              onChange={(e) => setSubscriber({ ...subscriber, email: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Installation Address</label>
            <input
              type="text"
              value={subscriber.address}
              onChange={(e) => setSubscriber({ ...subscriber, address: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] py-3 rounded-2xl bg-indigo-600 font-extrabold text-white text-xs hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={isPassOpen} onClose={() => setIsPassOpen(false)} title="Change Password" maxWidth="max-w-md">
        <form onSubmit={handlePassChange} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Enter new password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] py-3 rounded-2xl bg-indigo-600 font-extrabold text-white text-xs hover:bg-indigo-700 transition"
          >
            Update Password
          </button>
        </form>
      </Modal>
    </div>
  );
};
