import * as XLSX from 'xlsx';
import { COLUMNS, mapsUrl, norm } from './dataUtils.js';
import { visitDate, formatDate, formatTimestamp, todayStamp } from './dateUtils.js';

// Ekspor baris kunjungan ke .xlsx (15 kolom sumber + kolom link Google Maps).
export function exportVisits(rows, name = 'Live-Response-NOP-Merchant') {
  const out = rows.map((r) => {
    const o = {};
    COLUMNS.forEach((c) => {
      if (c === 'Timestamp') o[c] = formatTimestamp(r);
      else if (c === 'Tanggal Kunjungan') o[c] = formatDate(visitDate(r)) === '-' ? norm(r[c]) : formatDate(visitDate(r));
      else o[c] = norm(r[c]);
    });
    o['Link Google Maps'] = mapsUrl(r['Latitude'], r['Longitude']) || '';
    return o;
  });
  const headers = [...COLUMNS, 'Link Google Maps'];
  const ws = XLSX.utils.json_to_sheet(out, { header: headers });
  ws['!cols'] = headers.map((h) => ({ wch: Math.min(48, Math.max(h.length + 2, ...out.slice(0, 200).map((o) => String(o[h] || '').length + 2))) }));
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Live Response');
  XLSX.writeFile(wb, `${name}-${todayStamp()}.xlsx`);
  return out.length;
}
