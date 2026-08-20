import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3.5 mb-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            isDanger 
              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' 
              : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">{title}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-750 transition flex items-center justify-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>{cancelText}</span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-1.5 ${
              isDanger 
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
