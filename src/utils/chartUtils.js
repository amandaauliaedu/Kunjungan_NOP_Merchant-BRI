import { norm, visitDate, fillMissingDates } from './dateUtils.js';
export const label = (v) => norm(v) || 'Belum Diisi';

export function count(rows, key) {
  const m = {};
  rows.forEach((r) => { const k = label(r[key]); m[k] = (m[k] || 0) + 1; });
  return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function countByDate(rows) {
  const m = {};
  rows.forEach((r) => { const d = visitDate(r); if (d) m[d] = (m[d] || 0) + 1; });
  return fillMissingDates(Object.keys(m).sort().map((d) => ({ name: d, value: m[d] })));
}

export const BLUES = ['#0857C3', '#3679D4', '#75A5EB', '#B8D2F5', '#063B82', '#5B8FDB', '#9DBCEF', '#082B59'];
export const PIE_COLORS = ['#0857C3', '#3679D4', '#75A5EB', '#B8D2F5', '#063B82', '#F59E0B', '#16A34A', '#DC2626'];
