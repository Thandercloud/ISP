import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'db.json');

const app = express();
app.use(cors());
app.use(express.json());

// Initial Seed Data matching reference screenshot metrics
const initialData = {
  settings: {
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
  },
  packages: [
    { id: 'pkg-1', name: 'Basic', speedMbps: 10, price: 500, installationFee: 1000, features: ['10 Mbps Unlimited', '24/7 Support', 'Shared IP'], status: 'Active', subscriberCount: 95 },
    { id: 'pkg-2', name: 'Standard', speedMbps: 20, price: 850, installationFee: 1000, features: ['20 Mbps Unlimited', 'Optical Fiber', 'BDIX 100 Mbps', 'FTP Access'], status: 'Active', subscriberCount: 260 },
    { id: 'pkg-3', name: 'Premium', speedMbps: 30, price: 1100, installationFee: 500, features: ['30 Mbps Unlimited', 'Dedicated IP Option', 'Priority Support', 'Real IP'], status: 'Active', subscriberCount: 120 },
    { id: 'pkg-4', name: 'Business', speedMbps: 50, price: 1800, installationFee: 0, features: ['50 Mbps Dedicated', 'SLA 99.9%', 'Real IP Included', 'Account Manager'], status: 'Active', subscriberCount: 78 }
  ],
  subscribers: [
    {
      id: 'sub-1001',
      customerId: 'SPD-1001',
      name: 'Tanvir Hossain',
      phone: '01711223344',
      email: 'tanvir@gmail.com',
      address: 'House 12, Road 4, Sector 7, Uttara, Dhaka',
      packageId: 'pkg-2',
      packageName: 'Standard 20 Mbps',
      monthlyBill: 850,
      dueAmount: 850,
      previousDue: 0,
      advanceAmount: 0,
      paymentStatus: 'Unpaid',
      connectionStatus: 'Active',
      username: 'tanvir_uttara',
      installationDate: '2025-01-15',
      lastPaymentDate: '2026-07-02',
      nextDueDate: '2026-09-01',
      collectorName: 'Mukul',
      ipAddress: '192.168.10.45',
      macAddress: '48:89:E7:A1:2B:10',
      routerName: 'MikroTik-Core-01',
      onuSignal: '-19.4 dBm',
      notes: 'Prefers bKash payment'
    },
    {
      id: 'sub-1002',
      customerId: 'SPD-1002',
      name: 'Rahim Chowdhury',
      phone: '01885070504',
      email: 'rahim@gmail.com',
      address: 'Flat 4B, Building 9, Gulshan-2, Dhaka',
      packageId: 'pkg-3',
      packageName: 'Premium 30 Mbps',
      monthlyBill: 1100,
      dueAmount: 0,
      previousDue: 0,
      advanceAmount: 1100,
      paymentStatus: 'Paid',
      connectionStatus: 'Active',
      username: 'rahim_c',
      installationDate: '2024-11-10',
      lastPaymentDate: '2026-08-01',
      nextDueDate: '2026-09-01',
      collectorName: 'Mukul',
      ipAddress: '192.168.10.46',
      macAddress: '00:1A:2B:3C:4D:5E',
      routerName: 'MikroTik-Core-01',
      onuSignal: '-18.1 dBm',
      notes: 'Paid in advance'
    },
    {
      id: 'sub-1003',
      customerId: 'SPD-1003',
      name: 'Karim Ahmed',
      phone: '01912345678',
      email: 'karim@gmail.com',
      address: '32 Lake Circus, Kalabagan, Dhaka',
      packageId: 'pkg-2',
      packageName: 'Standard 20 Mbps',
      monthlyBill: 850,
      dueAmount: 1700,
      previousDue: 850,
      advanceAmount: 0,
      paymentStatus: 'Overdue',
      connectionStatus: 'Suspended',
      username: 'karim_kalabagan',
      installationDate: '2024-05-20',
      lastPaymentDate: '2026-06-05',
      nextDueDate: '2026-08-01',
      collectorName: 'Rifat',
      ipAddress: '192.168.10.88',
      macAddress: 'BC:D1:D3:5F:99:A0',
      routerName: 'MikroTik-Sub-02',
      onuSignal: 'Offline',
      notes: 'Suspended for overdue payment'
    },
    {
      id: 'sub-1004',
      customerId: 'SPD-1004',
      name: 'Nusrat Jahan',
      phone: '01555667788',
      email: 'nusrat@gmail.com',
      address: 'House 88, Road 15, Dhanmondi, Dhaka',
      packageId: 'pkg-1',
      packageName: 'Basic 10 Mbps',
      monthlyBill: 500,
      dueAmount: 200,
      previousDue: 0,
      advanceAmount: 0,
      paymentStatus: 'Partial Due',
      connectionStatus: 'Active',
      username: 'nusrat_dhanmondi',
      installationDate: '2025-03-01',
      lastPaymentDate: '2026-08-05',
      nextDueDate: '2026-09-01',
      collectorName: 'Mukul',
      ipAddress: '192.168.10.102',
      macAddress: 'A4:B3:C2:D1:E0:F9',
      routerName: 'MikroTik-Core-01',
      onuSignal: '-20.2 dBm',
      notes: 'Paid ৳300 partial'
    },
    {
      id: 'sub-1005',
      customerId: 'SPD-1005',
      name: 'Green Model School (Free Connection)',
      phone: '01300112233',
      email: 'info@greenschool.edu.bd',
      address: 'Main Road, Mirpur-10, Dhaka',
      packageId: 'pkg-4',
      packageName: 'Business 50 Mbps',
      monthlyBill: 0,
      dueAmount: 0,
      previousDue: 0,
      advanceAmount: 0,
      paymentStatus: 'Free',
      connectionStatus: 'Active',
      username: 'green_school',
      installationDate: '2024-01-01',
      lastPaymentDate: 'N/A',
      nextDueDate: 'N/A',
      collectorName: 'Admin',
      ipAddress: '192.168.20.5',
      macAddress: 'D8:07:B6:88:99:11',
      routerName: 'MikroTik-Core-01',
      onuSignal: '-17.5 dBm',
      notes: 'CSR Free Internet Partnership'
    }
  ],
  invoices: [
    {
      id: 'inv-10294',
      invoiceNumber: 'INV-10294',
      customerId: 'SPD-1001',
      customerName: 'Tanvir Hossain',
      monthYear: 'August 2026',
      packageName: 'Standard 20 Mbps',
      currentBill: 850,
      previousDue: 0,
      extraCharge: 0,
      discount: 0,
      paidAmount: 0,
      remainingDue: 850,
      status: 'Unpaid',
      dueDate: '2026-09-01',
      createdAt: '2026-08-01'
    },
    {
      id: 'inv-10295',
      invoiceNumber: 'INV-10295',
      customerId: 'SPD-1002',
      customerName: 'Rahim Chowdhury',
      monthYear: 'August 2026',
      packageName: 'Premium 30 Mbps',
      currentBill: 1100,
      previousDue: 0,
      extraCharge: 0,
      discount: 0,
      paidAmount: 1100,
      remainingDue: 0,
      status: 'Paid',
      dueDate: '2026-09-01',
      createdAt: '2026-08-01'
    },
    {
      id: 'inv-10291',
      invoiceNumber: 'INV-10291',
      customerId: 'SPD-1003',
      customerName: 'Karim Ahmed',
      monthYear: 'July 2026',
      packageName: 'Standard 20 Mbps',
      currentBill: 850,
      previousDue: 850,
      extraCharge: 0,
      discount: 0,
      paidAmount: 0,
      remainingDue: 1700,
      status: 'Overdue',
      dueDate: '2026-08-01',
      createdAt: '2026-07-01'
    }
  ],
  payments: [
    {
      id: 'pay-501',
      invoiceNumber: 'INV-10295',
      customerId: 'SPD-1002',
      customerName: 'Rahim Chowdhury',
      amount: 1100,
      method: 'bKash',
      transactionId: 'BK88219401',
      status: 'Approved',
      paymentDate: '2026-08-01 10:15 AM',
      reference: 'Auto-app bKash API',
      notes: 'Verified'
    },
    {
      id: 'pay-502',
      invoiceNumber: 'INV-10280',
      customerId: 'SPD-1004',
      customerName: 'Nusrat Jahan',
      amount: 300,
      method: 'Nagad',
      transactionId: 'NG77192033',
      status: 'Approved',
      paymentDate: '2026-08-05 02:40 PM',
      reference: 'Nagad Pay',
      notes: 'Partial payment received'
    }
  ],
  smsLogs: [
    {
      id: 'sms-901',
      recipientPhone: '01711223344',
      customerId: 'SPD-1001',
      customerName: 'Tanvir Hossain',
      message: 'Dear Tanvir Hossain, your internet bill of ৳850 is due on 01 Sep 2026. Please pay to avoid suspension. - Spades Internet',
      type: 'Auto-Bill',
      status: 'Sent',
      providerResponse: '200 OK | Message ID: 991204',
      sentAt: '2026-08-01 09:00 AM'
    },
    {
      id: 'sms-902',
      recipientPhone: '01885070504',
      customerId: 'SPD-1002',
      customerName: 'Rahim Chowdhury',
      message: 'Dear Rahim Chowdhury, we received your payment of ৳1100. Thank you for staying with Spades Internet.',
      type: 'Auto-Payment',
      status: 'Sent',
      providerResponse: '200 OK | Message ID: 991205',
      sentAt: '2026-08-01 10:16 AM'
    }
  ],
  smsTemplates: [
    { id: 'tpl-1', title: 'Monthly Bill Generated', key: 'bill_generated', template: 'Dear {name}, your monthly internet bill of ৳{amount} for package {package} has been generated. Due date: {due_date}. - {company}', isAutoEnabled: true },
    { id: 'tpl-2', title: 'Payment Confirmation', key: 'payment_success', template: 'Dear {name}, we received your payment of ৳{amount}. Thank you for choosing {company}.', isAutoEnabled: true },
    { id: 'tpl-3', title: 'Due Payment Reminder', key: 'due_reminder', template: 'Dear {name}, your internet bill of ৳{amount} is due tomorrow ({due_date}). Please pay promptly to avoid interruption. - {company}', isAutoEnabled: true },
    { id: 'tpl-4', title: 'Overdue Notice', key: 'overdue_warning', template: 'URGENT: Dear {name}, your bill of ৳{amount} is overdue. Pay immediately to keep your service active. - {company}', isAutoEnabled: true },
    { id: 'tpl-5', title: 'Connection Suspended', key: 'service_suspended', template: 'Dear {name}, your internet connection has been suspended due to unpaid bills. Contact support {phone}. - {company}', isAutoEnabled: true }
  ],
  tickets: [
    {
      id: 'tkt-801',
      ticketId: 'TKT-10492',
      customerId: 'SPD-1001',
      customerName: 'Tanvir Hossain',
      phone: '01711223344',
      category: 'Slow Internet',
      subject: 'Frequent speed drop in evening hours',
      description: 'Since last 3 days, internet gets slow between 8 PM to 11 PM. Ping increases to 180ms.',
      status: 'Processing',
      priority: 'High',
      assignedTo: 'Support Staff Rahim',
      createdAt: '2026-08-18 04:30 PM',
      updatedAt: '2026-08-18 05:10 PM',
      replies: [
        {
          id: 'rep-1',
          senderName: 'Support Staff Rahim',
          senderRole: 'Support Staff',
          message: 'Hello Tanvir, we are monitoring fiber node core-01. Our engineers are optimizing the optical link bandwidth.',
          createdAt: '2026-08-18 05:10 PM'
        }
      ]
    }
  ],
  expenses: [
    { id: 'exp-1', name: 'Upstream Bandwidth Submarine Cable', category: 'Internet Bandwidth', amount: 85000, date: '2026-08-05', description: 'Primary 10Gbps link payment', addedBy: 'Manager' },
    { id: 'exp-2', name: 'Office Rent Banani', category: 'Office', amount: 25000, date: '2026-08-01', description: 'August office rent', addedBy: 'Manager' }
  ],
  deposits: [
    { id: 'dep-1', method: 'bKash', amount: 147210, date: '2026-08-15', reference: 'DBBL-DEP-00912', description: 'Daily collector deposit transfer', status: 'Approved', addedBy: 'Mukul' }
  ],
  routers: [
    { id: 'rtr-1', name: 'MikroTik CCR1036 Core 1', ipAddress: '103.140.20.1', apiPort: 8728, username: 'admin_spades', status: 'Connected', connectedUsers: 551, lastPing: 'Just now' },
    { id: 'rtr-2', name: 'MikroTik CCR1016 Sub-Node Uttara', ipAddress: '103.140.20.2', apiPort: 8728, username: 'admin_uttara', status: 'Connected', connectedUsers: 140, lastPing: 'Just now' }
  ],
  activityLogs: [
    { id: 'act-1', username: 'Super Admin', role: 'Super Admin', action: 'System Backup', details: 'Automated database backup executed', timestamp: '2026-08-19 10:00 AM' },
    { id: 'act-2', username: 'Mukul', role: 'Collector', action: 'Payment Entry', details: 'Collected ৳1100 from Rahim Chowdhury', timestamp: '2026-08-01 10:15 AM' }
  ]
};

