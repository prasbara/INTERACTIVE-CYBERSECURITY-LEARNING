/**
 * Concept Quick Check Component
 * Embeds interactive micro-checks inside learning materials with instant inline feedback.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { addXP } from '../modules/gamification/xpSystem.js';
import { logEvent } from '../modules/analytics/eventLogger.js';

export function createConceptQuickCheck({
  id = 'check-01',
  question = 'An IDS detects an unusual traffic pattern that does not match any known signatures. Which approach is more relevant to detect it?',
  options = [
    { id: 'sig', text: 'Signature-Based Detection', isCorrect: false, explanation: 'Kurang tepat. Signature-based memerlukan tanda tangan yang sudah dikenal sebelumnya dalam database.' },
    { id: 'anom', text: 'Anomaly-Based Detection', isCorrect: true, explanation: 'Tepat! Anomaly-based mendeteksi deviasi perilaku terhadap baseline statistik lalu lintas normal.' }
  ]
}) {
  const container = createElement('div', { className: 'quick-check-card card' });

  const header = createElement('div', {
    className: 'quick-check-header',
    children: [
      createElement('span', { className: 'badge badge-primary', text: 'Uji Pemahaman Cepat' }),
      createElement('span', { className: 'badge badge-subtle', text: '+15 XP' })
    ]
  });

  const prompt = createElement('h4', { className: 'quick-check-prompt', text: question });
  const optionsRow = createElement('div', { className: 'quick-check-options' });
  const feedbackBox = createElement('div', { className: 'quick-check-feedback', style: { display: 'none' } });

  const state = store.getState();
  const saved = state.microChecks?.[id];

  options.forEach(opt => {
    const isSelected = saved?.selectedId === opt.id;
    const btn = createElement('button', {
      className: `btn btn-outline quick-check-btn ${isSelected ? 'btn-active' : ''}`,
      text: opt.text,
      attributes: { disabled: saved ? 'true' : null },
      events: {
        click: () => {
          optionsRow.querySelectorAll('button').forEach(b => {
            b.setAttribute('disabled', 'true');
            b.classList.remove('btn-active');
          });
          btn.classList.add('btn-active');

          const payload = {
            selectedId: opt.id,
            isCorrect: opt.isCorrect,
            answeredAt: new Date().toISOString()
          };

          store.setState(prev => ({
            microChecks: {
              ...prev.microChecks,
              [id]: payload
            }
          }));

          logEvent('micro_check_answered', { id, ...payload });

          feedbackBox.style.display = 'block';
          if (opt.isCorrect) {
            feedbackBox.className = 'quick-check-feedback alert alert-success';
            feedbackBox.innerHTML = `<strong>Jawaban Tepat!</strong><p>${opt.explanation}</p>`;
            addXP(15, 'Menyelesaikan Uji Pemahaman Cepat');
          } else {
            feedbackBox.className = 'quick-check-feedback alert alert-warning';
            feedbackBox.innerHTML = `<strong>Penjelasan Konseptual:</strong><p>${opt.explanation}</p>`;
          }
        }
      }
    });

    optionsRow.appendChild(btn);
  });

  if (saved) {
    const opt = options.find(o => o.id === saved.selectedId);
    feedbackBox.style.display = 'block';
    if (saved.isCorrect) {
      feedbackBox.className = 'quick-check-feedback alert alert-success';
      feedbackBox.innerHTML = `<strong>Selesai Terjawab:</strong><p>${opt?.explanation || 'Pemahaman konsep tepat.'}</p>`;
    } else {
      feedbackBox.className = 'quick-check-feedback alert alert-warning';
      feedbackBox.innerHTML = `<strong>Evaluasi:</strong><p>${opt?.explanation || 'Cermati kembali materi di atas.'}</p>`;
    }
  }

  container.appendChild(header);
  container.appendChild(prompt);
  container.appendChild(optionsRow);
  container.appendChild(feedbackBox);

  return container;
}
