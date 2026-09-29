/**
 * Student Dashboard Page (Redesigned Editorial SOC Command Center)
 * Educational Cybersecurity Lab for Vocational Students (SMK TJKT - LAPS-Heuristik).
 * 
 * Sections:
 * 1. Hero SOC Command Center & Live Telemetry Summary
 * 2. Aktivitas Rekomendasi (Deterministic priority engine)
 * 3. Akses Cepat (5 essential quick navigation paths)
 * 4. Peta Kurikulum LAPS-Heuristik (Visual interactive roadmap)
 * 5. Lab 01–04 (Distinct numbered hierarchy, progress %, duration, action)
 * 6. Real-Case CTF Showcase (30 real-world scenarios, actual solved stats, pipeline preview)
 * 7. Post-Test Evaluasi Akhir (Clear prerequisite context)
 * 8. Catatan & Riwayat Aktivitas Terkini (Real bookmarks & telemetry events)
 * 
 * Non-negotiables: Zero emojis, pure SVG Lucide icons, 100% functional routes/buttons,
 * 0 fake data, honest offline/empty states.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { meetingsData } from '../data/meetings.js';
import { calculateOverallProgress, calculateMeetingProgress, getRecommendedActivity } from '../modules/analytics/progressTracker.js';
import { getGamificationStats } from '../modules/gamification/xpSystem.js';
import { createIcon } from '../components/Icon.js';

export function createDashboardPage() {
  const container = createElement('div', { className: 'dashboard-page page-container' });

  function render() {
    container.innerHTML = '';
    const state = store.getState();
    const student = state.student || {};
    const overall = calculateOverallProgress(state);
    const recommended = getRecommendedActivity(state);
    const gameStats = getGamificationStats();

    const studentName = student.name ? student.name.toUpperCase() : 'SISWA ANALIS';
    const completedMeetingsCount = [1, 2, 3, 4].filter(id => calculateMeetingProgress(id, state).completed).length;
    const ctfSolvedCount = state.ctf?.completedChallenges?.length || 0;
    const totalCtfs = 30;
    const ctfPercent = Math.round((ctfSolvedCount / totalCtfs) * 100);

    const pretestDone = state.scores?.pretest !== null && state.scores?.pretest !== undefined;
    const posttestDone = state.scores?.posttest !== null && state.scores?.posttest !== undefined;

    // -------------------------------------------------------------
    // SECTION 1: HERO SOC COMMAND CENTER
    // -------------------------------------------------------------
    const welcomeHero = createElement('section', {
      className: 'dashboard-editorial-hero card',
      children: [
        createElement('div', {
          className: 'hero-editorial-top',
          children: [
            createElement('span', { className: 'text-eyebrow', text: 'IDS LEARNING LAB • KELAS XI TJKT' }),
            createElement('span', { className: 'badge badge-neutral', text: student.className || 'KELAS TJKT' })
          ]
        }),
        createElement('h1', {
          className: 'hero-editorial-title',
          children: [
            createElement('span', { className: 'title-greeting', text: `SELAMAT DATANG, ${studentName}` }),
            createElement('span', {
              className: 'title-question',
              text: completedMeetingsCount === 0 && !pretestDone
                ? 'Mulai langkah pertamamu dengan Pre-Test Kemampuan Awal untuk mengukur baseline penalaran.'
                : `Lanjutkan perjalanan investigasimu. Kamu telah menyelesaikan ${completedMeetingsCount} dari 4 lab pembelajaran.`
            })
          ]
        }),
        createElement('div', {
          className: 'hero-editorial-actions',
          children: [
            createElement('button', {
              className: 'btn btn-primary btn-lg',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
              children: [
                createElement('span', { text: `${recommended.label.split(':')[0]} →` })
              ],
              events: {
                click: () => router.navigate(recommended.path)
              }
            }),
            createElement('button', {
              className: 'btn btn-secondary btn-lg',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.45rem' },
              children: [
                createIcon({ name: 'route', size: 16 }),
                createElement('span', { text: 'Lihat Peta Kurikulum' })
              ],
              events: {
                click: () => router.navigate('/learning-path')
              }
            })
          ]
        })
      ]
    });

    // -------------------------------------------------------------
    // SECTION 2: AKTIVITAS REKOMENDASI (ADAPTIVE DETERMINISTIC BOX)
    // -------------------------------------------------------------
    const nextActionCard = createElement('section', {
      className: 'dashboard-next-action card',
      children: [
        createElement('div', {
          className: 'next-action-header',
          children: [
            createElement('div', {
              style: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
              children: [
                createIcon({ name: 'sparkles', size: 16 }),
                createElement('span', { className: 'badge badge-primary', text: 'AKTIVITAS REKOMENDASI' })
              ]
            }),
            createElement('span', { className: 'text-caption', text: 'Panduan Adaptif LAPS–Heuristik' })
          ]
        }),
        createElement('div', {
          className: 'next-action-body',
          children: [
            createElement('div', {
              className: 'next-action-info',
              children: [
                createElement('h3', { className: 'next-action-title', text: recommended.label }),
                createElement('p', { className: 'next-action-desc', text: recommended.reason })
              ]
            }),
            createElement('button', {
              className: 'btn btn-accent btn-lg next-action-btn',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
              children: [
                createIcon({ name: 'play', size: 14 }),
                createElement('span', { text: 'Eksekusi Sekarang →' })
              ],
              events: {
                click: () => router.navigate(recommended.path)
              }
            })
          ]
        })
      ]
    });

    // -------------------------------------------------------------
    // SECTION 3: AKSES CEPAT (QUICK ACCESS 5 ESSENTIAL PATHS)
    // -------------------------------------------------------------
    const quickAccessItems = [
      { path: '/learning-path', title: 'Peta Kurikulum', desc: 'Alur tahapan modul LAPS-Heuristik', icon: 'route' },
      { path: '/portfolio', title: 'Portofolio LAPS', desc: 'Catatan bukti & hipotesis investigasi', icon: 'folderKanban' },
      { path: '/leaderboard', title: 'Klasemen SOC', desc: 'Peringkat & evaluasi kohort analis', icon: 'trophy' },
      { path: '/evidence', title: 'Evidence Tersimpan', desc: 'Notebook bukti log hasil investigasi', icon: 'searchCheck' },
      { path: '/profile', title: 'Identitas & Lencana', desc: 'Profil analis & lencana kompetensi', icon: 'user' }
    ];

    const quickAccessSection = createElement('section', {
      className: 'dashboard-quick-access',
      children: [
        createElement('h3', { className: 'quick-access-heading', text: 'Akses Cepat' }),
        createElement('div', {
          className: 'quick-access-grid',
          children: quickAccessItems.map(item => createElement('div', {
            className: 'quick-access-btn',
            children: [
              createElement('div', {
                className: 'quick-access-top',
                children: [
                  createElement('div', {
                    className: 'quick-access-icon',
                    children: [createIcon({ name: item.icon, size: 18 })]
                  }),
                  createIcon({ name: 'arrowRight', size: 13, className: 'text-muted' })
                ]
              }),
              createElement('h4', { className: 'quick-access-title', text: item.title }),
              createElement('p', { className: 'quick-access-desc', text: item.desc })
            ],
            events: {
              click: () => router.navigate(item.path)
            }
          }))
        })
      ]
    });

    // -------------------------------------------------------------
    // SECTION 4: PROGRESS HERO & METRICS MATRIX
    // -------------------------------------------------------------
    const progressHero = createElement('section', {
      className: 'dashboard-progress-hero card',
      children: [
        createElement('div', {
          className: 'progress-hero-header',
          children: [
            createElement('span', { className: 'text-eyebrow', text: 'PROGRES BELAJAR KESELURUHAN' }),
            createElement('span', { className: 'progress-hero-percentage', text: `${overall.percent}%` })
          ]
        }),
        createElement('div', {
          className: 'progress-hero-headline',
          children: [
            createElement('span', { className: 'progress-count', text: `0${completedMeetingsCount} / 04` }),
            createElement('span', { className: 'progress-count-label', text: 'LAB UTAMA TELAH DISELESAIKAN' })
          ]
        }),
        createElement('div', {
          className: 'progress-editorial-track',
          children: [
            createElement('div', {
              className: 'progress-editorial-fill',
              style: { width: `${overall.percent}%` }
            })
          ]
        }),
        createElement('div', {
          className: 'progress-hero-meta',
          children: [
            createElement('div', {
              className: 'meta-item',
              children: [
                createElement('span', { className: 'meta-lbl', text: 'Pre-Test Kemampuan Awal' }),
                createElement('span', {
                  className: `meta-val ${pretestDone ? 'text-success' : 'text-muted'}`,
                  text: pretestDone ? `Tuntas (${state.scores.pretest}%)` : 'Belum Dikerjakan'
                })
              ]
            }),
            createElement('div', {
              className: 'meta-item',
              children: [
                createElement('span', { className: 'meta-lbl', text: 'Kasus CTF Terpecahkan' }),
                createElement('span', {
                  className: 'meta-val',
                  text: `${ctfSolvedCount} / ${totalCtfs} Kasus (${ctfPercent}%)`
                })
              ]
            }),
            createElement('div', {
              className: 'meta-item',
              children: [
                createElement('span', { className: 'meta-lbl', text: 'Poin & Level Analis' }),
                createElement('span', {
                  className: 'meta-val text-primary',
                  text: `${gameStats.xp} XP • Level ${gameStats.level.current}`
                })
              ]
            }),
            createElement('div', {
              className: 'meta-item',
              children: [
                createElement('span', { className: 'meta-lbl', text: 'Post-Test Evaluasi Akhir' }),
                createElement('span', {
                  className: `meta-val ${posttestDone ? 'text-success' : 'text-muted'}`,
                  text: posttestDone
                    ? `Tuntas (${state.scores.posttest}%)`
                    : (completedMeetingsCount === 4 ? 'Siap Dikerjakan' : 'Menunggu Lab 04')
                })
              ]
            })
          ]
        })
      ]
    });

    // -------------------------------------------------------------
    // SECTION 5: PETA KURIKULUM (VISUAL INTERACTIVE ROADMAP)
    // -------------------------------------------------------------
    const curriculumNodes = [
      {
        num: 'PRE',
        title: 'Pre-Test',
        path: '/pre-test',
        isDone: pretestDone,
        isCurrent: recommended.path === '/pre-test',
        statusText: pretestDone ? 'Tuntas' : 'Kemampuan Awal'
      },
      {
        num: '01',
        title: 'Understand',
        path: '/meeting/1',
        isDone: calculateMeetingProgress(1, state).completed,
        isCurrent: recommended.path === '/meeting/1',
        statusText: calculateMeetingProgress(1, state).completed ? 'Tuntas' : 'Sensor & Log'
      },
      {
        num: '02',
        title: 'Plan',
        path: '/meeting/2',
        isDone: calculateMeetingProgress(2, state).completed,
        isCurrent: recommended.path === '/meeting/2',
        statusText: calculateMeetingProgress(2, state).completed ? 'Tuntas' : 'Topologi & Rule'
      },
      {
        num: '03',
        title: 'Execute',
        path: '/meeting/3',
        isDone: calculateMeetingProgress(3, state).completed,
        isCurrent: recommended.path === '/meeting/3',
        statusText: calculateMeetingProgress(3, state).completed ? 'Tuntas' : 'Triase Bukti'
      },
      {
        num: '04',
        title: 'Review',
        path: '/meeting/4',
        isDone: calculateMeetingProgress(4, state).completed,
        isCurrent: recommended.path === '/meeting/4',
        statusText: calculateMeetingProgress(4, state).completed ? 'Tuntas' : 'Respon Insiden'
      },
      {
        num: 'CTF',
        title: 'Real-Case CTF',
        path: '/ctf',
        isDone: ctfSolvedCount >= 10,
        isCurrent: recommended.path === '/ctf',
        statusText: `${ctfSolvedCount}/30 Selesai`
      },
      {
        num: 'POST',
        title: 'Post-Test',
        path: '/post-test',
        isDone: posttestDone,
        isCurrent: recommended.path === '/post-test',
        statusText: posttestDone ? 'Tuntas' : 'Evaluasi Akhir'
      }
    ];

    const curriculumRoadmap = createElement('section', {
      className: 'dashboard-curriculum-roadmap',
      children: [
        createElement('div', {
          className: 'roadmap-header',
          children: [
            createElement('div', {
              className: 'roadmap-header-info',
              children: [
                createElement('h3', { text: 'Peta Kurikulum' }),
                createElement('p', { text: 'Alur pembelajaran berbasis LAPS–Heuristik dari penalaran awal hingga evaluasi akhir.' })
              ]
            }),
            createElement('button', {
              className: 'btn btn-sm btn-outline',
              text: 'Buka Detail Kurikulum →',
              events: {
                click: () => router.navigate('/learning-path')
              }
            })
          ]
        }),
        createElement('div', {
          className: 'roadmap-nodes-container',
          children: curriculumNodes.map(node => createElement('div', {
            className: `roadmap-node-card ${node.isCurrent ? 'node-current' : ''} ${node.isDone ? 'node-completed' : ''}`,
            children: [
              createElement('div', {
                className: 'roadmap-node-top',
                children: [
                  createElement('span', { className: 'roadmap-node-label', text: node.num }),
                  createElement('span', {
                    className: `badge text-xs ${node.isDone ? 'badge-success' : (node.isCurrent ? 'badge-primary' : 'badge-neutral')}`,
                    text: node.isDone ? '✓ Tuntas' : (node.isCurrent ? 'Direkomendasikan' : node.statusText)
                  })
                ]
              }),
              createElement('span', { className: 'roadmap-node-name', text: node.title })
            ],
            events: {
              click: () => router.navigate(node.path)
            }
          }))
        })
      ]
    });

    // -------------------------------------------------------------
    // SECTION 6: LAB 01–04 CARDS
    // -------------------------------------------------------------
    const lapsProgressionSection = createElement('section', {
      className: 'dashboard-laps-section',
      children: [
        createElement('div', {
          className: 'section-heading-editorial',
          children: [
            createElement('h3', { text: 'Lab Pembelajaran 01–04' }),
            createElement('p', { text: 'Struktur investigasi bertingkat dari pemahaman dasar hingga respon mitigasi insiden nyata.' })
          ]
        }),
        createElement('div', {
          className: 'laps-stages-grid',
          children: meetingsData.map(meeting => {
            const prog = calculateMeetingProgress(meeting.id, state);
            const isDone = prog.completed;
            const isCurrent = recommended.path === `/meeting/${meeting.id}`;

            return createElement('div', {
              className: `laps-stage-card card ${isCurrent ? 'stage-current' : ''}`,
              children: [
                createElement('div', {
                  className: 'stage-card-top',
                  children: [
                    createElement('span', { className: 'stage-number', text: `0${meeting.id}` }),
                    createElement('span', {
                      className: `badge ${isDone ? 'badge-success' : (prog.progressPercent > 0 ? 'badge-primary' : 'badge-neutral')}`,
                      text: isDone ? 'Selesai' : (prog.progressPercent > 0 ? `${prog.progressPercent}%` : 'Tersedia')
                    })
                  ]
                }),
                createElement('div', {
                  className: 'stage-card-content',
                  children: [
                    createElement('span', { className: 'stage-laps-tag', text: getStageLabel(meeting.lapsStage) }),
                    createElement('h4', { className: 'stage-title', text: meeting.title }),
                    createElement('p', { className: 'stage-desc', text: meeting.description })
                  ]
                }),
                createElement('div', {
                  className: 'stage-card-bottom',
                  children: [
                    createElement('span', { className: 'stage-time', text: `≈ ${meeting.estimatedMinutes || 45} Menit` }),
                    createElement('button', {
                      className: `btn btn-sm ${isDone ? 'btn-secondary' : (isCurrent ? 'btn-primary' : 'btn-secondary')}`,
                      text: isDone ? 'Tinjau Lab' : (prog.progressPercent > 0 ? 'Lanjutkan Lab' : 'Mulai Lab'),
                      events: {
                        click: () => router.navigate(`/meeting/${meeting.id}`)
                      }
                    })
                  ]
                })
              ]
            });
          })
        })
      ]
    });

    // -------------------------------------------------------------
    // SECTION 7: REAL-CASE CTF SHOWCASE (30 SCENARIOS)
    // -------------------------------------------------------------
    const ctfShowcaseSection = createElement('section', {
      className: 'dashboard-ctf-showcase',
      children: [
        createElement('div', {
          className: 'ctf-showcase-header',
          children: [
            createElement('div', {
              className: 'ctf-showcase-title-area',
              children: [
                createElement('span', { className: 'text-eyebrow', text: 'BANK KASUS CTF NYATA' }),
                createElement('h3', { text: 'Real-Case CTF Investigation' }),
                createElement('p', {
                  text: 'Investigasi skenario keamanan yang diadaptasi dari kasus nyata dalam lingkungan pembelajaran yang aman. Dilengkapi pembuktian bukti log, penelusuran IOC, validasi flag, dan refleksi metakognitif LAPS.'
                })
              ]
            }),
            createElement('button', {
              className: 'btn btn-primary btn-lg',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' },
              children: [
                createIcon({ name: 'flag', size: 16 }),
                createElement('span', { text: 'Masuk ke CTF →' })
              ],
              events: {
                click: () => router.navigate('/ctf')
              }
            })
          ]
        }),
        createElement('div', {
          className: 'ctf-stats-cluster',
          children: [
            createElement('div', {
              className: 'ctf-stat-pill',
              children: [
                createElement('span', { className: 'ctf-stat-pill-label', text: 'Total Skenario Kasus' }),
                createElement('span', { className: 'ctf-stat-pill-value', text: `${totalCtfs}` })
              ]
            }),
            createElement('div', {
              className: 'ctf-stat-pill',
              children: [
                createElement('span', { className: 'ctf-stat-pill-label', text: 'Terselesaikan (Solved)' }),
                createElement('span', { className: 'ctf-stat-pill-value text-accent', text: `${ctfSolvedCount}` })
              ]
            }),
            createElement('div', {
              className: 'ctf-stat-pill',
              children: [
                createElement('span', { className: 'ctf-stat-pill-label', text: 'Sisa Tersedia' }),
                createElement('span', { className: 'ctf-stat-pill-value', text: `${Math.max(0, totalCtfs - ctfSolvedCount)}` })
              ]
            }),
            createElement('div', {
              className: 'ctf-stat-pill',
              children: [
                createElement('span', { className: 'ctf-stat-pill-label', text: 'Tingkat Ketercapaian' }),
                createElement('span', { className: 'ctf-stat-pill-value text-primary', text: `${ctfPercent}%` })
              ]
            })
          ]
        }),
        createElement('div', {
          className: 'ctf-pipeline-preview',
          children: [
            createElement('span', { className: 'ctf-pipeline-label', text: 'Alur Investigasi Analis:' }),
            createElement('div', {
              className: 'ctf-pipeline-steps',
              children: [
                createElement('span', { className: 'ctf-pipeline-step', text: 'Case File' }),
                createElement('span', { className: 'ctf-pipeline-arrow', text: '→' }),
                createElement('span', { className: 'ctf-pipeline-step', text: 'Mission' }),
                createElement('span', { className: 'ctf-pipeline-arrow', text: '→' }),
                createElement('span', { className: 'ctf-pipeline-step', text: 'Evidence' }),
                createElement('span', { className: 'ctf-pipeline-arrow', text: '→' }),
                createElement('span', { className: 'ctf-pipeline-step', text: 'Timeline' }),
                createElement('span', { className: 'ctf-pipeline-arrow', text: '→' }),
                createElement('span', { className: 'ctf-pipeline-step', text: 'Investigation' }),
                createElement('span', { className: 'ctf-pipeline-arrow', text: '→' }),
                createElement('span', { className: 'ctf-pipeline-step', text: 'Flag' }),
                createElement('span', { className: 'ctf-pipeline-arrow', text: '→' }),
                createElement('span', { className: 'ctf-pipeline-step', text: 'Mitigation' }),
                createElement('span', { className: 'ctf-pipeline-arrow', text: '→' }),
                createElement('span', { className: 'ctf-pipeline-step', text: 'Reflection' })
              ]
            })
          ]
        })
      ]
    });

    // -------------------------------------------------------------
    // SECTION 8: POST-TEST EVALUATION CARD
    // -------------------------------------------------------------
    const posttestCard = createElement('section', {
      className: 'dashboard-posttest-card card',
      children: [
        createElement('div', {
          className: 'posttest-info',
          children: [
            createElement('span', { className: 'text-eyebrow', text: 'EVALUASI AKHIR' }),
            createElement('h3', { text: 'Post-Test Kemampuan Berpikir Kritis' }),
            createElement('p', {
              text: posttestDone
                ? `Evaluasi akhir telah diselesaikan dengan perolehan skor ${state.scores.posttest}%. Anda dapat melihat komparasi gain pada instrumen riset.`
                : (completedMeetingsCount === 4
                  ? 'Seluruh 4 lab pembelajaran telah diselesaikan. Silakan kerjakan Post-Test untuk mengukur peningkatan kemampuan berpikir kritis Anda.'
                  : 'Post-Test tersedia setelah rangkaian pembelajaran utama selesai (Lab 01 s/d Lab 04).')
            })
          ]
        }),
        createElement('div', {
          children: [
            createElement('button', {
              className: `btn ${posttestDone ? 'btn-secondary' : (completedMeetingsCount === 4 ? 'btn-primary' : 'btn-secondary')}`,
              text: posttestDone ? 'Tinjau Hasil Evaluasi' : (completedMeetingsCount === 4 ? 'Mulai Post-Test →' : 'Selesaikan Lab Terlebih Dahulu'),
              events: {
                click: () => {
                  if (posttestDone) {
                    router.navigate('/completion');
                  } else if (completedMeetingsCount === 4) {
                    router.navigate('/post-test');
                  } else {
                    router.navigate(recommended.path);
                  }
                }
              }
            })
          ]
        })
      ]
    });

    // -------------------------------------------------------------
    // SECTION 9: RECENT ACTIVITY & EVIDENCE NOTEBOOK FEED
    // -------------------------------------------------------------
    const bookmarks = state.bookmarks || [];
    const events = (state.analytics?.events || []).slice(-4).reverse();

    const recentSection = createElement('section', {
      className: 'dashboard-recent-section card',
      children: [
        createElement('div', {
          className: 'recent-header',
          children: [
            createElement('div', {
              children: [
                createElement('h3', { text: 'Catatan & Riwayat Aktivitas Terkini' }),
                createElement('p', { className: 'text-muted text-sm', style: { margin: 0 }, text: 'Rekaman telemetri investigasi dan bukti log tersimpan pada sesi belajar Anda.' })
              ]
            }),
            createElement('button', {
              className: 'btn btn-secondary btn-sm',
              text: 'Buka Evidence Notebook →',
              events: {
                click: () => router.navigate('/evidence')
              }
            })
          ]
        }),
        createElement('div', {
          className: 'recent-list',
          children: (bookmarks.length > 0 || events.length > 0)
            ? [
                ...bookmarks.slice(-2).reverse().map(b => createElement('div', {
                  className: 'recent-item',
                  children: [
                    createElement('div', {
                      className: 'recent-info',
                      children: [
                        createElement('strong', { className: 'recent-title', text: b.title || 'Bukti Log Tersimpan' }),
                        createElement('span', { className: 'recent-date', text: b.date ? new Date(b.date).toLocaleDateString('id-ID') : 'Sesi Ini' })
                      ]
                    }),
                    createElement('span', { className: 'badge badge-primary', text: 'Evidence' })
                  ]
                })),
                ...events.slice(0, 2).map(ev => createElement('div', {
                  className: 'recent-item',
                  children: [
                    createElement('div', {
                      className: 'recent-info',
                      children: [
                        createElement('strong', { className: 'recent-title', text: formatEventLabel(ev.type) }),
                        createElement('span', { className: 'recent-date', text: new Date(ev.timestamp).toLocaleTimeString('id-ID') })
                      ]
                    }),
                    createElement('span', { className: 'badge badge-neutral', text: ev.meetingId ? `Lab 0${ev.meetingId}` : 'Aktivitas' })
                  ]
                }))
              ]
            : [
                createElement('div', {
                  className: 'recent-empty',
                  children: [
                    createElement('p', { text: 'Belum ada aktivitas terbaru. Mulai dari Pre-Test untuk membangun baseline kemampuanmu.' }),
                    createElement('button', {
                      className: 'btn btn-secondary btn-sm',
                      text: 'Mulai Pre-Test Sekarang →',
                      events: {
                        click: () => router.navigate('/pre-test')
                      }
                    })
                  ]
                })
              ]
        })
      ]
    });

    container.appendChild(welcomeHero);
    container.appendChild(nextActionCard);
    container.appendChild(quickAccessSection);
    container.appendChild(progressHero);
    container.appendChild(curriculumRoadmap);
    container.appendChild(lapsProgressionSection);
    container.appendChild(ctfShowcaseSection);
    container.appendChild(posttestCard);
    container.appendChild(recentSection);
  }

  store.subscribe(() => {
    render();
  });

  render();
  return container;
}

function getStageLabel(stage) {
  const map = {
    understand: 'TAHAP 01: MEMAHAMI MASALAH',
    plan: 'TAHAP 02: MERENCANAKAN PEMECAHAN',
    execute: 'TAHAP 03: MELAKSANAKAN RENCANA',
    review: 'TAHAP 04: MENINJAU KEMBALI'
  };
  return map[stage] || (stage ? stage.toUpperCase() : 'LAPS TAHAP');
}

function formatEventLabel(eventType) {
  const map = {
    app_started: 'Sesi Aplikasi Dimulai',
    pretest_started: 'Pre-Test Dimulai',
    pretest_completed: 'Pre-Test Selesai',
    posttest_started: 'Post-Test Dimulai',
    posttest_completed: 'Post-Test Selesai',
    meeting_started: 'Lab Pembelajaran Dimulai',
    meeting_completed: 'Lab Pembelajaran Selesai',
    ctf_attempt: 'Percobaan Flag CTF',
    ctf_solved: 'Flag CTF Berhasil Dipecahkan',
    badge_unlocked: 'Lencana Prestasi Dibuka',
    evidence_saved: 'Bukti Log Disimpan'
  };
  return map[eventType] || eventType.replace(/_/g, ' ').toUpperCase();
}

export default createDashboardPage;
