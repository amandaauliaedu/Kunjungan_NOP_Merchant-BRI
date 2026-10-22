import { useMemo, useState, useEffect } from 'react';
import { Search, ArrowUpDown, FileSpreadsheet } from 'lucide-react';
import { norm, tsOf, badgeTone, formatDate, visitDate, formatTimestamp } from '../utils/dataUtils.js';
import { exportVisits } from '../utils/exportExcel.js';
import MapLink from './MapLink.jsx';
import Pagination from './Pagination.jsx';
import { PhotoButton } from './PhotoViewerModal.jsx';
import { EmptyState } from './States.jsx';
const TONES = { green: 'bg-green-100 text-green-700', amber: 'bg-amber-100 text-amber-700', red: 'bg-red-100 text-red-700', blue: 'bg-brand-light text-brand', gray: 'bg-slate-100 text-slate-600' };
const SEARCH_KEYS = ['Nama Merchant', 'TID Merchant', 'Branch Office', 'PN Petugas IT', 'Nama Pet. IT'];
const BADGE = ['Kondisi Fisik Mesin EDC', 'Hasil Transaksi'];
const LONG = ['Problem NOP', 'Tindak Lanjut NOP'];

export default function DataTable({ rows, columns, onDetail, onPhoto, exportName }) {
  const [q, setQ] = useState(''); const [dir, setDir] = useState('desc'); const [size, setSize] = useState(10); const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const f = s ? rows.filter((r) => SEARCH_KEYS.some((k) => norm(r[k]).toLowerCase().includes(s))) : rows;
    const m = dir === 'desc' ? -1 : 1;
    return [...f].sort((a, b) => m * ((visitDate(a).localeCompare(visitDate(b))) || (tsOf(a) - tsOf(b))));
  }, [rows, q, dir]);
  useEffect(() => setPage(1), [q, size, rows]);
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const view = filtered.slice((page - 1) * size, page * size);
  const cell = (r, c) => {
    if (c === 'Lokasi Maps') return <MapLink lat={r['Latitude']} lng={r['Longitude']} />;
    if (c === 'Bukti Foto') return <PhotoButton value={r[c]} onOpen={onPhoto} />;
    if (c === 'Tanggal Kunjungan') return visitDate(r) ? formatDate(visitDate(r)) : norm(r[c]) || '-';
    if (c === 'Timestamp') return formatTimestamp(r);
    const v = norm(r[c]);
    if (BADGE.includes(c)) return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TONES[badgeTone(v)]}`}>{v || 'Belum Diisi'}</span>;
    if (LONG.includes(c)) return <span title={v} className="block max-w-[220px] truncate">{v || '-'}</span>;
    return v || '-';
  };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 p-4">
        <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-brand" /><input className="input pl-9" placeholder="Cari merchant, TID, branch, PN, atau nama petugas" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari kunjungan" /></div>
        <button className="btn-secondary" onClick={() => setDir(dir === 'desc' ? 'asc' : 'desc')}><ArrowUpDown className="h-4 w-4" />{dir === 'desc' ? 'Terbaru' : 'Terlama'}</button>
        <select className="input !w-auto" value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label="Jumlah baris">{[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} baris</option>)}</select>
        {exportName && <button className="btn-primary" disabled={!filtered.length} onClick={() => exportVisits(filtered, exportName)} title={`Unduh ${filtered.length} baris sesuai pencarian/filter saat ini`}><FileSpreadsheet className="h-4 w-4" />Unduh Excel</button>}
      </div>
      {filtered.length === 0 ? <EmptyState /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-brand-dark text-white">{columns.map((c) => <th key={c} className="whitespace-nowrap px-3 py-3 font-mono text-[11px] font-bold uppercase tracking-wider">{c}</th>)}<th className="px-3 py-3 font-mono text-[11px] uppercase tracking-wider">Detail</th></tr></thead>
            <tbody>{view.map((r, i) => (
              <tr key={`${tsOf(r)}-${i}-${page}`} className="cursor-pointer border-b border-brand/10 hover:bg-brand-light/60" onClick={() => onDetail(r)}>
                {columns.map((c) => <td key={c} className="whitespace-nowrap px-3 py-2.5">{cell(r, c)}</td>)}
                <td className="px-3 py-2.5"><button className="font-medium text-brand hover:underline" onClick={(e) => { e.stopPropagation(); onDetail(r); }}>Detail</button></td>
              </tr>))}</tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={pages} onChange={setPage} from={(page - 1) * size + 1} to={Math.min(page * size, filtered.length)} total={filtered.length} />
    </div>
  );
}
