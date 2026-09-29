export const TRIAGE_CASES = [
  {
    id: 1,
    meetingId: 3,
    lapsStage: "execute",
    badgeLabel: "ALERT #001 — CRITICAL AUTH ANOMALY",
    severity: "danger",
    timestamp: "10:12:00 WIB",
    logRaw: `[ALERT] Multiple SSH login failures
SRC=10.10.10.23 -> DST=10.10.10.5:22
PROTO=TCP | SIG="SSH Authentication Failure"
COUNT=83 attempts | TIMEFRAME=2 minutes | USERNAMES=root,admin,test`,
    context: "Tidak ada jadwal pemeliharaan (maintenance) pada jam KBM sekolah berlangsung.",
    expectedDecision: "TP",
    explanation: "Tepat! Diklasifikasikan sebagai TRUE POSITIVE. Terjadi 83 kali kegagalan login dalam waktu 2 menit dengan kombinasi username kamus default yang secara jelas mengindikasikan upaya automated dictionary/brute-force attack terhadap port SSH tanpa justifikasi operasional."
  },
  {
    id: 2,
    meetingId: 3,
    lapsStage: "execute",
    badgeLabel: "ALERT #002 — TRAFFIC SPIKE ANOMALY",
    severity: "warning",
    timestamp: "07:00:15 WIB",
    logRaw: `[ALERT] Traffic spike detected (Anomaly Threshold Exceeded)
SOURCE=10.10.20.0/24 (Subnet Access Point Siswa & Guru)
TIME=07:00 WIB | TRAFFIC_VOLUME=1.8 GB
PACKET_TYPE=Standard HTTPS/DHCP/DNS Requests`,
    context: "Pukul 07:00 WIB merupakan jam gerbang sekolah dibuka dan 500 siswa serentak menyambungkan gawai ke Wi-Fi sekolah.",
    expectedDecision: "FP",
    explanation: "Tepat! Diklasifikasikan sebagai FALSE POSITIVE. Walaupun volume data melampaui baseline malam hari sebesar 1200%, konteks operasional menunjukkan waktu tersebut adalah jam kedatangan siswa dan paket yang lewat adalah protokol registrasi jaringan standar yang sah."
  },
  {
    id: 3,
    meetingId: 3,
    lapsStage: "execute",
    badgeLabel: "ALERT #003 — PORT SCANNING AMBIGUOUS CASE",
    severity: "info",
    timestamp: "14:30:00 WIB",
    logRaw: `[ALERT] Port Scan Detected
SIG="Nmap SYN Scan Detected" | SRC=10.10.10.44 -> TARGETS=5 internal servers
PORTS_SCANNED=12 ports (21, 22, 80, 443, 3389, etc.)
IDENTITY_TAG=Workstation Administrator Jaringan Utama`,
    context: "IP sumber adalah komputer admin, namun port scanning juga bisa merupakan tanda akun admin telah diretas atau aksi audit resmi.",
    expectedDecision: "NME",
    validDecisions: ["NME", "FP"],
    unlockableEvidence: [
      {
        id: "endpoint",
        label: "Buka Konteks Endpoint",
        content: "Host 10.10.10.44 terdaftar atas nama Pak Budi (Network Administrator). Status antivirus update, tidak ada malware."
      },
      {
        id: "auth",
        label: "Buka Syslog Otentikasi",
        content: "Sesi login admin menggunakan Hardware 2FA Token dari subnet kabel ruang server pada pukul 14:25 WIB."
      },
      {
        id: "baseline",
        label: "Buka Tiket Perubahan IT",
        content: "Tiket IT (CHG-2026-88): Terdaftar jadwal resmi 'Audit Port Kuartal 3 untuk Persiapan Ujian Sekolah' yang disetujui Kepala Sekolah."
      }
    ],
    explanation: "Analisis Kritis Tepat! Memilih NEED MORE EVIDENCE adalah langkah bijak karena bukti awal belum dapat memastikan apakah aktivitas ini adalah audit resmi atau kompromi akun admin. Setelah bukti tiket dibuka, aktivitas ini terbukti merupakan Audit Sah Resmi (False Positive)."
  }
];

const decisionMap = {
  TP: 'TRUE_POSITIVE',
  FP: 'FALSE_POSITIVE',
  NME: 'NEED_MORE_EVIDENCE',
  TRUE_POSITIVE: 'TRUE_POSITIVE',
  FALSE_POSITIVE: 'FALSE_POSITIVE',
  NEED_MORE_EVIDENCE: 'NEED_MORE_EVIDENCE'
};

export const triageCasesData = TRIAGE_CASES.map(tc => {
  const normExpected = decisionMap[tc.expectedDecision] || tc.expectedDecision;
  const validDecs = (tc.validDecisions || [tc.expectedDecision]).map(d => decisionMap[d] || d);
  // Also include the shorthand so either format works
  const allValids = [...new Set([...validDecs, tc.expectedDecision])];

  return {
    ...tc,
    id: `tc-${tc.id}`,
    expectedDecision: normExpected,
    validDecisions: allValids,
    alert: {
      severity: tc.severity === 'danger' ? 'High' : (tc.severity === 'warning' ? 'Medium' : 'Low'),
      signature: tc.badgeLabel || `Alert #${tc.id}`,
      srcIp: tc.id === 1 ? '10.10.10.23' : (tc.id === 2 ? '10.10.20.0/24' : '10.10.10.44'),
      srcPort: tc.id === 1 ? '49152' : 'Random',
      dstIp: '10.10.10.5',
      dstPort: tc.id === 1 ? '22 (SSH)' : (tc.id === 2 ? '443 (HTTPS)' : '21, 22, 80, 443'),
      timestamp: tc.timestamp || '10:00:00 WIB',
      protocol: 'TCP'
    },
    additionalEvidence: (tc.unlockableEvidence || []).map(e => ({
      id: e.id,
      title: e.label || e.title,
      content: e.content
    }))
  };
});
