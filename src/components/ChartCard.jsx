import GlassCard from './GlassCard.jsx';
import { ResponsiveContainer } from 'recharts';
import { EmptyState, LoadingState } from './States.jsx';
export default function ChartCard({ title, subtitle, empty, loading, height = 280, action, children }) {
  return (
    <GlassCard className="p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div><h3 className="font-semibold">{title}</h3><p className="text-xs text-slate-500">{subtitle}</p></div>{action}
      </div>
      {loading ? <LoadingState /> : empty ? <EmptyState text="Tidak ada data untuk filter ini." /> : <div style={{ height }}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>}
    </GlassCard>
  );
}
