import { useMemo, useRef, useState, useCallback } from 'react';
import { RefreshCw, FileSpreadsheet, Activity, Building2, Users, ShieldCheck } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import StatCard from '../components/StatCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import ListDropdown from '../components/ListDropdown.jsx';
import ReportTable from '../components/ReportTable.jsx';
import { LoadingState, ErrorState } from '../components/States.jsx';
import { useData } from '../hooks/useData.jsx';
import { useVisitFilter } from '../hooks/useVisitFilter.js';
import { COLUMNS, norm } from '../utils/dataUtils.js';
import { exportVisits } from '../utils/exportExcel.js';
import { formatSync, formatTime } from '../utils/dateUtils.js';

export default function LiveResponse() {
  const { data, database, status, updatedAt, loading, error, reload } = useData();
  const flt = useVisitFilter(data, database);
  const { rows } = flt;
  const [panel, setPanel] = useState(null);
  const [exportRows, setExportRows] = useState(null);
  const tableRef = useRef(null);
  const onFiltered = useCallback((r) => setExportRows(r), []);
  const toExport = exportRows || rows;

  // Ringkasan sesuai data yang masuk (hasil filter): BO yang mengisi & petugas IT yang mengisi, beserta jumlah isiannya
  const branches = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => { const k = norm(r['Branch Office']); if (k) m.set(k, (m.get(k) || 0) + 1); });
    return [...m.entries()].map(([name, n]) => ({ name, n })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, 'id'));
  }, [rows]);
  const officers = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => {
      const pn = norm(r['PN Petugas IT']); const nama = norm(r['Nama Pet. IT']); const k = pn || nama;
      if (!k) return;
      const cur = m.get(k) || { pn, nama, n: 0 };
      cur.n += 1; if (!cur.nama && nama) cur.nama = nama; m.set(k, cur);
    });
    return [...m.values()].sort((a, b) => b.n - a.n || (a.nama || a.pn).localeCompare(b.nama || b.pn, 'id'));
  }, [rows]);

  const goTable = () => tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  const pick = (patch) => { flt.setFilter(patch); setPanel(null); setTimeout(goTable, 80); };
  const toggle = (k) => setPanel(panel === k ? null : k);
  const first = loading && !data.length;
  const isLive = status === 'ACTIVE';

  const extra = (<>
    <button className="btn-secondary" onClick={reload} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</button>
    <span className={`font-mono text-xs font-bold ${isLive ? 'text-green-600' : status === 'DEGRADED' ? 'text-amber-600' : 'text-red-600'}`}>● {isLive ? 'LIVE' : status === 'DEGRADED' ? 'DEGRADED' : 'OFFLINE'} • {formatTime(updatedAt)}</span>
  </>);

  return (<>
    <FilterPanel draft={flt.draft} setDraft={flt.setDraft} options={flt.options} error={flt.err} onApply={flt.apply} onReset={flt.reset} chips={flt.chips} onRemoveChip={(k) => flt.removeChip(k)} extra={extra} />

    <div>
      <h1 className="text-3xl font-bold">Live Response</h1>
      <p className="text-slate-500">Data kunjungan merchant yang tercatat pada sistem · {data.length.toLocaleString('id-ID')} baris terbaca dari sheet.</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Live Response" value={rows.length} desc="klik untuk laporan" icon={Activity} loading={first} onClick={goTable} delay={0} />
      <StatCard label="Jumlah Branch Office" value={branches.length} desc="klik untuk daftar" icon={Building2} loading={first} onClick={() => toggle('branch')} delay={.06} />
      <StatCard label="Jumlah Petugas IT" value={officers.length} desc="klik untuk daftar" icon={Users} loading={first} onClick={() => toggle('petugas')} delay={.12} />
      <StatCard label="Status Sistem" value={status} tone="status" desc={`Sinkron: ${formatSync(updatedAt)}`} icon={ShieldCheck} delay={.18} />
    </div>

    {panel === 'branch' && <ListDropdown title={`Branch Office yang mengisi (${branches.length})`} hint="Klik salah satu untuk menampilkan isiannya pada tabel." searchPlaceholder="Cari Branch Office" onClose={() => setPanel(null)}
      items={branches.map((b) => ({ key: b.name, label: b.name, count: b.n, onPick: () => pick({ branch: b.name }) }))} />}
    {panel === 'petugas' && <ListDropdown title={`Petugas IT yang mengisi (${officers.length})`} hint="Klik salah satu untuk menampilkan isiannya pada tabel." searchPlaceholder="Cari PN atau nama petugas" onClose={() => setPanel(null)}
      items={officers.map((o) => ({ key: o.pn || o.nama, label: `${o.pn ? `${o.pn} - ` : ''}${o.nama || '-'}`, count: o.n, onPick: o.pn ? () => pick({ petugas: o.pn }) : undefined }))} />}

    <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-5">
      <div>
        <h2 className="text-lg font-semibold">Download Excel</h2>
        <p className="text-sm text-slate-500">Unduh {toExport.length.toLocaleString('id-ID')} baris sesuai filter &amp; pencarian saat ini dalam format .xlsx</p>
      </div>
      <button className="btn-primary !px-5 !py-3" disabled={!toExport.length} onClick={() => exportVisits(toExport)}><FileSpreadsheet className="h-4 w-4" />Unduh Excel</button>
    </GlassCard>

    <div ref={tableRef}>
      <GlassCard>
        {first ? <LoadingState /> : error && !data.length ? <ErrorState message={error} onRetry={reload} /> : <ReportTable rows={rows} columns={COLUMNS} onFilteredChange={onFiltered} />}
      </GlassCard>
    </div>
  </>);
}
