import React from 'react';
import { X, Bell, CreditCard, Radio, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MobileNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNotificationModal: React.FC<MobileNotificationModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Payment Successful',
      titleBn: 'পেমেন্ট সফল হয়েছে',
      desc: 'Your payment of ৳850 for August 2026 was received.',
      descBn: 'আগস্ট ২০২৬-এর জন্য আপনার ৳৮৫০ পেমেন্ট সফলভাবে গ্রহণ করা হয়েছে।',
      time: '10:30 AM',
      type: 'payment',
      unread: true,
      group: 'Today'
    },
    {
      id: 2,
      title: 'Bill Reminder',
      titleBn: 'বিল রিমাইন্ডার',
      desc: 'Your monthly internet bill of ৳850 is due tomorrow.',
      descBn: 'আপনার চলতি মাসের ইন্টারনেট বিল ৳৮৫০ আগামীকাল প্রদেয়।',
      time: '09:00 AM',
      type: 'bill',
      unread: true,
      group: 'Today'
    },
    {
      id: 3,
      title: 'Maintenance Notice',
      titleBn: 'রক্ষণাবেক্ষণ বিজ্ঞপ্তি',
      desc: 'Scheduled core router upgrade completed successfully.',
      descBn: 'নির্ধারিত কোর রাউটার আপগ্রেড সফলভাবে সম্পন্ন হয়েছে।',
      time: 'Yesterday 11:45 PM',
      type: 'system',
      unread: false,
      group: 'Yesterday'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-none">Notifications</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">বিজ্ঞপ্তি এবং নোটিশ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Today (আজ)</p>
            <div className="space-y-2.5">
              {notifications.filter(n => n.group === 'Today').map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.unread
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.type === 'payment' && (
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'bill' && (
                      <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'system' && (
                      <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                        <Radio className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Yesterday (গতকাল)</p>
            <div className="space-y-2.5">
              {notifications.filter(n => n.group === 'Yesterday').map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