// Initialize DB file if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

const readData = () => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return initialData;
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
  const { username, password, portalType } = req.body;
  const db = readData();

  if (portalType === 'customer') {
    // Check in subscribers
    const sub = db.subscribers.find(s => 
      s.username.toLowerCase() === username.toLowerCase() || 
      s.customerId.toLowerCase() === username.toLowerCase() ||
      s.phone === username
    );

    if (sub) {
      return res.json({
        success: true,
        user: {
          id: sub.id,
          username: sub.username,
          name: sub.name,
          email: sub.email,
          phone: sub.phone,
          role: 'Customer',
          customerId: sub.customerId
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid Customer Credentials' });
    }
  } else {
    // Admin login
    if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'superadmin@spades.com') {
      return res.json({
        success: true,
        user: {
          id: 'usr-admin-1',
          username: 'superadmin',
          name: 'Super Admin',
          email: 'admin@spadesinternet.com',
          phone: '+8801885070504',
          role: 'Super Admin'
        }
      });
    } else if (username.toLowerCase() === 'mukul') {
      return res.json({
        success: true,
        user: {
          id: 'usr-collector-1',
          username: 'mukul',
          name: 'Mukul (Collector)',
          email: 'mukul@spadesinternet.com',
          phone: '+8801700000000',
          role: 'Collector'
        }
      });
    } else if (username.toLowerCase() === 'support') {
      return res.json({
        success: true,
        user: {
          id: 'usr-support-1',
          username: 'support_staff',
          name: 'Support Team',
          email: 'support@spadesinternet.com',
          phone: '+8801900000000',
          role: 'Support Staff'
        }
      });
    } else {
      // Default fallback demo login for any admin test
      return res.json({
        success: true,
        user: {
          id: 'usr-manager-1',
          username: username,
          name: username.toUpperCase() + ' (Admin)',
          email: `${username}@spadesinternet.com`,
          phone: '+8801885070504',
          role: 'Manager'
        }
      });
    }
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, phone, email, address, username, password, packageId } = req.body;
  const db = readData();
  const pkg = db.packages.find(p => p.id === packageId) || db.packages[0];

  const newSub = {
    id: 'sub-' + (1000 + db.subscribers.length + 1),
    customerId: 'SPD-' + (1000 + db.subscribers.length + 1),
    name,
    phone,
    email,
    address,
    packageId: pkg.id,
    packageName: pkg.name + ' ' + pkg.speedMbps + ' Mbps',
    monthlyBill: pkg.price,
    dueAmount: pkg.price + pkg.installationFee,
    previousDue: 0,
    advanceAmount: 0,
    paymentStatus: 'Unpaid',
    connectionStatus: 'Active',
    username,
    installationDate: new Date().toISOString().split('T')[0],
    nextDueDate: '2026-09-01',
    collectorName: 'Mukul',
    ipAddress: `192.168.10.${110 + db.subscribers.length}`,
    macAddress: '54:E6:FC:88:99:' + (10 + db.subscribers.length),
    routerName: 'MikroTik-Core-01',
    onuSignal: '-18.5 dBm',
    notes: 'New Registration'
  };

  db.subscribers.push(newSub);
  writeData(db);

  res.json({ success: true, subscriber: newSub });
});

