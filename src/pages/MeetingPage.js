/**
 * Meeting Page (Dynamic for Meeting 1, 2, 3, 4)
 * Comprehensive Interactive Learning Environment:
 * - Observe -> Investigate -> Think -> Decide -> Validate -> Reflect
 * - SOC Incident Briefing openings
 * - Interactive LogViewer with line selection
 * - Evidence Board & Pattern Synthesis
 * - Hypothesis Engine
 * - Interactive Strategy Simulator & Data Visualizations
 * - SOC Alert Queue with Progressive Evidence Reveal
 * - Blue Team CTF Challenge with Simulated Terminal & Interactive Timeline
 * - Guided Qualitative Reflections
 */

import { createElement, escapeHtml } from '../utils/dom.js';
import { meetingsData } from '../data/meetings.js';
import { materialsData } from '../data/materials.js';
import { meeting1Questions, meeting2Questions } from '../data/questions.js';
import { scenariosData } from '../data/scenarios.js';
import { triageCasesData } from '../data/triageCases.js';
import { ctfChallengeData } from '../data/ctfChallenge.js';
import { hintsData } from '../data/hints.js';

import { createLessonHeader } from '../components/LessonHeader.js';
import { createMeetingBriefing } from '../components/MeetingBriefing.js';
import { createLogViewer } from '../components/LogViewer.js';
import { createEvidenceBoard } from '../components/EvidenceBoard.js';
import { createSimulatedTerminal } from '../components/SimulatedTerminal.js';
import { createInteractiveTimeline } from '../components/InteractiveTimeline.js';
import { createTrafficChart } from '../components/DataVisualization.js';
import { createConceptQuickCheck } from '../components/ConceptQuickCheck.js';
import { createQuizCard } from '../components/QuizCard.js';
import { createScenarioCard } from '../components/ScenarioCard.js';
import { createTriageCard } from '../components/TriageCard.js';
import { createHintPanel } from '../components/HintPanel.js';
import { createReflectionForm } from '../components/ReflectionForm.js';
import { showToast } from '../components/Toast.js';

import { QuizEngine } from '../modules/quiz/quizEngine.js';
import { TriageEngine } from '../modules/triage/triageEngine.js';
import { CtfEngine } from '../modules/ctf/ctfEngine.js';
import { submitHypothesis, getHypothesis, HYPOTHESIS_OPTIONS_M1, EVIDENCE_CHECKLIST_M1 } from '../modules/hypothesis/hypothesisEngine.js';
import { logEvent } from '../modules/analytics/eventLogger.js';
import { checkMeetingCompletion } from '../modules/analytics/progressTracker.js';
import { addXP } from '../modules/gamification/xpSystem.js';
import { store } from '../app/state.js';

