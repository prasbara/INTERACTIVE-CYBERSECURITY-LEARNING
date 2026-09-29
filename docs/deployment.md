# Petunjuk Deployment & Konfigurasi Produksi

Dokumen ini menjelaskan tata cara pengujian, kompilasi produksi (*production build*), dan penyiapan media hosting/distribusi statis untuk platform **IDS Learning Lab**.

---

## 1. Persyaratan Lingkungan (*Prerequisites*)

- **Node.js**: Versi LTS 18+ (direkomendasikan v20+ atau v24+)
- **NPM**: Versi 9+ atau 10+
- **Browser Modern**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari dengan dukungan ES6+ dan LocalStorage.

---

## 2. Instalasi Dependensi

Jalankan perintah berikut di direktori proyek:

```bash
npm install
```

---

## 3. Menjalankan Server Pengembangan Lokal

Untuk menjalankan server dev lokal dengan *Hot Module Replacement* (HMR):

```bash
npm run dev
```

Secara default, aplikasi akan berjalan pada alamat:
`http://localhost:3000`

---

## 4. Eksekusi Pengujian Otomatis (*Automated Unit Testing*)

Aplikasi dilengkapi unit test terintegrasi menggunakan modul native Node.js test runner:

```bash
npm test
```

Menguji seluruh modul inti:
- `tests/quiz.test.js`
- `tests/triage.test.js`
- `tests/flagValidator.test.js`
- `tests/storage.test.js`
- `tests/progress.test.js`

---

## 5. Kompilasi Produksi (*Production Build*)

Untuk memproduksi berkas statis yang telah dioptimasi, diminifikasi, dan siap dideploy:

```bash
npm run build
```

Hasil kompilasi akan ditempatkan di direktori:
```text
dist/
├── index.html
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

---

## 6. Pratinjau Hasil Build Produksi

Untuk memverifikasi hasil build secara lokal sebelum diunggah:

```bash
npm run preview
```

---

## 7. Opsi Deployment Hosting Statis

Karena aplikasi ini bersifat **client-side SPA statis tanpa backend**, direktori `dist/` dapat di-hosting secara gratis di berbagai layanan:

1. **GitHub Pages**:
   - Atur source deployment ke folder branch `gh-pages` atau direktori `/dist`.
2. **Vercel / Netlify / Cloudflare Pages**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Offline Classroom Distribution (Flashdisk / Local LAN)**:
   - Dapat disajikan di jaringan laboratorium komputer sekolah menggunakan `npx serve dist` atau server web lokal sekolah (XAMPP / Nginx lokal).
