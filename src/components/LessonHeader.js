/**
 * Lesson Header Component
 * Displays Meeting Title, LAPS-Heuristik Stage Eyebrow, Cognitive Anchor Question, and Objectives.
 */

import { createElement } from '../utils/dom.js';

export function createLessonHeader({ meeting, heuristicQuestion, stage, objectives = [] }) {
  const stageLabels = {
    understand: 'TAHAP 1: MEMAHAMI MASALAH',
    plan: 'TAHAP 2: MERENCANAKAN PEMECAHAN',
    execute: 'TAHAP 3: MELAKSANAKAN RENCANA',
    review: 'TAHAP 4: MENINJAU KEMBALI'
  };

  const currentStageLabel = stageLabels[stage] || (stage ? String(stage).toUpperCase() : '');

  return createElement('header', {
    className: 'lesson-header-card card',
    children: [
      createElement('div', {
        className: 'lesson-header-eyebrow-row',
        children: [
          createElement('span', {
            className: 'lesson-header-eyebrow',
            text: `PERTEMUAN ${meeting.id ? String(meeting.id).padStart(2, '0') : '01'} · ${currentStageLabel}`
          }),
          meeting.cognitiveFocus && meeting.cognitiveFocus.length > 0 ? createElement('div', {
            className: 'lesson-focus-tags',
            children: meeting.cognitiveFocus.map(f => createElement('span', {
              className: 'badge badge-outline',
              text: f.toUpperCase()
            }))
          }) : null
        ].filter(Boolean)
      }),
      createElement('h1', { className: 'lesson-header-title', text: meeting.title }),
      meeting.description ? createElement('p', {
        className: 'lesson-header-desc',
        text: meeting.description
      }) : null,
      heuristicQuestion ? createElement('div', {
        className: 'heuristic-anchor-box',
        children: [
          createElement('div', {
            className: 'heuristic-anchor-header',
            children: [
              createElement('span', { className: 'heuristic-anchor-pill', text: 'COGNITIVE ANCHOR' }),
              createElement('span', { className: 'heuristic-anchor-sub', text: 'PANDUAN BERPIKIR KRITIS LAPS' })
            ]
          }),
          createElement('blockquote', {
            className: 'heuristic-anchor-quote',
            text: `"${heuristicQuestion}"`
          }),
          createElement('p', {
            className: 'heuristic-anchor-note',
            text: 'Gunakan pertanyaan pemandu di atas sebagai titik pijak untuk membedah data, merumuskan hipotesis, dan memvalidasi keputusan investigasi Anda.'
          })
        ]
      }) : null,
      objectives.length > 0 ? createElement('div', {
        className: 'lesson-objectives-box',
        children: [
          createElement('span', { className: 'lesson-objectives-label', text: 'TUJUAN PEMBELAJARAN' }),
          createElement('ul', {
            className: 'lesson-objectives-list',
            children: objectives.map(obj => createElement('li', { text: obj }))
          })
        ]
      }) : null
    ].filter(Boolean)
  });
}

