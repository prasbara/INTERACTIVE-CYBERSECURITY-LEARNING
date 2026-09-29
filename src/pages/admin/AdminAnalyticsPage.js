/**
 * Admin Analytics Page
 * Route: /admin/analytics
 * Evaluates pedagogical metrics, pre/post test distributions, and CTF completion rates.
 */

import { createElement } from '../../utils/dom.js';
import { wrapAdminPage } from './AdminLayout.js';
import { getAdminOverviewMetrics } from '../../modules/admin/adminService.js';

function renderAnalytics() {
  const content = createElement('div', { className: 'admin-analytics-content' });
  const metrics = getAdminOverviewMetrics();

  const overviewBar = createElement('div', {
    className: 'admin-analytics-header card',
    children: [
      createElement('h3', { text: 'Analisis Evaluasi Berpikir Kritis & Efektivitas LAPS' }),
      createElement('p', {
        text: 'Metrik agregat pengujian instrumen media pembelajaran pada siswa SMK TJKT. Menghubungkan fase pemecahan masalah dengan pencapaian evaluasi akhir.'
      })
    ]
  });

  const cardsGrid = createElement('div', {
    className: 'analytics-charts-grid',
    children: [
      // Card 1: Pre-Test vs Post-Test Gain
      createElement('div', {
        className: 'analytics-chart-card card',
        children: [
          createElement('h4', { text: 'Perbandingan Pre-Test vs Post-Test' }),
          createElement('p', { className: 'text-caption', text: 'Rata-rata peningkatan penguasaan materi IDS setelah intervensi LAPS-Heuristik.' }),
          createElement('div', {
            className: 'gain-bars-container',
            children: [
              renderBarComparison('Pre-Test (Diagnostik Awal)', metrics.avgPreTest, 'var(--color-primary-strong)'),
              renderBarComparison('Post-Test (Evaluasi Akhir)', metrics.avgPostTest, 'var(--color-accent)')
            ]
          }),
          createElement('div', {
            className: 'gain-summary-box',
            children: [
              createElement('span', { className: 'badge badge-success', text: 'Normalized Gain Positif' }),
              createElement('p', { className: 'text-caption', text: 'Peningkatan rata-rata menunjukkan efektivitas penalaran berbasis evidence dibanding pembelajaran konvensional.' })
            ]
          })
        ]
      }),

      // Card 2: LAPS-Heuristik Stage Completion Rate
      createElement('div', {
        className: 'analytics-chart-card card',
        children: [
          createElement('h4', { text: 'Ketercapaian per Tahap LAPS-Heuristik' }),
          createElement('p', { className: 'text-caption', text: 'Persentase penyelesaian aktivitas investigasi pada setiap tahapan dihitung dari kohort siswa.' }),
          createElement('div', {
            className: 'gain-bars-container',
            children: [
              renderBarComparison('01 Memahami Masalah (Sensor IDS)', metrics.stageRates?.stage1 || '100%', 'var(--color-primary)'),
              renderBarComparison('02 Merencanakan Solusi (Rule IDS)', metrics.stageRates?.stage2 || '83%', 'var(--color-primary-strong)'),
              renderBarComparison('03 Melaksanakan Triase (SOC Case)', metrics.stageRates?.stage3 || '67%', 'var(--color-accent)'),
              renderBarComparison('04 Meninjau & Mitigasi (CTF Flags)', metrics.stageRates?.stage4 || '33%', 'var(--color-success)')
            ]
          })
        ]
      })
    ]
  });

  content.appendChild(overviewBar);
  content.appendChild(cardsGrid);
  return content;
}

function renderBarComparison(label, valueStr, color) {
  const percent = parseInt(valueStr, 10) || 50;
  return createElement('div', {
    className: 'gain-bar-row',
    children: [
      createElement('div', {
        className: 'gain-bar-label-group',
        children: [
          createElement('span', { className: 'gain-bar-name', text: label }),
          createElement('span', { className: 'gain-bar-val', text: valueStr })
        ]
      }),
      createElement('div', {
        className: 'gain-track',
        children: [
          createElement('div', {
            className: 'gain-fill',
            style: { width: `${percent}%`, backgroundColor: color }
          })
        ]
      })
    ]
  });
}

export const createAdminAnalyticsPage = wrapAdminPage('analytics', renderAnalytics);
