/**
 * Admin Login Page
 * Route: /admin/login
 * Professional, minimal, secure authentication experience with BrandLogo primary lockup.
 * Zero emojis, clean vector icons.
 */

import { createElement } from '../../utils/dom.js';
import { router } from '../../app/router.js';
import { loginAdmin, isAuthenticatedAdmin } from '../../modules/admin/adminAuth.js';
import { createBrandLogo } from '../../components/BrandLogo.js';
import { createIcon } from '../../components/Icon.js';

export function createAdminLoginPage() {
  if (isAuthenticatedAdmin()) {
    setTimeout(() => router.navigate('/admin'), 0);
  }

  const container = createElement('div', { className: 'admin-login-page page-container' });

  const loginCard = createElement('div', {
    className: 'admin-auth-card card',
    children: [
      createElement('div', {
        className: 'auth-header-block',
        style: { textAlign: 'center', marginBottom: '1.75rem' },
        children: [
          createElement('div', {
            style: { display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' },
            children: [
              createBrandLogo({ variant: 'primary', size: 'lg' })
            ]
          }),
          createElement('div', {
            className: 'admin-badge-row',
            style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.75rem' },
            children: [
              createElement('span', { className: 'badge badge-primary', text: 'SECURITY ADMINISTRATION' }),
              createElement('span', { className: 'badge badge-neutral', text: 'RESEARCH PORTAL' })
            ]
          }),
          createElement('h1', { className: 'auth-title', text: 'Admin Workstation', style: { margin: '0 0 0.5rem' } }),
          createElement('p', {
            className: 'auth-subtitle',
            style: { color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' },
            text: 'Masuk untuk mengelola instrumen penelitian, bank soal LAPS, analitik siswa, dan dataset telemetri.'
          })
        ]
      }),

      createElement('form', {
        className: 'admin-auth-form',
        events: {
          submit: (e) => {
            e.preventDefault();
            const emailInput = container.querySelector('#admin-email');
            const passInput = container.querySelector('#admin-password');
            const errorMsg = container.querySelector('#admin-auth-error');

            const res = loginAdmin(emailInput.value, passInput.value);
            if (res.success) {
              router.navigate('/admin');
            } else {
              if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = res.error;
              }
            }
          }
        },
        children: [
          createElement('div', {
            id: 'admin-auth-error',
            className: 'alert alert-danger',
            style: { display: 'none', marginBottom: '1.25rem', fontSize: '0.85rem' }
          }),

          createElement('div', {
            className: 'form-group',
            children: [
              createElement('label', {
                className: 'form-label',
                attributes: { for: 'admin-email' },
                text: 'Email Administrator'
              }),
              createElement('input', {
                id: 'admin-email',
                className: 'form-input',
                attributes: {
                  type: 'email',
                  required: 'true',
                  value: 'admin@idslab.local',
                  placeholder: 'admin@idslab.local'
                }
              })
            ]
          }),

          createElement('div', {
            className: 'form-group',
            children: [
              createElement('label', {
                className: 'form-label',
                attributes: { for: 'admin-password' },
                text: 'Kata Sandi Administrator'
              }),
              createElement('input', {
                id: 'admin-password',
                className: 'form-input',
                attributes: {
                  type: 'password',
                  required: 'true',
                  value: 'AdminSecurity2026!',
                  placeholder: '••••••••••••••••'
                }
              })
            ]
          }),

          createElement('div', {
            className: 'auth-meta-hint',
            children: [
              createElement('span', { className: 'text-caption', text: 'Kredensial Default Demo: admin@idslab.local / AdminSecurity2026!' })
            ]
          }),

          createElement('div', {
            className: 'auth-actions-row',
            style: { marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
            children: [
              createElement('button', {
                className: 'btn btn-primary btn-block btn-lg',
                attributes: { type: 'submit' },
                style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
                children: [
                  createElement('span', { text: 'Otentikasi & Masuk Konsol' }),
                  createIcon({ name: 'arrowRight', size: 16 })
                ]
              }),
              createElement('button', {
                className: 'btn btn-ghost btn-block btn-sm',
                attributes: { type: 'button' },
                style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
                children: [
                  createIcon({ name: 'arrowLeft', size: 14 }),
                  createElement('span', { text: 'Kembali ke Halaman Siswa' })
                ],
                events: {
                  click: () => router.navigate('/dashboard')
                }
              })
            ]
          })
        ]
      })
    ]
  });

  container.appendChild(loginCard);
  return container;
}

export default createAdminLoginPage;
