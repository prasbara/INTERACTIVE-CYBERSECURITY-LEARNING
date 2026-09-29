import { createElement } from '../../utils/dom.js';
import { icons } from '../../utils/icons.js';

export function renderTriageFeedback(result) {
  const isCorrect = result.isCorrect;
  const feedbackEl = createElement('div', {
    className: `structured-feedback ${isCorrect ? 'correct' : 'incorrect'}`
  });

  const header = createElement('div', {
    className: 'feedback-header-badge',
    style: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem' },
    children: [
      createElement('span', { html: isCorrect ? icons.check : icons.x }),
      createElement('span', { text: isCorrect ? 'KLASIFIKASI TEPAT' : 'EVALUASI KURANG TEPAT' })
    ]
  });
  feedbackEl.appendChild(header);

  const decisionRow = createElement('div', {},
    createElement('strong', {}, 'Keputusan Anda: '),
    result.decision
  );
  feedbackEl.appendChild(decisionRow);

  feedbackEl.appendChild(createElement('div', { className: 'feedback-section-title' }, 'PENALARAN ANALISIS SOC:'));
  feedbackEl.appendChild(createElement('div', {}, result.explanation));

  return feedbackEl;
}
