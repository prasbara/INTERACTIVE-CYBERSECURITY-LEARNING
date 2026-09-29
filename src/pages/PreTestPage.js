/**
 * Pre-Test Page
 * Pre-intervention diagnostic assessment (10 items).
 */

import { createElement } from '../utils/dom.js';
import { PreTestEngine } from '../modules/assessment/pretestEngine.js';
import { createQuizCard } from '../components/QuizCard.js';
import { showToast } from '../components/Toast.js';
import { router } from '../app/router.js';

export function createPreTestPage() {
  const container = createElement('div', { className: 'pretest-page page-container' });
  const engine = new PreTestEngine();
  const questions = engine.getQuestions();

  const header = createElement('div', {
    className: 'assessment-header card',
    children: [
      createElement('span', { className: 'badge badge-primary', text: 'Tahap Diagnostik Awal' }),
      createElement('h1', { text: 'Pre-Test: Pemahaman Awal IDS & Berpikir Kritis' }),
      createElement('p', {
        text: 'Kerjakan 10 butir pertanyaan berikut secara mandiri berdasarkan pemahaman awal Anda sebelum memulai intervensi pembelajaran. Hasil pre-test digunakan sebagai baseline riset.'
      })
    ]
  });
  container.appendChild(header);

  const questionsList = createElement('div', { className: 'assessment-questions-list' });

  questions.forEach((q, idx) => {
    let selected = null;
    const itemWrap = createElement('div');

    function renderItem(locked = false, feedback = null) {
      itemWrap.innerHTML = '';
      const card = createQuizCard({
        question: { ...q, id: `PreTest-${idx + 1}` },
        selectedAnswer: selected,
        isLocked: locked,
        feedback,
        onSelectOption: (optId) => {
          selected = optId;
          engine.setAnswer(q.id, optId);
          renderItem(false);
          updateSubmitStatus();
        }
      });
      itemWrap.appendChild(card);
    }

    renderItem();
    questionsList.appendChild(itemWrap);
  });
  container.appendChild(questionsList);

  const footerAction = createElement('div', { className: 'assessment-footer card' });
  const statusLabel = createElement('span', {
    className: 'assessment-status-label',
    text: `Terjawab: 0 / ${questions.length}`
  });

  const submitBtn = createElement('button', {
    className: 'btn btn-primary btn-lg',
    attributes: { disabled: 'true' },
    text: 'Kirim Jawaban Pre-Test',
    events: {
      click: () => {
        submitBtn.setAttribute('disabled', 'true');
        const result = engine.submit();
        showToast({
          type: 'success',
          message: `Pre-Test selesai! Skor awal Anda: ${result.percentage}%`
        });
        router.navigate('/dashboard');
      }
    }
  });

  function updateSubmitStatus() {
    const answered = engine.getAnsweredCount();
    statusLabel.textContent = `Terjawab: ${answered} / ${questions.length}`;
    if (answered === questions.length) {
      submitBtn.removeAttribute('disabled');
    } else {
      submitBtn.setAttribute('disabled', 'true');
    }
  }

  footerAction.appendChild(statusLabel);
  footerAction.appendChild(submitBtn);
  container.appendChild(footerAction);

  return container;
}
