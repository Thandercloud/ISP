import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, CreditCard, Headphones, Bell, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNotifications,
  unreadCount = 2
}) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('nav.home') || 'Home', icon: Home },
    { id: 'billing', label: t('nav.bills') || 'Bills', icon: CreditCard },
    { id: 'support', label: t('nav.support') || 'Support', icon: Headphones },
    { id: 'notifications', label: t('nav.notice') || 'Notice', icon: Bell, action: 'modal' },
    { id: 'profile', label: t('nav.profile') || 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center justify-items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isNotice = item.id === 'notifications';

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isNotice) {
                  onOpenNotifications();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center w-full py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isNotice && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none truncate max-w-full">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