export function createMeetingPage({ params }) {
  const container = createElement('div', { className: 'meeting-page page-container' });
  const meetingId = parseInt(params.id, 10);
  const meeting = meetingsData.find(m => m.id === meetingId);

  if (!meeting) {
    container.innerHTML = `
      <div class="alert alert-danger card">
        <h3>Pertemuan Tidak Ditemukan</h3>
        <p>Pertemuan dengan nomor ID ${escapeHtml(params?.id || '')} tidak terdaftar.</p>
        <button class="btn btn-primary" onclick="history.back()">Kembali</button>
      </div>
    `;
    return container;
  }

  logEvent('meeting_opened', { meetingId });

  // 1. SOC Incident Briefing
  const briefingData = {
    1: {
      host: 'SRV-APP-01 (Server Web & Database Sekolah)',
      status: 'SUSPICIOUS',
      incidentCode: 'INC-2026-081',
      title: 'Security Incident Briefing: Percobaan Akses Berulang',
      description: 'Sensor IDS mencatat lonjakan koneksi mencurigakan pada port otentikasi terminal. Beberapa percobaan login terus gagal.',
      task: 'Telaah rekaman log mentah secara seksama, tandai bukti anomali, rumuskan hipotesis, dan bedakan fakta log dari spekulasi.'
    },
    2: {
      host: 'GATEWAY-FIREWALL-01',
      status: 'PLANNING',
      incidentCode: 'ARCH-2026-014',
      title: 'SOC Planning Briefing: Penentuan Strategi Deteksi IDS',
      description: 'Tim keamanan harus memilih arsitektur sensor IDS (NIDS vs HIDS) dan metode pendeteksian (Signature vs Anomaly).',
      task: 'Analisis trade-off performa, false positive rate, dan karakteristik ancaman sebelum menempatkan sensor pendeteksi.'
    },
    3: {
      host: 'SOC-TRIAGE-CONSOLE',
      status: 'ACTIVE ALERTS',
      incidentCode: 'TRG-2026-092',
      title: 'Alert Triage Briefing: Klasifikasi Antrian Peringatan',
      description: 'Tiga alert prioritas masuk ke antrian SOC. Beberapa alert mungkin merupakan aktivitas sah yang memicu false positive.',
      task: 'Terapkan 7 Konteks Infrastruktur untuk memutuskan apakah alert adalah True Positive, False Positive, atau Butuh Bukti Tambahan.'
    },
    4: {
      host: 'LAB-PC-17 & SRV-AUTH-02',
      status: 'COMPROMISE SUSPECTED',
      incidentCode: 'CTF-2026-404',
      title: 'Blue Team Incident Response: Rekonstruksi Serangan',
      description: 'Terjadi anomali multi-sensor yang melibatkan jaringan lab dan server otentikasi. Diperlukan penyelidikan forensik linimasa.',
      task: 'Korelasikan log lintas sistem, jalankan perintah terminal sandbox, pecahkan security flag CTF, dan susun refleksi pencegahan.'
    }
  };

  const currentBrief = briefingData[meetingId] || briefingData[1];
  const briefing = createMeetingBriefing({
    host: currentBrief.host,
    status: currentBrief.status,
    incidentCode: currentBrief.incidentCode,
    title: currentBrief.title,
    description: currentBrief.description,
    taskInstruction: currentBrief.task,
    onStart: () => {
      addXP(10, `Memulai Investigasi Pertemuan ${meetingId}`);
    }
  });
  container.appendChild(briefing);

  // 2. Lesson Header
  const header = createLessonHeader({
    meeting,
    heuristicQuestion: meeting.heuristicQuestion,
    stage: meeting.lapsStage,
    objectives: meeting.objectives
  });
  container.appendChild(header);

  // 3. Interactive Materials with Tabs
  renderInteractiveMaterial(container, meetingId);

  // 4. Meeting Specific Interactive Activities
  const activitySection = createElement('div', { className: 'meeting-activity-section' });
  container.appendChild(activitySection);

  if (meetingId === 1) {
    renderMeeting1Flow(activitySection, meetingId);
  } else if (meetingId === 2) {
    renderMeeting2Flow(activitySection, meetingId);
  } else if (meetingId === 3) {
    renderMeeting3Flow(activitySection, meetingId);
  } else if (meetingId === 4) {
    renderMeeting4Flow(activitySection, meetingId);
  }

  // 5. Scaffolding Hint Panel
  const hints = hintsData[meetingId] || [];
  if (hints.length > 0) {
    const hintPanel = createHintPanel({
      hints,
      unlockedIndices: [],
      onUnlockHint: (idx) => {
        logEvent('hint_opened', { meetingId, hintTier: idx + 1 });
      }
    });
    container.appendChild(hintPanel);
  }

  return container;
}

/**
 * Interactive Materials with [ CONCEPT ] [ EXAMPLE ] [ EVIDENCE ] [ TRY IT ]
 */
