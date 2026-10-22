import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportRows } from '../utils/exportExcel.js';

export default function ExportButton({ rows, name = 'live-response', label = 'Unduh Excel', iconOnly = false }) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try { await exportRows(rows, name); } catch { alert('Gagal membuat file Excel. Coba lagi.'); } finally { setBusy(false); }
  };
  const Icon = busy ? Loader2 : Download;
  return (
    <button className="btn-secondary" onClick={run} disabled={busy || !rows.length} aria-label={iconOnly ? label : undefined} title={`${label} (${rows.length} baris)`}>
      <Icon className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />{!iconOnly && label}
    </button>
  );
}
