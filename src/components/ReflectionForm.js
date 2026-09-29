/**
 * Reflection Form Component
 * Enables students to write and submit a qualitative self-regulation reflection (min 100 characters).
 */

import { createElement } from '../utils/dom.js';
import { submitReflection, getSavedReflection } from '../modules/reflection/reflectionEngine.js';
import { showToast } from './Toast.js';

export function createReflectionForm({ meetingId = 4, onSubmitted }) {
  const container = createElement('div', { className: 'reflection-form-card card' });

  const initialText = getSavedReflection();

  const title = createElement('h3', { className: 'reflection-title', text: 'Refleksi Diri & Tinjauan Investigasi (Self-Regulation)' });
  const desc = createElement('p', {
    className: 'reflection-desc',
    text: 'Sebagai tahap akhir LAPS-Heuristik ("Meninjau Kembali"), evaluasilah apa yang telah Anda pelajari, bagaimana strategi Anda dalam menelaah log/alert, dan apa yang akan Anda perbaiki jika menghadapi insiden serupa di masa depan. (Minimal 100 karakter).'
  });

  const textarea = createElement('textarea', {
    className: 'form-textarea reflection-input',
    attributes: {
      rows: 5,
      placeholder: 'Tuliskan refleksi kritis Anda di sini (misal: analisis log mengonfirmasi brute force karena frekuensi kegagalan tinggi dalam rentang waktu singkat...)...'
    },
    value: initialText
  });

  const countRow = createElement('div', { className: 'reflection-count-row' });
  const countLabel = createElement('span', {
    className: 'char-counter',
    text: `Karakter: ${initialText.length} / minimal 100`
  });

  const submitBtn = createElement('button', {
    className: 'btn btn-primary',
    text: 'Simpan Refleksi',
    events: {
      click: () => {
        const text = textarea.value;
        const result = submitReflection({ meetingId, text });
        if (result.success) {
          showToast({ type: 'success', message: result.message });
          if (onSubmitted) onSubmitted(result);
        } else {
          showToast({ type: 'error', message: result.error });
        }
      }
    }
  });

  textarea.addEventListener('input', () => {
    const len = textarea.value.trim().length;
    countLabel.textContent = `Karakter: ${len} / minimal 100`;
    if (len >= 100) {
      countLabel.classList.add('char-valid');
      countLabel.classList.remove('char-invalid');
    } else {
      countLabel.classList.add('char-invalid');
      countLabel.classList.remove('char-valid');
    }
  });

  countRow.appendChild(countLabel);
  countRow.appendChild(submitBtn);

  container.appendChild(title);
  container.appendChild(desc);
  container.appendChild(textarea);
  container.appendChild(countRow);

  return container;
}
