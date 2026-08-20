import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Payment } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '../../i18n';
import { CreditCard, Check, Clock } from 'lucide-react';

export const Payments: React.FC = () => {
  const { adminLang } = useAuth();
  const { t } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    setLoading(true);
    const data = await api.getPayments();
    setPayments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleApprove = async (id: string) => {
    await api.approvePayment(id);
    loadPayments();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Payments & Receipts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verify online payment transactions and manual deposits</p>
        </div>
      </div>

      {/* Mobile Card View (<768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold animate-pulse">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold">
            No payments found.
          </div>
        ) : (
          payments.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(p.paymentDate, adminLang)}
                </span>
                <Badge status={p.status} />
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{p.customerName}</h4>
                <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">ID: {p.customerId} • Invoice: {p.invoiceNumber}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">{p.method} • <span className="font-mono uppercase font-bold text-slate-800 dark:text-slate-200">{p.transactionId}</span></span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(p.amount, adminLang)}</span>
                </div>

                {p.status === 'Pending' && (
                  <button
                    onClick={() => handleApprove(p.id)}
                    className="min-h-[40px] px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                )}
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
                <th className="py-3.5 px-4">{t('payments.date_time')}</th>
                <th className="py-3.5 px-4">{t('subscribers.customer_id')}</th>
                <th className="py-3.5 px-4">{t('subscribers.subscriber_name')}</th>
                <th className="py-3.5 px-4">{t('billing.invoice_number')}</th>
                <th className="py-3.5 px-4">{t('payments.method')}</th>
                <th className="py-3.5 px-4">{t('payments.txn_id')}</th>
                <th className="py-3.5 px-4">{t('payments.amount')}</th>
                <th className="py-3.5 px-4">{t('common.status')}</th>
                <th className="py-3.5 px-4 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">{t('common.loading')}</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">{t('common.no_records_found')}</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{formatDate(p.paymentDate, adminLang)}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{p.customerId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{p.customerName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{p.invoiceNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{p.method}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white uppercase">{p.transactionId}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(p.amount, adminLang)}</td>
                    <td className="py-3.5 px-4"><Badge status={p.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === 'Pending' ? (
                        <button
                          onClick={() => handleApprove(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                        >
                          Approve Payment
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">Verified</span>
                      )}
                    </td>
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
