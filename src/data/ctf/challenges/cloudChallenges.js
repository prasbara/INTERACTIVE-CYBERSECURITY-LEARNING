/**
 * Category F: Cloud & Container Infrastructure Attacks (Challenges RC-CTF-023 to RC-CTF-026)
 * Conforms to LAPS-Heuristik SOC Investigation Architecture:
 * Case File -> Mission -> Evidence -> Timeline -> Investigation -> Flag -> Mitigation -> Reflection
 */

export const CLOUD_CHALLENGES = [
  {
    id: "RC-CTF-023",
    aliasId: "ctf-023",
    title: "AWS S3 Storage Exposure & MITRE ATT&CK Mapping (MITRE-nya Mana Bang)",
    category: "cloud",
    difficulty: "beginner",
    estimatedMinutes: 15,
    xpReward: 50,
    sourceId: "aws-s3-exposure-cases",
    affectedTechnology: "Amazon Simple Storage Service (AWS S3) & CloudTrail",
    mitreTechniques: ["T1530", "T1078.004"],
    lapsStage: "review",
    attackCategory: "cloud",
    realWorldCase: "Peringatan GuardDuty mendeteksi aktivitas anomali ketika pengguna anonim tak terautentikasi (Principal: *) melakukan enumerasi daftar file dan pengunduhan massal berkas basis data dari bucket S3 penyimpanan data sekolah.",
    flag: "FLAG{MITRE_NYA_MANA_BANG}",
    flagConfig: {
      value: "FLAG{MITRE_NYA_MANA_BANG}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Identifikasi kebocoran data S3 bucket akibat Principal wildcard dan petakan aktivitas penyerang ke matriks MITRE ATT&CK for Cloud (T1530: Data from Cloud Storage).",
      successCriteria: [
        "Analisis log CloudTrail untuk mengidentifikasi event GetObject dan IP anonim",
        "Temukan file confidential yang dieksfiltrasi pada cloudtrail_s3.json",
        "Petakan taktik dan teknik MITRE ATT&CK yang sesuai",
        "Submit flag dan rancang kebijakan S3 Block Public Access"
      ]
    },
    caseBrief: {
      incidentCode: "INC-CLD-023",
      targetHost: "AWS-S3-SMK-BACKUP",
      detectionSource: "AWS CloudTrail S3 Data Events & Amazon GuardDuty",
      narrative: "Peringatan GuardDuty mendeteksi aktivitas anomali ketika pengguna anonim tak terautentikasi (Principal: *) melakukan enumerasi daftar file dan pengunduhan massal berkas basis data dari bucket S3 penyimpanan data sekolah.",
      mission: [
        "1. Analisis log CloudTrail untuk mengidentifikasi nama bucket dan IP pemanggil.",
        "2. Identifikasi file sensitif berformat .sql atau .csv yang diunduh penyerang.",
        "3. Temukan kesalahan kebijakan ACL / Bucket Policy yang menyebabkan data terekspos.",
        "4. Dapatkan flag kebocoran S3 dan tentukan mitigasi S3 Block Public Access."
      ]
    },
    timeline: [
      { time: "08:15:30 WIB", sensor: "cloudtrail_s3.json", event: "ListObjectsV2 called on smk-student-backup-2026 by Anonymous (198.51.100.88)" },
      { time: "08:15:42 WIB", sensor: "cloudtrail_s3.json", event: "GetObject called on exports/rapor_siswa_2026_confidential.csv by Anonymous" }
    ],
    evidencePack: [
      {
        id: "ev-023-a",
        fileName: "cloudtrail_s3.json",
        fileType: "cloudtrail_json",
        description: "Catatan CloudTrail S3 Data Event API",
        content: `[
  {
    "eventTime": "2026-09-28T08:15:30Z",
    "eventName": "ListObjectsV2",
    "eventSource": "s3.amazonaws.com",
    "sourceIPAddress": "198.51.100.88",
    "userAgent": "aws-cli/2.7.12 Python/3.9.11",
    "requestParameters": {
      "bucketName": "smk-student-backup-2026",
      "prefix": ""
    },
    "userIdentity": {
      "type": "Anonymous",
      "principalId": "ANONYMOUS"
    }
  },
  {
    "eventTime": "2026-09-28T08:15:42Z",
    "eventName": "GetObject",
    "eventSource": "s3.amazonaws.com",
    "sourceIPAddress": "198.51.100.88",
    "requestParameters": {
      "bucketName": "smk-student-backup-2026",
      "key": "exports/rapor_siswa_2026_confidential.csv"
    },
    "userIdentity": {
      "type": "Anonymous"
    }
  }
]`
      },
      {
        id: "ev-023-b",
        fileName: "bucket_policy.json",
        fileType: "iam_policy",
        description: "Konfigurasi kebijakan akses bucket S3 yang keliru",
        content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::smk-student-backup-2026",
        "arn:aws:s3:::smk-student-backup-2026/*"
      ]
    }
  ]
}`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Nama file sensitif apa yang diunduh oleh IP anonim 198.51.100.88?",
        type: "single_choice",
        options: [
          { id: "a", text: "exports/rapor_siswa_2026_confidential.csv" },
          { id: "b", text: "index.html" },
          { id: "c", text: "logo_smk.png" },
          { id: "d", text: "backup.tar.gz" }
        ],
        correctAnswer: "a",
        explanation: "Event GetObject mencatat pengambilan key 'exports/rapor_siswa_2026_confidential.csv'."
      },
      {
        id: "q2",
        question: "Teknik MITRE ATT&CK Cloud manakah yang mendeskripsikan pengambilan data langsung dari penyimpanan objek ini?",
        type: "single_choice",
        options: [
          { id: "a", text: "T1530: Data from Cloud Storage Object" },
          { id: "b", text: "T1059: Command and Scripting Interpreter" },
          { id: "c", text: "T1110: Brute Force" },
          { id: "d", text: "T1498: Network Denial of Service" }
        ],
        correctAnswer: "a",
        explanation: "T1530 dalam matriks MITRE ATT&CK secara khusus mengklasifikasikan eksfiltrasi data dari AWS S3, Google Cloud Storage, atau Azure Blob."
      }
    ],
    hints: [
      { tier: 1, text: "Petakan aktivitas enumerasi bucket publik ke taktik dan teknik framework MITRE ATT&CK." },
      { tier: 2, text: "Periksa event GetObject pada cloudtrail_s3.json dan konfigurasi Principal '*' pada bucket_policy.json." },
      { tier: 3, text: "Pemetaan teknik MITRE T1530 membuktikan kebocoran file rapor siswa akibat miskonfigurasi perizinan." }
    ],
    mitigationSummary: "Aktifkan S3 Block Public Access pada level akun AWS dan bucket. Hapus izin Principal '*' pada Bucket Policy.",
    mitigation: [
      "Aktifkan fitur AWS S3 Block Public Access di tingkat seluruh akun",
      "Hapus policy statement yang menyertakan Principal '*' dari bucket policy",
      "Nyalakan audit kepatuhan Amazon GuardDuty dan AWS Config S3 Bucket Public Read Prohibited"
    ],
    reflection: [
      "Mengapa pemetaan ke kerangka kerja MITRE ATT&CK penting dalam standarisasi laporan SOC?",
      "Evidence mana yang membuktikan request pengunduhan dilakukan tanpa autentikasi?",
      "Apakah ada skenario legal di mana bucket S3 diizinkan memiliki izin publik?",
      "Bagaimana cara memvalidasi keputusanmu dengan meninjau CloudTrail user identity?",
      "Mitigasi apa yang mencegah developer secara tidak sengaja membuka akses publik ke bucket?"
    ],
    lapsMapping: {
      understand: "Memahami bahaya miskonfigurasi perizinan cloud storage bucket publik.",
      plan: "Menganalisis CloudTrail data event dan bucket policy JSON.",
      execute: "Mengekstrak berkas rahasia yang diakses dan IP sumber anonim.",
      review: "Menerapkan prinsip Least Privilege dan mengaktifkan audit kepatuhan AWS Config."
    }
  },
  {
    id: "RC-CTF-024",
    aliasId: "ctf-024",
    title: "Cloud Credential Theft & Stealth Malware Behavior (Si Malware Pura-Pura Normal)",
    category: "cloud",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    xpReward: 100,
    sourceId: "mitre-t1552-git-keys",
    affectedTechnology: "AWS Identity and Access Management (IAM) & Git VCS",
    mitreTechniques: ["T1552.001", "T1078.004"],
    lapsStage: "review",
    attackCategory: "cloud",
    realWorldCase: "Kunci akses IAM (Access Key ID) salah seorang developer magang tidak sengaja terunggah ke repositori kode publik. Penyerang menggunakan skrip yang berpura-pura normal untuk mencuri kredensial dan membuat akun backdoor.",
    flag: "FLAG{SI_MALWARE_PURA_PURA_NORMAL}",
    flagConfig: {
      value: "FLAG{SI_MALWARE_PURA_PURA_NORMAL}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Identifikasi perilaku penyamaran penyerang yang berpura-pura menjadi skrip pemeliharaan normal saat mengekstrak kunci cloud dan membuat akun shadow admin.",
      successCriteria: [
        "Temukan commit git yang membocorkan AWS_ACCESS_KEY_ID pada git_diff.patch",
        "Telusuri panggilan API CloudTrail CreateUser dan AttachUserPolicy",
        "Identifikasi nama akun backdoor cloud_shadow_admin",
        "Submit flag dan rancang pencabutan kredensial serta secret scanning"
      ]
    },
    caseBrief: {
      incidentCode: "INC-CLD-024",
      targetHost: "AWS-IAM-TENANT-SMK",
      detectionSource: "AWS CloudTrail Management Events",
      narrative: "Kunci akses IAM (Access Key ID) salah seorang developer magang tidak sengaja terunggah ke repositori kode publik. Dalam hitungan detik, bot otomatis penyerang menggunakan kunci tersebut untuk membuat akun admin baru.",
      mission: [
        "1. Temukan commit git yang membocorkan AWS_ACCESS_KEY_ID.",
        "2. Telusuri panggilan API CloudTrail: GetCallerIdentity dan CreateUser.",
        "3. Identifikasi akun backdoor yang dibuat oleh penyerang.",
        "4. Dapatkan flag eksploitasi kunci cloud yang bocor."
      ]
    },
    timeline: [
      { time: "10:04:12 WIB", sensor: "git_diff.patch", event: "Git commit 8f2a11b93d leaked AKIA2J58FEXAMPLE1234 in config/aws.js" },
      { time: "10:06:10 WIB", sensor: "cloudtrail_iam.json", event: "GetCallerIdentity invoked by IP 198.51.100.101 using leaked access key" },
      { time: "10:06:45 WIB", sensor: "cloudtrail_iam.json", event: "CreateUser invoked creating user cloud_shadow_admin" },
      { time: "10:07:00 WIB", sensor: "cloudtrail_iam.json", event: "AttachUserPolicy AdministratorAccess granted to cloud_shadow_admin" }
    ],
    evidencePack: [
      {
        id: "ev-024-a",
        fileName: "git_diff.patch",
        fileType: "diff",
        description: "Potongan commit git yang tidak sengaja menyertakan kredensial cloud",
        content: `commit 8f2a11b93d
