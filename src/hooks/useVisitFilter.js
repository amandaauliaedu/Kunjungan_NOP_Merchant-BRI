import { useMemo, useState, useCallback } from 'react';
import { uniq, norm, visitDate, formatDate, petugasOptions } from '../utils/dataUtils.js';

export const EMPTY_FILTER = { from: '', to: '', branch: 'Semua', petugas: 'Semua' };

// Filter bersama (Live Response & Dashboard): tanggal, Branch Office, dan Petugas IT (PN - Nama).
export function useVisitFilter(data, database) {
  const [draft, setDraft] = useState(EMPTY_FILTER);
  const [f, setF] = useState(EMPTY_FILTER);
  const [err, setErr] = useState('');

  const options = useMemo(() => ({
    branches: uniq([...database.map((d) => d.branch), ...data.map((r) => r['Branch Office'])]),
    petugas: petugasOptions(data, database)
  }), [data, database]);

  const rows = useMemo(() => data.filter((r) => {
    const d = visitDate(r);
    return (!f.from || (d && d >= f.from)) && (!f.to || (d && d <= f.to))
      && (f.branch === 'Semua' || norm(r['Branch Office']) === f.branch)
      && (f.petugas === 'Semua' || norm(r['PN Petugas IT']) === f.petugas);
  }), [data, f]);

  const apply = useCallback(() => {
    if (draft.from && draft.to && draft.from > draft.to) { setErr('Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'); return; }
    setErr(''); setF(draft);
  }, [draft]);
  const reset = useCallback(() => { setDraft(EMPTY_FILTER); setF(EMPTY_FILTER); setErr(''); }, []);
  // Terapkan langsung satu filter (mis. klik Branch Office / petugas dari daftar kartu)
  const setFilter = useCallback((patch) => { setDraft((p) => ({ ...p, ...patch })); setF((p) => ({ ...p, ...patch })); setErr(''); }, []);
  const removeChip = useCallback((k) => setFilter({ [k]: EMPTY_FILTER[k] }), [setFilter]);

  const labelOf = (k, v) => (k === 'from' || k === 'to' ? formatDate(v) : k === 'petugas' ? (options.petugas.find((o) => o.value === v)?.label || v) : v);
  const chips = Object.entries(f).filter(([, v]) => v && v !== 'Semua').map(([k, v]) => [k, labelOf(k, v), 'main']);

  return { draft, setDraft, f, rows, options, err, apply, reset, setFilter, removeChip, chips };
}
