import React from 'react';
import { useTranslation } from 'react-i18next';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const { t } = useTranslation();
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  const normalized = status.toLowerCase();

  if (normalized.includes('paid') && !normalized.includes('unpaid') && !normalized.includes('partial')) {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10';
  } else if (normalized.includes('active') || normalized.includes('connected') || normalized.includes('sent') || normalized.includes('approved')) {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10';
  } else if (normalized.includes('unpaid') || normalized.includes('open') || normalized.includes('pending')) {
    style = 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-600/10';
  } else if (normalized.includes('overdue') || normalized.includes('suspended') || normalized.includes('disconnected') || normalized.includes('failed') || normalized.includes('rejected')) {
    style = 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/10';
  } else if (normalized.includes('partial')) {
    style = 'bg-yellow-50 text-yellow-800 border-yellow-200 ring-yellow-600/10';
  } else if (normalized.includes('free')) {
    style = 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/10';
  } else if (normalized.includes('processing')) {
    style = 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-600/10';
  }

  // Lookup translated string
  const translationKey = `status.${normalized.replace(/\s+/g, '_')}`;
  const label = t(translationKey, { defaultValue: status });

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {label}
    </span>
  );
};
