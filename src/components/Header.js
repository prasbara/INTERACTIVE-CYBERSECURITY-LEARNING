/**
 * Header Component (Enterprise Editorial SOC Header)
 * Vector BrandLogo, desktop nav links, accessible search modal,
 * notifications based on real state events, and profile access.
 * Zero emojis, clean typography, SVG icons only.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { icons } from '../utils/icons.js';
import { createBrandLogo } from './BrandLogo.js';
import { createIcon } from './Icon.js';
import { openModal } from './Modal.js';

export function createHeader() {
  const header = createElement('header', { className: 'app-header' });

  function render() {
    header.innerHTML = '';
    const state = store.getState();
    const student = state.student || {};
    const theme = state.settings?.theme || 'system';
    const currentPath = window.location.pathname;

    // 1. Brand Logo
    const brand = createBrandLogo({
      variant: theme === 'dark' ? 'light' : 'primary',
      size: 'md',
      className: 'header-brand',
      onClick: () => router.navigate('/dashboard')
    });

    // 2. Desktop Navigation Links (Section 3: Dashboard, Learning Path, Portfolio, Leaderboard)
    const navItems = [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/learning-path', label: 'Learning Path' },
      { path: '/portfolio', label: 'Portfolio' },
      { path: '/leaderboard', label: 'Leaderboard' }
    ];

    const desktopNav = createElement('nav', {
      className: 'header-nav',
      attributes: { 'aria-label': 'Navigasi Utama' },
      children: navItems.map(item => {
        const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
        return createElement('button', {
          className: `header-nav-link ${isActive ? 'active' : ''}`,
          text: item.label,
          events: {
            click: () => router.navigate(item.path)
          }
        });
      })
    });

    // Mobile Title Helper
    const mobileTitle = createElement('div', {
      className: 'header-mobile-title',
      text: getMobileTitleForPath(currentPath)
    });

    // 3. Search Trigger
    const searchBtn = createElement('button', {
      className: 'header-search-btn',
      attributes: { 'aria-label': 'Pencarian cepat modul dan investigasi' },
      children: [
        createIcon({ name: 'search', size: 14 }),
        createElement('span', { text: 'Cari modul / kasus...' }),
        createElement('kbd', { className: 'header-search-kbd', text: 'Ctrl+K' })
      ],
      events: {
        click: () => openQuickSearchModal()
      }
    });

    // 4. Notification Bell (Shows actual achievements from state)
    const recentBadges = state.gamification?.badges || [];
    const hasUnread = recentBadges.length > 0;

    const notificationBtn = createElement('button', {
      className: 'btn btn-icon btn-ghost header-notification-btn',
      attributes: { 'aria-label': 'Lihat riwayat notifikasi pencapaian' },
      children: [
        createIcon({ name: 'bell', size: 16 }),
        hasUnread ? createElement('span', { className: 'notification-badge-dot' }) : null
      ].filter(Boolean),
      events: {
        click: () => openNotificationsModal(state)
      }
    });

    // 5. User Profile Pill
    const userPill = createElement('div', {
      className: 'header-user-pill',
      attributes: { 'aria-label': 'Profil Siswa' },
      children: [
        createIcon({ name: 'user', size: 15, className: 'user-icon-wrap' }),
        createElement('span', {
          className: 'user-name',
          text: student.name ? `${student.name} • ${student.className || 'XI TJKT'}` : 'Guest Analyst (Belum Terdaftar)'
        })
      ],
      events: {
        click: () => router.navigate('/profile')
      }
    });

    // 6. Header Actions (Search, Notification, Theme, Research, Admin)
    const actions = createElement('div', {
      className: 'header-actions',
      children: [
        searchBtn,
        notificationBtn,
        createElement('button', {
          className: 'btn btn-icon btn-ghost theme-toggle-btn',
          attributes: { 'aria-label': 'Ubah tema tampilan' },
          html: theme === 'dark' ? icons.moon : icons.sun,
          events: {
            click: () => {
              const nextTheme = theme === 'system' ? 'dark' : (theme === 'dark' ? 'light' : 'system');
              const settings = { ...state.settings, theme: nextTheme };
              store.setState({ settings });
              document.documentElement.setAttribute('data-theme', nextTheme);
              render();
            }
          }
        }),
        createElement('button', {
          className: 'btn btn-sm btn-outline research-btn',
          text: 'Riset',
          events: {
            click: () => router.navigate('/research')
          }
        }),
        createElement('button', {
          className: 'btn btn-sm btn-ghost admin-portal-btn',
          style: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem' },
          children: [
            createElement('span', { text: 'Admin' }),
            createIcon({ name: 'externalLink', size: 13 })
          ],
          events: {
            click: () => router.navigate('/admin')
          }
        })
      ]
    });

    header.appendChild(brand);
    header.appendChild(desktopNav);
    header.appendChild(mobileTitle);
    header.appendChild(userPill);
    header.appendChild(actions);
  }

  // Keyboard shortcut Ctrl+K
  const handleKeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openQuickSearchModal();
    }
  };
  window.addEventListener('keydown', handleKeydown);

  store.subscribe(() => {
    render();
  });

  render();
  return header;
}

function getMobileTitleForPath(path) {
  if (path === '/dashboard') return 'Dashboard';
  if (path === '/learning-path') return 'Learning Path';
  if (path === '/portfolio' || path === '/review') return 'Portfolio';
  if (path === '/leaderboard') return 'Leaderboard';
  if (path === '/profile') return 'Profile';
  if (path.startsWith('/meeting/')) return `Lab ${path.split('/')[2]}`;
  if (path.startsWith('/ctf')) return 'CTF';
  if (path === '/pre-test') return 'Pre-Test';
  if (path === '/post-test') return 'Post-Test';
  return 'IDS Lab';
}

function openQuickSearchModal() {
  const input = createElement('input', {
    className: 'form-control',
    attributes: {
      type: 'search',
      placeholder: 'Ketik nama lab, materi, kasus CTF, atau evidence...',
      autofocus: 'true'
    }
  });

  const resultsContainer = createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', maxHeight: '320px', overflowY: 'auto' }
  });

  const searchableItems = [
    { title: 'Pre-Test Kemampuan Awal', path: '/pre-test', category: 'Asesmen' },
    { title: 'Lab 01: Understand — Memahami Masalah & Sensor IDS', path: '/meeting/1', category: 'Modul LAPS' },
    { title: 'Lab 02: Plan — Merencanakan Rules & Pola Deteksi', path: '/meeting/2', category: 'Modul LAPS' },
    { title: 'Lab 03: Execute — Triase Alert & Verifikasi Bukti', path: '/meeting/3', category: 'Modul LAPS' },
    { title: 'Lab 04: Review — Evaluasi Insiden & Respon Mitigasi', path: '/meeting/4', category: 'Modul LAPS' },
    { title: 'Bank Kasus Real-Case CTF (30 Skenario)', path: '/ctf', category: 'CTF Challenge' },
    { title: 'Post-Test Evaluasi Akhir', path: '/post-test', category: 'Asesmen' },
    { title: 'Portofolio LAPS — Catatan Siklus Investigasi', path: '/portfolio', category: 'Portofolio' },
    { title: 'Klasemen SOC & Peringkat Siswa', path: '/leaderboard', category: 'Klasemen' },
    { title: 'Evidence Tersimpan (Personal Notebook)', path: '/evidence', category: 'Catatan' },
    { title: 'Metrik Kemampuan Berpikir Kritis', path: '/metrics', category: 'Analitik' },
    { title: 'Data Riset S1 Skripsi (Telemetri & Gain)', path: '/research', category: 'Penelitian' },
    { title: 'Konfigurasi Sistem & Preferensi Tampilan', path: '/settings', category: 'Pengaturan' }
  ];

  function updateResults(q = '') {
    resultsContainer.innerHTML = '';
    const query = q.toLowerCase().trim();
    const filtered = query
      ? searchableItems.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
      : searchableItems.slice(0, 6);

    if (filtered.length === 0) {
      resultsContainer.appendChild(createElement('div', {
        className: 'text-muted text-sm',
        style: { textAlign: 'center', padding: '1.5rem 0' },
        text: 'Tidak ada modul atau fitur yang cocok dengan kata kunci pencarian.'
      }));
      return;
    }

    filtered.forEach(item => {
      const row = createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          cursor: 'pointer'
        },
        children: [
          createElement('div', {
            children: [
              createElement('div', { text: item.title, style: { fontWeight: '500', fontSize: '0.9rem' } }),
              createElement('span', { className: 'badge badge-outline text-xs', text: item.category })
            ]
          }),
          createIcon({ name: 'arrowRight', size: 14 })
        ],
        events: {
          click: () => {
            router.navigate(item.path);
          }
        }
      });
      resultsContainer.appendChild(row);
    });
  }

  input.addEventListener('input', (e) => updateResults(e.target.value));
  updateResults('');

  const content = createElement('div', {
    children: [input, resultsContainer]
  });

  openModal({
    title: 'Pencarian Cepat SOC Platform',
    content,
    buttons: [
      { text: 'Tutup', variant: 'secondary' }
    ]
  });
}

function openNotificationsModal(state) {
  const badges = state.gamification?.badges || [];
  const events = (state.analytics?.events || []).slice(-10).reverse();

  const content = createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' },
    children: [
      createElement('h4', { text: 'Prestasi & Lencana Terverifikasi', style: { margin: '0 0 0.25rem 0', fontSize: '0.95rem' } }),
      badges.length > 0
        ? createElement('div', {
            style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
            children: badges.map(b => createElement('span', { className: 'badge badge-success', text: b.name || b.id }))
          })
        : createElement('p', { className: 'text-muted text-sm', text: 'Belum ada lencana baru. Selesaikan lab atau pecahkan flag CTF untuk membuka lencana.' }),
      createElement('h4', { text: 'Riwayat Aktivitas Terkini', style: { margin: '0.5rem 0 0.25rem 0', fontSize: '0.95rem' } }),
      events.length > 0
        ? createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
            children: events.map(ev => createElement('div', {
              style: { fontSize: '0.82rem', padding: '0.4rem 0.6rem', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' },
              children: [
                createElement('strong', { text: `${ev.type} ` }),
                createElement('span', { className: 'text-muted', text: `• ${new Date(ev.timestamp).toLocaleTimeString('id-ID')}` })
              ]
            }))
          })
        : createElement('p', { className: 'text-muted text-sm', text: 'Belum ada rekaman aktivitas belajar.' })
    ]
  });

  openModal({
    title: 'Notifikasi & Telemetri Analis',
    content,
    buttons: [
      { text: 'Tutup', variant: 'secondary' }
    ]
  });
}

export default createHeader;
