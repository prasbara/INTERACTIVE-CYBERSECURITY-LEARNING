# PRE-REDESIGN FEATURE INVENTORY & ARCHITECTURAL BASELINE
## IDS Learning Lab — LAPS–Heuristik Platform

**Date:** 2026-09-29  
**Version:** 1.0.0 (Production Architecture Audit)  
**System Type:** Interactive Cybersecurity Learning Workstation (Local-First Client Sandbox)  

---

### Classification Taxonomy
- **WORKING**: Feature fully implements business logic, persists state, and functions without regressions.
- **PARTIALLY WORKING**: Feature functions in core paths but requires UX refinement, error boundary, or modal activation.
- **MOCKUP**: Feature presents a visual UI control (e.g. alert dialog, hardcoded sample data) that must be activated into a functional component.
- **PLACEHOLDER**: Interface element with non-functional markup or stub logic.
- **BROKEN**: Feature fails to execute or crashes.
- **UNUSED**: Code exists but is never imported or routed.
- **UNIMPLEMENTED**: Planned feature with missing logic.

---

## Complete Route & Feature Inventory

| Route | Feature | Current Behavior | Dependencies | Data Source | Current Status | Expected Production Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Landing Page & Hero Gateway | Displays headline, live log terminal simulator, LAPS pillars, curriculum roadmap, security guarantee. | `dom.js`, `router.js`, `store.js`, `icons.js` | Static config + student store identity | **PARTIALLY WORKING** | Professional product landing page with clear educational copywriting, interactive platform preview tabs, problem analysis, and direct onboarding CTA. |
| `/identity` | Student Identity Registration | Collects student name, class (XI TJKT), NISN/ID, and initializes learning session. | `state.js`, `storage.js` | LocalStorage (`ids_learning_lab_state`) | **WORKING** | Validates non-empty input, creates student profile object, preserves session. |
| `/onboarding` | 4-Stage LAPS Orientation | Step-by-step introduction to the LAPS heuristic problem solving method. | `dom.js`, `router.js` | Pedagogical materials | **WORKING** | Explains heuristic cognitive anchors and navigation controls. |
| `/dashboard` | Student Command Center | Displays greeting, next action CTA, progress hero, meeting cards, gamification summary. | `state.js`, `meetings.js`, `xpSystem.js` | Store state & progress | **WORKING** | Clear visual hierarchy, zero cognitive overload, dynamic status derivation. |
| `/learning-path`| Curriculum Syllabus | Shows 4 sequential meetings, LAPS stages, heuristic questions, and completion bars. | `meetings.js`, `router.js` | `MEETINGS` array + state | **WORKING** | Clean editorial layout, non-breaking navigation to meetings. |
| `/meeting/1` | Meeting 1: Memahami Masalah | Sensor IDS placement, NIDS vs HIDS, SPAN vs TAP analysis, evidence selection. | `quizEngine.js`, `questions.js`, `dom.js` | `QUESTIONS_BY_MEETING[1]` | **WORKING** | Cognitive anchor prompt, objective checks, misconception feedback. |
| `/meeting/2` | Meeting 2: Merencanakan Solusi| Rule IDS Snort/Suricata syntax analysis, signature vs anomaly evaluation. | `quizEngine.js`, `questions.js` | `QUESTIONS_BY_MEETING[2]` | **WORKING** | Rule header/options breakdown, structured evaluation. |
| `/meeting/3` | Meeting 3: Melaksanakan Rencana| SOC Alert Triage Console (True Positive, False Positive, Need More Evidence). | `triageScoring.js`, `questions.js` | `QUESTIONS_BY_MEETING[3]` | **WORKING** | Semantic classification, evidence verification, triage telemetry logging. |
| `/meeting/4` | Meeting 4: Meninjau Kembali | Blue-Team CTF investigation, terminal simulation, flag verification, reflection. | `flagValidator.js`, `realCases.js` | `QUESTIONS_BY_MEETING[4]` + CTF | **WORKING** | Multi-timestamp correlation, flag check, mitigation report. |
| `/ctf` | Real-Case CTF Challenge Bank | Grid of 30 open-source inspired cybersecurity investigation challenges. | `realCases.js`, `router.js` | 30 challenge schemas | **WORKING** | Multi-parameter search, category filter, difficulty distribution. |
| `/ctf/:id` | CTF Investigation Workspace | Full incident case file, evidence log drawer, simulated terminal, flag submission. | `flagValidator.js`, `dom.js` | Target challenge schema | **WORKING** | Safe client-side terminal, hint unlocking, reflection feedback. |
| `/pre-test` | Diagnostic Pre-Test | 10 multiple-choice baseline questions measuring initial critical thinking. | `pretest.js`, `quizScoring.js` | `PRETEST_QUESTIONS` | **WORKING** | Stores baseline score in `scores.pretest`, prevents resubmission abuse. |
| `/post-test` | Post-Intervention Evaluation | 10 evaluation questions assessing critical thinking gains after 4 meetings. | `posttest.js`, `quizScoring.js` | `POSTTEST_QUESTIONS` | **WORKING** | Computes normalized gain, stores `scores.posttest`, links to review. |
| `/progress` | Comprehensive Progress Audit | Breakdown of meeting completion, time on task, activity checklist, and scores. | `progress.js`, `state.js` | Store `progress` object | **WORKING** | Exact arithmetic derivation without hardcoded percentages. |
| `/leaderboard` | Class Cohort Benchmark | Ranked list of students with filter tabs (All, Class 1, Class 2, Weekly). | `xpSystem.js`, `state.js` | Store XP + cohort benchmark | **PARTIALLY WORKING** | Clearly indicate Offline Cohort Simulation benchmark mode to prevent fake cloud claim. |
| `/profile` | Student Credentials & Badges | Displays student NISN, XP, badges earned, and completed meeting log. | `xpSystem.js`, `state.js` | Store `student`, `badges` | **WORKING** | Gamification positioned as secondary motivation. |
| `/review` | Review & Metacognitive Log | Summarizes past quiz answers, wrong options, and pedagogical explanations. | `questions.js`, `state.js` | Store `answers` history | **WORKING** | Shows explanation and misconceptions for reviewed questions. |
| `/bookmarks` | Evidence Bookmarks Shelf | Displays logs and evidence lines bookmarked by the student during sessions. | `state.js` | Store `bookmarks` array | **WORKING** | Displays timestamp, alert type, and target IP notes. |
| `/settings` | Preferences & Data Management | Theme selection, JSON export, CSV export, safe reset with confirmation. | `storage.js`, `download.js` | LocalStorage + store | **WORKING** | Functional data import/export, removes childish emojis. |
| `/research` | Academic Research Instrument | Theoretical framework, LAPS-Heuristik mapping, rubric, and telemetry schema. | `dom.js`, `router.js` | Research metadata | **WORKING** | Displays thesis methodology without altering research instruments. |
| `/admin/login` | Administrator Portal Auth | Password entry, session token generation, auto-expiration, audit log. | `adminAuth.js` | Secure session store | **WORKING** | Rejects incorrect credentials, guards admin routes. |
| `/admin` | Admin Overview & Analytics | Aggregate cohort completion rate, avg pre/post scores, questions count. | `adminService.js`, `adminAuth.js`| Real store + cohort aggregation| **WORKING** | Displays metrics derived from active student + cohort benchmark. |
| `/admin/students`| Student Cohort Management | Roster table with progress, scores, search filter, CSV/JSON export, student detail. | `adminService.js` | Cohort dataset | **PARTIALLY WORKING (MOCKUP)** | Replace `alert()` detail with dedicated comprehensive Student Detail modal. |
| `/admin/questions`| Item Bank Management | Table of all curriculum questions with filter by meeting and points. | `questions.js` | Question bank | **PARTIALLY WORKING (MOCKUP)** | Replace `alert()` preview with comprehensive Question Editor & Preview modal. |
| `/admin/ctf` | CTF Challenge Management | Roster of 30 real-case challenges with advisory links and difficulty tiers. | `realCases.js` | Challenge bank | **PARTIALLY WORKING** | Add search input, category filter, and modal case file preview. |
| `/admin/analytics`| Cohort Performance Analytics | Visualized Pre/Post gains and LAPS stage completion metrics. | `adminService.js` | Store + cohort data | **PARTIALLY WORKING (MOCKUP)** | Replace static percentages with real calculated cohort progression values. |
| `/admin/research`| Research Data Separation | Segregates raw telemetry events from derived metrics and gamification numbers. | `adminService.js` | Event logger + store | **WORKING** | One-click CSV and JSON dataset export for SPSS/Excel analysis. |
| `/admin/audit-logs`| Security Audit Event Log | Chronological trail of administrative actions (login, export, inspection). | `adminAuth.js` | In-memory + storage audit log | **WORKING** | Records timestamps, admin actor, and action result safely. |

---

## Baseline Verification
- **Automated Tests**: 34 unit tests pass (`npm test`).
- **Syntax Check**: 114 source files verified with 0 AST syntax errors (`npm run lint`).
- **Production Bundle**: Vite compiles successfully in <600ms (`npm run build`).
- **Zero Breaking Changes**: All data contracts (`STORAGE_KEY`, `ROUTES`, `QUESTIONS_BY_MEETING`, `REAL_CASE_CHALLENGES`) remain fully preserved.
