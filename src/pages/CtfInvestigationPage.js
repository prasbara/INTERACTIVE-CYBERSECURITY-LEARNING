/**
 * Real-World Case CTF Investigation Page
 * Comprehensive sandbox workspace for investigating a specific cybersecurity incident.
 * Features:
 * - Multi-file Evidence Pack Viewer
 * - Client-Side Simulated Bash Terminal (grep, cat, head, tail, wc)
 * - Guided Question Chain with Pedagogical Explanations
 * - 4-Tier Hint System with XP Scoring
 * - Deterministic Flag Validation
 * - Post-CTF Debrief, MITRE ATT&CK Mapping & LAPS Reflection Form
 */

import { createElement, escapeHtml } from '../utils/dom.js';
import { router } from '../app/router.js';
import { store } from '../app/state.js';
import { getChallengeById } from '../data/ctf/realCases.js';
import { CTF_CATEGORIES } from '../data/ctf/categories.js';
import { CTF_DIFFICULTY_LEVELS } from '../data/ctf/difficulty.js';
import { submitFlag, isCtfSolved, getChallengeAttempts } from '../modules/ctf/ctfEngine.js';
import { unlockHint, isHintUnlocked, getUnlockedHintsCount } from '../modules/ctf/hintSystem.js';
import { showToast } from '../components/Toast.js';
import { logEvent } from '../modules/analytics/eventLogger.js';
import { createIcon } from '../components/Icon.js';

