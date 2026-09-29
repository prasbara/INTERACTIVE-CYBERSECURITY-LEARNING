export const POSTTEST_ITEMS = [
  {
    id: "post-01",
    question: "Sebuah NIDS mendeteksi alert 'ET SCAN Potential SSH Scan'. Apa langkah penalaran pertama yang harus dilakukan analis?",
    options: [
      { id: "a", text: "Menghubungkan alert dengan log autentikasi host dan pola frekuensi koneksi" },
      { id: "b", text: "Langsung memformat harddisk server" },
      { id: "c", text: "Menonaktifkan seluruh kartu jaringan sekolah" },
      { id: "d", text: "Mengabaikan alert karena port SSH selalu aman" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-02",
    question: "Kelemahan terbesar jika jaringan sekolah hanya mengandalkan Signature-Based IDS tanpa kalibrasi adalah...",
    options: [
      { id: "a", text: "Tidak dapat mendeteksi eksploitasi baru (zero-day) dan serangan yang polanya sedikit dimodifikasi" },
      { id: "b", text: "Sistem tidak dapat menggunakan kabel LAN" },
      { id: "c", text: "Server akan otomatis kehabisan daya listrik" },
      { id: "d", text: "Kecepatan monitor komputer menurun" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-03",
    question: "Dalam kondisi manakah Anomaly-Based IDS paling rentan menghasilkan False Positive tinggi?",
    options: [
      { id: "a", text: "Ketika terjadi perubahan perilaku sah yang belum sempat dipelajari ke dalam baseline profil normal" },
      { id: "b", text: "Ketika server dimatikan saat libur sekolah" },
      { id: "c", text: "Ketika hacker menyerang menggunakan tools lama" },
      { id: "d", text: "Ketika semua kabel jaringan terpasang kencang" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-04",
    question: "Jika IP sumber serangan adalah 10.10.10.45 (subnet ruang guru), evaluasi kritis yang tepat adalah...",
    options: [
      { id: "a", text: "Perangkat internal di ruang guru mungkin telah disusupi malware atau terinfeksi skrip otomatis" },
      { id: "b", text: "Alamat IP privat tidak mungkin dapat mengirimkan paket data" },
      { id: "c", text: "Guru tersebut pasti merupakan hacker internasional" },
      { id: "d", text: "Server otentikasi otomatis kebal dari subnet ruang guru" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-05",
    question: "Manakah bukti yang paling krusial untuk membedakan brute force attack dari kegagalan login wajar?",
    options: [
      { id: "a", text: "Frekuensi kegagalan ekstrem dan pergantian username otomatis dalam jendela waktu sangat singkat" },
      { id: "b", text: "Keberadaan protokol TCP pada header paket" },
      { id: "c", text: "Penggunaan kabel UTP Cat 6" },
      { id: "d", text: "Nomor port tujuan yang bernilai genap" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-06",
    question: "Apa konsekuensi operasional jika sebuah alert False Positive direspons dengan pemblokiran IP permanen?",
    options: [
      { id: "a", text: "Layanan sah bagi pengguna berhak akan terputus (Denial of Service bagi pengguna sah)" },
      { id: "b", text: "Server akan otomatis ter-upgrade ke versi terbaru" },
      { id: "c", text: "Hacker akan langsung menyerahkan diri" },
      { id: "d", text: "Biaya langganan internet sekolah turun 50%" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-07",
    question: "Pada kasus ambigu di SOC, mengapa opsi 'Need More Evidence' merupakan tindakan yang metodologis?",
    options: [
      { id: "a", text: "Mencegah kesalahan klasifikasi dini dan mengumpulkan bukti kontekstual pendukung sebelum bertindak" },
      { id: "b", text: "Agar analis dapat pulang lebih cepat tanpa bekerja" },
      { id: "c", text: "Karena sistem operasi melarang pengambilan keputusan di siang hari" },
      { id: "d", text: "Supaya file database log terisi penuh" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-08",
    question: "Mengapa NIDS memerlukan dukungan HIDS pada server yang menjalankan layanan terenkripsi (HTTPS/SSH)?",
    options: [
      { id: "a", text: "HIDS dapat membaca log dan integritas file lokal setelah paket terenkripsi didekripsi oleh host" },
      { id: "b", text: "HIDS tidak memerlukan tenaga listrik untuk beroperasi" },
      { id: "c", text: "NIDS hanya dapat bekerja pada komputer tanpa sistem operasi" },
      { id: "d", text: "HIDS membuat kabel jaringan tahan air" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-09",
    question: "Jika administrator menurunkan threshold sensitivitas IDS secara drastis untuk meniadakan alarm palsu, bahaya yang mengintai adalah...",
    options: [
      { id: "a", text: "Meningkatnya risiko False Negative di mana serangan nyata menyusup tanpa terdeteksi" },
      { id: "b", text: "Monitor komputer akan menampilkan layar biru" },
      { id: "c", text: "Kecepatan akses internet menjadi terlalu cepat" },
      { id: "d", text: "Kabel LAN mengalami korsleting listrik" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-10",
    question: "Mitigasi pencegahan paling kokoh untuk menghentikan serangan SSH brute force secara permanen adalah...",
    options: [
      { id: "a", text: "Menerapkan Fail2ban, menonaktifkan password authentication, dan menggunakan SSH Key-based authentication" },
      { id: "b", text: "Mengganti password root menjadi 123456" },
      { id: "c", text: "Menghapus port 22 dari tabel matematika" },
      { id: "d", text: "Mematikan server setiap kali siswa hendak login" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-11",
    question: "Bagaimana cara mengecek apakah solusi mitigasi Fail2ban yang diterapkan pada server SSH bekerja efektif?",
    options: [
      { id: "a", text: "Menguji simulasi percobaan login gagal dari IP uji dan memverifikasi apakah IP tersebut otomatis terblokir pada iptables" },
      { id: "b", text: "Memeriksa apakah warna casing server berubah" },
      { id: "c", text: "Menanyakan kepada siswa apakah mereka menyukai Fail2ban" },
      { id: "d", text: "Melihat apakah lampu indikator switch berkedip lebih lambat" }
    ],
    correctAnswer: "a"
  },
  {
    id: "post-12",
    question: "Pernyataan yang paling mencerminkan kemampuan metakognisi dan berpikir kritis dalam investigasi keamanan siber adalah...",
    options: [
      { id: "a", text: "'Keputusan saya didasarkan pada korelasi bukti objektif multi-log, namun saya tetap harus menguji kembali hipotesis terhadap kemungkinan false positive.'" },
      { id: "b", text: "'Saya yakin 100% tanpa perlu memeriksa log karena insting saya selalu benar.'" },
      { id: "c", text: "'Jika alert IDS berbunyi merah, itu pasti serangan kiamat siber.'" },
      { id: "d", text: "'Investigasi keamanan tidak memerlukan bukti log sama sekali.'" }
    ],
    correctAnswer: "a"
  }
];

export const posttestQuestions = POSTTEST_ITEMS;
