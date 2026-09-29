/**
 * Profile Page (Profil Siswa & Portofolio Analis Keamanan)
 * Consolidates student identity, earned badges, level progression, and activity summary.
 * Vector SVG iconography, clean typography, zero emojis.
 */

import { createElement, escapeHtml } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { getGamificationStats } from '../modules/gamification/xpSystem.js';
import { calculateOverallProgress } from '../modules/analytics/progressTracker.js';
import { renderIcon, icons } from '../utils/icons.js';
import { createIcon } from '../components/Icon.js';

export function createProfilePage() {
  const container = createElement('div', { className: 'profile-page page-container' });

  function render() {
    container.innerHTML = '';
    const state = store.getState();
    const student = state.student || {};
    const gameStats = getGamificationStats();
    const overall = calculateOverallProgress();
    const completedMeetingsCount = [
      state.progress?.meeting1,
      state.progress?.meeting2,
      state.progress?.meeting3,
      state.progress?.meeting4
    ].filter(Boolean).length;
    const completedCtfsCount = state.ctf?.completedChallenges?.length || 0;

    // 1. Profile Header Hero
    const heroCard = createElement('div', {
      className: 'profile-hero card',
      children: [
        createElement('div', {
          className: 'profile-header-flex',
          style: { display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' },
          children: [
            createElement('div', {
              className: 'profile-avatar-circle',
              style: {
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'var(--deep-purple, #1c061e)',
                border: '2px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(28, 6, 30, 0.25)'
              },
              children: [
                student.name
                  ? createElement('span', { text: student.name.charAt(0).toUpperCase() })
                  : createIcon({ name: 'user', size: 32, className: 'avatar-svg' })
              ]
            }),
            createElement('div', {
              style: { flex: 1, minWidth: '250px' },
              children: [
                createElement('div', {
                  style: { display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center' },
                  children: [
                    createElement('span', { className: 'badge badge-primary', text: gameStats.level.name }),
                    createElement('span', { className: 'badge badge-outline', text: `Level ${gameStats.level.current}` })
                  ]
                }),
                createElement('h1', { text: student.name || 'Siswa SMK TJKT', style: { margin: '0 0 0.25rem 0' } }),
                createElement('p', {
                  className: 'text-muted',
                  style: { margin: 0 },
                  text: `Kelas: ${student.className || '-'} | No. Presensi: ${student.attendanceNumber || '-'} | Kode: ${student.classCode || 'LAB-TJKT'}`
                })
              ]
            }),
            createElement('div', {
              children: [
                createElement('button', {
                  className: 'btn btn-outline btn-sm',
                  style: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem' },
                  children: [
                    createIcon({ name: 'settings', size: 14 }),
                    createElement('span', { text: 'Edit Identitas' })
                  ],
                  events: { click: () => router.navigate('/identity') }
                })
              ]
            })
          ]
        })
      ]
    });
    container.appendChild(heroCard);

    // 2. Metrics Strip
    const metricsGrid = createElement('div', {
      className: 'profile-metrics-grid',
      style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0' },
      children: [
        createElement('div', {
          className: 'stat-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'Ketercapaian Alur' }),
            createElement('span', { className: 'stat-value text-primary', text: `${overall.percent}%` }),
            createElement('span', { className: 'stat-sub', text: `${completedMeetingsCount} dari 4 Pertemuan Selesai` })
          ]
        }),
        createElement('div', {
          className: 'stat-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'Total XP Belajar' }),
            createElement('span', { className: 'stat-value text-success', text: `${gameStats.xp} XP` }),
            createElement('span', { className: 'stat-sub', text: `${gameStats.nextLevelXP - gameStats.xp} XP menuju Level Berikutnya` })
          ]
        }),
        createElement('div', {
          className: 'stat-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'Kasus CTF Terpecahkan' }),
            createElement('span', { className: 'stat-value text-warning', text: `${completedCtfsCount} Kasus` }),
            createElement('span', { className: 'stat-sub', text: 'Bank Kasus Nyata Terverifikasi' })
          ]
        }),
        createElement('div', {
          className: 'stat-card card',
          children: [
            createElement('span', { className: 'stat-label', text: 'Evaluasi Kognitif' }),
            createElement('span', {
              className: 'stat-value text-info',
              text: state.scores?.posttest !== null ? `${state.scores.posttest}%` : (state.scores?.pretest !== null ? `${state.scores.pretest}% (Pre)` : 'Belum Mulai')
            }),
            createElement('span', { className: 'stat-sub', text: state.scores?.posttest !== null ? 'Post-Test Selesai' : 'Perlu Evaluasi Akhir' })
          ]
        })
      ]
    });
    container.appendChild(metricsGrid);

    // 3. Badges Showcase (Geometric SVG Badges)
    const badgesCard = createElement('div', {
      className: 'profile-badges-card card',
      children: [
        createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' },
          children: [
            createIcon({ name: 'award', size: 20 }),
            createElement('h3', { text: 'Koleksi Lencana Kompetensi Analis Keamanan', style: { margin: 0 } })
          ]
        }),
        createElement('p', {
          className: 'text-muted text-sm',
          text: 'Lencana diberikan secara otomatis ketika Anda mendemonstrasikan keahlian analisis bukti log, perumusan hipotesis, dan triase insiden.'
        }),
        createElement('div', {
          className: 'badges-showcase-grid',
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.25rem' },
          children: gameStats.allBadges.map(b => createElement('div', {
            className: `badge-item-card card ${b.isUnlocked ? 'badge-unlocked' : 'badge-locked'}`,
            style: {
              padding: '1.25rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: b.isUnlocked ? '1px solid var(--success, #007a5a)' : '1px dashed var(--border)',
              background: b.isUnlocked ? 'rgba(0, 122, 90, 0.04)' : 'var(--surface)'
            },
            children: [
              createElement('div', {
                className: `badge-emblem-wrap ${b.isUnlocked ? 'badge-emblem-active' : 'badge-emblem-inactive'}`,
                style: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  background: b.isUnlocked ? 'var(--deep-purple, #1c061e)' : 'var(--surface-muted, #f3f4f6)',
                  color: b.isUnlocked ? '#34d399' : 'var(--text-muted, #9ca3af)',
                  border: b.isUnlocked ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid var(--border)'
                },
                html: renderIcon(b.iconName || 'shield', { size: 24 })
              }),
              createElement('span', {
                className: 'badge-tier-tag text-caption',
                style: {
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem'
                },
                text: b.tier || 'COMPETENCY'
              }),
              createElement('strong', { text: b.name, style: { fontSize: '0.95rem', marginBottom: '0.25rem' } }),
              createElement('p', {
                text: b.description,
                style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.75rem', lineHeight: '1.3' }
              }),
              createElement('span', {
                className: `badge ${b.isUnlocked ? 'badge-success' : 'badge-subtle'}`,
                style: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' },
                children: [
                  createIcon({ name: b.isUnlocked ? 'check' : 'lock', size: 12 }),
                  createElement('span', { text: b.isUnlocked ? 'TERBUKA' : 'TERKUNCI' })
                ]
              })
            ]
          }))
        })
      ]
    });
    container.appendChild(badgesCard);
  }

  render();
  store.subscribe(render);
  return container;
}

export default createProfilePage;
