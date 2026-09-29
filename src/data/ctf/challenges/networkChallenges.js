/**
 * Category C & D: Network & C2 Attacks (Challenges RC-CTF-012 to RC-CTF-017)
 * Conforms to LAPS-Heuristik SOC Investigation Architecture:
 * Case File -> Mission -> Evidence -> Timeline -> Investigation -> Flag -> Mitigation -> Reflection
 */

export const NETWORK_CHALLENGES = [
  {
    id: "RC-CTF-012",
    aliasId: "ctf-012",
    title: "DNS Tunneling & Alert Triage (SOC Tidak Semua yang Merah Bahaya)",
    category: "network",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 175,
    sourceId: "mitre-t1071-004",
    affectedTechnology: "DNS Resolver Bind9 / Wireshark Zeek Telemetry",
    mitreTechniques: ["T1071.004", "T1048.003"],
    lapsStage: "review",
    attackCategory: "network",
    realWorldCase: "Analis jaringan memperhatikan lonjakan puluhan ribu kueri DNS dengan subdomain heksadesimal yang sangat panjang menuju domain mencurigakan 'exfil-data.tunnel-dns.test'. Ini mengindikasikan eksfiltrasi data melalui DNS tunnel.",
    flag: "FLAG{SOC_TIDAK_SEMUA_YANG_MERAH_BAHAYA}",
    flagConfig: {
      value: "FLAG{SOC_TIDAK_SEMUA_YANG_MERAH_BAHAYA}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Lakukan triase terhadap peringatan lonjakan lalu lintas DNS dan bedakan transmisi normal dari eksfiltrasi data terenkode heksadesimal.",
      successCriteria: [
        "Identifikasi pola subdomain heksadesimal pada dns_query.log",
        "Dekode potongan teks heksadesimal untuk membuktikan kebocoran NIK Siswa",
        "Pisahkan alert kritis riil dari peringatan anomali biasa",
        "Submit flag dan rancang kebijakan DNS Sinkhole / RPZ"
      ]
    },
    caseBrief: {
      incidentCode: "INC-NET-012",
      targetHost: "INTERNAL-PC-32 (10.10.3.32)",
      detectionSource: "Zeek DNS Log & Core Switch NetFlow",
      narrative: "Analis jaringan memperhatikan lonjakan puluhan ribu kueri DNS dengan subdomain heksadesimal yang sangat panjang menuju domain mencurigakan 'exfil-data.tunnel-dns.test'. Ini mengindikasikan eksfiltrasi data melalui DNS tunnel.",
      mission: [
        "1. Identifikasi subdomain heksadesimal yang dienkode pada query DNS.",
        "2. Buktikan kebocoran data rahasia sekolah melalui protokol UDP 53.",
        "3. Tentukan teknik Response Policy Zone (RPZ) / DNS sinkholing."
      ]
    },
    timeline: [
      { time: "08:45:01 WIB", sensor: "dns_query.log", event: "Query A 4e494b5f5349535741.exfil-data.tunnel-dns.test" },
      { time: "08:45:02 WIB", sensor: "dns_query.log", event: "Query A 3331373430313233.exfil-data.tunnel-dns.test" },
      { time: "08:45:04 WIB", sensor: "dns_query.log", event: "Query TXT 646174615f72616861736961.exfil-data.tunnel-dns.test" }
    ],
    evidencePack: [
      {
        id: "ev-012-a",
        fileName: "dns_query.log",
        fileType: "dns_log",
        description: "Catatan query DNS resolver internal",
        content: `08:45:01.124 10.10.3.32 -> 10.10.0.1:53 A 4e494b5f5349535741.exfil-data.tunnel-dns.test
08:45:02.341 10.10.3.32 -> 10.10.0.1:53 A 3331373430313233.exfil-data.tunnel-dns.test
08:45:03.582 10.10.3.32 -> 10.10.0.1:53 A 3039393837363534.exfil-data.tunnel-dns.test
08:45:04.912 10.10.3.32 -> 10.10.0.1:53 TXT 646174615f72616861736961.exfil-data.tunnel-dns.test`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Karakteristik kueri DNS manakah yang paling kuat membuktikan adanya tunneling data?",
        type: "single_choice",
        options: [
          { id: "a", text: "Port tujuan adalah port 53" },
          { id: "b", text: "Subdomain berupa string heksadesimal acak yang panjang dan frekuensi kueri sangat tinggi" },
          { id: "c", text: "Menggunakan alamat IP lokal 10.10.3.32" },
          { id: "d", text: "Waktu kueri dilakukan pada jam 08:45 WIB" }
        ],
        correctAnswer: "b",
        explanation: "Pola enkoding data menjadi label subdomain heksadesimal/base32 dengan volume ribuan request adalah ciri khas DNS tunneling."
      }
    ],
    hints: [
      { tier: 1, text: "Lakukan triase terhadap anomali traffic DNS: perhatikan apakah subdomain memuat data terenkode bukan nama domain biasa." },
      { tier: 2, text: "Subdomain pertama '4e494b5f5349535741' jika didekode hex ke teks ASCII menghasilkan string terbaca." },
      { tier: 3, text: "Kombinasi analisis triase membuktikan eksfiltrasi data rahasia melalui protokol DNS port 53." }
    ],
    mitigationSummary: "Terapkan DNS Inspection pada firewall generasi baru (NGFW), batasi panjang karakter query name (FQDN length anomaly), dan blokir direct outbound port 53 kecuali dari recursive resolver resmi sekolah.",
    mitigation: [
      "Blokir lalu lintas keluar UDP/TCP port 53 langsung dari host endpoint ke internet publik",
      "Terapkan Response Policy Zone (RPZ) untuk melakukan sinkhole terhadap domain tunnel-dns.test",
      "Gunakan Next-Gen Firewall (NGFW) dengan fitur deteksi anomali panjang FQDN"
    ],
    reflection: [
      "Mengapa triase alert SOC harus melihat muatan paket bukan sekadar warna peringatan?",
      "Evidence mana yang membuktikan teks heksadesimal membawa informasi rahasia?",
      "Apakah ada kemungkinan false positive dari aplikasi antivirus yang mengueri reputasi file via DNS?",
      "Bagaimana cara memvalidasi keputusanmu dengan memeriksa resolver query log eksternal?",
      "Mitigasi apa yang memastikan workstation siswa tidak dapat membocorkan data via DNS?"
    ],
    lapsMapping: {
      understand: "Memahami bagaimana protokol dasar seperti DNS dapat disalahgunakan sebagai saluran C2 dan pencurian data.",
      plan: "Merumuskan ambang batas panjang domain (domain entropy threshold) pada IDS.",
      execute: "Mendekode string heksadesimal pada record DNS.",
      review: "Mengevaluasi arsitektur proteksi DNS resolver internal."
    }
  },
  {
    id: "RC-CTF-013",
    aliasId: "ctf-013",
    title: "Cobalt Strike C2 Beaconing & Repeated Source IP (Si IP 185 Kok Balik Lagi)",
    category: "network",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 175,
    sourceId: "mitre-t1071-001",
    affectedTechnology: "TLS Encrypted Web Traffic / Zeek Bro / Suricata",
    mitreTechniques: ["T1071.001", "T1573.002"],
    lapsStage: "review",
    attackCategory: "network",
    realWorldCase: "Sebuah workstation staf menunjukkan koneksi periodik teratur setiap 60 detik (dengan jitter 10%) ke alamat IP eksternal 185.220.101.99 port 443 dengan ukuran paket yang identik.",
    flag: "FLAG{SI_IP_185_KOK_BALIK_LAGI}",
    flagConfig: {
      value: "FLAG{SI_IP_185_KOK_BALIK_LAGI}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Identifikasi tanda-tanda komunikasi Command and Control (C2) terenkripsi melalui analisis statistik interval koneksi berulang (beaconing) ke IP penyerang 185.x.",
      successCriteria: [
        "Hitung selisih waktu koneksi (ts delta) antar paket pada conn_flow.json",
        "Temukan IP tujuan penyerang yang dihubungi berulang kali (185.220.101.99)",
        "Buktikan adanya pola beacon sleep time konstan sekitar 60 detik",
        "Submit flag dan rancang isolasi host terinfeksi"
      ]
    },
    caseBrief: {
      incidentCode: "INC-NET-013",
      targetHost: "STAFF-PC-09 (10.0.2.45)",
      detectionSource: "Suricata Flow Anomaly & NetFlow Connection Logs",
      narrative: "Sebuah workstation staf menunjukkan koneksi periodik teratur setiap 60 detik (dengan jitter 10%) ke alamat IP eksternal 185.220.101.99 port 443 dengan ukuran paket yang identik.",
      mission: [
        "1. Hitung interval delta waktu antar koneksi (beaconing interval).",
        "2. Identifikasi tanda tangan C2 beaconing terenkripsi.",
        "3. Lakukan pemutusan sambungan jaringan pada host yang terinfeksi."
      ]
    },
    timeline: [
      { time: "17:40:00 WIB", sensor: "conn_flow.json", event: "TCP connection to 185.220.101.99:443 (orig_bytes: 482)" },
      { time: "17:41:00 WIB", sensor: "conn_flow.json", event: "TCP connection to 185.220.101.99:443 (orig_bytes: 482) [+60.3s]" },
      { time: "17:42:01 WIB", sensor: "conn_flow.json", event: "TCP connection to 185.220.101.99:443 (orig_bytes: 482) [+60.8s]" },
      { time: "17:43:00 WIB", sensor: "conn_flow.json", event: "TCP connection to 185.220.101.99:443 (orig_bytes: 482) [+58.6s]" }
    ],
    evidencePack: [
      {
        id: "ev-013-a",
        fileName: "conn_flow.json",
        fileType: "json",
        description: "Aliran koneksi TCP TLS terinspeksi Zeek",
        content: `[
  {"ts": 1727582000.1, "src": "10.0.2.45", "dst": "185.220.101.99:443", "proto": "tcp", "orig_bytes": 482, "resp_bytes": 104},
  {"ts": 1727582060.4, "src": "10.0.2.45", "dst": "185.220.101.99:443", "proto": "tcp", "orig_bytes": 482, "resp_bytes": 104},
  {"ts": 1727582121.2, "src": "10.0.2.45", "dst": "185.220.101.99:443", "proto": "tcp", "orig_bytes": 482, "resp_bytes": 104},
  {"ts": 1727582179.8, "src": "10.0.2.45", "dst": "185.220.101.99:443", "proto": "tcp", "orig_bytes": 482, "resp_bytes": 104}
]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Berapa interval waktu rata-rata (sleep time beacon) antara setiap transmisi paket?",
        type: "single_choice",
        options: [
          { id: "a", text: "Sekitar 60 detik (1 menit)" },
          { id: "b", text: "10 jam" },
          { id: "c", text: "500 milidetik" },
          { id: "d", text: "24 jam" }
        ],
        correctAnswer: "a",
        explanation: "Selisih cap waktu (ts) menunjukkan rentang 60.3 detik, 60.8 detik, dan 58.6 detik yang konsisten dengan interval sleep 60 detik dengan variasi jitter kecil."
      }
    ],
    hints: [
      { tier: 1, text: "Perhatikan interval periodik konstan (beaconing) yang menghubungi IP eksternal yang sama berulang kali." },
      { tier: 2, text: "Hitung selisih cap stempel waktu ts antar koneksi keluar ke IP 185.220.101.99." },
      { tier: 3, text: "Koneksi berulang dengan interval reguler 60 detik membuktikan keberadaan C2 beaconing aktif." }
    ],
    mitigationSummary: "Isolasi host 10.0.2.45 dari jaringan VLAN, blokir IP 185.220.101.99 di perimeter firewall, dan periksa proses memori aktif untuk menemukan beacon injection.",
    mitigation: [
      "Karantina host STAFF-PC-09 (10.0.2.45) dari jaringan lokal",
      "Blokir IP publik C2 185.220.101.99 pada border gateway firewall",
      "Lakukan dump memory dan analisis biner tersembunyi pada proses explorer.exe / svchost.exe"
    ],
    reflection: [
      "Mengapa penyerang menambahkan faktor acak (jitter) pada jadwal beaconing C2 mereka?",
      "Evidence mana yang membuktikan koneksi dilakukan oleh program otomatis bukan manusia?",
      "Apakah ada kemungkinan false positive dari aplikasi sinkronisasi cloud resmi?",
      "Bagaimana cara memvalidasi keputusanmu dengan memeriksa certificate SNI pada koneksi TLS?",
      "Mitigasi apa yang efektif untuk memutus komunikasi malware yang sudah masuk ke endpoint?"
    ],
    lapsMapping: {
      understand: "Mengenali perilaku beaconing otomatis vs penjelajahan web manual oleh manusia.",
      plan: "Merencanakan analisis statistik frekuensi koneksi (inter-arrival time distribution).",
      execute: "Menghitung delta waktu cap stempel koneksi.",
      review: "Mengevaluasi batasan inspeksi DPI pada lalu lintas HTTPS terenkripsi."
    }
  },
  {
    id: "RC-CTF-014",
    aliasId: "ctf-014",
    title: "Nmap Port Scan & Timeline Reconstruction (Timeline-nya Jelas Boss)",
    category: "network",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 50,
    sourceId: "owasp-top10-sqli",
    affectedTechnology: "TCP/IP Stack / NIDS Port Scan Detector",
    mitreTechniques: ["T1046"],
    lapsStage: "review",
    attackCategory: "network",
    realWorldCase: "Sebuah perangkat di laboratorium komputer melakukan pemindaian separuh terbuka (half-open SYN scan) terhadap 1000 port paling umum untuk memetakan layanan server yang terbuka.",
    flag: "FLAG{TIMELINE_NYA_JELAS_BOSS}",
    flagConfig: {
      value: "FLAG{TIMELINE_NYA_JELAS_BOSS}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Rekonstruksi linimasa kronologis pengintaian jaringan dan identifikasi alamat IP workstation sumber port scan.",
      successCriteria: [
        "Analisis portscan.log untuk menemukan urutan waktu dan parameter pemindaian",
        "Identifikasi IP sumber pengirim paket SYN (192.168.1.144)",
        "Buktikan kecepatan pemindaian 250 port dalam kurun 3 detik",
        "Submit flag dan rancang client isolation pada access switch"
      ]
    },
    caseBrief: {
      incidentCode: "INC-NET-014",
      targetHost: "DMZ-SERVERS (192.168.10.0/24)",
      detectionSource: "Suricata Portscan Preprocessor Log",
      narrative: "Sebuah perangkat di laboratorium komputer melakukan pemindaian separuh terbuka (half-open SYN scan) terhadap 1000 port paling umum untuk memetakan layanan server yang terbuka.",
      mission: [
        "1. Identifikasi teknik scan flags TCP (SYN packet tanpa ACK balasan).",
        "2. Temukan alamat IP workstation sumber pemindaian.",
        "3. Ambil tindakan peringatan kepada pengguna laboratorium."
      ]
    },
    timeline: [
      { time: "09:30:00 WIB", sensor: "portscan.log", event: "ET SCAN Nmap Scripting Engine User-Agent Detected" },
      { time: "09:30:01 WIB", sensor: "portscan.log", event: "ET SCAN Potential Nmap SYN Scan initiated (SRC=192.168.1.144 -> DST=192.168.10.5)" },
      { time: "09:30:03 WIB", sensor: "portscan.log", event: "Scan burst completed: 250 ports probed in 3 seconds with SYN flags" }
    ],
    evidencePack: [
      {
        id: "ev-014-a",
        fileName: "portscan.log",
        fileType: "syslog",
        description: "Catatan modul pendeteksi pemindaian port Suricata",
        content: `2026-09-29 09:30:00 [ALERT] [1:2000537:3] ET SCAN Nmap Scripting Engine User-Agent Detected
2026-09-29 09:30:01 [ALERT] [1:2001211:2] ET SCAN Potential Nmap SYN Scan
SRC=192.168.1.144 -> DST=192.168.10.5 | PROTO=TCP | PORTS=21,22,23,25,53,80,110,139,443,445,3389...
FLAGS=[SYN] | TOTAL_PORTS_HIT=250 in 3 seconds`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Alamat IP manakah yang menjadi asal pemindaian SYN scan masif tersebut?",
        type: "single_choice",
        options: [
          { id: "a", text: "192.168.10.5" },
          { id: "b", text: "192.168.1.144" },
          { id: "c", text: "8.8.8.8" },
          { id: "d", text: "1.1.1.1" }
        ],
        correctAnswer: "b",
        explanation: "Kolom SRC=192.168.1.144 mencatat komputer di subnet laboratorium yang memicu 250 port hit dalam 3 detik."
      }
    ],
    hints: [
      { tier: 1, text: "Susun urutan kronologis pemindaian port dari fase discovery Nmap Scripting Engine hingga SYN probe massal." },
      { tier: 2, text: "Periksa nilai parameter 'SRC=' dan durasi 3 detik pada berkas portscan.log." },
      { tier: 3, text: "Rekonstruksi timeline yang jelas membuktikan pemindaian reconnaissance beruntun dari workstation laboratorium." }
    ],
    mitigationSummary: "Terapkan aturan firewall switch internal (Private VLAN / Client Isolation) agar workstation siswa tidak dapat memindai segmen server DMZ secara bebas.",
    mitigation: [
      "Aktifkan Private VLAN (PVLAN) atau Port Isolation pada switch laboratorium",
      "Pasang rate limit koneksi SYN baru pada firewall internal",
      "Edukasi siswa tentang etika pengujian penetrasi dalam lingkungan sekolah"
    ],
    reflection: [
      "Mengapa penyusunan linimasa (timeline reconstruction) sangat krusial dalam triase insiden?",
      "Evidence mana yang membuktikan pemindaian dilakukan menggunakan perangkat lunak Nmap?",
      "Apakah ada kemungkinan false positive jika guru sedang mengajar materi jaringan?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat inventaris lab PC?",
      "Mitigasi apa yang membatasi pengintaian port di segmen jaringan lokal?"
    ],
    lapsMapping: {
      understand: "Memahami fase pengintaian (reconnaissance) sebelum serangan penyerobotan dilancarkan.",
      plan: "Merencanakan segmentasi jaringan VLAN dan isolasi workstation laboratorium.",
      execute: "Mengevaluasi baris alert portscan NIDS.",
      review: "Meninjau tata tertib penggunaan laboratorium jaringan komputer."
    }
  },
  {
    id: "RC-CTF-015",
    aliasId: "ctf-015",
    title: "SMB Propagation in High-Noise Traffic (Lognya Berisik Tapi Kita Teliti)",
    category: "network",
    difficulty: "advanced",
    estimatedMinutes: 25,
    xpReward: 175,
    sourceId: "cve-2017-0144",
    affectedTechnology: "Microsoft Windows SMBv1 (Port 445 / MS17-010)",
    mitreTechniques: ["T1210", "T1021.002"],
    lapsStage: "review",
    attackCategory: "network",
    realWorldCase: "Setelah satu komputer terinfeksi malware, program worm secara otomatis menyebarkan payload EternalBlue ke seluruh port 445 SMB pada subnet yang sama dalam hitungan detik di tengah ribuan log bising.",
    flag: "FLAG{LOGNYA_BERISIK_TAPI_KITA_TELITI}",
    flagConfig: {
      value: "FLAG{LOGNYA_BERISIK_TAPI_KITA_TELITI}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Saring ribuan catatan lalu lintas jaringan yang bising (noisy logs) untuk mengidentifikasi komputer Patient Zero yang menyebarkan eksploitasi SMBv1.",
      successCriteria: [
        "Temukan signature SID Suricata MS17-010 pada suricata_smb.log",
        "Identifikasi IP host pengirim utama (Patient Zero)",
        "Buktikan penyebaran lateral 1-ke-banyak host dalam subnet yang sama",
        "Submit flag dan rancang penonaktifan SMBv1 serta isolasi port 445"
      ]
    },
    caseBrief: {
      incidentCode: "INC-NET-015",
      targetHost: "MULTIPLE-LAB-PCS (192.168.20.0/24)",
      detectionSource: "Suricata NIDS Alert Log & Wireshark PCAP Telemetry",
      narrative: "Setelah satu komputer terinfeksi malware, program worm secara otomatis menyebarkan payload EternalBlue ke seluruh port 445 SMB pada subnet yang sama dalam hitungan detik di tengah ribuan log bising.",
      mission: [
        "1. Identifikasi signature SID Suricata yang menangkap exploit MS17-010.",
        "2. Temukan komputer pasien nol (Patient Zero) yang menyebarkan worm.",
        "3. Terapkan rekomendasi penonaktifan protokol SMBv1 warisan."
      ]
    },
    timeline: [
      { time: "11:15:02 WIB", sensor: "suricata_smb.log", event: "MS17-010 SMB Remote Code Execution Attempt: 192.168.20.10:49152 -> 192.168.20.15:445" },
      { time: "11:15:04 WIB", sensor: "suricata_smb.log", event: "MS17-010 SMB Remote Code Execution Attempt: 192.168.20.10:49153 -> 192.168.20.16:445" },
      { time: "11:15:06 WIB", sensor: "suricata_smb.log", event: "MS17-010 SMB Remote Code Execution Attempt: 192.168.20.10:49154 -> 192.168.20.17:445" }
    ],
    evidencePack: [
      {
        id: "ev-015-a",
        fileName: "suricata_smb.log",
        fileType: "nids_alert",
        description: "Catatan alert eksploitasi SMB Suricata",
        content: `05/12-11:15:02.1021 [**] [1:2024218:2] ET EXPLOIT MS17-010 SMB Remote Code Execution Attempt [**] [Priority: 1] {TCP} 192.168.20.10:49152 -> 192.168.20.15:445
05/12-11:15:04.8920 [**] [1:2024218:2] ET EXPLOIT MS17-010 SMB Remote Code Execution Attempt [**] [Priority: 1] {TCP} 192.168.20.10:49153 -> 192.168.20.16:445
05/12-11:15:06.1154 [**] [1:2024218:2] ET EXPLOIT MS17-010 SMB Remote Code Execution Attempt [**] [Priority: 1] {TCP} 192.168.20.10:49154 -> 192.168.20.17:445`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Host komputer manakah yang bertindak sebagai Patient Zero yang menyebarkan exploit ke host lain?",
        type: "single_choice",
        options: [
          { id: "a", text: "192.168.20.10" },
          { id: "b", text: "192.168.20.15" },
          { id: "c", text: "192.168.20.16" },
          { id: "d", text: "192.168.20.17" }
        ],
        correctAnswer: "a",
        explanation: "192.168.20.10 adalah sumber transmisi eksploitasi beruntun ke IP .15, .16, dan .17."
      }
    ],
    hints: [
      { tier: 1, text: "Saring ribuan paket bising di jaringan untuk menemukan koneksi SMB port 445 yang mencurigakan." },
      { tier: 2, text: "Periksa alamat IP yang berada di sisi kiri tanda panah '->' pada suricata_smb.log." },
      { tier: 3, text: "Ketelitian menganalisis log yang berisik berhasil menemukan host 192.168.20.10 sebagai Patient Zero." }
    ],
    mitigationSummary: "Pasang patch keamanan Microsoft MS17-010, nonaktifkan protokol SMBv1 lama melalui Group Policy / PowerShell (Disable-WindowsOptionalFeature -FeatureName SMB1Protocol), dan blokir port 445 pada perimeter antar VLAN.",
    mitigation: [
      "Nonaktifkan fitur SMBv1 pada seluruh workstation melalui Group Policy",
      "Terapkan security patch Microsoft MS17-010 secara menyeluruh",
      "Blokir lalu lintas SMB port 445 antar segmen workstation pengguna"
    ],
    reflection: [
      "Bagaimana cara analis mengatasi tumpukan log yang sangat bising (high noise level)?",
      "Evidence mana yang paling membuktikan bahwa penyebaran terjadi secara otomatis oleh worm?",
      "Mengapa protokol SMB warisan (SMBv1) sangat berbahaya jika tetap diaktifkan?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat traffic flow di switch?",
      "Mitigasi apa yang menghentikan penyebaran lateral secara instan?"
    ],
    lapsMapping: {
      understand: "Memahami mekanisme lateral movement dan penyebaran worm otomatis pada protokol SMB.",
      plan: "Merencanakan isolasi subnet laboratorium dan penonaktifan SMBv1.",
      execute: "Mendeteksi patient zero dari log koneksi 1-ke-banyak.",
      review: "Meninjau pelajaran dari insiden global WannaCry Ransomware."
    }
  },
  {
    id: "RC-CTF-016",
    aliasId: "ctf-016",
    title: "Kerberoasting Attack & Signature Detection (Signature Kenalan Lama)",
    category: "network",
    difficulty: "expert",
    estimatedMinutes: 30,
    xpReward: 250,
    sourceId: "cisa-ad-kerberoasting",
    affectedTechnology: "Windows Server Active Directory Domain Services / Kerberos TGS",
    mitreTechniques: ["T1558.003", "T1003"],
    lapsStage: "review",
    attackCategory: "network",
    realWorldCase: "Penyerang yang telah mendapatkan akses akun siswa biasa meminta tiket Kerberos TGS untuk Service Principal Name (SPN) akun layanan database sekolah menggunakan enkripsi lemah RC4 (0x17) untuk di-crack secara offline menggunakan Hashcat.",
    flag: "FLAG{SIGNATURE_KENALAN_LAMA}",
    flagConfig: {
      value: "FLAG{SIGNATURE_KENALAN_LAMA}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Kenali signature serangan Kerberoasting TGS request dan identifikasi akun layanan basis data yang menjadi sasaran.",
      successCriteria: [
        "Analisis Kerberos_4769.json untuk menemukan Event ID 4769",
        "Identifikasi signature enkripsi RC4 (TicketEncryptionType: 0x17)",
        "Temukan ServiceName basis data MSSQLSvc yang diminta secara anomali",
        "Submit flag dan rancang migrasi akun layanan ke gMSA"
      ]
    },
    caseBrief: {
      incidentCode: "INC-NET-016",
      targetHost: "DC-01.SEKOLAH.SCH.ID (10.0.0.1)",
      detectionSource: "Windows Security Event Log ID 4769 (Kerberos Service Ticket Operations)",
      narrative: "Penyerang yang telah mendapatkan akses akun siswa biasa meminta tiket Kerberos TGS untuk Service Principal Name (SPN) akun layanan database sekolah menggunakan enkripsi lemah RC4 (0x17) untuk di-crack secara offline menggunakan Hashcat.",
      mission: [
        "1. Identifikasi Event ID 4769 dengan Encryption Type 0x17 (RC4).",
        "2. Temukan nama Service Name yang diminta oleh akun penyerang.",
        "3. Tentukan rekomendasi migrasi ke AES-256 dan gMSAs."
      ]
    },
    timeline: [
      { time: "13:20:10 WIB", sensor: "Kerberos_4769.json", event: "EventID 4769 krbtgt TGS requested with AES (0x12) by siswa_andi" },
      { time: "13:22:45 WIB", sensor: "Kerberos_4769.json", event: "EventID 4769 MSSQLSvc/db-nilai TGS requested with weak RC4 (0x17) by siswa_andi" }
    ],
    evidencePack: [
      {
        id: "ev-016-a",
        fileName: "Kerberos_4769.json",
        fileType: "json",
        description: "Catatan permohonan tiket layanan TGS Kerberos",
        content: `[
  {"EventID": 4769, "Time": "13:20:10", "TargetUserName": "siswa_andi", "ServiceName": "krbtgt", "TicketEncryptionType": "0x12"},
  {"EventID": 4769, "Time": "13:22:45", "TargetUserName": "siswa_andi", "ServiceName": "MSSQLSvc/db-nilai.sekolah.sch.id:1433", "TicketEncryptionType": "0x17", "Status": "0x0"}
]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Nama service (ServiceName) dengan enkripsi RC4 (0x17) apakah yang dicurigai menjadi target Kerberoasting?",
        type: "single_choice",
        options: [
          { id: "a", text: "krbtgt" },
          { id: "b", text: "MSSQLSvc/db-nilai.sekolah.sch.id:1433" },
          { id: "c", text: "DNS" },
          { id: "d", text: "HTTP/intranet" }
        ],
        correctAnswer: "b",
        explanation: "Layanan database MSSQLSvc diminta dengan tipe enkripsi RC4 (0x17) yang rentan diekstraksi hash-nya untuk cracking offline."
      }
    ],
    hints: [
      { tier: 1, text: "Kenali signature pola penyerangan klasik Kerberos TGS request." },
      { tier: 2, text: "Periksa nilai 'ServiceName' pada record dengan TicketEncryptionType: 0x17." },
      { tier: 3, text: "Deteksi signature tipe tiket RC4 mengonfirmasi upaya pencurian hash kredensial layanan." }
    ],
    mitigationSummary: "Gunakan Group Managed Service Accounts (gMSA) dengan password acak 128-karakter yang dirotasi otomatis, paksa penggunaan enkripsi AES-256 (0x12), dan pantau anomali permohonan tiket TGS tak lazim.",
    mitigation: [
      "Migrasikan service account database ke Group Managed Service Accounts (gMSA)",
      "Nonaktifkan tipe enkripsi RC4 pada domain Kerberos dan wajibkan AES-128/AES-256",
      "Monitor event ID 4769 dengan filter enkripsi 0x17 di SIEM"
    ],
    reflection: [
      "Mengapa signature enkripsi RC4 menjadi indikator kuat serangan Kerberoasting?",
      "Evidence mana yang menunjukkan akun siswa biasa meminta tiket layanan database?",
      "Apakah ada kemungkinan false positive jika ada aplikasi warisan Windows Server 2003?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat hash extraction di Hashcat?",
      "Mitigasi apa yang membuat serangan cracking offline menjadi mustahil berhasil?"
    ],
    lapsMapping: {
      understand: "Memahami bagaimana fitur resmi protokol Kerberos dapat dieksploitasi untuk mencuri password service account.",
      plan: "Merumuskan strategi migrasi akun layanan ke gMSA.",
      execute: "Menganalisis Event ID 4769 dan kode tipe enkripsi Kerberos.",
      review: "Meninjau ketahanan akun layanan terhadap serangan offline cracking."
    }
  },
  {
    id: "RC-CTF-017",
    aliasId: "ctf-017",
    title: "TCP SYN Flood & Volumetric Anomaly Detection (Anomali Tiba-Tiba Datang)",
    category: "network",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    xpReward: 100,
    sourceId: "owasp-top10-sqli",
    affectedTechnology: "Linux TCP/IP Stack / IPTables SYN Cookie",
    mitreTechniques: ["T1498"],
    lapsStage: "review",
    attackCategory: "network",
    realWorldCase: "Server ujian sekolah tiba-tiba tidak merespons. Tim jaringan harus membedakan apakah antrian koneksi penuh akibat serangan SYN Flood dengan alamat IP spoofed acak atau karena ribuan siswa yang login bersamaan.",
    flag: "FLAG{ANOMALI_TIBA_TIBA_DATANG}",
    flagConfig: {
      value: "FLAG{ANOMALI_TIBA_TIBA_DATANG}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Deteksi anomali volume koneksi separuh terbuka (half-open SYN flood) dan buktikan kepenuhan antrean soket SYN_RECV.",
      successCriteria: [
        "Analisis kernel_dmesg.log untuk menemukan indikasi Possible SYN flooding",
        "Identifikasi status soket TCP SYN_RECV yang menumpuk hingga puluhan ribu",
        "Buktikan keberadaan spoofed IP unroutable (198.18.0.0/15)",
        "Submit flag dan aktifkan mitigasi kernel tcp_syncookies"
      ]
    },
    caseBrief: {
      incidentCode: "INC-NET-017",
      targetHost: "SERVER-CBT (192.168.10.20)",
      detectionSource: "NetFlow Traffic Analyzer & dmesg kernel log",
      narrative: "Server ujian sekolah tiba-tiba tidak merespons. Tim jaringan harus membedakan apakah antrian koneksi penuh akibat serangan SYN Flood dengan alamat IP spoofed acak atau karena ribuan siswa yang login bersamaan.",
      mission: [
        "1. Analisis status SYN_RECV pada netstat / kernel buffer.",
        "2. Identifikasi keberadaan alamat IP sumber acak palsu (IP Spoofing).",
        "3. Aktifkan mekanisme kernel TCP SYN Cookies."
      ]
    },
    timeline: [
      { time: "07:59:00 WIB", sensor: "netflow", event: "Traffic baseline: 120 pkt/sec (normal morning activity)" },
      { time: "08:00:01 WIB", sensor: "kernel_dmesg.log", event: "TCP: Possible SYN flooding on port 80. Dropping request." },
      { time: "08:00:02 WIB", sensor: "kernel_dmesg.log", event: "netstat shows 45000 sockets in SYN_RECV state from random unroutable IP" },
      { time: "08:00:05 WIB", sensor: "kernel_dmesg.log", event: "CPU softirq 98%, legitimate connections timing out" }
    ],
    evidencePack: [
      {
        id: "ev-017-a",
        fileName: "kernel_dmesg.log",
        fileType: "syslog",
        description: "Pesan kernel Linux terkait antrian koneksi TCP",
        content: `[14285.102041] TCP: request_sock_TCP: Possible SYN flooding on port 80. Dropping request. Check SNMP counters.
[14285.204112] TCP: netstat shows 45000 sockets in SYN_RECV state from random unroutable IP addresses (198.18.0.0/15 test network).
[14285.405102] Server CPU softirq usage 98%, legitimate student connections timing out.`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Status soket TCP apakah yang menumpuk hingga 45.000 koneksi sehingga menghabiskan antrian backlog?",
        type: "single_choice",
        options: [
          { id: "a", text: "ESTABLISHED" },
          { id: "b", text: "SYN_RECV" },
          { id: "c", text: "TIME_WAIT" },
          { id: "d", text: "CLOSED" }
        ],
        correctAnswer: "b",
        explanation: "SYN_RECV menunjukkan server telah mengirim SYN-ACK namun tidak pernah menerima respon ACK akhir karena alamat IP penyerang dipalsukan (spoofed)."
      }
    ],
    hints: [
      { tier: 1, text: "Bandingkan beban koneksi normal dengan anomali lonjakan 45.000 soket SYN_RECV secara mendadak." },
      { tier: 2, text: "Periksa teks 'sockets in ... state' pada baris kedua berkas kernel_dmesg.log." },
      { tier: 3, text: "Anomali volume koneksi separuh terbuka (half-open) menegaskan serangan DoS SYN flooding." }
    ],
    mitigationSummary: "Aktifkan TCP SYN Cookies (sysctl -w net.ipv4.tcp_syncookies=1), tingkatkan tcp_max_syn_backlog, dan gunakan filter BGP Unicast Reverse Path Forwarding (uRPF) pada router gateway.",
    mitigation: [
      "Aktifkan TCP SYN Cookies di kernel: sysctl -w net.ipv4.tcp_syncookies=1",
      "Perbesar ukuran backlog koneksi: sysctl -w net.ipv4.tcp_max_syn_backlog=4096",
      "Terapkan Unicast Reverse Path Forwarding (uRPF) pada gateway router untuk memblokir spoofed IP"
    ],
    reflection: [
      "Mengapa anomali volume trafik separuh terbuka dapat melumpuhkan server tanpa bandwidth besar?",
      "Evidence mana yang membuktikan alamat IP pengirim adalah hasil pemalsuan (spoofing)?",
      "Bagaimana membedakan SYN flood dari flash crowd saat ujian CBT serentak dimulai?",
      "Bagaimana cara memvalidasi keputusanmu dengan memeriksa utilisasi CPU softirq?",
      "Mitigasi apa yang memungkinkan server tetap melayani siswa sah saat diserang SYN flood?"
    ],
    lapsMapping: {
      understand: "Membedakan karakteristik Denial of Service SYN Flood dari lonjakan trafik sah siswa.",
      plan: "Merencanakan tuning parameter kernel Linux untuk ketahanan beban jaringan.",
      execute: "Mengevaluasi kondisi antrian soket SYN_RECV.",
      review: "Meninjau ketersediaan (Availability) dalam triad CIA keamanan informasi."
    }
  }
];
