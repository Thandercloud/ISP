import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TrafficChart: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('All Users (Core-01)');
  const [trafficData, setTrafficData] = useState<any[]>([]);

  useEffect(() => {
    // Generate simulated live traffic history
    const initial = Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}:00`,
      download: Math.floor(400 + Math.random() * 500),
      upload: Math.floor(150 + Math.random() * 200),
    }));
    setTrafficData(initial);

    const interval = setInterval(() => {
      setTrafficData((prev) => {
        const next = [...prev.slice(1)];
        const lastTime = prev[prev.length - 1].time;
        const hour = (parseInt(lastTime.split(':')[0]) + 2) % 24;
        next.push({
          time: `${hour}:00`,
          download: Math.floor(450 + Math.random() * 480),
          upload: Math.floor(160 + Math.random() * 220),
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const latestDownload = trafficData.length > 0 ? trafficData[trafficData.length - 1].download : 0;
  const latestUpload = trafficData.length > 0 ? trafficData[trafficData.length - 1].upload : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Live Bandwidth Monitoring (MikroTik)</h3>
          <p className="text-xs text-slate-500">Real-time aggregate download & upload traffic throughput</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">User / Node:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-hidden"
          >
            <option value="All Users (Core-01)">All Users (Core-01)</option>
            <option value="tanvir_uttara">tanvir_uttara (SPD-1001)</option>
            <option value="rahim_c">rahim_c (SPD-1002)</option>
            <option value="karim_kalabagan">karim_kalabagan (SPD-1003)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-3 text-xs font-semibold">
        <div className="flex items-center gap-2 text-rose-600">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
          <span>Download: <strong className="text-slate-900">{latestDownload} Mbps</strong></span>
        </div>
        <div className="flex items-center gap-2 text-emerald-600">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span>Upload: <strong className="text-slate-900">{latestUpload} Mbps</strong></span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="M" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Area type="monotone" dataKey="download" name="Download (Mbps)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorDownload)" />
            <Area type="monotone" dataKey="upload" name="Upload (Mbps)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUpload)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
