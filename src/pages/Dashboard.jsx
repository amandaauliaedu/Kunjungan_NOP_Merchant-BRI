import { useMemo, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { X, Activity, Building2, Users, ShieldCheck } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import ReportTable from '../components/ReportTable.jsx';
import { LoadingState, ErrorState } from '../components/States.jsx';
import { useData } from '../hooks/useData.jsx';
import { uniq, norm, visitDate, formatDate } from '../utils/dataUtils.js';
import { count, countByDate, label, PIE_COLORS } from '../utils/chartUtils.js';
import { formatSync } from '../utils/dateUtils.js';

const COLS = ['Tanggal Kunjungan', 'Branch Office', 'PN Petugas IT', 'Nama Pet. IT', 'TID Merchant', 'Nama Merchant', 'Kondisi Fisik Mesin EDC', 'Hasil Transaksi', 'Problem NOP', 'Tindak Lanjut NOP', 'Keterangan (No Tiket)', 'Lokasi Maps', 'Bukti Foto'];
const EMPTY = { from: '', to: '', branch: 'Semua', pn: 'Semua', nama: 'Semua', merchant: '' };
const CH0 = { date: '', hasil: '', tl: '', problem: '' };
const TOP = 10;

// Tick sumbu Y yang membungkus teks panjang agar makna kategori tidak terpotong
function WrapTick({ x, y, payload }) {
  const words = String(payload.value).split(' '); const lines = []; let cur = '';
  words.forEach((w) => { if ((cur + ' ' + w).trim().length > 30) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
  if (cur) lines.push(cur);
  return <text x={x} y={y} textAnchor="end" fontSize={11} fill="#334155">{lines.slice(0, 3).map((l, i) => <tspan key={i} x={x - 4} dy={i === 0 ? (lines.length > 1 ? -(lines.length - 1) * 6 + 4 : 4) : 13}>{l}</tspan>)}</text>;
}

export default function Dashboard() {
  const { data, database, checks, status, updatedAt, loading, error, reload } = useData();
  const [draft, setDraft] = useState(EMPTY); const [f, setF] = useState(EMPTY); const [ch, setCh] = useState(CH0);
  const [panel, setPanel] = useState(null); const [err, setErr] = useState(''); const [showAll, setShowAll] = useState(false);
  const tableRef = useRef(null);

  const options = useMemo(() => {
    const scoped = data.filter((r) => (draft.branch === 'Semua' || norm(r['Branch Office']) === draft.branch) && (draft.pn === 'Semua' || norm(r['PN Petugas IT']) === draft.pn));
    const scoped2 = scoped.filter((r) => draft.nama === 'Semua' || norm(r['Nama Pet. IT']) === draft.nama);
    return {
      branches: uniq([...database.map((d) => d.branch), ...data.map((r) => r['Branch Office'])]),
      pns: uniq([...database.map((d) => d.petugas), ...data.map((r) => r['PN Petugas IT'])]),
      namas: uniq(scoped.map((r) => r['Nama Pet. IT'])),
      merchants: uniq(scoped2.map((r) => r['Nama Merchant']))
    };
  }, [data, database, draft.branch, draft.pn, draft.nama]);

  const base = useMemo(() => {
    const m = f.merchant.trim().toLowerCase();
    return data.filter((r) => {
      const d = visitDate(r);
      return (!f.from || (d && d >= f.from)) && (!f.to || (d && d <= f.to))
        && (f.branch === 'Semua' || norm(r['Branch Office']) === f.branch) && (f.pn === 'Semua' || norm(r['PN Petugas IT']) === f.pn)
        && (f.nama === 'Semua' || norm(r['Nama Pet. IT']) === f.nama) && (!m || norm(r['Nama Merchant']).toLowerCase().includes(m));
    });
  }, [data, f]);
  const rows = useMemo(() => base.filter((r) => (!ch.date || visitDate(r) === ch.date) && (!ch.hasil || label(r['Hasil Transaksi']) === ch.hasil) && (!ch.tl || label(r['Tindak Lanjut NOP']) === ch.tl) && (!ch.problem || label(r['Problem NOP']) === ch.problem)), [base, ch]);

  const byDate = useMemo(() => countByDate(base), [base]);
  const byHasil = useMemo(() => count(base, 'Hasil Transaksi'), [base]);
  const byTl = useMemo(() => count(base, 'Tindak Lanjut NOP'), [base]);
  const byProb = useMemo(() => count(base, 'Problem NOP'), [base]);
  const probView = showAll ? byProb : byProb.slice(0, TOP);
  const totalTl = byTl.reduce((s, x) => s + x.value, 0);
  const masterBranch = useMemo(() => uniq(database.map((d) => d.branch)), [database]);
  const masterPetugas = useMemo(() => uniq(database.map((d) => d.petugas)), [database]);

  const apply = () => {
    if (draft.from && draft.to && draft.from > draft.to) return setErr('Tanggal mulai tidak boleh lebih besar dari tanggal akhir.');
    setErr(''); setF(draft); return undefined;
  };
  const reset = () => { setDraft(EMPTY); setF(EMPTY); setCh(CH0); setErr(''); };
  const toggle = (k, v) => setCh((c) => ({ ...c, [k]: c[k] === v ? '' : v }));
  const chips = [...Object.entries(f).filter(([, v]) => v && v !== 'Semua').map(([k, v]) => [k, k === 'from' || k === 'to' ? formatDate(v) : v, 'main']), ...Object.entries(ch).filter(([, v]) => v).map(([k, v]) => [k, k === 'date' ? formatDate(v) : v, 'chart'])];
  const removeChip = (k, t) => { if (t === 'main') { setF((p) => ({ ...p, [k]: EMPTY[k] })); setDraft((p) => ({ ...p, [k]: EMPTY[k] })); } else setCh((p) => ({ ...p, [k]: '' })); };
  const goTable = () => tableRef.current?.scrollIntoView({ behavior: 'smooth' });

  if (loading && !data.length) return <GlassCard><LoadingState /></GlassCard>;
  if (error && !data.length) return <GlassCard><ErrorState message={error} onRetry={reload} /></GlassCard>;

  const sel = (k, v) => ({ cursor: 'pointer', opacity: ch[k] && ch[k] !== v ? 0.4 : 1 });
  return (<>
    <div><p className="eyebrow">Dashboard</p><h1 className="mt-1 text-3xl font-bold">Analisis Kunjungan Merchant</h1><p className="text-slate-500">Filter berdasarkan tanggal, Branch Office, petugas IT, dan merchant.</p></div>
    <FilterPanel draft={draft} setDraft={setDraft} options={options} error={err} onApply={apply} onReset={reset} chips={chips} onRemoveChip={removeChip} />

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Live Response" value={base.length} desc="sesuai filter aktif · klik untuk laporan" icon={Activity} onClick={goTable} delay={0} />
      <StatCard label="Jumlah Branch Office" value={masterBranch.length} desc="master Database1 · klik untuk daftar" icon={Building2} onClick={() => setPanel(panel === 'branch' ? null : 'branch')} delay={.06} />
      <StatCard label="Jumlah Petugas IT" value={masterPetugas.length} desc="master Database1 · klik untuk daftar" icon={Users} onClick={() => setPanel(panel === 'petugas' ? null : 'petugas')} delay={.12} />
      <StatCard label="Status Sistem" value={status} tone="status" desc={`Sinkron: ${formatSync(updatedAt)}`} icon={ShieldCheck} onClick={() => setPanel(panel === 'status' ? null : 'status')} delay={.18} />
    </div>

    {panel && <GlassCard className="p-5"><div className="mb-3 flex justify-between"><h3 className="font-semibold">{panel === 'branch' ? `Daftar Branch Office (${masterBranch.length})` : panel === 'petugas' ? `Daftar Petugas IT (${masterPetugas.length})` : 'Detail Pemeriksaan Koneksi'}</h3><button onClick={() => setPanel(null)} aria-label="Tutup"><X className="h-4 w-4" /></button></div>
      {panel === 'status' ? <div className="space-y-1 text-sm"><p>Status: <b>{status}</b></p><p>Sinkronisasi terakhir: {formatSync(updatedAt)}</p>{checks && Object.entries(checks).map(([k, v]) => <p key={k}>Sheet {k}: <b className={v === 'OK' ? 'text-green-600' : 'text-red-600'}>{v}</b></p>)}{error && <p className="text-red-600">{error}</p>}</div>
        : <div className="flex max-h-48 flex-wrap gap-2 overflow-auto">{(panel === 'branch' ? masterBranch : masterPetugas).map((x) => <span key={x} className="rounded-full bg-white/80 px-3 py-1 text-xs">{x}</span>)}</div>}</GlassCard>}

    {Object.values(ch).some(Boolean) && <div className="flex flex-wrap items-center gap-2 text-sm"><span className="text-slate-500">Filter grafik aktif:</span>{Object.entries(ch).filter(([, v]) => v).map(([k, v]) => <span key={k} className="rounded-full bg-brand px-3 py-1 text-xs text-white">{k === 'date' ? formatDate(v) : v}</span>)}<button className="btn-secondary !min-h-[34px] !py-1" onClick={() => setCh(CH0)}>Reset Filter Grafik</button></div>}

    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Jumlah Kunjungan Merchant per Tanggal" subtitle="Klik batang untuk memfilter tanggal" empty={!byDate.length}>
        <BarChart data={byDate}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tickFormatter={formatDate} fontSize={11} /><YAxis allowDecimals={false} /><Tooltip labelFormatter={formatDate} formatter={(v) => [v, 'Kunjungan']} />
          <Bar dataKey="value" fill="#0857C3" radius={[6, 6, 0, 0]} onClick={(d) => toggle('date', d.name)}>{byDate.map((d) => <Cell key={d.name} {...sel('date', d.name)} />)}</Bar></BarChart>
      </ChartCard>
      <ChartCard title="Hasil Transaksi" subtitle="Klik batang untuk memfilter hasil transaksi" empty={!byHasil.length}>
        <BarChart data={byHasil}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={11} /><YAxis allowDecimals={false} /><Tooltip formatter={(v) => [v, 'Kunjungan']} />
          <Bar dataKey="value" fill="#3679D4" radius={[6, 6, 0, 0]} onClick={(d) => toggle('hasil', d.name)}>{byHasil.map((d) => <Cell key={d.name} {...sel('hasil', d.name)} />)}</Bar></BarChart>
      </ChartCard>
      <ChartCard title="Tindak Lanjut NOP" subtitle="Klik segmen untuk memfilter tindak lanjut" empty={!byTl.length}>
        <PieChart><Pie data={byTl} dataKey="value" nameKey="name" outerRadius={90} onClick={(d) => toggle('tl', d.name)}>{byTl.map((d, i) => <Cell key={d.name} fill={PIE_COLORS[i % PIE_COLORS.length]} {...sel('tl', d.name)} />)}</Pie>
          <Tooltip formatter={(v, n) => [`${v} (${((v / totalTl) * 100).toFixed(1)}%)`, n]} /><Legend /></PieChart>
      </ChartCard>
      <ChartCard title="Distribusi Problem NOP" subtitle={`Klik batang untuk memfilter problem · ${showAll ? 'semua' : `top ${Math.min(TOP, byProb.length)}`} dari ${byProb.length} kategori`} empty={!byProb.length} height={Math.max(280, probView.length * 46)}
        action={byProb.length > TOP && <button className="btn-secondary !min-h-[32px] !py-1 text-xs" onClick={() => setShowAll(!showAll)}>{showAll ? `Top ${TOP}` : 'Tampilkan semua'}</button>}>
        <BarChart data={probView} layout="vertical" margin={{ left: 10, right: 16 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="name" width={200} interval={0} tick={<WrapTick />} /><Tooltip formatter={(v) => [v, 'Kunjungan']} />
          <Bar dataKey="value" fill="#0857C3" radius={[0, 6, 6, 0]} onClick={(d) => toggle('problem', d.name)}>{probView.map((d) => <Cell key={d.name} {...sel('problem', d.name)} />)}</Bar></BarChart>
      </ChartCard>
    </div>

    <div ref={tableRef}><GlassCard>
      <div className="p-5 pb-0"><h2 className="text-xl font-semibold">Laporan Live Response</h2><p className="text-sm text-slate-500">Menampilkan {rows.length.toLocaleString('id-ID')} dari {data.length.toLocaleString('id-ID')} kunjungan</p></div>
      <ReportTable rows={rows} columns={COLS} exportName="Laporan-Live-Response-NOP" />
    </GlassCard></div>
  </>);
}
