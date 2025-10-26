import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, Info } from 'lucide-react';
import { submitPaymentProof } from '../lib/firebase';

const UPI_ID = 'creator@upi';
const BANK_DETAILS = {
  name: 'AI Creator Portfolio',
  account: '1234567890',
  ifsc: 'BANK0001234',
};

export default function Payment() {
  const [orderId, setOrderId] = useState('');
  const [txnId, setTxnId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const last = localStorage.getItem('last_order_id');
    if (last) setOrderId(last);
  }, []);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) return setMessage({ type: 'error', text: 'Order ID is required' });
    if (!txnId && !file) return setMessage({ type: 'error', text: 'Enter Transaction ID or upload screenshot' });

    setLoading(true);
    try {
      const res = await submitPaymentProof({ orderId, txnId, file });
      setMessage({ type: 'success', text: 'Payment proof submitted. Status updated to payment_submitted.' });
      if (res?.orderId) localStorage.setItem('last_order_id', res.orderId);
      setTxnId('');
      setFile(null);
      const input = document.getElementById('payment-file-input');
      if (input) input.value = '';
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Could not submit payment proof. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Payment</h2>
      <p className="text-white/70 mb-8">Complete payment via UPI / GPay / Paytm / NetBanking and submit your proof.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold mb-3">UPI / Wallet</h3>
          <div className="aspect-square rounded-xl border border-white/10 bg-white/5 overflow-hidden grid place-items-center">
            <img src="/qr.png" alt="Payment QR" className="w-3/4 h-3/4 object-contain" />
          </div>
          <div className="mt-4 text-sm">
            <div className="text-white/70">UPI ID</div>
            <div className="font-mono">{UPI_ID}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold mb-3">NetBanking</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-white/70">Account Name</span><span className="font-mono">{BANK_DETAILS.name}</span></div>
            <div className="flex items-center justify-between"><span className="text-white/70">Account No.</span><span className="font-mono">{BANK_DETAILS.account}</span></div>
            <div className="flex items-center justify-between"><span className="text-white/70">IFSC</span><span className="font-mono">{BANK_DETAILS.ifsc}</span></div>
          </div>
          <div className="mt-4 text-xs text-white/60 flex items-center gap-2">
            <Info className="h-4 w-4" /> Use UPI reference or bank transaction ID for verification.
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm mb-1 text-white/80">Order ID</label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. abc123"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm mb-1 text-white/80">Transaction ID</label>
            <input
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="UPI/IMPS Ref"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm mb-1 text-white/80">Screenshot (optional)</label>
            <input id="payment-file-input" type="file" accept="image/*" onChange={onFileChange} className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white file:text-black file:px-3 file:py-2 file:hover:bg-white/90" />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white text-black px-5 py-2.5 font-medium hover:bg-white/90 disabled:opacity-60"
        >
          <UploadCloud className="h-5 w-5" /> {loading ? 'Submitting…' : 'Submit Payment Proof'}
        </motion.button>

        {message && (
          <div className={`mt-4 text-sm ${message.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {message.text}
          </div>
        )}

        <div className="mt-4 text-xs text-white/60 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Orders will be reviewed within 24 hours. You will receive access details via email.
        </div>
      </form>
    </div>
  );
}
