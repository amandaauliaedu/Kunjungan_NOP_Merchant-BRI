import { X, Filter, RotateCcw } from 'lucide-react';
import GlassCard from './GlassCard.jsx';
const CHIP_LABEL = { from: 'Mulai', to: 'Sampai', branch: 'Branch', petugas: 'Petugas', date: 'Grafik: Tanggal', hasil: 'Grafik: Hasil', tl: 'Grafik: Tindak Lanjut', problem: 'Grafik: Problem' };

// Filter: tanggal mulai/akhir, Branch Office, dan Petugas IT (PN - Nama). `extra` = slot kanan (mis. Refresh, indikator LIVE).
export default function FilterPanel({ draft, setDraft, options, error, onApply, onReset, chips, onRemoveChip, extra }) {
  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });
  const lbl = 'font-mono text-[11px] uppercase tracking-wider text-slate-500';
  return (
    <GlassCard className="p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className={lbl}>Tanggal mulai<input type="date" className="input mt-1 font-sans text-ink" value={draft.from} max={draft.to || undefined} onChange={set('from')} /></label>
        <label className={lbl}>Tanggal akhir<input type="date" className="input mt-1 font-sans text-ink" value={draft.to} min={draft.from || undefined} onChange={set('to')} /></label>
        <label className={lbl}>Branch Office
          <select className="input mt-1 font-sans normal-case tracking-normal text-ink" value={draft.branch} onChange={set('branch')}><option>Semua</option>{options.branches.map((o) => <option key={o}>{o}</option>)}</select>
        </label>
        <label className={lbl}>PN - Nama Petugas IT
          <select className="input mt-1 font-sans normal-case tracking-normal text-ink" value={draft.petugas} onChange={set('petugas')}><option value="Semua">Semua</option>{options.petugas.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="btn-primary" onClick={onApply}><Filter className="h-4 w-4" />Terapkan Filter</button>
        <button className="btn-secondary" onClick={onReset}><RotateCcw className="h-4 w-4" />Reset Filter</button>
        {extra && <div className="ml-auto flex items-center gap-3">{extra}</div>}
      </div>
      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
      {chips.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{chips.map(([k, v, t]) => (
        <span key={k + t} className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-xs text-brand">{CHIP_LABEL[k] || k}: {v}
          <button aria-label={`Hapus filter ${CHIP_LABEL[k] || k}`} onClick={() => onRemoveChip(k, t)}><X className="h-3 w-3" /></button></span>))}</div>}
    </GlassCard>
  );
}
