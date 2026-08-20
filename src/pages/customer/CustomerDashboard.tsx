import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Subscriber } from '../../types';
import { OnlinePaymentModal } from '../../components/payments/OnlinePaymentModal';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '../../i18n';
import { 
  Wifi, CreditCard, ShieldCheck, HelpCircle, 
  Package, CheckCircle2, History, ArrowRight
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigateTab }) => {
  const { user, customerLang } = useAuth();
  const { t } = useTranslation();
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    const subs = await api.getSubscribers();
    const found = subs.find(s => s.customerId === user?.customerId || s.username === user?.username) || subs[0];
    setSubscriber(found);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  if (loading || !subscriber) {
    return <div className="py-20 text-center text-slate-500 font-semibold animate-pulse">{t('common.loading')}</div>;
  }

  const isDue = subscriber.dueAmount > 0;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Mobile Customer Header & Hello Card */}
      <div className="rounded-3xl bg-slate-900 dark:bg-slate-900 p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('customer_panel.subscriber_badge') || 'Verified Customer'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hello, {subscriber.name} 👋
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            {t('subscribers.customer_id')}: <strong className="font-mono text-white">{subscriber.customerId}</strong>
          </p>
        </div>

        {/* Connection Status Card */}
        <div className="relative z-10 bg-white/10 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl shrink-0 ${subscriber.connectionStatus === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">{t('nav.connection_status') || 'Connection Status'}</span>
              <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${subscriber.connectionStatus === 'Active' ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                <span>🟢 {subscriber.connectionStatus === 'Active' ? 'Connected' : 'Suspended'}</span>
              </h4>
            </div>
          </div>
          <div className="text-right border-l border-white/15 pl-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('customer_panel.subscribed_plan') || 'Package'}</span>
            <span className="text-xs font-extrabold text-indigo-200 font-mono">{subscriber.packageName}</span>
          </div>
        </div>
      </div>

      {/* Primary Due & Pay Now Screen Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Outstanding Balance & Big PAY NOW CTA */}
        <div className={`md:col-span-2 rounded-3xl p-5 sm:p-7 border shadow-md flex flex-col justify-between relative overflow-hidden ${
          isDue 
            ? 'bg-gradient-to-tr from-rose-500/10 via-rose-500/5 to-amber-500/10 dark:from-rose-950/40 dark:to-slate-900 border-rose-200 dark:border-rose-900/60 text-slate-900 dark:text-white' 
            : 'bg-gradient-to-tr from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:to-slate-900 border-emerald-200 dark:border-emerald-900/60 text-slate-900 dark:text-white'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('customer_panel.current_due_balance') || 'Current Due'}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Due: {formatDate(subscriber.nextDueDate, customerLang)}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <h3 className={`text-4xl sm:text-5xl font-black tracking-tight ${isDue ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {formatCurrency(subscriber.dueAmount, customerLang)}
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-2">
              {isDue ? 'Monthly Internet Subscription Due' : t('customer_panel.bill_paid') || 'All dues are fully paid!'}
            </p>
          </div>

          {/* Large Primary PAY NOW Touch Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {isDue ? (
              <button
                onClick={() => setPayModalOpen(true)}
                className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-sm sm:text-base shadow-xl shadow-rose-600/30 transition flex items-center justify-center gap-2.5"
              >
                <CreditCard className="w-5 h-5" />
                <span>[ PAY NOW ]</span>
              </button>
            ) : (
              <div className="min-h-[48px] px-5 py-3 rounded-2xl bg-emerald-600/10 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('customer_panel.bill_paid') || 'Bill Fully Paid'}</span>
              </div>
            )}

            <button
              onClick={() => onNavigateTab('billing')}
              className="min-h-[48px] px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <span>View History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Package Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Current Package
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{subscriber.packageName}</h3>
            <div className="mt-2 text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(subscriber.monthlyBill, customerLang)}<span className="text-xs font-medium text-slate-400">/month</span>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">IP Address:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{subscriber.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ONU Rx Power:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{subscriber.onuSignal}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('packages')}
            className="mt-4 w-full min-h-[44px] py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition text-center flex items-center justify-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>My Package Options</span>
          </button>
        </div>
      </div>

      {/* Quick Action Touch Buttons Grid */}
      <div>
        <p className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'My Bill', icon: CreditCard, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40', tab: 'billing' },
            { label: 'Payment History', icon: History, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40', tab: 'billing' },
            { label: 'My Package', icon: Package, color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-100 dark:border-sky-900/40', tab: 'packages' },
            { label: 'Support', icon: HelpCircle, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40', tab: 'support' },
          ].map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigateTab(act.tab)}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition text-left flex flex-col justify-between group min-h-[90px] active:scale-98"
              >
                <div className={`p-2.5 rounded-xl w-fit ${act.color} mb-2 group-hover:scale-110 transition border`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Online Payment Modal */}
      <OnlinePaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        amount={subscriber.dueAmount}
        invoiceNumber="INV-10294"
        customerId={subscriber.customerId}
        customerName={subscriber.name}
        onSuccess={loadProfile}
      />
    </div>
  );
};
