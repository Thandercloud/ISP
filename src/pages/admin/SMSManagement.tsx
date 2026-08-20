import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SMSLog, SMSTemplate, Subscriber } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatNumber, formatDate } from '../../i18n';
import { Send, Settings, CheckCircle2, AlertCircle, MessageSquare, Users, Tag, Smartphone, Clock } from 'lucide-react';

export const SMSManagement: React.FC = () => {
  const { adminLang, changeLanguage } = useAuth();
  const { t } = useTranslation();
  const [logs, setLogs] = useState<SMSLog[]>([]);
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dispatch' | 'logs' | 'templates' | 'gateway'>('dispatch');

  // Dispatch state
  const [targetGroup, setTargetGroup] = useState<string>('Unpaid');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>(
    'প্রিয় {name}, আপনার ইন্টারনেট বিল ৳{amount}, যার শেষ তারিখ {due_date}। সাময়িক বিচ্ছন্নতা এড়াতে বিল পরিশোধ করুন। - Spades Internet'
  );
  const [confirmModal, setConfirmModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');

  // Gateway config
  const [gatewayConfig, setGatewayConfig] = useState({
    smsSenderId: 'SPADES_ISP',
    smsApiKey: 'sk_live_spades_bd_9921',
    smsApiUrl: 'https://api.sms-gateway-bd.com/v1/send',
    providerName: 'Onnorokom SMS Gateway BD'
  });

  const loadAll = async () => {
    setLoading(true);
    const [l, tmpl, s, cfg] = await Promise.all([
      api.getSMSLogs(),
      api.getSMSTemplates(),
      api.getSubscribers(),
      api.getSettings()
    ]);
    setLogs(l);

    const bnTemplates: SMSTemplate[] = [
      { id: 'tpl-bn-1', title: 'মাসিক বিল জেনারেট সংকেত (বাংলা)', key: 'bill_generated_bn', template: 'প্রিয় {name}, আপনার {package} প্যাকেজের মাসিক বিল ৳{amount} জেনারেট হয়েছে। শেষ তারিখ: {due_date}। - {company}', isAutoEnabled: true },
      { id: 'tpl-bn-2', title: 'পেমেন্ট গ্রহণ বার্তা (বাংলা)', key: 'payment_success_bn', template: 'প্রিয় {name}, আমরা আপনার ৳{amount} টাকা পেমেন্ট পেয়েছি। {company}-এর সাথে থাকার জন্য ধন্যবাদ।', isAutoEnabled: true },
      { id: 'tpl-bn-3', title: 'বকেয়া রিমাইন্ডার (বাংলা)', key: 'due_reminder_bn', template: 'প্রিয় {name}, আপনার ৳{amount} টাকার বিল পরিশোধের শেষ তারিখ আগামীকাল ({due_date})। সময়মতো বিল দিন। - {company}', isAutoEnabled: true },
    ];

    setTemplates([...tmpl, ...bnTemplates]);
    setSubscribers(s);
    if (cfg) {
      setGatewayConfig({
        smsSenderId: cfg.smsSenderId,
        smsApiKey: cfg.smsApiKey,
        smsApiUrl: cfg.smsApiUrl,
        providerName: 'Onnorokom SMS Gateway BD'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const getTargetRecipients = () => {
    if (targetGroup === 'All') return subscribers;
    if (targetGroup === 'Unpaid') return subscribers.filter((s) => s.paymentStatus === 'Unpaid');
    if (targetGroup === 'Overdue') return subscribers.filter((s) => s.paymentStatus === 'Overdue');
    if (targetGroup === 'Paid') return subscribers.filter((s) => s.paymentStatus === 'Paid');
    if (targetGroup === 'Suspended') return subscribers.filter((s) => s.connectionStatus === 'Suspended');
    return subscribers.slice(0, 1);
  };

  const recipients = getTargetRecipients();

  const handleBulkSend = async () => {
    setSending(true);
    let sentCount = 0;

    for (const sub of recipients) {
      const parsedMsg = customMessage
        .replace('{name}', sub.name)
        .replace('{customer_id}', sub.customerId)
        .replace('{amount}', sub.dueAmount.toString())
        .replace('{due_date}', sub.nextDueDate)
        .replace('{package}', sub.packageName)
        .replace('{company}', t('common.app_name'))
        .replace('{phone}', sub.phone);

      await api.sendSMS({
        recipientPhone: sub.phone,
        customerId: sub.customerId,
        customerName: sub.name,
        message: parsedMsg,
        type: 'Auto-Due'
      });
      sentCount++;
    }

    setSending(false);
    setConfirmModal(false);
    setSendResult(`SMS broadcast completed for ${formatNumber(sentCount, adminLang)} recipients.`);
    loadAll();
  };

  const handleTestSMS = async () => {
    setSending(true);
    await api.sendSMS({
      recipientPhone: '01885070504',
      customerName: 'Admin Test Phone',
      message: 'TEST SMS: Spades Internet gateway connection verification success.',
      type: 'Manual'
    });
    setSending(false);
    setSendResult('Test SMS sent successfully to +880 1885-070504');
    loadAll();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Mobile SMS Dispatcher</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Send billing notifications and SMS alerts to subscribers</p>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto scrollbar-none">
          {[
            { id: 'dispatch', label: 'Send SMS' },
            { id: 'logs', label: 'SMS History' },
            { id: 'templates', label: 'Templates' },
            { id: 'gateway', label: 'Gateway' },
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[36px] ${
                activeTab === tb.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {sendResult && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{sendResult}</span>
        </div>
      )}

      {/* DISPATCH TAB */}
      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Send SMS
            </h3>

            {/* Target Group Radio Selection */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Recipients Group
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Unpaid', label: `Due Customers (${subscribers.filter(s => s.paymentStatus === 'Unpaid').length})` },
                  { id: 'Overdue', label: `Overdue (${subscribers.filter(s => s.paymentStatus === 'Overdue').length})` },
                  { id: 'Paid', label: `Paid (${subscribers.filter(s => s.paymentStatus === 'Paid').length})` },
                  { id: 'All', label: `All Customers (${subscribers.length})` },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTargetGroup(opt.id)}
                    className={`min-h-[44px] p-2.5 rounded-2xl border-2 text-xs font-bold transition flex items-center gap-2 ${
                      targetGroup === opt.id
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${targetGroup === opt.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                      {targetGroup === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Quick Switcher */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Language (ভাষা)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeLanguage('bn', 'admin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${adminLang === 'bn' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  🌐 বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('en', 'admin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${adminLang === 'en' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  🌐 English
                </button>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Insert Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  const tmpl = templates.find(tpl => tpl.id === e.target.value);
                  if (tmpl) {
                    setSelectedTemplate(tmpl.id);
                    setCustomMessage(tmpl.template);
                  }
                }}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden"
              >
                <option value="">Select a template...</option>
                {templates.map(tpl => (
                  <option key={tpl.id} value={tpl.id}>{tpl.title}</option>
                ))}
              </select>
            </div>

            {/* SMS Content Textarea & Live Character Counter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Message
                </label>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Characters: {customMessage.length}
                </span>
              </div>
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['{name}', '{customer_id}', '{amount}', '{due_date}', '{package}', '{company}', '{phone}'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setCustomMessage((prev) => prev + ' ' + tag)}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 border border-slate-200 dark:border-slate-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(true)}
                disabled={recipients.length === 0}
                className="min-h-[48px] px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>[ SEND SMS ({recipients.length}) ]</span>
              </button>

              <button
                type="button"
                onClick={handleTestSMS}
                className="min-h-[48px] px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
              >
                Send Test SMS
              </button>
            </div>
          </div>

          {/* Gateway Live Status Box */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl">
            <h4 className="font-extrabold text-sm text-indigo-300">Live Preview & Gateway Status</h4>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 space-y-2">
              <p className="text-[10px] uppercase font-bold text-indigo-400">Target Sample Recipient</p>
              <p>Name: {recipients[0]?.name || 'Tanvir Hossain'}</p>
              <p>Phone: {recipients[0]?.phone || '01711223344'}</p>
              <div className="pt-2 border-t border-slate-700 text-white leading-relaxed font-sans">
                "{customMessage
                  .replace('{name}', recipients[0]?.name || 'Tanvir Hossain')
                  .replace('{customer_id}', recipients[0]?.customerId || 'SPD-1001')
                  .replace('{amount}', (recipients[0]?.dueAmount || 850).toString())
                  .replace('{due_date}', recipients[0]?.nextDueDate || '2026-09-01')
                  .replace('{package}', recipients[0]?.packageName || 'Standard 20 Mbps')
                  .replace('{company}', t('common.app_name'))
                  .replace('{phone}', recipients[0]?.phone || '01711223344')}"
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Gateway API:</span>
                <span className="font-bold text-emerald-400">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sender Mask ID:</span>
                <span className="font-mono text-white font-bold">{gatewayConfig.smsSenderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Credit Balance:</span>
                <span className="font-bold text-indigo-300 text-sm">{formatNumber(118, adminLang)} SMS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY LOGS TAB (Mobile Cards & Desktop Table) */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          {/* Mobile Logs View */}
          <div className="space-y-3 md:hidden">
            {logs.map((log) => (
              <div key={log.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {log.sentAt}
                  </span>
                  <Badge status={log.status} />
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {log.customerName} <span className="font-mono text-slate-400">({log.recipientPhone})</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-snug bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-750">
                  {log.message}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop Logs View */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Customer ID</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Message Text</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{log.sentAt}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {log.customerName}
                        <span className="block text-[11px] font-mono text-slate-400">{log.recipientPhone}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-indigo-600 dark:text-indigo-400">{log.customerId}</td>
                      <td className="py-3.5 px-4 font-semibold">{log.type}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">{log.message}</td>
                      <td className="py-3.5 px-4"><Badge status={log.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BULK SMS CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={confirmModal}
        title="Send Bulk SMS Broadcast"
        message={
          adminLang === 'bn'
            ? `আপনি কি ${formatNumber(recipients.length, 'bn')} জন গ্রাহককে SMS পাঠাতে চান?`
            : `Are you sure you want to send SMS to ${recipients.length} customers?`
        }
        confirmText="SEND SMS NOW"
        cancelText="Cancel"
        onConfirm={handleBulkSend}
        onCancel={() => setConfirmModal(false)}
      />
    </div>
  );
};
