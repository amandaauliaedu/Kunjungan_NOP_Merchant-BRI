import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Radio, LayoutDashboard, Menu, X, Wifi, WifiOff, FileSpreadsheet, RefreshCw } from 'lucide-react';
import BrandMark from './BrandMark.jsx';
import { useData } from '../hooks/useData.jsx';
import { exportVisits } from '../utils/exportExcel.js';
import { formatSync } from '../utils/dateUtils.js';

const NAV = [{ to: '/', label: 'Home', icon: Home }, { to: '/live-response', label: 'Live Response', icon: Radio }, { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }];
const LIVE = {
  ACTIVE: { text: 'LIVE', cls: 'text-green-600', icon: Wifi },
  DEGRADED: { text: 'DEGRADED', cls: 'text-amber-600', icon: Wifi },
  'CONNECTION ERROR': { text: 'OFFLINE', cls: 'text-red-600', icon: WifiOff }
};
const link = ({ isActive }) => `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-brand text-white shadow-md shadow-brand/30' : 'text-slate-500 hover:bg-brand-light hover:text-brand'}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { status, updatedAt, data, loading, reload } = useData();
  const live = LIVE[status] || LIVE['CONNECTION ERROR']; const LiveIcon = live.icon;
  return (
    <header className="sticky top-0 z-40 border-b border-brand/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <BrandMark className="h-11 w-11 shrink-0" />
          <div className="leading-tight"><p className="font-semibold">Kunjungan NOP Merchant</p><p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:block">BRI Region 12 Surabaya · Monitoring NOP</p></div>
        </NavLink>
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Navigasi utama">{NAV.map(({ to, label, icon: I }) => <NavLink key={to} to={to} end={to === '/'} className={link}><I className="h-4 w-4" />{label}</NavLink>)}</nav>
        <div className="ml-auto flex items-center gap-2">
          <span className={`flex items-center gap-1.5 font-mono text-xs font-bold ${live.cls}`} title={`Status: ${status} · Sinkron: ${formatSync(updatedAt)}`}><LiveIcon className="h-4 w-4" />{live.text}</span>
          <button className="btn-secondary !min-h-[40px] !px-3" onClick={reload} disabled={loading} aria-label="Refresh data" title="Refresh data"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
          <button className="btn-secondary !min-h-[40px] !px-3" disabled={!data.length} onClick={() => exportVisits(data)} aria-label="Unduh semua data Excel" title="Unduh semua data (Excel)"><FileSpreadsheet className="h-4 w-4" /></button>
          <button className="btn-secondary !px-3 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Tutup menu' : 'Buka menu'}>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </div>
      {open && <nav className="space-y-1 border-t border-brand/10 bg-white/95 px-4 py-3 md:hidden" aria-label="Navigasi mobile">{NAV.map(({ to, label, icon: I }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={link}><I className="h-4 w-4" />{label}</NavLink>)}</nav>}
    </header>
  );
}
