/**
 * Landing Page Component
 * Production-Grade Interactive Cybersecurity Learning Platform Gateway
 *
 * Information Architecture:
 * 1. Hero Section (Eyebrow, Core Headline, Supporting Copy, Primary & Secondary CTAs)
 * 2. Realistic Product Interface Preview (Interactive tabs: Learning Path, Log Analysis, Evidence Reasoning, Alert Triage, CTF Investigation)
 * 3. Problem Statement Section (Moving beyond rote memorization to evidence-based decision making)
 * 4. LAPS–Heuristik 4-Stage Pedagogical Framework (Heuristic questions as cognitive anchors)
 * 5. Learning Experience Progression (Pre-Test, Meetings 01-04, Post-Test)
 * 6. Core Product Capabilities (Interactive Log Analysis, Evidence Reasoning, Alert Triage, Blue-Team CTF, Progress Tracking, Research Mode)
 * 7. Closing Synthesis & Direct Call to Action
 * 8. Professional Editorial Footer
 */

import { createElement } from '../utils/dom.js';
import { router } from '../app/router.js';
import { store } from '../app/state.js';
import { icons } from '../utils/icons.js';
import { createBrandLogo } from '../components/BrandLogo.js';
import { createIcon } from '../components/Icon.js';

export function createLandingPage() {
  const container = createElement('div', { className: 'landing-page page-container' });

  const state = store.getState();
  const hasIdentity = Boolean(state.student?.name);

  // =========================================================================
  // 1. HERO SECTION
  // =========================================================================
  const heroSection = createElement('section', {
    className: 'product-hero-section',
    children: [
      createElement('div', {
        className: 'product-hero-header',
        children: [
          createElement('div', {
            className: 'hero-badge-group',
            style: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' },
            children: [
              createElement('span', {
                className: 'badge badge-primary',
                text: 'INTERACTIVE CYBERSECURITY LEARNING'
              }),
              createElement('span', {
                className: 'badge badge-outline',
                text: 'SMK TJKT • KELAS XI'
              })
            ]
          }),
          createElement('h1', {
            className: 'product-hero-title',
            text: 'Belajar Intrusion Detection System melalui investigasi, bukti, dan pengambilan keputusan.'
          }),
          createElement('p', {
            className: 'product-hero-lead',
            text: 'Platform pembelajaran interaktif untuk membantu siswa SMK memahami IDS melalui pendekatan LAPS–Heuristik, analisis log nyata, triase alert, dan simulasi investigasi keamanan dalam sandbox lokal yang aman.'
          }),
          createElement('div', {
            className: 'product-hero-actions',
            children: [
              createElement('button', {
                className: 'btn btn-primary btn-lg',
                children: [
                  createElement('span', { text: hasIdentity ? 'Lanjutkan Pembelajaran' : 'Mulai Pembelajaran' }),
                  createElement('span', { html: icons.arrowRight || '→' })
                ],
                events: {
                  click: () => {
                    if (hasIdentity) {
                      router.navigate('/dashboard');
                    } else {
                      router.navigate('/identity');
                    }
                  }
                }
              }),
              createElement('button', {
                className: 'btn btn-outline btn-lg',
                children: [
                  createElement('span', { text: 'Lihat Alur Pembelajaran' })
                ],
                events: {
                  click: () => {
                    const el = document.getElementById('curriculum-progression');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      router.navigate('/learning-path');
                    }
                  }
                }
              })
            ]
          })
        ]
      })
    ]
  });

  // =========================================================================
  // 2. REALISTIC PRODUCT INTERFACE PREVIEW
  // =========================================================================
  const productPreviewSection = createElement('section', {
    className: 'product-preview-section',
    children: [
      createElement('div', {
        className: 'preview-container card',
        children: [
          // Preview Top Bar
          createElement('div', {
            className: 'preview-window-topbar',
            children: [
              createElement('div', {
                className: 'preview-window-dots',
                children: [
                  createElement('span', { className: 'dot dot-red' }),
                  createElement('span', { className: 'dot dot-yellow' }),
                  createElement('span', { className: 'dot dot-green' })
                ]
              }),
              createElement('span', {
                className: 'preview-window-title',
                text: 'ids-learning-lab // workstation-console'
              }),
              createElement('span', {
                className: 'badge badge-outline',
                text: 'SIMULASI AKTIF'
              })
            ]
          }),

          // Interactive Mode Switcher for Preview
          createProductPreviewViewer()
        ]
      })
    ]
  });

  // =========================================================================
  // 3. THE LEARNING PROBLEM SECTION
  // =========================================================================
  const problemSection = createElement('section', {
    className: 'product-problem-section',
    children: [
      createElement('div', {
        className: 'problem-card card',
        children: [
          createElement('span', {
            className: 'section-eyebrow',
            text: 'TANTANGAN PEMBELAJARAN'
          }),
          createElement('h2', {
            className: 'problem-title',
            text: 'Memahami IDS tidak cukup hanya dengan mengenali definisi atau menghafalkan jenis serangan.'
          }),
          createElement('p', {
            className: 'problem-desc',
            text: 'Dalam operasional keamanan jaringan sesungguhnya, seorang analis tidak diuji dari seberapa banyak istilah yang dihafal, melainkan kemampuannya membaca bukti log mentah, menghubungkan anomali dengan baseline jaringan, menyusun hipotesis yang dapat diverifikasi, dan mempertanggungjawabkan keputusan mitigasi.'
          }),
          createElement('div', {
            className: 'problem-points-grid',
            children: [
              {
                title: 'Bukan Menghafal Teori Pasif',
                text: 'Beralih dari sekadar membaca slide materi menuju interaksi langsung dengan artefak telemetri Suricata dan Snort.'
              },
              {
                title: 'Menguji Validitas Bukti',
                text: 'Membedakan lalu lintas jaringan normal dari serangan siber nyata tanpa terjebak peringatan palsu (False Positive).'
              },
              {
                title: 'Pengambilan Keputusan Terukur',
                text: 'Melatih kemampuan berpikir kritis siswa melalui kerangka Logan Avenue Problem Solving (LAPS)–Heuristik.'
              }
            ].map(point => createElement('div', {
              className: 'problem-point-item',
              children: [
                createElement('h4', { text: point.title }),
                createElement('p', { text: point.text })
              ]
            }))
          })
        ]
      })
    ]
  });

  // =========================================================================
  // 4. LAPS–HEURISTIK METHODOLOGY SECTION
  // =========================================================================
  const lapsSection = createElement('section', {
    className: 'product-laps-section',
    children: [
      createElement('div', {
        className: 'section-header-centered',
        children: [
          createElement('span', { className: 'section-eyebrow', text: 'KERANGKA KOGNITIF' }),
          createElement('h2', { className: 'section-title', text: 'Pendekatan LAPS–Heuristik' }),
          createElement('p', {
            className: 'section-lead',
            text: 'Empat tahap pemecahan masalah dengan pertanyaan heuristik yang berperan sebagai jangkar berpikir (cognitive anchor) siswa di setiap sesi investigasi.'
          })
        ]
      }),
      createElement('div', {
        className: 'laps-stages-grid',
        children: [
          {
            num: '01',
            stage: 'MEMAHAMI MASALAH',
            question: 'Apa masalahnya?',
            desc: 'Siswa mengamati anomali lalu lintas, membandingkan pola komunikasi terhadap baseline normal, dan mengidentifikasi bukti objektif awal.',
            activity: 'Sensor Placement & Baseline Analysis'
          },
          {
            num: '02',
            stage: 'MERENCANAKAN PEMECAHAN',
            question: 'Adakah alternatif pemecahan masalah?',
            desc: 'Siswa merumuskan hipotesis kerja, mengevaluasi trade-off Signature-Based vs Anomaly-Based, serta membedah struktur rule pendeteksi.',
            activity: 'Rule Engineering & Hypothesis Framing'
          },
          {
            num: '03',
            stage: 'MELAKSANAKAN RENCANA',
            question: 'Bagaimana sebaiknya mengerjakannya?',
            desc: 'Siswa bertindak sebagai analis SOC untuk melakukan triase alert nyata dengan mengklasifikasikan True Positive, False Positive, atau Need More Evidence.',
            activity: 'Alert Triage & Evidence Correlation'
          },
          {
            num: '04',
            stage: 'MENINJAU KEMBALI',
            question: 'Apakah solusi ini tepat? Bagaimana kita bisa mengeceknya?',
            desc: 'Siswa memvalidasi temuan melalui bendera CTF, merumuskan rekomendasi mitigasi teknis preventif, dan merefleksikan proses berpikirnya.',
            activity: 'Blue-Team CTF & Mitigation Reflection'
          }
        ].map(stage => createElement('div', {
          className: 'laps-stage-card card',
          children: [
            createElement('div', {
              className: 'laps-card-header',
              children: [
                createElement('span', { className: 'laps-stage-num', text: stage.num }),
                createElement('span', { className: 'badge badge-primary', text: stage.stage })
              ]
            }),
            createElement('blockquote', {
              className: 'laps-heuristic-prompt',
              text: `"${stage.question}"`
            }),
            createElement('p', {
              className: 'laps-stage-desc',
              text: stage.desc
            }),
            createElement('div', {
              className: 'laps-activity-badge',
              children: [
                createElement('span', { className: 'text-caption', text: 'AKTIVITAS KUNCI:' }),
                createElement('strong', { text: stage.activity })
              ]
            })
          ]
        }))
      })
    ]
  });

  // =========================================================================
  // 5. LEARNING EXPERIENCE PROGRESSION (Roadmap)
  // =========================================================================
  const progressionSection = createElement('section', {
    id: 'curriculum-progression',
    className: 'product-progression-section',
    children: [
      createElement('div', {
        className: 'section-header-centered',
        children: [
          createElement('span', { className: 'section-eyebrow', text: 'STRUKTUR KURIKULUM' }),
          createElement('h2', { className: 'section-title', text: 'Alur Pengalaman Belajar Bertahap' }),
          createElement('p', {
            className: 'section-lead',
            text: 'Silabus terstruktur dari pengenalan konsep dasar hingga penanggulangan insiden keamanan siber berbasis kasus nyata.'
          })
        ]
      }),
      createElement('div', {
        className: 'progression-timeline',
        children: [
          {
            badge: 'DIAGNOSTIK',
            title: 'Pre-Test: Asesmen Berpikir Kritis Awal',
            objective: 'Mengukur pemahaman awal arsitektur jaringan dan penalaran logika sebelum intervensi pembelajaran.',
            activity: '10 Pertanyaan Diagnostik Penalaran Keamanan',
            duration: '15 Menit',
            route: '/pre-test'
          },
          {
            badge: 'PERTEMUAN 01',
            title: 'Memahami Masalah — Sensor IDS & Baseline Jaringan',
            objective: 'Menganalisis perbedaan NIDS vs HIDS, topologi penempatan sensor (SPAN port vs TAP), dan ekstraksi bukti log mentah.',
            activity: 'Inspeksi Paket Jaringan & Identifikasi Anomali',
            duration: '25 Menit',
            route: '/meeting/1'
          },
          {
            badge: 'PERTEMUAN 02',
            title: 'Merencanakan Solusi — Strategi Deteksi & Rule IDS',
            objective: 'Membandingkan pendekatan deteksi, memahami sintaks rule Snort/Suricata, dan menyusun hipotesis pertahanan teruji.',
            activity: 'Rekayasa Rule & Perumusan Hipotesis',
            duration: '25 Menit',
            route: '/meeting/2'
          },
          {
            badge: 'PERTEMUAN 03',
            title: 'Melaksanakan Rencana — SOC Alert Triage Console',
            objective: 'Mengevaluasi alert keamanan nyata dalam 7 konteks industri: menentukan True Positive, False Positive, atau Need More Evidence.',
            activity: 'Triase Alert Real-Case & Korelasi Multi-Evidence',
            duration: '30 Menit',
            route: '/meeting/3'
          },
          {
            badge: 'PERTEMUAN 04',
            title: 'Meninjau Kembali — Blue-Team CTF & Mitigasi',
            objective: 'Menginvestigasi insiden keamanan multi-timestamp, membuktikan temuan dengan security flag, serta menyusun mitigasi pertahanan.',
            activity: 'Investigasi Terminal Terpandu & Refleksi Metakognisi',
            duration: '35 Menit',
            route: '/meeting/4'
          },
          {
            badge: 'EVALUASI',
            title: 'Post-Test: Pengukuran Peningkatan Kognitif',
            objective: 'Mengevaluasi peningkatan keterampilan berpikir kritis siswa dan menghitung Normalized Gain skor secara objektif.',
            activity: '10 Pertanyaan Evaluasi Penalaran Lanjutan',
            duration: '15 Menit',
            route: '/post-test'
          }
        ].map((step) => createElement('div', {
          className: 'progression-step-card card',
          children: [
            createElement('div', {
              className: 'step-meta-row',
              children: [
                createElement('span', { className: 'badge badge-primary', text: step.badge }),
                createElement('span', { className: 'text-caption', text: `Estimasi: ${step.duration}` })
              ]
            }),
            createElement('h3', { className: 'step-title', text: step.title }),
            createElement('p', { className: 'step-objective', text: step.objective }),
            createElement('div', {
              className: 'step-footer-row',
              children: [
                createElement('span', { className: 'step-activity-tag', text: step.activity }),
                createElement('button', {
                  className: 'btn btn-outline btn-sm',
                  text: 'Buka Modul →',
                  events: {
                    click: () => router.navigate(step.route)
                  }
                })
              ]
            })
          ]
        }))
      })
    ]
  });

  // =========================================================================
  // 6. PRODUCT CAPABILITIES SECTION
  // =========================================================================
  const capabilitiesSection = createElement('section', {
    className: 'product-capabilities-section',
    children: [
      createElement('div', {
        className: 'section-header-centered',
        children: [
          createElement('span', { className: 'section-eyebrow', text: 'KEMAMPUAN PLATFORM' }),
          createElement('h2', { className: 'section-title', text: 'Fasilitas Pembelajaran yang Terimplementasi' }),
          createElement('p', {
            className: 'section-lead',
            text: 'Seluruh fitur di bawah ini telah terpasang, terhubung dengan state management lokal, dan siap digunakan siswa.'
          })
        ]
      }),
      createElement('div', {
        className: 'capabilities-grid',
        children: [
          {
            title: 'Analisis Log Interaktif',
            desc: 'Siswa memeriksa log Suricata dan Snort dengan nomor baris, penyorotan sintaks IP/timestamp/severity, pencarian teks, dan penyaringan berbasis kata kunci.'
          },
          {
            title: 'Penalaran Berbasis Bukti',
            desc: 'Siswa menandai baris bukti objektif dan menghubungkannya dengan hipotesis investigasi sebelum mengambil kesimpulan.'
          },
          {
            title: 'Konsol Triase Alert SOC',
            desc: 'Siswa mengklasifikasikan insiden ke dalam True Positive (serangan valid), False Positive (aktivitas sah), atau Need More Evidence (butuh data tambahan).'
          },
          {
            title: 'Sandbox Blue-Team CTF',
            desc: 'Siswa memecahkan 30 tantangan keamanan siber berbasis insiden nyata (CISA, NVD) melalui terminal simulasi yang 100% aman dan berjalan di browser.'
          },
          {
            title: 'Pelacakan Progres Otentik',
            desc: 'Progres dihitung murni dari penyelesaian aktivitas nyata, modul pertemuan, pre-test, dan tantangan CTF yang tersimpan di LocalStorage peramban.'
          },
          {
            title: 'Mode Penelitian & Ekspor Data',
            desc: 'Menyediakan rekaman telemetri terperinci (timestamp interaksi, jawaban, hints) yang dapat diekspor ke CSV/JSON untuk keperluan pengujian instrumen skripsi.'
          }
        ].map(cap => createElement('div', {
          className: 'capability-card card',
          children: [
            createElement('h4', { className: 'capability-title', text: cap.title }),
            createElement('p', { className: 'capability-desc', text: cap.desc })
          ]
        }))
      })
    ]
  });

  // =========================================================================
  // 7. CLOSING SYNTHESIS & CALL TO ACTION
  // =========================================================================
  const ctaSection = createElement('section', {
    className: 'product-cta-section',
    children: [
      createElement('div', {
        className: 'cta-card card',
        children: [
          createElement('h2', {
            className: 'cta-title',
            text: 'Siap Mengembangkan Keterampilan Investigasi Keamanan Siber?'
          }),
          createElement('p', {
            className: 'cta-lead',
            text: 'Mulai dengan memahami masalah. Lanjutkan dengan menyusun strategi. Uji keputusan melalui investigasi. Dan tinjau kembali setiap solusi berdasarkan bukti.'
          }),
          createElement('div', {
            className: 'cta-actions',
            children: [
              createElement('button', {
                className: 'btn btn-primary btn-lg',
                style: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
                children: [
                  createElement('span', { text: hasIdentity ? 'Masuk ke Dashboard Pembelajaran' : 'Mulai Pembelajaran Sekarang' }),
                  createIcon({ name: 'arrowRight', size: 16 })
                ],
                events: {
                  click: () => router.navigate(hasIdentity ? '/dashboard' : '/identity')
                }
              })
            ]
          })
        ]
      })
    ]
  });

  // =========================================================================
  // 8. PROFESSIONAL EDITORIAL FOOTER
  // =========================================================================
  const footerSection = createElement('footer', {
    className: 'product-footer',
    children: [
      createElement('div', {
        className: 'footer-main-row',
        children: [
          createElement('div', {
            className: 'footer-brand-col',
            children: [
              createBrandLogo({ variant: 'primary', size: 'md', href: '/' }),
              createElement('p', {
                className: 'footer-brand-sub',
                style: { marginTop: '0.75rem' },
                text: 'Platform pembelajaran interaktif Intrusion Detection System berbasis LAPS–Heuristik untuk siswa SMK TJKT.'
              }),
              createElement('p', {
                className: 'text-caption',
                text: 'Penelitian Skripsi S1 Pendidikan Ilmu Komputer • 100% Client-Side Sandbox'
              })
            ]
          }),
          createElement('div', {
            className: 'footer-nav-col',
            children: [
              createElement('span', { className: 'footer-nav-heading', text: 'NAVIGASI UTAMA' }),
              createElement('ul', {
                className: 'footer-links-list',
                children: [
                  createFooterLink('Alur Pembelajaran', '/learning-path'),
                  createFooterLink('Kasus CTF', '/ctf'),
                  createFooterLink('Klasemen Siswa', '/leaderboard'),
                  createFooterLink('Metodologi & Riset', '/research')
                ]
              })
            ]
          }),
          createElement('div', {
            className: 'footer-nav-col',
            children: [
              createElement('span', { className: 'footer-nav-heading', text: 'PORTAL EVALUASI' }),
              createElement('ul', {
                className: 'footer-links-list',
                children: [
                  createFooterLink('Portal Administrator', '/admin'),
                  createFooterLink('Login Pengajar', '/admin/login'),
                  createFooterLink('Pengaturan & Ekspor', '/settings')
                ]
              })
            ]
          })
        ]
      }),
      createElement('div', {
        className: 'footer-bottom-row',
        children: [
          createElement('span', {
            className: 'text-caption',
            text: '© 2026 IDS Learning Lab. Dikembangkan untuk keperluan riset pendidikan vokasi. Bebas dari ketergantungan API pihak ketiga.'
          })
        ]
      })
    ]
  });

  container.appendChild(heroSection);
  container.appendChild(productPreviewSection);
  container.appendChild(problemSection);
  container.appendChild(lapsSection);
  container.appendChild(progressionSection);
  container.appendChild(capabilitiesSection);
  container.appendChild(ctaSection);
  container.appendChild(footerSection);

  return container;
}

