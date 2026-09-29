# Pemetaan Pedagogis: LAPS–Heuristik & Indikator Berpikir Kritis

Dokumen ini memetakan integrasi model pembelajaran **Logan Avenue Problem Solving (LAPS)–Heuristik** dengan materi **Intrusion Detection System (IDS)** dan indikator kemampuan berpikir kritis (Facione).

---

## 1. Pemetaan 4 Pertemuan LAPS-Heuristik

| Pertemuan | Tahapan LAPS-Heuristik | Pertanyaan Heuristik Pengarah | Fokus Materi IDS | Aktivitas Utama Siswa |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Memahami Masalah** (*Understand*) | *"Apa masalahnya?"* | Konsep Dasar IDS, Anatomi Log Mentah Suricata/Snort | Interpretasi log peringatan, membedakan fakta log vs asumsi |
| **2** | **Merencanakan Pemecahan** (*Plan*) | *"Adakah alternatif pemecahan masalah?"* | Arsitektur NIDS vs HIDS, Signature vs Anomaly-based | Evaluasi trade-off arsitektur, menentukan strategi penempatan sensor |
| **3** | **Melaksanakan Rencana** (*Execute*) | *"Bagaimana sebaiknya mengerjakannya?"* | Triase Alert SOC, 7 Konteks Infrastruktur | Triase alert insiden, analisis telemetri, klasifikasi TP/FP/Need More Evidence |
| **4** | **Meninjau Kembali** (*Review*) | *"Apakah solusi ini tepat?"* | Investigasi Insiden Terintegrasi, Rekonstruksi Serangan | Blue Team CTF Challenge, korelasi multi-log, refleksi metakognitif |

---

## 2. Pemetaan Indikator Berpikir Kritis (Facione)

Setiap butir aktivitas kuis, skenario, dan triase dalam data layer secara eksplisit dilabeli atribut `cognitiveSkills`:

1. **Interpretasi (*Interpretation*)**:
   - Membaca dan memahami arti dari baris log mentah IDS (timestamp, priority, IP asal/tujuan, signature name).
2. **Analisis (*Analysis*)**:
   - Mengidentifikasi hubungan kausal antar alert jaringan dan log sistem autentikasi host.
3. **Evaluasi (*Evaluation*)**:
   - Menilai validitas alert (apakah serangan nyata atau sekadar pemindaian jaringan biasa/legitimate load).
4. **Inferensi (*Inference*)**:
   - Menarik kesimpulan mengenai status insiden dan vektor serangan berdasarkan bukti-bukti terbatas.
5. **Eksplanasi (*Explanation*)**:
   - Menyajikan alasan teknis pendukung di balik keputusan triase atau mitigasi yang dipilih.
6. **Regulasi Diri (*Self-Regulation*)**:
   - Meninjau kembali proses berpikir melalui form refleksi diri minimal 100 karakter pada akhir sesi.

---

## 3. Scaffolding Heuristik Bertingkat

Setiap pertemuan dilengkapi panel bantuan (*hint panel*) 3 tingkat bertahap:
- **Tingkat 1 (Konseptual)**: Memberikan petunjuk teori atau paradigma dasar tanpa membocorkan jawaban.
- **Tingkat 2 (Operasional)**: Mengarahkan perhatian siswa pada kolom atau parameter log tertentu.
- **Tingkat 3 (Detail Analisis)**: Menyajikan panduan verifikasi mendalam untuk memandu siswa yang mengalami hambatan belajar berkepanjangan.
