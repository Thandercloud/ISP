import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { InternetPackage } from '../../types';
import { Check, Zap, Send } from 'lucide-react';

export const CustomerPackage: React.FC = () => {
  const [packages, setPackages] = useState<InternetPackage[]>([]);
  const [requested, setRequested] = useState('');

  useEffect(() => {
    api.getPackages().then(setPackages);
  }, []);

  const handleRequestUpgrade = (pkgName: string) => {
    setRequested(`Package upgrade request for "${pkgName}" submitted to support team! Admin will approve shortly.`);
    setTimeout(() => setRequested(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Available Broadband Plans</h2>
        <p className="text-xs text-slate-500 font-medium">Explore high-speed optical fiber plans and request speed upgrades</p>
      </div>

      {requested && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          {requested}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {pkg.name}
              </span>

              <div className="mt-4 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{pkg.speedMbps}</span>
                  <span className="text-sm font-bold text-slate-500">Mbps</span>
                </div>
                <div className="mt-2 text-2xl font-extrabold text-indigo-600">
                  ৳{pkg.price}<span className="text-xs font-medium text-slate-400">/month</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleRequestUpgrade(pkg.name)}
              className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white shadow-md transition"
            >
              Request Upgrade
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
