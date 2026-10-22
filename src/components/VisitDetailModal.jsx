import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLUMNS, norm } from '../utils/dataUtils.js';
import { formatTimestamp, visitDate, formatDate } from '../utils/dateUtils.js';
import MapLink from './MapLink.jsx';
import { PhotoButton } from './PhotoViewerModal.jsx';
const WIDE = ['Problem NOP', 'Tindak Lanjut NOP', 'Keterangan (No Tiket)'];
export default function VisitDetailModal({ row, onClose, onPhoto }) {
  useEffect(() => {
    if (!row) return undefined;
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [row, onClose]);
  const val = (c) => (c === 'Timestamp' ? formatTimestamp(row) : c === 'Tanggal Kunjungan' ? (visitDate(row) ? formatDate(visitDate(row)) : norm(row[c]) || '-') : norm(row[c]) || '-');
  return (
    <AnimatePresence>
      {row && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B59]/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="glass-card max-h-[90vh] w-full max-w-3xl overflow-auto p-5" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Detail Kunjungan</h2><button className="btn-secondary" onClick={onClose} aria-label="Tutup"><X className="h-4 w-4" /></button></div>
            <dl className="grid gap-3 md:grid-cols-2">
              {COLUMNS.filter((c) => c !== 'Bukti Foto').map((c) => (
                <div key={c} className={`rounded-xl bg-white/70 p-3 ${WIDE.includes(c) ? 'md:col-span-2' : ''}`}><dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{c}</dt><dd className="mt-1 break-words text-sm font-medium">{val(c)}</dd></div>
              ))}
              <div className="rounded-xl bg-white/70 p-3"><dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Google Maps</dt><dd className="mt-1"><MapLink lat={row['Latitude']} lng={row['Longitude']} /></dd></div>
              <div className="rounded-xl bg-white/70 p-3"><dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Bukti Foto</dt><dd className="mt-1"><PhotoButton value={row['Bukti Foto']} onOpen={onPhoto} /></dd></div>
            </dl>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
