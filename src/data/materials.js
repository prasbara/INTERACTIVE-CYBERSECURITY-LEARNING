export const MATERIALS = {
  1: {
    id: "m1-material",
    meetingId: 1,
    title: "Materi 1: Arsitektur & Komponen IDS",
    sections: [
      {
        heading: "Pengertian dan Fungsi IDS",
        content: `Intrusion Detection System (IDS) adalah perangkat lunak atau perangkat keras yang memantau lalu lintas jaringan atau aktivitas sistem host secara pasif untuk mendeteksi indikasi aktivitas mencurigakan, pelanggaran kebijakan keamanan, atau serangan siber. Berbeda dengan firewall yang memblokir paket berdasarkan port dan IP, IDS menganalisis pola perilaku dan isi muatan paket secara mendalam.`
      },
      {
        heading: "Perbandingan NIDS vs HIDS",
        content: `NIDS (Network-based IDS) ditempatkan pada titik strategis jaringan (misal: switch port mirroring atau tap network) untuk memantau seluruh paket yang melintasi subnet. Sedangkan HIDS (Host-based IDS) terpasang langsung pada komputer server atau workstation untuk memantau log sistem lokal, integritas file, dan panggilan sistem kernel.`
      }
    ],
    comparisonTable: {
      headers: ["Karakteristik", "Network-Based IDS (NIDS)", "Host-Based IDS (HIDS)"],
      rows: [
        ["Posisi Sensor", "Titik simpul switch / router gateway jaringan", "Terinstal langsung pada sistem operasi host"],
        ["Visibilitas", "Menyeluruh pada segmen subnet jaringan (Network visibility)", "Log autentikasi lokal, file registry, kernel calls (Host visibility)"],
        ["Muatan Terenkripsi", "Sulit memeriksa payload HTTPS/SSH tanpa dekripsi paket", "Dapat membaca aktivitas sebelum dienkripsi / setelah didekripsi host"],
        ["Beban Sistem", "Tidak membebani resource komputasi host/server", "Menggunakan CPU dan RAM dari host yang diproteksi"]
      ]
    }
  },
  2: {
    id: "m2-material",
    meetingId: 2,
    title: "Materi 2: Paradigma Deteksi & Trade-Off",
    sections: [
      {
        heading: "Signature-Based vs Anomaly-Based Detection",
        content: `Signature-Based Detection mencocokkan pola biner paket dengan basis data aturan serangan yang sudah terdokumentasi (known attacks). Metode ini sangat cepat dan memiliki tingkat alarm palsu yang sangat rendah, tetapi tidak mampu mendeteksi eksploitasi zero-day. Sebaliknya, Anomaly-Based Detection membangun profil perilaku normal (baseline); setiap deviasi statistik yang melampaui ambang batas akan ditandai sebagai potensi ancaman.`
      }
    ],
    comparisonTable: {
      headers: ["Dimensi Pertimbangan", "Signature-Based Detection", "Anomaly-Based Detection"],
      rows: [
        ["Deteksi Serangan Dikenal", "Sangat Cepat & Akurat (False Positive Rendah)", "Cukup Baik, namun rentan bias baseline"],
        ["Deteksi Ancaman Baru (Zero-Day)", "Gagal mendeteksi karena belum ada rule", "Mampu mendeteksi deviasi perilaku baru"],
        ["Kebutuhan Pelatihan Baseline", "Rendah (Hanya membutuhkan update rule)", "Tinggi (Memerlukan masa observasi profil normal)"],
        ["Beban Operasional Analis", "Rendah (Aturan terdefinisi jelas)", "Tinggi (Memerlukan verifikasi alarm palsu)"]
      ]
    }
  },
  3: {
    id: "m3-material",
    meetingId: 3,
    title: "Materi 3: Triase Alert & True Positive vs False Positive",
    sections: [
      {
        heading: "Konsep Dasar Alert Triage",
        content: `Alert Triage adalah proses evaluasi cepat oleh analis keamanan untuk menentukan apakah suatu peringatan IDS merupakan ancaman nyata (True Positive), peringatan palsu akibat aktivitas sah (False Positive), atau memerlukan bukti investigasi lanjutan (Need More Evidence).`
      }
    ]
  },
  4: {
    id: "m4-material",
    meetingId: 4,
    title: "Materi 4: Investigasi Insiden Blue Team & Korelasi Multi-Log",
    sections: [
      {
        heading: "Metodologi Korelasi Bukti",
        content: `Dalam investigasi insiden nyata, sebuah alert jaringan harus diverifikasi silang dengan catatan syslog host target. Korelasi meliputi keselarasan timestamp (kronologi detik per detik), identitas akun pengguna, alamat IP asal, dan volume kegagalan otentikasi.`
      }
    ]
  }
};

export const materialsData = Object.values(MATERIALS);
