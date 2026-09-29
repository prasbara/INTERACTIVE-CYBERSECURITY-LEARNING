export const HINTS = [
  {
    step: 1,
    title: "Petunjuk 1 (Konseptual)",
    content: "Perhatikan parameter alamat IP asal, port tujuan, dan interval waktu antar baris log untuk mengenali pola otomasi."
  },
  {
    step: 2,
    title: "Petunjuk 2 (Operasional)",
    content: "Kombinasi percobaan username beruntun terhadap port 22 secara masif dalam hitungan detik mengindikasikan serangan kamus (dictionary attack)."
  },
  {
    step: 3,
    title: "Petunjuk 3 (Detail Analisis)",
    content: "Ketikkan format flag persis: FLAG{SSH_BRUTE_FORCE_DETECTED}."
  }
];

export const hintsData = {
  1: [
    { title: "Petunjuk 1 (Konseptual)", text: "Fokuslah pada fakta teknis: port 22 adalah port SSH standar. Satu koneksi belum membuktikan serangan." },
    { title: "Petunjuk 2 (Operasional)", text: "Periksa kolom count, interval detik, atau status kode apakah ada anomali frekuensi." },
    { title: "Petunjuk 3 (Detail Analisis)", text: "Bedakan antara fakta log obyektif dengan asumsi spekulatif." }
  ],
  2: [
    { title: "Petunjuk 1 (Konseptual)", text: "Signature-based sangat efisien untuk serangan yang sudah memiliki signature/CVE tetap." },
    { title: "Petunjuk 2 (Operasional)", text: "Anomaly-based rentan False Positive jika terjadi lonjakan trafik sah yang baru/mendadak." },
    { title: "Petunjuk 3 (Detail Analisis)", text: "Pilihlah strategi berdasarkan trade-off beban komputasi dan karakteristik ancaman." }
  ],
  3: [
    { title: "Petunjuk 1 (Konseptual)", text: "Jangan terburu-buru menyimpulkan hanya dari satu baris alert NIDS." },
    { title: "Petunjuk 2 (Operasional)", text: "Buka bukti tambahan (telemetri host dan tiket IT) untuk mengonfirmasi otorisasi." },
    { title: "Petunjuk 3 (Detail Analisis)", text: "Jika bukti belum cukup, pilih 'Need More Evidence' sebelum memutuskan TP atau FP." }
  ],
  4: HINTS.map(h => ({ title: h.title, text: h.content }))
};
