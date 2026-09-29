# ALUR DATA (DATA FLOW): DASHBOARD SISWA IDS LEARNING LAB

Dokumen ini menjelaskan alur propagasi data reaktif, mutasi state, persistensi LocalStorage, dan engine rekomendasi adaptif pada platform **IDS Learning Lab**.

---

## 1. Diagram Arsitektur Alur Data

```text
┌────────────────────────────────────────────────────────┐
│               INTERAKSI PEMBELAJARAN                   │
│   (Pre-Test, Quiz, Lab 01–04, Triase Alert, CTF Flag)  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                  MUTASI STATE STORE                    │
│      (store.setState() via Pub/Sub Pattern)            │
│   - state.activities                                   │
│   - state.triageDecisions                              │
│   - state.ctf.completedChallenges                      │
│   - state.scores                                       │
│   - state.bookmarks                                    │
└────────────┬─────────────────────────────┬─────────────┘
             │                             │
             ▼                             ▼
┌─────────────────────────┐   ┌──────────────────────────┐
│   PROGRESS TRACKER      │   │    GAMIFICATION & XP     │
│ (progressTracker.js)    │   │      (xpSystem.js)       │
│ - calculateMeetingProg  │   │ - Tambah XP              │
│ - calculateOverallProg  │   │ - Evaluasi level         │
│ - updateProgressState   │   │ - Buka lencana (badges)  │
└────────────┬────────────┘   └────────────┬─────────────┘
             │                             │
             └──────────────┬──────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             RECOMMENDATION ENGINE                      │
│            getRecommendedActivity(state)               │
│                                                        │
│  Prioritas Deterministik:                              │
│  1. Pre-Test belum dikerjakan → /pre-test              │
│  2. Lab 01 belum tuntas       → /meeting/1             │
│  3. Lab 02 belum tuntas       → /meeting/2             │
│  4. Lab 03 belum tuntas       → /meeting/3             │
│  5. Lab 04 belum tuntas       → /meeting/4             │
│  6. Post-Test belum tuntas    → /post-test             │
│  7. Seluruhnya selesai        → /completion            │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             RE-RENDER REAKTIF DASHBOARD                │
│             (store.subscribe(render))                  │
│  - Hero status diperbarui                              │
│  - Tombol aksi utama disesuaikan                       │
│  - Persentase progress bar terhitung ulang             │
│  - Peta kurikulum mengupdate status node               │
│  - Metrik kemampuan dihitung ulang                     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             PERSISTENSI LOCAL-FIRST                    │
│             (storage.js & LocalStorage)                │
│  - Schema version: v1.0.0                              │
│  - Auto-save ke window.localStorage                    │
│  - Lolos uji proteksi korupsi data                     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Contoh Siklus Eksekusi: Penyelesaian Lab 03 (Execute)

1. Siswa menyelesaikan triase 5 alert SOC di Lab 03 (`/meeting/3`).
2. Event `evaluateTriageDecision` memvalidasi keputusan True/False Positive dan menyimpan hasil ke `state.triageDecisions`.
3. `progressTracker.calculateMeetingProgress(3)` memverifikasi bahwa total keputusan terpenuhi (`answered >= total`).
4. `checkMeetingCompletion(3)` menandai `state.progress.meeting3 = true`.
5. Modul `xpSystem` menganugerahkan bonus XP penyelesaian modul (+100 XP) dan mengevaluasi lencana `TRIAGE ANALYST`.
6. Observer `store.subscribe` pada `DashboardPage.js` menerima notifikasi perubahan state.
7. Engine `getRecommendedActivity(state)` secara otomatis beralih merekomendasikan **Lab 04: Review (Respon Insiden & CTF)**.
8. Seluruh matriks hero, kartu modul, dan progress bar di dashboard ter-update secara instan tanpa perlu memuat ulang halaman.
9. Data termutasi secara sinkron ke LocalStorage browser sehingga aman dari refresh.
