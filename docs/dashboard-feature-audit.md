# AUDIT FITUR & SISTEM: DASHBOARD SISWA IDS LEARNING LAB

Dokumen audit ini mengevaluasi seluruh fitur, routing, data model, dan state management pada platform **IDS Learning Lab** (SMK TJKT — Pendekatan LAPS–Heuristik) sebelum pelaksanaan redesign total dashboard siswa.

---

## 1. Klasifikasi Status Fitur

Kategori status:
- **`WORKING`**: Berfungsi penuh, terhubung dengan state/storage aktual, data valid.
- **`PARTIALLY WORKING`**: Berfungsi sebagian; memerlukan penyempurnaan UI, alias routing, atau data handling.
- **`MOCKUP`**: Tampilan visual ada tetapi datanya hardcoded atau statis (tidak berasal dari sistem).
- **`PLACEHOLDER`**: Elemen penampung sementara tanpa fungsionalitas nyata.
- **`BROKEN`**: Mengandung error eksekusi, sintaks, atau rendering bug.
- **`UNIMPLEMENTED`**: Belum dibuat atau membutuhkan dependensi backend eksternal.
- **`UNKNOWN`**: Status belum terverifikasi.

---

## 2. Matriks Audit Fitur

| No | Fitur / Komponen | Rute Terkait | Status | Temuan Audit & Catatan Arsitektur | Tindakan Redesign |
|---|---|---|---|---|---|
| 1 | **Student Dashboard** | `/dashboard` | `PARTIALLY WORKING` | Halaman utama menampilkan hero, rekomendasi, alur modul, dan ringkasan. Masih terdapat kartu bertumpuk, belum ada Quick Access, Peta Kurikulum interaktif, dan preview CTF 30 kasus. | Redesign total menjadi Personal SOC Command Center dengan hierarki editorial yang jelas. |
| 2 | **Routing System** | `main.js`, `router.js` | `WORKING` | Router berbasis hash/pathname berjalan lancar. Belum memiliki alias untuk `/portfolio`, `/evidence`, dan `/metrics`. | Daftarkan alias route `/portfolio`, `/evidence`, dan `/metrics` agar kompatibel penuh. |
| 3 | **State Management** | `state.js` | `WORKING` | State store reaktif dengan pola Pub/Sub observer. Persistensi state tersimpan di LocalStorage. | Pertahankan dan hubungkan seluruh aksi dashboard langsung ke state store. |
| 4 | **LocalStorage Storage** | `storage.js` | `WORKING` | Schema versioning v1.0.0 dengan proteksi korupsi dan recovery otomatis jika payload kosong/rusak. | Pertahankan. Seluruh histori belajar tersimpan persisten lintas refresh. |
| 5 | **API / Remote Service** | `ctfEngine.js` | `UNIMPLEMENTED` | Saat ini beroperasi dalam mode Local-First. Remote backend belum tersedia (`NOT PRODUCTION READY — BACKEND REQUIRED`). | Tampilkan status jujur "Mode Offline / Lokal" dan adapter remote siap pakai. |
| 6 | **Autentikasi Siswa** | `/identity` | `WORKING` | Form identitas siswa (Nama, Kelas, No. Presensi, Kode Lab) tervalidasi dan tersimpan di `state.student`. | Pertahankan dan tampilkan identitas aktual siswa di Header dan Profile Pill. |
| 7 | **Progress Tracker** | `progressTracker.js` | `WORKING` | Perhitungan progres modular (Lab 01 s/d 04, pre/post test, CTF, persentase tuntas) deterministik dan lulus unit test. | Gunakan sebagai sumber kebenaran tunggal untuk seluruh metrik dashboard. |
| 8 | **Quiz Engine** | `quizEngine.js` | `WORKING` | Mesin penilaian soal pemahaman LAPS dengan analisis miskonsepsi dan remediasi pedagogis. | Hubungkan jumlah soal terjawab aktual ke metrik dashboard. |
| 9 | **Pre-Test Evaluasi** | `/pre-test` | `WORKING` | Asesmen penalaran awal sebelum memasuki materi Lab 01. Nilai tersimpan di `state.scores.pretest`. | Hubungkan langsung ke Peta Kurikulum dan prioritas engine rekomendasi. |
| 10 | **Post-Test Evaluasi** | `/post-test` | `WORKING` | Asesmen evaluasi akhir setelah menyelesaikan rangkaian LAPS. Nilai tersimpan di `state.scores.posttest`. | Tampilkan status prasyarat yang jelas (terbuka setelah Lab 04 tuntas). |
| 11 | **Lab 01: Understand** | `/meeting/1` | `WORKING` | Modul pemahaman konsep IDS, sensor, log Suricata mentah, fakta vs opini, dan hipotesis awal. | Beri hierarki penomoran `01 · UNDERSTAND`, durasi waktu, status, dan CTA langsung. |
| 12 | **Lab 02: Plan** | `/meeting/2` | `WORKING` | Modul perancangan sensor NIDS vs HIDS, topologi jaringan, dan analisis skenario insiden. | Beri hierarki penomoran `02 · PLAN`, estimasi waktu, status, dan CTA langsung. |
| 13 | **Lab 03: Execute** | `/meeting/3` | `WORKING` | Modul eksekusi triase alert SOC (TP/FP/Need More Evidence) berdasarkan 7 konteks investigasi. | Beri hierarki penomoran `03 · EXECUTE`, estimasi waktu, status, dan CTA langsung. |
| 14 | **Lab 04: Review** | `/meeting/4` | `WORKING` | Modul evaluasi insiden, investigasi CTF Blue Team, mitigasi, dan refleksi metakognitif. | Beri hierarki penomoran `04 · REVIEW`, estimasi waktu, status, dan CTA langsung. |
| 15 | **Real-Case CTF (30 Flag)**| `/ctf`, `/ctf/:id` | `WORKING` | 30 skenario kasus nyata lengkap dengan validasi flag, anti-leak, kuota percobaan, mitigasi, dan refleksi LAPS. | Tampilkan section CTF khusus di dashboard dengan metrik riil (Solved, Available, Completion %). |
| 16 | **Portofolio LAPS** | `/review`, `/portfolio` | `PARTIALLY WORKING` | Merangkum 4 fase LAPS, namun belum memiliki fitur pencarian, filter, dan ekspor catatan investigasi. | Sempurnakan tampilan investigasi record (Problem, Hypothesis, Evidence, Decision, Reflection) + ekspor. |
| 17 | **Klasemen SOC** | `/leaderboard` | `MOCKUP` | Halaman leaderboard sebelumnya menggunakan daftar siswa hardcoded (`cohortPeers`) yang bersifat statis. | Hapus data palsu! Tampilkan status jujur: mode offline / belum sinkronisasi backend, dengan rekapitulasi data aktual siswa saat ini. |
| 18 | **Identitas & Lencana** | `/profile` | `WORKING` | Menampilkan profil siswa, level, akumulasi XP, dan lencana kompetensi (SVG geometric, tanpa emoji). | Integrasikan data lencana terverifikasi ke dalam dashboard dan profil siswa. |
| 19 | **Lencana (Badges)** | `xpSystem.js` | `WORKING` | 7 lencana kompetensi (First Step, Log Explorer, Triage Analyst, CTF Beginner, No Hint, dll.) diberikan hanya saat kriteria terpenuhi. | Pertahankan evaluasi berbasis kriteria nyata (bukan badge gratis/otomatis). |
| 20 | **Evidence Tersimpan** | `/bookmarks`, `/evidence` | `PARTIALLY WORKING` | Fitur simpan bukti log dan soal ada, namun belum memiliki pengeditan catatan (notes) dan filter kategori. | Perluas menjadi Personal Evidence Notebook siswa (search, filter, view, edit notes, delete). |
| 21 | **Metrik Kemampuan** | `/progress`, `/metrics` | `PARTIALLY WORKING` | Terdapat bug rendering `[object Object]%` di `ProgressPage.js` karena memanggil objek progress langsung sebagai string. | Perbaiki bug rendering dan perluas metrik performa belajar (Learning & Domain Performance riil). |
| 22 | **Data Riset S1** | `/research` | `WORKING` | Dashboard telemetri riset skripsi (Pre/Post test, normalized gain, event stream, ekspor CSV/JSON). | Pertahankan dan pisahkan secara eksplisit dari instrumen pembelajaran biasa. |
| 23 | **Konfigurasi Sistem** | `/settings` | `PARTIALLY WORKING` | Tema berjalan, namun opsi Reduced Motion, Sound, dan Presentation Mode belum terhubung ke atribut DOM. | Implementasikan pengaturan fungsional (Reduced Motion, Sound, Presentation Mode, Reset, Export). |

