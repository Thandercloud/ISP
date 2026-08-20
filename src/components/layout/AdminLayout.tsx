import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { MobileDrawer } from './MobileDrawer';
import { MobileNotificationModal } from './MobileNotificationModal';
import { formatNumber } from '../../i18n';
import { 
  LayoutDashboard, Users, Package, FileText, CreditCard, Send, 
  Wifi, HelpCircle, TrendingDown, Landmark, BarChart3, Settings, 
  LogOut, Search, Bell, Shield, Menu, ChevronRight, History, Sun, Moon
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm
}) => {
  const { user, settings, logout, adminLang, themeMode, toggleTheme } = useAuth();
  const { t, i18n } = useTranslation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(adminLang);
  }, [adminLang]);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'subscribers', label: t('nav.subscribers'), icon: Users },
    { id: 'packages', label: t('nav.packages'), icon: Package },
    { id: 'billing', label: t('nav.billing'), icon: FileText },
    { id: 'payments', label: t('nav.payments'), icon: CreditCard },
    { id: 'sms', label: t('nav.sms'), icon: Send },
    { id: 'connections', label: t('nav.connections'), icon: Wifi },
    { id: 'complaints', label: t('nav.complaints'), icon: HelpCircle },
    { id: 'expenses', label: t('nav.expenses'), icon: TrendingDown },
    { id: 'deposits', label: t('nav.deposits'), icon: Landmark },
    { id: 'reports', label: t('nav.reports'), icon: BarChart3 },
    { id: 'logs', label: t('nav.logs'), icon: History },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Button for Mobile Drawer */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-base sm:text-lg text-white shadow-md shadow-indigo-500/30">
                S
              </div>
              <div className="hidden min-[360px]:block">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-none">
                  {settings?.companyName || t('common.app_name')}
                </h1>
                <p className="text-[9px] sm:text-[10px] font-semibold text-indigo-300 tracking-wider">{t('common.cablenet_id')}</p>
              </div>
            </div>
          </div>

          {/* Desktop Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder={t('common.search_subscriber_placeholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (activeTab !== 'subscribers') setActiveTab('subscribers');
              }}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* SMS Balance widget */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-200 text-xs font-semibold">
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('common.sms_balance')}: <strong className="text-white">{formatNumber(settings?.smsBalance ?? 118, adminLang)}</strong></span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Toggle Dark/Light Mode"
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Selector */}
            <LanguageSelector portalType="admin" />

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition relative min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              </button>
            </div>

            {/* User Profile menu */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
                {user?.name ? user.name.substring(0, 2) : 'AD'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-indigo-300 font-semibold">{user?.role || 'Super Admin'}</p>
              </div>
              <button
                onClick={logout}
                title={t('common.logout')}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-3 py-2 bg-slate-950 border-t border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={t('common.search_subscriber_placeholder') || 'Search customer by name, ID, or phone'}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (activeTab !== 'subscribers') setActiveTab('subscribers');
                }}
                autoFocus
                className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition"
              />
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Permanent Sidebar Navigation (Desktop >=1024px) */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
          <div className="p-4 sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="mb-3 px-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('common.admin_control_center')}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-75" />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('common.role_enforcement')}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content View Container */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Mobile Notifications Modal */}
      <MobileNotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};
