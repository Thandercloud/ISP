import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Users, Package, FileText, CreditCard, Send, 
  Wifi, HelpCircle, TrendingDown, Landmark, BarChart3, Settings, 
  LogOut, X, ChevronRight, History, Shield, Moon, Sun
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab
}) => {
  const { user, settings, logout, themeMode, toggleTheme } = useAuth();
  const { t } = useTranslation();

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-slate-900 text-slate-100 shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out border-r border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-md">
              S
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight leading-tight">
                {settings?.companyName || t('common.app_name')}
              </h2>
              <p className="text-[10px] text-indigo-400 font-semibold">{t('common.admin_control_center')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
              {user?.name ? user.name.substring(0, 2) : 'AD'}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-indigo-300">{user?.role || 'Super Admin'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 transition"
            title="Toggle Dark/Light Mode"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('common.role_enforcement')}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-800/40 text-xs font-bold hover:bg-rose-900/60 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
