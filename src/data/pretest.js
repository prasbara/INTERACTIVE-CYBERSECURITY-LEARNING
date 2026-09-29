export const PRETEST_ITEMS = [
  {
    id: "pre-01",
    question: "Apa peran mendasar dari Intrusion Detection System (IDS) dalam arsitektur keamanan jaringan komputer?",
    options: [
      { id: "a", text: "Menghapus virus dari RAM komputer klien" },
      { id: "b", text: "Memantau lalu lintas paket untuk mendeteksi tanda anomali atau serangan" },
      { id: "c", text: "Menggantikan peran kabel UTP dan switch jaringan" },
      { id: "d", text: "Menyimpan backup database secara periodik" }
    ],
    correctAnswer: "b"
  },
  {
    id: "pre-02",
    question: "Perbedaan utama antara NIDS dan HIDS terletak pada...",
    options: [
      { id: "a", text: "NIDS memeriksa aliran paket jaringan, HIDS memeriksa log dan integritas file pada host" },
      { id: "b", text: "NIDS hanya untuk Linux, HIDS hanya untuk Windows" },
      { id: "c", text: "NIDS memblokir port, HIDS mematikan komputer" },
      { id: "d", text: "NIDS menggunakan kabel fiber optic, HIDS tanpa kabel" }
    ],
    correctAnswer: "a"
  },
  {
    id: "pre-03",
    question: "Jika NIDS mendeteksi koneksi menuju port 22, layanan apa yang umumnya berjalan pada port tersebut?",
    options: [
      { id: "a", text: "File Transfer Protocol (FTP)" },
      { id: "b", text: "Secure Shell (SSH)" },
      { id: "c", text: "Hypertext Transfer Protocol (HTTP)" },
      { id: "d", text: "Domain Name System (DNS)" }
    ],
    correctAnswer: "b"
  },
  {
    id: "pre-04",
    question: "Bagaimana cara kerja Signature-Based Detection pada IDS?",
    options: [
      { id: "a", text: "Mempelajari kebiasaan user selama 6 bulan" },
      { id: "b", text: "Membandingkan data paket dengan database pola serangan yang sudah diketahui" },
      { id: "c", text: "Mengacak port server secara berkala" },
      { id: "d", text: "Meminta password setiap kali paket data lewat" }
    ],
    correctAnswer: "b"
  },
  {
    id: "pre-05",
    question: "Apa kelemahan utama dari Signature-Based Detection?",
    options: [
      { id: "a", text: "Sangat lambat memproses paket" },
      { id: "b", text: "Tidak mampu mendeteksi varian serangan baru (zero-day)" },
      { id: "c", text: "Selalu mematikan sistem operasi" },
      { id: "d", text: "Hanya berjalan pada server offline" }
    ],
    correctAnswer: "b"
  },
  {
    id: "pre-06",
    question: "Apa yang dimaksud dengan kondisi False Positive dalam pemantauan alert keamanan?",
    options: [
      { id: "a", text: "Serangan nyata berhasil merusak server tanpa terdeteksi" },
      { id: "b", text: "Alert berbunyi padahal lalu lintas jaringan sebenarnya sah dan tidak berbahaya" },
      { id: "c", text: "Sistem IDS mengalami kerusakan perangkat keras" },
      { id: "d", text: "Pengguna lupa memasukkan password sebanyak 1 kali" }
    ],
    correctAnswer: "b"
  },
  {
    id: "pre-07",
    question: "Apa yang dimaksud dengan kondisi True Positive?",
    options: [
      { id: "a", text: "Alert berbunyi dan aktivitas tersebut memang benar-benar serangan berbahaya" },
      { id: "b", text: "Lalu lintas normal dinyatakan aman oleh firewall" },
      { id: "c", text: "Sistem IDS dimatikan oleh administrator" },
      { id: "d", text: "Server berhasil diperbarui otomatis" }
    ],
    correctAnswer: "a"
  },
  {
    id: "pre-08",
    question: "Mengapa lonjakan lalu lintas pada pukul 07:00 pagi di sekolah tidak boleh langsung diklaim sebagai serangan DDoS?",
    options: [
      { id: "a", text: "Karena hacker tidak pernah menyerang di pagi hari" },
      { id: "b", text: "Karena jam tersebut bertepatan dengan kedatangan siswa dan guru yang mengakses jaringan sekolah" },
      { id: "c", text: "Karena port Wi-Fi otomatis kebal dari DDoS" },
      { id: "d", text: "Karena router sekolah selalu memfilter paket secara instan" }
    ],
    correctAnswer: "b"
  },
  {
    id: "pre-09",
    question: "Karakteristik utama dari serangan brute force otentikasi adalah...",
    options: [
      { id: "a", text: "Pengiriman satu file zip berukuran raksasa" },
      { id: "b", text: "Percobaan login berulang dengan kombinasi kredensial berbeda dalam waktu singkat" },
      { id: "c", text: "Perubahan alamat IP gateway oleh ISP" },
      { id: "d", text: "Pemasangan kabel LAN yang longgar" }
    ],
    correctAnswer: "b"
  },
  {
    id: "pre-10",
    question: "Mengapa seorang analis keamanan perlu melakukan korelasi multi-log (syslog + alert IDS)?",
    options: [
      { id: "a", text: "Agar ukuran file log di harddisk semakin besar" },
      { id: "b", text: "Untuk memverifikasi apakah alert jaringan selaras dengan bukti eksekusi nyata pada sistem host" },
      { id: "c", text: "Supaya siswa tidak dapat mengakses internet" },
      { id: "d", text: "Untuk mengganti alamat MAC switch" }
    ],
    correctAnswer: "b"
  }
];

export const pretestQuestions = PRETEST_ITEMS;
