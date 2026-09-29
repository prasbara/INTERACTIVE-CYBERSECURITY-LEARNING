/**
 * Admin Overview Page
 * Route: /admin
 * High-level operational metrics, research cohort summary, and quick export actions.
 */

import { createElement } from '../../utils/dom.js';
import { wrapAdminPage } from './AdminLayout.js';
import { getAdminOverviewMetrics, exportResearchDataCSV, exportResearchDataJSON } from '../../modules/admin/adminService.js';
import { router } from '../../app/router.js';

function renderOverview() {
  const content = createElement('div', { className: 'admin-overview-content' });
  const metrics = getAdminOverviewMetrics();

  // Metrics Grid
  const metricsGrid = createElement('div', {
    className: 'admin-metrics-grid',
    children: [
      createElement('div', {
        className: 'admin-stat-card card',
        children: [
          createElement('span', { className: 'stat-label', text: 'TOTAL SISWA TERDAFTAR' }),
          createElement('span', { className: 'stat-number', text: String(metrics.totalStudents) }),
          createElement('span', { className: 'stat-sub', text: `${metrics.activeStudents} Siswa aktif di kelas` })
        ]
      }),
      createElement('div', {
        className: 'admin-stat-card card',
        children: [
          createElement('span', { className: 'stat-label', text: 'TINGKAT KETERCAPAIAN' }),
          createElement('span', { className: 'stat-number text-accent', text: metrics.completionRate }),
          createElement('span', { className: 'stat-sub', text: 'Menyelesaikan modul 1-4' })
        ]
      }),
      createElement('div', {
        className: 'admin-stat-card card',
        children: [
          createElement('span', { className: 'stat-label', text: 'RATA-RATA PRE-TEST' }),
          createElement('span', { className: 'stat-number', text: metrics.avgPreTest }),
          createElement('span', { className: 'stat-sub', text: 'Evaluasi diagnostik awal' })
        ]
      }),
      createElement('div', {
        className: 'admin-stat-card card',
        children: [
          createElement('span', { className: 'stat-label', text: 'RATA-RATA POST-TEST' }),
          createElement('span', { className: 'stat-number text-success', text: metrics.avgPostTest }),
          createElement('span', { className: 'stat-sub', text: 'Evaluasi akhir materi IDS' })
        ]
      }),
      createElement('div', {
        className: 'admin-stat-card card',
        children: [
          createElement('span', { className: 'stat-label', text: 'CTF KASUS DISELESAIKAN' }),
          createElement('span', { className: 'stat-number', text: String(metrics.totalCtfSolved) }),
          createElement('span', { className: 'stat-sub', text: `Dari ${metrics.totalCtfChallenges} tantangan real-case` })
        ]
      }),
      createElement('div', {
        className: 'admin-stat-card card',
        children: [
          createElement('span', { className: 'stat-label', text: 'BANK SOAL AKTIF' }),
          createElement('span', { className: 'stat-number', text: String(metrics.totalQuestions) }),
          createElement('span', { className: 'stat-sub', text: 'Soal penalaran kritis LAPS' })
        ]
      })
    ]
  });

  // Action Panel
  const actionPanel = createElement('div', {
    className: 'admin-action-banner card',
    children: [
      createElement('div', {
        className: 'action-banner-text',
        children: [
          createElement('h3', { text: 'Ekspor Dataset Penelitian Skripsi' }),
          createElement('p', { text: 'Unduh data telemetri siswa, hasil pre/post test, dan korelasi triase dalam format CSV atau JSON standar untuk analisis SPSS / pengujian hipotesis.' })
        ]
      }),
      createElement('div', {
        className: 'action-banner-buttons',
        children: [
          createElement('button', {
            className: 'btn btn-primary',
            text: 'Ekspor Data CSV',
            events: {
              click: () => exportResearchDataCSV('overview')
            }
          }),
          createElement('button', {
            className: 'btn btn-secondary',
            text: 'Ekspor JSON Lengkap',
            events: {
              click: () => exportResearchDataJSON()
            }
          })
        ]
      })
    ]
  });

  // Quick Links
  const quickLinks = createElement('div', {
    className: 'admin-quick-grid',
    children: [
      createElement('div', {
        className: 'quick-card card',
        children: [
          createElement('h4', { text: 'Manajemen Siswa' }),
          createElement('p', { text: 'Periksa progres individu siswa, catatan pre/post-test, dan riwayat aktivitas.' }),
          createElement('button', {
            className: 'btn btn-outline btn-sm',
            text: 'Buka Daftar Siswa →',
            events: { click: () => router.navigate('/admin/students') }
          })
        ]
      }),
      createElement('div', {
        className: 'quick-card card',
        children: [
          createElement('h4', { text: 'Bank Soal LAPS-Heuristik' }),
          createElement('p', { text: 'Inspeksi 4 modul praktikum, klasifikasi Bloom, dan rubrik feedback pedagogis.' }),
          createElement('button', {
            className: 'btn btn-outline btn-sm',
            text: 'Kelola Bank Soal →',
            events: { click: () => router.navigate('/admin/questions') }
          })
        ]
      }),
      createElement('div', {
        className: 'quick-card card',
        children: [
          createElement('h4', { text: 'Bank 30 Kasus CTF' }),
          createElement('p', { text: 'Inspeksi tingkat kesulitan, metadata CVE, dan statistik penyelesaian bendera.' }),
          createElement('button', {
            className: 'btn btn-outline btn-sm',
            text: 'Inspeksi CTF →',
            events: { click: () => router.navigate('/admin/ctf') }
          })
        ]
      })
    ]
  });

  content.appendChild(metricsGrid);
  content.appendChild(actionPanel);
  content.appendChild(quickLinks);
  return content;
}

export const createAdminOverviewPage = wrapAdminPage('overview', renderOverview);
