import { motion } from 'framer-motion';
import { ShoppingCart, BadgeCheck, Clock } from 'lucide-react';

function timeSince(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const hours = Math.floor(seconds / 3600);
  return { hours, label: hours < 1 ? 'Just now' : `Added ${hours} hour${hours === 1 ? '' : 's'} ago`, isNew: hours < 24 };
}

export default function Courses({ onBuy }) {
  const addedAt = new Date(Date.now() - 6 * 3600 * 1000);
  const { label, isNew } = timeSince(addedAt);

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">Courses</h2>
          <p className="text-white/70 mt-1">Expand your toolkit with practical AI resources.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm hover:border-white/20 transition-colors"
        >
          <div className="aspect-video bg-gradient-to-br from-slate-900 to-indigo-900/60 relative">
            <div className="absolute inset-0 grid place-items-center text-white/20 text-5xl font-bold select-none">Preview</div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">Top 100 AI Tools for Creators</h3>
              <span className="text-sm text-emerald-400 inline-flex items-center gap-1">
                <BadgeCheck className="h-4 w-4" /> Available
              </span>
            </div>
            <p className="text-white/70 text-sm">
              A complete collection of the most useful AI tools and ready-to-use prompts for creators and developers.
            </p>
            <div className="flex items-center justify-between mt-4">
              <div className="text-lg font-semibold">₹499</div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Clock className="h-4 w-4" />
                <span>{label}{isNew ? ' • New (24h)' : ''}</span>
              </div>
            </div>
            <button
              onClick={onBuy}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black px-4 py-2 font-medium hover:bg-white/90 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" /> Buy Now
            </button>
          </div>
        </motion.div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 opacity-60 pointer-events-none hidden md:block">
          <div className="aspect-video rounded-lg bg-white/5 mb-4" />
          <div className="h-5 bg-white/10 rounded w-2/3 mb-2" />
          <div className="h-4 bg-white/10 rounded w-full mb-2" />
          <div className="h-4 bg-white/10 rounded w-5/6 mb-4" />
          <div className="h-10 bg-white/10 rounded w-full" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 opacity-60 pointer-events-none hidden md:block">
          <div className="aspect-video rounded-lg bg-white/10 mb-4" />
          <div className="h-5 bg-white/10 rounded w-2/3 mb-2" />
          <div className="h-4 bg-white/10 rounded w-full mb-2" />
          <div className="h-4 bg-white/10 rounded w-5/6 mb-4" />
          <div className="h-10 bg-white/10 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