---

## 3. Rencana Tindakan Perbaikan Prioritas

1. **Perbaikan Bug Kritis:**
   - Memperbaiki bug parsing `[object Object]%` pada `ProgressPage.js`.
   - Mengganti data palsu/hardcoded pada `LeaderboardPage.js` dengan state aktual dan pemberitahuan status offline yang jujur.
2. **Penyempurnaan Routing:**
   - Mendaftarkan route alias di `main.js`:
     - `/portfolio` -> `createReviewPage`
     - `/evidence` -> `createBookmarksPage`
     - `/metrics` -> `createProgressPage`
3. **Penyusunan Ulang Header & Bottom Navigation:**
   - Desktop Header: Logo, Nav Links (Dashboard, Learning Path, Portfolio, Leaderboard), Search Modal Trigger, Notifikasi Event Riil, Profile Pill, Theme Toggle, Admin Link.
   - Mobile View: Logo, Title, Profile, dan Bottom Navigation 5 menu (`Home`, `Learning`, `Portfolio`, `Leaderboard`, `Profile`) dengan SVG icons murni.
4. **Pembangunan Ulang Dashboard Siswa (`DashboardPage.js`):**
   - Hero SOC Command Center dengan data riil (Nama, Kelas, Lab X/4, CTF Y/30, status Pre/Post test).
   - Aktivitas Rekomendasi Adaptif (deterministic priority).
   - Quick Access (5 menu esensial).
   - Peta Kurikulum LAPS–Heuristik (Pre-test -> Lab 01 s/d 04 -> CTF -> Post-test) dengan status dinamis.
   - Kartu Lab 01–04 bernomor dengan hierarki jelas.
   - Showcase Real-Case CTF (30 Skenario, metrik riil).
   - Post-Test Card dengan penjelasan prasyarat.
   - Recent Activities & Evidence feed dari event dan bookmark aktual.
   - Zero emoji, zero dead buttons, zero `href="#"`, zero fake statistics.
