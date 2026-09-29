# AUDIT UI/UX: DASHBOARD SISWA IDS LEARNING LAB

Dokumen ini mendokumentasikan analisis prinsip desain, arsitektur informasi (Information Architecture), interaksi visual, dan standar aksesibilitas pada perancangan ulang antarmuka **Dashboard Siswa IDS Learning Lab**.

---

## 1. Filosofi & Arah Desain Visual

Desain dashboard dirancang dengan filosofi:
> **Editorial Minimalism + Bold Accent + Generous Whitespace + Strong Typography + Flat Surfaces + Precise Interaction Design**

Dashboard bertindak sebagai **Personal Learning Command Center** bagi siswa SMK TJKT yang sedang berlatih menjadi analis *Security Operations Center* (SOC) tingkat pemula.

### Palet Warna Sistem
- **Primary / Canvas Deep:** `#1c061e` (Warna identitas keamanan mendalam)
- **Primary Strong:** `#4a154b` (Aksen kontras tinggi untuk modul aktif dan border utama)
- **Accent Emerald:** `#007a5a` (Indikator keberhasilan, verifikasi bukti, dan tuntas)
- **Background Cream:** `#f4ede4` (Warna latar hangat editorial)
- **Surface Crisp:** `#ffffff` (Permukaan kartu datar dan bersih)
- **Surface Soft:** `#eee5db` (Latar belakang elemen interaktif sekunder)
- **Border Crisp:** `#d8cec3` (Garis pemisah struktural halus 1px)
- **Text Primary:** `#1c061e` (Kontras tinggi memenuhi WCAG AAA)
- **Text Muted:** `#6f6670` (Keterangan penjelasan teknis sekunder)

---

## 2. Information Architecture (Hierarki Visual)

Hierarki informasi ditata agar siswa dapat memahami status belajarnya dalam **3–5 detik**:

```text
1. Header Terpadu
   └── Logo IDS • Navigasi Desktop • Quick Search (Ctrl+K) • Notifikasi Riil • Profil Siswa

2. Hero SOC Command Center
   ├── Sapaan & Identitas Siswa
   ├── Pertanyaan Pemicu Konteks Pembelajaran
   ├── Tombol Tindakan Utama (Lanjutkan Modul Rekomendasi)
   └── Ringkasan Metrik Telemetri Riil (Labs, CTF, Pre/Post Test, Level XP)

3. Aktivitas Rekomendasi (Single Dominant Card)
   └── Penentuan Adaptif Berdasarkan Engine LAPS–Heuristik

4. Akses Cepat (Quick Access Grid - 5 Menu Esensial)
   ├── Peta Kurikulum (/learning-path)
   ├── Portofolio LAPS (/portfolio)
   ├── Klasemen SOC (/leaderboard)
   ├── Evidence Tersimpan (/evidence)
   └── Identitas & Lencana (/profile)

5. Peta Kurikulum Visual (Curriculum Roadmap)
   └── Pre-Test → Lab 01 → Lab 02 → Lab 03 → Lab 04 → CTF → Post-Test

6. Lab Pembelajaran 01–04 (Struktur Modul Bernomor)
   ├── 01 · UNDERSTAND (Memahami Masalah & Sensor)
   ├── 02 · PLAN (Merencanakan Rules & Pola)
   ├── 03 · EXECUTE (Triase & Verifikasi Bukti)
   └── 04 · REVIEW (Evaluasi & Respon Insiden)

7. Showcase Bank Kasus Real-Case CTF
   ├── Statistik 30 Skenario Nyata (Total, Solved, Available, %)
   ├── Preview Alur Investigasi 7 Tahap (Case File s/d Reflection)
   └── CTA Langsung Masuk ke CTF

8. Kartu Evaluasi Akhir (Post-Test)
   └── Prerequisite-Aware Context (Terkunci sebelum Lab 01–04 tuntas)

9. Catatan & Riwayat Aktivitas Terkini (Personal Notebook & Telemetry Stream)
   ├── Bukti log tersimpan terbaru
   └── Event telemetri pembelajaran riil
```

---

## 3. Evaluasi Prinsip Interaksi & Aksesibilitas

1. **Anti-Slop / Anti-Mockup:**
   - Tidak ada angka palsu, tidak ada progress dummy, tidak ada leaderboard palsu.
   - Jika belum ada aktivitas, sistem menampilkan state jujur yang membimbing siswa (`Belum ada aktivitas. Mulai dari Pre-Test...`).
2. **Zero Emojis:**
   - Seluruh icon menggunakan SVG 24px Lucide vector system yang terpusat melalui `src/components/Icon.js` dan `src/utils/icons.js`.
3. **Responsivitas Perangkat:**
   - **Desktop (> 900px):** Layout komprehensif dua kolom dengan sticky header dan sidebar navigation.
   - **Tablet (641px – 900px):** Kartu beradaptasi menjadi 2 kolom grid dengan touch target nyaman.
   - **Mobile (≤ 640px):** Header ramping dengan nama halaman dinamis dan Bottom Navigation 5 tab (`Home`, `Learning`, `Portfolio`, `Leaderboard`, `Profile`).
4. **Aksesibilitas (WCAG 2.1 AA):**
   - Kontras rasio teks terhadap background > 4.5:1.
   - Keyboard trap dan navigasi ESC pada modal dialog.
   - Atribut ARIA (`role="main"`, `aria-label`, `role="dialog"`, `aria-modal="true"`).
   - Dukungan mode `data-reduced-motion` untuk siswa yang sensitif terhadap pergerakan visual.
