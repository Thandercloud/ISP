export type Role = 'Super Admin' | 'Manager' | 'Collector' | 'Support Staff' | 'Customer';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  customerId?: string;
  avatarUrl?: string;
}

export type ConnectionStatus = 'Active' | 'Inactive' | 'Suspended' | 'Disabled';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial Due' | 'Overdue' | 'Free';

export interface Subscriber {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  packageId: string;
  packageName: string;
  monthlyBill: number;
  dueAmount: number;
  previousDue: number;
  advanceAmount: number;
  paymentStatus: PaymentStatus;
  connectionStatus: ConnectionStatus;
  username: string;
  installationDate: string;
  lastPaymentDate?: string;
  nextDueDate: string;
  collectorName: string;
  ipAddress: string;
  macAddress: string;
  routerName: string;
  onuSignal: string;
  notes?: string;
}

export interface InternetPackage {
  id: string;
  name: string;
  speedMbps: number;
  price: number;
  installationFee: number;
  features: string[];
  status: 'Active' | 'Inactive';
  subscriberCount?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  monthYear: string;
  packageName: string;
  currentBill: number;
  previousDue: number;
  extraCharge: number;
  discount: number;
  paidAmount: number;
  remainingDue: number;
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
  dueDate: string;
  createdAt: string;
}

export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Card' | 'Cash';
export type TransactionStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Payment {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  transactionId: string;
  status: TransactionStatus;
  paymentDate: string;
  reference?: string;
  notes?: string;
}

export interface SMSLog {
  id: string;
  recipientPhone: string;
  customerId: string;
  customerName: string;
  message: string;
  type: 'Manual' | 'Auto-Bill' | 'Auto-Due' | 'Auto-Overdue' | 'Auto-Payment' | 'Auto-Suspension';
  status: 'Sent' | 'Failed' | 'Pending';
  providerResponse?: string;
  sentAt: string;
}

export interface SMSTemplate {
  id: string;
  title: string;
  key: string;
  template: string;
  isAutoEnabled: boolean;
}

export interface TicketReply {
  id: string;
  senderName: string;
  senderRole: Role;
  message: string;
  createdAt: string;
}

export type TicketCategory = 'Complaint' | 'Connection Problem' | 'Payment Problem' | 'Slow Internet' | 'Package Change' | 'Other';
export type TicketStatus = 'Open' | 'Processing' | 'Resolved' | 'Closed';

export interface Ticket {
  id: string;
  ticketId: string;
  customerId: string;
  customerName: string;
  phone: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

export interface Expense {
  id: string;
  name: string;
  category: 'Internet Bandwidth' | 'Electricity' | 'Office' | 'Employee' | 'Transport' | 'Equipment' | 'Maintenance' | 'Other';
  amount: number;
  date: string;
  description?: string;
  addedBy: string;
}

export interface Deposit {
  id: string;
  method: PaymentMethod;
  amount: number;
  date: string;
  reference: string;
  description?: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  addedBy: string;
}

export interface RouterConfig {
  id: string;
  name: string;
  ipAddress: string;
  apiPort: number;
  username: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  connectedUsers: number;
  lastPing: string;
}

export interface ISPSettings {
  companyName: string;
  logoUrl: string;
  phone: string;
  supportNumber: string;
  email: string;
  address: string;
  facebookPage: string;
  website: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  bankInfo: string;
  smsSenderId: string;
  smsApiKey: string;
  smsApiUrl: string;
  smsBalance: number;
  autoBillingDay: number;
  autoApproveRegistration: boolean;
}

export interface ActivityLog {
  id: string;
  username: string;
  role: Role;
  action: string;
  details: string;
  timestamp: string;
}
