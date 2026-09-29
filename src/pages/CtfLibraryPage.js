/**
 * Real-World Case CTF Challenge Bank Library Page
 * Interactive catalog of 30 cybersecurity incident challenges derived from
 * open-source security advisories (CISA, NVD, MITRE ATT&CK).
 */

import { createElement, escapeHtml } from '../utils/dom.js';
import { router } from '../app/router.js';
import { store } from '../app/state.js';
import { REAL_CASE_CHALLENGES, filterChallenges, getChallengeStats } from '../data/ctf/realCases.js';
import { CTF_CATEGORIES } from '../data/ctf/categories.js';
import { CTF_DIFFICULTY_LEVELS } from '../data/ctf/difficulty.js';
import { isCtfSolved } from '../modules/ctf/ctfEngine.js';
import { renderIcon } from '../utils/icons.js';

export function createCtfLibraryPage() {
  const container = createElement('div', { className: 'ctf-library-page page-container' });

  // Local filter state
  let currentCategory = 'all';
  let currentDifficulty = 'all';
  let currentStatus = 'all';
  let currentSearch = '';

  function render() {
    container.innerHTML = '';

    const state = store.getState();
    const completedChallenges = state.ctf?.completedChallenges || [];
    const stats = getChallengeStats(completedChallenges);

    // 1. Header & Research Disclaimer Banner
    const headerSection = createElement('div', {
      className: 'ctf-header-hero card',
      children: [
        createElement('div', {
          className: 'ctf-hero-badges',
          children: [
            createElement('span', { className: 'badge badge-primary', text: 'Real-World Case CTF System' }),
            createElement('span', { className: 'badge badge-success', text: '100% Synthetic Local Sandbox' }),
            createElement('span', { className: 'badge badge-outline', text: 'Open-Source Threat Intelligence' })
          ]
        }),
        createElement('h1', { text: 'Bank Kasus Nyata & Investigasi Insiden Keamanan (CTF)' }),
        createElement('p', {
          className: 'ctf-hero-description',
          text: 'Pelajari investigasi insiden siber yang diadaptasi dari insiden nyata terverifikasi (CISA Advisories, NIST NVD, MITRE ATT&CK). Seluruh simulasi berjalan di dataset dan telemetri lokal buatan yang aman—tanpa pernah menyerang target atau infrastruktur publik nyata.'
        }),
        // Safety Warning Box
        createElement('div', {
          className: 'alert alert-info ctf-safety-box',
          children: [
            createElement('strong', { text: 'Prinsip Keamanan & Etika: ' }),
            createElement('span', {
              text: 'Aktivitas eksplorasi hanya dilakukan pada evidence pack sintetis (auth.log, access.log, network.log, json) di dalam browser Anda. Platform ini fokus pada kemampuan Blue Team: deteksi, korelasi bukti, analisis akar masalah, dan perumusan mitigasi presisi.'
            })
          ]
        })
      ]
    });
    container.appendChild(headerSection);

    // 2. Metrics & Gamification Stats Strip
    const statsStrip = createElement('div', {
      className: 'ctf-stats-grid',
      children: [
        createElement('div', {
          className: 'stat-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'Total Kasus Nyata' }),
            createElement('span', { className: 'stat-value', text: `${stats.total} Kasus` }),
            createElement('span', { className: 'stat-sub', text: '6 Kategori Vektor Serangan' })
          ]
        }),
        createElement('div', {
          className: 'stat-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'Kasus Terpecahkan' }),
            createElement('span', { className: 'stat-value text-success', text: `${stats.completed} / ${stats.total}` }),
            createElement('span', { className: 'stat-sub', text: `${stats.completionPercentage}% Ketercapaian` })
          ]
        }),
        createElement('div', {
          className: 'stat-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'Total XP Diperoleh' }),
            createElement('span', { className: 'stat-value text-primary', text: `${stats.earnedXp} XP` }),
            createElement('span', { className: 'stat-sub', text: `Dari ${stats.totalXp} Total XP Tersedia` })
          ]
        })
      ]
    });
    container.appendChild(statsStrip);

    // 3. Filter & Search Controls Bar
    const filterCard = createElement('div', {
      className: 'ctf-filter-card card',
      children: [
        createElement('div', {
          className: 'ctf-search-row',
          children: [
            createElement('input', {
              type: 'text',
              className: 'form-control ctf-search-input',
              placeholder: 'Cari berdasarkan nama kasus, CVE, teknologi (OpenSSH, Log4j, S3), atau MITRE...',
              value: currentSearch,
              events: {
                input: (e) => {
                  currentSearch = e.target.value;
                  updateCardGrid();
                }
              }
            })
          ]
        }),
        createElement('div', {
          className: 'ctf-filter-pills-row',
          children: [
            // Category Select
            createElement('div', {
              className: 'filter-group',
              children: [
                createElement('label', { text: 'Kategori:' }),
                createElement('select', {
                  className: 'form-select',
                  value: currentCategory,
                  events: {
                    change: (e) => {
                      currentCategory = e.target.value;
                      updateCardGrid();
                    }
                  },
                  children: [
                    createElement('option', { value: 'all', text: 'Semua Kategori (6)' }),
                    ...Object.values(CTF_CATEGORIES).map(cat => 
                      createElement('option', { value: cat.id, text: `${cat.name}` })
                    )
                  ]
                })
              ]
            }),
            // Difficulty Select
            createElement('div', {
              className: 'filter-group',
              children: [
                createElement('label', { text: 'Tingkat Kesulitan:' }),
                createElement('select', {
                  className: 'form-select',
                  value: currentDifficulty,
                  events: {
                    change: (e) => {
                      currentDifficulty = e.target.value;
                      updateCardGrid();
                    }
                  },
                  children: [
                    createElement('option', { value: 'all', text: 'Semua Tingkat (4)' }),
                    ...Object.values(CTF_DIFFICULTY_LEVELS).map(d => 
                      createElement('option', { value: d.id, text: `${d.label} (+${d.baseXp} XP)` })
                    )
                  ]
                })
              ]
            }),
            // Status Select
            createElement('div', {
              className: 'filter-group',
              children: [
                createElement('label', { text: 'Status Selesai:' }),
                createElement('select', {
                  className: 'form-select',
                  value: currentStatus,
                  events: {
                    change: (e) => {
                      currentStatus = e.target.value;
                      updateCardGrid();
                    }
                  },
                  children: [
                    createElement('option', { value: 'all', text: 'Semua Status' }),
                    createElement('option', { value: 'uncompleted', text: 'Belum Selesai' }),
                    createElement('option', { value: 'completed', text: 'Telah Terpecahkan (Selesai)' })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    container.appendChild(filterCard);

    // 4. Challenge Cards Container
    const gridContainer = createElement('div', { className: 'ctf-challenges-grid' });
    container.appendChild(gridContainer);

    function updateCardGrid() {
      gridContainer.innerHTML = '';

      const filtered = filterChallenges({
        category: currentCategory,
        difficulty: currentDifficulty,
        searchQuery: currentSearch,
        status: currentStatus,
        completedIds: completedChallenges
      });

      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div class="empty-state card" style="grid-column: 1 / -1; text-align: center; padding: 2.5rem;">
            <div style="color: var(--text-muted); margin-bottom: 0.75rem;">${renderIcon('search', { size: 36 })}</div>
            <h3>Tidak Ada Kasus yang Cocok</h3>
            <p class="text-muted">Coba ubah kata kunci pencarian atau reset filter kategori/kesulitan.</p>
            <button class="btn btn-outline btn-sm" id="btn-reset-filters">Reset Filter</button>
          </div>
        `;
        const resetBtn = gridContainer.querySelector('#btn-reset-filters');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            currentCategory = 'all';
            currentDifficulty = 'all';
            currentStatus = 'all';
            currentSearch = '';
            render();
          });
        }
        return;
      }

      filtered.forEach(ch => {
        const isSolved = completedChallenges.includes(ch.id);
        const diffInfo = CTF_DIFFICULTY_LEVELS[ch.difficulty] || CTF_DIFFICULTY_LEVELS.beginner;
        const catInfo = CTF_CATEGORIES[ch.category] || { name: ch.category };

        const starsText = '★'.repeat(diffInfo.stars) + '☆'.repeat(4 - diffInfo.stars);

        const card = createElement('div', {
          className: `ctf-case-card card ${isSolved ? 'case-card-solved' : ''}`,
          children: [
            // Top badges row
            createElement('div', {
              className: 'case-card-header',
              children: [
                createElement('span', { className: 'case-code-badge', text: ch.id }),
                createElement('span', {
                  className: `badge ${ch.difficulty === 'beginner' ? 'badge-success' : ch.difficulty === 'intermediate' ? 'badge-info' : ch.difficulty === 'advanced' ? 'badge-warning' : 'badge-danger'}`,
                  text: `${diffInfo.label} ${starsText}`
                }),
                isSolved ? createElement('span', { className: 'badge badge-success', text: 'SOLVED' }) : null
              ].filter(Boolean)
            }),
            // Title & Category
            createElement('h3', { className: 'case-card-title', text: ch.title }),
            createElement('div', {
              className: 'case-card-category',
              children: [
                createElement('span', { className: 'category-pill', text: catInfo.name }),
                createElement('span', { className: 'tech-pill', text: ch.affectedTechnology.split(' on ')[0] })
              ]
            }),
            // Narrative snippet
            createElement('p', {
              className: 'case-card-narrative',
              text: ch.caseBrief.narrative.length > 120 ? ch.caseBrief.narrative.slice(0, 117) + '...' : ch.caseBrief.narrative
            }),
            // Meta info (Evidence count, estimated minutes, XP reward)
            createElement('div', {
              className: 'case-card-meta-row',
              children: [
                createElement('span', { className: 'meta-item', text: `${ch.evidencePack.length} Bukti Log` }),
                createElement('span', { className: 'meta-item', text: `${ch.questions.length} Pertanyaan` }),
                createElement('span', { className: 'meta-item', text: `${ch.estimatedMinutes} Menit` }),
                createElement('span', { className: 'meta-item text-primary font-bold', text: `+${ch.xpReward} XP` })
              ]
            }),
            // Footer CTA
            createElement('div', {
              className: 'case-card-footer',
              children: [
                createElement('button', {
                  className: `btn ${isSolved ? 'btn-outline' : 'btn-primary'} btn-block`,
                  text: isSolved ? 'Buka Hasil Investigasi' : 'Mulai Investigasi Kasus',
                  events: {
                    click: () => router.navigate(`/ctf/${ch.id}`)
                  }
                })
              ]
            })
          ]
        });

        gridContainer.appendChild(card);
      });
    }

    updateCardGrid();
  }

  render();
  store.subscribe(render);

  return container;
}
