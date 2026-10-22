import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';

function AnimatedNumber({ value }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(typeof value === 'number' ? (reduce ? value : 0) : 0);
  useEffect(() => {
    if (typeof value !== 'number') return undefined;
    if (reduce) { setN(value); return undefined; }
    const c = animate(0, value, { duration: 0.8, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [value, reduce]);
  return <>{typeof value === 'number' ? n.toLocaleString('id-ID') : value}</>;
}

const STATUS_TEXT = { ACTIVE: 'text-green-600', DEGRADED: 'text-amber-600', 'CONNECTION ERROR': 'text-red-600' };

export default function StatCard({ label, value, suffix, desc, icon: Icon, tone = 'default', onClick, delay = 0, loading }) {
  const color = tone === 'danger' ? 'text-red-600' : tone === 'status' ? STATUS_TEXT[value] || 'text-ink' : 'text-ink';
  const Tag = onClick ? motion.button : motion.div;
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }} whileHover={{ y: -3 }} whileTap={onClick ? { scale: 0.99 } : undefined}
      className={`glass-card flex min-h-[150px] flex-col justify-between p-5 text-left ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</span>
        {Icon && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-light text-brand"><Icon className="h-5 w-5" /></span>}
      </div>
      <div>
        <p className={`mt-3 text-4xl font-bold leading-none ${color} ${tone === 'status' ? '!text-2xl' : ''}`}>
          {loading ? '…' : <AnimatedNumber value={value} />}
          {suffix && !loading && <span className="ml-2 text-base font-medium text-slate-500">{suffix}</span>}
        </p>
        {desc && <p className="mt-2 text-sm text-slate-500">{desc}</p>}
      </div>
    </Tag>
  );
}
