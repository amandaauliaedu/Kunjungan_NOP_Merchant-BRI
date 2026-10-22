# Troubleshooting

## "Backend tidak dapat dijangkau."
Browser gagal mengambil JSON dari Apps Script. Cek berurutan:

1. **Akses deployment.** Apps Script → Deploy → Manage deployments → ikon pensil → *Who has access* = **Anyone** → Version: **New version** → Deploy.
2. **Otorisasi.** Di editor, pilih fungsi `testSetup` → Run → Review permissions → Allow. Lihat Execution log: harus tertulis `Status: ACTIVE`.
3. **URL.** Harus berakhiran `/exec`. Uji di tab baru: `URL/exec?action=health` → harus muncul JSON `"success":true`.
4. **.env.** File bernama `.env` (bukan `.env.example`), satu baris tanpa tanda kutip:
   `VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/ID/exec`
   Setelah diubah, hentikan dan jalankan ulang `npm run dev`.
5. **Nama sheet.** Tab spreadsheet harus persis `FormResponse` dan `Database1`; akun pemilik deployment harus punya akses ke spreadsheet.
6. Matikan adblock/VPN untuk script.google.com bila masih gagal.

Halaman error pada aplikasi sekarang menampilkan penyebab yang terdeteksi dan tombol **Uji URL backend**.

## "Backend mengembalikan halaman HTML"
Google mengirim halaman login/otorisasi: ulangi langkah 1 dan 2.

## "Sheet ... tidak ditemukan"
Periksa ejaan nama tab sheet (peka huruf besar/kecil, tanpa spasi tambahan).

## Perubahan Code.gs tidak berpengaruh
Deployment lama tetap menjalankan versi lama: Manage deployments → Edit → New version → Deploy.
