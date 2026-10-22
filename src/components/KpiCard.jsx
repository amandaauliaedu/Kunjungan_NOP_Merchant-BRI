import GlassCard from './GlassCard.jsx';

export default function KpiCard({ label, value, sub, icon: Icon, tone = 'text-ink', onClick, ...rest }) {
  const interactive = typeof onClick === 'function';
  return (
    <GlassCard
      className={`p-6 ${interactive ? 'cursor-pointer' : ''}`}
      whileHover={interactive ? { y: -3 } : undefined}
      onClick={onClick}
      {...(interactive ? { role: 'button', tabIndex: 0, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } } : {})}
      {...rest}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">{label}</p>
        {Icon && <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand"><Icon className="h-5 w-5" /></span>}
      </div>
      <p className={`mt-6 text-5xl font-bold leading-none tracking-tight ${tone}`}>{value}</p>
      {sub && <p className="mt-3 text-sm text-slate-500">{sub}</p>}
    </GlassCard>
  );
}
