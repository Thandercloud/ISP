import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Subscriber, InternetPackage } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatNumber } from '../../i18n';
import { Search, UserPlus, Power, Eye, Phone, MapPin, Wifi, ShieldAlert, Check } from 'lucide-react';

interface SubscribersProps {
  searchTerm: string;
}

export const Subscribers: React.FC<SubscribersProps> = ({ searchTerm }) => {
  const { adminLang } = useAuth();
  const { t } = useTranslation();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [packages, setPackages] = useState<InternetPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedSub, setSelectedSub] = useState<Subscriber | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newSubData, setNewSubData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    username: '',
    packageId: '',
    monthlyBill: 850,
    dueAmount: 850,
    collectorName: 'Mukul',
    ipAddress: '192.168.10.150',
    macAddress: '00:11:22:33:44:55',
    routerName: 'MikroTik-Core-01',
    onuSignal: '-19.0 dBm'
  });

  const loadData = async () => {
    setLoading(true);
    const [subs, pkgs] = await Promise.all([api.getSubscribers(), api.getPackages()]);
    setSubscribers(subs);
    setPackages(pkgs);
    if (pkgs.length > 0 && !newSubData.packageId) {
      setNewSubData((prev) => ({ ...prev, packageId: pkgs[0].id }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (sub: Subscriber) => {
    const newStatus = sub.connectionStatus === 'Active' ? 'Suspended' : 'Active';
    await api.toggleConnectionStatus(sub.id, newStatus);
    loadData();
  };

  const handleCreateSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find((p) => p.id === newSubData.packageId);
    await api.createSubscriber({
      ...newSubData,
      packageName: pkg ? `${pkg.name} ${pkg.speedMbps} Mbps` : 'Standard 20 Mbps',
      monthlyBill: pkg ? pkg.price : 850,
      dueAmount: pkg ? pkg.price + pkg.installationFee : 850,
      paymentStatus: 'Unpaid',
      connectionStatus: 'Active',
      installationDate: new Date().toISOString().split('T')[0],
      nextDueDate: '2026-09-01'
    });
    setIsAddModalOpen(false);
    loadData();
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.includes(searchTerm) ||
      sub.username.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Active') return sub.connectionStatus === 'Active';
    if (filterStatus === 'Suspended') return sub.connectionStatus === 'Suspended';
    if (filterStatus === 'Paid') return sub.paymentStatus === 'Paid';
    if (filterStatus === 'Unpaid') return sub.paymentStatus === 'Unpaid';
    if (filterStatus === 'Overdue') return sub.paymentStatus === 'Overdue';
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('subscribers.crm_title') || 'Subscriber Management'}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Customer database, PPPoE accounts, and connection controls</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('subscribers.add_new_subscriber') || 'Add New Customer'}</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 w-full sm:w-auto">
          {['All', 'Active', 'Suspended', 'Paid', 'Unpaid', 'Overdue'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap min-h-[36px] ${
                filterStatus === st
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st} ({formatNumber(
                st === 'All' ? subscribers.length : subscribers.filter(s => 
                  st === 'Active' ? s.connectionStatus === 'Active' :
                  st === 'Suspended' ? s.connectionStatus === 'Suspended' :
                  s.paymentStatus === st
                ).length,
                adminLang
              )})
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
          Showing <strong className="text-slate-900 dark:text-white">{formatNumber(filteredSubscribers.length, adminLang)}</strong> of {formatNumber(subscribers.length, adminLang)}
        </div>
      </div>

      {/* Mobile Card List View (<768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold animate-pulse">Loading subscribers...</div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold">
            No matching subscriber found.
          </div>
        ) : (
          filteredSubscribers.map((sub) => (
            <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{sub.name}</h3>
                  <p className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">ID: {sub.customerId} • {sub.username}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge status={sub.connectionStatus} />
                  <Badge status={sub.paymentStatus} />
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{sub.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Package:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sub.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Due:</span>
                  <span className={`font-black ${sub.dueAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatCurrency(sub.dueAmount, adminLang)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedSub(sub)}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-extrabold transition flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(sub)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                    sub.connectionStatus === 'Active'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>{sub.connectionStatus === 'Active' ? 'Suspend' : 'Activate'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View Table (>=768px) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">{t('subscribers.customer_id')}</th>
                <th className="py-3.5 px-4">{t('subscribers.subscriber_name')}</th>
                <th className="py-3.5 px-4">{t('subscribers.package')}</th>
                <th className="py-3.5 px-4">{t('subscribers.monthly_bill')}</th>
                <th className="py-3.5 px-4">{t('subscribers.current_due')}</th>
                <th className="py-3.5 px-4">{t('subscribers.payment_status')}</th>
                <th className="py-3.5 px-4">{t('subscribers.connection_status')}</th>
                <th className="py-3.5 px-4 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {t('common.no_records_found')}
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {sub.customerId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{sub.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{sub.phone} • {sub.username}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {sub.packageName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(sub.monthlyBill, adminLang)}
                    </td>
                    <td className="py-3.5 px-4 font-black">
                      <span className={sub.dueAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {formatCurrency(sub.dueAmount, adminLang)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={sub.paymentStatus} />
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={sub.connectionStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                          title={t('subscribers.view_profile')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(sub)}
                          className={`p-2 rounded-xl transition ${
                            sub.connectionStatus === 'Active'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                          }`}
                          title={sub.connectionStatus === 'Active' ? t('subscribers.suspend_line') : t('subscribers.activate_line')}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscriber Detail Modal */}
      {selectedSub && (
        <Modal isOpen={true} onClose={() => setSelectedSub(null)} title={`${t('subscribers.subscriber_profile')} - ${selectedSub.name}`} maxWidth="max-w-xl">
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">{t('subscribers.customer_id')}</p>
                <h3 className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{selectedSub.customerId}</h3>
                <p className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">{selectedSub.name}</p>
              </div>
              <div className="text-right space-y-1">
                <Badge status={selectedSub.connectionStatus} />
                <div><Badge status={selectedSub.paymentStatus} /></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('auth.phone_number')}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{selectedSub.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('auth.email')}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedSub.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('subscribers.pppoe_username')}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{selectedSub.username}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('subscribers.collector')}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedSub.collectorName}</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 space-y-2">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-xs uppercase tracking-wider">{t('subscribers.network_setup')}</h4>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">{t('subscribers.ip_address')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSub.ipAddress}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">{t('subscribers.mac_address')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSub.macAddress}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">{t('subscribers.onu_rx_power')}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedSub.onuSignal}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('subscribers.current_balance')}</span>
                <span className="text-xl font-black text-rose-600 dark:text-rose-400">{formatCurrency(selectedSub.dueAmount, adminLang)}</span>
              </div>
              <button
                onClick={() => {
                  handleToggleStatus(selectedSub);
                  setSelectedSub(null);
                }}
                className={`min-h-[44px] px-5 py-2 rounded-2xl text-xs font-extrabold text-white shadow-md transition ${
                  selectedSub.connectionStatus === 'Active' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {selectedSub.connectionStatus === 'Active' ? t('subscribers.suspend_line') : t('subscribers.activate_line')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Subscriber Single-Column Mobile Form Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('subscribers.register_new_subscriber')} maxWidth="max-w-lg">
        <form onSubmit={handleCreateSubscriber} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('auth.full_name')}</label>
            <input
              type="text"
              required
              placeholder="e.g. Md. Mahin Mia"
              value={newSubData.name}
              onChange={(e) => setNewSubData({ ...newSubData, name: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('auth.phone_number')}</label>
            <input
              type="text"
              required
              placeholder="018XXXXXXXX"
              value={newSubData.phone}
              onChange={(e) => setNewSubData({ ...newSubData, phone: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm font-mono focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('subscribers.pppoe_username')}</label>
            <input
              type="text"
              required
              placeholder="e.g. mahin_uttara"
              value={newSubData.username}
              onChange={(e) => setNewSubData({ ...newSubData, username: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm font-mono focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('auth.installation_address')}</label>
            <input
              type="text"
              required
              placeholder="House, Road, Area..."
              value={newSubData.address}
              onChange={(e) => setNewSubData({ ...newSubData, address: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('auth.desired_package')}</label>
            <select
              value={newSubData.packageId}
              onChange={(e) => setNewSubData({ ...newSubData, packageId: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm font-semibold focus:border-indigo-600 focus:outline-hidden"
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({formatNumber(pkg.speedMbps, adminLang)} Mbps - {formatCurrency(pkg.price, adminLang)}/month)
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-indigo-600 hover:bg-indigo-700 py-3 text-sm font-extrabold text-white shadow-md transition"
            >
              {t('subscribers.save_register') || 'SAVE CUSTOMER'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
