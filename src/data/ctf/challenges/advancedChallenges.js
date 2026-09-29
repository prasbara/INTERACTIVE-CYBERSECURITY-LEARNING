/**
 * Category G: Advanced Forensics, Malware & Multi-Stage APT Incidents (Challenges RC-CTF-027 to RC-CTF-030)
 * Conforms to LAPS-Heuristik SOC Investigation Architecture:
 * Case File -> Mission -> Evidence -> Timeline -> Investigation -> Flag -> Mitigation -> Reflection
 */

export const ADVANCED_CHALLENGES = [
  {
    id: "RC-CTF-027",
    aliasId: "ctf-027",
    title: "ProFTPD mod_copy & Critical Evidence Selection (Klik Semua Log Belum Tentu Benar)",
    category: "forensics",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    xpReward: 100,
    sourceId: "cve-2015-3306",
    affectedTechnology: "ProFTPD 1.3.5 with mod_copy module",
    mitreTechniques: ["T1190", "T1505.003"],
    lapsStage: "review",
    attackCategory: "forensics",
    realWorldCase: "Server FTP internal terdeteksi menerima perintah mod_copy tak terotentikasi SITE CPFR dan SITE CPTO yang digunakan penyerang untuk menyalin payload webshell dari temporary cache ke direktori webroot publik /var/www/html/.",
    flag: "FLAG{KLIK_SEMUA_LOG_BELUM_TENTU_BENAR}",
    flagConfig: {
      value: "FLAG{KLIK_SEMUA_LOG_BELUM_TENTU_BENAR}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Pilih bukti investigasi secara cermat: telaah perintah mod_copy tanpa terjebak mengklik semua file log yang tidak relevan.",
      successCriteria: [
        "Analisis perintah SITE CPFR dan SITE CPTO pada proftpd.log",
        "Identifikasi nama berkas webshell /var/www/html/shell_copy.php",
        "Korelasikan dengan eksekusi HTTP GET pada access.log",
        "Submit flag dan rancang penonaktifan modul mod_copy"
      ]
    },
    caseBrief: {
      incidentCode: "INC-ADV-027",
      targetHost: "FTP-WEB-SRV (10.0.10.27)",
      detectionSource: "ProFTPD Command Log & Nginx Access Log",
      narrative: "Server FTP internal terdeteksi menerima perintah mod_copy tak terotentikasi SITE CPFR dan SITE CPTO yang digunakan penyerang untuk menyalin payload webshell dari temporary cache ke direktori webroot publik /var/www/html/.",
      mission: [
        "1. Analisis perintah SITE CPFR dan SITE CPTO pada proftpd.log.",
        "2. Identifikasi nama berkas webshell yang disuntikkan ke webroot.",
        "3. Dapatkan flag eksploitasi modul mod_copy ProFTPD."
      ]
    },
    timeline: [
      { time: "13:10:01 WIB", sensor: "proftpd.log", event: "198.51.100.72 connected to ProFTPD 1.3.5" },
      { time: "13:10:02 WIB", sensor: "proftpd.log", event: "SITE CPFR /proc/self/cmdline (350 ready for destination)" },
      { time: "13:10:03 WIB", sensor: "proftpd.log", event: "SITE CPTO /var/www/html/shell_copy.php (250 Copy successful)" },
      { time: "13:10:08 WIB", sensor: "access.log", event: "GET /shell_copy.php?cmd=id status 200 executed by curl/7.68.0" }
    ],
    evidencePack: [
      {
        id: "ev-027-a",
        fileName: "proftpd.log",
        fileType: "ftp_log",
        description: "Catatan transaksi perintah FTP daemon",
        content: `2026-09-28 13:10:01 [1402] 198.51.100.72: Connected to ProFTPD 1.3.5
2026-09-28 13:10:02 [1402] 198.51.100.72: SITE CPFR /proc/self/cmdline
2026-09-28 13:10:02 [1402] 198.51.100.72: 350 File or directory exists, ready for destination name
2026-09-28 13:10:03 [1402] 198.51.100.72: SITE CPTO /var/www/html/shell_copy.php
2026-09-28 13:10:03 [1402] 198.51.100.72: 250 Copy successful`
      },
      {
        id: "ev-027-b",
        fileName: "access.log",
        fileType: "web_access",
        description: "Log akses Nginx web server target",
        content: `198.51.100.72 - - [28/Sep/2026:13:10:08 +0700] "GET /shell_copy.php?cmd=id HTTP/1.1" 200 48 "-" "curl/7.68.0"`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Perintah FTP SITE apa yang digunakan untuk menentukan berkas sumber yang akan disalin?",
        type: "single_choice",
        options: [
          { id: "a", text: "SITE CPFR" },
          { id: "b", text: "SITE CPTO" },
          { id: "c", text: "SITE EXEC" },
          { id: "d", text: "SITE CHMOD" }
        ],
        correctAnswer: "a",
        explanation: "SITE CPFR (Copy From) adalah perintah ProFTPD mod_copy untuk menentukan file sumber."
      },
      {
        id: "q2",
        question: "Ke direktori webroot mana berkas PHP berbahaya ditulis oleh penyerang?",
        type: "single_choice",
        options: [
          { id: "a", text: "/var/www/html/shell_copy.php" },
          { id: "b", text: "/root/shell.php" },
          { id: "c", text: "/tmp/shell.php" },
          { id: "d", text: "/etc/proftpd.conf" }
        ],
        correctAnswer: "a",
        explanation: "Log mencatat SITE CPTO /var/www/html/shell_copy.php."
      }
    ],
    hints: [
      { tier: 1, text: "Pilih berkas bukti yang memuat perintah modifikasi file langsung; klik semua log belum tentu menemukan akar masalah." },
      { tier: 2, text: "Periksa perintah SITE CPFR dan SITE CPTO pada berkas proftpd.log." },
      { tier: 3, text: "Pemilihan bukti yang teliti membuktikan injeksi webshell dari temporary cache ke direktori webroot." }
    ],
    mitigationSummary: "Update ProFTPD ke versi >= 1.3.5a atau nonaktifkan modul mod_copy pada konfigurasi proftpd.conf.",
    mitigation: [
      "Perbarui daemon ProFTPD ke rilis bebas kerentanan (>= 1.3.5a)",
      "Nonaktifkan modul mod_copy pada berkas /etc/proftpd/modules.conf",
      "Kunci hak tulis direktori /var/www/html agar user daemon FTP tidak dapat membuat file PHP"
    ],
    reflection: [
      "Mengapa analis tidak boleh sekadar mengklik semua log tanpa rencana pemilihan bukti?",
      "Evidence mana yang membuktikan perintah FTP dieksekusi tanpa memerlukan login valid?",
      "Apakah ada use case legal untuk perintah SITE CPTO di server produksi?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat log akses web server?",
      "Mitigasi apa yang memisahkan direktori unggahan berkas dari folder eksekusi skrip?"
    ],
    lapsMapping: {
      understand: "Memahami bahaya fungsionalitas modul copy tanpa otentikasi (mod_copy).",
      plan: "Mengkorelasikan log FTP dan log web server untuk melacak pembuatan webshell.",
      execute: "Mengekstrak perintah CPFR/CPTO dan request eksekusi HTTP.",
      review: "Menerapkan prinsip segregasi hak akses webroot dan nonaktifkan modul tak terpakai."
    }
  },
  {
    id: "RC-CTF-028",
    aliasId: "ctf-028",
    title: "Multi-Sensor Correlation: Redis + SSH (Satu Log Tidak Cukup)",
    category: "endpoint",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 175,
    sourceId: "redis-unauth-rce",
    affectedTechnology: "Redis In-Memory Data Store & OpenSSH",
    mitreTechniques: ["T1190", "T1078"],
    lapsStage: "review",
    attackCategory: "endpoint",
    realWorldCase: "Port 6379 Redis terekspos tanpa otentikasi password (requirepass). Penyerang menggunakan perintah CONFIG SET dir dan dbfilename untuk menimpa berkas /root/.ssh/authorized_keys dengan kunci publik penyerang.",
    flag: "FLAG{SATU_LOG_TIDAK_CUKUP}",
    flagConfig: {
      value: "FLAG{SATU_LOG_TIDAK_CUKUP}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Buktikan prinsip multi-sensor correlation: satu log aplikasi Redis saja tidak cukup untuk membuktikan kompromi sistem tanpa dikorelasikan dengan log autentikasi SSH.",
      successCriteria: [
        "Analisis redis.log untuk mendeteksi perintah CONFIG SET dir /root/.ssh/",
        "Korelasikan dengan auth.log yang mencatat Accepted publickey for root",
        "Buktikan sinkronisasi timestamp antara injeksi basis data dan login terminal",
        "Submit flag dan rancang konfigurasi bind localhost serta requirepass"
      ]
    },
    caseBrief: {
      incidentCode: "INC-ADV-028",
      targetHost: "CACHE-SRV-01 (10.0.30.28)",
      detectionSource: "Redis Command Log & /var/log/auth.log",
      narrative: "Port 6379 Redis terekspos tanpa otentikasi password (requirepass). Penyerang menggunakan perintah CONFIG SET dir dan dbfilename untuk menimpa berkas /root/.ssh/authorized_keys dengan kunci publik penyerang.",
      mission: [
        "1. Analisis perintah Redis CONFIG SET dir dan dbfilename.",
        "2. Identifikasi berkas sistem yang dijadikan sasaran penulisan dump Redis.",
        "3. Dapatkan flag eksploitasi injeksi kunci SSH Redis."
      ]
    },
    timeline: [
      { time: "14:02:11 WIB", sensor: "redis.log", event: "Client 198.51.100.90 connected to Redis port 6379 without AUTH" },
      { time: "14:02:12 WIB", sensor: "redis.log", event: "CONFIG SET dir /root/.ssh/ executed" },
      { time: "14:02:13 WIB", sensor: "redis.log", event: "CONFIG SET dbfilename authorized_keys executed" },
      { time: "14:02:15 WIB", sensor: "redis.log", event: "DB saved on disk with attacker public key" },
      { time: "14:02:20 WIB", sensor: "auth.log", event: "sshd: Accepted publickey for root from 198.51.100.90 port 54130 ssh2" }
    ],
    evidencePack: [
      {
        id: "ev-028-a",
        fileName: "redis.log",
        fileType: "redis_log",
        description: "Catatan eksekusi perintah Redis server",
        content: `14:02:11.102 * Client 198.51.100.90:54122 connected without AUTH
14:02:12.441 * Executing: CONFIG SET dir /root/.ssh/
14:02:13.119 * Executing: CONFIG SET dbfilename authorized_keys
14:02:14.002 * Executing: SET crack "\\n\\nssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQ... attacker@kali\\n\\n"
14:02:15.512 * DB saved on disk`
      },
      {
        id: "ev-028-b",
        fileName: "auth.log",
        fileType: "syslog",
        description: "Catatan SSH server sesaat setelah dump redis disimpan",
        content: `Sep 28 14:02:20 cache-srv sshd[6102]: Accepted publickey for root from 198.51.100.90 port 54130 ssh2: RSA SHA256:abcd1234...`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Direktori target apa yang diatur oleh penyerang menggunakan perintah 'CONFIG SET dir'?",
        type: "single_choice",
        options: [
          { id: "a", text: "/root/.ssh/" },
          { id: "b", text: "/tmp/" },
          { id: "c", text: "/var/lib/redis/" },
          { id: "d", text: "/etc/nginx/" }
        ],
        correctAnswer: "a",
        explanation: "CONFIG SET dir /root/.ssh/ mengarahkan lokasi penulisan file dump database ke folder SSH milik akun root."
      },
      {
        id: "q2",
        question: "Konfigurasi Redis apa yang wajib diaktifkan untuk mewajibkan password pada port 6379?",
        type: "single_choice",
        options: [
          { id: "a", text: "requirepass <strong_password>" },
          { id: "b", text: "daemonize no" },
          { id: "c", text: "port 80" },
          { id: "d", text: "maxmemory 2gb" }
        ],
        correctAnswer: "a",
        explanation: "Direktif 'requirepass' pada redis.conf mewajibkan klien mengirimkan perintah AUTH sebelum dapat mengeksekusi instruksi database."
      }
    ],
    hints: [
      { tier: 1, text: "Satu log tunggal tidak cukup untuk memvalidasi insiden; korelasikan log aplikasi dengan log autentikasi OS." },
      { tier: 2, text: "Bandingkan timestamp saat CONFIG SET dbfilename authorized_keys dieksekusi dengan event Accepted publickey pada auth.log." },
      { tier: 3, text: "Korelasi multi-sensor menegaskan bahwa injeksi kunci SSH berhasil membuka pintu masuk root bagi penyerang." }
    ],
    mitigationSummary: "Ikat Redis hanya ke 127.0.0.1 (bind 127.0.0.1), aktifkan requirepass, nonaktifkan atau rename perintah berbahaya (rename-command CONFIG \"\").",
    mitigation: [
      "Ikat konfigurasi Redis hanya pada loopback address: bind 127.0.0.1 ::1",
      "Tetapkan kata sandi autentikasi yang kuat pada direktif requirepass",
      "Ganti nama (rename) atau nonaktifkan perintah berisiko tinggi: rename-command CONFIG \"\""
    ],
    reflection: [
      "Mengapa korelasi data lintas sensor (multi-sensor telemetry) mutlak diperlukan dalam SOC?",
      "Evidence mana yang membuktikan injeksi file dump Redis berhasil digunakan untuk login SSH?",
      "Apakah ada kemungkinan false positive jika sysadmin menggunakan script automasi Ansible?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat isi berkas /root/.ssh/authorized_keys?",
      "Mitigasi apa yang mencegah basis data in-memory diakses langsung dari jaringan eksternal?"
    ],
    lapsMapping: {
      understand: "Memahami bahaya mengekspos in-memory database tanpa otentikasi ke publik.",
      plan: "Menganalisis manipulasi konfigurasi runtime Redis dan efeknya pada file system host.",
      execute: "Mengekstrak perintah CONFIG SET dan pembobolan akun root via SSH public key.",
      review: "Merumuskan standar hardening basis data (binding loopback, firewall internal, renamed commands)."
    }
  },
  {
    id: "RC-CTF-029",
    aliasId: "ctf-029",
    title: "LAPS-Heuristik Capstone: Comprehensive Ransomware Defense (LAPS Sampai Flag)",
    category: "malware",
    difficulty: "advanced",
    estimatedMinutes: 25,
    xpReward: 200,
    sourceId: "cisa-ransomware-vss",
    affectedTechnology: "Unified Enterprise Telemetry (Sysmon, Suricata NIDS, Auth, DNS)",
    mitreTechniques: ["T1490", "T1486", "T1110", "T1071"],
    lapsStage: "review",
    attackCategory: "malware",
    realWorldCase: "Sebelum melakukan enkripsi massal terhadap server file sekolah, ransomware mengeksekusi penghapusan shadow copy (vssadmin Delete Shadows) dan mematikan recovery Windows di tengah berbagai traffic noise dan decoy alert.",
    flag: "FLAG{LAPS_SAMPAI_FLAG}",
    flagConfig: {
      value: "FLAG{LAPS_SAMPAI_FLAG}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Selesaikan siklus investigasi penuh LAPS-Heuristik: Memahami Masalah -> Merencanakan Pemecahan -> Melaksanakan Rencana -> Meninjau Kembali (Refleksi). Analisis bukti otentikasi, sensor IDS, sysmon process, dan DNS untuk menggagalkan fase pre-encryption ransomware.",
      successCriteria: [
        "Memahami Masalah: Rancang hipotesis serangan dan petakan aset korban",
        "Merencanakan: Pisahkan bukti serangan nyata dari decoy false positive pada DNS",
        "Melaksanakan: Analisis perintah vssadmin Delete Shadows /All /Quiet dan bcdedit",
        "Meninjau Kembali: Ekstrak IOC, tentukan mitigasi offline backup, dan submit flag"
      ]
    },
    caseBrief: {
      incidentCode: "INC-ADV-029",
      targetHost: "WIN-FILE-SHARE (10.0.50.29)",
      detectionSource: "Sysmon Event ID 1, Windows Event 4688, Suricata NIDS & DNS Telemetry",
      narrative: "Sebelum melakukan enkripsi massal terhadap server file sekolah, ransomware mengeksekusi penghapusan shadow copy (vssadmin Delete Shadows) dan mematikan recovery Windows di tengah berbagai traffic noise dan decoy alert.",
      mission: [
        "1. Memahami masalah dan membentuk hipotesis serangan pra-enkripsi ransomware.",
        "2. Memilih bukti relevan dan menyingkirkan decoy/false positive.",
        "3. Melakukan rekonstruksi timeline eksekusi proses vssadmin dan bcdedit.",
        "4. Menentukan mitigasi cadangan offline dan merefleksikan validasi keputusan (LAPS Sampai Flag)."
      ]
    },
    timeline: [
      { time: "18:29:10 WIB", sensor: "dns_telemetry.log", event: "Benign DNS query: update.microsoft.com resolved (Decoy noise)" },
      { time: "18:29:45 WIB", sensor: "auth_audit.log", event: "Failed logins: 3 failed attempts on Guest, followed by Administrator session opened" },
      { time: "18:30:02 WIB", sensor: "sysmon_vssadmin.json", event: "Sysmon Event 1: vssadmin.exe Delete Shadows /All /Quiet executed by encryptor.exe" },
      { time: "18:30:05 WIB", sensor: "sysmon_vssadmin.json", event: "Sysmon Event 1: bcdedit.exe /set {default} recoveryenabled No executed" },
      { time: "18:30:12 WIB", sensor: "suricata_nids.log", event: "ALERT: ET MALWARE Ransomware Pre-Encryption Activity Detected (T1490)" }
    ],
    evidencePack: [
      {
        id: "ev-029-a",
        fileName: "sysmon_vssadmin.json",
        fileType: "sysmon_json",
        description: "Catatan eksekusi proses penghancuran cadangan bayangan",
        content: `[
  {
    "EventID": 1,
    "TimeCreated": "2026-09-28T18:30:02Z",
    "Image": "C:\\\\Windows\\\\System32\\\\vssadmin.exe",
    "CommandLine": "vssadmin.exe Delete Shadows /All /Quiet",
    "ParentImage": "C:\\\\Users\\\\Admin\\\\AppData\\\\Local\\\\Temp\\\\encryptor.exe",
    "User": "NT AUTHORITY\\\\SYSTEM"
  },
  {
    "EventID": 1,
    "TimeCreated": "2026-09-28T18:30:05Z",
    "Image": "C:\\\\Windows\\\\System32\\\\bcdedit.exe",
    "CommandLine": "bcdedit.exe /set {default} recoveryenabled No",
    "ParentImage": "C:\\\\Users\\\\Admin\\\\AppData\\\\Local\\\\Temp\\\\encryptor.exe",
    "User": "NT AUTHORITY\\\\SYSTEM"
  }
]`
      },
      {
        id: "ev-029-b",
        fileName: "suricata_nids.log",
        fileType: "nids_alert",
        description: "Peringatan sensor deteksi ancaman jaringan NIDS",
        content: `09/28-18:30:12.102 [**] [1:2029910:1] ET MALWARE Ransomware Inhibiting System Recovery (T1490) [**] {TCP} 10.0.50.29 -> 198.51.100.99:443
09/28-18:30:15.441 [**] [1:2000001:1] ET INFO Benign NTP Clock Sync Request [**] {UDP} 10.0.50.29 -> 10.0.0.1:123`
      },
      {
        id: "ev-029-c",
        fileName: "ransom_note.txt",
        fileType: "text",
        description: "Pesan tebusan yang ditinggalkan malware di desktop",
        content: `ALL YOUR CRITICAL DATABASE AND STUDENT FILES ARE ENCRYPTED!
DO NOT TRY TO RESTORE FROM SHADOW COPIES, THEY ARE ALREADY DELETED.
Contact payment-desk@secure-decrypt.test with ID #SMK-LOCK-991`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "[LAPS: Memahami Masalah] Apa indikator utama bahwa sistem sedang mengalami fase persiapan serangan ransomware?",
        type: "single_choice",
        options: [
          { id: "a", text: "Proses vssadmin.exe dipanggil dengan parameter 'Delete Shadows /All /Quiet' untuk menghapus backup bayangan" },
          { id: "b", text: "Adanya sinkronisasi waktu NTP port 123" },
          { id: "c", text: "Pengguna mengganti wallpaper desktop" },
          { id: "d", text: "Koneksi kabel LAN dicabut" }
        ],
        correctAnswer: "a",
        explanation: "Penghapusan shadow copy (vssadmin Delete Shadows) dan deaktivasi recovery boot (bcdedit) adalah teknik standar ransomware sebelum mengenkripsi file."
      },
      {
        id: "q2",
        question: "[LAPS: Merencanakan & Memilih Bukti] Di antara berkas log yang tersedia, bukti mana yang membuktikan perintah penghapusan recovery dieksekusi?",
        type: "single_choice",
        options: [
          { id: "a", text: "sysmon_vssadmin.json (Event ID 1 dengan CommandLine vssadmin dan bcdedit)" },
          { id: "b", text: "Log NTP sync request" },
          { id: "c", text: "Daftar font Windows" },
          { id: "d", text: "Browser cookie cache" }
        ],
        correctAnswer: "a",
        explanation: "Sysmon Event ID 1 menangkap proses biner dan baris perintah spesifik yang diluncurkan oleh induk proses encryptor.exe."
      },
      {
        id: "q3",
        question: "[LAPS: Melaksanakan & Triase] Bagaimana Anda mengklasifikasikan insiden ini pada dashboard SOC?",
        type: "single_choice",
        options: [
          { id: "a", text: "True Positive — Upaya perusakan pemulihan sistem (T1490) terkonfirmasi secara pasti" },
          { id: "b", text: "False Positive — Ini adalah rutinitas defragmentasi harddisk" },
          { id: "c", text: "Need More Evidence — Belum ada tanda-tanda ancaman sama sekali" },
          { id: "d", text: "Normal User Error" }
        ],
        correctAnswer: "a",
        explanation: "Korelasi antara eksekusi biner di Temp, penghapusan bayangan, dan alert Suricata T1490 memastikan True Positive insiden kritis."
      },
      {
        id: "q4",
        question: "[LAPS: Meninjau Kembali & Mitigasi] Strategi pencadangan data apakah yang kebal dari penghapusan vssadmin ini?",
        type: "single_choice",
        options: [
          { id: "a", text: "Immutable Air-Gapped Offline Backup (Aturan Cadangan 3-2-1)" },
          { id: "b", text: "Menyalin file ke flashdisk yang selalu tertancap di komputer yang sama" },
          { id: "c", text: "Membiarkan file di folder Downloads" },
          { id: "d", text: "Mengganti nama ekstensi file secara manual" }
        ],
        correctAnswer: "a",
        explanation: "Cadangan data yang tidak dapat diubah (immutable) dan terputus dari jaringan (air-gapped) tidak dapat dihapus oleh malware meskipun memiliki hak SYSTEM pada endpoint."
      }
    ],
    hints: [
      { tier: 1, text: "Terapkan empat tahap LAPS-Heuristik: Memahami Masalah, Merencanakan Pemecahan, Melaksanakan Rencana, dan Meninjau Kembali." },
      { tier: 2, text: "Periksa baris eksekusi vssadmin dan bcdedit pada sysmon_vssadmin.json serta pisahkan dari aktivitas benign pada DNS." },
      { tier: 3, text: "Melalui alur LAPS-Heuristik yang terstruktur, korelasi bukti multi-sensor membawa Anda menuju flag validasi." }
    ],
    mitigationSummary: "Terapkan aturan Attack Surface Reduction (ASR) 'Block executable files from running unless they meet a prevalence, age, or trusted list criterion', batasi akses vssadmin.exe, dan pertahankan offline immutable backup (aturan 3-2-1).",
    mitigation: [
      "Isolasi host WIN-FILE-SHARE dari jaringan sekolah secara seketika",
      "Terapkan aturan ASR (Attack Surface Reduction) untuk memblokir pemanggilan vssadmin oleh proses non-admin",
      "Pulihkan data dari cadangan offline immutable air-gapped sesuai aturan 3-2-1"
    ],
    reflection: [
      "Bagaimana kerangka LAPS-Heuristik membantu Anda menganalisis insiden ransomware secara tenang dan terarah?",
      "Evidence mana yang paling meyakinkan bahwa shadow copies telah dihancurkan sebelum enkripsi?",
      "Apakah ada kemungkinan false positive jika sistem operasi melakukan pembersihan disk otomatis?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat proses induk encryptor.exe?",
      "Mitigasi apa yang menjamin kelangsungan operasional sekolah jika seluruh server terenkripsi?"
    ],
    lapsMapping: {
      understand: "Memahami fase pre-encryption malware ransomware yang berusaha menggagalkan recovery.",
      plan: "Menganalisis proses biner sistem Microsoft (vssadmin, bcdedit) yang dipanggil oleh malware.",
      execute: "Mengekstrak parameter baris perintah dan teknik MITRE T1490.",
      review: "Menerapkan strategi cadangan data yang kebal ransomware (immutable air-gapped backup)."
    }
  },
  {
    id: "RC-CTF-030",
    aliasId: "ctf-030",
    title: "Grand Final SOC Analyst Challenge: Full APT Attack Triage (Analis Muda Jangan Asal Tuduh)",
    category: "forensics",
    difficulty: "expert",
    estimatedMinutes: 30,
    xpReward: 250,
    sourceId: "cisa-apt-playbook",
    affectedTechnology: "Enterprise Hybrid Network (DMZ Web, AD DC, Gateway Firewall)",
    mitreTechniques: ["T1190", "T1059", "T1053", "T1021", "T1041"],
    lapsStage: "review",
    attackCategory: "forensics",
    realWorldCase: "Sebuah kelompok ancaman canggih (APT) melancarkan serangan berantai penuh melintasi perimeter DMZ, pergerakan lateral SMB ke Active Directory DC, hingga eksfiltrasi data terenkripsi. Analis muda ditantang merekonstruksi seluruh siklus serangan berdasarkan bukti faktual.",
    flag: "FLAG{ANALIS_MUDA_JANGAN_ASAL_TUDUH}",
    flagConfig: {
      value: "FLAG{ANALIS_MUDA_JANGAN_ASAL_TUDUH}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Tantangan Final Analis SOC: Rekonstruksi siklus lengkap serangan Advanced Persistent Threat (APT). Korelasikan bukti multi-sumber, singkirkan decoy bising dan false positive, ekstraksi IOC kredensial, dan rancang mitigasi Zero Trust komprehensif. Jangan asal menuduh tanpa bukti ilmiah!",
      successCriteria: [
        "Rekonstruksi linimasa 4 stage serangan: Initial Access -> Persistence -> Lateral Movement -> Exfiltration",
        "Identifikasi aset pertama yang ditembus (DMZ-WEB) dan metode pergerakan ke WIN-DC",
        "Singkirkan decoy dan verifikasi volume file eksfiltrasi backup_all.7z (450MB)",
        "Ekstraksi IOC lengkap dan submit flag final analisis SOC"
      ]
    },
    caseBrief: {
      incidentCode: "INC-ADV-030",
      targetHost: "ENTERPRISE-NETWORK-SMK",
      detectionSource: "Unified SIEM Timeline, Perimeter Firewall, Auth Log & Multi-Sensor Telemetry",
      narrative: "Sebuah kelompok ancaman persisten (APT) melancarkan serangan berantai penuh: dimulai dari eksploitasi web DMZ, instalasi persistensi cron, pergerakan lateral ke Domain Controller melalui SMB, dan eksfiltrasi data via HTTPS terenkripsi.",
      mission: [
        "1. Rekonstruksi urutan fase serangan dari Recon, Initial Access, hingga Exfiltration.",
        "2. Identifikasi aset pertama yang ditembus dan vektor pergerakan lateralnya.",
        "3. Tentukan volume data dan IP tujuan eksfiltrasi.",
        "4. Dapatkan flag puncak investigasi insiden multi-tahap."
      ]
    },
    timeline: [
      { time: "02:14:00 WIB", sensor: "incident_timeline.json", event: "Stage 1 - Initial Access: DMZ-WEB (192.168.10.10) breached via SQLi webshell upload" },
      { time: "02:25:30 WIB", sensor: "incident_timeline.json", event: "Stage 2 - Persistence: Cron reverse stager to 198.51.100.200:8443 established" },
      { time: "03:10:15 WIB", sensor: "incident_timeline.json", event: "Stage 3 - Lateral Movement: SMB connection from 192.168.10.10 to WIN-DC (192.168.20.5)" },
      { time: "03:45:00 WIB", sensor: "incident_timeline.json", event: "Stage 4 - Exfiltration: backup_all.7z (450MB) transferred to 203.0.113.99:443" }
    ],
    evidencePack: [
      {
        id: "ev-030-a",
        fileName: "incident_timeline.json",
        fileType: "timeline_json",
        description: "Kronologi urutan kejadian hasil korelasi SIEM",
        content: `[
  {
    "stage": "Stage 1 - Initial Access",
    "timestamp": "2026-09-28T02:14:00Z",
    "host": "DMZ-WEB (192.168.10.10)",
    "description": "Exploitation of public web application via SQL Injection -> Web shell upload (cmd.jsp)"
  },
  {
    "stage": "Stage 2 - Persistence",
    "timestamp": "2026-09-28T02:25:30Z",
    "host": "DMZ-WEB (192.168.10.10)",
    "description": "Creation of cron job executing reverse stager to 198.51.100.200:8443"
  },
  {
    "stage": "Stage 3 - Lateral Movement",
    "timestamp": "2026-09-28T03:10:15Z",
    "host": "WIN-DC (192.168.20.5)",
    "description": "SMB connection from 192.168.10.10 using stolen Service Account credentials (T1021.002)"
  },
  {
    "stage": "Stage 4 - Exfiltration",
    "timestamp": "2026-09-28T03:45:00Z",
    "host": "WIN-DC (192.168.20.5)",
    "description": "Archive 'backup_all.7z' transferred via HTTPS POST to 203.0.113.99 (Size: 450MB)"
  }
]`
      },
      {
        id: "ev-030-b",
        fileName: "siem_summary.txt",
        fileType: "text",
        description: "Ringkasan metrik insiden dari SOC Lead Analyst",
        content: `APT Incident Summary Report:
- Total Infected Hosts: 2 (DMZ-WEB, WIN-DC)
- Initial Compromise: DMZ-WEB (Port 80/443)
- Pivoting Method: SMB/RPC Lateral Movement across DMZ to Internal LAN
- Exfiltration Destination: 203.0.113.99:443
- Critical Impact: 450MB archived student records leaked.
- Decoy Noise Filtered: 1200 automated scan pings discarded as non-correlated noise.`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Aset mana yang menjadi titik masuk pertama (Initial Access) penyerang ke jaringan?",
        type: "single_choice",
        options: [
          { id: "a", text: "DMZ-WEB (192.168.10.10)" },
          { id: "b", text: "WIN-DC (192.168.20.5)" },
          { id: "c", text: "GATEWAY-FW (192.168.1.1)" },
          { id: "d", text: "BACKUP-NAS (192.168.20.100)" }
        ],
        correctAnswer: "a",
        explanation: "Timeline Stage 1 mencatat Initial Access terjadi pada host DMZ-WEB pukul 02:14:00Z."
      },
      {
        id: "q2",
        question: "Protokol apa yang digunakan penyerang untuk bergerak menyamping (Lateral Movement) dari DMZ-WEB ke WIN-DC?",
        type: "single_choice",
        options: [
          { id: "a", text: "SMB (Server Message Block / Port 445)" },
          { id: "b", text: "Telnet (Port 23)" },
          { id: "c", text: "FTP (Port 21)" },
          { id: "d", text: "SNMP (Port 161)" }
        ],
        correctAnswer: "a",
        explanation: "Stage 3 mencatat SMB connection from 192.168.10.10 ke WIN-DC menggunakan stolen service credentials."
      },
      {
        id: "q3",
        question: "Berapa ukuran file dan IP eksternal tujuan eksfiltrasi data pada Stage 4?",
        type: "single_choice",
        options: [
          { id: "a", text: "450MB ke IP 203.0.113.99" },
          { id: "b", text: "10MB ke IP 1.1.1.1" },
          { id: "c", text: "2GB ke IP 8.8.8.8" },
          { id: "d", text: "50KB ke IP 127.0.0.1" }
        ],
        correctAnswer: "a",
        explanation: "Stage 4 mencatat berkas backup_all.7z (450MB) ditransfer ke 203.0.113.99."
      }
    ],
    hints: [
      { tier: 1, text: "Sebagai analis muda profesional, bangun bukti secara teliti lintas sensor; jangan asal menuduh tanpa korelasi kuat." },
      { tier: 2, text: "Korelasikan rantai peristiwa dari web access log, active directory auth log, hingga firewall egress." },
      { tier: 3, text: "Korelasi lengkap dari Initial Access, Lateral Movement hingga Exfiltration membuktikan status APT secara konklusif." }
    ],
    mitigationSummary: "Terapkan segmentasi jaringan ketat antara DMZ dan Internal LAN (blokir port 445/SMB dari DMZ), amankan akun layanan Active Directory, aktifkan EDR di seluruh endpoint, dan monitor anomali volume traffic egress.",
    mitigation: [
      "Isolasi total host DMZ-WEB dan WIN-DC ke containment VLAN",
      "Blokir lalu lintas SMB port 445 dari zona DMZ menuju zona internal Active Directory",
      "Lakukan reset kredensial domain Kerberos krbtgt dua kali dan seluruh akun layanan",
      "Blokir IP eksfiltrasi C2 203.0.113.99 dan 198.51.100.200 pada perimeter gateway"
    ],
    reflection: [
      "Mengapa analis muda tidak boleh asal menuduh tanpa rekonstruksi bukti linimasa yang kokoh?",
      "Evidence mana yang membuktikan penyerang berhasil melakukan pergerakan lateral dari DMZ ke LAN internal?",
      "Bagaimana cara membedakan kebisingan alert rutin (decoy noise) dari aktivitas APT sesungguhnya?",
      "Bagaimana cara memvalidasi keputusanmu dengan meninjau volume byte pada log egress firewall?",
      "Mitigasi arsitektur apa (Zero Trust Architecture) yang membatasi pergerakan lateral meskipun web publik tertembus?"
    ],
    lapsMapping: {
      understand: "Memahami spektrum penuh siklus serangan siber canggih (Cyber Kill Chain / APT Lifecycle).",
      plan: "Menyusun strategi investigasi kronologis dan korelasi data lintas sensor (NIDS, HIDS, SIEM).",
      execute: "Mengekstrak bukti pada setiap stage: initial access, persistence, lateral movement, exfiltration.",
      review: "Merancang arsitektur Zero Trust dan defense-in-depth untuk menghentikan serangan bertingkat."
    }
  }
];
