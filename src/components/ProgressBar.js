/**
 * Progress Bar Component
 */

import { createElement } from '../utils/dom.js';

export function createProgressBar({ value = 0, max = 100, label = '', showPercentage = true }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return createElement('div', {
    className: 'progress-bar-container',
    children: [
      label || showPercentage ? createElement('div', {
        className: 'progress-label-row',
        children: [
          label ? createElement('span', { className: 'progress-label', text: label }) : null,
          showPercentage ? createElement('span', { className: 'progress-percent', text: `${percentage}%` }) : null
        ].filter(Boolean)
      }) : null,
      createElement('div', {
        className: 'progress-track',
        attributes: {
          role: 'progressbar',
          'aria-valuenow': percentage,
          'aria-valuemin': 0,
          'aria-valuemax': 100
        },
        children: [
          createElement('div', {
            className: 'progress-fill',
            style: { width: `${percentage}%` }
          })
        ]
      })
    ].filter(Boolean)
  });
}