function renderInteractiveMaterial(parent, meetingId) {
  const material = materialsData.find(m => m.meetingId === meetingId);
  if (!material) return;

  const matCard = createElement('div', { className: 'interactive-material-card card' });

  const tabsHeader = createElement('div', { className: 'material-tabs-nav' });
  const tabs = [
    { id: 'concept', label: 'Konsep Dasar' },
    { id: 'example', label: 'Contoh Riil' },
    { id: 'diagram', label: 'Alur Keputusan' },
    { id: 'quickcheck', label: 'Uji Cepat' }
  ];

  const contentArea = createElement('div', { className: 'material-tab-body' });

  function showTab(tabId) {
    tabsHeader.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('tab-active', btn.dataset.tab === tabId);
    });
    contentArea.innerHTML = '';

    if (tabId === 'concept') {
      contentArea.innerHTML = `
        <h3>${material.title}</h3>
        ${material.sections.map(s => `
          <div class="material-sub-block">
            <h4>${s.heading}</h4>
            <p>${s.content}</p>
          </div>
        `).join('')}
      `;
    } else if (tabId === 'example') {
      contentArea.innerHTML = `
        <h3>Contoh Analisis Telemetri IDS</h3>
        <p>Perhatikan struktur rule Suricata berikut yang digunakan mendeteksi upaya penetrasi:</p>
        <pre class="code-block"><code>alert tcp any any -> $HOME_NET 22 (msg:"ET SCAN Potential SSH Brute Force"; flags:S; threshold:type both, track by_src, count 5, seconds 30; classtype:attempted-admin; sid:2001219; rev:2;)</code></pre>
        <p class="text-muted">Parameter <code>threshold: count 5, seconds 30</code> mendeteksi jika terjadi lebih dari 5 koneksi SYN dalam 30 detik dari sumber yang sama.</p>
      `;
    } else if (tabId === 'diagram') {
      contentArea.innerHTML = `
        <h3>Diagram Alur Pengambilan Keputusan IDS</h3>
        <div class="decision-diagram-box">
          <div class="diagram-step">Paket Jaringan Tiba</div>
          <div class="diagram-arrow">↓</div>
          <div class="diagram-branch">
            <div class="branch-card">
              <strong>Signature Match?</strong>
              <p>Cocok dengan byte hash/pattern CVE dikenal?</p>
              <span class="badge badge-danger">YA: Pemicu Alert Signature</span>
            </div>
            <div class="branch-card">
              <strong>Anomaly Threshold?</strong>
              <p>Frekuensi melampaui baseline normal?</p>
              <span class="badge badge-warning">YA: Pemicu Alert Anomali</span>
            </div>
          </div>
        </div>
      `;
    } else if (tabId === 'quickcheck') {
      const qc = createConceptQuickCheck({
        id: `qc-m${meetingId}`,
        question: meetingId === 1
          ? 'Apakah satu baris log koneksi ke port 22 sudah cukup untuk menyimpulkan adanya serangan berbahaya?'
          : 'Jika jaringan menghadapi varian malware ransomware zero-day baru tanpa CVE, pendekatan IDS manakah yang lebih efektif?',
        options: meetingId === 1
          ? [
              { id: 'no', text: 'Tidak, karena port 22 adalah layanan SSH standar dan koneksi tunggal bisa merupakan aktivitas sah admin.', isCorrect: true, explanation: 'Tepat! Diperlukan korelasi frekuensi dan username untuk membuktikan serangan.' },
              { id: 'yes', text: 'Ya, semua lalu lintas yang menuju port 22 pasti berbahaya.', isCorrect: false, explanation: 'Salah. Port 22 digunakan secara rutin oleh administrator untuk remote management sah.' }
            ]
          : [
              { id: 'anom', text: 'Anomaly-Based IDS karena mampu mendeteksi deviasi perilaku dari baseline normal.', isCorrect: true, explanation: 'Benar! Signature-based tidak memiliki tanda tangan untuk zero-day exploit.' },
              { id: 'sig', text: 'Signature-Based IDS karena tidak pernah menghasilkan false positive.', isCorrect: false, explanation: 'Kurang tepat. Tanpa signature yang ada di database, serangan baru akan lolos tanpa deteksi.' }
            ]
      });
      contentArea.appendChild(qc);
    }
  }

  tabs.forEach(t => {
    const btn = createElement('button', {
      className: `tab-btn ${t.id === 'concept' ? 'tab-active' : ''}`,
      attributes: { 'data-tab': t.id },
      text: t.label,
      events: {
        click: () => showTab(t.id)
      }
    });
    tabsHeader.appendChild(btn);
  });

  matCard.appendChild(tabsHeader);
  matCard.appendChild(contentArea);
  showTab('concept');
  parent.appendChild(matCard);
}

