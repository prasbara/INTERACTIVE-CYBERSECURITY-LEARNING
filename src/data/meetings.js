export const MEETINGS = [
  {
    id: 1,
    title: "Memahami Masalah",
    lapsStage: "understand",
    lapsStageName: "Memahami Masalah",
    heuristicQuestion: "Apa masalahnya?",
    description: "Siswa diberikan sebuah insiden keamanan jaringan sekolah dan harus menginterpretasikan bukti log objektif serta membedakannya dari misleading evidence sebelum mengambil tindakan.",
    cognitiveFocus: ["interpretation", "analysis"],
    activitiesCount: 8,
    completionKey: "meeting1"
  },
  {
    id: 2,
    title: "Merencanakan Pemecahan",
    lapsStage: "plan",
    lapsStageName: "Merencanakan Pemecahan",
    heuristicQuestion: "Adakah alternatif pemecahan masalah?",
    description: "Siswa membandingkan paradigma Signature-Based vs Anomaly-Based, menganalisis matriks kompromi trade-off, dan memilih strategi pertahanan yang paling sesuai dengan karakteristik ancaman.",
    cognitiveFocus: ["analysis", "evaluation"],
    activitiesCount: 8,
    completionKey: "meeting2"
  },
  {
    id: 3,
    title: "Melaksanakan Rencana",
    lapsStage: "execute",
    lapsStageName: "Melaksanakan Rencana",
    heuristicQuestion: "Bagaimana sebaiknya mengerjakannya?",
    description: "Siswa bertindak sebagai analis SOC untuk melakukan alert triage (True Positive, False Positive, Need More Evidence) dengan menerapkan kerangka kerja 7 Konteks Infrastruktur.",
    cognitiveFocus: ["evaluation", "inference"],
    activitiesCount: 8,
    completionKey: "meeting3"
  },
  {
    id: 4,
    title: "Meninjau Kembali",
    lapsStage: "review",
    lapsStageName: "Meninjau Kembali",
    heuristicQuestion: "Apakah solusi ini tepat? Bagaimana kita bisa mengeceknya?",
    description: "Siswa melakukan investigasi Blue Team multi-timestamp, membuktikan temuan dengan security flag, dan menyusun refleksi metakognisi serta rekomendasi mitigasi teknis preventif.",
    cognitiveFocus: ["evaluation", "explanation", "self-regulation"],
    activitiesCount: 7,
    completionKey: "meeting4"
  }
];

export const meetingsData = MEETINGS;
