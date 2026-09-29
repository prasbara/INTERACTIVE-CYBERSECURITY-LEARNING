/**
 * Identity Page
 * Collects student classroom profile (Nama, Kelas XI TJKT, Nomor Presensi).
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { validateIdentity } from '../utils/validators.js';
import { logEvent } from '../modules/analytics/eventLogger.js';
import { showToast } from '../components/Toast.js';

export function createIdentityPage() {
  const container = createElement('div', { className: 'identity-page page-container' });

  const state = store.getState();
  const current = state.student || {};

  const card = createElement('div', { className: 'identity-card card' });

  const header = createElement('div', {
    className: 'identity-header',
    children: [
      createElement('h2', { text: 'Identitas Siswa' }),
      createElement('p', {
        text: 'Silakan isi data diri Anda sebelum memulai kegiatan pembelajaran tatap muka. Data ini hanya tersimpan secara lokal pada peramban ini untuk keperluan riset skripsi.'
      })
    ]
  });

  const form = createElement('form', {
    className: 'identity-form',
    events: {
      submit: (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const className = classInput.value.trim();
        const attendanceNumber = presensiInput.value.trim();

        const val = validateIdentity({ name, className, attendanceNumber });
        if (!val.valid) {
          showToast({ type: 'error', message: val.error });
          return;
        }

        const student = { name, className, attendanceNumber };
        store.setState({ student });

        logEvent('identity_completed', student);
        showToast({ type: 'success', message: 'Identitas berhasil disimpan!' });

        if (!state.onboardingCompleted) {
          router.navigate('/onboarding');
        } else {
          router.navigate('/dashboard');
        }
      }
    }
  });

  const nameGroup = createElement('div', {
    className: 'form-group',
    children: [
      createElement('label', { className: 'form-label', text: 'Nama Lengkap Siswa' }),
      null
    ]
  });
  const nameInput = createElement('input', {
    className: 'form-input',
    attributes: {
      type: 'text',
      required: 'true',
      placeholder: 'Contoh: Muhammad Fikri'
    },
    value: current.name || ''
  });
  nameGroup.appendChild(nameInput);

  const classGroup = createElement('div', {
    className: 'form-group',
    children: [
      createElement('label', { className: 'form-label', text: 'Kelas (SMK TJKT)' }),
      null
    ]
  });
  const classInput = createElement('input', {
    className: 'form-input',
    attributes: {
      type: 'text',
      required: 'true',
      placeholder: 'Contoh: XI TJKT 1'
    },
    value: current.className || 'XI TJKT 1'
  });
  classGroup.appendChild(classInput);

  const presensiGroup = createElement('div', {
    className: 'form-group',
    children: [
      createElement('label', { className: 'form-label', text: 'Nomor Presensi' }),
      null
    ]
  });
  const presensiInput = createElement('input', {
    className: 'form-input',
    attributes: {
      type: 'text',
      required: 'true',
      placeholder: 'Contoh: 18'
    },
    value: current.attendanceNumber || ''
  });
  presensiGroup.appendChild(presensiInput);

  const submitBtn = createElement('button', {
    className: 'btn btn-primary btn-block',
    attributes: { type: 'submit' },
    text: 'Simpan Identitas & Lanjutkan'
  });

  form.appendChild(nameGroup);
  form.appendChild(classGroup);
  form.appendChild(presensiGroup);
  form.appendChild(submitBtn);

  card.appendChild(header);
  card.appendChild(form);
  container.appendChild(card);

  return container;
}
