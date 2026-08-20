import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Subscriber, RouterConfig } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Wifi, Power, Cpu } from 'lucide-react';

export const Connections: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [routers, setRouters] = useState<RouterConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [subs, rtrs] = await Promise.all([api.getSubscribers(), api.getRouters()]);
    setSubscribers(subs);
    setRouters(rtrs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (sub: Subscriber) => {
    const nextSt = sub.connectionStatus === 'Active' ? 'Suspended' : 'Active';
    await api.toggleConnectionStatus(sub.id, nextSt);
    loadData();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Network & Router Connection Manager</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">MikroTik router integration & ONU optical signal monitoring</p>
        </div>
      </div>

      {/* Router Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {routers.map((rtr) => (
          <div key={rtr.id} className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-sm text-white">{rtr.name}</h3>
              </div>
              <p className="text-xs font-mono text-slate-400">IP: {rtr.ipAddress} • API: {rtr.apiPort}</p>
              <p className="text-xs text-slate-300 font-medium">Connected Users: <strong className="text-emerald-400">{rtr.connectedUsers} Active Sessions</strong></p>
            </div>
            <div className="text-right shrink-0">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                API Connected
              </span>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">{rtr.lastPing}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Card List (<768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold animate-pulse">Loading subscriber lines...</div>
        ) : (
          subscribers.map((sub) => (
            <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{sub.name}</h4>
                  <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">ID: {sub.customerId} • PPPoE: {sub.username}</p>
                </div>
                <Badge status={sub.connectionStatus} />
              </div>

              <div className="space-y-1 text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">IP Address:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{sub.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">MAC Address:</span>
                  <span className="text-slate-500 uppercase">{sub.macAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">ONU Rx Signal:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{sub.onuSignal}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => handleToggle(sub)}
                  className={`min-h-[40px] px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                    sub.connectionStatus === 'Active'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>{sub.connectionStatus === 'Active' ? 'Suspend Line' : 'Restore Line'}</span>
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
                <th className="py-3.5 px-4">Subscriber</th>
                <th className="py-3.5 px-4">Username</th>
                <th className="py-3.5 px-4">Allocated IP</th>
                <th className="py-3.5 px-4">MAC Address</th>
                <th className="py-3.5 px-4">Assigned Router</th>
                <th className="py-3.5 px-4">ONU Rx Signal</th>
                <th className="py-3.5 px-4">Line Status</th>
                <th className="py-3.5 px-4 text-right">Control Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{sub.name}</div>
                    <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">{sub.customerId}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">{sub.username}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">{sub.ipAddress}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 uppercase">{sub.macAddress}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">{sub.routerName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{sub.onuSignal}</td>
                  <td className="py-3.5 px-4"><Badge status={sub.connectionStatus} /></td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggle(sub)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                        sub.connectionStatus === 'Active'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900/40'
                      }`}
                    >
                      {sub.connectionStatus === 'Active' ? 'Suspend Connection' : 'Restore Connection'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