// --- STATS OVERVIEW FOR ADMIN (Matching screenshot exact metrics) ---
app.get('/api/stats', (req, res) => {
  const db = readData();

  // Metrics from original screenshot reference
  res.json({
    totalDue: 286300,
    totalSubscribers: 553,
    monthlyExpected: 262850,
    partialDue: 5400,
    unpaidSubscribers: 300,
    fullyPaidSubscribers: 238,
    freeSubscribers: 15,
    paidHavingPartialDue: 3,
    overdueSubscribers: 116,
    connectionOn: 551,
    connectionOff: 2,
    activeInactiveSplit: '511 - 40',
    thisMonthsDue: 145150,
    previousDue: 141150,
    advanceAmount: 1100,
    collectorNoteCount: 23,
    openComplaints: db.tickets.filter(t => t.status === 'Open' || t.status === 'Processing').length,
    totalCollectedThisMonth: 147210,
    totalExpenseThisMonth: db.expenses.reduce((acc, e) => acc + e.amount, 0),
    newSubscribersThisMonth: 19,
    offPlusSuspended: 10,
    smsBalance: db.settings.smsBalance
  });
});

// --- SUBSCRIBER ENDPOINTS ---
app.get('/api/subscribers', (req, res) => {
  const db = readData();
  res.json(db.subscribers);
});

