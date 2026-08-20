import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Mukul', collected: 147210, expected: 180000 },
  { name: 'Rifat', collected: 65400, expected: 82000 },
  { name: 'Rahim', collected: 50240, expected: 65000 },
  { name: 'bKash API', collected: 98500, expected: 110000 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Taka Collected by Individual Users</h3>
          <p className="text-xs text-slate-500">Collection performance across field collectors & online gateways</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          This Month: ৳1,47,210
        </span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
            <Tooltip
              formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Amount']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Bar dataKey="collected" name="Collected (৳)" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} />
            <Bar dataKey="expected" name="Expected Target (৳)" fill="#e2e8f0" radius={[0, 6, 6, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
