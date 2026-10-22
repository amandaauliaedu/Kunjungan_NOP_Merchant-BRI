import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
export default function DashboardLayout() {
  const loc = useLocation();
  return (
    <div className="min-h-screen">
      <Navbar />
      <motion.main key={loc.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8"><Outlet /></motion.main>
      <footer className="mx-auto max-w-7xl px-6 pb-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Kunjungan NOP Merchant · BRI Region 12 Surabaya</footer>
    </div>
  );
}
