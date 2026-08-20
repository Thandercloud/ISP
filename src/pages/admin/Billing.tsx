import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Invoice } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '../../i18n';
import { FileText, RefreshCw, Calculator, Download, CheckCircle2, Calendar } from 'lucide-react';

export const Billing: React.FC = () => {
  const { adminLang } = useAuth();
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState('');

  const loadInvoices = async () => {
    setLoading(true);
    const data = await api.getInvoices();
    setInvoices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleAutoGenerate = async () => {
    setGenerating(true);
    setMsg('');
    const res = await api.generateMonthlyBilling();
    setMsg(res.message || 'Generated monthly invoices successfully.');
    setGenerating(false);
    loadInvoices();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('billing.billing_engine') || 'Billing & Invoices'}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Automated monthly billing engine & invoice generator</p>
        </div>

        <button
          onClick={handleAutoGenerate}
          disabled={generating}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs text-white shadow-md transition flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Running Billing...' : 'Run Auto Billing'}</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Formula Explanation Banner */}
      <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 p-4 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-3">
        <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <div className="text-xs text-indigo-950 dark:text-indigo-200 font-medium leading-relaxed">
          <strong className="font-extrabold text-indigo-900 dark:text-indigo-100">Formula: </strong>
          Net Due = Current Package Tariff + Previous Unpaid Balance - Advance Payments
        </div>
      </div>

      {/* Mobile View: Invoice Cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold animate-pulse">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No invoices found.
          </div>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">{inv.invoiceNumber}</span>
                <Badge status={inv.status} />
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{inv.customerName}</h4>
                <p className="text-[11px] font-mono text-slate-400">ID: {inv.customerId} • {inv.monthYear}</p>
              </div>

              <div className="space-y-1 text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Package:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{inv.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Bill:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(inv.currentBill, adminLang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Remaining Due:</span>
                  <span className={`font-black ${inv.remainingDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatCurrency(inv.remainingDue, adminLang)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Due Date:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{formatDate(inv.dueDate, adminLang)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (>=768px) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">{t('billing.invoice_number')}</th>
                <th className="py-3.5 px-4">{t('subscribers.subscriber_name')}</th>
                <th className="py-3.5 px-4">{t('billing.period')}</th>
                <th className="py-3.5 px-4">{t('subscribers.package')}</th>
                <th className="py-3.5 px-4">{t('billing.current_bill')}</th>
                <th className="py-3.5 px-4">{t('billing.prev_due')}</th>
                <th className="py-3.5 px-4">{t('billing.paid')}</th>
                <th className="py-3.5 px-4">{t('billing.remaining_due')}</th>
                <th className="py-3.5 px-4">{t('common.status')}</th>
                <th className="py-3.5 px-4">{t('billing.due_date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">{t('common.loading')}</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">{t('common.no_records_found')}</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {inv.customerName}
                      <span className="block text-[11px] font-mono font-normal text-slate-400">{inv.customerId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{formatDate(inv.monthYear, adminLang)}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{inv.packageName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{formatCurrency(inv.currentBill, adminLang)}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-500">{formatCurrency(inv.previousDue, adminLang)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(inv.paidAmount, adminLang)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                      <span className={inv.remainingDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {formatCurrency(inv.remainingDue, adminLang)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4"><Badge status={inv.status} /></td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{formatDate(inv.dueDate, adminLang)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
