/**
 * Admin Layout Wrapper Component
 * Provides unified administrative navigation, session verification, and header controls.
 * Zero emojis, vector SVG icons, and BrandLogo compact integration.
 */

import { createElement } from '../../utils/dom.js';
import { router } from '../../app/router.js';
import { isAuthenticatedAdmin, getAdminSession, logoutAdmin } from '../../modules/admin/adminAuth.js';
import { createBrandLogo } from '../../components/BrandLogo.js';
import { createIcon } from '../../components/Icon.js';

export function wrapAdminPage(activeTab, contentFactory) {
  return function renderAdminRoute(params) {
    if (!isAuthenticatedAdmin()) {
      setTimeout(() => router.navigate('/admin/login'), 0);
      return createElement('div', {
        className: 'page-container',
        children: [createElement('p', { text: 'Memverifikasi hak akses administrator...' })]
      });
    }

    const container = createElement('div', { className: 'admin-page-container page-container' });
    const session = getAdminSession();

    // 1. Top Admin Header Bar
    const adminHeader = createElement('div', {
      className: 'admin-console-header card',
      children: [
        createElement('div', {
          className: 'admin-header-title-block',
          style: { display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' },
          children: [
            createBrandLogo({ variant: 'compact', size: 'md', href: '/admin' }),
            createElement('div', {
              className: 'admin-header-subblock',
              children: [
                createElement('div', {
                  className: 'admin-status-pill',
                  children: [
                    createElement('span', { className: 'live-pulse-dot' }),
                    createElement('span', { className: 'text-eyebrow', text: 'ADMIN CONSOLE ACTIVE' })
                  ]
                }),
                createElement('h2', { className: 'admin-console-heading', text: 'Pusat Kendali & Riset Administrasi', style: { margin: '0.2rem 0' } }),
                createElement('span', {
                  className: 'text-caption',
                  text: `Otentikasi: ${session?.user?.email || 'admin@idslab.local'} • Role: Lead Researcher`
                })
              ]
            })
          ]
        }),
        createElement('div', {
          className: 'admin-header-actions',
          style: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
          children: [
            createElement('button', {
              className: 'btn btn-secondary btn-sm',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem' },
              children: [
                createElement('span', { text: 'Buka View Siswa' }),
                createIcon({ name: 'externalLink', size: 14 })
              ],
              events: {
                click: () => router.navigate('/dashboard')
              }
            }),
            createElement('button', {
              className: 'btn btn-outline btn-sm',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem' },
              children: [
                createIcon({ name: 'logOut', size: 14 }),
                createElement('span', { text: 'Log Keluar' })
              ],
              events: {
                click: () => {
                  logoutAdmin();
                  router.navigate('/admin/login');
                }
              }
            })
          ]
        })
      ]
    });

    // 2. Admin Navigation Tabs
    const tabsList = [
      { id: 'overview', label: 'Ringkasan', path: '/admin' },
      { id: 'students', label: 'Manajemen Siswa', path: '/admin/students' },
      { id: 'questions', label: 'Bank Soal LAPS', path: '/admin/questions' },
      { id: 'ctf', label: 'Kasus CTF (30)', path: '/admin/ctf' },
      { id: 'analytics', label: 'Analisis Pembelajaran', path: '/admin/analytics' },
      { id: 'research', label: 'Dataset Riset & Ekspor', path: '/admin/research' },
      { id: 'audit', label: 'Audit Log Sistem', path: '/admin/audit-logs' }
    ];

    const adminNav = createElement('nav', {
      className: 'admin-subnav-bar',
      children: tabsList.map(tab => createElement('button', {
        className: `admin-nav-tab ${activeTab === tab.id ? 'active' : ''}`,
        text: tab.label,
        events: {
          click: () => router.navigate(tab.path)
        }
      }))
    });

    // 3. Child View
    const pageContent = contentFactory ? contentFactory(params) : createElement('div');

    container.appendChild(adminHeader);
    container.appendChild(adminNav);
    container.appendChild(pageContent);

    return container;
  };
}

export default wrapAdminPage;
