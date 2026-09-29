<div align="center">

<br/>

```
██╗██████╗ ███████╗    ██╗     ███████╗ █████╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗
██║██╔══██╗██╔════╝    ██║     ██╔════╝██╔══██╗██╔══██╗████╗  ██║██║████╗  ██║██╔════╝
██║██║  ██║███████╗    ██║     █████╗  ███████║██████╔╝██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
██║██║  ██║╚════██║    ██║     ██╔══╝  ██╔══██║██╔══██╗██║╚██╗██║██║██║╚██╗██║██║   ██║
██║██████╔╝███████║    ███████╗███████╗██║  ██║██║  ██║██║ ╚████║██║██║ ╚████║╚██████╔╝
╚═╝╚═════╝ ╚══════╝    ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝
                                                                  L A B
```

### **Interactive Cybersecurity Learning Platform**
*Built for the Next Generation of Indonesian SOC Analysts*

<br/>

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Variables_+_Grid-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Local--First-success?style=for-the-badge&logo=databricks&logoColor=white)]()
[![MITRE](https://img.shields.io/badge/MITRE_ATT%26CK-v19.2-red?style=for-the-badge)]()
[![NIST](https://img.shields.io/badge/NIST_SP_800--61-Rev.3-003087?style=for-the-badge)]()

<br/>

> **🔍 You're not just a student. You're a SOC Analyst on day one.**
>
> *IDS Learning Lab puts you inside a real incident — reading raw logs, triaging alerts, and hunting threats — before you even graduate.*

<br/>

</div>

---

## 🎯 What Is This?

**IDS Learning Lab** is a browser-based, zero-backend, production-grade cybersecurity learning platform built for **Vocational High School (SMK) students — Class XI, Teknik Jaringan Komputer dan Telekomunikasi (TJKT)**.

It's not a slideshow. It's not a quiz app. It's a **full simulation of the Security Operations Center (SOC) analyst workflow**, wrapped in a structured pedagogical framework that actually works.

The platform is the artifact of an **undergraduate thesis research** on improving students' **critical thinking skills** through problem-based cybersecurity simulation — aligned with:

- **MITRE ATT&CK Enterprise v19.2**
- **NIST SP 800-61 Rev. 3** (April 2025)
- **CISA Detection & Logging Guidance**
- **Logan Avenue Problem Solving (LAPS)–Heuristik** Pedagogical Framework

---

## 🧠 The LAPS–Heuristik Flow

The entire learning journey is structured around 4 investigative meetings + a real-case CTF:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  📋 PRE-TEST         → Establish your baseline. No pressure.        │
│       ↓                                                             │
│  🔍 01 UNDERSTAND    → "What is the problem?"                       │
│       Read raw Suricata EVE-JSON & Syslog. Identify the anomaly.    │
│       ↓                                                             │
│  📐 02 PLAN          → "Are there alternative solutions?"           │
│       NIDS vs HIDS. Signature vs Anomaly. Make the call.            │
│       ↓                                                             │
│  ⚙️  03 EXECUTE      → "How do we actually do this?"                │
│       Triage 7-context SOC alerts. True Positive or False Alarm?    │
│       ↓                                                             │
│  🔄 04 REVIEW        → "Was our solution correct?"                  │
│       Blue Team CTF · Forensic Investigation · Flag Submission      │
│       ↓                                                             │
│  📊 POST-TEST        → Measure your critical thinking growth.       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Each meeting maps directly to **Facione's Critical Thinking dimensions**: Interpretation, Analysis, Evaluation, Inference, Explanation, and Self-Regulation.

---

## ⚡ Features

### 🎓 Learning Engine
| Feature | Description |
|---|---|
| **Structured 4-Meeting Path** | LAPS–Heuristik pacing — no skipping ahead |
| **Interactive Log Viewer** | Real Suricata EVE-JSON + Syslog snippets |
| **Hypothesis Builder** | Students construct detection hypotheses before answering |
| **Misconception Alerts** | Targeted corrections when students get it wrong |
| **3-Tier Hint System** | Socratic scaffolding — hints cost nothing, but reveal progressively |
| **Triage Simulator** | 7-context SOC alert triaging — TP, FP, or Need More Evidence |

### 🚩 CTF System — 30 Challenges
| Category | Challenges | Flavor |
|---|---|---|
| 🌐 Network Forensics | 5 | Packet captures, port scans, C2 traffic |
| 🔐 Authentication | 5 | Brute-force, credential stuffing, lateral movement |
| 💻 Endpoint Detection | 5 | Process injection, persistence, privilege escalation |
| 🌍 Web Attack Analysis | 5 | SQLi, XSS, SSRF, IDOR in access logs |
| ☁️ Cloud & Container | 5 | AWS CloudTrail, Docker escape, Kubernetes anomalies |
| 🔴 Advanced Red Team | 5 | Living-off-the-land, APT simulation, chained attacks |

Flags follow the format: `IDS{...}` — investigate the evidence, earn the flag.

### 📊 Analytics & Research Mode
- **Passive time tracking** — no countdown timers, no artificial stress
- **Full event telemetry** — every interaction is logged
- **Progress tracking** — per-meeting completion, CTF score, critical thinking index
- **Export** — JSON (full state) + CSV (activity log) for research analysis
- **Admin Panel** — aggregate anonymized student data across sessions

### 🏆 Gamification
- **Leaderboard** — ranked by critical thinking score, not just raw points
- **Badges & achievements** — for Hypothesis Builder, Speed Reader, Flag Hunter
- **Bookmarks** — save materials, questions, or CTF challenges for review
- **Profile** — SOC analyst identity, rank progression

---

## 🏗️ Architecture

```
ids-learning-lab/
│
├── 📁 src/
│   ├── 📁 app/               # Core runtime (Router, State store, Storage, App shell)
│   ├── 📁 components/        # Reusable UI (Header, Sidebar, BottomNav, Cards, Modal, Toast)
│   ├── 📁 pages/             # Page-level components (18 pages)
│   │   ├── LandingPage.js
│   │   ├── DashboardPage.js
│   │   ├── MeetingPage.js
│   │   ├── CtfInvestigationPage.js
│   │   ├── CtfLibraryPage.js
│   │   ├── LeaderboardPage.js
│   │   ├── ProgressPage.js
│   │   ├── ProfilePage.js
│   │   ├── ReviewPage.js
│   │   ├── SettingsPage.js
│   │   └── ... (+ admin pages)
│   ├── 📁 modules/           # Isolated business logic
│   │   ├── 📁 quiz/          # Question engine, scoring, timer
│   │   ├── 📁 triage/        # Alert triage engine
│   │   ├── 📁 ctf/           # CTF engine, flag validator, progress
│   │   ├── 📁 assessment/    # Pre/Post test engine
│   │   ├── 📁 analytics/     # Progress tracker, event logger
│   │   ├── 📁 gamification/  # Leaderboard, badges, scoring
│   │   ├── 📁 hypothesis/    # Hypothesis builder module
│   │   └── 📁 reflection/    # Self-regulation reflection module
│   ├── 📁 data/              # All content (questions, CTF, materials, scenarios)
│   │   ├── 📁 ctf/
│   │   │   └── 📁 challenges/
│   │   │       ├── networkChallenges.js    # 5 challenges
│   │   │       ├── authChallenges.js       # 5 challenges
│   │   │       ├── endpointChallenges.js   # 5 challenges
│   │   │       ├── webChallenges.js        # 5 challenges
│   │   │       ├── cloudChallenges.js      # 5 challenges
│   │   │       └── advancedChallenges.js   # 5 challenges
│   │   ├── questions.js      # 50+ question bank
│   │   ├── pretest.js        # 10-item diagnostic
│   │   ├── posttest.js       # 12-item critical thinking assessment
│   │   ├── triageCases.js    # SOC triage scenarios
│   │   └── materials.js      # Meeting content & explanations
│   ├── 📁 styles/            # Modular CSS design system
│   │   ├── variables.css     # Design tokens (colors, spacing, typography)
│   │   └── 📁 components/   # Per-component stylesheets
│   └── 📁 utils/             # DOM helpers, formatters, validators, downloader
│
├── 📁 tests/                 # Automated unit tests (Node.js native test runner)
├── 📁 docs/                  # Technical & research documentation
├── index.html                # Entry point
├── package.json
└── vite.config.js
```

**Design principles:**
- 🚫 Zero external UI framework dependency
- 🚫 Zero backend requirement
- ✅ 100% local-first (LocalStorage persistence)
- ✅ Modular layered architecture (`pages → components → modules → app → data → utils`)
- ✅ CSS custom properties design token system

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+**
- npm **v9+**

### Installation

```bash
# Clone the repository
git clone https://github.com/prasbara/INTERACTIVE-CYBERSECURITY-LEARNING.git

# Navigate into the project
cd INTERACTIVE-CYBERSECURITY-LEARNING

# Install dependencies
npm install
```

### Run Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:3000` — and start your first shift as a SOC analyst.

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
```

Output lands in `dist/` — ready for static hosting (Netlify, Vercel, GitHub Pages, or any web server).

---

## 🧪 Testing

The project uses **Node.js native test runner** (`node:test` + `node:assert`) — no Jest, no Mocha, zero dependencies.

```bash
npm test
```

Test coverage spans:
- State management & storage
- Quiz engine scoring logic
- CTF flag validation
- Progress tracker calculations
- Data schema integrity

---

## 📖 Documentation

| Document | Description |
|---|---|
| [`docs/architecture.md`](docs/architecture.md) | Software architecture, layer responsibilities |
| [`docs/pedagogical-mapping.md`](docs/pedagogical-mapping.md) | LAPS–Heuristik → Critical Thinking mapping |
| [`docs/content-map.md`](docs/content-map.md) | Curriculum structure & question bank overview |
| [`docs/ctf-authoring-guide.md`](docs/ctf-authoring-guide.md) | Guide for authoring new CTF challenges |
| [`docs/research-data.md`](docs/research-data.md) | Research telemetry, export format, analysis |
| [`docs/deployment.md`](docs/deployment.md) | Deployment guide for production hosting |

---

## 🔒 Ethical Use Notice

All cybersecurity scenarios, logs, and CTF challenges in this platform are **100% synthetic**.

- ✅ Use this platform to **learn** how to detect, analyze, and respond to threats
- ✅ Practice on the **simulated** environments provided
- ❌ Do **NOT** use knowledge gained here to attack real systems, networks, or services
- ❌ Do **NOT** target schools, government, or any live infrastructure

> *With great detection power comes great responsibility.*

---

## 🤝 Contributing

This project is primarily an academic research artifact. However, contributions are welcome — especially:

- New CTF challenge sets (`src/data/ctf/challenges/`)
- Improved learning materials (`src/data/materials.js`)
- Bug fixes and accessibility improvements
- Translations (Bahasa Indonesia ↔ English)

**Fork it → Branch it → PR it.**

---

## 📜 License

This project is released under the [MIT License](LICENSE).

Developed as undergraduate thesis research — **S1 Pendidikan Ilmu Komputer**, Computer Science Education.

---

<div align="center">

<br/>

**Built with curiosity. Tested with rigor. Shipped with care.**

*"The best way to learn cybersecurity is to defend something that matters."*

<br/>

**⭐ Star this repo if it helped you understand IDS better.**

</div>
