# CTF Architecture & Engine Specification

**IDS Learning Lab — LAPS-Heuristik Blue Team Sandbox**  
*Document Version:* 2.0.0  
*Architecture:* Case File → Mission → Evidence → Timeline → Investigation → Flag → Mitigation → Reflection

---

## 1. Overview & Pedagogical Objective

The Capture The Flag (CTF) subsystem in IDS Learning Lab is an authentic educational incident investigation environment designed for high-school vocational (SMK) and undergraduate cybersecurity students. Rather than relying on gamified guesswork or binary exploitation, the platform simulates realistic **Security Operations Center (SOC) Tier-1 & Tier-2 analyst workflows**.

Challenges are explicitly mapped to the **LAPS-Heuristik** pedagogical model with special emphasis on **Meeting 4: Meninjau Kembali (Review & Metacognitive Evaluation)**:
> *"Apakah solusi ini tepat? Bagaimana kita bisa mengeceknya secara independen melalui korelasi bukti log?"*

---

## 2. Investigation Flow

Every CTF challenge follows a non-linear, evidence-grounded investigation pipeline:

```text
       CASE FILE (Incident Code, Target Host, Sensor Source)
                           ↓
             MISSION OBJECTIVES & CRITERIA
                           ↓
          EVIDENCE PACK (Syslog, NIDS, PCAP, JSON)
                           ↓
          INTERACTIVE TIMELINE & CHRONOLOGY
                           ↓
        INVESTIGATION QUESTIONS (Attack Triage & IOC)
                           ↓
              PREREQUISITE VERIFICATION
                           ↓
             SECURITY FLAG SUBMISSION
                           ↓
              DETERMINISTIC VALIDATION
                           ↓
             CHALLENGE RESULT PANEL
                           ↓
        INCIDENT DEBRIEF & MITRE ATT&CK MAPPING
                           ↓
       LAPS METACOGNITIVE REFLECTION (5 Questions)
```

Learners cannot simply bypass evidence and submit guessed flags; answering guided investigation questions and understanding the timeline is an enforced learning prerequisite.

---

## 3. Data Schema & Model Specification

Challenges are defined uniformly across threat categories (`authChallenges`, `webChallenges`, `networkChallenges`, `endpointChallenges`, `cloudChallenges`, and `advancedChallenges`) with the following backward-compatible schema:

```javascript
{
  id: "RC-CTF-001",                   // Primary unique code
  aliasId: "ctf-001",                 // Normalized alias
  title: "SSH Santai Tapi Brute Force",
  category: "authentication",         // Threat category
  difficulty: "beginner",             // beginner | intermediate | advanced | expert
  estimatedMinutes: 15,
  xpReward: 50,
  sourceId: "cisa-aa21-131a",        // Public CVE / CISA Advisory reference
  affectedTechnology: "OpenSSH 8.2p1 on Ubuntu Linux",
  mitreTechniques: ["T1110.001", "T1078"],
  lapsStage: "review",
  attackCategory: "authentication",
  realWorldCase: "SOC mendeteksi percobaan autentikasi beruntun...",

  // Deterministic Flag Configuration
  flag: "FLAG{SSH_SANTAI_TAPI_BRUTE_FORCE}",
  flagConfig: {
    value: "FLAG{SSH_SANTAI_TAPI_BRUTE_FORCE}",
    caseSensitive: false,
    maxAttempts: 5
  },

  // Mission Objectives
  mission: {
    objective: "Identifikasi IP penyerang dan buktikan pembobolan akun.",
    successCriteria: [
      "Identifikasi alamat IP penyerang",
      "Temukan akun korban yang disusupi",
      "Submit flag dan rancang mitigasi Fail2ban"
    ]
  },

  // Evidence Pack
  evidence: [
    {
      id: "ev-001-a",
      fileName: "auth.log",
      fileType: "syslog",
      description: "Catatan daemon autentikasi SSH server target",
      content: "..."
    }
  ],

  // Chronological Timeline
  timeline: [
    { time: "09:12:01 WIB", sensor: "auth.log", event: "Failed password for root" }
  ],

  // Guided Pedagogical Questions
  questions: [
    {
      id: "q1",
      question: "Berapa alamat IP penyerang?",
      type: "single_choice",
      options: [
        { id: "a", text: "192.168.10.15" },
        { id: "b", text: "198.51.100.45" }
      ],
      correctAnswer: "b",
      explanation: "IP publik 198.51.100.45 memicu lonjakan koneksi TCP ke port 22."
    }
  ],

  // Tiered Progressive Hints (Never leaks expected flag)
  hints: [
    { tier: 1, text: "Fokuskan perhatian pada pola login..." },
    { tier: 2, text: "Periksa source IP pada auth.log..." },
    { tier: 3, text: "Korelasi antara alert IDS dan accepted session..." }
  ],

  // Mitigation Guidance
  mitigationSummary: "Aktifkan fail2ban dan wajibkan SSH Ed25519 Public Key.",
  mitigation: [
    "Terapkan Fail2ban dengan bantime 24 jam",
    "Nonaktifkan login berbasis password"
  ],

  // Metacognitive LAPS Reflection
  reflection: [
    "Mengapa kamu yakin aktivitas tersebut merupakan serangan?",
    "Evidence mana yang paling kuat?",
    "Apakah ada kemungkinan false positive?",
    "Bagaimana cara memvalidasi keputusanmu?",
    "Mitigasi apa yang sebaiknya diterapkan?"
  ]
}
```

---

## 4. Module Decomposition

| Module | Location | Responsibility |
|---|---|---|
| **Flag Validator** | `src/modules/ctf/flagValidator.js` | Whitespace trimming, case-sensitivity evaluation, attempt limiting, and safe feedback generation. |
| **CTF Engine** | `src/modules/ctf/ctfEngine.js` | Challenge lifecycle, adapter dispatching, state mutation, and non-farmable XP awarding. |
| **Hint System** | `src/modules/ctf/hintSystem.js` | Progressive hint tier unlocking, XP penalty deduction, and hint usage statistics. |
| **Bank Aggregator** | `src/data/ctf/realCases.js` | Master aggregator, lookup by ID/alias, category and difficulty filtering. |
| **Investigation Page** | `src/pages/CtfInvestigationPage.js` | Interactive analyst workspace, simulated terminal, question validation, and result debrief. |
| **Library Catalog** | `src/pages/CtfLibraryPage.js` | 30-case browsable catalog with search, category filters, and difficulty badges. |
| **Admin CTF Page** | `src/pages/admin/AdminCtfPage.js` | Instructor/admin dashboard inspecting all cases and advisory references safely. |

---

## 5. Scoring & Gamification Model

- **Base XP Allocation**:
  - Beginner / Easy: `+50 XP`
  - Intermediate / Medium: `+100 XP`
  - Advanced / Hard: `+175 XP`
  - Expert: `+250 XP`
  - LAPS Capstone (`#29`): `+200 XP`
  - Grand Final (`#30`): `+250 XP`
- **Hint Penalties**:
  - Tier 1: Free (conceptual direction)
  - Tier 2–3: `-15 XP` per unlocked tier (recorded in result metadata)
- **First Attempt Bonus**:
  - `+10% XP` awarded when solved on attempt 1.
- **Eagle Eye Badge**:
  - Awarded exclusively when a challenge is completed without unlocking any hints.
- **Anti-Farm Guarantee**:
  - The system checks `completedChallenges.includes(targetId)` before awarding XP or badges. Re-submitting or refreshing will never duplicate XP.
