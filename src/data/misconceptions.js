export const MISCONCEPTIONS = {
  port_alone_means_attack: {
    id: "port_alone_means_attack",
    label: "Port Layanan Selalu Berarti Serangan",
    description: "Mengasumsikan bahwa semata-mata kehadiran port 22/80/443 otomatis menandakan adanya serangan, padahal port tersebut adalah layanan jaringan standar.",
    remediationTarget: "meeting-1-material"
  },
  alert_equals_attack: {
    id: "alert_equals_attack",
    label: "Setiap Alert IDS Pasti Serangan Nyata",
    description: "Menganggap setiap alert yang dikeluarkan IDS 100% pasti merupakan serangan berbahaya (mengabaikan kemungkinan false positive).",
    remediationTarget: "meeting-3-material"
  },
  high_traffic_equals_ddos: {
    id: "high_traffic_equals_ddos",
    label: "Lonjakan Volume Otomatis DDoS",
    description: "Menganggap setiap lonjakan volume lalu lintas otomatis adalah serangan DoS/DDoS, tanpa meninjau konteks operasional jadwal kedatangan/kegiatan sekolah.",
    remediationTarget: "meeting-2-material"
  },
  signature_is_always_correct: {
    id: "signature_is_always_correct",
    label: "Signature IDS Dapat Mendeteksi Segala Serangan",
    description: "Mengasumsikan signature-based IDS dapat mendeteksi semua varian ancaman termasuk zero-day exploit.",
    remediationTarget: "meeting-2-material"
  },
  private_ip_is_always_safe: {
    id: "private_ip_is_always_safe",
    label: "IP Privat Lokal Pasti Aman",
    description: "Menganggap alamat IP lokal (192.168.x.x / 10.x.x.x) selalu aman dan mustahil menjadi sumber serangan lateral internal.",
    remediationTarget: "meeting-1-material"
  }
};
