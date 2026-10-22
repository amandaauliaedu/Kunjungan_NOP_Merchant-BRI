import * as XLSX from 'xlsx';
import { COLUMNS, mapsUrl } from './dataUtils.js';
export function exportExcel(rows, name = 'live-response') {
  const out = rows.map((r) => {
    const o = {};
    COLUMNS.forEach((c) => { o[c] = r[c] ?? ''; });
    o['Link Google Maps'] = mapsUrl(r['Latitude'], r['Longitude']) || '';
    return o;
  });
  const heads = [...COLUMNS, 'Link Google Maps'];
  const ws = XLSX.utils.json_to_sheet(out, { header: heads });
  ws['!cols'] = heads.map((c) => ({ wch: Math.min(40, Math.max(14, c.length + 2)) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Live Response');
  XLSX.writeFile(wb, `${name}-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
