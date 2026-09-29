# CTF Challenge Authoring Guide

**IDS Learning Lab — Panduan Penulisan Kasus Tantangan CTF Baru**  
*Target Audience:* Instruktur Cybersecurity, Curriculum Designers, Content Engineers

---

## 1. Authoring Principles & Standards

When authoring a new challenge for IDS Learning Lab, adhere to these pedagogical and technical standards:

1. **Authentic Incident Evidence**: Evidence must look like genuine system telemetry (syslog, NIDS fast alerts, Zeek JSON, Windows Event Logs, CloudTrail). Avoid artificial puzzle riddles.
2. **Pedagogical LAPS Flow**: Every challenge must follow the 4 LAPS phases:
   - **Understand (Memahami Masalah)**: Incident summary, target asset, attacker behavior.
   - **Plan (Merencanakan Pemecahan)**: Selecting relevant logs, eliminating noise.
   - **Execute (Melaksanakan Rencana)**: Correlating evidence, answering guided questions, and discovering the flag.
   - **Review (Meninjau Kembali)**: Metacognitive reflection, root cause analysis, and mitigation strategy.
3. **Never Leak Flags in Hints**: Hints must provide pedagogical direction, not the literal flag answer.
4. **Deterministic Validation**: Flags must follow the format `FLAG{DESCRIPTIVE_UPPERCASE_NAME}`.

---

## 2. Step-by-Step Authoring Workflow

### Step 1: Select Challenge File & Assign ID
Choose the appropriate category file in `src/data/ctf/challenges/`:
- `authChallenges.js` (`RC-CTF-001` - `005`)
- `webChallenges.js` (`RC-CTF-006` - `011`)
- `networkChallenges.js` (`RC-CTF-012` - `017`)
- `endpointChallenges.js` (`RC-CTF-018` - `022`)
- `cloudChallenges.js` (`RC-CTF-023` - `026`)
- `advancedChallenges.js` (`RC-CTF-027` - `030`)

### Step 2: Define the Case Metadata
```javascript
{
  id: "RC-CTF-031",
  aliasId: "ctf-031",
  title: "Descriptive Action-Oriented Title",
  category: "network",               // authentication | web | network | endpoint | cloud | forensics | malware
  difficulty: "intermediate",        // beginner | intermediate | advanced | expert
  estimatedMinutes: 20,
  xpReward: 100,                     // 50 (beginner), 100 (intermediate), 175 (advanced), 250 (expert)
  sourceId: "cve-xxxx-yyyy",         // Must map to CTF_SOURCES in src/data/ctf/sources.js
  affectedTechnology: "Linux Nginx / Suricata",
  mitreTechniques: ["T1190", "T1071"],
  lapsStage: "review",
  attackCategory: "network",
  realWorldCase: "Ringkasan skenario insiden dunia nyata..."
}
```

### Step 3: Configure Deterministic Security Flag
```javascript
flag: "FLAG{NAMA_FLAG_JELAS_DAN_TERSTANDAR}",
flagConfig: {
  value: "FLAG{NAMA_FLAG_JELAS_DAN_TERSTANDAR}",
  caseSensitive: false,              // Default false for user friendliness
  maxAttempts: 5                     // Default 5 attempts before lockout
}
```

### Step 4: Write Evidence Pack & Interactive Timeline
Provide realistic log snippets with consistent timestamps and IP addresses:
```javascript
evidencePack: [
  {
    id: "ev-031-a",
    fileName: "suricata_fast.log",
    fileType: "nids_alert",
    description: "Catatan signature peringatan Suricata NIDS",
    content: `09/29-10:00:01.120 [**] [1:2001111:1] ET SCAN Potential Exploit [**] {TCP} 198.51.100.22:4120 -> 10.0.0.5:80`
  }
],
timeline: [
  { time: "10:00:01 WIB", sensor: "suricata_fast.log", event: "Initial scan connection received from 198.51.100.22" }
]
```

### Step 5: Craft Guided Investigation Questions
Questions ensure that students must analyze evidence before validating the flag:
```javascript
questions: [
  {
    id: "q1",
    question: "Alamat IP penyerang manakah yang memicu peringatan Suricata?",
    type: "single_choice",
    options: [
      { id: "a", text: "198.51.100.22" },
      { id: "b", text: "10.0.0.5" }
    ],
    correctAnswer: "a",
    explanation: "198.51.100.22 adalah IP publik sumber yang mengirimkan probe eksploitasi."
  }
]
```

### Step 6: Create Tiered Hints (Anti-Leak Rule)
```javascript
hints: [
  { tier: 1, text: "Fokuskan perhatian pada kolom IP sumber pada suricata_fast.log." },
  { tier: 2, text: "Periksa timestamp paket pertama dan korelasi port tujuan." },
  { tier: 3, text: "Alamat IP sumber eksternal mengindikasikan host pelaku yang memicu peringatan." }
  // JANGAN: "Flag: FLAG{...}" (DILARANG!)
]
```

### Step 7: Define Mitigation & Reflection Questions
```javascript
mitigationSummary: "Blokir IP penyerang pada border firewall dan update patch perangkat lunak.",
mitigation: [
  "Blokir IP 198.51.100.22 pada edge firewall",
  "Terapkan security patch terbaru"
],
reflection: [
  "Mengapa kamu yakin aktivitas tersebut merupakan serangan?",
  "Evidence mana yang paling kuat?",
  "Apakah ada kemungkinan false positive?",
  "Bagaimana cara memvalidasi keputusanmu?",
  "Mitigasi apa yang sebaiknya diterapkan?"
]
```

---

## 3. Authoring Checklist & Verification

Before submitting new challenges:
- [ ] Unique ID format matches `RC-CTF-XXX` and `aliasId` matches `ctf-XXX`.
- [ ] Source ID is registered in `src/data/ctf/sources.js`.
- [ ] Category is registered in `src/data/ctf/categories.js`.
- [ ] Flag conforms to `/^FLAG\{[A-Z0-9_]+\}$/`.
- [ ] No hint leaks the flag string.
- [ ] At least 1 evidence file and 1 guided question provided.
- [ ] All 5 reflection questions configured.
- [ ] Run `npm.cmd test` to ensure all tests pass.
- [ ] Run `npm.cmd run build` to ensure clean bundle.