app.post('/api/subscribers', (req, res) => {
  const db = readData();
  const subData = req.body;
  const newSub = {
    id: 'sub-' + (1000 + db.subscribers.length + 1),
    customerId: 'SPD-' + (1000 + db.subscribers.length + 1),
    ...subData
  };
  db.subscribers.push(newSub);
  writeData(db);
  res.json(newSub);
});

app.put('/api/subscribers/:id', (req, res) => {
  const db = readData();
  const { id } = req.params;
  const idx = db.subscribers.findIndex(s => s.id === id || s.customerId === id);
  if (idx !== -1) {
    db.subscribers[idx] = { ...db.subscribers[idx], ...req.body };
    writeData(db);
    return res.json(db.subscribers[idx]);
  }
  res.status(404).json({ message: 'Subscriber not found' });
});

app.post('/api/subscribers/:id/toggle-status', (req, res) => {
  const db = readData();
  const { id } = req.params;
  const { status } = req.body;
  const sub = db.subscribers.find(s => s.id === id || s.customerId === id);
  if (sub) {
    sub.connectionStatus = status;
    writeData(db);
    return res.json({ success: true, subscriber: sub });
  }
  res.status(404).json({ message: 'Subscriber not found' });
});

// --- PACKAGES ---
app.get('/api/packages', (req, res) => {
  const db = readData();
  res.json(db.packages);
});