/**
 * Creates an interactive tabbed interface showing realistic previews
 * of the 5 core platform workflows: Learning Path, Log Analysis, Evidence Reasoning, Alert Triage, and CTF.
 */
function createProductPreviewViewer() {
  const container = createElement('div', { className: 'preview-interactive-wrapper' });

  let activeTab = 'logs';

  const tabs = [
    { id: 'logs', label: '01. Analisis Log' },
    { id: 'evidence', label: '02. Penalaran Bukti' },
    { id: 'triage', label: '03. Triase Alert SOC' },
    { id: 'ctf', label: '04. Blue-Team CTF' },
    { id: 'curriculum', label: '05. Alur Belajar' }
  ];

  const tabNav = createElement('div', {
    className: 'preview-tab-nav',
    children: tabs.map(tab => createElement('button', {
      className: `preview-tab-btn ${tab.id === activeTab ? 'active' : ''}`,
      text: tab.label,
      events: {
        click: () => {
          activeTab = tab.id;
          container.querySelectorAll('.preview-tab-btn').forEach((btn, idx) => {
            btn.classList.toggle('active', tabs[idx].id === activeTab);
          });
          renderPreviewContent();
        }
      }
    }))
  });

  const contentWrap = createElement('div', { className: 'preview-tab-content' });

  function renderPreviewContent() {
    contentWrap.innerHTML = '';

    if (activeTab === 'logs') {
      contentWrap.appendChild(createElement('div', {
        className: 'preview-display-box',
        children: [
          createElement('div', {
            className: 'preview-soc-terminal',
            children: [
              createElement('div', {
                className: 'terminal-header',
                children: [
                  createElement('span', { className: 'terminal-title', text: 'sensor-ids-promiscuous.log [SNORT / SURICATA NIDS]' }),
                  createElement('span', { className: 'badge badge-primary', text: 'FILTER: ATTACK DETECTED' })
                ]
              }),
              createElement('div', {
                className: 'terminal-screen',
                children: [
                  createLogLinePreview('08:14:02.102', '[ALERT]', 'ET SCAN Nmap Scripting Engine SYN Sweep', '192.168.1.45:51201 -> 192.168.1.10:80', 'hl-danger'),
                  createLogLinePreview('08:14:08.441', '[ALERT]', 'ET WEB_SERVER Apache Log4j JNDI Injection Attempt', '10.0.0.14:38902 -> 192.168.1.15:8080', 'hl-danger'),
                  createLogLinePreview('08:14:15.019', '[NOTICE]', 'HTTP GET /api/v1/auth/login 200 OK (Legitimate Auth)', '192.168.1.88:44210 -> 192.168.1.10:443', 'hl-success'),
                  createLogLinePreview('08:14:22.880', '[WARN]', 'ET POLICY Inbound SSH Multiple Auth Failures (38 req/s)', '172.16.5.20:41029 -> 192.168.1.22:22', 'hl-warning')
                ]
              })
            ]
          })
        ]
      }));
    } else if (activeTab === 'evidence') {
      contentWrap.appendChild(createElement('div', {
        className: 'preview-display-box',
        children: [
          createElement('div', {
            className: 'preview-evidence-card card',
            children: [
              createElement('span', { className: 'badge badge-outline', text: 'MATRIKS BUKTI & HIPOTESIS' }),
              createElement('h4', { text: 'Hipotesis: Serangan Brute-Force SSH Terkoordinasi' }),
              createElement('p', {
                className: 'text-muted',
                text: 'Siswa menghubungkan temuan log kegagalan autentikasi berulang dengan IP asal yang sama sebelum membuat keputusan blokir firewall.'
              }),
              createElement('div', {
                className: 'preview-evidence-tags',
                children: [
                  createElement('span', { className: 'badge badge-success', text: 'Bukti 1: 38 Auth Failures / Detik' }),
                  createElement('span', { className: 'badge badge-success', text: 'Bukti 2: Target Port 22 (SSH)' }),
                  createElement('span', { className: 'badge badge-success', text: 'Bukti 3: Single Source IP 172.16.5.20' })
                ]
              })
            ]
          })
        ]
      }));
    } else if (activeTab === 'triage') {
      contentWrap.appendChild(createElement('div', {
        className: 'preview-display-box',
        children: [
          createElement('div', {
            className: 'preview-triage-card card',
            children: [
              createElement('span', { className: 'badge badge-primary', text: 'ALERT TRIAGE CONSOLE' }),
              createElement('h4', { text: 'Kasus Alert #03: Peringatan Eksekusi PowerShell Terenkripsi' }),
              createElement('p', {
                className: 'text-muted',
                text: 'Pilih klasifikasi yang tepat berdasarkan korelasi aktivitas sistem pencadangan server vs malware sungguhan:'
              }),
              createElement('div', {
                className: 'triage-btn-group',
                children: [
                  createElement('button', { className: 'triage-action-btn selected-tp', text: 'TRUE POSITIVE' }),
                  createElement('button', { className: 'triage-action-btn', text: 'FALSE POSITIVE' }),
                  createElement('button', { className: 'triage-action-btn', text: 'NEED MORE EVIDENCE' })
                ]
              }),
              createElement('p', {
                className: 'text-caption',
                text: 'Status: Keputusan terverifikasi. Alert terbukti merupakan malware Obfuscated Payload yang menyamarkan diri sebagai skrip backup.'
              })
            ]
          })
        ]
      }));
    } else if (activeTab === 'ctf') {
      contentWrap.appendChild(createElement('div', {
        className: 'preview-display-box',
        children: [
          createElement('div', {
            className: 'preview-ctf-card card',
            children: [
              createElement('span', { className: 'badge badge-primary', text: 'BLUE-TEAM CTF SANDBOX' }),
              createElement('h4', { text: 'Kasus: Log4j Remote Code Execution Forensics' }),
              createElement('p', {
                className: 'text-muted',
                text: 'Ekstrak payload berbahaya dari log, dekode URL encoded JNDI string, dan submit flag untuk membuktikan temuan investigasi:'
              }),
              createElement('div', {
                className: 'flag-input-row',
                children: [
                  createElement('input', {
                    className: 'flag-input',
                    value: 'FLAG{LOG4J_JNDI_LDAP_EXPLOIT_VERIFIED}',
                    readOnly: true
                  }),
                  createElement('button', {
                    className: 'btn btn-primary',
                    text: 'Verifikasi Flag'
                  })
                ]
              })
            ]
          })
        ]
      }));
    } else if (activeTab === 'curriculum') {
      contentWrap.appendChild(createElement('div', {
        className: 'preview-display-box',
        children: [
          createElement('div', {
            className: 'preview-curriculum-grid',
            children: [
              createElement('div', {
                className: 'card',
                children: [
                  createElement('span', { className: 'badge badge-success', text: 'TAHAP 01: SELESAI' }),
                  createElement('h5', { text: 'Memahami Masalah — Sensor IDS' }),
                  createElement('p', { className: 'text-caption', text: 'Nilai Analisis: 100% • Waktu: 22 Menit' })
                ]
              }),
              createElement('div', {
                className: 'card',
                children: [
                  createElement('span', { className: 'badge badge-primary', text: 'TAHAP 02: AKTIF' }),
                  createElement('h5', { text: 'Merencanakan Solusi — Rule Snort' }),
                  createElement('p', { className: 'text-caption', text: 'Progres Investigasi: 65% Selesai' })
                ]
              })
            ]
          })
        ]
      }));
    }
  }

  renderPreviewContent();

  container.appendChild(tabNav);
  container.appendChild(contentWrap);
  return container;
}

function createLogLinePreview(ts, tag, msg, ips, hlClass) {
  return createElement('div', {
    className: 'log-line',
    children: [
      createElement('span', { className: 'log-ts', text: ts }),
      createElement('span', { className: `log-tag ${hlClass}`, text: tag }),
      createElement('span', { className: 'cmd-text', text: ` ${msg} ` }),
      createElement('span', { className: 'log-ips', text: ips })
    ]
  });
}

function createFooterLink(text, path) {
  return createElement('li', {
    children: [
      createElement('a', {
        text,
        href: path,
        events: {
          click: (e) => {
            e.preventDefault();
            router.navigate(path);
          }
        }
      })
    ]
  });
}
