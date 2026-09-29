/**
 * Progress / Metrics Page (Metrik Kemampuan Belajar Analis SOC)
 * Honest pedagogical metrics based on actual learning activities:
 * - Learning Performance (Evidence Analysis, Alert Triage, Log Interpretation, Incident Reasoning)
 * - Domain Performance (LAPS Phase 01 to 04 Progression)
 * - Comparative Assessments (Pre-Test vs Post-Test)
 * Zero psychometric pseudo-scores, zero fake statistics, pure SVG icons.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { meetingsData } from '../data/meetings.js';
import { calculateOverallProgress, calculateMeetingProgress } from '../modules/analytics/progressTracker.js';
import { createProgressBar } from '../components/ProgressBar.js';
import { createIcon } from '../components/Icon.js';

export function createProgressPage() {
  const container = createElement('div', { className: 'progress-page page-container' });

  function render() {
    container.innerHTML = '';
    const state = store.getState();
    const overall = calculateOverallProgress(state);
    const activities = state.activities || {};
    const triageDecisions = state.triageDecisions || {};
    const ctfSolved = state.ctf?.completedChallenges || [];

    // 1. Header Banner
    const headerCard = createElement('div', {
      className: 'progress-header card',
      children: [
        createElement('div', {
          className: 'hero-badges-row',
          children: [
            createElement('span', { className: 'badge badge-primary', text: 'METRIK KEMAMPUAN' }),
            createElement('span', { className: 'badge badge-neutral', text: 'LAPS–HEURISTIK EVALUATION' })
          ]
        }),
        createElement('h1', { text: 'Metrik Kemampuan & Performa Analis' }),
        createElement('p', {
          className: 'text-muted',
          text: 'Rekapitulasi pencapaian kompetensi teknis dan analitis berbasis data nyata pengerjaan modul, investigasi log, triase alert, dan asesmen resmi.'
        }),
        createProgressBar({
          value: overall.percent,
          max: 100,
          label: 'Ketercapaian Keseluruhan Modul Pembelajaran',
          showPercentage: true
        })
      ]
    });
    container.appendChild(headerCard);

    // 2. Learning & Domain Performance Metrics
    // Compute actual rates from activities
    const m1Prog = calculateMeetingProgress(1, state);
    const m2Prog = calculateMeetingProgress(2, state);
    const m3Prog = calculateMeetingProgress(3, state);
    const m4Prog = calculateMeetingProgress(4, state);

    const hasEnoughData = overall.answeredActivities >= 3;

    const metricsSection = createElement('div', {
      className: 'card',
      style: { padding: '1.75rem', margin: '1.5rem 0' },
      children: [
        createElement('h3', { text: 'Learning & Investigation Performance', style: { margin: '0 0 0.5rem 0' } }),
        createElement('p', {
          className: 'text-muted text-sm',
          style: { margin: '0 0 1.25rem 0' },
          text: 'Dihitung secara objektif dari penyelesaian soal latihan fakta vs opini, rancangan topologi, triase alert SOC, dan validasi flag kasus nyata.'
        }),
        hasEnoughData
          ? createElement('div', {
              style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' },
              children: [
                createMetricBar('Evidence Analysis', m1Prog.progressPercent, 'Analisis fakta vs opini pada log mentah'),
                createMetricBar('Log Interpretation', m2Prog.progressPercent, 'Korelasi sensor NIDS/HIDS & identifikasi pola'),
                createMetricBar('Alert Triage Accuracy', m3Prog.progressPercent, 'Klasifikasi True Positive vs False Positive'),
                createMetricBar('Incident Reasoning', m4Prog.progressPercent, 'Validasi timeline bukti, mitigasi, & refleksi LAPS')
              ]
            })
          : createElement('div', {
              style: {
                padding: '2rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--color-surface-soft)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              },
              children: [
                createIcon({ name: 'info', size: 24, className: 'text-muted' }),
                createElement('h4', { text: 'Belum Cukup Data untuk Menampilkan Metrik', style: { margin: '0.5rem 0 0.25rem 0' } }),
                createElement('p', {
                  className: 'text-muted text-sm',
                  style: { maxWidth: '480px', margin: '0 auto 1rem' },
                  text: 'Selesaikan aktivitas latihan analisis log dan triase di Lab 01–04 untuk membentuk metrik evaluasi kompetensi Anda.'
                }),
                createElement('button', {
                  className: 'btn btn-primary btn-sm',
                  text: 'Lanjutkan Lab Pembelajaran →',
                  events: { click: () => router.navigate('/learning-path') }
                })
              ]
            })
      ]
    });
    container.appendChild(metricsSection);

    // 3. Pre-Test vs Post-Test Assessment Comparison
    const preScore = state.scores?.pretest;
    const postScore = state.scores?.posttest;
    const gain = (preScore !== null && preScore !== undefined && postScore !== null && postScore !== undefined)
      ? (postScore - preScore)
      : null;

    const assessmentComparison = createElement('div', {
      className: 'card',
      style: { padding: '1.75rem', margin: '1.5rem 0' },
      children: [
        createElement('h3', { text: 'Hasil Pengukuran Evaluasi Kognitif', style: { margin: '0 0 0.25rem 0' } }),
        createElement('p', {
          className: 'text-muted text-sm',
          style: { margin: '0 0 1.25rem 0' },
          text: 'Evaluasi penalaran awal (Pre-Test) dibandingkan dengan evaluasi akhir (Post-Test) untuk keperluan instrumen riset skripsi.'
        }),
        createElement('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
          children: [
            createElement('div', {
              className: 'stat-compact-card card',
              children: [
                createElement('span', { className: 'stat-label', text: 'PRE-TEST (BASELINE)' }),
                createElement('span', {
                  className: 'stat-number',
                  text: preScore !== null && preScore !== undefined ? `${preScore}%` : 'Belum Dikerjakan'
                }),
                createElement('span', { className: 'stat-sub', text: 'Diambil sebelum memulai materi' })
              ]
            }),
            createElement('div', {
              className: 'stat-compact-card card',
              children: [
                createElement('span', { className: 'stat-label', text: 'POST-TEST (EVALUASI AKHIR)' }),
                createElement('span', {
                  className: 'stat-number',
                  text: postScore !== null && postScore !== undefined ? `${postScore}%` : (overall.completedMeetings === 4 ? 'Siap Dikerjakan' : 'Belum Dimulai')
                }),
                createElement('span', { className: 'stat-sub', text: 'Diambil setelah seluruh lab tuntas' })
              ]
            }),
            createElement('div', {
              className: 'stat-compact-card card',
              children: [
                createElement('span', { className: 'stat-label', text: 'PENINGKATAN (GAIN)' }),
                createElement('span', {
                  className: `stat-number ${gain !== null && gain >= 0 ? 'text-success' : 'text-muted'}`,
                  text: gain !== null ? `${gain >= 0 ? '+' : ''}${gain}%` : 'Menunggu Post-Test'
                }),
                createElement('span', { className: 'stat-sub', text: 'Selisih perolehan skor' })
              ]
            })
          ]
        })
      ]
    });
    container.appendChild(assessmentComparison);

    // 4. Lab 01–04 Detailed Breakdown List
    const list = createElement('div', {
      className: 'meeting-progress-list',
      style: { display: 'flex', flexDirection: 'column', gap: '1rem' }
    });

    meetingsData.forEach(meeting => {
      const prog = calculateMeetingProgress(meeting.id, state);
      const isCompleted = prog.completed;

      const item = createElement('div', {
        className: 'progress-item-card card',
        children: [
          createElement('div', {
            className: 'progress-item-header',
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
            children: [
              createElement('h4', { text: `Pertemuan ${meeting.id}: ${meeting.title}`, style: { margin: 0 } }),
              createElement('span', {
                className: `badge ${isCompleted ? 'badge-success' : (prog.progressPercent > 0 ? 'badge-primary' : 'badge-neutral')}`,
                text: isCompleted ? 'Tuntas' : `${prog.progressPercent}%`
              })
            ]
          }),
          createElement('p', { className: 'text-muted text-sm', text: meeting.description }),
          createProgressBar({ value: prog.progressPercent, max: 100, showPercentage: false }),
          createElement('div', {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.8rem' },
            children: [
              createElement('span', { className: 'text-muted', text: `Aktivitas: ${prog.answeredCount} dari ${prog.totalCount} diselesaikan` }),
              createElement('button', {
                className: 'btn btn-outline btn-sm',
                text: isCompleted ? 'Tinjau Materi' : 'Lanjutkan Lab',
                events: { click: () => router.navigate(`/meeting/${meeting.id}`) }
              })
            ]
          })
        ]
      });

      list.appendChild(item);
    });

    container.appendChild(list);
  }

  store.subscribe(() => {
    render();
  });

  render();
  return container;
}

function createMetricBar(title, percent, desc) {
  const container = createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
    children: [
      createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        children: [
          createElement('strong', { text: title, style: { fontSize: '0.9rem' } }),
          createElement('span', { className: 'font-mono text-sm', text: `${percent}%` })
        ]
      }),
      createProgressBar({ value: percent, max: 100, showPercentage: false }),
      createElement('span', { className: 'text-muted text-xs', text: desc })
    ]
  });
  return container;
}

export default createProgressPage;
