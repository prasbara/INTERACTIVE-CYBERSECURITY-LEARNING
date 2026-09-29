# Arsitektur Frontend: IDS Learning Lab

Dokumen ini menjelaskan arsitektur perangkat lunak untuk platform **IDS Learning Lab**, media pembelajaran interaktif berbasis pendekatan **Logan Avenue Problem Solving (LAPS)–Heuristik** untuk materi *Intrusion Detection System* (IDS).

---

## 1. Prinsip Desain & Layered Architecture

Aplikasi dibangun menggunakan pendekatan **Layered Modular Architecture** murni berbasis **Vanilla JavaScript (ES6+)** dan **Vite** tanpa framework frontend eksternal (No React, Vue, Svelte, dsb.):

```text
┌───────────────────────────────────────────────┐
│                    PAGES                      │
│ (Landing, Identity, Dashboard, Meeting, dsb.) │
├───────────────────────────────────────────────┤
│                  COMPONENTS                   │
│ (Header, Sidebar, QuizCard, TriageCard, dsb.) │
├───────────────────────────────────────────────┤
│                   MODULES                     │
│    (quiz, triage, ctf, assessment, analytics) │
├───────────────────────────────────────────────┤
│                 APPLICATION                   │
│         (Router, State Store, Storage)        │
├───────────────────────────────────────────────┤
│                DATA / CONTENT                 │
│      (meetings, questions, scenarios, logs)   │
├───────────────────────────────────────────────┤
│                   UTILITIES                   │
│   (dom, formatters, validators, download)     │
└───────────────────────────────────────────────┘
```

Aliran dependensi berjalan satu arah (downward) untuk menghindari siklus circular dependencies.

---

## 2. Navigasi & Routing (Browser History API)

Routing diimplementasikan secara client-side murni tanpa reload halaman menggunakan modul `src/app/router.js`:
- Menggunakan `history.pushState()` dan `window.addEventListener('popstate')`.
- Mendukung dynamic parameters seperti `/meeting/:id`.
- Mencegah navigasi tak dikenal dengan fallback 404 (Unknown Route).
- Mencegah *hard reload* antar halaman sehingga state interaksi dan timer pasif tetap terjaga.

### Daftar Rute Utama:
* `/` : Halaman Pengantar / Landing Page
* `/identity` : Pengisian Identitas Siswa (Nama, Kelas, No. Presensi)
* `/onboarding` : Orientasi Peran Junior SOC Analyst & Siklus LAPS-Heuristik
* `/dashboard` : Beranda Pemantauan Belajar & Rekomendasi Aktivitas
* `/learning-path` : Visual Roadmap Alur Pembelajaran
* `/meeting/1` : Pertemuan 1 - Memahami Masalah (Understand)
* `/meeting/2` : Pertemuan 2 - Merencanakan Pemecahan (Plan)
* `/meeting/3` : Pertemuan 3 - Melaksanakan Rencana (Execute)
* `/meeting/4` : Pertemuan 4 - Meninjau Kembali (Review)
* `/pre-test` : Instrumen Diagnostik Kemampuan Awal
* `/post-test` : Instrumen Evaluasi Akhir Kemampuan Berpikir Kritis
* `/progress` : Rincian Capaian Kriteria Belajar
* `/completion` : Halaman Kelulusan & Unduh Ringkasan
* `/settings` : Preferensi Tema, Backup, & Reset Data
* `/research` : Dasbor Peneliti / Guru (Local Research Mode)

---

## 3. Manajemen State & Penyimpanan Lokal (Local-First)

1. **Central State Store (`src/app/state.js`)**:
   - Menerapkan immutable-style updates.
   - Subscriber listener pattern untuk reaktivitas UI komponen.
2. **Dedicated Storage Layer (`src/app/storage.js`)**:
   - Menyimpan seluruh state terstruktur pada `localStorage` dengan kunci `ids_learning_lab_state`.
   - Menggunakan `SCHEMA_VERSION = 1`.
   - Menerapkan migrasi state otomatis jika versi skema berubah.
   - Penanganan error parsing JSON yang korup dengan pencadangan darurat (`ids_learning_lab_corrupted_backup`) tanpa menghapus data secara sepihak.

---

## 4. Keamanan Data & Flag CTF (Academic Context)

Platform ini merupakan media pembelajaran edukatif yang bersifat **frontend-only** dan **local-first**:
1. **Penyimpanan Identitas**:
   - Hanya mencakup Nama, Kelas XI TJKT, dan Nomor Presensi siswa yang dibutuhkan dalam instrumen skripsi.
   - Tidak ada kata sandi atau data pribadi sensitif yang disimpan.
2. **Verifikasi Flag CTF**:
   - Flag diverifikasi menggunakan hashing string / perbandingan Base64 terobfuskasi di `src/utils/security.js`.
   - Hal ini bertujuan mencegah *accidental spoiler* (terbaca tidak sengaja saat inspeksi biasa), **bukan** perlindungan kriptografis mutlak terhadap reverse engineering tingkat lanjut.
   - Semua verifikasi diselesaikan sepenuhnya di sisi klien.
