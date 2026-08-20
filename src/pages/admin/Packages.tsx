import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { InternetPackage } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Package, Plus, Check } from 'lucide-react';

export const Packages: React.FC = () => {
  const [packages, setPackages] = useState<InternetPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newPkg, setNewPkg] = useState({
    name: '',
    speedMbps: 20,
    price: 850,
    installationFee: 1000,
    features: ['Unlimited Data', '24/7 Optical Fiber', 'BDIX 100 Mbps', 'FTP Access']
  });

  const loadPackages = async () => {
    setLoading(true);
    const data = await api.getPackages();
    setPackages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createPackage({
      ...newPkg,
      status: 'Active'
    });
    setIsAddOpen(false);
    loadPackages();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Internet Tariff Packages</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Configure speed tiers, monthly pricing, and installation charges</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                  {pkg.name}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {pkg.subscriberCount || 0} Users
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{pkg.speedMbps}</span>
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Mbps</span>
                </div>
                <div className="mt-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  ৳{pkg.price}
                  <span className="text-xs font-medium text-slate-400">/month</span>
                </div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                  Installation Charge: ৳{pkg.installationFee}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {pkg.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active Tariff
              </span>
              <button className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
                Edit Tariff
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Internet Package" maxWidth="max-w-md">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Package Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ultra Gaming 40 Mbps"
              value={newPkg.name}
              onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Speed (Mbps)</label>
            <input
              type="number"
              required
              value={newPkg.speedMbps}
              onChange={(e) => setNewPkg({ ...newPkg, speedMbps: Number(e.target.value) })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Monthly Price (৳)</label>
            <input
              type="number"
              required
              value={newPkg.price}
              onChange={(e) => setNewPkg({ ...newPkg, price: Number(e.target.value) })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Installation Fee (৳)</label>
            <input
              type="number"
              required
              value={newPkg.installationFee}
              onChange={(e) => setNewPkg({ ...newPkg, installationFee: Number(e.target.value) })}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-indigo-600 py-3 text-sm font-extrabold text-white shadow-md hover:bg-indigo-700 transition"
            >
              Save Package Tariff
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
