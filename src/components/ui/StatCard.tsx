import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme: 'red' | 'blue' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'purple' | 'slate';
  onClick?: () => void;
  badge?: string;
}

const colorMap = {
  red: 'bg-rose-50 border-rose-200 text-rose-700 icon-bg-rose-100',
  rose: 'bg-rose-50 border-rose-200 text-rose-700 icon-bg-rose-100',
  blue: 'bg-blue-50 border-blue-200 text-blue-700 icon-bg-blue-100',
  cyan: 'bg-sky-50 border-sky-200 text-sky-700 icon-bg-sky-100',
  amber: 'bg-amber-50 border-amber-200 text-amber-800 icon-bg-amber-100',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 icon-bg-emerald-100',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 icon-bg-indigo-100',
  purple: 'bg-purple-50 border-purple-200 text-purple-700 icon-bg-purple-100',
  slate: 'bg-slate-50 border-slate-200 text-slate-700 icon-bg-slate-100',
};

const iconBgMap = {
  red: 'bg-rose-100 text-rose-600',
  rose: 'bg-rose-100 text-rose-600',
  blue: 'bg-blue-100 text-blue-600',
  cyan: 'bg-sky-100 text-sky-600',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  purple: 'bg-purple-100 text-purple-600',
  slate: 'bg-slate-200 text-slate-700',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme,
  onClick,
  badge
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:shadow-md bg-white ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{value}</h3>
          {subtitle && (
            <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${iconBgMap[colorScheme]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {badge && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${colorMap[colorScheme]}`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};