/**
 * MEETING 1 FLOW:
 * 1. Interactive LogViewer with line selection
 * 2. Evidence Board (Synthesis of findings)
 * 3. Hypothesis Formulation Form
 * 4. Critical Thinking Quiz (m1-q01 to m1-q05)
 */
function renderMeeting1Flow(parent, meetingId) {
  // Step 1: Interactive Log Viewer
  const logViewer = createLogViewer({
    id: 'm1-suricata-auth',
    title: 'Suricata Fast Alert & Linux auth.log [Sensor DMZ-01]',
    logs: [
      '09/28-09:12:01.4021 [**] [1:2001219:2] ET SCAN Potential SSH Brute Force [**] [Priority: 1] {TCP} 198.51.100.45:49152 -> 192.168.10.15:22',
      '09/28-09:12:01.8902 sshd[1402]: Failed password for invalid user root from 198.51.100.45 port 49152 ssh2',
      '09/28-09:12:02.1154 [**] [1:2001219:2] ET SCAN Potential SSH Brute Force [**] [Priority: 1] {TCP} 198.51.100.45:49153 -> 192.168.10.15:22',
      '09/28-09:12:02.3411 sshd[1405]: Failed password for invalid user admin from 198.51.100.45 port 49153 ssh2',
      '09/28-09:12:02.8941 [**] [1:2001219:2] ET SCAN Potential SSH Brute Force [**] [Priority: 1] {TCP} 198.51.100.45:49154 -> 192.168.10.15:22',
      '09/28-09:12:03.1129 sshd[1409]: Failed password for invalid user test from 198.51.100.45 port 49154 ssh2',
      '09/28-09:12:03.5820 sshd[1412]: Failed password for invalid user oracle from 198.51.100.45 port 49155 ssh2',
      '09/28-09:12:04.2210 sshd[1418]: Failed password for invalid user guest from 198.51.100.45 port 49156 ssh2',
      '09/28-09:12:15.8920 [**] [1:2001219:2] ET SCAN Potential SSH Brute Force [**] [COUNT=48] {TCP} 198.51.100.45 -> 192.168.10.15:22'
    ],
    canSelectEvidence: true
  });
  parent.appendChild(logViewer);

  // Step 2: Evidence Board
  const evidenceBoard = createEvidenceBoard({
    meetingId,
    onPatternConfirmed: () => {
      showToast({ type: 'info', message: 'Langkah selanjutnya: Rumuskan hipotesis Anda di bawah.' });
    }
  });
  parent.appendChild(evidenceBoard);

  // Step 3: Interactive Hypothesis Form
  const hypothesisCard = createElement('div', { className: 'hypothesis-card card' });
  hypothesisCard.appendChild(createElement('h3', { text: 'Rumuskan Hipotesis Anda (Form Your Hypothesis)' }));
  hypothesisCard.appendChild(createElement('p', {
    text: 'Berdasarkan bukti log dan pola yang telah Anda amati, tentukan dugaan ilmiah mengenai apa yang sebenarnya terjadi:'
  }));

  const hypSelect = createElement('select', { className: 'form-select' });
  HYPOTHESIS_OPTIONS_M1.forEach(opt => {
    const el = createElement('option', { value: opt.id, text: opt.label });
    hypSelect.appendChild(el);
  });
  hypothesisCard.appendChild(hypSelect);

  hypothesisCard.appendChild(createElement('h4', {
    style: { marginTop: '16px' },
    text: 'Pilih bukti konkret yang mendukung hipotesis Anda:'
  }));

  const checkWrap = createElement('div', { className: 'hypothesis-checklist' });
  const selectedEvi = new Set(['evi_freq', 'evi_users']);

  EVIDENCE_CHECKLIST_M1.forEach(evi => {
    const label = createElement('label', {
      className: 'evidence-check-item',
      children: [
        createElement('input', {
          attributes: { type: 'checkbox' },
          events: {
            change: (e) => {
              if (e.target.checked) selectedEvi.add(evi.id);
              else selectedEvi.delete(evi.id);
            }
          }
        }),
        createElement('span', { text: evi.label })
      ]
    });
    if (selectedEvi.has(evi.id)) label.querySelector('input').checked = true;
    checkWrap.appendChild(label);
  });
  hypothesisCard.appendChild(checkWrap);

  const hypFeedback = createElement('div', { className: 'hyp-feedback-box', style: { display: 'none' } });

  const submitHypBtn = createElement('button', {
    className: 'btn btn-primary',
    style: { marginTop: '16px' },
    text: 'Kirim Hipotesis & Evaluasi Penalaran',
    events: {
      click: () => {
        const res = submitHypothesis(meetingId, hypSelect.value, Array.from(selectedEvi));
        hypFeedback.style.display = 'block';
        hypFeedback.className = `alert ${res.quality === 'Strong' ? 'alert-success' : 'alert-info'}`;
        hypFeedback.innerHTML = `
          <strong>Evaluasi Kualitas Hipotesis: ${res.quality}</strong>
          <p>${res.feedback}</p>
        `;
        showToast({ type: 'success', message: 'Hipotesis tersimpan dalam catatan riset.' });
      }
    }
  });

  hypothesisCard.appendChild(submitHypBtn);
  hypothesisCard.appendChild(hypFeedback);
  parent.appendChild(hypothesisCard);

  // Step 4: Question Bank
  const quizSection = createElement('div', { className: 'quiz-list-container' });
  quizSection.appendChild(createElement('h3', { text: 'Pertanyaan Analisis Berpikir Kritis:' }));

  const quizEngine = new QuizEngine(meeting1Questions, meetingId);
  quizEngine.questions.forEach(q => {
    let sel = null;
    const wrap = createElement('div');
    function update(locked = false, fb = null) {
      wrap.innerHTML = '';
      wrap.appendChild(createQuizCard({
        question: q,
        selectedAnswer: sel,
        isLocked: locked,
        feedback: fb,
        onSelectOption: (id) => { sel = id; update(false); },
        onSubmitAnswer: () => {
          if (!sel) return;
          const res = quizEngine.submitAnswer(q.id, sel);
          update(true, res);
          checkMeetingCompletion(meetingId);
        }
      }));
    }
    update();
    quizSection.appendChild(wrap);
  });
  parent.appendChild(quizSection);
}