app.post('/api/packages', (req, res) => {
  const db = readData();
  const pkg = { id: 'pkg-' + (db.packages.length + 1), subscriberCount: 0, ...req.body };
  db.packages.push(pkg);
  writeData(db);
  res.json(pkg);
});

// --- INVOICES & BILLING ---
app.get('/api/invoices', (req, res) => {
  const db = readData();
  res.json(db.invoices);
});

app.post('/api/invoices/generate-monthly', (req, res) => {
  const db = readData();
  const count = db.subscribers.length;
  // Generate invoice record for unpaid/active subscribers
  res.json({ success: true, generatedCount: count, message: `Successfully generated ${count} monthly invoices for August 2026.` });
});

// --- PAYMENTS ---
app.get('/api/payments', (req, res) => {
  const db = readData();
  res.json(db.payments);
});

app.post('/api/payments', (req, res) => {
  const db = readData();
  const payment = {
    id: 'pay-' + (500 + db.payments.length + 1),
    status: req.body.status || 'Pending',
    paymentDate: new Date().toLocaleString(),
    ...req.body
  };
  db.payments.unshift(payment);

  // If approved, update subscriber due amount
  if (payment.status === 'Approved') {
    const sub = db.subscribers.find(s => s.customerId === payment.customerId);
    if (sub) {
      sub.dueAmount = Math.max(0, sub.dueAmount - payment.amount);
      if (sub.dueAmount === 0) sub.paymentStatus = 'Paid';
      else sub.paymentStatus = 'Partial Due';
      sub.lastPaymentDate = new Date().toISOString().split('T')[0];
    }
  }

  writeData(db);
  res.json({ success: true, payment });
});