Author: dev-junior <junior@smk.sch.id>
Date:   Mon Sep 28 10:04:12 2026 +0700

    feat: add s3 uploader script
---
+++ b/config/aws.js
@@ -1,5 +1,5 @@
 const AWS = require('aws-sdk');
-const accessKeyId = process.env.AWS_KEY;
+const accessKeyId = 'AKIA2J58FEXAMPLE1234';
+const secretKey = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';`
      },
      {
        id: "ev-024-b",
        fileName: "cloudtrail_iam.json",
        fileType: "cloudtrail_json",
        description: "Log aktivitas API IAM AWS CloudTrail",
        content: `[
  {
    "eventTime": "2026-09-28T03:06:10Z",
    "eventName": "GetCallerIdentity",
    "sourceIPAddress": "198.51.100.101",
    "userIdentity": {
      "type": "IAMUser",
      "userName": "dev-junior",
      "accessKeyId": "AKIA2J58FEXAMPLE1234"
    }
  },
  {
    "eventTime": "2026-09-28T03:06:45Z",
    "eventName": "CreateUser",
    "sourceIPAddress": "198.51.100.101",
    "requestParameters": {
      "userName": "cloud_shadow_admin"
    }
  },
  {
    "eventTime": "2026-09-28T03:07:00Z",
    "eventName": "AttachUserPolicy",
    "requestParameters": {
      "userName": "cloud_shadow_admin",
      "policyArn": "arn:aws:iam::aws:policy/AdministratorAccess"
    }
  }
]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Nama pengguna IAM baru apa yang dibuat penyerang sebagai pintu belakang (backdoor)?",
        type: "single_choice",
        options: [
          { id: "a", text: "cloud_shadow_admin" },
          { id: "b", text: "dev-junior" },
          { id: "c", text: "root" },
          { id: "d", text: "administrator" }
        ],
        correctAnswer: "a",
        explanation: "API CreateUser dipanggil dengan parameter userName: cloud_shadow_admin."
      },
      {
        id: "q2",
        question: "Kebijakan (Policy) apa yang dilekatkan oleh penyerang pada akun baru tersebut?",
        type: "single_choice",
        options: [
          { id: "a", text: "arn:aws:iam::aws:policy/AdministratorAccess" },
          { id: "b", text: "arn:aws:iam::aws:policy/ReadOnlyAccess" },
          { id: "c", text: "arn:aws:iam::aws:policy/AmazonS3FullAccess" },
          { id: "d", text: "arn:aws:iam::aws:policy/AWSLambda_FullAccess" }
        ],
        correctAnswer: "a",
        explanation: "AttachUserPolicy melampirkan AdministratorAccess yang memberikan kontrol tak terbatas atas akun cloud."
      }
    ],
    hints: [
      { tier: 1, text: "Waspadai perilaku skrip atau malware yang berpura-pura normal untuk menyamarkan pencurian kredensial." },
      { tier: 2, text: "Cek nama user yang dibuat pada event CreateUser di cloudtrail_iam.json." },
      { tier: 3, text: "Perilaku penyerang yang membuat akun shadow admin membuktikan eskalasi privilese tersembunyi." }
    ],
    mitigationSummary: "Cabut (revoke) Access Key AKIA2J58FEXAMPLE1234 segera, hapus akun backdoor cloud_shadow_admin, dan pasang pre-commit git-secrets / TruffleHog.",
    mitigation: [
      "Hapus (deactivate/delete) access key IAM yang bocor segera",
      "Hapus pengguna cloud_shadow_admin dan cabut seluruh access policy",
      "Integrasikan TruffleHog / GitGuardian pada workflow CI/CD untuk mencegah kebocoran rahasia"
    ],
    reflection: [
      "Mengapa malware atau bot pemburu kunci cloud sering berpura-pura normal?",
      "Evidence mana yang membuktikan kunci bocor dari commit git bukan dari serangan jaringan?",
      "Apakah ada kemungkinan false positive jika developer membuat akun testing resmi?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat audit trail GetCallerIdentity?",
      "Mitigasi apa yang menjamin kredensial tidak pernah tersimpan di repositori git?"
    ],
    lapsMapping: {
      understand: "Menyadari risiko fatal hardcoding kredensial cloud pada source code repositori.",
      plan: "Menganalisis commit history git dan rentetan panggilan API IAM pada CloudTrail.",
      execute: "Mengekstrak kunci yang bocor, identitas penyerang, dan akun backdoor yang dibuat.",
      review: "Menerapkan secret scanning otomatis pada CI/CD pipeline dan rotasi kredensial berkala."
    }
  },
  {
    id: "RC-CTF-025",
    aliasId: "ctf-025",
    title: "CloudTrail Log Tampering & Investigation Workflow (404 Attacker Not Found)",
    category: "cloud",
    difficulty: "advanced",
    estimatedMinutes: 20,
    xpReward: 175,
    sourceId: "mitre-t1562-cloudtrail",
    affectedTechnology: "AWS CloudTrail & AWS CloudWatch Logs",
    mitreTechniques: ["T1562.001"],
    lapsStage: "review",
    attackCategory: "cloud",
    realWorldCase: "Setelah berhasil masuk menggunakan akun dengan privilese tinggi, penyerang mencoba menghilangkan jejak audit dengan mematikan rekaman log audit CloudTrail di seluruh region (404 trace).",
    flag: "FLAG{404_ATTACKER_NOT_FOUND}",
    flagConfig: {
      value: "FLAG{404_ATTACKER_NOT_FOUND}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Jalankan alur kerja investigasi (investigation workflow) yang tepat untuk merekonstruksi jejak digital ketika penyerang berusaha menghilangkan log (404 attacker not found).",
      successCriteria: [
        "Analisis pemanggilan API StopLogging dan DeleteTrail pada cloudtrail_evasion.json",
        "Identifikasi nama trail smk-security-audit-trail yang menjadi target",
        "Temukan IP dan akun pelaku admin-compromised sebelum log dimatikan",
        "Submit flag dan formulasikan kebijakan SCP anti-tampering"
      ]
    },
    caseBrief: {
      incidentCode: "INC-CLD-025",
      targetHost: "AWS-CLOUDTRAIL-ORG",
      detectionSource: "Amazon GuardDuty Finding: Stealth:IAMUser/CloudTrailLoggingDisabled",
      narrative: "Setelah berhasil masuk menggunakan akun dengan privilese tinggi, penyerang mencoba menghilangkan jejak audit dengan mematikan rekaman log audit CloudTrail di seluruh region.",
      mission: [
        "1. Analisis pemanggilan API StopLogging pada CloudTrail.",
        "2. Identifikasi nama trail audit yang dimatikan oleh aktor ancaman.",
        "3. Tentukan langkah mitigasi SCP (Service Control Policy) untuk mengunci CloudTrail.",
        "4. Dapatkan flag penonaktifan pertahanan cloud."
      ]
    },
    timeline: [
      { time: "18:20:00 WIB", sensor: "cloudtrail_evasion.json", event: "API StopLogging called on smk-security-audit-trail by admin-compromised (203.0.113.77)" },
      { time: "18:20:45 WIB", sensor: "cloudtrail_evasion.json", event: "API DeleteTrail called deleting smk-security-audit-trail" }
    ],
    evidencePack: [
      {
        id: "ev-025-a",
        fileName: "cloudtrail_evasion.json",
        fileType: "cloudtrail_json",
        description: "Log aksi perusakan audit trail",
        content: `[
  {
    "eventTime": "2026-09-28T11:20:00Z",
    "eventName": "StopLogging",
    "eventSource": "cloudtrail.amazonaws.com",
    "sourceIPAddress": "203.0.113.77",
    "requestParameters": {
      "name": "arn:aws:cloudtrail:ap-southeast-1:123456789012:trail/smk-security-audit-trail"
    },
    "userIdentity": {
      "type": "IAMUser",
      "userName": "admin-compromised"
    }
  },
  {
    "eventTime": "2026-09-28T11:20:45Z",
    "eventName": "DeleteTrail",
    "eventSource": "cloudtrail.amazonaws.com",
    "sourceIPAddress": "203.0.113.77",
    "requestParameters": {
      "name": "smk-security-audit-trail"
    }
  }
]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Perintah API CloudTrail apa yang pertama kali dipanggil penyerang untuk menghentikan pencatatan aktivitas?",
        type: "single_choice",
        options: [
          { id: "a", text: "StopLogging" },
          { id: "b", text: "StartLogging" },
          { id: "c", text: "DescribeTrails" },
          { id: "d", text: "PutEventSelectors" }
        ],
        correctAnswer: "a",
        explanation: "StopLogging menghentikan pengiriman catatan event ke bucket S3 dan CloudWatch."
      },
      {
        id: "q2",
        question: "Apa nama trail audit keamanan yang dihapus (DeleteTrail) oleh penyerang?",
        type: "single_choice",
        options: [
          { id: "a", text: "smk-security-audit-trail" },
          { id: "b", text: "default-trail" },
          { id: "c", text: "main-trail" },
          { id: "d", text: "production-log" }
        ],
        correctAnswer: "a",
        explanation: "Nilai parameter 'name' pada DeleteTrail adalah 'smk-security-audit-trail'."
      }
    ],
    hints: [
      { tier: 1, text: "Susun alur kerja investigasi sistematis saat jejak penyerang sengaja dihilangkan." },
      { tier: 2, text: "Lihat eventName StopLogging dan DeleteTrail pada berkas cloudtrail_evasion.json." },
      { tier: 3, text: "Meskipun penyerang berusaha menjadi 404 not found, event penghapusan log itu sendiri terekam dan menjadi bukti tak terbantahkan." }
    ],
    mitigationSummary: "Terapkan AWS Organizations Service Control Policy (SCP) yang melarang keras pemanggilan cloudtrail:StopLogging dan cloudtrail:DeleteTrail bahkan oleh root sekalipun.",
    mitigation: [
      "Pasang Service Control Policy (SCP) di level root organization: Deny action StopLogging & DeleteTrail",
      "Kunci bucket penyimpanan log S3 dengan Object Lock (WORM compliance)",
      "Kirimkan notifikasi darurat via Amazon SNS jika ada upaya perubahan konfigurasi trail"
    ],
    reflection: [
      "Bagaimana alur kerja investigasi SOC saat menghadapi insiden perusakan jejak log?",
      "Evidence mana yang membuktikan akun admin-compromised melakukan sabotase audit?",
      "Apakah ada skenario resmi di mana sysadmin mematikan trail log audit?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat rekaman event di CloudWatch?",
      "Mitigasi apa yang mencegah administrator lokal menghapus rekaman log audit?"
    ],
    lapsMapping: {
      understand: "Memahami taktik pertahanan yang dilemahkan (Impair Defenses / Evasion) pada infrastruktur cloud.",
      plan: "Menganalisis CloudTrail event StopLogging dan DeleteTrail.",
      execute: "Mengekstrak identitas aktor, IP sumber, dan nama trail sasaran.",
      review: "Merancang AWS SCP guardrail yang tidak bisa di-override oleh administrator lokal."
    }
  },
  {
    id: "RC-CTF-026",
    aliasId: "ctf-026",
    title: "Container Escape & Terminal Investigation (Terminalnya Cuma Simulasi)",
    category: "cloud",
    difficulty: "expert",
    estimatedMinutes: 25,
    xpReward: 250,
    sourceId: "mitre-t1611-docker-escape",
    affectedTechnology: "Docker Engine Daemon & Docker Socket /var/run/docker.sock",
    mitreTechniques: ["T1611", "T1068"],
    lapsStage: "review",
    attackCategory: "cloud",
    realWorldCase: "Sensor Falco mendeteksi peringatan kritis: 'Notice Container escape detected - interaction with host docker socket inside container'. Penyerang yang membobol webapp container menyalahgunakan socket docker host untuk mengambil alih seluruh mesin server fisik.",
    flag: "FLAG{TERMINALNYA_CUMA_SIMULASI}",
    flagConfig: {
      value: "FLAG{TERMINALNYA_CUMA_SIMULASI}",
      caseSensitive: false,
      maxAttempts: 5
    },
    mission: {
      objective: "Gunakan terminal simulasi sandbox untuk menyelidiki berkas docker-compose.yml dan membuktikan eskalasi pelarian kontainer (container escape) via host unix socket.",
      successCriteria: [
        "Analisis docker-compose.yml untuk membuktikan volume mount /var/run/docker.sock",
        "Periksa alert Falco 'Launch Privileged Container Escape'",
        "Buktikan interaksi proses curl terhadap socket unix dockerd",
        "Submit flag dan rancang isolasi kontainer menggunakan rootless Docker"
      ]
    },
    caseBrief: {
      incidentCode: "INC-CLD-026",
      targetHost: "K8S-NODE-WORKER-01 (10.0.80.26)",
      detectionSource: "Linux Auditd & Falco Container Runtime Security",
      narrative: "Sensor Falco mendeteksi peringatan kritis: 'Notice Container escape detected - interaction with host docker socket inside container'. Penyerang yang membobol webapp container menyalahgunakan socket docker host untuk mengambil alih seluruh mesin server fisik.",
      mission: [
        "1. Analisis docker-compose.yml untuk membuktikan volume mount yang tidak aman.",
        "2. Identifikasi perintah curl ke socket unix untuk men-spawn container baru dengan mount /host.",
        "3. Buktikan eskalasi kontainer ke root host sistem dan peroleh flag pelarian kontainer."
      ]
    },
    timeline: [
      { time: "16:40:12 WIB", sensor: "falco_alerts.json", event: "Notice: Ingress /var/run/docker.sock touched by curl in container web-monitoring" },
      { time: "16:40:15 WIB", sensor: "falco_alerts.json", event: "Critical: Privileged container e7b41f2 spawned mounting host filesystem / into /host" }
    ],
    evidencePack: [
      {
        id: "ev-026-a",
        fileName: "docker-compose.yml",
        fileType: "yaml",
        description: "Berkas konfigurasi deployment container yang rentan",
        content: `version: '3.8'
services:
  web-monitoring:
    image: custom-nginx-dashboard:latest
    ports:
      - "8080:80"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always`
      },
      {
        id: "ev-026-b",
        fileName: "falco_alerts.json",
        fileType: "falco_json",
        description: "Peringatan keamanan runtime container Falco",
        content: `[
  {
    "output": "16:40:12.120 [CRITICAL] Ingress /var/run/docker.sock touched by non-docker binary (user=root container_name=web-monitoring comm=curl)",
    "priority": "Critical",
    "rule": "Docker Socket Mount Interaction"
  },
  {
    "output": "16:40:15.334 [CRITICAL] Privileged container created mounting host filesystem / into /host (user=root container_id=e7b41f2 comm=dockerd)",
    "priority": "Critical",
    "rule": "Launch Privileged Container Escape"
  }
]`
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Volume mount apa pada docker-compose.yml yang memberikan kontrol penuh terhadap daemon docker host?",
        type: "single_choice",
        options: [
          { id: "a", text: "/var/run/docker.sock:/var/run/docker.sock" },
          { id: "b", text: "/var/log:/var/log" },
          { id: "c", text: "/etc/nginx:/etc/nginx" },
          { id: "d", text: "8080:80" }
        ],
        correctAnswer: "a",
        explanation: "Mounting /var/run/docker.sock memungkinkan proses apapun di dalam kontainer berkomunikasi langsung dengan daemon docker host."
      },
      {
        id: "q2",
        question: "Perangkat lunak deteksi runtime container apa yang memicu alert 'Launch Privileged Container Escape'?",
        type: "single_choice",
        options: [
          { id: "a", text: "Falco" },
          { id: "b", text: "Suricata" },
          { id: "c", text: "Wireshark" },
          { id: "d", text: "Nmap" }
        ],
        correctAnswer: "a",
        explanation: "Falco adalah sistem keamanan runtime berbasis eBPF/sysdig untuk kontainer dan Kubernetes."
      }
    ],
    hints: [
      { tier: 1, text: "Gunakan perintah terminal untuk menelaah berkas docker-compose.yml dan alert Falco." },
      { tier: 2, text: "Perhatikan bagian volumes yang me-mount socket unix docker host ke dalam kontainer." },
      { tier: 3, text: "Pelarian kontainer ke root host terkonfirmasi melalui manipulasi socket Docker di terminal." }
    ],
    mitigationSummary: "Jangan pernah me-mount /var/run/docker.sock ke dalam kontainer yang melayani traffic publik. Gunakan rootless Docker atau gVisor / Kata Containers untuk isolasi kernel.",
    mitigation: [
      "Hapus mount /var/run/docker.sock dari seluruh kontainer publik",
      "Jalankan Docker daemon dalam mode Rootless (Rootless Docker)",
      "Terapkan runtime container sandbox seperti gVisor atau Kata Containers"
    ],
    reflection: [
      "Mengapa simulasi terminal memberikan pemahaman yang lebih mendalam dibanding sekadar membaca teori?",
      "Evidence mana yang membuktikan kontainer baru dibuat dengan hak istimewa (privileged)?",
      "Apakah ada use case legal untuk mounting docker.sock di lingkungan monitoring?",
      "Bagaimana cara memvalidasi keputusanmu dengan melihat proses eBPF Falco?",
      "Mitigasi apa yang memastikan pembobolan kontainer tidak berakibat fatal pada host fisik?"
    ],
    lapsMapping: {
      understand: "Memahami model ancaman kontainer dan bahaya membagi socket kontrol host.",
      plan: "Menganalisis konfigurasi compose file dan rule deteksi runtime Falco.",
      execute: "Mengekstrak jalur eskalasi dari unprivileged container ke host root.",
      review: "Mengadopsi prinsip hardening kontainer (read-only rootfs, drop capabilities, no socket mount)."
    }
  }
];
