import { norm } from './dateUtils.js';
export { norm, visitDate, formatDate, tsOf, formatTimestamp } from './dateUtils.js';
export { label, count, countByDate } from './chartUtils.js';

export const COLUMNS = ['Timestamp', 'Tanggal Kunjungan', 'Branch Office', 'PN Petugas IT', 'Nama Pet. IT', 'TID Merchant', 'Nama Merchant', 'Kondisi Fisik Mesin EDC', 'Hasil Transaksi', 'Problem NOP', 'Tindak Lanjut NOP', 'Keterangan (No Tiket)', 'Longitude', 'Latitude', 'Bukti Foto'];

export const uniq = (arr) => [...new Set(arr.map(norm).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id'));

export function mapsUrl(lat, lng) {
  const la = norm(lat).replace(',', '.'), lo = norm(lng).replace(',', '.');
  if (!la || !lo) return null;
  const a = Number(la), b = Number(lo);
  if (Number.isNaN(a) || Number.isNaN(b) || a < -90 || a > 90 || b < -180 || b > 180) return null;
  return `https://www.google.com/maps?q=${a},${b}`;
}

export function driveInfo(url) {
  const u = norm(url);
  if (!/^https?:\/\//i.test(u)) return null;
  const m = u.match(/\/d\/([\w-]+)/) || u.match(/[?&]id=([\w-]+)/);
  const isDrive = /drive\.google\.com/.test(u);
  return { url: u, isDrive, thumb: isDrive && m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200` : u };
}

export function badgeTone(v) {
  const s = norm(v).toLowerCase();
  if (!s) return 'gray';
  if (/tidak (berhasil|sukses|bisa|normal)|gagal|rusak|bermasalah|error|mati|failed/.test(s)) return 'red';
  if (/proses|tindak lanjut|pending|menunggu|eskalasi|tiket/.test(s)) return 'amber';
  if (/berhasil|sukses|normal|baik|\bok\b|success/.test(s)) return 'green';
  return 'blue';
}
