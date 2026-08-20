import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Expense } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { TrendingDown, Plus, Calendar } from 'lucide-react';

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Internet Bandwidth' as const,
    amount: 1000,
    date: new Date().toISOString().split('T')[0],
    description: '',
    addedBy: 'Manager'
  });

  const loadExpenses = async () => {
    setLoading(true);
    const data = await api.getExpenses();
    setExpenses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addExpense(form);
    setIsOpen(false);
    loadExpenses();
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Expense Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Track operational costs (bandwidth, electricity, staff salary, office rent)</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">Total Recorded Expense</p>
          <h3 className="text-3xl font-black text-amber-950 dark:text-amber-100 mt-1">৳{totalExpense.toLocaleString()}</h3>
        </div>
        <TrendingDown className="w-9 h-9 text-amber-600 dark:text-amber-400" />
      </div>

      {/* Mobile Card List (<768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold animate-pulse">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold">
            No expenses recorded.
          </div>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.date}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                  {exp.category}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{exp.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{exp.description || '-'}</p>
                </div>
                <span className="text-lg font-black text-amber-700 dark:text-amber-400">৳{exp.amount}</span>
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
                <th className="py-3.5 px-4">Expense Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Added By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Loading expenses...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">No expenses recorded.</td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{exp.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{exp.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{exp.category}</td>
                    <td className="py-3.5 px-4 font-black text-amber-700 dark:text-amber-400">৳{exp.amount}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{exp.description || '-'}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-semibold">{exp.addedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Record New Expense" maxWidth="max-w-md">
        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Expense Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Office Electricity Bill"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="Internet Bandwidth">Internet Bandwidth</option>
              <option value="Electricity">Electricity</option>
              <option value="Office">Office</option>
              <option value="Employee">Employee Salary</option>
              <option value="Transport">Transport</option>
              <option value="Equipment">Equipment</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
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
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-2xl bg-indigo-600 py-3 font-extrabold text-white text-xs hover:bg-indigo-700 transition"
          >
            Save Expense Record
          </button>
        </form>
      </Modal>
    </div>
  );
};
