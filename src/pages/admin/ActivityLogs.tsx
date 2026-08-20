import React from 'react';
import { History, Shield, Clock } from 'lucide-react';

export const ActivityLogs: React.FC = () => {
  const logs = [
    { id: '1', username: 'Super Admin', role: 'Super Admin', action: 'Update Settings', details: 'Updated company branding parameters', timestamp: '2026-08-19 10:12 AM' },
    { id: '2', username: 'Mukul', role: 'Collector', action: 'Approve Payment', details: 'Approved ৳1100 bKash payment for SPD-1002', timestamp: '2026-08-15 02:40 PM' },
    { id: '3', username: 'Rahim Support', role: 'Support Staff', action: 'Ticket Reply', details: 'Replied to Ticket TKT-10492 for Tanvir Hossain', timestamp: '2026-08-18 05:10 PM' },
    { id: '4', username: 'Super Admin', role: 'Super Admin', action: 'Bulk SMS Dispatch', details: 'Dispatched due payment reminders to 300 unpaid subscribers', timestamp: '2026-08-01 09:00 AM' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Activity Logs</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Security activity history of staff actions, payment approvals, and configuration edits</p>
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="space-y-3 md:hidden">
        {logs.map((log) => (
          <div key={log.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {log.timestamp}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                {log.role}
              </span>
            </div>
            <div className="pt-1">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{log.action}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{log.details}</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">By: {log.username}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (>=768px) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Action Executed</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{log.username}</td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">{log.role}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
