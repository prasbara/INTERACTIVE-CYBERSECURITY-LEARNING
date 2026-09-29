/**
 * Admin Research Data & Export Page
 * Route: /admin/research
 * Raw telemetries, SPSS-ready exports, and academic thesis validation datasets.
 */

import { createElement } from '../../utils/dom.js';
import { wrapAdminPage } from './AdminLayout.js';
import { exportResearchDataCSV, exportResearchDataJSON, getAdminStudentsList } from '../../modules/admin/adminService.js';
import { getEvents } from '../../modules/analytics/eventLogger.js';

function renderResearch() {
  const content = createElement('div', { className: 'admin-research-content' });
  const students = getAdminStudentsList();
  const events = getEvents();

  const headerCard = createElement('div', {
    className: 'admin-research-header card',
    children: [
      createElement('h3', { text: 'Manajemen Dataset Penelitian Skripsi S1' }),
      createElement('p', {
        text: 'Data mentah telemetri, log interaksi, pre-test, post-test, dan durasi pengerjaan. Seluruh data disimpan lokal untuk menjaga etika penelitian dan privasi peserta didik.'
      }),
      createElement('div', {
        className: 'export-buttons-group',
        children: [
          createElement('button', {
            className: 'btn btn-primary',
            text: 'Unduh Dataset Lengkap (CSV)',
            events: { click: () => exportResearchDataCSV('full_cohort') }
          }),
          createElement('button', {
            className: 'btn btn-secondary',
            text: 'Unduh Raw Telemetry (JSON)',
            events: { click: () => exportResearchDataJSON() }
          })
        ]
      })
    ]
  });

  // Data Separation Tabs
  const dataOverview = createElement('div', {
    className: 'research-cards-grid',
    children: [
      createElement('div', {
        className: 'dataset-card card',
        children: [
          createElement('span', { className: 'badge badge-primary', text: 'DATASET PRIMER' }),
          createElement('h4', { text: 'Skor Pre-Test & Post-Test' }),
          createElement('p', { className: 'text-caption', text: `Tercatat ${students.length} sampel siswa dengan data perolehan pre/post test untuk uji N-Gain & t-test berpasangan.` }),
          createElement('span', { className: 'text-caption', text: 'Format: Nilai Skala 0-100, Waktu Pengerjaan' })
        ]
      }),
      createElement('div', {
        className: 'dataset-card card',
        children: [
          createElement('span', { className: 'badge badge-accent', text: 'LOG TELEMETRI' }),
          createElement('h4', { text: 'Log Aktivitas Heuristik' }),
          createElement('p', { className: 'text-caption', text: `Buffer telemetri mencatat ${events.length} event interaksi (triase decision, flag submission, bookmarking, and hint usage).` }),
          createElement('span', { className: 'text-caption', text: 'Format: Timestamp, Action Type, Payload' })
        ]
      }),
      createElement('div', {
        className: 'dataset-card card',
        children: [
          createElement('span', { className: 'badge badge-neutral', text: 'METRIK DERIVATIF' }),
          createElement('h4', { text: 'Triase & Rekonstruksi CTF' }),
          createElement('p', { className: 'text-caption', text: 'Data akurasi pemisahan True Positive vs False Positive dari 7 skenario SOC beserta validasi 30 tantangan bendera.' }),
          createElement('span', { className: 'text-caption', text: 'Format: Precision, False Alarm Rate, Solve Rate' })
        ]
      })
    ]
  });

  content.appendChild(headerCard);
  content.appendChild(dataOverview);
  return content;
}

export const createAdminResearchPage = wrapAdminPage('research', renderResearch);
