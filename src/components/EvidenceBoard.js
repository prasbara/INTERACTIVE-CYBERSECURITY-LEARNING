/**
 * Evidence Board Component
 * Allows students to review their marked evidences, observe patterns, and bridge
 * log investigation to hypothesis formulation as part of LAPS-Heuristik.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { showToast } from './Toast.js';
import { addXP } from '../modules/gamification/xpSystem.js';
import { logEvent } from '../modules/analytics/eventLogger.js';

export function createEvidenceBoard({
  meetingId = 1,
  defaultItems = [
    { id: 'item_freq', text: 'Frekuensi kegagalan autentikasi berulang dalam waktu sangat singkat', checked: true },
    { id: 'item_ip', text: 'Alamat IP sumber (192.168.1.45) konsisten pada seluruh percobaan', checked: true },
    { id: 'item_users', text: 'Percobaan login beralih ke berbagai username (root, admin, test, oracle)', checked: true },
    { id: 'item_success', text: 'Tidak ada catatan otentikasi sah yang berhasil selama periode serangan', checked: false }
  ],
  onPatternConfirmed = null
}) {
  const container = createElement('div', { className: 'evidence-board card' });

  const header = createElement('div', {
    className: 'evidence-board-header',
    children: [
      createElement('div', {
        className: 'evidence-title-group',
        children: [
          createElement('h3', { text: 'Evidence Board: Sintesis Temuan Investigasi' })
        ]
      }),
      createElement('span', { className: 'badge badge-primary', text: 'Analisis Bukti' })
    ]
  });

  const desc = createElement('p', {
    className: 'evidence-board-desc',
    text: 'Tandai butir-butir bukti konkret di bawah ini yang Anda temukan saat meneliti log, lalu simpulkan pola ancaman yang terlihat.'
  });

  const checklistContainer = createElement('div', { className: 'evidence-checklist' });
  const itemStates = {};

  defaultItems.forEach(item => {
    itemStates[item.id] = item.checked;

    const row = createElement('label', {
      className: `evidence-check-item ${item.checked ? 'item-checked' : ''}`,
      children: [
        null,
        createElement('span', { className: 'item-text', text: item.text })
      ]
    });

    const checkbox = createElement('input', {
      attributes: { type: 'checkbox' },
      events: {
        change: (e) => {
          itemStates[item.id] = e.target.checked;
          if (e.target.checked) {
            row.classList.add('item-checked');
          } else {
            row.classList.remove('item-checked');
          }
        }
      }
    });
    if (item.checked) checkbox.checked = true;

    row.insertBefore(checkbox, row.firstChild);
    checklistContainer.appendChild(row);
  });

  // Pattern Observation Section
  const patternBox = createElement('div', { className: 'pattern-observation-box' });
  patternBox.appendChild(createElement('h4', { text: 'Pola apa yang Anda amati dari kombinasi bukti di atas?' }));

  const patterns = [
    { id: 'brute_force_pattern', label: 'Pola Serangan Kamus / Brute Force Terotomasi', correct: true },
    { id: 'normal_pattern', label: 'Perilaku Pengguna Normal / Gangguan Jaringan', correct: false },
    { id: 'insufficient_pattern', label: 'Bukti Tidak Menunjukkan Hubungan Apapun', correct: false }
  ];

  const patternButtonsRow = createElement('div', { className: 'pattern-buttons-row' });
  let chosenPattern = null;

  const resultFeedback = createElement('div', { className: 'pattern-feedback' });

  patterns.forEach(p => {
    const btn = createElement('button', {
      className: 'btn btn-outline pattern-btn',
      text: p.label,
      events: {
        click: () => {
          chosenPattern = p.id;
          patternButtonsRow.querySelectorAll('button').forEach(b => b.className = 'btn btn-outline pattern-btn');
          btn.className = 'btn btn-primary pattern-btn';

          resultFeedback.innerHTML = '';
          if (p.correct) {
            resultFeedback.className = 'pattern-feedback alert alert-success';
            resultFeedback.innerHTML = `
              <strong>Pola Teridentifikasi dengan Tepat!</strong>
              <p>Frekuensi tinggi, IP sumber identik, dan percobaan nama akun default berurutan merupakan tanda pasti dari serangan kamus terotomasi (Automated Dictionary Attack).</p>
            `;
            addXP(20, 'Identifikasi Pola Evidence Board');
            showToast({ type: 'success', message: 'Pola investigasi berhasil disintesis!' });
          } else {
            resultFeedback.className = 'pattern-feedback alert alert-warning';
            resultFeedback.innerHTML = `
              <strong>Perlu Tinjauan Bukti Lebih Seksama:</strong>
              <p>Perhatikan kembali bahwa jeda waktu hanya 2-3 detik dan nama pengguna terus berganti. Mustahil seorang pengguna normal mengingat puluhan akun berbeda dalam hitungan detik.</p>
            `;
          }

          logEvent('evidence_pattern_observed', {
            meetingId,
            pattern: p.id,
            isCorrect: p.correct,
            checklist: itemStates
          });

          if (onPatternConfirmed) {
            onPatternConfirmed(p);
          }
        }
      }
    });

    patternButtonsRow.appendChild(btn);
  });

  patternBox.appendChild(patternButtonsRow);
  patternBox.appendChild(resultFeedback);

  container.appendChild(header);
  container.appendChild(desc);
  container.appendChild(checklistContainer);
  container.appendChild(patternBox);

  return container;
}
