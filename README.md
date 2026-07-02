# Ledgerine — Sistem Invoice & Kwitansi

Frontend GitHub Pages + backend Google Apps Script + Google Sheets. Semuanya GET-only, jadi tidak ada masalah CORS.

## File
- `index.html` — aplikasi (UI + semua logika)
- `config.js` — isi `API_URL` di sini (jangan ditimpa placeholder)
- `Code.gs` — backend Apps Script

## 1. Siapkan backend (Google Sheets + Apps Script)
1. Buat Google Sheet baru (kosong, biarkan sheet default).
2. `Ekstensi > Apps Script`. Hapus isi `Code.gs`, tempel isi file `Code.gs` di repo ini.
3. Ganti `LOGIN_USER`, `LOGIN_PASS`, dan `SECRET` di baris atas.
4. `Deploy > New deployment > Web app`:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Salin **Web app URL** (berakhiran `/exec`).

> Sheet `Customers`, `Products`, `Invoices`, `Receipts` dibuat otomatis saat pertama kali dipakai.

## 2. Sambungkan frontend
Buka `config.js`, isi:
```js
API_URL: "https://script.google.com/macros/s/AKfycb....../exec",
```
Ubah juga data `COMPANY` (nama, alamat, telepon) — dipakai pada cetak invoice & kwitansi.

## 3. Deploy ke GitHub Pages
1. Push `index.html` + `config.js` ke repo.
2. `Settings > Pages > Branch: main /(root)`.
3. Buka URL Pages, login.

## Mode DEMO (tanpa backend)
Jika `API_URL` kosong, aplikasi jalan pakai `localStorage`. Login: **admin / admin123**. Cocok untuk mencoba tampilan sebelum deploy.

## Alur kerja
1. **Pelanggan** & **Barang** → isi data master.
2. **Invoice Baru** → pilih pelanggan, pilih barang (harga terisi otomatis), atur qty & pajak.
3. **Kwitansi Baru** → centang satu atau beberapa invoice yang belum dibayar → terbit. Invoice otomatis jadi **Lunas**. Kwitansi hanya menampilkan jumlah uang + terbilang (bukan rincian invoice), sesuai permintaan.
4. Tombol cetak (🖨) pada invoice/kwitansi → jendela print / simpan PDF.

## Catatan penting saat update
Saat mem-package ulang, **jangan timpa `config.js`** yang sudah berisi URL deployment asli dengan placeholder kosong.
