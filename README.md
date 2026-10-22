# Kunjungan NOP Merchant

Monitoring kunjungan petugas IT ke merchant — BRI Region 12 Surabaya.
Halaman: Home (`/`), Live Response (`/live-response`), Dashboard (`/dashboard`).

## Jalankan
    cp .env.example .env   # isi VITE_GOOGLE_SCRIPT_URL
    npm install
    npm run dev

## Deploy backend (apps-script/Code.gs)
1. script.google.com → New project → tempel Code.gs (dan appsscript.json bila perlu).
2. Deploy → New deployment → Web app. Execute as: Me. Akses sesuai kebijakan data
   (fetch dari browser tanpa login memerlukan "Anyone"; pastikan data boleh diakses demikian).
3. Salin URL /exec ke `.env`.
4. Uji di browser: `?action=health`, `?action=live-response`, `?action=dashboard`.
Setiap perubahan Code.gs butuh deployment versi baru.

## Ekspor Excel
- Live Response: tombol "Unduh Semua (Excel)" (seluruh data) dan "Unduh Excel" di toolbar tabel
  (sesuai pencarian aktif, semua halaman). Dashboard: "Unduh Excel" mengikuti filter + filter grafik.
- Navbar & Home juga memiliki tombol unduh seluruh data.
- File berisi 15 kolom sumber + kolom "Link Google Maps".

## Pemetaan Database1
Kolom B (index 1) = Petugas IT, kolom D (index 3) = Branch Office, baris 1 = header.

## Logo BRI
Logo BRI ada di `public/assets/bri-logo.png` (ganti file ini untuk mengubah logo).
Jika file hilang, aplikasi menampilkan monogram cadangan.

Jika muncul error koneksi, lihat `TROUBLESHOOTING.md`.
