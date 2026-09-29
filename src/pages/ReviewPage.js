/**
 * Review / Portfolio Page (Portofolio LAPS–Heuristik Siswa)
 * Comprehensive record of student investigations across all 4 LAPS phases:
 * - Problem & Sensor Understanding
 * - Hypothesis & Topology Planning
 * - Evidence Verification & Alert Triage Decisions
 * - Incident Mitigation & Metacognitive Reflection
 * Real search, filtering by phase, detail modal, and working JSON/CSV export.
 */

import { createElement, escapeHtml } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { getHypothesis } from '../modules/hypothesis/hypothesisEngine.js';
import { calculateMeetingProgress } from '../modules/analytics/progressTracker.js';
import { createIcon } from '../components/Icon.js';
import { openModal } from '../components/Modal.js';
import { downloadJson, downloadCsv } from '../utils/download.js';
import { showToast } from '../components/Toast.js';

export function createReviewPage() {
  const container = createElement('div', { className: 'review-page page-container' });

  let searchQuery = '';
  let selectedPhase = 'all';

  function render() {
    container.innerHTML = '';
    const state = store.getState();
    const student = state.student || {};
    const ctfSolvedCount = state.ctf?.completedChallenges?.length || 0;
    const m1Hypothesis = getHypothesis(1);

    // 1. Header Card with Export Actions
    const headerCard = createElement('div', {
      className: 'review-hero card',
      children: [
        createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' },
          children: [
            createElement('div', {
              children: [
                createElement('div', {
                  className: 'hero-badges-row',
                  children: [
                    createElement('span', { className: 'badge badge-primary', text: 'PORTOFOLIO LAPS–HEURISTIK' }),
                    createElement('span', { className: 'badge badge-success', text: 'Catatan Investigasi Siswa' })
                  ]
                }),
                createElement('h1', { text: 'Portofolio Investigasi & Rekam Jejak LAPS' }),
                createElement('p', {
                  className: 'text-muted',
                  style: { maxWidth: '650px', margin: '0.25rem 0 0' },
                  text: 'Dokumentasi komprehensif penalaran problem-solving: Perumusan Hipotesis, Triase Bukti Log, Keputusan Klasifikasi, dan Refleksi Metakognitif.'
                })
              ]
            }),
            createElement('div', {
              style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
              children: [
                createElement('button', {
                  className: 'btn btn-outline btn-sm',
                  style: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem' },
                  children: [
                    createIcon({ name: 'download', size: 14 }),
                    createElement('span', { text: 'Ekspor JSON' })
                  ],
                  events: {
                    click: () => {
                      exportPortfolioJSON(state);
                      showToast({ type: 'success', message: 'Portofolio JSON berhasil diunduh.' });
                    }
                  }
                }),
                createElement('button', {
                  className: 'btn btn-outline btn-sm',
                  style: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem' },
                  children: [
                    createIcon({ name: 'fileText', size: 14 }),
                    createElement('span', { text: 'Ekspor CSV' })
                  ],
                  events: {
                    click: () => {
                      exportPortfolioCSV(state);
                      showToast({ type: 'success', message: 'Rekam jejak investigasi CSV berhasil diunduh.' });
                    }
                  }
                })
              ]
            })
          ]
        })
      ]
    });
    container.appendChild(headerCard);

    // 2. Build Records Array
    const records = [
      {
        id: 'rec-01',
        phaseNum: 1,
        stage: 'Understand (Memahami Masalah)',
        labTitle: 'Lab 01: Konsep & Log Mentah IDS',
        problem: 'Identifikasi pola anomali trafik pada log mentah Suricata dan membedakan fakta empiris dari opini asumsi.',
        hypothesis: m1Hypothesis?.text || 'Belum dirumuskan (Selesaikan tahap penalaran di Lab 01).',
        hypothesisQuality: m1Hypothesis?.quality === 'strong' ? 'Kuat (Didukung bukti log)' : (m1Hypothesis ? 'Perlu Penguatan Bukti' : 'Belum Tersedia'),
        evidence: 'Log auth.log & fast.log Suricata (Percobaan SSH login berulang dari IP eksternal).',
        decision: state.progress?.meeting1 ? 'Fakta anomali teridentifikasi tuntas' : 'Dalam Proses Investigasi',
        mitigation: 'Inspeksi koneksi port 22 dan batasi rate-limit pada firewall.',
        reflection: state.progress?.meeting1 ? 'Membedakan fakta log dari asumsi adalah kunci agar tidak terjadi bias tuduhan insiden.' : 'Belum mengisi refleksi.',
        completed: Boolean(state.progress?.meeting1),
        path: '/meeting/1'
      },
      {
        id: 'rec-02',
        phaseNum: 2,
        stage: 'Plan (Merencanakan Pemecahan)',
        labTitle: 'Lab 02: Penempatan Sensor NIDS vs HIDS',
        problem: 'Menentukan topologi sensor pendeteksian yang optimal antara perimeter jaringan (NIDS) dan server kritis internal (HIDS).',
        hypothesis: 'Penempatan ganda (DMZ inline + Core Switch SPAN + Server Auth HIDS) meminimalkan blind-spot inspeksi.',
        hypothesisQuality: 'Tervalidasi Desain Topologi',
        evidence: 'Diagram topologi enterprise, tabel throughput sensor, dan skenario kompromi lateral.',
        decision: `Evaluasi ${Object.keys(state.activities || {}).filter(k => k.includes('m2')).length || 0} skenario selesai`,
        mitigation: 'Implementasi VLAN isolasi dan SPAN port mirror untuk sensor Suricata.',
        reflection: state.progress?.meeting2 ? 'Tidak ada satu jenis sensor yang sempurna; pertahanan berlapis (defense-in-depth) adalah strategi terbaik.' : 'Belum mengisi refleksi.',
        completed: Boolean(state.progress?.meeting2),
        path: '/meeting/2'
      },
      {
        id: 'rec-03',
        phaseNum: 3,
        stage: 'Execute (Melaksanakan Rencana)',
        labTitle: 'Lab 03: Triase Alert SOC & Analisis Rule',
        problem: 'Menganalisis alert banjir notifikasi dan menentukan apakah alert merupakan True Positive, False Positive, atau butuh bukti tambahan.',
        hypothesis: 'Validasi alert memerlukan korelasi 7 konteks: IP reputasi, signature payload, timestamp, respon server, dan port target.',
        hypothesisQuality: 'Tervalidasi Triase Empiris',
        evidence: `${Object.keys(state.triageDecisions || {}).length} kasus alert ditriase`,
        decision: `${Object.keys(state.triageDecisions || {}).length} keputusan triase tercatat`,
        mitigation: 'Tuning rule IDS untuk mereduksi alarm false positive dan eskalasi alert true positive ke tim respons.',
        reflection: state.progress?.meeting3 ? 'Alert merah belum tentu insiden berbahaya; analis harus selalu memeriksa payload dan respons server.' : 'Belum mengisi refleksi.',
        completed: Boolean(state.progress?.meeting3),
        path: '/meeting/3'
      },
      {
        id: 'rec-04',
        phaseNum: 4,
        stage: 'Review (Meninjau Kembali & CTF)',
        labTitle: 'Lab 04: Respon Insiden & Simulasi Blue Team',
        problem: 'Menguji ketepatan analisis melalui skenario investigasi CTF, verifikasi flag, penyusunan mitigasi, dan refleksi metakognitif.',
        hypothesis: 'Heuristik: Apakah solusi ini tepat? Bagaimana kita bisa mengeceknya secara empiris?',
        hypothesisQuality: 'Metakognitif LAPS',
        evidence: `${ctfSolvedCount} kasus CTF dari 30 skenario nyata terpecahkan`,
        decision: state.ctf?.solved ? 'Flag insiden terverifikasi' : 'Dalam proses validasi flag',
        mitigation: 'Penyusunan playbook incident response dan isolasi host terkompromi.',
        reflection: state.ctf?.reflection || (state.ctf?.reflections ? Object.values(state.ctf.reflections).map(r => r.q1 || '').filter(Boolean).join('; ') : '') || 'Belum mengisi refleksi metakognitif.',
        completed: Boolean(state.progress?.meeting4),
        path: '/meeting/4'
      }
    ];

    // 3. Search and Filter Bar
    const filterCard = createElement('div', {
      className: 'card',
      style: { padding: '1rem 1.25rem', margin: '1.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
      children: [
        createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' },
          children: [
            createIcon({ name: 'search', size: 16 }),
            createElement('input', {
              className: 'form-control',
              attributes: {
                type: 'search',
                placeholder: 'Cari catatan problem, hipotesis, bukti, atau mitigasi...',
                value: searchQuery
              },
              events: {
                input: (e) => {
                  searchQuery = e.target.value.toLowerCase().trim();
                  renderRecords();
                }
              }
            })
          ]
        }),
        createElement('div', {
          className: 'admin-subnav-bar',
          children: [
            { id: 'all', label: 'Semua Fase' },
            { id: '1', label: '01 Understand' },
            { id: '2', label: '02 Plan' },
            { id: '3', label: '03 Execute' },
            { id: '4', label: '04 Review' }
          ].map(f => createElement('button', {
            className: `admin-nav-tab ${selectedPhase === f.id ? 'active' : ''}`,
            text: f.label,
            events: {
              click: () => {
                selectedPhase = f.id;
                render();
              }
            }
          }))
        })
      ]
    });
    container.appendChild(filterCard);

    // 4. Records List Wrapper
    const recordsWrapper = createElement('div', { className: 'portfolio-records-container' });
    container.appendChild(recordsWrapper);

    function renderRecords() {
      recordsWrapper.innerHTML = '';

      let filtered = records;
      if (selectedPhase !== 'all') {
        filtered = filtered.filter(r => String(r.phaseNum) === selectedPhase);
      }
      if (searchQuery) {
        filtered = filtered.filter(r =>
          r.stage.toLowerCase().includes(searchQuery) ||
          r.labTitle.toLowerCase().includes(searchQuery) ||
          r.problem.toLowerCase().includes(searchQuery) ||
          r.hypothesis.toLowerCase().includes(searchQuery) ||
          r.evidence.toLowerCase().includes(searchQuery) ||
          r.mitigation.toLowerCase().includes(searchQuery) ||
          r.reflection.toLowerCase().includes(searchQuery)
        );
      }

      if (filtered.length === 0) {
        recordsWrapper.appendChild(createElement('div', {
          className: 'card',
          style: { textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-muted)' },
          text: 'Tidak ada catatan investigasi yang cocok dengan pencarian.'
        }));
        return;
      }

      const grid = createElement('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' },
        children: filtered.map(rec => createElement('div', {
          className: 'card',
          style: {
            borderTop: `4px solid ${rec.completed ? 'var(--color-accent)' : 'var(--color-primary-strong)'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem'
          },
          children: [
            createElement('div', {
              children: [
                createElement('div', {
                  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
                  children: [
                    createElement('span', { className: 'badge badge-outline text-xs', text: `Fase 0${rec.phaseNum}` }),
                    createElement('span', {
                      className: `badge ${rec.completed ? 'badge-success' : 'badge-neutral'} text-xs`,
                      text: rec.completed ? 'Tuntas' : 'Dalam Proses'
                    })
                  ]
                }),
                createElement('h3', { text: rec.stage, style: { fontSize: '1.15rem', margin: '0 0 0.25rem 0' } }),
                createElement('strong', { text: rec.labTitle, style: { fontSize: '0.85rem', color: 'var(--color-primary-strong)', display: 'block', marginBottom: '0.75rem' } }),

                // Investigation Snapshot Attributes
                createDetailRow('Masalah (Problem)', rec.problem),
                createDetailRow('Hipotesis Solusi', `${rec.hypothesis} (${rec.hypothesisQuality})`),
                createDetailRow('Bukti Log (Evidence)', rec.evidence),
                createDetailRow('Keputusan Analis', rec.decision),
                createDetailRow('Mitigasi', rec.mitigation),
                createDetailRow('Refleksi Heuristik', rec.reflection)
              ]
            }),
            createElement('div', {
              style: { display: 'flex', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' },
              children: [
                createElement('button', {
                  className: 'btn btn-outline btn-sm',
                  style: { flex: 1 },
                  text: 'Buka Detail Modal',
                  events: {
                    click: () => openPortfolioDetailModal(rec)
                  }
                }),
                createElement('button', {
                  className: 'btn btn-primary btn-sm',
                  style: { flex: 1 },
                  text: 'Buka Modul Lab →',
                  events: {
                    click: () => router.navigate(rec.path)
                  }
                })
              ]
            })
          ]
        }))
      });

      recordsWrapper.appendChild(grid);
    }

    renderRecords();
  }

  store.subscribe(() => {
    render();
  });

  render();
  return container;
}

function createDetailRow(label, value) {
  return createElement('div', {
    style: { marginBottom: '0.6rem', fontSize: '0.825rem', lineHeight: '1.4' },
    children: [
      createElement('span', { text: `${label}: `, style: { fontWeight: '600', color: 'var(--color-text)' } }),
      createElement('span', { text: value, className: 'text-muted' })
    ]
  });
}

function openPortfolioDetailModal(rec) {
  const content = createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    children: [
      createElement('div', {
        children: [
          createElement('span', { className: 'badge badge-primary', text: `Fase 0${rec.phaseNum} LAPS` }),
          createElement('h3', { text: rec.stage, style: { margin: '0.35rem 0' } }),
          createElement('p', { className: 'text-muted text-sm', text: rec.labTitle })
        ]
      }),
      createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--color-surface-soft)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' },
        children: [
          createModalSection('1. Masalah & Fakta Insiden', rec.problem),
          createModalSection('2. Hipotesis Pemecahan', `${rec.hypothesis} [Status: ${rec.hypothesisQuality}]`),
          createModalSection('3. Bukti Pendukung (Evidence)', rec.evidence),
          createModalSection('4. Keputusan Analis (Decision)', rec.decision),
          createModalSection('5. Rekomendasi Mitigasi', rec.mitigation),
          createModalSection('6. Refleksi Metakognitif (Meninjau Kembali)', rec.reflection)
        ]
      })
    ]
  });

  openModal({
    title: 'Catatan Lengkap Investigasi LAPS',
    content,
    buttons: [
      {
        text: 'Buka Lab Ini',
        variant: 'primary',
        onClick: () => router.navigate(rec.path)
      },
      { text: 'Tutup', variant: 'secondary' }
    ]
  });
}

function createModalSection(title, text) {
  return createElement('div', {
    children: [
      createElement('strong', { text: title, style: { fontSize: '0.875rem', color: 'var(--color-primary-strong)', display: 'block', marginBottom: '0.2rem' } }),
      createElement('p', { text, style: { margin: 0, fontSize: '0.825rem', color: 'var(--color-text)' } })
    ]
  });
}

function exportPortfolioJSON(state) {
  const portfolioData = {
    student: state.student || {},
    exportedAt: new Date().toISOString(),
    scores: state.scores || {},
    triageDecisions: state.triageDecisions || {},
    ctfSolved: state.ctf?.completedChallenges || [],
    ctfReflections: state.ctf?.reflections || {},
    bookmarks: state.bookmarks || []
  };
  downloadJson(portfolioData, `ids_portfolio_${state.student?.name ? state.student.name.replace(/\s+/g, '_').toLowerCase() : 'analyst'}.json`);
}

function exportPortfolioCSV(state) {
  const headers = ['Phase', 'Stage', 'Title', 'Status', 'Hypothesis', 'Decision', 'Mitigation'];
  const rows = [
    ['01', 'Understand', 'Lab 01: Sensor & Log Mentah', state.progress?.meeting1 ? 'Completed' : 'In Progress', getHypothesis(1)?.text || '-', 'Fact/Opinion Analysis', 'Rate-limiting port 22'],
    ['02', 'Plan', 'Lab 02: Arsitektur Sensor', state.progress?.meeting2 ? 'Completed' : 'In Progress', 'NIDS DMZ + HIDS Server', 'Topology Verified', 'SPAN port mirroring'],
    ['03', 'Execute', 'Lab 03: Triase Alert SOC', state.progress?.meeting3 ? 'Completed' : 'In Progress', '7 Context Correlation', `${Object.keys(state.triageDecisions || {}).length} Cases Triaged`, 'IDS Rule Tuning'],
    ['04', 'Review', 'Lab 04: Respon Insiden & CTF', state.progress?.meeting4 ? 'Completed' : 'In Progress', 'Metacognitive Heuristic', `${state.ctf?.completedChallenges?.length || 0} Flags Validated`, 'Playbook Execution']
  ];
  downloadCsv(headers, rows, `ids_investigation_records_${state.student?.name ? state.student.name.replace(/\s+/g, '_').toLowerCase() : 'analyst'}.csv`);
}

export default createReviewPage;