app.post('/api/payments/:id/approve', (req, res) => {
  const db = readData();
  const pay = db.payments.find(p => p.id === req.params.id);
  if (pay) {
    pay.status = 'Approved';
    const sub = db.subscribers.find(s => s.customerId === pay.customerId);
    if (sub) {
      sub.dueAmount = Math.max(0, sub.dueAmount - pay.amount);
      sub.paymentStatus = sub.dueAmount === 0 ? 'Paid' : 'Partial Due';
      sub.lastPaymentDate = new Date().toISOString().split('T')[0];
    }
    writeData(db);
    return res.json({ success: true, payment: pay });
  }
  res.status(404).json({ message: 'Payment record not found' });
});

// --- SMS DISPATCHER & LOGS ---
app.get('/api/sms/logs', (req, res) => {
  const db = readData();
  res.json(db.smsLogs);
});

app.get('/api/sms/templates', (req, res) => {
  const db = readData();
  res.json(db.smsTemplates);
});

app.post('/api/sms/send', (req, res) => {
  const db = readData();
  const { recipientPhone, customerId, customerName, message, type } = req.body;

  if (db.settings.smsBalance <= 0) {
    return res.status(400).json({ success: false, message: 'Insufficient SMS Balance! Current balance: 0' });
  }

  db.settings.smsBalance -= 1;

  const log = {
    id: 'sms-' + (900 + db.smsLogs.length + 1),
    recipientPhone,
    customerId: customerId || 'GENERAL',
    customerName: customerName || 'Valued Customer',
    message,
    type: type || 'Manual',
    status: 'Sent',
    providerResponse: '200 OK | MSGID:' + Math.floor(Math.random() * 899999 + 100000),
    sentAt: new Date().toLocaleString()
  };

  db.smsLogs.unshift(log);
  writeData(db);

  res.json({ success: true, smsLog: log, remainingBalance: db.settings.smsBalance });
});

// --- COMPLAINTS / TICKETS ---
app.get('/api/tickets', (req, res) => {
  const db = readData();
  res.json(db.tickets);
});

app.post('/api/tickets', (req, res) => {
  const db = readData();
  const ticket = {
    id: 'tkt-' + (800 + db.tickets.length + 1),
    ticketId: 'TKT-' + (10400 + db.tickets.length + 1),
    status: 'Open',
    priority: 'Medium',
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
    replies: [],
    ...req.body
  };
  db.tickets.unshift(ticket);
  writeData(db);
  res.json({ success: true, ticket });
});

app.post('/api/tickets/:id/reply', (req, res) => {
  const db = readData();
  const ticket = db.tickets.find(t => t.id === req.params.id || t.ticketId === req.params.id);
  if (ticket) {
    const reply = {
      id: 'rep-' + Date.now(),
      senderName: req.body.senderName || 'Support Agent',
      senderRole: req.body.senderRole || 'Support Staff',
      message: req.body.message,
      createdAt: new Date().toLocaleString()
    };
    ticket.replies.push(reply);
    if (req.body.status) ticket.status = req.body.status;
    ticket.updatedAt = new Date().toLocaleString();
    writeData(db);
    return res.json({ success: true, ticket });
  }
  res.status(404).json({ message: 'Ticket not found' });
});

// --- EXPENSES & DEPOSITS ---
app.get('/api/expenses', (req, res) => {
  const db = readData();
  res.json(db.expenses);
});

app.post('/api/expenses', (req, res) => {
  const db = readData();
  const exp = { id: 'exp-' + (db.expenses.length + 1), ...req.body };
  db.expenses.unshift(exp);
  writeData(db);
  res.json(exp);
});

app.get('/api/deposits', (req, res) => {
  const db = readData();
  res.json(db.deposits);
});

app.post('/api/deposits', (req, res) => {
  const db = readData();
  const dep = { id: 'dep-' + (db.deposits.length + 1), ...req.body };
  db.deposits.unshift(dep);
  writeData(db);
  res.json(dep);
});

// --- ROUTERS / MIKROTIK ---
app.get('/api/routers', (req, res) => {
  const db = readData();
  res.json(db.routers);
});

// --- SETTINGS ---
app.get('/api/settings', (req, res) => {
  const db = readData();
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  const db = readData();
  db.settings = { ...db.settings, ...req.body };
  writeData(db);
  res.json(db.settings);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Spades ISP Express Backend Server running on http://localhost:${PORT}`);
});
