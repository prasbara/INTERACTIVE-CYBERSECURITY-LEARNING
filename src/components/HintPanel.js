/**
 * Hint Panel Component
 * Multi-tier scaffolding hint system (Tier 1 Conceptual -> Tier 2 Operational -> Tier 3 Solution).
 * Zero emojis, vector SVG icons.
 */

import { createElement } from '../utils/dom.js';
import { createIcon } from './Icon.js';

export function createHintPanel({ hints = [], onUnlockHint, unlockedIndices = [] }) {
  const container = createElement('div', { className: 'hint-panel-container' });

  function render() {
    container.innerHTML = '';
    const header = createElement('div', {
      className: 'hint-panel-header',
      style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' },
      children: [
        createIcon({ name: 'helpCircle', size: 18 }),
        createElement('h4', { className: 'hint-panel-title', text: 'Bantuan Bertingkat (Scaffolding Heuristik)', style: { margin: 0 } })
      ]
    });
    container.appendChild(header);

    const list = createElement('div', { className: 'hint-tiers-list' });

    hints.forEach((hint, idx) => {
      const isUnlocked = unlockedIndices.includes(idx);
      const tierNames = ['Petunjuk 1 (Konseptual)', 'Petunjuk 2 (Operasional)', 'Petunjuk 3 (Detail Analisis)'];

      const item = createElement('div', {
        className: `hint-item card ${isUnlocked ? 'hint-unlocked' : 'hint-locked'}`,
        children: [
          createElement('div', {
            className: 'hint-item-header',
            children: [
              createElement('span', { className: 'badge badge-subtle', text: tierNames[idx] || `Petunjuk ${idx + 1}` }),
              isUnlocked
                ? createElement('span', { className: 'badge badge-success', text: 'Terbuka' })
                : createElement('button', {
                    className: 'btn btn-xs btn-outline',
                    style: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem' },
                    children: [
                      createIcon({ name: 'unlock', size: 12 }),
                      createElement('span', { text: 'Buka Petunjuk (-5 Poin)' })
                    ],
                    events: {
                      click: () => {
                        if (onUnlockHint) onUnlockHint(idx);
                        unlockedIndices.push(idx);
                        render();
                      }
                    }
                  })
            ]
          }),
          isUnlocked
            ? createElement('div', { className: 'hint-text', text: typeof hint === 'string' ? hint : hint.text })
            : createElement('div', {
                className: 'hint-locked-placeholder',
                style: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' },
                children: [
                  createIcon({ name: 'lock', size: 14 }),
                  createElement('span', { text: 'Klik tombol di atas untuk membuka petunjuk pengarah jika Anda menemui jalan buntu.' })
                ]
              })
        ]
      });

      list.appendChild(item);
    });

    container.appendChild(list);
  }

  render();
  return container;
}

export default createHintPanel;
