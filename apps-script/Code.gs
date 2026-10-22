const SPREADSHEET_ID = '1IMgXoNGzRAWc3RbS2RvtV5HeDEbB-aEubS6CRS_E2jc';
const TZ = 'Asia/Jakarta';
// Database1: kolom B (index 1) = Petugas IT, kolom D (index 3) = Branch Office. Baris 1 = header.

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'dashboard';
  try {
    if (action === 'health') return json(health_());
    if (action === 'live-response') return json({ success: true, updatedAt: nowIso_(), data: readResponses_(), message: 'Data berhasil dimuat' });
    if (action === 'dashboard') {
      const h = health_();
      return json({ success: true, status: h.status, checks: h.checks, updatedAt: nowIso_(), data: readResponses_(), database: readDatabase_(), message: 'Data berhasil dimuat' });
    }
    return json({ success: false, message: 'Action tidak dikenal: ' + action });
  } catch (err) {
    return json({ success: false, message: String(err && err.message ? err.message : err) });
  }
}

function json(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function nowIso_() { return new Date().toISOString(); }
function norm_(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); }

function getSheet_(name) {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
  if (!sh) throw new Error('Sheet "' + name + '" tidak ditemukan.');
  return sh;
}

function cell_(v, header) {
  if (v instanceof Date) {
    return header === 'Tanggal Kunjungan' ? Utilities.formatDate(v, TZ, 'yyyy-MM-dd') : Utilities.formatDate(v, TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
  }
  return v == null ? '' : v;
}

function readResponses_() {
  const values = getSheet_('FormResponse').getDataRange().getValues();
  if (values.length < 1) return [];
  const headers = values[0].map(norm_);
  return values.slice(1)
    .filter(function (row) { return row.some(function (c) { return norm_(c) !== ''; }); })
    .map(function (row) {
      const o = {};
      headers.forEach(function (h, i) { if (h) o[h] = cell_(row[i], h); });
      return o;
    });
}

function readDatabase_() {
  const values = getSheet_('Database1').getDataRange().getValues();
  return values.slice(1).map(function (r) { return { petugas: norm_(r[1]), branch: norm_(r[3]) }; })
    .filter(function (d) { return d.petugas || d.branch; });
}

function health_() {
  const checks = {};
  ['FormResponse', 'Database1'].forEach(function (n) {
    try { getSheet_(n).getLastRow(); checks[n] = 'OK'; } catch (e) { checks[n] = String(e.message || e); }
  });
  const ok = Object.keys(checks).filter(function (k) { return checks[k] === 'OK'; }).length;
  const status = ok === 2 ? 'ACTIVE' : (checks.FormResponse === 'OK' ? 'DEGRADED' : 'CONNECTION ERROR');
  return { success: ok > 0, status: status, updatedAt: nowIso_(), checks: checks, message: status };
}

// Jalankan SEKALI dari editor Apps Script (pilih fungsi testSetup lalu Run) untuk memberi izin
// akses spreadsheet dan memastikan sheet terbaca. Hasil ada di menu Execution log.
function testSetup() {
  const h = health_();
  Logger.log('Status: ' + h.status + ' | ' + JSON.stringify(h.checks));
  Logger.log('Baris FormResponse: ' + readResponses_().length);
  Logger.log('Baris Database1: ' + readDatabase_().length);
}
