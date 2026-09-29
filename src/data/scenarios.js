export const SCENARIOS = [
  {
    id: 1,
    meetingId: 2,
    lapsStage: "plan",
    title: "Skenario 1: Serangan Exploit Lama yang Sudah Memiliki CVE",
    description: "Sistem pemindai mencurigai adanya percobaan eksploitasi EternalBlue (MS17-010) yang menargetkan port 445 SMB pada server file sharing sekolah. Pola payload serangan ini sudah sangat terdokumentasi dan pola byte-nya bersifat statis.",
    expectedChoice: "SIG",
    options: [
      { id: "SIG", label: "Signature-Based Detection" },
      { id: "ANOM", label: "Anomaly-Based Detection" }
    ],
    reasoning: "Tepat Sekali! Serangan EternalBlue (MS17-010) adalah known attack dengan karakteristik byte payload dan CVE yang sangat spesifik. Signature-Based IDS adalah solusi paling efisien, cepat, dan memiliki tingkat false positive yang sangat rendah untuk serangan yang sudah dikenal luas."
  },
  {
    id: 2,
    meetingId: 2,
    lapsStage: "plan",
    title: "Skenario 2: Indikasi Malware Varian Baru (Unknown Exploit)",
    description: "Laboratorium komputer menemukan indikasi workstation staf mengirimkan beacon aneh ke internet dengan frekuensi acak. Malware ini merupakan varian ransomware baru yang belum memiliki nomor CVE maupun tanda tangan (signature) pada database IDS vendor manapun.",
    expectedChoice: "ANOM",
    options: [
      { id: "SIG", label: "Signature-Based Detection" },
      { id: "ANOM", label: "Anomaly-Based Detection" }
    ],
    reasoning: "Tepat Sekali! Karena malware ini merupakan varian baru (zero-day) yang belum memiliki signature/aturan statis, Signature-Based IDS dipastikan akan gagal mendeteksinya. Anomaly-Based IDS adalah pilihan terbaik karena mampu mendeteksi deviasi perilaku beaconing yang tidak biasa dari baseline traffic normal."
  },
  {
    id: 3,
    meetingId: 2,
    lapsStage: "plan",
    title: "Skenario 3: Lonjakan Trafik pada Hari Pertama Ujian Berbasis Komputer",
    description: "Pada jam 07:30 pagi hari pertama ujian sekolah, ribuan siswa serentak mengakses server CBT lokal. Paket data yang dikirimkan adalah HTTP GET yang sepenuhnya sah, namun volumenya melonjak drastis hingga 500% melampaui hari biasa.",
    expectedChoice: "SIG",
    options: [
      { id: "SIG", label: "Signature-Based Detection" },
      { id: "ANOM", label: "Anomaly-Based Detection" }
    ],
    reasoning: "Analisis Kritis Tepat! Meskipun terjadi lonjakan 500%, lalu lintas ini adalah akses sah siswa yang memang dijadwalkan. Jika menggunakan Anomaly-Based IDS yang kaku, sistem akan memicu 'False Positive' besar-besaran dan memblokir siswa ujian. Menyesuaikan baseline atau mengandalkan signature rule yang tepat adalah pendekatan yang lebih bijak."
  }
];

export const scenariosData = SCENARIOS.map(s => ({
  ...s,
  options: (s.options || []).map(opt => ({
    ...opt,
    title: opt.title || opt.label,
    description: opt.description || opt.label
  }))
}));
