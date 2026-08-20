import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileNotificationModal } from './MobileNotificationModal';
import { 
  LayoutDashboard, CreditCard, Package, HelpCircle, User as UserIcon, 
  LogOut, Wifi, ShieldCheck, Bell, Moon, Sun
} from 'lucide-react';

interface CustomerLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
  activeTab,
  setActiveTab
}) => {
  const { user, settings, logout, customerLang, themeMode, toggleTheme } = useAuth();
  const { t, i18n } = useTranslation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(customerLang);
  }, [customerLang]);

  const navItems = [
    { id: 'dashboard', label: t('nav.my_dashboard') || 'My Dashboard', icon: LayoutDashboard },
    { id: 'billing', label: t('nav.my_billing') || 'Bills & Payment', icon: CreditCard },
    { id: 'packages', label: t('nav.my_package') || 'My Package', icon: Package },
    { id: 'status', label: t('nav.connection_status') || 'Connection', icon: Wifi },
    { id: 'support', label: t('nav.support') || 'Support', icon: HelpCircle },
    { id: 'profile', label: t('nav.profile') || 'Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header for Customer Portal */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center font-black text-lg text-white shadow-md shadow-indigo-500/25">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                {settings?.companyName || t('common.app_name')}
              </h1>
              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">{t('common.customer_self_service')}</p>
            </div>
          </div>

          {/* User badge, Theme toggle, Notifications & Language selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('common.customer_portal_protected')}</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition"
              title="Toggle Dark/Light Mode"
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            <LanguageSelector portalType="customer" />

            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name || 'Customer'}</p>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{user?.customerId || 'SPD-1001'}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 text-xs font-bold text-slate-600 dark:text-slate-300 transition"
              >
                <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">{t('common.logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile <768px, replaced by MobileBottomNav) */}
        <nav className="hidden md:flex max-w-6xl mx-auto px-4 sm:px-6 items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Customer View (with bottom padding for mobile bottom bar) */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation Component */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Mobile Notifications Modal */}
      <MobileNotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Footer */}
      <footer className="hidden md:block bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <p className="font-semibold text-slate-700 dark:text-slate-300">{settings?.companyName || t('common.app_name')} Customer Portal</p>
        <p className="mt-1">For support call: <strong className="text-indigo-600 dark:text-indigo-400">{settings?.supportNumber || '+880 9612-000111'}</strong></p>
      </footer>
    </div>
  );
};
