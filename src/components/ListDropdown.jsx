import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Daftar dropdown dengan scroll vertikal. items: [{ key, label, count?, onPick? }]
export default function ListDropdown({ title, hint, items, onClose, searchPlaceholder = 'Cari...' }) {
  const [q, setQ] = useState('');
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => i.label.toLowerCase().includes(s)) : items;
  }, [items, q]);
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4">
        <div><h3 className="font-semibold">{title}</h3>{hint && <p className="text-xs text-slate-500">{hint}</p>}</div>
        <button className="rounded-lg p-1 hover:bg-brand-light" onClick={onClose} aria-label="Tutup"><X className="h-4 w-4" /></button>
      </div>
      <div className="px-4 pb-2">
        <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-brand" /><input className="input !pl-9" placeholder={searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>
      <ul className="max-h-72 divide-y divide-brand/10 overflow-y-auto border-t border-brand/10" role="listbox">
        {shown.map((i) => {
          const inner = (<><span className="min-w-0 flex-1 truncate text-left">{i.label}</span>{i.count != null && <span className="shrink-0 rounded-full bg-brand-light px-2 py-0.5 font-mono text-xs font-bold text-brand">{i.count}</span>}</>);
          return (
            <li key={i.key}>
              {i.onPick
                ? <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-light/70" onClick={i.onPick}>{inner}</button>
                : <div className="flex items-center gap-3 px-4 py-2.5 text-sm">{inner}</div>}
            </li>
          );
        })}
        {!shown.length && <li className="px-4 py-6 text-center text-sm text-slate-500">Tidak ditemukan.</li>}
      </ul>
    </motion.div>
  );
}
