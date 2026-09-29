/**
 * Leaderboard Page (Klasemen SOC)
 * Honest Local-First Architecture:
 * When remote backend is not available, displays verified student record and
 * clearly reports that multi-user cohort rankings require backend synchronization.
 * Zero hardcoded / fake peers! Pure SVG icons.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { getGamificationStats } from '../modules/gamification/xpSystem.js';
import { calculateMeetingProgress } from '../modules/analytics/progressTracker.js';
import { createIcon } from '../components/Icon.js';

export function createLeaderboardPage() {
  const container = createElement('div', { className: 'leaderboard-page page-container' });

  let activeFilter = 'Global';

  function render() {
    container.innerHTML = '';
    const state = store.getState();
    const student = state.student || {};
    const gameStats = getGamificationStats();
    const completedMeetingsCount = [1, 2, 3, 4].filter(id => calculateMeetingProgress(id, state).completed).length;
    const ctfSolvedCount = state.ctf?.completedChallenges?.length || 0;

    // 1. Header Banner
    const headerCard = createElement('div', {
      className: 'leaderboard-hero card',
      children: [
        createElement('div', {
          className: 'hero-badges-row',
          children: [
            createElement('span', { className: 'badge badge-primary', text: 'KLASEMEN SOC' }),
            createElement('span', { className: 'badge badge-neutral', text: 'SMK XI TJKT' }),
            createElement('span', { className: 'badge badge-warning', text: 'MODE OFFLINE / LOCAL-FIRST' })
          ]
        }),
        createElement('h1', { text: 'Klasemen Prestasi & Investigasi' }),
        createElement('p', {
          className: 'text-muted',
          text: 'Peringkat dihitung dari akumulasi XP aktual melalui penyelesaian lab pemahaman, triase bukti, dan validasi kasus CTF.'
        })
      ]
    });

    // 2. Personal Ranking Summary Cards
    const summaryRow = createElement('div', {
      className: 'leaderboard-stats-grid',
      children: [
        createElement('div', {
          className: 'stat-compact-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'STATUS KLASEMEN' }),
            createElement('span', { className: 'stat-number text-primary', text: '#01 (Lokal)' }),
            createElement('span', { className: 'stat-sub', text: 'Sesi Aktif di Peramban Ini' })
          ]
        }),
        createElement('div', {
          className: 'stat-compact-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'TOTAL POIN XP' }),
            createElement('span', { className: 'stat-number text-accent', text: `${gameStats.xp} XP` }),
            createElement('span', { className: 'stat-sub', text: `Level: ${gameStats.level.name}` })
          ]
        }),
        createElement('div', {
          className: 'stat-compact-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'LENCANA KOMPETENSI' }),
            createElement('span', { className: 'stat-number', text: `${gameStats.badges.length}` }),
            createElement('span', { className: 'stat-sub', text: 'Lencana Terverifikasi' })
          ]
        }),
        createElement('div', {
          className: 'stat-compact-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'CTF TERPECAHKAN' }),
            createElement('span', { className: 'stat-number text-primary', text: `${ctfSolvedCount} / 30` }),
            createElement('span', { className: 'stat-sub', text: 'Kasus Keamanan Selesai' })
          ]
        })
      ]
    });

    // 3. Offline Mode Notice (Honest State)
    const offlineNotice = createElement('div', {
      className: 'alert alert-info',
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        margin: '1.5rem 0',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface-soft)',
        border: '1px solid var(--color-border)'
      },
      children: [
        createIcon({ name: 'info', size: 20 }),
        createElement('div', {
          children: [
            createElement('strong', { text: 'Informasi Sinkronisasi Multi-Pengguna: ' }),
            createElement('span', {
              text: 'Leaderboard kohort multi-siswa belum tersedia dalam mode offline (sinkronisasi backend server diperlukan untuk mengumpulkan data antar perangkat). Seluruh perolehan XP dan lencana di bawah ini bersumber langsung dari capaian belajar lokal Anda.'
            })
          ]
        })
      ]
    });

    // 4. Table Card with Category Filter
    const filterOptions = ['Global', 'Weekly', 'Monthly', 'Class', 'School'];

    const tableCard = createElement('div', {
      className: 'admin-table-card card',
      children: [
        createElement('div', {
          style: {
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          },
          children: [
            createElement('h3', { text: `Daftar Capaian Analis (${activeFilter})`, style: { margin: 0, fontSize: '1.15rem' } }),
            createElement('div', {
              className: 'admin-subnav-bar',
              children: filterOptions.map(label => createElement('button', {
                className: `admin-nav-tab ${activeFilter === label ? 'active' : ''}`,
                text: label,
                events: {
                  click: () => {
                    activeFilter = label;
                    render();
                  }
                }
              }))
            })
          ]
        }),
        createElement('div', {
          className: 'table-responsive-wrapper',
          children: [
            createElement('table', {
              className: 'admin-data-table',
              children: [
                createElement('thead', {
                  children: [
                    createElement('tr', {
                      children: [
                        createElement('th', { text: 'RANK', style: { width: '80px', textAlign: 'center' } }),
                        createElement('th', { text: 'STUDENT' }),
                        createElement('th', { text: 'XP', style: { textAlign: 'right' } }),
                        createElement('th', { text: 'LABS', style: { textAlign: 'center' } }),
                        createElement('th', { text: 'CTF', style: { textAlign: 'center' } }),
                        createElement('th', { text: 'BADGE', style: { textAlign: 'center' } })
                      ]
                    })
                  ]
                }),
                createElement('tbody', {
                  children: [
                    createElement('tr', {
                      style: { backgroundColor: 'var(--color-primary-soft)', fontWeight: '600' },
                      children: [
                        createElement('td', {
                          text: '#01',
                          style: { textAlign: 'center', fontFamily: 'var(--font-mono)' }
                        }),
                        createElement('td', {
                          children: [
                            createElement('span', { text: (student.name || 'Siswa Analis') + ' ' }),
                            createElement('span', { className: 'badge badge-primary', text: 'Anda (Sesi Ini)' }),
                            createElement('div', {
                              className: 'text-muted text-xs',
                              style: { fontWeight: 'normal' },
                              text: `${student.className || 'XI TJKT'} • No. ${student.attendanceNumber || '-'}`
                            })
                          ]
                        }),
                        createElement('td', {
                          text: `${gameStats.xp} XP`,
                          style: { textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }
                        }),
                        createElement('td', {
                          text: `${completedMeetingsCount} / 4`,
                          style: { textAlign: 'center' }
                        }),
                        createElement('td', {
                          text: `${ctfSolvedCount} / 30`,
                          style: { textAlign: 'center' }
                        }),
                        createElement('td', {
                          text: `${gameStats.badges.length} Lencana`,
                          style: { textAlign: 'center' }
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });

    container.appendChild(headerCard);
    container.appendChild(summaryRow);
    container.appendChild(offlineNotice);
    container.appendChild(tableCard);
  }

  store.subscribe(() => {
    render();
  });

  render();
  return container;
}

export default createLeaderboardPage;
