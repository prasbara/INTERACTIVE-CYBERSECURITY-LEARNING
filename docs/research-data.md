# Pengelolaan Data Penelitian & Telemetri Belajar

Dokumen ini menjelaskan spesifikasi teknis pencatatan telemetri (*event logging*), format ekspor data, serta etika perlindungan privasi data peserta didik untuk penelitian skripsi.

---

## 1. Skema Log Telemetri Pembelajaran

Setiap aksi siswa dicatat secara lokal melalui `src/modules/analytics/eventLogger.js` dengan format JSON standar:

```json
{
  "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  "type": "question_answered",
  "meetingId": 1,
  "activityId": "m1-q03",
  "timestamp": "2026-09-29T03:15:30.124Z",
  "payload": {
    "selectedAnswer": "b",
    "correct": true
  }
}
```

### Jenis Event yang Dipantau:
* `app_started`
* `identity_completed`
* `onboarding_completed`
* `meeting_opened`
* `question_answered`
* `scenario_completed`
* `triage_started`
* `triage_answered`
* `hint_opened`
* `ctf_started`
* `flag_submitted`
* `reflection_submitted`
* `meeting_completed`
* `pretest_completed`
* `posttest_completed`

---

## 2. Pengukuran Waktu Pasif (*Passive Time Tracking*)

Aplikasi menggunakan pelacak waktu pasif (`src/modules/analytics/timeTracker.js`):
- Tidak menggunakan hitung mundur (*countdown timer*) yang dapat memicu kecemasan kognitif siswa.
- Mengukur durasi aktual yang dialokasikan siswa dalam menelaah log atau menyelesaikan tahapan problem-solving.

---

## 3. Ekspor Data Riset (JSON & CSV)

Melalui halaman **Research Mode** (`/research`) dan **Pengaturan** (`/settings`), peneliti dapat mengekspor:
1. **JSON Lengkap**: Seluruh status siswa, profil, capaian per pertemuan, jawaban asesmen, dan array telemetri.
2. **CSV Telemetri**: Seluruh baris log event terkonversi tabular untuk memudahkan analisis statistika (SPSS, R, Python Pandas, Excel).

---

## 4. Perlindungan Privasi & Etika Data Lokal

- Sistem berjalan **100% lokal di browser pengguna**.
- Tidak ada data yang dikirimkan ke server eksternal, cloud, atau analitik pihak ketiga.
- Identitas yang dicatat hanya sebatas nama dan nomor presensi kelas SMK untuk pencocokan instrumen penelitian guru/peneliti.
