/**
 * Category A: Authentication Attacks (Challenges RC-CTF-001 to RC-CTF-005)
 * Conforms to LAPS-Heuristik SOC Investigation Architecture:
 * Case File -> Mission -> Evidence -> Timeline -> Investigation -> Flag -> Mitigation -> Reflection
 */

export const AUTH_CHALLENGES = [
  {
    id: "RC-CTF-001",
    aliasId: "ctf-001",
    title: "SSH Santai Tapi Brute Force",
    category: "authentication",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 50,
    sourceId: "cisa-aa21-131a",
    affectedTechnology: "OpenSSH 8.2p1 on Ubuntu Linux",
    mitreTechniques: ["T1110.001", "T1078"],
    lapsStage: "review",
    attackCategory: "authentication",
    realWorldCase: "Pusat Operasi Keamanan (SOC) mendeteksi peringatan kritis pada pukul 09:12 WIB. Sebuah host eksternal teramati melakukan percobaan autentikasi beruntun terhadap port 22 terminal server database sekolah.",
    flag: "FLAG{SSH_SANTAI_TAPI_BRUTE_FORCE}",
    flagConfig: {
      value: "FLAG{SSH_SANTAI_TAPI_BRUTE_FORCE}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Identifikasi alamat IP penyerang, akun korban yang disusupi, dan validasi keberhasilan eksploitasi SSH dictionary brute-force.",
      successCriteria: [
        "Identifikasi IP penyerang yang memicu peringatan berulang",
        "Temukan akun pengguna yang paling sering diserang dan berhasil dibobol",
        "Verifikasi sesi accepted password pada auth.log",
        "Submit flag investigasi dan rancang rekomendasi mitigasi fail2ban"
      ]
    },
    caseBrief: {
      incidentCode: "INC-AUTH-001",
      targetHost: "SRV-WEB-LINUX (192.168.10.15)",
      detectionSource: "Suricata NIDS Sensor DMZ & /var/log/auth.log",
      narrative: "Pusat Operasi Keamanan (SOC) mendeteksi peringatan kritis pada pukul 09:12 WIB. Sebuah host eksternal teramati melakukan percobaan autentikasi beruntun terhadap port 22 terminal server database sekolah.",
      mission: [
        "1. Identifikasi alamat IP penyerang yang memicu peringatan berulang.",
        "2. Temukan akun pengguna yang paling sering diserang.",
        "3. Verifikasi apakah ada sesi login yang berhasil ditembus oleh penyerang.",
        "4. Dapatkan flag bukti investigasi dan rekomendasikan aksi mitigasi darurat."
      ]
    },
    timeline: [
      { time: "09:12:01 WIB", sensor: "auth.log", event: "Failed password for invalid user root from 198.51.100.45 port 49152" },
      { time: "09:12:01 WIB", sensor: "Suricata NIDS", event: "ET SCAN Potential SSH Brute Force attempt detected" },
      { time: "09:12:05 WIB", sensor: "auth.log", event: "Failed password for user student from 198.51.100.45 port 49157" },
      { time: "09:12:07 WIB", sensor: "auth.log", event: "Accepted password for student from 198.51.100.45 port 49160 ssh2" },
      { time: "09:12:08 WIB", sensor: "auth.log", event: "pam_unix(sshd:session): session opened for user student by (uid=0)" }
    ],
    evidencePack: [
      {
        id: "ev-001-a",
        fileName: "auth.log",
        fileType: "syslog",
        description: "Catatan daemon autentikasi SSH server target",
        content: `Sep 28 09:12:01 srv-web sshd[1402]: Failed password for invalid user root from 198.51.100.45 port 49152 ssh2
Sep 28 09:12:02 srv-web sshd[1405]: Failed password for invalid user admin from 198.51.100.45 port 49153 ssh2
Sep 28 09:12:03 srv-web sshd[1409]: Failed password for invalid user test from 198.51.100.45 port 49154 ssh2
Sep 28 09:12:03 srv-web sshd[1412]: Failed password for invalid user oracle from 198.51.100.45 port 49155 ssh2
Sep 28 09:12:04 srv-web sshd[1416]: Failed password for invalid user guest from 198.51.100.45 port 49156 ssh2
Sep 28 09:12:05 srv-web sshd[1420]: Failed password for user student from 198.51.100.45 port 49157 ssh2
Sep 28 09:12:06 srv-web sshd[1424]: Failed password for user student from 198.51.100.45 port 49158 ssh2
Sep 28 09:12:07 srv-web sshd[1430]: Accepted password for student from 198.51.100.45 port 49160 ssh2
Sep 28 09:12:08 srv-web sshd[1430]: pam_unix(sshd:session): session opened for user student by (uid=0)`
      },
      {
        id: "ev-001-b",
        fileName: "suricata.fast.log",
        fileType: "nids_alert",
        description: "Log deteksi signature alert Suricata IDS",
        content: `09/28-09:12:01.4021 [**] [1:2001219:2] ET SCAN Potential SSH Brute Force [**] [Classification: Attempted Administrator Privilege Gain] [Priority: 1] {TCP} 198.51.100.45:49152 -> 192.168.10.15:22
09/28-09:12:05.1120 [**] [1:2001219:2] ET SCAN Potential SSH Brute Force [**] [COUNT=7] {TCP} 198.51.100.45 -> 192.168.10.15:22`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Berapa alamat IP penyerang yang melakukan automated brute force pada port SSH?",
        type: "single_choice",
        options: [
          { id: "a", text: "192.168.10.15" },
          { id: "b", text: "198.51.100.45" },
          { id: "c", text: "127.0.0.1" },
          { id: "d", text: "10.0.0.1" }
        ],
        correctAnswer: "b",
        explanation: "198.51.100.45 adalah IP publik asal yang mengirimkan koneksi TCP ke port 22 secara masif."
      },
      {
        id: "q2",
        question: "Akun mana yang akhirnya berhasil dibobol (Accepted password) oleh penyerang?",
        type: "single_choice",
        options: [
          { id: "a", text: "root" },
          { id: "b", text: "admin" },
          { id: "c", text: "student" },
          { id: "d", text: "oracle" }
        ],
        correctAnswer: "c",
        explanation: "Baris log 'Accepted password for student from 198.51.100.45' membuktikan akun 'student' berhasil disusupi."
      },
      {
        id: "q3",
        question: "Langkah mitigasi teknis apakah yang paling tepat diterapkan secara segera?",
        type: "single_choice",
        options: [
          { id: "a", text: "Format ulang sistem operasi server" },
          { id: "b", text: "Blokir IP 198.51.100.45 pada iptables/firewall dan ganti password akun student" },
          { id: "c", text: "Matikan sambungan kabel listrik gedung sekolah" },
          { id: "d", text: "Hapus software Suricata IDS" }
        ],
        correctAnswer: "b",
        explanation: "Pemblokiran IP sumber penyerang dan peremajaan kredensial akun yang disusupi adalah mitigasi tanggap darurat yang tepat."
      }
    ],
    hints: [
      { tier: 1, text: "Fokuskan perhatian pada pola login yang terjadi berulang kali dalam interval waktu yang pendek." },
      { tier: 2, text: "Periksa source IP pada auth.log dan hitung berapa kali authentication failure terjadi sebelum login berhasil." },
      { tier: 3, text: "Korelasi antara alert Suricata SSH Brute Force dan accepted session user student membuktikan serangan berhasil ditembus." }
    ],
    mitigationSummary: "Aktifkan fail2ban dengan threshold 5 percobaan gagal per 10 menit, wajibkan SSH Public Key Authentication, dan nonaktifkan password authentication.",
    mitigation: [
      "Terapkan Fail2ban dengan bantime 24 jam untuk IP dengan >5 kegagalan",
      "Nonaktifkan login berbasis password dan wajibkan SSH Ed25519 Public Key",
      "Pindahkan port SSH default ke non-standard port untuk mengurangi internet noise"
    ],
    reflection: [
      "Mengapa kamu yakin aktivitas tersebut merupakan serangan brute force bukan user lupa password?",
      "Evidence mana yang paling membuktikan bahwa penyerang berhasil masuk ke sistem?",
      "Apakah ada kemungkinan false positive jika seorang developer menjalankan cron script?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat session dibuka oleh PAM?",
      "Mitigasi apa yang sebaiknya diterapkan agar akun siswa tidak mudah disusupi?"
    ],
    lapsMapping: {
      understand: "Menginterpretasikan log SSH dan membedakan kegagalan login dari pembobolan akun.",
      plan: "Mengevaluasi kebutuhan fail2ban vs firewall blocking.",
      execute: "Memvalidasi baris accepted session dan korelasi IP sumber.",
      review: "Meninjau celah penggunaan password lemah pada akun pengguna."
    }
  },
  {
    id: "RC-CTF-002",
    aliasId: "ctf-002",
    title: "Password Spraying vs Human Error (Aku Bukan Bot Cuma Salah Password)",
    category: "authentication",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    xpReward: 100,
    sourceId: "cisa-aa21-131a",
    affectedTechnology: "Windows Server 2022 Active Directory / Kerberos",
    mitreTechniques: ["T1110.003", "T1078"],
    lapsStage: "review",
    attackCategory: "authentication",
    realWorldCase: "Berbeda dari brute-force biasa yang mencoba banyak password pada 1 akun, penyerang mencoba 1 kata sandi umum ('BulanIni2026!') terhadap puluhan akun karyawan sekaligus untuk menghindari lockout policy.",
    flag: "FLAG{AKU_BUKAN_BOT_CUMA_SALAH_PASSWORD}",
    flagConfig: {
      value: "FLAG{AKU_BUKAN_BOT_CUMA_SALAH_PASSWORD}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Menganalisis anomali kegagalan autentikasi horizontal Event ID 4625 dan membedakan kesalahan pengguna manusia dari serangan password spraying terotomasi.",
      successCriteria: [
        "Analisis pola Event ID 4625 (An account failed to log on)",
        "Identifikasi workstation yang menjadi titik peluncuran password spraying",
        "Tentukan akun yang berhasil disusupi melalui Event ID 4624",
        "Submit flag investigasi dan rekomendasikan MFA enforcement"
      ]
    },
    caseBrief: {
      incidentCode: "INC-AUTH-002",
      targetHost: "DC-PRIMARY.CORP.LOCAL (10.0.1.10)",
      detectionSource: "Windows Security Event Log (Event ID 4625)",
      narrative: "Berbeda dari brute-force biasa yang mencoba banyak password pada 1 akun, penyerang mencoba 1 kata sandi umum ('BulanIni2026!') terhadap puluhan akun karyawan sekaligus untuk menghindari lockout policy.",
      mission: [
        "1. Analisis pola Event ID 4625 (An account failed to log on).",
        "2. Identifikasi workstation yang menjadi titik peluncuran password spraying.",
        "3. Tentukan teknik mitigasi password policy yang efektif."
      ]
    },
    timeline: [
      { time: "10:14:02 WIB", sensor: "Security_4625.json", event: "EventID 4625 logon failure for ahmad.f from PC-FINANCE-04" },
      { time: "10:14:05 WIB", sensor: "Security_4625.json", event: "EventID 4625 logon failure for budi.s from PC-FINANCE-04" },
      { time: "10:14:08 WIB", sensor: "Security_4625.json", event: "EventID 4625 logon failure for citra.d from PC-FINANCE-04" },
      { time: "10:14:15 WIB", sensor: "Security_4624.json", event: "EventID 4624 logon success for eko.p from PC-FINANCE-04" }
    ],
    evidencePack: [
      {
        id: "ev-002-a",
        fileName: "Security_4625.json",
        fileType: "json",
        description: "Dump Windows Security Event Log Kerberos Pre-Authentication",
        content: `[
  {"EventID": 4625, "Time": "10:14:02", "TargetUserName": "ahmad.f", "Workstation": "PC-FINANCE-04", "IpAddress": "10.0.4.52", "Status": "0xC000006A"},
  {"EventID": 4625, "Time": "10:14:05", "TargetUserName": "budi.s", "Workstation": "PC-FINANCE-04", "IpAddress": "10.0.4.52", "Status": "0xC000006A"},
  {"EventID": 4625, "Time": "10:14:08", "TargetUserName": "citra.d", "Workstation": "PC-FINANCE-04", "IpAddress": "10.0.4.52", "Status": "0xC000006A"},
  {"EventID": 4625, "Time": "10:14:11", "TargetUserName": "dani.k", "Workstation": "PC-FINANCE-04", "IpAddress": "10.0.4.52", "Status": "0xC000006A"},
  {"EventID": 4624, "Time": "10:14:15", "TargetUserName": "eko.p", "Workstation": "PC-FINANCE-04", "IpAddress": "10.0.4.52", "LogonType": 3}
]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Workstation manakah yang menjadi asal penyebaran password spraying?",
        type: "single_choice",
        options: [
          { id: "a", text: "DC-PRIMARY" },
          { id: "b", text: "PC-FINANCE-04 (10.0.4.52)" },
          { id: "c", text: "GATEWAY-01" },
          { id: "d", text: "SRV-FILE" }
        ],
        correctAnswer: "b",
        explanation: "Seluruh percobaan otentikasi gagal maupun sukses berasal dari IP 10.0.4.52 (PC-FINANCE-04)."
      },
      {
        id: "q2",
        question: "Akun mana yang terkonfirmasi berhasil login (Event ID 4624 LogonType 3)?",
        type: "single_choice",
        options: [
          { id: "a", text: "ahmad.f" },
          { id: "b", text: "citra.d" },
          { id: "c", text: "eko.p" },
          { id: "d", text: "budi.s" }
        ],
        correctAnswer: "c",
        explanation: "Event 4624 mencatat logon berhasil untuk TargetUserName: eko.p."
      }
    ],
    hints: [
      { tier: 1, text: "Bandingkan pola human typo (1-2 kali gagal pada satu akun) dengan pola bot spraying yang menyerang banyak akun berbeda secara beraturan." },
      { tier: 2, text: "Periksa nilai TargetUserName dan Workstation pada record Event ID 4625 dan 4624." },
      { tier: 3, text: "Akun eko.p teramati berhasil login setelah serangkaian kegagalan horizontal dari workstation yang sama." }
    ],
    mitigationSummary: "Terapkan Multi-Factor Authentication (MFA), cegah penggunaan password musiman yang dapat ditebak, dan monitor Event ID 4625 horizontal spike.",
    mitigation: [
      "Wajibkan Multi-Factor Authentication (MFA) untuk seluruh akses Active Directory",
      "Gunakan Azure AD Password Protection untuk memblokir kata sandi pasaran",
      "Isolasi workstation PC-FINANCE-04 untuk pembersihan malware endpoint"
    ],
    reflection: [
      "Mengapa penyerang memilih password spraying dibanding brute force biasa?",
      "Bagaimana cara membedakan karyawan yang lupa password dari bot spraying?",
      "Apakah ada kemungkinan false positive jika admin menjalankan sync script?",
      "Mengapa MFA dapat menggagalkan serangan password spraying secara efektif?",
      "Langkah apa yang harus diambil terhadap host PC-FINANCE-04?"
    ],
    lapsMapping: {
      understand: "Membedakan karakteristik password spraying horizontal dari brute force vertikal.",
      plan: "Merumuskan kriteria alert SIEM untuk mendeteksi 1 sumber mencoba >5 akun dalam 1 menit.",
      execute: "Mengevaluasi bukti Event ID 4625 dan 4624.",
      review: "Meninjau efektivitas MFA dalam meredam teknik password spraying."
    }
  },
  {
    id: "RC-CTF-003",
    aliasId: "ctf-003",
    title: "Off-Hours Access & Log Analysis (Log Dulu Baru Panik)",
    category: "authentication",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    xpReward: 100,
    sourceId: "cisa-aa21-131a",
    affectedTechnology: "Microsoft Remote Desktop (RDP / Port 3389)",
    mitreTechniques: ["T1021.001", "T1078.002"],
    lapsStage: "review",
    attackCategory: "authentication",
    realWorldCase: "Sistem IDS mendeteksi koneksi RDP port 3389 aktif pada pukul 02:45 dini hari hari Minggu dari alamat IP VPN eksternal tanpa tiket lembur.",
    flag: "FLAG{LOG_DULU_BARU_PANIK}",
    flagConfig: {
      value: "FLAG{LOG_DULU_BARU_PANIK}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Analisis log sesi RDP di luar jam kerja untuk memverifikasi apakah akun cadangan telah disusupi oleh pihak luar.",
      successCriteria: [
        "Buktikan anomali waktu operasional pada rdp_sessions.log",
        "Identifikasi nama akun yang digunakan untuk login",
        "Periksa inisialisasi explorer.exe pada session ID 2",
        "Submit flag dan rekomendasikan penutupan akun dormant"
      ]
    },
    caseBrief: {
      incidentCode: "INC-AUTH-003",
      targetHost: "SRV-ADMIN-01 (192.168.1.5)",
      detectionSource: "Firewall Connection Log & Windows TerminalServices-LocalSessionManager",
      narrative: "Sistem IDS mendeteksi koneksi RDP port 3389 aktif pada pukul 02:45 dini hari hari Minggu dari alamat IP VPN eksternal tanpa tiket lembur.",
      mission: [
        "1. Buktikan adanya anomali waktu operasional (off-hours connection).",
        "2. Identifikasi akun yang digunakan dan IP remote eksternal.",
        "3. Tentukan rekomendasi isolasi workstation."
      ]
    },
    timeline: [
      { time: "02:44:12 WIB", sensor: "firewall.log", event: "CONN.ALLOW SRC=203.0.113.88:51221 -> DST=192.168.1.5:3389" },
      { time: "02:45:01 WIB", sensor: "rdp.log", event: "Session arbitration: User 'admin_cadangan' logged on from 203.0.113.88" },
      { time: "02:45:30 WIB", sensor: "rdp.log", event: "Explorer.exe initialized under session ID 2" }
    ],
    evidencePack: [
      {
        id: "ev-003-a",
        fileName: "rdp_sessions.log",
        fileType: "syslog",
        description: "Log koneksi sesi remote desktop",
        content: `2026-09-27 02:44:12 WIB [CONN.ALLOW] SRC=203.0.113.88:51221 -> DST=192.168.1.5:3389 PROTO=TCP
2026-09-27 02:45:01 WIB [RDP.AUTH] Session arbitration: User "admin_cadangan" logged on from 203.0.113.88
2026-09-27 02:45:30 WIB [RDP.SHELL] Explorer.exe initialized under session ID 2`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Akun mana yang digunakan untuk login RDP di luar jam kerja tersebut?",
        type: "single_choice",
        options: [
          { id: "a", text: "admin_cadangan" },
          { id: "b", text: "administrator" },
          { id: "c", text: "guest" },
          { id: "d", text: "operator" }
        ],
        correctAnswer: "a",
        explanation: "Baris log mencatat User 'admin_cadangan' logged on pada 02:45:01 WIB."
      }
    ],
    hints: [
      { tier: 1, text: "Jangan panik saat melihat alert malam hari; periksa timestamp dan log sesi sistem secara runtut." },
      { tier: 2, text: "Periksa baris RDP.AUTH pada rdp_sessions.log untuk melihat identitas user dan remote address." },
      { tier: 3, text: "Akun cadangan teridentifikasi membuka sesi shell di luar jadwal operasional tanpa otorisasi." }
    ],
    mitigationSummary: "Batasi akses RDP melalui VPN dengan MFA, nonaktifkan akun cadangan tak terpakai, dan terapkan time-based access restrictions.",
    mitigation: [
      "Nonaktifkan akun 'admin_cadangan' dan lakukan rotasi kata sandi seluruh admin",
      "Batasi port RDP 3389 hanya melalui VPN internal dengan otentikasi MFA",
      "Konfigurasikan pembatasan jam login (logon hours restriction) pada grup kebijakan AD"
    ],
    reflection: [
      "Mengapa analis SOC harus menelaah log terlebih dahulu sebelum panik mengambil tindakan?",
      "Evidence mana yang membuktikan sesi shell GUI benar-benar aktif?",
      "Bagaimana risiko dari memelihara akun cadangan (dormant accounts)?",
      "Bagaimana cara memvalidasi apakah koneksi tersebut dilakukan staf yang lembur?",
      "Mitigasi apa yang memastikan akses RDP tidak bisa ditembus dari internet publik?"
    ],
    lapsMapping: {
      understand: "Mengenali anomali waktu sebagai indikator kompromi kredensial.",
      plan: "Merencanakan pembatasan waktu login jaringan.",
      execute: "Mengecek log sesi Remote Desktop.",
      review: "Mengevaluasi kebijakan akun cadangan (dormant accounts)."
    }
  },
  {
    id: "RC-CTF-004",
    aliasId: "ctf-004",
    title: "Credential Stuffing & Suspicious IP Detection (IP-nya Nakal Bang)",
    category: "authentication",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    xpReward: 100,
    sourceId: "owasp-top10-sqli",
    affectedTechnology: "PHP Web Portal / Apache / MariaDB",
    mitreTechniques: ["T1110.004"],
    lapsStage: "review",
    attackCategory: "authentication",
    realWorldCase: "Sebuah botnet mengirimkan ribuan pasangan username dan password yang diduga berasal dari kebocoran data situs lain (credential dump) ke endpoint /api/login.",
    flag: "FLAG{IP_NYA_NAKAL_BANG}",
    flagConfig: {
      value: "FLAG{IP_NYA_NAKAL_BANG}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Analisis log akses web portal untuk mengidentifikasi alamat IP agresif yang mengeksekusi credential stuffing secara masif.",
      successCriteria: [
        "Hitung rasio respons status HTTP 401 (Unauthorized) vs 200 (OK)",
        "Identifikasi user-agent otomasi python-requests",
        "Verifikasi IP sumber penyerang 198.51.100.12",
        "Submit flag dan rekomendasikan proteksi CAPTCHA serta IP rate-limiting"
      ]
    },
    caseBrief: {
      incidentCode: "INC-AUTH-004",
      targetHost: "PORTAL-SISWA (10.10.10.50)",
      detectionSource: "Nginx Access Log & WAF Anomaly Detector",
      narrative: "Sebuah botnet mengirimkan ribuan pasangan username dan password yang diduga berasal dari kebocoran data situs lain (credential dump) ke endpoint /api/login.",
      mission: [
        "1. Hitung rasio respons status HTTP 401 (Unauthorized) vs 200 (OK).",
        "2. Identifikasi user-agent bot otomasi yang digunakan.",
        "3. Tentukan mekanisme proteksi CAPTCHA / Rate Limiting yang sesuai."
      ]
    },
    timeline: [
      { time: "08:00:01 WIB", sensor: "nginx.access", event: "POST /api/login status 401 from 198.51.100.12 user-agent: python-requests" },
      { time: "08:00:02 WIB", sensor: "nginx.access", event: "POST /api/login status 401 from 198.51.100.12 user-agent: python-requests" },
      { time: "08:00:04 WIB", sensor: "nginx.access", event: "POST /api/login status 200 from 198.51.100.12 user-agent: python-requests" }
    ],
    evidencePack: [
      {
        id: "ev-004-a",
        fileName: "portal_access.log",
        fileType: "web_access",
        description: "Cuplikan access log endpoint login",
        content: `198.51.100.12 - - [29/Sep/2026:08:00:01 +0700] "POST /api/login HTTP/1.1" 401 128 "python-requests/2.28.1"
198.51.100.12 - - [29/Sep/2026:08:00:02 +0700] "POST /api/login HTTP/1.1" 401 128 "python-requests/2.28.1"
198.51.100.12 - - [29/Sep/2026:08:00:03 +0700] "POST /api/login HTTP/1.1" 401 128 "python-requests/2.28.1"
198.51.100.12 - - [29/Sep/2026:08:00:04 +0700] "POST /api/login HTTP/1.1" 200 842 "python-requests/2.28.1"`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "User-agent apa yang digunakan penyerang dalam melancarkan otomasi stuffing?",
        type: "single_choice",
        options: [
          { id: "a", text: "Mozilla/5.0 Chrome" },
          { id: "b", text: "python-requests/2.28.1" },
          { id: "c", text: "Curl/7.68.0" },
          { id: "d", text: "Wget/1.20" }
        ],
        correctAnswer: "b",
        explanation: "Log mencatat user-agent default dari pustaka Python requests."
      }
    ],
    hints: [
      { tier: 1, text: "Perhatikan rasio respons status HTTP 401 Unauthorized vs 200 OK yang dipicu oleh alamat IP eksternal." },
      { tier: 2, text: "Periksa alamat IP dan string User-Agent pada berkas portal_access.log." },
      { tier: 3, text: "IP eksternal 198.51.100.12 mengirimkan request otomasi menggunakan library python-requests secara agresif." }
    ],
    mitigationSummary: "Terapkan Cloudflare Turnstile / CAPTCHA pada endpoint autentikasi, terapkan IP rate-limiting, dan integrasikan pengecekan password leaked via HaveIBeenPwned API.",
    mitigation: [
      "Pasang Turnstile / CAPTCHA interaktif pada endpoint /api/login",
      "Terapkan rate limit ketat (maksimal 5 request per menit per IP)",
      "Wajibkan reset kata sandi bagi akun yang berhasil login dari IP mencurigakan"
    ],
    reflection: [
      "Mengapa credential stuffing berbahaya bagi institusi pendidikan?",
      "Bukti apa yang menunjukkan request login dilakukan oleh mesin/skrip otomasi?",
      "Apakah ada kemungkinan false positive dari skrip pengujian beban (load test)?",
      "Bagaimana cara memverifikasi akun siswa yang telah tertembus?",
      "Mitigasi apa yang efektif untuk mencegah bot login massal?"
    ],
    lapsMapping: {
      understand: "Memahami bahaya penggunaan password daur ulang pada portal pendidikan.",
      plan: "Merencanakan implementasi rate-limit pada reverse proxy.",
      execute: "Menganalisis user-agent header dan kode HTTP 401/200.",
      review: "Meninjau kesadaran siswa dalam manajemen kata sandi yang unik."
    }
  },
  {
    id: "RC-CTF-005",
    aliasId: "ctf-005",
    title: "Privilege Escalation & Root Account Protection (Root Jangan Diajak Main)",
    category: "authentication",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 175,
    sourceId: "owasp-top10-sqli",
    affectedTechnology: "Node.js REST API Gateway / JWT Bearer Tokens",
    mitreTechniques: ["T1078.004", "T1530"],
    lapsStage: "review",
    attackCategory: "authentication",
    realWorldCase: "Sebuah token JWT milik guru piket digunakan secara bersamaan dari dua benua berbeda (IP lokal sekolah dan IP cloud asing) untuk mengunduh seluruh data riwayat ujian siswa.",
    flag: "FLAG{ROOT_JANGAN_DIAJAK_MAIN}",
    flagConfig: {
      value: "FLAG{ROOT_JANGAN_DIAJAK_MAIN}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Investigasi penyalahgunaan bearer token JWT yang mengakses endpoint administratif sensitif dan memicu kebocoran basis data.",
      successCriteria: [
        "Deteksi anomali token hijacking dari IP asing 185.220.101.5",
        "Identifikasi endpoint pembuangan data /api/v1/students/dump_all_scores",
        "Hitung volume byte kebocoran data ujian",
        "Submit flag dan rancang token revocation serta role-based privilege restriction"
      ]
    },
    caseBrief: {
      incidentCode: "INC-AUTH-005",
      targetHost: "API-GATEWAY-01 (10.10.20.10)",
      detectionSource: "API Gateway Audit Logs",
      narrative: "Sebuah token JWT milik guru piket digunakan secara bersamaan dari dua benua berbeda (IP lokal sekolah dan IP cloud asing) untuk mengunduh seluruh data riwayat ujian siswa.",
      mission: [
        "1. Deteksi indikasi Token Hijacking / Replay Attack.",
        "2. Identifikasi endpoint yang dieksekusi penyerang.",
        "3. Tentukan tindakan invalidasi sesi token."
      ]
    },
    timeline: [
      { time: "11:20:00 WIB", sensor: "gateway_audit.log", event: "GET /api/v1/students/me from 10.10.1.15 status 200" },
      { time: "11:20:45 WIB", sensor: "gateway_audit.log", event: "GET /api/v1/students/dump_all_scores from 185.220.101.5 status 200 (1.4MB transferred)" }
    ],
    evidencePack: [
      {
        id: "ev-005-a",
        fileName: "gateway_audit.log",
        fileType: "json",
        description: "Catatan transaksi token bearer API Gateway",
        content: `{"time": "11:20:00", "ip": "10.10.1.15", "sub": "guru.dewi", "action": "GET /api/v1/students/me", "status": 200}
{"time": "11:20:45", "ip": "185.220.101.5", "sub": "guru.dewi", "action": "GET /api/v1/students/dump_all_scores", "status": 200, "bytes": 1420912}`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Endpoint sensitif mana yang diakses oleh IP asing 185.220.101.5 menggunakan token curian?",
        type: "single_choice",
        options: [
          { id: "a", text: "/api/v1/students/me" },
          { id: "b", text: "/api/v1/students/dump_all_scores" },
          { id: "c", text: "/api/login" },
          { id: "d", text: "/api/logout" }
        ],
        correctAnswer: "b",
        explanation: "Log menunjukkan pemanggilan endpoint 'dump_all_scores' yang mengekspor 1.4 MB data nilai."
      }
    ],
    hints: [
      { tier: 1, text: "Perhatikan indikasi token hijacking dan pemanggilan endpoint administratif dengan hak istimewa tinggi." },
      { tier: 2, text: "Periksa properti 'action' dan 'ip' pada berkas gateway_audit.log." },
      { tier: 3, text: "IP asing 185.220.101.5 mengekspor data massal dengan memanfaatkan token berprivilese superadmin/root." }
    ],
    mitigationSummary: "Terapkan masa kedaluwarsa JWT pendek dengan refresh token rotation, ikat token dengan fingerprint perangkat/IP, dan cabut kunci rahasia signing JWT segera.",
    mitigation: [
      "Revoke seluruh JWT token aktif dengan mengganti secret key signing",
      "Ikat token dengan TLS client cert atau device fingerprint",
      "Terapkan pemisahan wewenang: endpoint dump data hanya dapat diakses melalui internal bastion"
    ],
    reflection: [
      "Mengapa akun root atau superadmin tidak boleh digunakan untuk operasional harian?",
      "Bukti log apa yang menunjukkan terjadinya token theft atau session hijack?",
      "Apakah ada kemungkinan false positive jika guru menggunakan VPN resmi sekolah?",
      "Bagaimana cara mengisolasi dampak kebocoran token JWT tanpa downtime aplikasi?",
      "Mitigasi apa yang memastikan hak istimewa tinggi hanya diberikan secara tepat?"
    ],
    lapsMapping: {
      understand: "Menganalisis anomali geografis dan pola pemanggilan token API.",
      plan: "Merencanakan arsitektur token revocation blacklist.",
      execute: "Memeriksa audit log gateway JSON.",
      review: "Mengevaluasi prinsip Least Privilege pada endpoint ekspor data massal."
    }
  }
];
