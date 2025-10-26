import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';
import { saveOrder } from '../lib/firebase';

const COURSES = [
  {
    id: 'top-100-ai-tools',
    title: 'Top 100 AI Tools for Creators',
    price: 499,
  },
];

export default function PrePurchaseForm({ onGoToPayment }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', courseId: COURSES[0].id });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const selectedCourse = useMemo(() => COURSES.find(c => c.id === form.courseId), [form.courseId]);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email is required';
    if (!/^\+?[0-9\-()\s]{7,15}$/.test(form.phone)) return 'Valid phone is required';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setMessage({ type: 'error', text: err });
      return;
    }
    setLoading(true);
    try {
      const order = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        courseId: form.courseId,
        courseTitle: selectedCourse?.title,
        price: selectedCourse?.price ?? 0,
      };
      const saved = await saveOrder(order);
      setMessage({ type: 'success', text: 'Order saved. Proceed to payment.' });
      if (saved?.id) localStorage.setItem('last_order_id', saved.id);
      onGoToPayment?.();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Could not save order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Pre-Purchase</h2>
      <p className="text-white/70 mb-8">Enter your details to reserve access and complete payment.</p>

      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-white/80">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Course</label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {COURSES.map(c => (
                <option key={c.id} value={c.id}>{c.title} — ₹{c.price}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 font-medium shadow-lg shadow-violet-500/25 disabled:opacity-60"
        >
          {loading ? 'Saving…' : (<><CheckCircle className="h-5 w-5" /> Save & Continue</>)}
        </motion.button>

        {message && (
          <div className={`mt-4 text-sm ${message.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {message.text}
          </div>
        )}

        <div className="mt-4 text-xs text-white/60 flex items-center gap-2">
          <Send className="h-4 w-4" />
          After saving, scroll to Payment to submit proof. Orders are created with status: pending.
        </div>
      </form>
    </div>
  );
}