/**
 * MEETING 2 FLOW:
 * 1. Detection Strategy Simulator & Traffic Spike Visualization
 * 2. Architectural Dilemma Cases
 * 3. Trade-off Quiz
 */
function renderMeeting2Flow(parent, meetingId) {
  // Step 1: Traffic Chart Data Visualization
  const chart = createTrafficChart({
    title: 'Simulasi Trafik: Lonjakan Permintaan Menjelang Ujian CBT Sekolah (08:00 - 08:30)',
    dataPoints: [
      { label: '08:00', value: 12, baseline: 15 },
      { label: '08:05', value: 15, baseline: 15 },
      { label: '08:10', value: 13, baseline: 15 },
      { label: '08:14', value: 11, baseline: 15 },
      { label: '08:15', value: 920, baseline: 15, isAnomaly: true },
      { label: '08:20', value: 870, baseline: 15, isAnomaly: true },
      { label: '08:25', value: 940, baseline: 15, isAnomaly: true },
      { label: '08:30', value: 14, baseline: 15 }
    ]
  });
  parent.appendChild(chart);

  // Strategy Simulator Card
  const simCard = createElement('div', { className: 'sim-strategy-card card' });
  simCard.appendChild(createElement('h3', { text: 'Detection Strategy Simulator' }));
  simCard.appendChild(createElement('p', {
    text: 'Grafik di atas menunjukkan lonjakan 900+ request per menit saat gerbang CBT dibuka. Pendekatan deteksi apa yang sebaiknya Anda terapkan?'
  }));

  const choicesRow = createElement('div', { className: 'strategy-choices-row' });
  const feedbackArea = createElement('div', { className: 'sim-feedback-area', style: { display: 'none' } });

  const choices = [
    {
      id: 'sig',
      label: 'Signature-Based Detection',
      adv: 'Memeriksa keabsahan muatan paket tanpa memblokir lonjakan volume sah.',
      limit: 'Tidak mendeteksi bila ada serangan DoS berbasis flood baru yang belum memiliki rule spesifik.',
      verdict: 'Rekomendasi Utama untuk Trafik Sah Terjadwal'
    },
    {
      id: 'anom',
      label: 'Anomaly-Based Detection',
      adv: 'Mendeteksi deviasi volume drastis seketika.',
      limit: 'Resiko False Positive tinggi! Akses siswa yang sah berpotensi terblokir karena lonjakan 60x lipat baseline.',
      verdict: 'Rentan False Positive pada Ujian Sekolah'
    },
    {
      id: 'both',
      label: 'Hybrid (Kombinasi dengan Kalibrasi Baseline)',
      adv: 'Menyesuaikan batas threshold sementara saat jam ujian dan mengandalkan inspeksi payload signature.',
      limit: 'Membutuhkan tuning manual berkala dari analis jaringan.',
      verdict: 'Solusi Paling Ideal & Realistis'
    }
  ];

  choices.forEach(c => {
    const btn = createElement('button', {
      className: 'btn btn-outline',
      text: c.label,
      events: {
        click: () => {
          choicesRow.querySelectorAll('button').forEach(b => b.className = 'btn btn-outline');
          btn.className = 'btn btn-primary';
          feedbackArea.style.display = 'block';
          feedbackArea.className = 'alert alert-info';
          feedbackArea.innerHTML = `
            <h4>Analisis Trade-Off: ${c.label}</h4>
            <p><strong>Keuntungan:</strong> ${c.adv}</p>
            <p><strong>Keterbatasan / Risiko:</strong> ${c.limit}</p>
            <span class="badge badge-success">${c.verdict}</span>
          `;
          addXP(20, `Simulasi Trade-off ${c.label}`);
        }
      }
    });
    choicesRow.appendChild(btn);
  });

  simCard.appendChild(choicesRow);
  simCard.appendChild(feedbackArea);
  parent.appendChild(simCard);

  // Step 2: Scenarios List
  const scenWrap = createElement('div', { className: 'scenarios-list' });
  scenWrap.appendChild(createElement('h3', { text: 'Studi Kasus Pemilihan Arsitektur IDS:' }));

  scenariosData.forEach(scen => {
    let chosen = null;
    const cardWrap = createElement('div');
    function refresh() {
      cardWrap.innerHTML = '';
      cardWrap.appendChild(createScenarioCard({
        scenario: scen,
        selectedStrategy: chosen,
        onSelectStrategy: (id) => { chosen = id; refresh(); },
        onSubmitStrategy: () => {
          store.setState(prev => ({
            activities: {
              ...prev.activities,
              [scen.id]: { chosen, timestamp: new Date().toISOString() }
            }
          }));
          showToast({ type: 'success', message: 'Keputusan strategi tercatat!' });
          checkMeetingCompletion(meetingId);
        }
      }));
    }
    refresh();
    scenWrap.appendChild(cardWrap);
  });
  parent.appendChild(scenWrap);

  // Step 3: Trade-off Evaluation Quiz
  const quizEngine = new QuizEngine(meeting2Questions, meetingId);
  const quizBox = createElement('div', { className: 'quiz-list-container' });
  quizBox.appendChild(createElement('h3', { text: 'Evaluasi Penalaran Strategi:' }));

  quizEngine.questions.forEach(q => {
    let sel = null;
    const wrap = createElement('div');
    function update(locked = false, fb = null) {
      wrap.innerHTML = '';
      wrap.appendChild(createQuizCard({
        question: q,
        selectedAnswer: sel,
        isLocked: locked,
        feedback: fb,
        onSelectOption: (id) => { sel = id; update(false); },
        onSubmitAnswer: () => {
          if (!sel) return;
          const res = quizEngine.submitAnswer(q.id, sel);
          update(true, res);
          checkMeetingCompletion(meetingId);
        }
      }));
    }
    update();
    quizBox.appendChild(wrap);
  });
  parent.appendChild(quizBox);
}

