import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Ticket, TicketCategory } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { HelpCircle, Plus, Send, MessageSquare, AlertCircle, Wifi, CreditCard, RefreshCw } from 'lucide-react';

export const CustomerSupport: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const [form, setForm] = useState({
    category: 'Slow Internet' as TicketCategory,
    subject: '',
    description: ''
  });

  const loadTickets = async () => {
    setLoading(true);
    const data = await api.getTickets();
    const my = data.filter(t => t.customerId === user?.customerId);
    setTickets(my.length > 0 ? my : data);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  const handleQuickIssue = (category: TicketCategory, defaultSubject: string) => {
    setForm({
      category,
      subject: defaultSubject,
      description: `Issue report regarding ${defaultSubject}`
    });
    setIsOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createTicket({
      ...form,
      customerId: user?.customerId || 'SPD-1001',
      customerName: user?.name || 'Tanvir Hossain',
      phone: user?.phone || '01711223344'
    });
    setIsOpen(false);
    setForm({ category: 'Slow Internet', subject: '', description: '' });
    loadTickets();
  };

  const handleCustomerReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    await api.replyTicket(selectedTicket.id, {
      senderName: user?.name || 'Customer',
      senderRole: 'Customer',
      message: replyMessage
    });
    setReplyMessage('');
    loadTickets();
    setSelectedTicket(null);
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500 font-semibold animate-pulse">Loading support desk...</div>;
  }

  const quickCategories: Array<{ label: string; cat: TicketCategory; icon: any; color: string }> = [
    { label: 'Slow Internet', cat: 'Slow Internet', icon: Wifi, color: 'border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' },
    { label: 'No Internet', cat: 'Connection Problem', icon: AlertCircle, color: 'border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' },
    { label: 'Payment Problem', cat: 'Payment Problem', icon: CreditCard, color: 'border-indigo-200 dark:border-indigo-900/40 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300' },
    { label: 'Change Package', cat: 'Package Change', icon: RefreshCw, color: 'border-sky-200 dark:border-sky-900/40 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300' },
    { label: 'Other Problem', cat: 'Other', icon: HelpCircle, color: 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Need Help?</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Select your problem type or create a ticket</p>
        </div>
        <button
          onClick={() => {
            setForm({ category: 'Slow Internet', subject: '', description: '' });
            setIsOpen(true);
          }}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Quick Problem Selection Buttons */}
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
          Select Common Problem
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickIssue(item.cat, item.label)}
                className={`min-h-[52px] p-3.5 rounded-2xl border-2 font-extrabold text-xs transition-all flex items-center gap-2.5 active:scale-98 shadow-2xs ${item.color}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticket History Cards View */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Recent Tickets</h3>

        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No tickets submitted yet. Select a problem above to create one.
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-indigo-600 dark:text-indigo-400">{t.ticketId}</span>
                    <span className="text-[10px] text-slate-400 font-mono">• {t.createdAt}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.subject}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{t.description}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                  <Badge status={t.status} />
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t.replies.length} replies</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Create Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Support Ticket" maxWidth="max-w-md">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Complaint Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="Slow Internet">Slow Internet</option>
              <option value="Connection Problem">No Internet</option>
              <option value="Payment Problem">Payment Problem</option>
              <option value="Package Change">Change Package</option>
              <option value="Other">Other Problem</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Subject</label>
            <input
              type="text"
              required
              placeholder="Short summary of issue..."
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Detailed Description</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] py-3 rounded-2xl bg-indigo-600 font-extrabold text-white text-xs shadow-md hover:bg-indigo-700 transition"
          >
            Submit Ticket
          </button>
        </form>
      </Modal>

      {/* Ticket Details & Chat Modal */}
      {selectedTicket && (
        <Modal isOpen={true} onClose={() => setSelectedTicket(null)} title={`Ticket ${selectedTicket.ticketId}`} maxWidth="max-w-lg">
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedTicket.subject}</span>
                <Badge status={selectedTicket.status} />
              </div>
              <p className="text-slate-600 dark:text-slate-300">{selectedTicket.description}</p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedTicket.replies.map((rep) => (
                <div key={rep.id} className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                  <div className="flex justify-between font-bold text-indigo-900 dark:text-indigo-200">
                    <span>{rep.senderName} ({rep.senderRole})</span>
                    <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{rep.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleCustomerReply} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Type reply message..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-xs focus:border-indigo-600 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-indigo-600 font-extrabold text-white text-xs hover:bg-indigo-700 transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send Reply</span>
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
