/**
 * Meeting Card Component
 * Used in Learning Path and Dashboard to showcase meeting cards with progress, badge, and CTA.
 * Zero emojis, vector SVG icons.
 */

import { createElement } from '../utils/dom.js';
import { router } from '../app/router.js';
import { createIcon } from './Icon.js';

export function createMeetingCard({ meeting, progress = 0, isCompleted = false, isRecommended = false }) {
  const stageLabels = {
    understand: 'Memahami Masalah',
    plan: 'Merencanakan Pemecahan',
    execute: 'Melaksanakan Rencana',
    review: 'Meninjau Kembali'
  };

  const statusBadge = isCompleted
    ? createElement('span', {
        className: 'badge badge-success',
        style: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem' },
        children: [
          createIcon({ name: 'check', size: 12 }),
          createElement('span', { text: 'Selesai' })
        ]
      })
    : (progress > 0
      ? createElement('span', {
          className: 'badge badge-warning',
          style: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem' },
          children: [
            createIcon({ name: 'activity', size: 12 }),
            createElement('span', { text: 'Sedang Berjalan' })
          ]
        })
      : createElement('span', { className: 'badge badge-neutral', text: 'Belum Mulai' }));

  return createElement('div', {
    className: `meeting-card card ${isRecommended ? 'card-recommended' : ''}`,
    children: [
      createElement('div', {
        className: 'meeting-card-header',
        children: [
          createElement('div', {
            className: 'meeting-card-badge-row',
            children: [
              createElement('span', { className: 'badge badge-primary', text: `Pertemuan ${meeting.id}` }),
              createElement('span', { className: 'badge badge-subtle', text: stageLabels[meeting.lapsStage] || meeting.lapsStage }),
              isRecommended ? createElement('span', { className: 'badge badge-info', text: 'Rekomendasi' }) : null
            ].filter(Boolean)
          }),
          statusBadge
        ]
      }),
      createElement('h3', { className: 'meeting-card-title', text: meeting.title }),
      createElement('p', { className: 'meeting-card-desc', text: meeting.description }),
      meeting.heuristicQuestion ? createElement('div', {
        className: 'meeting-heuristic-quote',
        text: `Heuristik: "${meeting.heuristicQuestion}"`
      }) : null,
      createElement('div', {
        className: 'meeting-card-footer',
        children: [
          createElement('div', {
            className: 'progress-mini-track',
            children: [
              createElement('div', {
                className: 'progress-mini-fill',
                style: { width: `${progress}%` }
              })
            ]
          }),
          createElement('button', {
            className: `btn ${isCompleted ? 'btn-outline' : (isRecommended ? 'btn-primary' : 'btn-secondary')}`,
            text: isCompleted ? 'Buka Kembali' : (progress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'),
            events: {
              click: () => router.navigate(`/meeting/${meeting.id}`)
            }
          })
        ]
      })
    ].filter(Boolean)
  });
}

export default createMeetingCard;