/**
 * MEETING 3 FLOW:
 * 1. SOC Alert Queue Interface (ALERT-001, ALERT-002, ALERT-003)
 * 2. Progressive Evidence Reveal & Context Tabs
 * 3. Triase Decisions (True Positive, False Positive, Need More Evidence)
 */
function renderMeeting3Flow(parent, meetingId) {
  const triageEngine = new TriageEngine(triageCasesData, meetingId);
  const queueWrap = createElement('div', { className: 'triage-queue-section card' });

  queueWrap.appendChild(createElement('h3', { text: 'SOC Alert Triage Console' }));
  queueWrap.appendChild(createElement('p', {
    text: 'Pilihlah alert dari antrian investigasi berikut. Gunakan opsi "Need More Evidence" bila bukti awal belum cukup untuk memvalidasi insiden secara ilmiah.'
  }));

  const casesContainer = createElement('div', { className: 'triage-cards-list' });

  triageEngine.cases.forEach(tc => {
    const wrap = createElement('div');

    function renderItem() {
      wrap.innerHTML = '';
      const decision = triageEngine.decisions[tc.id];
      const isLocked = Boolean(decision);
      const unlocked = triageEngine.unlockedEvidence[tc.id] || [];

      const card = createTriageCard({
        triageCase: tc,
        unlockedEvidence: unlocked,
        onUnlockEvidence: (eviId) => {
          triageEngine.unlockEvidence(tc.id, eviId);
          renderItem();
        },
        onDecide: (decisionId) => {
          const res = triageEngine.submitDecision(tc.id, decisionId);
          renderItem();
          showToast({
            type: res.isCorrect ? 'success' : 'warning',
            message: res.isCorrect ? 'Keputusan triase tepat!' : 'Evaluasi kembali bukti pendukung.'
          });
          checkMeetingCompletion(meetingId);
        },
        decision: decision?.decision,
        isLocked,
        feedback: decision ? { isCorrect: decision.isCorrect, explanation: decision.explanation } : null
      });

      wrap.appendChild(card);
    }

    renderItem();
    casesContainer.appendChild(wrap);
  });

  queueWrap.appendChild(casesContainer);
  parent.appendChild(queueWrap);
}

