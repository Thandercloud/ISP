import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Ticket } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { HelpCircle, MessageSquare, Send, Clock } from 'lucide-react';

export const Complaints: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [statusSelect, setStatusSelect] = useState<string>('Processing');

  const loadTickets = async () => {
    setLoading(true);
    const data = await api.getTickets();
    setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    await api.replyTicket(selectedTicket.id, {
      senderName: 'Admin Support Desk',
      senderRole: 'Support Staff',
      message: replyMessage,
      status: statusSelect
    });

    setReplyMessage('');
    loadTickets();
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Customer Complaints Desk</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Handle subscriber technical issues, speed complaints, and support tickets</p>
        </div>
      </div>

      {/* Mobile Card View (<768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold animate-pulse">Loading complaints...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold">
            No complaints reported.
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-xs">{t.ticketId}</span>
                <Badge status={t.status} />
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.subject}</h4>
                <p className="text-[11px] text-slate-500">{t.customerName} • {t.phone}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                  Priority: {t.priority}
                </span>

                <button
                  onClick={() => setSelectedTicket(t)}
                  className="min-h-[40px] px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Respond</span>
                </button>
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
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">Loading support tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">No complaints reported.</td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.ticketId}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{t.createdAt}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {t.customerName}
                      <span className="block text-[11px] font-mono text-slate-400">{t.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{t.category}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{t.subject}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-[11px]">
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4"><Badge status={t.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                      >
                        Respond & Thread
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <Modal isOpen={true} onClose={() => setSelectedTicket(null)} title={`Support Ticket ${selectedTicket.ticketId}`} maxWidth="max-w-xl">
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedTicket.subject}</span>
                <Badge status={selectedTicket.status} />
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{selectedTicket.description}</p>
              <p className="text-[10px] text-slate-400 font-mono pt-1">
                By {selectedTicket.customerName} ({selectedTicket.phone}) on {selectedTicket.createdAt}
              </p>
            </div>

            {/* Replies history */}
            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
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

            {/* Reply Form */}
            <form onSubmit={handleReply} className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Update Ticket Status</label>
                <select
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden"
                >
                  <option value="Processing">Processing / Assigned</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Write Response to Customer</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type official support reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-xs focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-2xl bg-indigo-600 py-3 font-extrabold text-white text-xs hover:bg-indigo-700 transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send Reply & Update Ticket</span>
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
