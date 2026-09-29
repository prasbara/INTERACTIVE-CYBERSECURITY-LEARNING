export const CTF_CHALLENGE = {
  meetingId: 4,
  lapsStage: "review",
  title: "Integrated Blue Team Incident Response",
  description: "Server database nilai siswa (192.168.1.10) mengalami lonjakan koneksi gagal pada port autentikasi terminal. Tim jaringan mencurigai adanya perangkat di jaringan laboratorium (192.168.1.45) yang telah disusupi skrip otomasi penyerang.",
  evidenceStream: [
    "// EVIDENCE 1 & 4: AUTHENTICATION SYSLOG & TIMELINE STREAM",
    "08:14:32 WIB [AUTH.INFO] sshd[1402]: Failed password for invalid user root from 192.168.1.45 port 49152 ssh2",
    "08:14:35 WIB [AUTH.INFO] sshd[1405]: Failed password for invalid user admin from 192.168.1.45 port 49154 ssh2",
    "08:14:38 WIB [AUTH.INFO] sshd[1409]: Failed password for invalid user test from 192.168.1.45 port 49156 ssh2",
    "08:14:41 WIB [AUTH.WARN] sshd[1415]: Failed password for invalid user oracle from 192.168.1.45 port 49158 ssh2",
    "08:15:03 WIB [ALERT.CRIT] NIDS[2001221]: SIG=\"SSH Brute Force Attempt\" COUNT=94 DST=192.168.1.10:22",
    "// EVIDENCE 3 & 5: ENDPOINT HOST INVENTORY",
    "Host: LAB-PC-17 (IP: 192.168.1.45) | Lokasi: Laboratorium Komputer 2 | Pengguna Terdaftar: Siswa Kelas XI"
  ],
  validationQuestions: [
    {
      id: "m4-val-01",
      question: "Validasi 1: Berdasarkan korelasi bukti log kronologis di atas, jenis serangan apa yang terkonfirmasi secara pasti?",
      options: [
        { id: "a", text: "Serangan SSH Brute Force Dictionary Attack" },
        { id: "b", text: "Penyebaran virus melalui email phishing" },
        { id: "c", text: "Kerusakan fisik pada kabel fiber optic" },
        { id: "d", text: "Serangan Man-in-the-Middle pada protokol ARP" }
      ],
      correctAnswer: "a"
    },
    {
      id: "m4-val-02",
      question: "Validasi 2: Bukti konkret manakah yang paling kuat memvalidasi kesimpulan tersebut?",
      options: [
        { id: "a", text: "Lonjakan COUNT kegagalan otentikasi dari 12 menjadi 47 lalu 94 percobaan dalam kurun waktu kurang dari 1 menit" },
        { id: "b", text: "Fakta bahwa server tujuan memiliki port bernomor 22" },
        { id: "c", text: "Penggunaan sistem operasi Linux pada komputer laboratorium" },
        { id: "d", text: "Warna teks peringatan pada terminal yang berwarna merah" }
      ],
      correctAnswer: "a"
    },
    {
      id: "m4-val-03",
      question: "Validasi 3: Mengapa insiden ini dipastikan bukan sekadar siswa yang lupa password akunnya?",
      options: [
        { id: "a", text: "Karena syslog mencatat percobaan berbagai macam username default (root, admin, test, oracle) secara beruntun dalam interval detik" },
        { id: "b", text: "Karena siswa dilarang masuk ke laboratorium" },
        { id: "c", text: "Karena server tidak pernah menyimpan password siswa" },
        { id: "d", text: "Karena siswa selalu mengingat password mereka" }
      ],
      correctAnswer: "a"
    },
    {
      id: "m4-val-04",
      question: "Validasi 4: Mengapa alert NIDS tersebut diklasifikasikan sebagai True Positive yang valid?",
      options: [
        { id: "a", text: "Karena didukung oleh bukti nyata syslog host otentikasi dan pola frekuensi kegagalan ekstrem yang tidak wajar" },
        { id: "b", text: "Karena sistem IDS dibuat oleh vendor ternama" },
        { id: "c", text: "Karena jam di komputer menampilkan pukul 08:15 WIB" },
        { id: "d", text: "Karena switch jaringan tidak mengalami mati lampu" }
      ],
      correctAnswer: "a"
    },
    {
      id: "m4-val-05",
      question: "Validasi 5: Rekomendasi mitigasi teknis apa yang paling efektif dan tepat diterapkan pada server SSH sekolah?",
      options: [
        { id: "a", text: "Menerapkan Fail2ban untuk memblokir IP penyerang otomatis, menonaktifkan login root password, dan mewajibkan autentikasi Public Key" },
        { id: "b", text: "Menghapus software SSH dan menggantinya dengan Telnet yang tidak terenkripsi" },
        { id: "c", text: "Mematikan router sekolah setiap 10 menit sekali" },
        { id: "d", text: "Mengganti seluruh kabel jaringan di laboratorium komputer" }
      ],
      correctAnswer: "a"
    }
  ]
};

export const ctfChallengeData = {
  ...CTF_CHALLENGE,
  scenario: CTF_CHALLENGE.description,
  timeline: [
    { time: '08:14:32 WIB', sensor: 'sshd-syslog', event: 'Failed password for invalid user root from 192.168.1.45' },
    { time: '08:14:35 WIB', sensor: 'sshd-syslog', event: 'Failed password for invalid user admin from 192.168.1.45' },
    { time: '08:14:38 WIB', sensor: 'sshd-syslog', event: 'Failed password for invalid user test from 192.168.1.45' },
    { time: '08:15:03 WIB', sensor: 'NIDS-Suricata', event: 'ET SCAN Potential SSH Brute Force (94 attempts in 30s)' }
  ],
  logs: CTF_CHALLENGE.evidenceStream,
  questions: CTF_CHALLENGE.validationQuestions
};
