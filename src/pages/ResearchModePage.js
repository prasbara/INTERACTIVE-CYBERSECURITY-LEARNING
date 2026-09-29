/**
 * Research Mode Page
 * Dedicated local dashboard for researcher / teacher to inspect learner telemetry,
 * pre-test/post-test comparative gains, and export structured datasets for thesis analysis.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { exportLearnerDataJSON, exportEventsCSV } from '../utils/download.js';
import { resetState } from '../app/storage.js';
import { openModal } from '../components/Modal.js';
import { showToast } from '../components/Toast.js';

export function createResearchModePage() {
  const container = createElement('div', { className: 'research-page page-container' });
  const state = store.getState();
  const student = state.student || {};
  const scores = state.scores || {};
  const events = state.analytics?.events || [];

  const notice = createElement('div', {
    className: 'alert alert-info research-banner',
    children: [
      createElement('strong', { text: 'Mode Riset Skripsi — Khusus Peneliti / Guru (Local Device Only): ' }),
      createElement('span', { text: 'Data telemetri tersimpan secara lokal dan dapat diekspor ke format JSON/CSV untuk pengolahan instrumen penelitian.' })
    ]
  });
  container.appendChild(notice);

  // Student Profile Card
  const profileCard = createElement('div', {
    className: 'research-section card',
    children: [
      createElement('h3', { text: 'Profil Responden Siswa' }),
      createElement('div', {
        className: 'profile-grid',
        children: [
          createElement('div', { children: [createElement('strong', { text: 'Nama: ' }), createElement('span', { text: student.name || 'Belum diisi' })] }),
          createElement('div', { children: [createElement('strong', { text: 'Kelas: ' }), createElement('span', { text: student.className || 'XI TJKT' })] }),
          createElement('div', { children: [createElement('strong', { text: 'No. Presensi: ' }), createElement('span', { text: student.attendanceNumber || '-' })] })
        ]
      })
    ]
  });
  container.appendChild(profileCard);

  // Assessments Comparative Table
  const gain = (scores.posttest !== null && scores.pretest !== null) ? (scores.posttest - scores.pretest) : null;

  const assessmentCard = createElement('div', {
    className: 'research-section card',
    children: [
      createElement('h3', { text: 'Rekapitulasi Asesmen' }),
      createElement('div', {
        className: 'scores-comparison-grid',
        children: [
          createElement('div', { className: 'score-pill', children: [createElement('span', { className: 'score-tag', text: 'Pre-Test (Baseline)' }), createElement('strong', { className: 'score-value', text: scores.pretest !== null ? `${scores.pretest}%` : 'Belum' })] }),
          createElement('div', { className: 'score-pill', children: [createElement('span', { className: 'score-tag', text: 'Post-Test (Evaluasi)' }), createElement('strong', { className: 'score-value', text: scores.posttest !== null ? `${scores.posttest}%` : 'Belum' })] }),
          createElement('div', { className: 'score-pill', children: [createElement('span', { className: 'score-tag', text: 'Selisih Poin (Gain Sederhana)' }), createElement('strong', { className: 'score-value', text: gain !== null ? `${gain > 0 ? '+' : ''}${gain}%` : '-' })] })
        ]
      })
    ]
  });
  container.appendChild(assessmentCard);

  // Telemetry Event Stream Preview
  const eventsCard = createElement('div', {
    className: 'research-section card',
    children: [
      createElement('div', {
        className: 'section-header-row',
        children: [
          createElement('h3', { text: `Telemetri Aktivitas Belajar (${events.length} Event Tercatat)` }),
          createElement('div', {
            className: 'btn-group',
            children: [
              createElement('button', {
                className: 'btn btn-sm btn-primary',
                text: 'Unduh JSON Lengkap',
                events: {
                  click: () => {
                    exportLearnerDataJSON(state);
                    showToast({ type: 'success', message: 'Dataset penelitian JSON berhasil diunduh.' });
                  }
                }
              }),
              createElement('button', {
                className: 'btn btn-sm btn-outline',
                text: 'Unduh Log CSV',
                events: {
                  click: () => {
                    exportEventsCSV(events);
                    showToast({ type: 'success', message: 'Telemetri CSV berhasil diunduh.' });
                  }
                }
              })
            ]
          })
        ]
      }),
      createElement('div', {
        className: 'events-table-wrap',
        children: [
          createElement('table', {
            className: 'events-table',
            children: [
              createElement('thead', {
                html: '<tr><th>Waktu</th><th>Tipe Event</th><th>Pertemuan</th><th>Detail Payload</th></tr>'
              }),
              createElement('tbody', {
                children: events.slice(-30).reverse().map(ev => createElement('tr', {
                  children: [
                    createElement('td', { text: new Date(ev.timestamp).toLocaleTimeString() }),
                    createElement('td', { children: [createElement('code', { text: ev.type })] }),
                    createElement('td', { text: ev.meetingId ? `M${ev.meetingId}` : '-' }),
                    createElement('td', { children: [createElement('code', { text: JSON.stringify(ev.payload || {}) })] })
                  ]
                }))
              })
            ]
          })
        ]
      })
    ]
  });
  container.appendChild(eventsCard);

  return container;
}
