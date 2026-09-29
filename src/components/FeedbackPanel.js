/**
 * Feedback Panel Component
 * Displays pedagogically rich feedback, explanations, misconceptions, and remediations.
 * Zero emojis, vector SVG icons.
 */

import { createElement } from '../utils/dom.js';
import { createIcon } from './Icon.js';

export function createFeedbackPanel({ isCorrect, explanation, misconception, remediation, scoreImpact }) {
  const panel = createElement('div', {
    className: `feedback-panel ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`,
    children: [
      createElement('div', {
        className: 'feedback-header',
        style: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
        children: [
          createIcon({ name: isCorrect ? 'check' : 'x', size: 18, className: 'feedback-icon' }),
          createElement('h4', {
            className: 'feedback-title',
            text: isCorrect ? 'Analisis Tepat!' : 'Perlu Peninjauan Kembali',
            style: { margin: 0, flex: 1 }
          }),
          scoreImpact !== undefined ? createElement('span', {
            className: `badge ${isCorrect ? 'badge-success' : 'badge-danger'}`,
            text: isCorrect ? `+${scoreImpact} Poin` : '0 Poin'
          }) : null
        ].filter(Boolean)
      }),
      explanation ? createElement('div', {
        className: 'feedback-explanation',
        children: [
          createElement('strong', { text: 'Penjelasan Teknis & Penalaran: ' }),
          createElement('p', { text: explanation })
        ]
      }) : null,
      !isCorrect && misconception ? createElement('div', {
        className: 'feedback-misconception alert alert-warning',
        children: [
          createElement('strong', { text: 'Potensi Miskonsepsi: ' }),
          createElement('p', { text: misconception })
        ]
      }) : null,
      !isCorrect && remediation ? createElement('div', {
        className: 'feedback-remediation alert alert-info',
        children: [
          createElement('strong', { text: 'Saran Perbaikan: ' }),
          createElement('p', { text: remediation })
        ]
      }) : null
    ].filter(Boolean)
  });

  return panel;
}

export default createFeedbackPanel;
