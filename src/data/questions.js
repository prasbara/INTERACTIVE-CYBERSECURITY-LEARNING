export const QUESTIONS_BY_MEETING = {
  1: [
    {
      id: "m1-q01",
      meetingId: 1,
      lapsStage: "understand",
      type: "diagnostic",
      difficulty: "easy",
      cognitiveSkills: ["interpretation"],
      misconception: "port_alone_means_attack",
      context: "Seorang siswa memeriksa log NIDS sekolah dan menemukan baris: 'SRC=192.168.1.45 DST=192.168.1.10:22 PROTO=TCP'. Siswa tersebut langsung menyimpulkan terjadi serangan berbahaya.",
      question: "Mengapa kesimpulan siswa tersebut secara teknis belum valid?",
      options: [
        { id: "a", text: "Karena port 22 adalah port standar layanan SSH dan koneksi tunggal belum menunjukkan adanya indikasi aktivitas jahat" },
        { id: "b", text: "Karena alamat 192.168.1.45 adalah IP publik internasional yang kebal serangan" },
        { id: "c", text: "Karena protokol TCP tidak dapat digunakan untuk melakukan serangan jaringan" },
        { id: "d", text: "Karena IDS hanya boleh membaca protokol UDP" }
      ],
      correctAnswer: "a",
      evidence: "Parameter DST=192.168.1.10:22 PROTO=TCP hanya mendefinisikan koneksi soket standar.",
      explanation: "Port 22 SSH adalah layanan administrasi standar. Sebuah koneksi biasa tidak dapat disimpulkan sebagai serangan tanpa melihat frekuensi, payload, atau signature alert.",
      takeaway: "Kehadiran nomor port layanan standar bukanlah bukti serangan."
    },
    {
      id: "m1-q02",
      meetingId: 1,
      lapsStage: "understand",
      type: "multiple-choice",
      difficulty: "medium",
      cognitiveSkills: ["analysis"],
      misconception: "port_alone_means_attack",
      context: "Log NIDS mencatat: 'SIG=\"SSH Authentication Failure\" COUNT=47 TIMEFRAME=30s'.",
      question: "Indikator manakah yang paling kuat menunjukkan anomali percobaan brute force?",
      options: [
        { id: "a", text: "Jenis kabel jaringan yang menghubungkan switch" },
        { id: "b", text: "Kombinasi parameter COUNT=47 dalam interval 30 detik yang menunjukkan frekuensi tinggi tak wajar" },
        { id: "c", text: "Fakta bahwa server tujuan beralamat IP lokal kelas C" },
        { id: "d", text: "Nama perangkat workstation yang berawalan huruf 'LAB'" }
      ],
      correctAnswer: "b",
      evidence: "Tingginya nilai COUNT dalam jendela waktu sangat sempit (30s) merupakan indikator otomatisasi.",
      explanation: "Manusia normal tidak dapat memasukkan 47 password salah dalam 30 detik. Tingginya frekuensi kegagalan adalah bukti kuat adanya automated tool.",
      takeaway: "Frekuensi dan jendela waktu (timeframe) adalah indikator krusial dalam mendeteksi brute force."
    },
    {
      id: "m1-q03",
      meetingId: 1,
      lapsStage: "understand",
      type: "multiple-choice",
      difficulty: "medium",
      cognitiveSkills: ["interpretation"],
      misconception: "private_ip_is_always_safe",
      context: "Workstation sumber beralamat 192.168.1.45 (IP lokal lab komputer siswa).",
      question: "Bagaimana Anda mengevaluasi temuan bahwa penyerang berasal dari IP privat internal?",
      options: [
        { id: "a", text: "Alamat IP privat tidak berbahaya sehingga log dapat langsung diabaikan" },
        { id: "b", text: "Workstation lab siswa kemungkinan telah disusupi malware atau digunakan oleh siswa yang menjalankan automated script" },
        { id: "c", text: "IP privat otomatis berarti router sekolah telah diretas dari satelit" },
        { id: "d", text: "Server authentication sekolah otomatis tidak dapat diretas dari IP privat" }
      ],
      correctAnswer: "b",
      evidence: "Ancaman internal (insider threat) atau compromised host pada subnet lokal.",
      explanation: "IP lokal tidak menjamin keamanan. Perangkat internal yang terinfeksi malware sering digunakan penyerang untuk melakukan lateral movement ke server sensitif.",
      takeaway: "Serangan siber dapat bersumber dari dalam jaringan lokal (compromised internal endpoint)."
    },
    {
      id: "m1-q04",
      meetingId: 1,
      lapsStage: "understand",
      type: "log-comparison",
      difficulty: "hard",
      cognitiveSkills: ["analysis"],
      misconception: "alert_equals_attack",
      context: "Perhatikan perbandingan 2 kasus log alert:<br><strong>Kasus A:</strong> COUNT=94 TIMEFRAME=30 detik.<br><strong>Kasus B:</strong> COUNT=3 TIMEFRAME=10 menit.",
      question: "Kasus manakah yang memerlukan eskalasi darurat analis SOC dan mengapa?",
      options: [
        { id: "a", text: "Kasus B, karena waktu 10 menit memberi hacker kesempatan berpikir lebih lama" },
        { id: "b", text: "Kasus A, karena rasio frekuensi kegagalan ekstrem dalam 30 detik merefleksikan automated dictionary attack berkecepatan tinggi" },
        { id: "c", text: "Keduanya sama berbahayanya karena sama-sama menghasilkan alert" },
        { id: "d", text: "Tidak ada yang berbahaya karena keduanya menargetkan port SSH" }
      ],
      correctAnswer: "b",
      evidence: "Kasus A memiliki densitas serangan 3,13 percobaan/detik vs Kasus B 0,005 percobaan/detik.",
      explanation: "Kasus A menunjukkan serangan terotomatisasi yang intensif dan berpotensi melumpuhkan layanan atau membobol password lemah dalam waktu singkat.",
      takeaway: "Tingkat keparahan insiden diukur dari intensitas, frekuensi, dan kecepatan percobaan serangan."
    },
    {
      id: "m1-q05",
      meetingId: 1,
      lapsStage: "understand",
      type: "misleading-case",
      difficulty: "easy",
      cognitiveSkills: ["interpretation"],
      misconception: "port_alone_means_attack",
      context: "Kasus Khusus: Sebuah alert NIDS menampilkan peringatan dengan label SEVERITY=Low pada port 22.",
      question: "Jika seorang rekan teknisi berkata 'Karena DST_PORT=22, ini pasti brute force!', bagaimana respons Anda?",
      options: [
        { id: "a", text: "Setuju sepenuhnya, karena port 22 tidak pernah digunakan untuk hal lain" },
        { id: "b", text: "Menolak pernyataan tersebut, karena port 22 adalah port sah SSH dan kita memerlukan bukti frekuensi serta signature kegagalan otentikasi" },
        { id: "c", text: "Setuju, tetapi hanya jika kabel LAN yang digunakan berwarna merah" },
        { id: "d", text: "Menolak, karena port SSH yang asli adalah port 80" }
      ],
      correctAnswer: "b",
      evidence: "Port 22 SSH merupakan layanan administrasi remote yang sah dan lazim digunakan.",
      explanation: "Port hanyalah gerbang layanan. Bukti serangan membutuhkan indikator perilaku seperti kegagalan beruntun atau payload eksploitasi.",
      takeaway: "Jangan menyimpulkan adanya serangan hanya berdasarkan nomor port tujuan."
    },
    {
      id: "m1-q06",
      meetingId: 1,
      lapsStage: "understand",
      type: "multiple-choice",
      difficulty: "medium",
      cognitiveSkills: ["analysis"],
      misconception: "signature_is_always_correct",
      context: "NIDS di switch gateway mendeteksi traffic SSH terenkripsi. Seluruh isi muatan paket berbentuk acak karena enkripsi.",
      question: "Apa keterbatasan mendasar NIDS dalam memeriksa paket SSH terenkripsi dibanding HIDS?",
      options: [
        { id: "a", text: "NIDS tidak dapat membaca isi payload data terenkripsi dan hanya dapat mengamati metadata header (IP, port, volume)" },
        { id: "b", text: "NIDS otomatis meledak jika menerima paket enkripsi" },
        { id: "c", text: "HIDS tidak dapat dipasang pada server Linux" },
        { id: "d", text: "NIDS hanya bisa bekerja jika enkripsi menggunakan algoritma MD5" }
      ],
      correctAnswer: "a",
      evidence: "Enkripsi end-to-end SSH melindungi kerahasiaan muatan paket dari inspeksi jaringan pasif.",
      explanation: "NIDS hanya melihat header paket (IP, port, ukuran). Sebaliknya, HIDS pada server dapat membaca log otentikasi langsung dari memori/syslog setelah didekripsi.",
      takeaway: "NIDS unggul dalam visibilitas jaringan, tetapi terbatas pada inspeksi muatan terenkripsi."
    },
    {
      id: "m1-q07",
      meetingId: 1,
      lapsStage: "understand",
      type: "multiple-choice",
      difficulty: "medium",
      cognitiveSkills: ["interpretation"],
      misconception: "alert_equals_attack",
      context: "Sebuah alert Snort tertulis: '[1:2001219:2] ET SCAN Potential SSH Scan'.",
      question: "Apa arti kode '[1:2001219:2]' pada alert tersebut?",
      options: [
        { id: "a", text: "Alamat IP dan nomor kartu siswa penyerang" },
        { id: "b", text: "Signature ID (SID) dan nomor revisi rule yang memicu deteksi" },
        { id: "c", text: "Waktu shutdown server dalam satuan detik" },
        { id: "d", text: "Jumlah total server yang berhasil diretas" }
      ],
      correctAnswer: "b",
      evidence: "Format generator:ID:revisi pada sistem Snort/Suricata.",
      explanation: "Kode tersebut merupakan pengenal spesifik aturan (Rule ID/SID) yang memungkinkan analis memeriksa dokumentasi aturan pendeteksi tersebut.",
      takeaway: "Rule ID pada log IDS mempermudah penelusuran dokumentasi teknis deteksi."
    },
    {
      id: "m1-q08",
      meetingId: 1,
      lapsStage: "understand",
      type: "mini-case",
      difficulty: "hard",
      cognitiveSkills: ["analysis"],
      misconception: "port_alone_means_attack",
      context: "Mini-Case: Server CBT sekolah mengalami perlambatan. Log IDS mencatat 12 koneksi baru ke port 80 (HTTP) dari IP guru yang sah. Pada saat yang sama di port 22 terdapat 94 alert SSH failure dari workstation lab.",
      question: "Sebagai analis, investigasi mana yang harus diprioritaskan?",
      options: [
        { id: "a", text: "Fokus memblokir IP guru di port 80 karena server CBT sedang lambat" },
        { id: "b", text: "Fokus menginvestigasi workstation lab pada port 22 karena menunjukkan pola brute force aktif yang berisiko kompromi kredensial" },
        { id: "c", text: "Mematikan router sekolah sepenuhnya selama jam pelajaran" },
        { id: "d", text: "Mengabaikan keduanya dan menunggu laporan resmi siswa" }
      ],
      correctAnswer: "b",
      evidence: "Port 80 traffic adalah akses legitimate, sedangkan port 22 adalah malicious brute force.",
      explanation: "Aktivitas port 80 dari IP guru adalah akses wajar. Lonjakan 94 kegagalan pada port 22 adalah ancaman keamanan aktif yang kritis.",
      takeaway: "Prioritaskan investigasi pada aktivitas yang menunjukkan karakteristik serangan aktif berbahaya."
    }
  ],

  2: [
    {
      id: "m2-q01",
      meetingId: 2,
      lapsStage: "plan",
      type: "trade-off",
      difficulty: "medium",
      cognitiveSkills: ["analysis"],
      misconception: "signature_is_always_correct",
      context: "Pertimbangan Trade-off: Sekolah memiliki 1 staf IT yang mengelola seluruh infrastruktur jaringan.",
      question: "Dari segi beban operasional harian (workload), mengapa Signature-Based lebih diminati oleh tim dengan SDM terbatas?",
      options: [
        { id: "a", text: "Karena Signature IDS menghasilkan alarm palsu (false positive) yang relatif jauh lebih rendah dibanding Anomaly IDS" },
        { id: "b", text: "Karena Signature IDS tidak membutuhkan listrik untuk beroperasi" },
        { id: "c", text: "Karena Anomaly IDS hanya boleh dijalankan oleh polisi siber" },
        { id: "d", text: "Karena Signature IDS dapat mematikan internet seluruh kota" }
      ],
      correctAnswer: "a",
      evidence: "Tingkat presisi tinggi dari signature rules mengurangi waktu investigasi alert yang tidak perlu.",
      explanation: "Anomaly IDS sering memicu alarm palsu yang mengharuskan staf memeriksa setiap anomali. Tim kecil akan mengalami alert fatigue jika menggunakan Anomaly IDS tanpa tuning.",
      takeaway: "Signature-based memiliki false positive lebih rendah sehingga menghemat tenaga analis."
    },
    {
      id: "m2-q02",
      meetingId: 2,
      lapsStage: "plan",
      type: "trade-off",
      difficulty: "hard",
      cognitiveSkills: ["evaluation"],
      misconception: "alert_equals_attack",
      context: "Administrator menurunkan sensitivitas Anomaly IDS agar tidak menghasilkan banyak alert palsu.",
      question: "Risiko keamanan terbesar apa yang muncul akibat penurunan sensitivitas ambang batas (threshold) tersebut?",
      options: [
        { id: "a", text: "Harddisk server akan lebih cepat penuh" },
        { id: "b", text: "Munculnya False Negative (serangan nyata yang lolos tanpa terdeteksi karena berada di bawah ambang batas baru)" },
        { id: "c", text: "Kabel fiber optic mengalami overheat" },
        { id: "d", text: "Siswa tidak dapat membuka situs web pencarian" }
      ],
      correctAnswer: "b",
      evidence: "Trade-off langsung antara False Positive Rate dan False Negative Rate.",
      explanation: "Menurunkan ambang sensitivitas memang menekan alarm palsu, tetapi meningkatkan risiko 'False Negative', yaitu serangan nyata yang menyusup tanpa terdeteksi.",
      takeaway: "Menurunkan sensitivitas deteksi meningkatkan risiko lolosnya serangan nyata (False Negative)."
    },
    {
      id: "m2-q03",
      meetingId: 2,
      lapsStage: "plan",
      type: "trade-off",
      difficulty: "medium",
      cognitiveSkills: ["analysis"],
      misconception: "signature_is_always_correct",
      context: "Signature rule IDS harus terus-menerus diperbarui (rule updates).",
      question: "Apa konsekuensi jika database signature pada server sekolah tidak pernah di-update selama 1 tahun?",
      options: [
        { id: "a", text: "Server otomatis tidak dapat dinyalakan kembali" },
        { id: "b", text: "IDS menjadi rentan terhadap seluruh exploit dan teknik malware yang muncul dalam kurun waktu 1 tahun tersebut" },
        { id: "c", text: "Semua data nilai siswa akan terenkripsi otomatis" },
        { id: "d", text: "Kecepatan transfer data lokal turun 90%" }
      ],
      correctAnswer: "b",
      evidence: "Ketergantungan absolut Signature IDS pada kebaruan basis data ancaman.",
      explanation: "Signature IDS hanya sekuat pembaruan basis datanya. Aturan lama tidak mengenal serangan baru yang dirilis komunitas exploit setahun terakhir.",
      takeaway: "Signature-based IDS menuntut pembaruan basis data aturan secara berkala."
    },
    {
      id: "m2-q04",
      meetingId: 2,
      lapsStage: "plan",
      type: "trade-off",
      difficulty: "hard",
      cognitiveSkills: ["evaluation"],
      misconception: "high_traffic_equals_ddos",
      context: "Sekolah ingin menerapkan Hybrid IDS (kombinasi Signature dan Anomaly).",
      question: "Apa keunggulan arsitektur Hybrid IDS dalam konteks jaringan modern?",
      options: [
        { id: "a", text: "Bisa menggabungkan kecepatan deteksi serangan dikenal sekaligus menangkap anomali lonjakan serangan baru" },
        { id: "b", text: "Menghilangkan kebutuhan akan kabel jaringan" },
        { id: "c", text: "Dapat bekerja tanpa memerlukan sistem operasi komputer" },
        { id: "d", text: "Biaya perangkat keras menjadi gratis" }
      ],
      correctAnswer: "a",
      evidence: "Sinergi keunggulan signature (presisi tinggi) dan anomali (cakupan zero-day).",
      explanation: "Pendekatan hibrida menyaring serangan umum secara cepat dengan signature, sementara modul anomali mengawasi penyimpangan perilaku yang mencurigakan.",
      takeaway: "Arsitektur Hybrid memadukan keunggulan presisi signature dan fleksibilitas anomali."
    },
    {
      id: "m2-q05",
      meetingId: 2,
      lapsStage: "plan",
      type: "decision-case",
      difficulty: "hard",
      cognitiveSkills: ["evaluation"],
      misconception: "signature_is_always_correct",
      context: "Decision Case: Server ujian sekolah berbasis web (CBT) akan digunakan besok pagi. Sekolah ingin mengamankan dari eksploitasi injeksi SQL yang sudah umum sekaligus mengantisipasi bot spam baru.",
      question: "Keputusan rencana penanganan apa yang paling tepat?",
      options: [
        { id: "a", text: "Mengaktifkan Signature IDS dengan rule Web-Exploit/SQLi yang teruji, serta mengalibrasi baseline Anomaly IDS agar mengakomodasi lonjakan 1000 siswa ujian" },
        { id: "b", text: "Mematikan IDS agar ujian tidak terganggu dan membiarkan server tanpa proteksi" },
        { id: "c", text: "Mengaktifkan Anomaly IDS dengan threshold paling ketat agar setiap siswa yang klik halaman langsung diblokir" },
        { id: "d", text: "Menghapus seluruh file web CBT dari server" }
      ],
      correctAnswer: "a",
      evidence: "Penerapan pertahanan berlapis dengan penyesuaian kalibrasi kontekstual operasional ujian.",
      explanation: "Signature rules melindungi dari exploit web umum secara presisi, sedangkan baseline yang dikalibrasi mencegah siswa ujian terblokir oleh alarm palsu.",
      takeaway: "Rencana pertahanan terbaik menyeimbangkan proteksi keamanan dan kelancaran operasional pengguna."
    }
  ],

  3: [
    {
      id: "m3-q01",
      meetingId: 3,
      lapsStage: "execute",
      type: "reasoning",
      difficulty: "medium",
      cognitiveSkills: ["evaluation"],
      misconception: "alert_equals_attack",
      question: "Mengapa seorang analis SOC tidak boleh langsung memblokir alamat IP setiap kali alert IDS berbunyi?",
      options: [
        { id: "a", text: "Karena alert bisa saja merupakan False Positive dari aktivitas jaringan yang sah sehingga pemblokiran sembarangan dapat mengganggu operasional sekolah" },
        { id: "b", text: "Karena pemblokiran IP memerlukan izin dari kementerian komunikasi" },
        { id: "c", text: "Karena firewall tidak bisa memblokir alamat IP" },
        { id: "d", text: "Karena hacker otomatis mengetahui password analis jika diblokir" }
      ],
      correctAnswer: "a",
      evidence: "Dampak operasional dari False Positive (Denial of Service terhadap pengguna sah).",
      explanation: "Memblokir IP tanpa triase dapat memutus akses pengguna sah seperti guru atau server update resmi jika alert tersebut ternyata False Positive.",
      takeaway: "Triase alert sangat penting untuk mencegah pemblokiran salah sasaran."
    },
    {
      id: "m3-q02",
      meetingId: 3,
      lapsStage: "execute",
      type: "reasoning",
      difficulty: "hard",
      cognitiveSkills: ["inference"],
      misconception: "alert_equals_attack",
      question: "Pada kasus alert pemindaian port (Port Scan) dari workstation admin, mengapa keputusan 'Need More Evidence' lebih profesional dibanding langsung menyimpulkan True Positive?",
      options: [
        { id: "a", text: "Karena bukti awal belum cukup untuk membedakan antara audit keamanan sah oleh admin vs peretasan akun admin oleh pihak luar" },
        { id: "b", text: "Karena sistem IDS dilarang menyalahkan administrator" },
        { id: "c", text: "Karena port scan tidak pernah berbahaya" },
        { id: "d", text: "Karena analis SOC takut dimarahi kepala sekolah" }
      ],
      correctAnswer: "a",
      evidence: "Konteks operasional administrasi vs kompromi akun sah.",
      explanation: "Seorang admin mungkin melakukan audit resmi, namun akun admin juga bisa saja disusupi hacker. Bukti tambahan (tiket kerja/syslog otentikasi) diperlukan sebelum memutuskan.",
      takeaway: "Kasus ambigu membutuhkan penyelidikan bukti tambahan sebelum keputusan diambil."
    },
    {
      id: "m3-q03",
      meetingId: 3,
      lapsStage: "execute",
      type: "reasoning",
      difficulty: "medium",
      cognitiveSkills: ["evaluation"],
      misconception: "high_traffic_equals_ddos",
      question: "Indikator utama yang membuktikan lonjakan traffic 1.8 GB pada pukul 07:00 pagi adalah False Positive adalah...",
      options: [
        { id: "a", text: "Waktu kejadian bertepatan dengan kedatangan siswa dan paket yang lewat adalah HTTPS/DHCP/DNS yang sah untuk registrasi jaringan" },
        { id: "b", text: "Ukuran file log yang sangat rapi di layar monitor" },
        { id: "c", text: "Fakta bahwa server menggunakan kabel berwarna biru" },
        { id: "d", text: "Penggunaan switch bermerk terkenal" }
      ],
      correctAnswer: "a",
      evidence: "Kesesuaian jenis paket jaringan dan jam operasional nyata di lapangan.",
      explanation: "Jenis paket standar (DHCP/DNS/HTTPS) dan kecocokan jam kedatangan siswa membuktikan bahwa lalu lintas tersebut adalah aktivitas alami pengguna sekolah.",
      takeaway: "Korelasi jadwal dan jenis paket membuktikan keabsahan lalu lintas jaringan."
    },
    {
      id: "m3-q04",
      meetingId: 3,
      lapsStage: "execute",
      type: "comparative-case",
      difficulty: "hard",
      cognitiveSkills: ["analysis"],
      misconception: "private_ip_is_always_safe",
      question: "Bandingkan Kasus 1 (83 SSH failure dari IP lab) dan Kasus 2 (lonjakan traffic pagi). Mengapa Kasus 1 diklasifikasikan True Positive sedangkan Kasus 2 False Positive?",
      options: [
        { id: "a", text: "Kasus 1 menunjukkan intensitas kegagalan otentikasi berbahaya pada layanan privat, sedangkan Kasus 2 adalah lalu lintas wajar jam masuk sekolah" },
        { id: "b", text: "Karena Kasus 1 menggunakan protokol TCP sedangkan Kasus 2 menggunakan satelit" },
        { id: "c", text: "Karena Kasus 2 terjadi di pagi hari sehingga selalu dianggap aman" },
        { id: "d", text: "Karena Kasus 1 menargetkan server Windows" }
      ],
      correctAnswer: "a",
      evidence: "Kontras antara intent jahat (otentikasi gagal berulang) vs intent wajar (akses internet jam sekolah).",
      explanation: "Kasus 1 tidak memiliki justifikasi wajar untuk 83 kegagalan otentikasi, sedangkan Kasus 2 memiliki konteks operasional yang kuat dan jenis paket yang legitimate.",
      takeaway: "Klasifikasi TP/FP didasarkan pada intensitas anomali dan konteks kewajaran lalu lintas."
    },
    {
      id: "m3-q05",
      meetingId: 3,
      lapsStage: "execute",
      type: "comparative-case",
      difficulty: "hard",
      cognitiveSkills: ["inference"],
      misconception: "alert_equals_attack",
      question: "Jika workstation admin yang memindai port (Alert 3) terbukti TIDAK memiliki tiket perubahan resmi dan dilakukan dari jarak jauh pada hari libur, bagaimana status triage berubah?",
      options: [
        { id: "a", text: "Berubah menjadi True Positive kritis karena mengindikasikan penyusupan akun kredensial admin secara ilegal" },
        { id: "b", text: "Tetap False Positive karena IP-nya milik admin" },
        { id: "c", text: "Berubah menjadi masalah kabel jaringan" },
        { id: "d", text: "Sistem otomatis menghapus log tersebut" }
      ],
      correctAnswer: "a",
      evidence: "Ketiadaan otorisasi dan anomali waktu mengubah status aktivitas sah menjadi insiden keamanan.",
      explanation: "Bukti tambahan berupa ketiadaan tiket kerja dan anomali waktu di hari libur membuktikan bahwa kredensial admin kemungkinan besar telah disalahgunakan penyerang.",
      takeaway: "Bukti kontekstual baru dapat mengubah klasifikasi awal dari aman menjadi ancaman kritis."
    }
  ]
};

export const meeting1Questions = QUESTIONS_BY_MEETING[1] || [];
export const meeting2Questions = QUESTIONS_BY_MEETING[2] || [];
export const meeting3Questions = QUESTIONS_BY_MEETING[3] || [];
