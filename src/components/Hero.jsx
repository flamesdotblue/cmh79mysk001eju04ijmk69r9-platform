import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { Rocket, Sparkles } from 'lucide-react';

export default function Hero({ onGetAccess }) {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black pointer-events-none" />
      <div className="absolute -inset-32 opacity-60 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.25),transparent_50%)] blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 mb-6 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>AI voice agent aura • Futuristic • Minimal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
            AI Creator Portfolio — Tools & Training for the Modern Creator
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Learn, Build, and Scale with the Top AI Tools and Prompts — Designed for developers and content creators.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetAccess}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 font-medium shadow-lg shadow-violet-500/25 hover:via-pink-500 transition-colors"
          >
            <Rocket className="h-5 w-5" />
            Get Access Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
