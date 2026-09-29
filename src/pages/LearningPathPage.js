/**
 * Learning Path Page (Redesigned)
 * Route: /learning-path
 * Premium editorial curriculum interface: generous whitespace, large typography,
 * clear LAPS heuristic stage progression.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { meetingsData } from '../data/meetings.js';
import { calculateMeetingProgress, getRecommendedActivity } from '../modules/analytics/progressTracker.js';
import { openModal } from '../components/Modal.js';
import { icons } from '../utils/icons.js';

export function createLearningPathPage() {
  const container = createElement('div', { className: 'learning-path-page page-container' });
  const state = store.getState();
  const recommended = getRecommendedActivity();

  const header = createElement('div', {
    className: 'learning-path-editorial-header card',
    children: [
      createElement('span', { className: 'text-eyebrow', text: 'SILABUS LAPS-HEURISTIK SMK TJKT' }),
      createElement('h1', { text: 'Alur Kurikulum & Investigasi' }),
      createElement('p', {
        className: 'text-muted',
        text: 'Kurikulum praktikum terstruktur 4 pertemuan berbasis pemecahan masalah heuristik. Setiap modul dirancang untuk mengasah dimensi kognitif analisis, inferensi, dan evaluasi keamanan jaringan.'
      })
    ]
  });

  const flowchartContainer = createElement('div', { className: 'editorial-path-flow' });

  // 1. Pre-Test Node
  const pretestDone = state.scores?.pretest !== null;
  const pretestNode = renderCurriculumCard({
    stepNumber: '00',
    stageLabel: 'DIAGNOSTIK AWAL',
    title: 'Pre-Test Kemampuan Berpikir Kritis',
    subTitle: 'Evaluasi Baseline Awal Pemahaman Keamanan & Penalaran',
    progress: pretestDone ? 100 : 0,
    statusText: pretestDone ? `Tuntas (${state.scores.pretest}%)` : 'Tersedia',
    estimatedTime: '15 Menit',
    path: '/pre-test',
    isRecommended: recommended.path === '/pre-test',
    objective: 'Mengukur pemahaman awal sebelum intervensi pembelajaran LAPS-Heuristik.'
  });
  flowchartContainer.appendChild(pretestNode);

  // 2. Four Meeting Nodes
  const timeEstimates = ['45 Menit', '45 Menit', '50 Menit', '60 Menit'];
  meetingsData.forEach((m, idx) => {
    const prog = calculateMeetingProgress(m.id);
    const isCompleted = prog.completed;
    const isRec = recommended.path === `/meeting/${m.id}`;

    const mNode = renderCurriculumCard({
      stepNumber: `0${m.id}`,
      stageLabel: `LAPS — ${m.lapsStage.toUpperCase()}`,
      title: m.title,
      subTitle: m.description,
      heuristicQuestion: m.heuristicQuestion,
      progress: prog.progressPercent,
      statusText: isCompleted ? 'Tuntas' : (prog.progressPercent > 0 ? `${prog.progressPercent}%` : 'Tersedia'),
      estimatedTime: timeEstimates[idx],
      path: `/meeting/${m.id}`,
      isRecommended: isRec,
      objective: m.description
    });

    flowchartContainer.appendChild(mNode);
  });

  // 3. Post-Test Node
  const posttestDone = state.scores?.posttest !== null;
  const posttestNode = renderCurriculumCard({
    stepNumber: '05',
    stageLabel: 'EVALUASI AKHIR',
    title: 'Post-Test Kemampuan Berpikir Kritis',
    subTitle: 'Pengukuran Akhir Kemampuan Analisis & Pengambilan Keputusan',
    progress: posttestDone ? 100 : 0,
    statusText: posttestDone ? `Tuntas (${state.scores.posttest}%)` : 'Tersedia',
    estimatedTime: '20 Menit',
    path: '/post-test',
    isRecommended: recommended.path === '/post-test',
    objective: 'Mengukur peningkatan kemampuan berpikir kritis setelah seluruh tahapan LAPS selesai.'
  });
  flowchartContainer.appendChild(posttestNode);

  container.appendChild(header);
  container.appendChild(flowchartContainer);

  return container;
}

function renderCurriculumCard(info) {
  const isDone = info.progress === 100;
  const card = createElement('div', {
    className: `curriculum-editorial-card card ${info.isRecommended ? 'card-recommended' : ''}`,
    children: [
      createElement('div', {
        className: 'curriculum-card-left',
        children: [
          createElement('span', { className: 'curriculum-step-num', text: info.stepNumber }),
          createElement('div', {
            className: 'curriculum-meta',
            children: [
              createElement('div', {
                className: 'curriculum-tag-row',
                children: [
                  createElement('span', { className: 'badge badge-primary', text: info.stageLabel }),
                  info.isRecommended ? createElement('span', { className: 'badge badge-accent', text: 'Rekomendasi' }) : null,
                  createElement('span', {
                    className: `badge ${isDone ? 'badge-success' : 'badge-neutral'}`,
                    text: info.statusText
                  })
                ].filter(Boolean)
              }),
              createElement('h3', { className: 'curriculum-title', text: info.title }),
              createElement('p', { className: 'curriculum-subtitle', text: info.subTitle }),
              info.heuristicQuestion ? createElement('p', {
                className: 'curriculum-heuristic-quote',
                text: `Pertanyaan Pengarah: "${info.heuristicQuestion}"`
              }) : null
            ]
          })
        ]
      }),
      createElement('div', {
        className: 'curriculum-card-right',
        children: [
          createElement('div', {
            className: 'curriculum-progress-track',
            children: [
              createElement('div', {
                className: 'curriculum-progress-fill',
                style: { width: `${info.progress}%` }
              })
            ]
          }),
          createElement('span', { className: 'text-caption', text: `Estimasi: ${info.estimatedTime}` }),
          createElement('button', {
            className: `btn ${info.isRecommended ? 'btn-primary' : 'btn-secondary'} btn-block`,
            text: isDone ? 'Tinjau Materi →' : 'Lanjutkan Belajar →',
            events: {
              click: () => router.navigate(info.path)
            }
          })
        ]
      })
    ]
  });

  return card;
}
