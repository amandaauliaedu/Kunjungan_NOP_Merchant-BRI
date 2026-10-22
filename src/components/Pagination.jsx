import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function Pagination({ page, pages, onChange, from, to, total }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm text-slate-600">
      <span>Menampilkan {total ? `${from}–${to}` : 0} dari {total} kunjungan</span>
      <div className="flex items-center gap-2">
        <button className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Sebelumnya"><ChevronLeft className="h-4 w-4" /></button>
        <span className="font-mono text-xs">{page} / {pages}</span>
        <button className="btn-secondary" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Berikutnya"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
