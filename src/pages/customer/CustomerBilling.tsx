import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Invoice, Payment } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { OnlinePaymentModal } from '../../components/payments/OnlinePaymentModal';
import { Download, CreditCard, CheckCircle, Calendar, Hash } from 'lucide-react';

export const CustomerBilling: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [invs, pays] = await Promise.all([api.getInvoices(), api.getPayments()]);
    const userInvs = invs.filter(i => i.customerId === user?.customerId);
    const userPays = pays.filter(p => p.customerId === user?.customerId);
    setInvoices(userInvs.length > 0 ? userInvs : invs);
    setPayments(userPays.length > 0 ? userPays : pays);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handlePayInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPayModalOpen(true);
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500 font-semibold animate-pulse">Loading billing details...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">My Internet Billing & Payments</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">View active invoices, due balances, and payment receipt history</p>
      </div>

      {/* Invoices List Section */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Active & Past Invoices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">{inv.invoiceNumber}</span>
                <Badge status={inv.status} />
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Billing Period:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{inv.monthYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Package:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{inv.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Bill:</span>
                  <span className="font-black text-slate-900 dark:text-white">৳{inv.currentBill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Due Date:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{inv.dueDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Payable Amount</span>
                  <span className="text-xl font-black text-rose-600 dark:text-rose-400">৳{inv.remainingDue}</span>
                </div>

                {inv.remainingDue > 0 ? (
                  <button
                    onClick={() => handlePayInvoice(inv)}
                    className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>PAY NOW</span>
                  </button>
                ) : (
                  <button
                    onClick={() => window.print()}
                    className="min-h-[44px] px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Receipt</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History Section (Cards on Mobile, Table on Desktop) */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Payment History Logs</h3>
        
        {/* Mobile View: Payment Cards */}
        <div className="space-y-3 md:hidden">
          {payments.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {p.paymentDate}
                </span>
                <Badge status={p.status} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{p.invoiceNumber}</p>
                  <p className="text-[11px] text-slate-500">{p.method} • <span className="font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">{p.transactionId}</span></p>
                </div>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">৳{p.amount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-500">{p.paymentDate}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">{p.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">৳{p.amount}</td>
                  <td className="py-3.5 px-4 font-semibold">{p.method}</td>
                  <td className="py-3.5 px-4 font-mono font-bold uppercase text-slate-900 dark:text-white">{p.transactionId}</td>
                  <td className="py-3.5 px-4"><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OnlinePaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        amount={selectedInvoice?.remainingDue || 850}
        invoiceNumber={selectedInvoice?.invoiceNumber || 'INV-10294'}
        customerId={user?.customerId || 'SPD-1001'}
        customerName={user?.name || 'Customer'}
        onSuccess={loadData}
      />
    </div>
  );
};