export function createCtfInvestigationPage(arg) {
  const container = createElement('div', { className: 'ctf-investigation-page page-container' });
  const params = arg?.params || arg || {};
  const challengeId = params.id;

  const challenge = getChallengeById(challengeId);

  if (!challenge) {
    container.innerHTML = `
      <div class="card alert alert-danger" style="margin: 2rem auto; max-width: 600px; text-align: center;">
        <h2>Kasus Tidak Ditemukan</h2>
        <p>Kasus CTF dengan ID <code>${escapeHtml(challengeId || 'undefined')}</code> tidak terdaftar di repositori kasus nyata.</p>
        <button class="btn btn-primary" id="btn-back-to-ctf">← Kembali ke Bank Kasus CTF</button>
      </div>
    `;
    const backBtn = container.querySelector('#btn-back-to-ctf');
    if (backBtn) {
      backBtn.addEventListener('click', () => router.navigate('/ctf'));
    }
    return container;
  }

  // Active investigation local states
  let activeEvidenceIndex = 0;
  let activeWorkspaceTab = 'evidence'; // 'evidence' or 'terminal'
  let logSearchTerm = '';
  let terminalHistory = [
    { type: 'system', text: `IDS Sandbox Terminal Session [Host: ${challenge.caseBrief.targetHost}]` },
    { type: 'system', text: `Available files: ${challenge.evidencePack.map(e => e.fileName).join(', ')}` },
    { type: 'system', text: `Type 'help' for available commands (grep, cat, head, tail, wc, clear).` }
  ];
  let questionAnswers = {};
  let questionFeedback = {};
  let flagInput = '';
  let flagFeedback = null;
  let showSourceModal = false;

  // Track page open
  logEvent('ctf_case_opened', { challengeId: challenge.id, title: challenge.title });

  function render() {
    container.innerHTML = '';

    const state = store.getState();
    const isSolved = isCtfSolved(challenge.id);
    const diffInfo = CTF_DIFFICULTY_LEVELS[challenge.difficulty] || CTF_DIFFICULTY_LEVELS.beginner;
    const catInfo = CTF_CATEGORIES[challenge.category] || { name: challenge.category };
    const unlockedHints = challenge.hints.map((_, idx) => isHintUnlocked(idx + 1, challenge.id));

    // 1. Navigation & Header Bar
    const navBar = createElement('div', {
      className: 'ctf-investigation-nav',
      children: [
        createElement('button', {
          className: 'btn btn-outline btn-sm',
          text: '← Kembali ke Bank Kasus CTF',
          events: {
            click: () => router.navigate('/ctf')
          }
        }),
        createElement('div', {
          className: 'ctf-nav-right',
          children: [
            createElement('button', {
              className: 'btn btn-secondary btn-sm',
              text: 'Referensi Sumber Terbuka',
              events: {
                click: () => {
                  showSourceModal = !showSourceModal;
                  render();
                }
              }
            })
          ]
        })
      ]
    });
    container.appendChild(navBar);

    // 2. Incident Hero Card & LAPS Phase Tracker
    const heroCard = createElement('div', {
      className: 'ctf-investigation-hero card',
      children: [
        createElement('div', {
          className: 'hero-top-badges',
          children: [
            createElement('span', { className: 'case-code-badge', text: challenge.id }),
            createElement('span', { className: 'badge badge-primary', text: catInfo.name }),
            createElement('span', { className: 'badge badge-info', text: `${diffInfo.label} (+${challenge.xpReward} XP)` }),
            isSolved ? createElement('span', { className: 'badge badge-success', text: 'SOLVED & VERIFIED' }) : null
          ].filter(Boolean)
        }),
        createElement('h1', { className: 'investigation-title', text: challenge.title }),
        createElement('div', {
          className: 'investigation-tech-meta',
          children: [
            createElement('span', { text: `Target: ${challenge.caseBrief.targetHost}` }),
            createElement('span', { text: `Sensor: ${challenge.caseBrief.detectionSource}` }),
            createElement('span', { text: `Teknologi: ${challenge.affectedTechnology}` })
          ]
        }),
        // LAPS Progress Tracker Bar
        createElement('div', {
          className: 'ctf-laps-tracker',
          children: [
            createElement('div', {
              className: 'laps-step active',
              children: [
                createElement('span', { className: 'step-dot', text: '1' }),
                createElement('span', { className: 'step-text', text: 'Understand (Analisis Insiden)' })
              ]
            }),
            createElement('div', {
              className: 'laps-step active',
              children: [
                createElement('span', { className: 'step-dot', text: '2' }),
                createElement('span', { className: 'step-text', text: 'Plan (Telaah Bukti)' })
              ]
            }),
            createElement('div', {
              className: `laps-step ${Object.keys(questionAnswers).length > 0 ? 'active' : ''}`,
              children: [
                createElement('span', { className: 'step-dot', text: '3' }),
                createElement('span', { className: 'step-text', text: 'Execute (Korelasi & Flag)' })
              ]
            }),
            createElement('div', {
              className: `laps-step ${isSolved ? 'active done' : ''}`,
              children: [
                createElement('span', { className: 'step-dot', text: '4' }),
                createElement('span', { className: 'step-text', text: 'Review (Mitigasi & Refleksi)' })
              ]
            })
          ]
        })
      ]
    });
    container.appendChild(heroCard);

    // Optional: Open Source Reference Modal
    if (showSourceModal) {
      const sourceCard = createElement('div', {
        className: 'modal-backdrop-custom',
        children: [
          createElement('div', {
            className: 'modal-card-custom card',
            children: [
              createElement('div', {
                className: 'modal-header-custom',
                children: [
                  createElement('h3', { text: 'Referensi Kasus Nyata & Latar Belakang' }),
                  createElement('button', {
                    className: 'btn-close-custom',
                    text: 'Tutup',
                    events: {
                      click: () => {
                        showSourceModal = false;
                        render();
                      }
                    }
                  })
                ]
              }),
              createElement('div', {
                className: 'modal-body-custom',
                children: [
                  createElement('p', {
                    text: `Tantangan edukatif ini diadaptasi dari laporan insiden / kerentanan siber publik:`
                  }),
                  createElement('div', {
                    className: 'source-meta-box',
                    children: [
                      createElement('p', { children: [createElement('strong', { text: 'Sumber Publik: ' }), document.createTextNode(challenge.source.sourceName)] }),
                      createElement('p', { children: [createElement('strong', { text: 'Judul Advisory: ' }), document.createTextNode(challenge.source.title)] }),
                      createElement('p', { children: [createElement('strong', { text: 'Tanggal Rilis: ' }), document.createTextNode(challenge.source.publicationDate)] }),
                      challenge.source.sourceUrl && challenge.source.sourceUrl !== '#' ? createElement('p', {
                        children: [
                          createElement('strong', { text: 'Tautan Resmi: ' }),
                          createElement('a', {
                            href: challenge.source.sourceUrl,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            text: challenge.source.sourceUrl
                          })
                        ]
                      }) : null
                    ].filter(Boolean)
                  }),
                  createElement('div', {
                    className: 'alert alert-info',
                    text: 'Catatan Pedagogis: Seluruh nama domain, IP, dan file rahasia telah disanitasi dan dikonversi menjadi data sintetis terisolasi demi keamanan proses belajar.'
                  })
                ]
              })
            ]
          })
        ]
      });
      container.appendChild(sourceCard);
    }

    // 3. Workspace Layout (2 Columns)
    const workspace = createElement('div', { className: 'ctf-workspace-grid' });

    // LEFT COLUMN: Case Brief & Evidence Pack / Terminal
    const leftCol = createElement('div', { className: 'ctf-workspace-left' });

    // Case Brief Card
    const briefCard = createElement('div', {
      className: 'case-brief-card card',
      children: [
        createElement('h3', { text: 'Deskripsi & Misi Investigasi' }),
        createElement('p', { className: 'brief-narrative', text: challenge.caseBrief.narrative }),
        createElement('div', {
          className: 'mission-list',
          children: [
            createElement('strong', { text: 'Objektif Anda:' }),
            createElement('ul', {
              children: challenge.caseBrief.mission.map(m => createElement('li', { text: m }))
            })
          ]
        })
      ]
    });
    leftCol.appendChild(briefCard);

    // Evidence & Terminal Workspace Card
    const evidenceCard = createElement('div', {
      className: 'evidence-workspace-card card',
      children: [
        // Tabs Header
        createElement('div', {
          className: 'evidence-tab-bar',
          children: [
            createElement('button', {
              className: `tab-btn ${activeWorkspaceTab === 'evidence' ? 'active' : ''}`,
              text: 'Bukti Log (Evidence Pack)',
              events: {
                click: () => {
                  activeWorkspaceTab = 'evidence';
                  render();
                }
              }
            }),
            createElement('button', {
              className: `tab-btn ${activeWorkspaceTab === 'terminal' ? 'active' : ''}`,
              text: 'Sandbox Terminal (Bash)',
              events: {
                click: () => {
                  activeWorkspaceTab = 'terminal';
                  render();
                }
              }
            })
          ]
        }),
        // Sub-view: Evidence Pack
        activeWorkspaceTab === 'evidence' ? createElement('div', {
          className: 'evidence-view-container',
          children: [
            // Evidence File Switcher
            createElement('div', {
              className: 'evidence-files-pills',
              children: challenge.evidencePack.map((file, idx) => 
                createElement('button', {
                  className: `file-pill ${idx === activeEvidenceIndex ? 'active' : ''}`,
                  text: file.fileName,
                  events: {
                    click: () => {
                      activeEvidenceIndex = idx;
                      render();
                    }
                  }
                })
              )
            }),
            // File description & search
            createElement('div', {
              className: 'evidence-toolbar',
              children: [
                createElement('span', {
                  className: 'evidence-file-desc',
                  text: `Keterangan: ${challenge.evidencePack[activeEvidenceIndex]?.description || ''}`
                }),
                createElement('input', {
                  type: 'text',
                  className: 'form-control form-control-sm evidence-search-input',
                  placeholder: 'Filter baris log...',
                  value: logSearchTerm,
                  events: {
                    input: (e) => {
                      logSearchTerm = e.target.value.toLowerCase();
                      updateLogContent();
                    }
                  }
                })
              ]
            }),
            // Log Content Box
            createElement('div', {
              className: 'evidence-log-viewer',
              id: 'log-viewer-box'
            })
          ]
        }) : null,
        // Sub-view: Simulated Terminal
        activeWorkspaceTab === 'terminal' ? createElement('div', {
          className: 'terminal-view-container',
          children: [
            createElement('div', {
              className: 'terminal-screen',
              id: 'terminal-screen',
              children: terminalHistory.map(entry => 
                createElement('div', {
                  className: `terminal-line ${entry.type === 'cmd' ? 'terminal-cmd' : entry.type === 'error' ? 'terminal-err' : 'terminal-out'}`,
                  text: entry.text
                })
              )
            }),
            createElement('div', {
              className: 'terminal-input-row',
              children: [
                createElement('span', { className: 'terminal-prompt', text: 'student@ids-sandbox:~$ ' }),
                createElement('input', {
                  type: 'text',
                  className: 'terminal-input',
                  placeholder: 'Contoh: grep "Failed" auth.log | cat ...',
                  events: {
                    keydown: (e) => {
                      if (e.key === 'Enter') {
                        const cmd = e.target.value.trim();
                        if (cmd) {
                          handleTerminalCommand(cmd);
                          e.target.value = '';
                        }
                      }
                    }
                  }
                })
              ]
            })
          ]
        }) : null
      ].filter(Boolean)
    });
    leftCol.appendChild(evidenceCard);
    workspace.appendChild(leftCol);

    // RIGHT COLUMN: Guided Questions, Hints, Flag Submission & Post-Debrief
    const rightCol = createElement('div', { className: 'ctf-workspace-right' });

    // Guided Questions Section
    const questionsCard = createElement('div', {
      className: 'guided-questions-card card',
      children: [
        createElement('h3', { text: 'Rangkaian Analisis Investigasi' }),
        createElement('p', {
          className: 'text-muted text-sm',
          text: 'Jawab pertanyaan pemandu berikut sebelum melakukan verifikasi flag akhir:'
        }),
        createElement('div', {
          className: 'question-chain-list',
          children: challenge.questions.map((q, qIdx) => {
            const userAnswer = questionAnswers[q.id];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = userAnswer === q.correctAnswer;

            return createElement('div', {
              className: `question-item ${isAnswered ? (isCorrect ? 'q-correct' : 'q-incorrect') : ''}`,
              children: [
                createElement('h4', { text: `Q${qIdx + 1}: ${q.question}` }),
                createElement('div', {
                  className: 'q-options-list',
                  children: q.options.map(opt => 
                    createElement('label', {
                      className: `option-label ${userAnswer === opt.id ? 'option-selected' : ''}`,
                      children: [
                        createElement('input', {
                          type: 'radio',
                          name: `q_${q.id}`,
                          value: opt.id,
                          checked: userAnswer === opt.id,
                          events: {
                            change: () => {
                              questionAnswers[q.id] = opt.id;
                              render();
                            }
                          }
                        }),
                        createElement('span', { text: `${opt.id.toUpperCase()}. ${opt.text}` })
                      ]
                    })
                  )
                }),
                isAnswered ? createElement('div', {
                  className: `feedback-pill ${isCorrect ? 'feedback-success' : 'feedback-error'}`,
                  text: isCorrect ? `Benar! ${q.explanation}` : `Belum tepat. ${q.explanation}`
                }) : null
              ].filter(Boolean)
            });
          })
        })
      ]
    });
    rightCol.appendChild(questionsCard);

    // 4-Tier Hint System Card
    const hintCard = createElement('div', {
      className: 'hint-system-card card',
      children: [
        createElement('div', {
          className: 'hint-header',
          children: [
            createElement('h3', { text: 'Petunjuk Penyelidikan (4 Tingkat)' }),
            createElement('span', { className: 'text-muted text-xs', text: 'Hint tier 2+ mengurangi potensi bonus XP' })
          ]
        }),
        createElement('div', {
          className: 'hints-list',
          children: challenge.hints.map((hint, hIdx) => {
            const unlocked = unlockedHints[hIdx];
            return createElement('div', {
              className: `hint-box ${unlocked ? 'hint-unlocked' : 'hint-locked'}`,
              children: [
                createElement('div', {
                  className: 'hint-top-row',
                  children: [
                    createElement('strong', { text: `Tier ${hint.tier}: ${hIdx === 0 ? 'Arah Investigasi (Gratis)' : hIdx === 1 ? 'Lokasi Bukti (-15 XP)' : hIdx === 2 ? 'Interpretasi Teknis (-15 XP)' : 'Petunjuk Flag Kunci (-15 XP)'}` }),
                    !unlocked ? createElement('button', {
                      className: 'btn btn-outline btn-xs',
                      text: 'Buka Petunjuk',
                      events: {
                        click: () => {
                          unlockHint(hint.tier, challenge.id);
                          render();
                        }
                      }
                    }) : null
                  ].filter(Boolean)
                }),
                unlocked ? createElement('p', { className: 'hint-content', text: hint.text }) : null
              ].filter(Boolean)
            });
          })
        })
      ]
    });
    rightCol.appendChild(hintCard);

    // Flag Submission Card & Result Panel
    const maxAttempts = challenge.flagConfig?.maxAttempts || 5;
    const attemptsUsed = getChallengeAttempts(challenge.id);
    const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed);
    const isLockedOut = attemptsRemaining <= 0 && !isSolved;
    const questionsCount = (challenge.questions || []).length;
    const answeredCount = Object.keys(questionAnswers).length;
    const isPrerequisiteMet = questionsCount === 0 || answeredCount >= questionsCount;
    const challengeResults = state.ctf?.resultsByChallenge?.[challenge.id] || null;

    if (isSolved) {
      // Section 10: Standardized SOC Result Panel
      const resultPanel = createElement('div', {
        className: 'ctf-result-panel card animate-fade-in',
        style: {
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)'
        },
        children: [
          createElement('div', {
            style: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' },
            children: [
              createElement('div', {
                style: {
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                },
                children: [createIcon('Check', { size: 18 })]
              }),
              createElement('div', {
                children: [
                  createElement('span', { className: 'badge badge-success', text: 'CHALLENGE SOLVED' }),
                  createElement('h3', { text: 'Flag Accepted', style: { margin: '0.25rem 0 0' } })
                ]
              })
            ]
          }),
          createElement('div', {
            className: 'investigation-checklist card',
            style: { margin: '0.75rem 0', padding: '1rem', backgroundColor: 'var(--color-surface-soft)' },
            children: [
              createElement('h4', { text: 'Investigation Milestones', style: { margin: '0 0 0.5rem', fontSize: '0.9rem' } }),
              createElement('ul', {
                style: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' },
                children: [
                  createElement('li', {
                    style: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
                    children: [createIcon('Check', { size: 14 }), createElement('span', { text: 'Evidence identified & correlated' })]
                  }),
                  createElement('li', {
                    style: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
                    children: [createIcon('Check', { size: 14 }), createElement('span', { text: 'Attack pattern identified' })]
                  }),
                  createElement('li', {
                    style: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
                    children: [createIcon('Check', { size: 14 }), createElement('span', { text: 'Indicators of Compromise (IOC) confirmed' })]
                  }),
                  createElement('li', {
                    style: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
                    children: [createIcon('Check', { size: 14 }), createElement('span', { text: 'Flag validated & verified' })]
                  })
                ]
              })
            ]
          }),
          createElement('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', margin: '1rem 0' },
            children: [
              createElement('div', {
                className: 'card',
                style: { padding: '0.75rem', textAlign: 'center', margin: 0 },
                children: [
                  createElement('span', { className: 'text-caption', text: 'Attempts' }),
                  createElement('strong', { text: `${challengeResults?.attemptsUsed || attemptsUsed}/${maxAttempts}`, style: { display: 'block', fontSize: '1.1rem' } })
                ]
              }),
              createElement('div', {
                className: 'card',
                style: { padding: '0.75rem', textAlign: 'center', margin: 0 },
                children: [
                  createElement('span', { className: 'text-caption', text: 'Hints Used' }),
                  createElement('strong', { text: `${challengeResults?.hintsUsed ?? getUnlockedHintsCount(challenge.id)}`, style: { display: 'block', fontSize: '1.1rem' } })
                ]
              }),
              createElement('div', {
                className: 'card',
                style: { padding: '0.75rem', textAlign: 'center', margin: 0 },
                children: [
                  createElement('span', { className: 'text-caption', text: 'XP Earned' }),
                  createElement('strong', { text: `+${challengeResults?.xpAwarded || challenge.xpReward}`, style: { display: 'block', fontSize: '1.1rem', color: 'var(--color-primary)' } })
                ]
              })
            ]
          }),
          createElement('p', {
            className: 'text-sm text-muted',
            style: { fontStyle: 'italic', margin: '0.5rem 0 0' },
            text: 'Next: Review the mitigation strategy and complete the metacognitive reflection below.'
          })
        ]
      });
      rightCol.appendChild(resultPanel);
    } else {
      // Flag Submission Form
      const flagCard = createElement('div', {
        className: 'flag-submission-card card',
        children: [
          createElement('div', {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
            children: [
              createElement('h3', { text: 'Validasi Flag Investigasi', style: { margin: 0 } }),
              createElement('span', {
                className: `badge ${isPrerequisiteMet ? 'badge-neutral' : 'badge-warning'}`,
                text: isPrerequisiteMet ? 'Siap Validasi Flag' : `Pertanyaan: ${answeredCount}/${questionsCount}`
              })
            ]
          }),
          createElement('p', {
            className: 'text-sm text-muted',
            text: 'Masukkan kode flag keamanan setelah melakukan korelasi bukti log dan analisis pertanyaan:'
          }),
          createElement('div', {
            className: 'flag-meta-row',
            style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' },
            children: [
              createElement('span', { text: `Percobaan: ${attemptsUsed} / ${maxAttempts}` }),
              createElement('span', { text: `Tersisa: ${attemptsRemaining} kali` })
            ]
          }),
          createElement('div', {
            className: 'flag-input-group',
            children: [
              createElement('input', {
                type: 'text',
                className: 'form-control flag-input-field',
                placeholder: 'Format: FLAG{...}',
                value: flagInput,
                disabled: isSolved || isLockedOut,
                events: {
                  input: (e) => {
                    flagInput = e.target.value;
                  }
                }
              }),
              createElement('button', {
                className: `btn ${isSolved ? 'btn-success' : 'btn-primary'}`,
                text: isSolved ? 'Terverifikasi' : 'Kirim Flag',
                disabled: isSolved || isLockedOut,
                events: {
                  click: () => {
                    handleFlagSubmit();
                  }
                }
              })
            ]
          }),
          isLockedOut ? createElement('div', {
            className: 'alert alert-danger mt-2',
            text: 'Batas percobaan (5/5) telah habis. Silakan kaji ulang bukti atau diskusikan dengan mentor.'
          }) : null,
          flagFeedback ? createElement('div', {
            className: `alert ${flagFeedback.valid ? 'alert-success' : 'alert-danger'} mt-2`,
            text: flagFeedback.message || flagFeedback.feedback
          }) : null
        ].filter(Boolean)
      });
      rightCol.appendChild(flagCard);
    }

    // Post-CTF Debrief, Mitigation & LAPS Reflection (Available if Solved)
    if (isSolved) {
      const savedReflections = state.ctf?.reflections?.[challenge.id] || {};
      const reflectionQuestions = challenge.reflection || [
        "Mengapa kamu yakin aktivitas tersebut merupakan serangan?",
        "Evidence mana yang paling kuat?",
        "Apakah ada kemungkinan false positive?",
        "Bagaimana cara memvalidasi keputusanmu?",
        "Mitigasi apa yang sebaiknya diterapkan?"
      ];

      const debriefCard = createElement('div', {
        className: 'debrief-card card alert-success',
        children: [
          createElement('h3', { text: 'Debrief Insiden & Rekomendasi Mitigasi SOC' }),
          createElement('div', {
            className: 'mitre-tags-row',
            children: [
              createElement('strong', { text: 'Pemetaan MITRE ATT&CK: ' }),
              ...(challenge.mitreTechniques || []).map(tech => 
                createElement('span', { className: 'badge badge-outline', text: tech })
              )
            ]
          }),
          createElement('div', {
            className: 'mitigation-summary-box',
            children: [
              createElement('strong', { text: 'Tindakan Mitigasi yang Direkomendasikan:' }),
              createElement('p', { text: challenge.mitigationSummary })
            ]
          }),
          // Guided LAPS Reflection Form
          createElement('div', {
            className: 'laps-reflection-box',
            children: [
              createElement('h4', { text: 'Refleksi Metakognitif (LAPS-Heuristik — Meninjau Kembali)' }),
              createElement('p', {
                className: 'text-xs text-muted',
                text: '“Apakah solusi ini tepat? Bagaimana kita bisa mengeceknya?” Jawab pertanyaan refleksi di bawah untuk melengkapi portofolio analis SOC Anda:'
              }),
              createElement('div', {
                className: 'reflection-questions-container',
                style: { display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0.75rem 0' },
                children: reflectionQuestions.map((qText, qIdx) => {
                  const savedVal = typeof savedReflections === 'object' ? (savedReflections[`ref_${qIdx}`] || '') : (qIdx === 0 ? savedReflections : '');
                  return createElement('div', {
                    className: 'reflection-field',
                    children: [
                      createElement('label', {
                        className: 'text-xs',
                        style: { fontWeight: '600', display: 'block', marginBottom: '0.25rem' },
                        text: `${qIdx + 1}. ${qText}`
                      }),
                      createElement('textarea', {
                        className: 'form-control reflection-textarea',
                        rows: 2,
                        placeholder: 'Tuliskan telaah Anda...',
                        value: savedVal,
                        events: {
                          input: (e) => {
                            const val = e.target.value;
                            store.setState(prev => {
                              const curr = prev.ctf?.reflections?.[challenge.id] || {};
                              const updated = typeof curr === 'object' ? { ...curr, [`ref_${qIdx}`]: val } : { ref_0: val };
                              return {
                                ctf: {
                                  ...prev.ctf,
                                  reflections: {
                                    ...(prev.ctf?.reflections || {}),
                                    [challenge.id]: updated
                                  }
                                }
                              };
                            });
                          }
                        }
                      })
                    ]
                  });
                })
              }),
              createElement('button', {
                className: 'btn btn-primary btn-sm mt-2',
                text: 'Simpan Refleksi Kasus',
                events: {
                  click: () => {
                    showToast({ type: 'success', message: 'Refleksi LAPS tersimpan dengan aman di portfolio belajar!' });
                  }
                }
              })
            ]
          })
        ]
      });
      rightCol.appendChild(debriefCard);
    }

    workspace.appendChild(rightCol);
    container.appendChild(workspace);

    // Initial render of log viewer content
    setTimeout(updateLogContent, 0);
  }

  function updateLogContent() {
    const box = container.querySelector('#log-viewer-box');
    if (!box) return;

    const file = challenge.evidencePack[activeEvidenceIndex];
    if (!file) {
      box.innerHTML = '<p class="text-muted">Tidak ada berkas bukti.</p>';
      return;
    }

    const rawLines = file.content.split('\n');
    const filteredLines = rawLines.map((line, idx) => ({ line, num: idx + 1 }))
      .filter(item => {
        if (!logSearchTerm) return true;
        return item.line.toLowerCase().includes(logSearchTerm);
      });

    box.innerHTML = filteredLines.map(item => `
      <div class="log-line">
        <span class="log-num">${item.num}</span>
        <span class="log-text">${escapeHtml(item.line)}</span>
      </div>
    `).join('');
  }

  function handleTerminalCommand(rawCmd) {
    terminalHistory.push({ type: 'cmd', text: `student@ids-sandbox:~$ ${rawCmd}` });

    const parts = rawCmd.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'clear') {
      terminalHistory = [];
      render();
      return;
    }

    if (cmd === 'help') {
      terminalHistory.push({
        type: 'out',
        text: `Available sandbox utilities:
  ls                     : List evidence files in directory
  cat <file>             : Print entire file content
  grep "<pattern>" <file>: Filter lines containing pattern
  head -n <N> <file>     : View first N lines
  tail -n <N> <file>     : View last N lines
  wc -l <file>           : Count lines in file
  clear                  : Clear terminal screen`
      });
      render();
      return;
    }

    if (cmd === 'ls') {
      const files = challenge.evidencePack.map(e => e.fileName).join('  ');
      terminalHistory.push({ type: 'out', text: files });
      render();
      return;
    }

    // File target finder
    const targetFileName = args[args.length - 1];
    const fileObj = challenge.evidencePack.find(f => f.fileName.toLowerCase() === targetFileName?.toLowerCase());

    if (cmd === 'cat') {
      if (!fileObj) {
        terminalHistory.push({ type: 'error', text: `cat: ${targetFileName || ''}: No such file or directory` });
      } else {
        fileObj.content.split('\n').forEach(l => terminalHistory.push({ type: 'out', text: l }));
      }
      render();
      return;
    }

    if (cmd === 'grep') {
      const pattern = args[0]?.replace(/^['"]|['"]$/g, '');
      if (!pattern || !fileObj) {
        terminalHistory.push({ type: 'error', text: `Usage: grep "<pattern>" <file>` });
      } else {
        const matches = fileObj.content.split('\n').filter(l => l.toLowerCase().includes(pattern.toLowerCase()));
        if (matches.length === 0) {
          terminalHistory.push({ type: 'out', text: `(no matching lines found for '${pattern}')` });
        } else {
          matches.forEach(m => terminalHistory.push({ type: 'out', text: m }));
        }
      }
      render();
      return;
    }

    if (cmd === 'wc') {
      if (!fileObj) {
        terminalHistory.push({ type: 'error', text: `wc: ${targetFileName || ''}: No such file` });
      } else {
        const count = fileObj.content.split('\n').length;
        terminalHistory.push({ type: 'out', text: `${count} ${fileObj.fileName}` });
      }
      render();
      return;
    }

    if (cmd === 'head' || cmd === 'tail') {
      if (!fileObj) {
        terminalHistory.push({ type: 'error', text: `${cmd}: ${targetFileName || ''}: No such file` });
      } else {
        const lines = fileObj.content.split('\n');
        const count = parseInt(args[1] || '5', 10);
        const sliced = cmd === 'head' ? lines.slice(0, count) : lines.slice(-count);
        sliced.forEach(l => terminalHistory.push({ type: 'out', text: l }));
      }
      render();
      return;
    }

    terminalHistory.push({ type: 'error', text: `bash: ${cmd}: command not found in sandbox. Type 'help' for commands.` });
    render();
  }

  function handleFlagSubmit() {
    if (!flagInput.trim()) {
      flagFeedback = { valid: false, message: 'Harap ketik kode flag terlebih dahulu!' };
      render();
      return;
    }

    const qCount = (challenge.questions || []).length;
    const aCount = Object.keys(questionAnswers).length;
    if (qCount > 0 && aCount < qCount) {
      flagFeedback = {
        valid: false,
        message: 'Selesaikan analisis pertanyaan investigasi dan identifikasi pola serangan di atas terlebih dahulu sebelum memvalidasi flag.'
      };
      showToast({
        type: 'warning',
        message: 'Jawab seluruh pertanyaan investigasi terlebih dahulu.'
      });
      render();
      return;
    }

    const result = submitFlag(flagInput, challenge.id);
    flagFeedback = result;

    if (result.valid) {
      showToast({
        type: 'success',
        message: `Investigasi Selesai! Flag terverifikasi. (+${challenge.xpReward} XP)`
      });
    } else {
      showToast({
        type: 'error',
        message: result.message || 'Flag tidak valid. Silakan analisis bukti log kembali.'
      });
    }

    render();
  }

  render();
  return container;
}
