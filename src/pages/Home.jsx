import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Building2, Users, ShieldCheck, ArrowUpRight, Download, Radio, LayoutDashboard, CircleDot } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import StatCard from '../components/StatCard.jsx';
import BrandMark from '../components/BrandMark.jsx';
import { LoadingState, ErrorState, EmptyState } from '../components/States.jsx';
import { useData } from '../hooks/useData.jsx';
import { uniq, tsOf, norm, formatDate, visitDate } from '../utils/dataUtils.js';
import { exportVisits } from '../utils/exportExcel.js';
import { formatSync } from '../utils/dateUtils.js';

export default function Home() {
  const { data, database, status, updatedAt, loading, error, reload } = useData();
  const masterBranch = uniq(database.map((d) => d.branch));
  const masterPetugas = uniq(database.map((d) => d.petugas));
  const visitedBranch = uniq(data.map((r) => r['Branch Office'])).length;
  const activeOfficers = uniq(data.map((r) => r['PN Petugas IT'])).length;
  const latest = [...data].sort((a, b) => (visitDate(b).localeCompare(visitDate(a))) || (tsOf(b) - tsOf(a))).slice(0, 8);
  const first = loading && !data.length;
  return (<>
    <section className="grid items-center gap-8 py-4 md:grid-cols-[1.2fr_1fr] md:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
        <p className="eyebrow flex items-center gap-2"><CircleDot className="h-3.5 w-3.5" />Operation, Service, and E-Channel (OSE)</p>
        <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-brand-navy md:text-7xl">BRI REGION 12<br /><span className="text-brand">SURABAYA</span></h1>
        <div className="mt-4 h-0.5 w-52 bg-brand" />
        <p className="mt-6 max-w-lg text-lg text-slate-500">Monitoring Kunjungan dan Penanganan Problem NOP Merchant oleh petugas IT BRI Region 12 Surabaya.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/live-response" className="btn-primary !px-5 !py-3">Lihat Live Response<ArrowUpRight className="h-4 w-4" /></Link>
          <button className="btn-secondary !px-5 !py-3" disabled={!data.length} onClick={() => exportVisits(data)}><Download className="h-4 w-4" />Unduh Data Excel</button>
          <Link to="/dashboard" className="btn-secondary !px-5 !py-3">Buka Dashboard</Link>
        </div>
      </motion.div>
      <motion.div className="relative hidden justify-center md:flex" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6, delay: .1 }} aria-hidden="true">
        <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative drop-shadow-[0_30px_50px_rgba(8,87,195,.35)]"><BrandMark className="h-72 w-72" /></motion.div>
      </motion.div>
    </section>

    {error && <GlassCard><ErrorState message={error} onRetry={reload} /></GlassCard>}

    <section>
      <p className="eyebrow">Ringkasan Cepat</p>
      <h2 className="mb-4 mt-1 text-2xl font-bold">Status Monitoring Terkini</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Live Response" value={data.length} icon={Activity} loading={first} delay={0} />
        <StatCard label="Jumlah Branch Office" value={masterBranch.length} suffix={`/ ${visitedBranch} dikunjungi`} icon={Building2} loading={first} delay={.07} />
        <StatCard label="Jumlah Petugas IT" value={masterPetugas.length} suffix={`/ ${activeOfficers} aktif`} icon={Users} loading={first} delay={.14} />
        <StatCard label="Status Sistem" value={status} tone="status" desc={`Sinkron: ${formatSync(updatedAt)}`} icon={ShieldCheck} delay={.21} />
      </div>
    </section>

    <div className="grid gap-4 md:grid-cols-2">
      {[['/live-response', 'Live Response', 'Telusuri semua kunjungan, lokasi, dan bukti foto', Radio], ['/dashboard', 'Dashboard', 'Analisis dengan filter dan grafik interaktif', LayoutDashboard]].map(([to, t, d, I]) => (
        <Link key={to} to={to}><GlassCard whileHover={{ y: -3 }} className="flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-light text-brand"><I className="h-5 w-5" /></span><div className="flex-1"><p className="font-semibold">{t}</p><p className="text-sm text-slate-500">{d}</p></div><ArrowUpRight className="text-brand" /></GlassCard></Link>))}
    </div>

    <GlassCard>
      <div className="flex items-center justify-between p-4"><h3 className="font-semibold">Kunjungan Terbaru</h3><Link to="/live-response" className="text-sm font-medium text-brand hover:underline">Lihat Semua</Link></div>
      {first ? <LoadingState /> : !latest.length ? <EmptyState text="Belum ada kunjungan tercatat." /> : (
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-brand-dark text-white">{['Tanggal', 'Merchant', 'Branch Office', 'Petugas IT', 'Hasil Transaksi', 'Problem NOP'].map((h) => <th key={h} className="whitespace-nowrap px-3 py-3 font-mono text-[11px] uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>{latest.map((r, i) => <tr key={i} className="border-b border-brand/10"><td className="whitespace-nowrap px-3 py-2">{formatDate(visitDate(r))}</td><td className="px-3 py-2">{norm(r['Nama Merchant']) || '-'}</td><td className="px-3 py-2">{norm(r['Branch Office']) || '-'}</td><td className="px-3 py-2">{norm(r['Nama Pet. IT']) || '-'}</td><td className="px-3 py-2">{norm(r['Hasil Transaksi']) || '-'}</td><td className="max-w-[240px] truncate px-3 py-2" title={norm(r['Problem NOP'])}>{norm(r['Problem NOP']) || '-'}</td></tr>)}</tbody></table></div>)}
    </GlassCard>
  </>);
}
