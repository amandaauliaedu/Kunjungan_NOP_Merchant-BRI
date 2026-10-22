import { useEffect, useState } from 'react';
import { X, ExternalLink, Image as Img } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { driveInfo } from '../utils/dataUtils.js';
export function PhotoButton({ value, onOpen }) {
  const info = driveInfo(value);
  if (!info) return <span className="text-xs text-slate-400">Tidak ada foto</span>;
  return <button className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline" onClick={(e) => { e.stopPropagation(); onOpen(info); }}><Img className="h-4 w-4" />Lihat Foto</button>;
}
export default function PhotoViewerModal({ info, onClose }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [info?.url]);
  useEffect(() => {
    if (!info) return undefined;
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [info, onClose]);
  return (
    <AnimatePresence>
      {info && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#082B59]/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="glass-card max-h-[90vh] w-full max-w-3xl overflow-auto p-4" initial={{ scale: .96 }} animate={{ scale: 1 }} exit={{ scale: .96 }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex justify-between gap-2">
              <a className="btn-secondary" href={info.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />Buka di tab baru</a>
              <button className="btn-secondary" onClick={onClose} aria-label="Tutup"><X className="h-4 w-4" />Tutup</button>
            </div>
            {failed ? <p className="rounded-xl bg-amber-50 p-6 text-sm text-amber-800">Foto tidak dapat dimuat. File mungkin memerlukan izin akses{info.isDrive ? ' Google Drive' : ''}. Gunakan tombol "Buka di tab baru".</p>
              : <img key={info.thumb} src={info.thumb} alt="Bukti foto kunjungan" loading="lazy" referrerPolicy="no-referrer" className="mx-auto max-h-[70vh] rounded-xl" onError={() => setFailed(true)} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
