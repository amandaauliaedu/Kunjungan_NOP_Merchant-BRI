import { X, Filter, RotateCcw } from 'lucide-react';
import GlassCard from './GlassCard.jsx';
const CHIP_LABEL = { from: 'Mulai', to: 'Sampai', branch: 'Branch', pn: 'PN', nama: 'Petugas', merchant: 'Merchant', date: 'Grafik: Tanggal', hasil: 'Grafik: Hasil', tl: 'Grafik: Tindak Lanjut', problem: 'Grafik: Problem' };
export default function FilterPanel({ draft, setDraft, options, error, onApply, onReset, chips, onRemoveChip }) {
  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });
  const sel = (k, opts, lbl) => (
    <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{lbl}
      <select className="input mt-1 font-sans normal-case tracking-normal text-ink" value={draft[k]} onChange={set(k)}><option>Semua</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
    </label>);
  return (
    <GlassCard className="p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Tanggal mulai<input type="date" className="input mt-1 font-sans text-ink" value={draft.from} max={draft.to || undefined} onChange={set('from')} /></label>
        <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Tanggal akhir<input type="date" className="input mt-1 font-sans text-ink" value={draft.to} min={draft.from || undefined} onChange={set('to')} /></label>
        {sel('branch', options.branches, 'Branch Office')}
        {sel('pn', options.pns, 'PN Petugas IT')}
        {sel('nama', options.namas, 'Nama Petugas IT')}
        <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Nama Merchant
          <input list="merchant-options" className="input mt-1 font-sans normal-case tracking-normal text-ink" placeholder="Ketik untuk mencari merchant" value={draft.merchant} onChange={set('merchant')} />
          <datalist id="merchant-options">{options.merchants.map((m) => <option key={m} value={m} />)}</datalist>
        </label>
        <div className="flex items-end gap-2 lg:col-span-2">
          <button className="btn-primary" onClick={onApply}><Filter className="h-4 w-4" />Terapkan Filter</button>
          <button className="btn-secondary" onClick={onReset}><RotateCcw className="h-4 w-4" />Reset Filter</button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
      {chips.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{chips.map(([k, v, t]) => (
        <span key={k + t} className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-xs text-brand">{CHIP_LABEL[k] || k}: {v}
          <button aria-label={`Hapus filter ${CHIP_LABEL[k] || k}`} onClick={() => onRemoveChip(k, t)}><X className="h-3 w-3" /></button></span>))}</div>}
    </GlassCard>
  );
}
