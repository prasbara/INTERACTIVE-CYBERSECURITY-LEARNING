/**
 * Sidebar Navigation Component
 * Enterprise Cybersecurity SOC navigation with vector icons, live status indicators,
 * and high-contrast LAPS-Heuristik phases. Zero emojis.
 */

import { createElement } from '../utils/dom.js';
import { router } from '../app/router.js';
import { store } from '../app/state.js';
import { calculateMeetingProgress, getRecommendedActivity } from '../modules/analytics/progressTracker.js';
import { icons, renderIcon } from '../utils/icons.js';
import { createIcon } from './Icon.js';

export function createSidebar() {
  const sidebar = createElement('aside', { className: 'app-sidebar' });

  function render() {
    sidebar.innerHTML = '';
    const currentPath = window.location.pathname;
    const state = store.getState();
    const recommended = getRecommendedActivity();

    // 1. Fast CTA: Continue Learning
    const ctaBox = createElement('div', {
      className: 'sidebar-cta-box',
      children: [
        createElement('span', { className: 'cta-label', text: 'AKTIVITAS REKOMENDASI' }),
        createElement('button', {
          className: 'btn btn-primary btn-sm btn-block cta-action-btn',
          style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' },
          children: [
            createIcon({ name: 'play', size: 12, className: 'cta-play-icon' }),
            createElement('span', { text: recommended.label.split(':')[0] })
          ],
          events: {
            click: () => router.navigate(recommended.path)
          }
        })
      ]
    });
    sidebar.appendChild(ctaBox);

    // 2. Navigation List
    const nav = createElement('nav', { className: 'sidebar-nav' });
    const list = createElement('ul', { className: 'nav-list' });

    // Status helper returning SVG
    function getStatusSvg(isCompleted, isInProgress) {
      if (isCompleted) {
        return renderIcon('check', { size: 12 });
      }
      if (isInProgress) {
        return `<span class="status-indicator-dot active" style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--primary);margin:auto;"></span>`;
      }
      return `<span class="status-indicator-dot pending" style="display:inline-block;width:6px;height:6px;border-radius:50%;border:1px solid var(--border);margin:auto;"></span>`;
    }

    const pretestDone = state.scores?.pretest !== null;
    const posttestDone = state.scores?.posttest !== null;
    const m1Prog = calculateMeetingProgress(1);
    const m2Prog = calculateMeetingProgress(2);
    const m3Prog = calculateMeetingProgress(3);
    const m4Prog = calculateMeetingProgress(4);

    const navItems = [
      { path: '/dashboard', label: 'Dashboard SOC', iconSvg: icons.dashboard, sub: 'Ringkasan Telemetri', status: null },
      { path: '/learning-path', label: 'Peta Kurikulum', iconSvg: icons.map, sub: 'Alur LAPS-Heuristik', status: null },
      {
        path: '/pre-test',
        label: 'Pre-Test Evaluasi',
        iconSvg: icons.fileText,
        sub: 'Penalaran Awal Siswa',
        status: getStatusSvg(pretestDone, !pretestDone),
        statusClass: pretestDone ? 'status-done' : 'status-avail'
      },
      {
        path: '/meeting/1',
        label: 'Lab 01: Understand',
        iconNumber: '01',
        sub: 'Memahami Masalah & Sensor',
        status: getStatusSvg(m1Prog.completed, m1Prog.progressPercent > 0),
        statusClass: m1Prog.completed ? 'status-done' : (m1Prog.progressPercent > 0 ? 'status-active' : 'status-pending')
      },
      {
        path: '/meeting/2',
        label: 'Lab 02: Plan',
        iconNumber: '02',
        sub: 'Merencanakan Rules & Pola',
        status: getStatusSvg(m2Prog.completed, m2Prog.progressPercent > 0),
        statusClass: m2Prog.completed ? 'status-done' : (m2Prog.progressPercent > 0 ? 'status-active' : 'status-pending')
      },
      {
        path: '/meeting/3',
        label: 'Lab 03: Execute',
        iconNumber: '03',
        sub: 'Triase & Verifikasi Bukti',
        status: getStatusSvg(m3Prog.completed, m3Prog.progressPercent > 0),
        statusClass: m3Prog.completed ? 'status-done' : (m3Prog.progressPercent > 0 ? 'status-active' : 'status-pending')
      },
      {
        path: '/meeting/4',
        label: 'Lab 04: Review',
        iconNumber: '04',
        sub: 'Evaluasi & Respon Insiden',
        status: getStatusSvg(m4Prog.completed, m4Prog.progressPercent > 0),
        statusClass: m4Prog.completed ? 'status-done' : (m4Prog.progressPercent > 0 ? 'status-active' : 'status-pending')
      },
      {
        path: '/ctf',
        label: 'Real-Case CTF',
        iconSvg: icons.flag,
        sub: '30 Skenario Nyata',
        status: null
      },
      {
        path: '/post-test',
        label: 'Post-Test Evaluasi',
        iconSvg: icons.award,
        sub: 'Pengukuran Akhir',
        status: getStatusSvg(posttestDone, !posttestDone && m4Prog.completed),
        statusClass: posttestDone ? 'status-done' : 'status-pending'
      },
      { path: '/review', label: 'Portofolio LAPS', iconSvg: icons.activity, sub: 'Log Catatan Investigasi', status: null },
      { path: '/leaderboard', label: 'Klasemen SOC', iconSvg: icons.target, sub: 'Peringkat & Skor XP', status: null },
      { path: '/profile', label: 'Identitas & Lencana', iconSvg: icons.user, sub: 'Profil Siswa', status: null },
      { path: '/bookmarks', label: 'Evidence Tersimpan', iconSvg: icons.bookmark, sub: 'Pin Catatan Riset', status: null },
      { path: '/progress', label: 'Metrik Kemampuan', iconSvg: icons.activity, sub: 'Analitik Berpikir Kritis', status: null },
      { path: '/research', label: 'Data Riset S1', iconSvg: icons.cpu, sub: 'Instrumen Penelitian', status: null },
      { path: '/settings', label: 'Konfigurasi Sistem', iconSvg: icons.settings, sub: 'Preferensi & Data', status: null }
    ];

    navItems.forEach(item => {
      const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
      const li = createElement('li', { className: 'nav-item' });

      const link = createElement('button', {
        className: `nav-link ${isActive ? 'active' : ''}`,
        events: {
          click: () => router.navigate(item.path)
        }
      });

      // Status indicator
      if (item.status) {
        link.appendChild(createElement('span', {
          className: `nav-status-bullet ${item.statusClass}`,
          style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
          html: item.status
        }));
      }

      // Icon: either number badge or SVG
      if (item.iconNumber) {
        link.appendChild(createElement('span', {
          className: 'nav-number-badge',
          text: item.iconNumber
        }));
      } else if (item.iconSvg) {
        link.appendChild(createElement('span', {
          className: 'nav-icon-svg',
          html: item.iconSvg
        }));
      }

      // Labels
      const labelGroup = createElement('div', { className: 'nav-label-group' });
      labelGroup.appendChild(createElement('span', { className: 'nav-label', text: item.label }));
      if (item.sub) {
        labelGroup.appendChild(createElement('span', { className: 'nav-sub', text: item.sub }));
      }
      link.appendChild(labelGroup);

      li.appendChild(link);
      list.appendChild(li);
    });

    nav.appendChild(list);
    sidebar.appendChild(nav);
  }

  window.addEventListener('popstate', render);
  store.subscribe(render);
  render();

  return sidebar;
}

export default createSidebar;
