import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { PaymentMethod } from '../../types';
import { CheckCircle2, ShieldCheck, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

interface OnlinePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  onSuccess: () => void;
}

export const OnlinePaymentModal: React.FC<OnlinePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  invoiceNumber,
  customerId,
  customerName,
  onSuccess
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedTxn = transactionId || `${method.substring(0, 2).toUpperCase()}${Math.floor(10000000 + Math.random() * 90000000)}`;

    try {
      await api.submitPayment({
        invoiceNumber,
        customerId,
        customerName,
        amount,
        method,
        transactionId: generatedTxn,
        status: 'Approved',
        reference: 'Mobile Payment Gateway Sandbox',
        notes: `Paid via ${method} (${phoneNumber || 'Gateway Direct'})`
      });

      setCompleted(true);
      setLoading(false);
      setTimeout(() => {
        setCompleted(false);
        setStep(1);
        onSuccess();
        onClose();
      }, 1800);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pay Bill" maxWidth="max-w-md">
      {completed ? (
        <div className="py-8 text-center animate-fade-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">Payment Successful!</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            ৳{amount} has been credited for invoice <span className="font-semibold">{invoiceNumber}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handlePay} className="space-y-4">
          {/* Current Due Display */}
          <div className="rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 p-4 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 font-extrabold uppercase">Current Due</p>
              <h2 className="text-3xl font-black text-indigo-900 dark:text-indigo-100 mt-0.5">৳{amount}</h2>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400">Invoice: {invoiceNumber}</p>
            </div>
            <ShieldCheck className="w-9 h-9 text-indigo-600 dark:text-indigo-400" />
          </div>

          {step === 1 ? (
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Select Payment Method
              </label>

              <div className="space-y-2.5">
                {[
                  { id: 'bKash', name: 'bKash', desc: 'Instant bKash Gateway Payment', color: 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300' },
                  { id: 'Nagad', name: 'Nagad', desc: 'Instant Nagad Payment Gateway', color: 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300' },
                  { id: 'Rocket', name: 'Rocket', desc: 'Rocket Mobile Banking', color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300' },
                  { id: 'Bank Transfer', name: 'Bank / Manual', desc: 'DBBL / Bank Deposit / Counter', color: 'border-slate-500 bg-slate-50/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id as PaymentMethod)}
                    className={`w-full min-h-[52px] p-3.5 rounded-2xl border-2 text-left font-bold transition flex items-center justify-between active:scale-98 ${
                      method === item.id 
                        ? `${item.color} shadow-md ring-2 ring-indigo-500/20` 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-black">{item.name}</p>
                      <p className="text-[10px] opacity-75 font-normal">{item.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === item.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                      {method === item.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full min-h-[48px] rounded-2xl bg-indigo-600 hover:bg-indigo-700 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>[ CONTINUE PAYMENT ]</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Payment Method ({method})</span>
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your {method} Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="018XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-hidden"
                    />
                    <Smartphone className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BK88912301"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-mono uppercase text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing Gateway...' : `Complete Payment ৳${amount}`}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
};
