import React from 'react';
import { BarChart3, Download, Printer, FileSpreadsheet, TrendingUp, Users, DollarSign } from 'lucide-react';

export const Reports: React.FC = () => {
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + "Total Subscribers,553\n"
      + "Total Collection (This Month),147210\n"
      + "Total Due,286300\n"
      + "Monthly Expected,262850\n"
      + "Active Connections,551\n"
      + "Suspended Connections,10\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Spades_ISP_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Financial & Subscriber Reports</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Export revenue statements, customer ledgers, and tariff distribution</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <p className="text-xs font-bold uppercase text-slate-400">Total Monthly Revenue</p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">৳1,47,210</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Collected across 238 subscribers</p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <p className="text-xs font-bold uppercase text-slate-400">Total Outstanding Balance</p>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">৳2,86,300</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">300 Unpaid + 116 Overdue</p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <p className="text-xs font-bold uppercase text-slate-400">Estimated Net Profit</p>
          <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">৳37,210</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">After deducting ৳1,10,000 expenses</p>
        </div>
      </div>

      {/* Package tier breakdown table with horizontal scroll container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs p-4 sm:p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Package Revenue Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="py-3 px-3">Tariff Plan</th>
                <th className="py-3 px-3">Speed</th>
                <th className="py-3 px-3">Monthly Price</th>
                <th className="py-3 px-3">Subscribers</th>
                <th className="py-3 px-3">Gross Expected Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">Basic</td>
                <td className="py-3 px-3">10 Mbps</td>
                <td className="py-3 px-3">৳500</td>
                <td className="py-3 px-3">95 Users</td>
                <td className="py-3 px-3 font-black text-indigo-600 dark:text-indigo-400">৳47,500</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">Standard</td>
                <td className="py-3 px-3">20 Mbps</td>
                <td className="py-3 px-3">৳850</td>
                <td className="py-3 px-3">260 Users</td>
                <td className="py-3 px-3 font-black text-indigo-600 dark:text-indigo-400">৳2,21,000</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">Premium</td>
                <td className="py-3 px-3">30 Mbps</td>
                <td className="py-3 px-3">৳1,100</td>
                <td className="py-3 px-3">120 Users</td>
                <td className="py-3 px-3 font-black text-indigo-600 dark:text-indigo-400">৳1,32,000</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">Business</td>
                <td className="py-3 px-3">50 Mbps</td>
                <td className="py-3 px-3">৳1,800</td>
                <td className="py-3 px-3">78 Users</td>
                <td className="py-3 px-3 font-black text-indigo-600 dark:text-indigo-400">৳1,40,400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
