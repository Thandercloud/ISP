import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ISPSettings } from '../types';
import { api } from '../services/api';
import i18n from '../i18n';

interface AuthContextType {
  user: User | null;
  settings: ISPSettings | null;
  loading: boolean;
  adminLang: 'bn' | 'en';
  customerLang: 'bn' | 'en';
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  currentLang: (portalType: 'admin' | 'customer') => 'bn' | 'en';
  changeLanguage: (lang: 'bn' | 'en', portalType: 'admin' | 'customer') => void;
  loginAdmin: (username: string, pass: string) => Promise<boolean>;
  loginCustomer: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  refreshSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('spades_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('spades_theme') as 'light' | 'dark') || 'light';
  });

  const [adminLang, setAdminLang] = useState<'bn' | 'en'>(() => {
    return (localStorage.getItem('spades_lang_admin') as 'bn' | 'en') || 'bn';
  });

  const [customerLang, setCustomerLang] = useState<'bn' | 'en'>(() => {
    return (localStorage.getItem('spades_lang_customer') as 'bn' | 'en') || 'bn';
  });

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('spades_theme', next);
      return next;
    });
  };

  const [settings, setSettings] = useState<ISPSettings | null>({
    companyName: 'Spades Internet',
    logoUrl: '',
    phone: '+880 1885-070504',
    supportNumber: '+880 9612-000111',
    email: 'support@spadesinternet.com',
    address: 'House #42, Road #11, Block-D, Banani, Dhaka-1213',
    facebookPage: 'https://facebook.com/spadesinternet',
    website: 'https://spadesinternet.com',
    bkashNumber: '01885070504 (Merchant)',
    nagadNumber: '01885070504 (Merchant)',
    rocketNumber: '01885070504-7',
    bankInfo: 'Dutch Bangla Bank Ltd, A/C: 104.110.45291, Branch: Banani',
    smsSenderId: 'SPADES_ISP',
    smsApiKey: 'sk_live_spades_bd_9921',
    smsApiUrl: 'https://api.sms-gateway-bd.com/v1/send',
    smsBalance: 118,
    autoBillingDay: 1,
    autoApproveRegistration: false
  });

  const [loading, setLoading] = useState(false);

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data) setSettings(data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const currentLang = (portalType: 'admin' | 'customer'): 'bn' | 'en' => {
    return portalType === 'admin' ? adminLang : customerLang;
  };

  const changeLanguage = (lang: 'bn' | 'en', portalType: 'admin' | 'customer') => {
    if (portalType === 'admin') {
      setAdminLang(lang);
      localStorage.setItem('spades_lang_admin', lang);
    } else {
      setCustomerLang(lang);
      localStorage.setItem('spades_lang_customer', lang);
    }
    i18n.changeLanguage(lang);
  };

  const loginAdmin = async (username: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login(username, pass, 'admin');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('spades_user', JSON.stringify(res.user));
        i18n.changeLanguage(adminLang);
        setLoading(false);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    return false;
  };

  const loginCustomer = async (username: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login(username, pass, 'customer');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('spades_user', JSON.stringify(res.user));
        i18n.changeLanguage(customerLang);
        setLoading(false);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spades_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        loading,
        adminLang,
        customerLang,
        themeMode,
        toggleTheme,
        currentLang,
        changeLanguage,
        loginAdmin,
        loginCustomer,
        logout,
        refreshSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
