import { createElement } from '../../utils/dom.js';
import { MISCONCEPTIONS } from '../../data/misconceptions.js';
import { icons } from '../../utils/icons.js';

export function renderQuizFeedback(result, attempts = 1, onRemediate = null) {
  const isCorrect = result.isCorrect;
  const feedbackEl = createElement('div', {
    className: `structured-feedback ${isCorrect ? 'correct' : 'incorrect'}`
  });

  const badge = createElement('div', {
    className: 'feedback-header-badge',
    style: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem' },
    children: [
      createElement('span', { html: isCorrect ? icons.check : icons.x }),
      createElement('span', { text: isCorrect ? 'KEPUTUSAN TEPAT (CORRECT)' : 'EVALUASI KURANG TEPAT (INCORRECT)' })
    ]
  });
  feedbackEl.appendChild(badge);

  const answerRow = createElement('div', {}, 
    createElement('strong', {}, 'Jawaban Anda: '),
    result.selectedText
  );
  feedbackEl.appendChild(answerRow);

  if (result.evidence) {
    feedbackEl.appendChild(createElement('div', { className: 'feedback-section-title' }, 'BUKTI OBJEKTIF (EVIDENCE):'));
    feedbackEl.appendChild(createElement('div', {}, result.evidence));
  }

  if (result.explanation) {
    feedbackEl.appendChild(createElement('div', { className: 'feedback-section-title' }, 'PENALARAN ANALITIS (EXPECTED REASONING):'));
    feedbackEl.appendChild(createElement('div', {}, result.explanation));
  }

  if (!isCorrect && result.misconception && MISCONCEPTIONS[result.misconception]) {
    const misc = MISCONCEPTIONS[result.misconception];
    const miscBox = createElement('div', { className: 'feedback-misconception' },
      createElement('strong', {}, 'Miskonsepsi yang Perlu Diperhatikan: '),
      misc.description
    );
    feedbackEl.appendChild(miscBox);
  }

  if (result.takeaway) {
    feedbackEl.appendChild(createElement('div', { className: 'feedback-section-title' }, 'POKOK INGATAN (WHAT TO REMEMBER):'));
    feedbackEl.appendChild(createElement('div', {}, result.takeaway));
  }

  if (!isCorrect && attempts >= 2 && onRemediate) {
    const refresherBox = createElement('div', { className: 'feedback-refresher' });
    const btnRefresher = createElement('button', {
      className: 'btn btn-secondary btn-sm',
      onClick: onRemediate
    }, 'Need a refresher? Review Konsep Materi Terkait');
    refresherBox.appendChild(btnRefresher);
    feedbackEl.appendChild(refresherBox);
  }

  return feedbackEl;
}
