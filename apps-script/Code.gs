// ============================================================================
// Code.gs GABUNGAN: Form Report Kunjungan (Index.html) + API JSON untuk website React.
// - Tanpa parameter  -> menampilkan form (Index.html), seperti sebelumnya.
// - ?action=health | live-response | dashboard -> mengembalikan JSON untuk website.
// Pakai SATU proyek Apps Script (yang terikat ke spreadsheet) dan satu deployment Web App.
// ============================================================================
const SPREADSHEET_ID = '1IMgXoNGzRAWc3RbS2RvtV5HeDEbB-aEubS6CRS_E2jc';
const TZ = 'Asia/Jakarta';

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  if (!action) {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Report Kunjungan Merchant NOP')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
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

// ----------------------------- API untuk website -----------------------------
function json(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function nowIso_() { return new Date().toISOString(); }
function norm_(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); }

// Nama sheet dicocokkan tanpa membedakan huruf besar/kecil ("database1" = "Database1").
function getSheet_(name) {
  const sheets = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets();
  const want = name.toLowerCase();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim().toLowerCase() === want) return sheets[i];
  }
  throw new Error('Sheet "' + name + '" tidak ditemukan.');
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

// Database1: kolom A = PN, kolom B = Petugas IT, kolom D = Branch Office. Baris 1 = header.
function readDatabase_() {
  const values = getSheet_('Database1').getDataRange().getValues();
  return values.slice(1)
    .map(function (r) { return { pn: norm_(r[0]), petugas: norm_(r[1]), branch: norm_(r[3]) }; })
    .filter(function (d) { return d.pn || d.petugas || d.branch; });
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

// Jalankan SEKALI dari editor (pilih testSetup -> Run) untuk memberi izin & memastikan sheet terbaca.
function testSetup() {
  const h = health_();
  Logger.log('Status: ' + h.status + ' | ' + JSON.stringify(h.checks));
  Logger.log('Baris FormResponse: ' + readResponses_().length);
  Logger.log('Baris Database1: ' + readDatabase_().length);
}

// ------------------------------ Fungsi form (asli) ------------------------------
// Mengambil data Petugas IT untuk dropdown PN saja
function getDatabaseData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet1 = ss.getSheetByName('database1');
  var data1 = [];

  if (sheet1) {
    var lastRow1 = sheet1.getLastRow();
    if (lastRow1 > 1) {
      var rows1 = sheet1.getRange(2, 1, lastRow1 - 1, 2).getValues();
      for (var i = 0; i < rows1.length; i++) {
        if (rows1[i][0]) {
          data1.push({ pn: rows1[i][0], nama: rows1[i][1] });
        }
      }
    }
  }

  return { petugas: data1 };
}

// Fungsi Pencarian (Autocomplete) Merchant
function searchMerchant(query) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet2 = ss.getSheetByName('database2');
  var results = [];

  if (!sheet2) return results;

  var lastRow2 = sheet2.getLastRow();
  if (lastRow2 > 1) {
    var rows2 = sheet2.getRange(2, 1, lastRow2 - 1, 2).getValues();
    var q = query.toLowerCase();

    for (var j = 0; j < rows2.length; j++) {
      var tid = String(rows2[j][0]);
      var nama = String(rows2[j][1]);

      if (tid.toLowerCase().indexOf(q) !== -1 || nama.toLowerCase().indexOf(q) !== -1) {
        results.push({ tid: tid, nama: nama });
        if (results.length >= 15) break;
      }
    }
  }

  return results;
}

// Menyimpan data laporan, foto, dan koordinat GPS ke Spreadsheet
function saveData(formData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('FormResponse');

  var timestamp = new Date();
  var photoUrl = "";

  if (formData.photoData) {
    var folderName = "BuktiFotoSurveyEDC";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    var base64Data = formData.photoData.replace(/^data:image\/png;base64,/, "");
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), MimeType.PNG, "Foto_" + formData.tid + "_" + new Date().getTime() + ".png");
    var file = folder.createFile(blob);
    photoUrl = file.getUrl();
  }

  sheet.appendRow([
    timestamp,
    formData.tanggalKunjungan,
    formData.branch,
    formData.pn,
    formData.namaPetugas,
    formData.tid,
    formData.namaMerchant,
    formData.kondisiFisik,
    formData.hasilTransaksi,
    formData.problemNop,
    formData.tindakLanjut,
    formData.keterangan,
    formData.latitude || "",   // Kolom Latitude
    formData.longitude || "",  // Kolom Longitude
    photoUrl                   // Link Bukti Foto
  ]);

  return "Berhasil menyimpan data!";
}
