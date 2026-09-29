/**
 * Scenario Card Component
 * Presents architectural decision dilemmas and detection strategy trade-offs (NIDS vs HIDS, Signature vs Anomaly).
 */

import { createElement } from '../utils/dom.js';

export function createScenarioCard({ scenario, selectedStrategy, onSelectStrategy, onSubmitStrategy, isLocked, feedback }) {
  const container = createElement('div', { className: 'scenario-card card' });

  const header = createElement('div', {
    className: 'scenario-header',
    children: [
      createElement('span', { className: 'badge badge-primary', text: scenario.id }),
      createElement('span', { className: 'badge badge-subtle', text: 'Studi Kasus Arsitektur' }),
      createElement('h3', { className: 'scenario-title', text: scenario.title })
    ]
  });

  const narrative = createElement('div', {
    className: 'scenario-narrative',
    children: [
      createElement('p', { text: scenario.description }),
      scenario.networkContext ? createElement('div', {
        className: 'scenario-context alert alert-info',
        children: [
          createElement('strong', { text: 'Konteks Topologi: ' }),
          createElement('span', { text: scenario.networkContext })
        ]
      }) : null
    ].filter(Boolean)
  });

  const optionsContainer = createElement('div', { className: 'scenario-options-grid' });

  scenario.options.forEach(opt => {
    const isSelected = selectedStrategy === opt.id;
    let cardClass = 'scenario-option-item card';
    if (isSelected) cardClass += ' option-selected';

    const card = createElement('div', {
      className: cardClass,
      children: [
        createElement('h4', { className: 'option-item-title', text: opt.title }),
        createElement('p', { className: 'option-item-desc', text: opt.description }),
        createElement('div', {
          className: 'option-tradeoffs',
          children: [
            opt.pros ? createElement('div', { className: 'pros-text', text: `Kelebihan: ${opt.pros}` }) : null,
            opt.cons ? createElement('div', { className: 'cons-text', text: `Kelemahan: ${opt.cons}` }) : null
          ].filter(Boolean)
        }),
        !isLocked ? createElement('button', {
          className: `btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`,
          text: isSelected ? 'Dipilih' : 'Pilih Strategi Ini',
          events: {
            click: () => {
              if (onSelectStrategy) onSelectStrategy(opt.id);
            }
          }
        }) : null
      ].filter(Boolean)
    });

    optionsContainer.appendChild(card);
  });

  container.appendChild(header);
  container.appendChild(narrative);
  container.appendChild(optionsContainer);

  if (!isLocked && onSubmitStrategy) {
    const actionRow = createElement('div', {
      className: 'scenario-action-row',
      children: [
        createElement('button', {
          className: 'btn btn-primary',
          attributes: { disabled: !selectedStrategy ? 'true' : null },
          text: 'Konfirmasi Pilihan Strategi',
          events: {
            click: () => onSubmitStrategy()
          }
        })
      ]
    });
    container.appendChild(actionRow);
  }

  if (isLocked && feedback) {
    const feedbackBox = createElement('div', {
      className: 'alert alert-info scenario-feedback-box',
      children: [
        createElement('h4', { text: 'Analisis Strategi Terpilih:' }),
        createElement('p', { text: feedback.analysis || feedback.explanation })
      ]
    });
    container.appendChild(feedbackBox);
  }

  return container;
}