/**
 * MEETING 4 FLOW:
 * 1. Incident Case File #IDS-042
 * 2. Multi-sensor Evidence Drawer
 * 3. Interactive Timeline (Chronological forensic stream)
 * 4. Simulated Terminal Shell (grep, cat, help)
 * 5. 5 Guided Inquiry Validation Questions
 * 6. Flag Submission Box
 * 7. Guided 6-Question Reflection Form
 */
function renderMeeting4Flow(parent, meetingId) {
  const ctfEngine = new CtfEngine(ctfChallengeData);

  // 1. Case File Card
  const caseCard = createElement('div', {
    className: 'incident-case-file card',
    children: [
      createElement('div', {
        className: 'case-header-row',
        children: [
          createElement('span', { className: 'badge badge-danger', text: 'CRITICAL CASE #IDS-042' }),
          createElement('span', { className: 'badge badge-outline', text: 'TARGET: SRV-APP-01' })
        ]
      }),
      createElement('h2', { text: ctfChallengeData.title }),
      createElement('p', { className: 'case-scenario', text: ctfChallengeData.scenario })
    ]
  });
  parent.appendChild(caseCard);

  // 2. Interactive Timeline
  const timeline = createInteractiveTimeline({
    events: [
      { time: '08:14:32', type: 'FAILED', sensor: 'auth.log', title: 'Failed password for root', ip: '192.168.1.45', port: 49152, details: 'Percobaan username dictionary #1' },
      { time: '08:14:35', type: 'FAILED', sensor: 'auth.log', title: 'Failed password for admin', ip: '192.168.1.45', port: 49154, details: 'Percobaan username dictionary #2' },
      { time: '08:14:38', type: 'FAILED', sensor: 'auth.log', title: 'Failed password for test', ip: '192.168.1.45', port: 49156, details: 'Percobaan username dictionary #3' },
      { time: '08:15:03', type: 'ALERT', sensor: 'Suricata NIDS', title: 'ET SCAN Potential SSH Brute Force', ip: '192.168.1.45', port: 22, details: 'Threshold breached: 94 percobaan koneksi dalam 30 detik' },
      { time: '08:16:10', type: 'SUCCESS', sensor: 'auth.log', title: 'Accepted password for root', ip: '192.168.1.45', port: 49170, details: 'Kredensial berhasil dibobol oleh penyerang!' }
    ]
  });
  parent.appendChild(timeline);

  // 3. Simulated Terminal
  const terminal = createSimulatedTerminal({
    initialLogs: ctfChallengeData.logs || []
  });
  parent.appendChild(terminal);

  // 4. Guided Validation Questions
  const questionsCard = createElement('div', { className: 'ctf-questions-card card' });
  questionsCard.appendChild(createElement('h3', { text: 'Pertanyaan Investigasi Linimasa:' }));

  ctfChallengeData.questions.forEach((q, idx) => {
    const qWrap = createElement('div', {
      className: 'ctf-question-item',
      children: [
        createElement('h4', { text: `${idx + 1}. ${q.question}` }),
        createElement('div', {
          className: 'ctf-options-row',
          children: q.options.map(opt => createElement('button', {
            className: 'btn btn-sm btn-outline',
            text: opt.text,
            events: {
              click: (e) => {
                const isCorrect = opt.id === q.correctAnswer;
                if (isCorrect) {
                  e.target.className = 'btn btn-sm btn-success';
                  showToast({ type: 'success', message: `Analisis #${idx + 1} Tepat!` });
                  addXP(15, `Validasi CTF #${idx + 1}`);
                } else {
                  e.target.className = 'btn btn-sm btn-danger';
                  showToast({ type: 'warning', message: 'Cermati kembali baris log dan timeline.' });
                }
              }
            }
          }))
        })
      ]
    });
    questionsCard.appendChild(qWrap);
  });
  parent.appendChild(questionsCard);

  // 5. Terminal-style Flag Submission
  const isAlreadySolved = ctfEngine.isSolved();
  const flagCard = createElement('div', { className: 'flag-submit-card card' });
  flagCard.appendChild(createElement('h3', { text: 'Submit Flag Investigasi Insiden' }));
  flagCard.appendChild(createElement('p', { text: 'Ketikkan kode flag keamanan yang Anda temukan berdasarkan pola serangan yang terkonfirmasi (Format: FLAG{...}):' }));

  const flagRow = createElement('div', { className: 'flag-input-row' });
  const flagInput = createElement('input', {
    className: 'form-input flag-input',
    attributes: { placeholder: 'Format: FLAG{...}' }
  });
  if (isAlreadySolved) {
    flagInput.value = 'FLAG ACCEPTED';
    flagInput.disabled = true;
  }

  const submitFlagBtn = createElement('button', {
    className: `btn ${isAlreadySolved ? 'btn-success' : 'btn-primary'}`,
    text: isAlreadySolved ? 'Terverifikasi' : 'Submit Flag',
    attributes: isAlreadySolved ? { disabled: 'true' } : {},
    events: {
      click: () => {
        const val = flagInput.value.trim();
        const res = ctfEngine.submitFlag(val);
        if (res.valid) {
          showToast({ type: 'success', message: res.message });
          flagInput.disabled = true;
          submitFlagBtn.disabled = true;
          submitFlagBtn.className = 'btn btn-success';
          submitFlagBtn.innerText = 'Terverifikasi';
          checkMeetingCompletion(meetingId);
        } else {
          showToast({ type: 'error', message: res.message || 'Flag tidak valid. Silakan kaji ulang bukti.' });
        }
      }
    }
  });

  flagRow.appendChild(flagInput);
  flagRow.appendChild(submitFlagBtn);
  flagCard.appendChild(flagRow);
  parent.appendChild(flagCard);

  // 6. Guided Reflection Form
  const reflection = createReflectionForm({
    meetingId,
    onSubmitted: () => {
      checkMeetingCompletion(meetingId);
      addXP(30, 'Menyelesaikan Refleksi Metakognitif');
    }
  });
  parent.appendChild(reflection);
}
