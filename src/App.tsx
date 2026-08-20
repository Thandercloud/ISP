import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';

// Auth Pages
import { AdminLogin } from './pages/auth/AdminLogin';
import { CustomerLogin } from './pages/auth/CustomerLogin';
import { CustomerRegister } from './pages/auth/CustomerRegister';

// Admin Views
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Subscribers } from './pages/admin/Subscribers';
import { Packages } from './pages/admin/Packages';
import { Billing } from './pages/admin/Billing';
import { Payments } from './pages/admin/Payments';
import { SMSManagement } from './pages/admin/SMSManagement';
import { Connections } from './pages/admin/Connections';
import { Complaints } from './pages/admin/Complaints';
import { Expenses } from './pages/admin/Expenses';
import { Deposits } from './pages/admin/Deposits';
import { Reports } from './pages/admin/Reports';
import { ActivityLogs } from './pages/admin/ActivityLogs';
import { SettingsPage } from './pages/admin/Settings';

// Customer Views
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerBilling } from './pages/customer/CustomerBilling';
import { CustomerPackage } from './pages/customer/CustomerPackage';
import { CustomerSupport } from './pages/customer/CustomerSupport';
import { CustomerProfile } from './pages/customer/CustomerProfile';

const MainContent: React.FC = () => {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<'customer_login' | 'admin_login' | 'customer_register'>('admin_login');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [customerTab, setCustomerTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Unauthenticated State
  if (!user) {
    if (authView === 'customer_login') {
      return (
        <CustomerLogin
          onSwitchToAdmin={() => setAuthView('admin_login')}
          onGoToRegister={() => setAuthView('customer_register')}
        />
      );
    } else if (authView === 'customer_register') {
      return <CustomerRegister onBackToLogin={() => setAuthView('customer_login')} />;
    } else {
      return <AdminLogin onSwitchToCustomer={() => setAuthView('customer_login')} />;
    }
  }

  // CUSTOMER PORTAL
  if (user.role === 'Customer') {
    return (
      <CustomerLayout activeTab={customerTab} setActiveTab={setCustomerTab}>
        {customerTab === 'dashboard' && <CustomerDashboard onNavigateTab={setCustomerTab} />}
        {customerTab === 'billing' && <CustomerBilling />}
        {customerTab === 'packages' && <CustomerPackage />}
        {customerTab === 'status' && <CustomerDashboard onNavigateTab={setCustomerTab} />}
        {customerTab === 'support' && <CustomerSupport />}
        {customerTab === 'profile' && <CustomerProfile />}
      </CustomerLayout>
    );
  }

  // ADMIN PANEL
  return (
    <AdminLayout
      activeTab={adminTab}
      setActiveTab={setAdminTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={setAdminTab} />}
      {adminTab === 'subscribers' && <Subscribers searchTerm={searchTerm} />}
      {adminTab === 'packages' && <Packages />}
      {adminTab === 'billing' && <Billing />}
      {adminTab === 'payments' && <Payments />}
      {adminTab === 'sms' && <SMSManagement />}
      {adminTab === 'connections' && <Connections />}
      {adminTab === 'complaints' && <Complaints />}
      {adminTab === 'expenses' && <Expenses />}
      {adminTab === 'deposits' && <Deposits />}
      {adminTab === 'reports' && <Reports />}
      {adminTab === 'logs' && <ActivityLogs />}
      {adminTab === 'settings' && <SettingsPage />}
    </AdminLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
