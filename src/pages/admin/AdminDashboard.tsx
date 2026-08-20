import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { TrafficChart } from '../../components/charts/TrafficChart';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatNumber } from '../../i18n';
import { 
  DollarSign, Users, Calendar, AlertTriangle, CheckCircle2, 
  XCircle, Clock, Send, Wifi, ShieldAlert, ArrowUpRight, TrendingUp,
  FileText, Activity
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { adminLang } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'Today' | 'This Month' | 'Last Month'>('This Month');

  useEffect(() => {
    api.getStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-20 text-center text-slate-500 font-semibold animate-pulse">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header & Quick Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time ISP operational & billing metrics overview</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs self-start sm:self-auto">
          {[
            { key: 'Today', label: t('common.today') || 'Today' },
            { key: 'This Month', label: t('common.this_month') || 'This Month' },
            { key: 'Last Month', label: t('common.last_month') || 'Last Month' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setPeriod(item.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[36px] ${
                period === item.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Mobile Highlights Card Grid (2-column responsive grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Subscribers"
          value={formatNumber(stats.totalSubscribers, adminLang)}
          subtitle="Registered Customers"
          icon={Users}
          colorScheme="blue"
          onClick={() => onNavigateTab('subscribers')}
        />
        <StatCard
          title="Total Collection"
          value={`${formatCurrency(stats.totalCollectedThisMonth, adminLang)}`}
          subtitle="This Month"
          icon={DollarSign}
          colorScheme="emerald"
          onClick={() => onNavigateTab('payments')}
        />
        <StatCard
          title="Total Due"
          value={`${formatCurrency(stats.totalDue, adminLang)}`}
          subtitle="Pending Bill"
          icon={AlertTriangle}
          colorScheme="red"
          badge="High Priority"
          onClick={() => onNavigateTab('billing')}
        />
        <StatCard
          title="Active Connections"
          value={formatNumber(stats.connectionOn, adminLang)}
          subtitle="Online Subscribers"
          icon={Wifi}
          colorScheme="emerald"
          onClick={() => onNavigateTab('connections')}
        />
      </div>

      {/* Secondary Financial & Payment Breakdown Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t('dashboard.monthly_expected') || 'Monthly Expected'}
          value={`${formatCurrency(stats.monthlyExpected, adminLang)}`}
          subtitle="Expected Revenue"
          icon={TrendingUp}
          colorScheme="cyan"
        />
        <StatCard
          title={t('dashboard.unpaid_subscribers') || 'Unpaid Subscribers'}
          value={formatNumber(stats.unpaidSubscribers, adminLang)}
          subtitle="Pending Bills"
          icon={Users}
          colorScheme="amber"
          onClick={() => onNavigateTab('billing')}
        />
        <StatCard
          title={t('dashboard.fully_paid_subscribers') || 'Paid Subscribers'}
          value={formatNumber(stats.fullyPaidSubscribers, adminLang)}
          subtitle="Fully Cleared"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title={t('dashboard.overdue_subscribers') || 'Overdue Subscribers'}
          value={formatNumber(stats.overdueSubscribers, adminLang)}
          subtitle="Overdue Payment"
          icon={AlertTriangle}
          colorScheme="rose"
          onClick={() => onNavigateTab('billing')}
        />
      </div>

      {/* Grid 3: Network & Connection Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t('dashboard.connection_off') || 'Connection Off'}
          value={formatNumber(stats.connectionOff, adminLang)}
          subtitle="Disconnected Lines"
          icon={XCircle}
          colorScheme="rose"
        />
        <StatCard
          title={t('dashboard.active_inactive_split') || 'Active/Inactive Split'}
          value={`${formatNumber(511, adminLang)} - ${formatNumber(40, adminLang)}`}
          subtitle="Active vs Inactive"
          icon={Activity}
          colorScheme="emerald"
        />
        <StatCard
          title={t('dashboard.total_expense') || 'Total Expense'}
          value={`${formatCurrency(stats.totalExpenseThisMonth, adminLang)}`}
          subtitle="This Month Expenses"
          icon={TrendingUp}
          colorScheme="amber"
          onClick={() => onNavigateTab('expenses')}
        />
        <StatCard
          title={t('dashboard.collector_notes') || 'Collector Notes'}
          value={formatNumber(stats.collectorNoteCount, adminLang)}
          subtitle="Field Updates"
          icon={FileText}
          colorScheme="blue"
        />
      </div>

      {/* Analytical Visual Graphs (Responsive Wrapper) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-1 overflow-hidden">
        <div className="w-full min-w-0">
          <RevenueChart />
        </div>
        <div className="w-full min-w-0">
          <TrafficChart />
        </div>
      </div>

      {/* Quick Action Control Strip */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg">{t('dashboard.send_due_sms_reminders') || 'Send Due SMS Reminders'}</h3>
          <p className="text-xs text-indigo-200 mt-0.5">{t('dashboard.sms_reminder_subtitle') || 'Broadcast automated SMS to overdue subscribers'}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => onNavigateTab('sms')}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{t('dashboard.open_bulk_sms_center') || 'Open SMS Center'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('billing')}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 font-bold text-xs transition border border-white/20 text-center"
          >
            {t('dashboard.manage_invoices') || 'Manage Invoices'}
          </button>
        </div>
      </div>
    </div>
  );
};
