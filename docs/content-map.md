# Content Map & Question Bank Inventory

Dokumen ini memetakan seluruh bank materi, soal, skenario, dan tantangan yang terisolasi dalam direktori data (`src/data/`).

---

## 1. Modul Data & Struktur Konten

* **`src/data/meetings.js`**: Meta informasi 4 pertemuan, tahapan LAPS, heuristic questions, dan kriteria ketuntasan.
* **`src/data/learningObjectives.js`**: Daftar tujuan pembelajaran per pertemuan.
* **`src/data/materials.js`**: Narasi modul materi lengkap per pertemuan beserta contoh sintaks rule Suricata dan tabel perbandingan.
* **`src/data/questions.js`**: Bank soal interaktif berbasis data untuk Pertemuan 1, 2, dan 3.
* **`src/data/scenarios.js`**: Kasus dilema arsitektur dan trade-off untuk Pertemuan 2.
* **`src/data/triageCases.js`**: Kasus triase SOC tingkat lanjut dengan 7 konteks infrastruktur untuk Pertemuan 3.
* **`src/data/ctfChallenge.js`**: Skenario Blue Team CTF, linimasa serangan, log multi-sensor, dan pertanyaan pengarah untuk Pertemuan 4.
* **`src/data/hints.js`**: Bank scaffolding bantuan 3-tier.
* **`src/data/pretest.js`**: 10 butir pertanyaan instrumen diagnostik awal.
* **`src/data/posttest.js`**: 12 butir pertanyaan instrumen evaluasi akhir.
* **`src/data/misconceptions.js`**: 5 pemetaan miskonsepsi umum peserta didik terkait IDS.

---

## 2. Inventaris Butir Aktivitas

| Kode ID | Pertemuan | Tipe Aktivitas | Indikator Kognitif | Kunci Jawaban |
| :--- | :---: | :--- | :--- | :---: |
| `m1-q01` | 1 | Multiple Choice | interpretasi, analisis | `c` |
| `m1-q02` | 1 | Multiple Choice | analisis, inferensi | `c` |
| `m1-q03` | 1 | Multiple Choice | evaluasi, eksplanasi | `b` |
| `m1-q04` | 1 | Multiple Choice | interpretasi, analisis | `b` |
| `m1-q05` | 1 | Multiple Choice | inferensi, evaluasi | `b` |
| `scen-01` | 2 | Skenario Arsitektur | evaluasi, regulasi-diri | Pilihan Berbobot |
| `scen-02` | 2 | Skenario Deteksi | analisis, evaluasi | Pilihan Berbobot |
| `m2-q01` | 2 | Multiple Choice | evaluasi, eksplanasi | `c` |
| `m2-q02` | 2 | Multiple Choice | analisis, inferensi | `c` |
| `m2-q03` | 2 | Multiple Choice | interpretasi, analisis | `b` |
| `m2-q04` | 2 | Multiple Choice | analisis, evaluasi | `c` |
| `tc-01` | 3 | SOC Alert Triage | analisis, inferensi | `TRUE_POSITIVE` |
| `tc-02` | 3 | SOC Alert Triage | evaluasi, regulasi-diri | `FALSE_POSITIVE` |
| `tc-03` | 3 | SOC Alert Triage | interpretasi, inferensi | `NEED_MORE_EVIDENCE` |
| `tc-04` | 3 | SOC Alert Triage | analisis, evaluasi | `TRUE_POSITIVE` |
| `ctf-ch01` | 4 | Incident CTF + 5 Qs | multi-indikator | `FLAG{SSH_BRUTE_FORCE_DETECTED}` |
| PreTest (1-10) | Diagnostik | Multiple Choice | beragam | Terkalibrasi |
| PostTest (1-12) | Evaluasi | Multiple Choice | beragam | Terkalibrasi |
