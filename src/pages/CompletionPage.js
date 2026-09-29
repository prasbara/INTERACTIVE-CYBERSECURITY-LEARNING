/**
 * Completion Page
 * Congratulates student on finishing all 4 meetings and assessments.
 * Shows summary and link to export data or return to dashboard.
 * Zero emojis, clean vector icons.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { exportLearnerDataJSON } from '../utils/download.js';
import { createIcon } from '../components/Icon.js';

export function createCompletionPage() {
  const container = createElement('div', { className: 'completion-page page-container' });
  const state = store.getState();
  const student = state.student || {};

  const card = createElement('div', {
    className: 'completion-card card',
    style: { textAlign: 'center', padding: '3rem 2rem' },
    children: [
      createElement('div', {
        className: 'completion-icon-wrap',
        style: {
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--surface-muted, #f3f4f6)',
          color: 'var(--security-green, #007a5a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          border: '2px solid var(--border)'
        },
        children: [
          createIcon({ name: 'award', size: 36 })
        ]
      }),
      createElement('h1', { text: 'Selamat! Pembelajaran Selesai' }),
      createElement('p', {
        className: 'completion-lead',
        text: `Hebat, ${student.name || 'Siswa TJKT'}! Anda telah menyelesaikan seluruh rangkaian kegiatan pembelajaran IDS berbasis LAPS–Heuristik.`
      }),
      createElement('div', {
        className: 'completion-stats-grid',
        children: [
          createElement('div', { className: 'stat-box', children: [createElement('span', { className: 'stat-val', text: `${state.scores?.pretest ?? '-'}%` }), createElement('span', { className: 'stat-label', text: 'Pre-Test' })] }),
          createElement('div', { className: 'stat-box', children: [createElement('span', { className: 'stat-val', text: `${state.scores?.posttest ?? '-'}%` }), createElement('span', { className: 'stat-label', text: 'Post-Test' })] }),
          createElement('div', { className: 'stat-box', children: [createElement('span', { className: 'stat-val', text: state.ctf?.solved ? 'Tuntas' : 'Sebagian' }), createElement('span', { className: 'stat-label', text: 'CTF Challenge' })] })
        ]
      }),
      createElement('div', {
        className: 'completion-actions',
        style: { display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.75rem' },
        children: [
          createElement('button', {
            className: 'btn btn-primary',
            style: { display: 'inline-flex', alignItems: 'center', gap: '0.45rem' },
            children: [
              createIcon({ name: 'download', size: 16 }),
              createElement('span', { text: 'Unduh Bukti Belajar (JSON)' })
            ],
            events: {
              click: () => exportLearnerDataJSON(state)
            }
          }),
          createElement('button', {
            className: 'btn btn-outline',
            style: { display: 'inline-flex', alignItems: 'center', gap: '0.45rem' },
            children: [
              createIcon({ name: 'fileText', size: 16 }),
              createElement('span', { text: 'Tinjau Portofolio LAPS' })
            ],
            events: {
              click: () => router.navigate('/review')
            }
          }),
          createElement('button', {
            className: 'btn btn-outline',
            style: { display: 'inline-flex', alignItems: 'center', gap: '0.45rem' },
            children: [
              createIcon({ name: 'trophy', size: 16 }),
              createElement('span', { text: 'Papan Peringkat' })
            ],
            events: {
              click: () => router.navigate('/leaderboard')
            }
          }),
          createElement('button', {
            className: 'btn btn-outline',
            style: { display: 'inline-flex', alignItems: 'center', gap: '0.45rem' },
            children: [
              createIcon({ name: 'home', size: 16 }),
              createElement('span', { text: 'Kembali ke Dashboard' })
            ],
            events: {
              click: () => router.navigate('/dashboard')
            }
          })
        ]
      })
    ]
  });

  container.appendChild(card);
  return container;
}

export default createCompletionPage;
