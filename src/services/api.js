// Konfigurasi: VITE_GOOGLE_SCRIPT_URL di file .env (restart `npm run dev` setelah mengubahnya).
const RAW = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
export const API_URL = String(RAW || '').trim().replace(/^["']|["']$/g, '');
const URL_OK = /^https:\/\/script\.google\.com\/(a\/macros\/[\w.-]+\/|a\/[\w.-]+\/)?macros\/s\/[\w-]+\/exec$/;
const TIMEOUT_MS = 90000;

export class ApiError extends Error {
  constructor(message, { hints = [], testUrl = '' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.hints = hints;
    this.testUrl = testUrl;
  }
}

const testUrlFor = (action) => (API_URL ? `${API_URL}?action=${action}` : '');

function validateConfig() {
  if (!API_URL || API_URL.includes('YOUR_DEPLOYMENT_ID')) {
    throw new ApiError('VITE_GOOGLE_SCRIPT_URL belum dikonfigurasi.', {
      hints: ['Buat file .env di folder proyek (sejajar package.json).', 'Isi: VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/ID_ANDA/exec', 'Hentikan lalu jalankan ulang npm run dev.']
    });
  }
  if (/\/dev(\?|$)/.test(API_URL)) {
    throw new ApiError('URL Apps Script berakhiran /dev (URL uji coba).', { hints: ['Pakai URL Web App dari Deploy → Manage deployments yang berakhiran /exec.'] });
  }
  if (!URL_OK.test(API_URL)) {
    throw new ApiError('Format URL Apps Script tidak valid.', {
      hints: ['Format yang benar: https://script.google.com/macros/s/ID_DEPLOYMENT/exec', 'Pastikan tidak ada spasi, tanda kutip, atau tambahan ?action=... di .env.'],
      testUrl: API_URL
    });
  }
}

async function call(action) {
  validateConfig();
  const testUrl = testUrlFor(action);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(testUrl, { method: 'GET', redirect: 'follow', credentials: 'omit', cache: 'no-store', signal: ctrl.signal });
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') {
      throw new ApiError('Backend terlalu lama merespons (timeout).', { hints: ['Data mungkin besar; coba lagi beberapa saat.', 'Buka link uji di bawah untuk melihat apakah backend merespons.'], testUrl });
    }
    throw new ApiError('Backend tidak dapat dijangkau.', {
      hints: [
        'Paling sering: akses deployment bukan "Anyone" (Deploy → Manage deployments → Edit → Who has access: Anyone). Peramban diarahkan ke halaman login Google sehingga diblokir CORS.',
        'URL deployment salah atau deployment sudah dihapus/diarsipkan.',
        'Setelah mengubah Code.gs, buat "New version" pada deployment (URL tetap sama jika memakai Manage deployments → Edit).',
        'Koneksi internet atau ekstensi pemblokir (adblock/VPN) menghalangi script.google.com.',
        'Klik link uji di bawah: bila tab baru menampilkan JSON, backend sehat; bila halaman login/error, perbaiki pengaturan deployment.'
      ],
      testUrl
    });
  }
  clearTimeout(timer);
  const text = await res.text();
  if (!res.ok) throw new ApiError(`Backend merespons HTTP ${res.status}.`, { hints: ['Periksa deployment Apps Script dan izin akses.'], testUrl });
  if (/^\s*</.test(text)) {
    throw new ApiError('Backend mengembalikan halaman HTML, bukan JSON.', {
      hints: ['Biasanya halaman login atau halaman otorisasi Google: set Who has access = Anyone dan jalankan fungsi testSetup di editor untuk memberi izin.', 'Atau terjadi error di script — lihat Executions di Apps Script.'],
      testUrl
    });
  }
  let json;
  try { json = JSON.parse(text); } catch { throw new ApiError('Respons backend bukan JSON valid.', { testUrl }); }
  if (!json.success) throw new ApiError(json.message || 'Permintaan gagal.', { hints: ['Pesan ini berasal dari backend (Code.gs).'], testUrl });
  return json;
}

export const getLiveResponse = () => call('live-response');
export const getDashboardData = () => call('dashboard');
export const getSystemHealth = () => call('health');
