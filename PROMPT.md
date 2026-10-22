# Prompt: Website Kunjungan NOP Merchant

Buatkan website **Kunjungan NOP Merchant** menggunakan **React JS (Vite) + Tailwind CSS + Framer Motion + Recharts + React Router**, dengan tema **glassmorphism** dan palet warna yang sama dengan website monitoring BRI Region 12 Surabaya.

## 1. Tema & Gaya Visual
- Warna: biru BRI `#0857C3` (utama), biru tua `#063B82`, navy `#0F1F45` (judul), biru muda `#EAF2FF`. Latar gradasi lembut biru muda → lavender → cyan muda (`#EAF2FF → #F3F0FF → #DDF3FF`).
- Glassmorphism: kartu putih transparan (`rgba(255,255,255,.72)`), `backdrop-filter: blur(20px)`, border putih tipis, radius 20px, bayangan biru lembut.
- Font: **Space Grotesk** (judul & isi), **JetBrains Mono** (label kecil huruf kapital dengan letter-spacing lebar).
- Navbar atas (sticky, glass): logo + nama "Kunjungan NOP Merchant" + subjudul "Operation, Service, and E-Channel (OSE)", menu pill (aktif = biru solid), indikator **LIVE** hijau, tombol download Excel, tombol refresh.
- Hero: judul sangat besar "KUNJUNGAN NOP" (navy) dan "MERCHANT" (biru, bergaris bawah), deskripsi singkat, tiga tombol (Lihat Live Response, Unduh Data Excel, Buka Dashboard), logo besar bercahaya di sisi kanan.
- Kartu statistik: label mono huruf kapital, ikon di kotak biru muda pojok kanan atas, angka besar, keterangan kecil.
- Framer Motion: animasi masuk berurutan pada hero, transisi halaman, hover halus pada kartu, modal dengan animasi. Hormati `prefers-reduced-motion`.
- Responsif (mobile-first), fokus keyboard terlihat, kontras teks memadai.

## 2. Sumber Data
Google Sheets: `https://docs.google.com/spreadsheets/d/1IMgXoNGzRAWc3RbS2RvtV5HeDEbB-aEubS6CRS_E2jc/edit`
- Sheet **FormResponse** (baris 1 = header), kolom:
  `Timestamp | Tanggal Kunjungan | Branch Office | PN Petugas IT | Nama Pet. IT | TID Merchant | Nama Merchant | Kondisi Fisik Mesin EDC | Hasil Transaksi | Problem NOP | Tindak Lanjut NOP | Keterangan (No Tiket) | Longitude | Latitude | Bukti Foto`
- Sheet **Database1**: kolom **B** = Petugas IT, kolom **D** = Branch Office.
- Akses data lewat **Google Apps Script Web App** (`doGet` dengan `?action=health|live-response|dashboard`) yang mengembalikan JSON. URL disimpan di `VITE_GOOGLE_SCRIPT_URL`.
- Tangani state loading (skeleton), error (pesan + tombol coba lagi), dan data kosong.

## 3. Halaman

### 3.1 Home
- Hero seperti pada bagian Tema.
- Bagian **Ringkasan Cepat / Status Monitoring Terkini** berisi 4 kartu: Total Live Response, Jumlah Branch Office, Jumlah Petugas IT, Status Sistem (Active).
- Tabel "Kunjungan Terbaru" (8 baris terakhir) dengan tautan "Lihat semua".

### 3.2 Live Response
- Tampilkan semua kolom FormResponse dalam tabel (Longitude & Latitude digabung menjadi satu kolom aksi "Lokasi Maps").
- Kolom **Lokasi Maps**: tautan "Lihat Lokasi" yang membuka `https://www.google.com/maps?q={latitude},{longitude}` di tab baru. Validasi koordinat (lat -90..90, lng -180..180); jika tidak valid tampilkan "Lokasi tidak tersedia".
- Kolom **Bukti Foto**: tombol "Lihat Foto" yang membuka modal pratinjau (dukung link Google Drive lewat thumbnail) plus tombol "Buka di tab baru". Jika gagal dimuat, tampilkan pesan yang jelas.
- Pencarian (merchant, TID, branch, PN, nama petugas), urut terbaru/terlama, pilihan jumlah baris (10/25/50/100), paginasi.
- Klik baris membuka modal detail kunjungan.
- Badge warna untuk Kondisi Fisik Mesin EDC dan Hasil Transaksi.
- **Tombol "Unduh Excel"**: mengunduh data yang sedang tampil (sesuai pencarian) ke file `.xlsx`, berisi semua kolom FormResponse + kolom "Link Google Maps". Tombol unduh semua data juga ada di navbar dan Home.

### 3.3 Dashboard
**Filter:** rentang tanggal (mulai–akhir, validasi), Branch Office, PN Petugas IT, Nama Petugas IT, Nama Merchant (ketik untuk mencari), tombol Terapkan Filter & Reset Filter, chip filter aktif yang bisa dihapus.

**Kartu statistik (klik untuk aksi):**
- Total Live Response → klik menggulir ke tabel Laporan Live Response (mengikuti filter).
- Jumlah Branch Office → hitung **unique value** sheet Database1 kolom D; klik menampilkan daftarnya.
- Jumlah Petugas IT → hitung **unique value** sheet Database1 kolom B; klik menampilkan daftarnya.
- Status Sistem → tampil **Active** (hijau) bila koneksi ke spreadsheet berhasil; klik menampilkan detail koneksi.

**Grafik (di bawah kartu, ikut filter, klik untuk memfilter silang):**
1. Jumlah kunjungan merchant per tanggal → diagram batang.
2. Hasil Transaksi → diagram batang.
3. Tindak Lanjut NOP → diagram lingkaran (tooltip dengan persentase, legenda).
4. Problem NOP → diagram batang menyamping (horizontal).

**Laporan Live Response** di bagian paling bawah, dengan fitur tabel yang sama seperti halaman Live Response (maps, foto, detail, unduh Excel).

## 4. Kualitas
- Struktur: `pages/`, `components/`, `layouts/`, `hooks/`, `services/`, `utils/`.
- Normalisasi data (trim spasi, format tanggal `yyyy-MM-dd` atau `dd/MM/yyyy`), nilai kosong dilabeli "Belum Diisi".
- Sertakan `README.md` berisi cara menjalankan, deploy Apps Script, dan konfigurasi `.env`.
