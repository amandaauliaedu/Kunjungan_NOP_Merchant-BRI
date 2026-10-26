import { format, parseISO, isValid } from 'date-fns';

export const norm = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

// Tanggal kunjungan -> 'yyyy-MM-dd' (mendukung ISO dan dd/MM/yyyy). Tidak memakai new Date() pada string ambigu.
export function visitDate(r) {
  const s = norm(r['Tanggal Kunjungan']);
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return '';
}

export const formatDate = (iso) => {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

// Timestamp pengiriman formulir -> epoch ms (ISO dari backend, atau dd/MM/yyyy HH:mm:ss)
export function tsOf(r) {
  const s = norm(r['Timestamp']);
  if (!s) return 0;
  let t = Date.parse(s);
  if (!Number.isNaN(t)) return t;
  const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    t = Date.parse(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T${(m[4] || '00').padStart(2, '0')}:${m[5] || '00'}:${m[6] || '00'}+07:00`);
    return Number.isNaN(t) ? 0 : t;
  }
  return 0;
}

export function formatTimestamp(r) {
  const t = tsOf(r);
  return t ? new Date(t).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : norm(r['Timestamp']) || '-';
}

export const formatSync = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
};

export const todayStamp = () => format(new Date(), 'yyyy-MM-dd');

// Isi tanggal tanpa kunjungan dengan nol (hanya jika rentang <= 62 hari agar grafik tetap terbaca)
export function fillMissingDates(points) {
  if (points.length < 2) return points;
  const first = parseISO(points[0].name), last = parseISO(points[points.length - 1].name);
  if (!isValid(first) || !isValid(last)) return points;
  const days = Math.round((last - first) / 86400000);
  if (days > 62) return points;
  const map = Object.fromEntries(points.map((p) => [p.name, p.value]));
  const out = [];
  for (let i = 0; i <= days; i++) {
    const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i);
    const k = format(d, 'yyyy-MM-dd');
    out.push({ name: k, value: map[k] || 0 });
  }
  return out;
}

export const formatTime = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
};
