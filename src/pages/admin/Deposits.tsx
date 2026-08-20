import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Deposit } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Landmark, Plus, Calendar } from 'lucide-react';

export const Deposits: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    method: 'bKash' as const,
    amount: 5000,
    date: new Date().toISOString().split('T')[0],
    reference: 'REF-BANK-001',
    description: 'Collector daily cash deposit',
    addedBy: 'Mukul'
  });

  const loadDeposits = async () => {
    setLoading(true);
    const data = await api.getDeposits();
    setDeposits(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addDeposit({
      ...form,
      status: 'Approved'
    });
    setIsOpen(false);
    loadDeposits();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Deposit Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Record and reconcile bank & MFS cash deposits from field collectors</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Deposit Entry</span>
        </button>
      </div>

      {/* Mobile Cards View (<768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold animate-pulse">Loading deposits...</div>
        ) : deposits.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold">
            No deposits logged yet.
          </div>
        ) : (
          deposits.map((dep) => (
            <div key={dep.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {dep.date}
                </span>
                <Badge status={dep.status} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{dep.method}</h4>
                  <p className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[11px]">Ref: {dep.reference}</p>
                </div>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">৳{dep.amount.toLocaleString()}</span>
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
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Reference ID</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Collector / Added By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Loading deposit records...</td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">No deposits logged yet.</td>
                </tr>
              ) : (
                deposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{dep.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{dep.method}</td>
                    <td className="py-3.5 px-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{dep.reference}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">৳{dep.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4"><Badge status={dep.status} /></td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{dep.addedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Record Deposit Entry" maxWidth="max-w-md">
        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Deposit Method</label>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value as any })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="bKash">bKash Merchant</option>
              <option value="Nagad">Nagad Merchant</option>
              <option value="Rocket">Rocket</option>
              <option value="Bank Transfer">Bank Transfer (DBBL)</option>
              <option value="Cash">Cash Deposit</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Amount (৳)</label>
            <input
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm font-bold focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Bank Slip / TXN Reference</label>
            <input
              type="text"
              required
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm font-mono focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-2xl bg-indigo-600 py-3 font-extrabold text-white text-xs hover:bg-indigo-700 transition"
          >
            Save Deposit Record
          </button>
        </form>
      </Modal>
    </div>
  );
};
