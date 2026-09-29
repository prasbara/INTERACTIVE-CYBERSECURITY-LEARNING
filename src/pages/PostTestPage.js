/**
 * Post-Test Page
 * Post-intervention evaluative assessment (12 items).
 */

import { createElement } from '../utils/dom.js';
import { PostTestEngine } from '../modules/assessment/posttestEngine.js';
import { createQuizCard } from '../components/QuizCard.js';
import { showToast } from '../components/Toast.js';
import { router } from '../app/router.js';

export function createPostTestPage() {
  const container = createElement('div', { className: 'posttest-page page-container' });
  const engine = new PostTestEngine();
  const questions = engine.getQuestions();

  const header = createElement('div', {
    className: 'assessment-header card',
    children: [
      createElement('span', { className: 'badge badge-primary', text: 'Tahap Evaluasi Akhir' }),
      createElement('h1', { text: 'Post-Test: Evaluasi Akhir Kemampuan Berpikir Kritis' }),
      createElement('p', {
        text: 'Kerjakan 12 butir pertanyaan evaluatif berikut secara teliti setelah menyelesaikan seluruh kegiatan pembelajaran (Pertemuan 1 hingga 4). Analisislah bukti log dan skenario sebelum memilih.'
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
        question: { ...q, id: `PostTest-${idx + 1}` },
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
    text: 'Kirim Jawaban Post-Test',
    events: {
      click: () => {
        submitBtn.setAttribute('disabled', 'true');
        const result = engine.submit();
        showToast({
          type: 'success',
          message: `Post-Test selesai! Skor evaluasi Anda: ${result.percentage}%`
        });
        router.navigate('/completion');
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
