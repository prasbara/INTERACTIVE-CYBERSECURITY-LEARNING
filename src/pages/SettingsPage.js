/**
 * Settings Page (Konfigurasi Sistem & Preferensi)
 * Fully functional settings that directly modify application behavior:
 * - Tampilan (Theme: Light, Dark, System)
 * - Pembelajaran (Reduced Motion, Sound, Presentation Mode)
 * - Data (Export My Data JSON, Export Telemetri CSV, Reset Local Progress)
 * - Privasi (Research Data & Telemetry Status)
 * - Account (Identity & Session Reset)
 * Zero non-functional toggles, pure SVG icons.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { exportLearnerDataJSON, exportEventsCSV } from '../utils/download.js';
import { resetState } from '../app/storage.js';
import { openModal } from '../components/Modal.js';
import { showToast } from '../components/Toast.js';
import { createIcon } from '../components/Icon.js';

export function createSettingsPage() {
  const container = createElement('div', { className: 'settings-page page-container' });

  function render() {
    container.innerHTML = '';
    const state = store.getState();
    const settings = state.settings || {};
    const student = state.student || {};

    const titleCard = createElement('div', {
      className: 'settings-header card',
      children: [
        createElement('div', {
          className: 'hero-badges-row',
          children: [
            createElement('span', { className: 'badge badge-primary', text: 'KONFIGURASI SISTEM' }),
            createElement('span', { className: 'badge badge-outline', text: 'Preferensi & Manajemen Data' })
          ]
        }),
        createElement('h1', { text: 'Pengaturan & Preferensi Analis' }),
        createElement('p', {
          className: 'text-muted',
          text: 'Kelola preferensi visual antarmuka, aksesibilitas pembelajaran, ekspor data instrumen riset, dan privasi sesi belajar.'
        })
      ]
    });
    container.appendChild(titleCard);

    // 1. Tampilan (Theme: System, Light, Dark)
    const currentTheme = settings.theme || 'system';
    const themeCard = createElement('div', {
      className: 'card',
      style: { padding: '1.75rem', marginBottom: '1.25rem' },
      children: [
        createElement('h3', { text: 'Tampilan Antarmuka', style: { margin: '0 0 0.25rem 0' } }),
        createElement('p', { className: 'text-muted text-sm', style: { margin: '0 0 1.25rem 0' }, text: 'Pilih tema visual yang nyaman untuk analisis log dalam durasi panjang.' }),
        createElement('div', {
          style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
          children: [
            { id: 'system', label: 'Ikuti Sistem', icon: 'settings' },
            { id: 'light', label: 'Mode Terang (Light)', icon: 'sun' },
            { id: 'dark', label: 'Mode Gelap (Dark)', icon: 'moon' }
          ].map(opt => createElement('button', {
            className: `btn ${currentTheme === opt.id ? 'btn-primary' : 'btn-outline'}`,
            style: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
            children: [
              createIcon({ name: opt.icon, size: 14 }),
              createElement('span', { text: opt.label })
            ],
            events: {
              click: () => {
                const nextSettings = { ...settings, theme: opt.id };
                store.setState({ settings: nextSettings });
                document.documentElement.setAttribute('data-theme', opt.id);
                showToast({ type: 'info', message: `Tema diubah ke ${opt.label}.` });
                render();
              }
            }
          }))
        })
      ]
    });
    container.appendChild(themeCard);

    // 2. Pembelajaran & Aksesibilitas
    const reducedMotion = Boolean(settings.reducedMotion);
    const soundEnabled = settings.sound !== false;
    const presentationMode = Boolean(settings.presentationMode);

    const learningCard = createElement('div', {
      className: 'card',
      style: { padding: '1.75rem', marginBottom: '1.25rem' },
      children: [
        createElement('h3', { text: 'Aksesibilitas & Pengalaman Belajar', style: { margin: '0 0 0.25rem 0' } }),
        createElement('p', { className: 'text-muted text-sm', style: { margin: '0 0 1.25rem 0' }, text: 'Pengaturan interaksi untuk mendukung kenyamanan visual dan mode presentasi kelas.' }),
        createElement('div', {
          style: { display: 'flex', flexDirection: 'column', gap: '1rem' },
          children: [
            createSettingRow(
              'Reduced Motion (Kurangi Animasi)',
              'Mematikan efek transisi dan animasi berlebih demi kenyamanan mata dan aksesibilitas.',
              reducedMotion,
              (checked) => {
                const nextSettings = { ...settings, reducedMotion: checked };
                store.setState({ settings: nextSettings });
                document.documentElement.setAttribute('data-reduced-motion', checked ? 'true' : 'false');
                showToast({ type: 'info', message: checked ? 'Animasi dinonaktifkan.' : 'Animasi diaktifkan kembali.' });
                render();
              }
            ),
            createSettingRow(
              'Audio & Sound Feedback',
              'Memutar umpan balik suara halus saat flag CTF berhasil atau badge terbuka.',
              soundEnabled,
              (checked) => {
                const nextSettings = { ...settings, sound: checked };
                store.setState({ settings: nextSettings });
                showToast({ type: 'info', message: checked ? 'Efek audio diaktifkan.' : 'Efek audio dimatikan.' });
                render();
              }
            ),
            createSettingRow(
              'Mode Presentasi Proyektor (Presentation Mode)',
              'Memperbesar kontras teks dan skala elemen antarmuka saat diproyeksikan di depan kelas.',
              presentationMode,
              (checked) => {
                const nextSettings = { ...settings, presentationMode: checked };
                store.setState({ settings: nextSettings });
                document.documentElement.setAttribute('data-presentation-mode', checked ? 'true' : 'false');
                showToast({ type: 'info', message: checked ? 'Mode presentasi aktif.' : 'Mode presentasi nonaktif.' });
                render();
              }
            )
          ]
        })
      ]
    });
    container.appendChild(learningCard);

    // 3. Manajemen Data & Ekspor Riset
    const dataCard = createElement('div', {
      className: 'card',
      style: { padding: '1.75rem', marginBottom: '1.25rem' },
      children: [
        createElement('h3', { text: 'Manajemen Data Belajar Lokal', style: { margin: '0 0 0.25rem 0' } }),
        createElement('p', {
          className: 'text-muted text-sm',
          style: { margin: '0 0 1.25rem 0' },
          text: 'Seluruh histori pembelajaran, nilai pre/post test, keputusan triase, dan event telemetri tersimpan secara lokal di peramban ini (Local-First).'
        }),
        createElement('div', {
          style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
          children: [
            createElement('button', {
              className: 'btn btn-outline',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.45rem' },
              children: [
                createIcon({ name: 'download', size: 14 }),
                createElement('span', { text: 'Ekspor Data Belajar (JSON)' })
              ],
              events: {
                click: () => {
                  exportLearnerDataJSON(store.getState());
                  showToast({ type: 'success', message: 'Dataset pembelajaran JSON berhasil diunduh.' });
                }
              }
            }),
            createElement('button', {
              className: 'btn btn-outline',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.45rem' },
              children: [
                createIcon({ name: 'fileText', size: 14 }),
                createElement('span', { text: 'Ekspor Log Telemetri (CSV)' })
              ],
              events: {
                click: () => {
                  exportEventsCSV(store.getState().analytics?.events || []);
                  showToast({ type: 'success', message: 'File telemetri CSV berhasil diunduh.' });
                }
              }
            }),
            createElement('button', {
              className: 'btn btn-danger',
              style: { display: 'inline-flex', alignItems: 'center', gap: '0.45rem' },
              children: [
                createIcon({ name: 'alertTriangle', size: 14 }),
                createElement('span', { text: 'Reset Data Belajar' })
              ],
              events: {
                click: () => {
                  openModal({
                    title: 'Konfirmasi Reset Data Belajar',
                    content: 'Apakah Anda yakin ingin menghapus seluruh progres belajar, nilai asesmen, dan flag CTF di peramban ini? Tindakan ini tidak dapat dibatalkan.',
                    buttons: [
                      {
                        text: 'Ya, Reset Bersih',
                        variant: 'danger',
                        onClick: () => {
                          resetState();
                          showToast({ type: 'warning', message: 'Seluruh data telah direset kembali ke awal.' });
                          window.location.reload();
                        }
                      },
                      { text: 'Batal', variant: 'secondary' }
                    ]
                  });
                }
              }
            })
          ]
        })
      ]
    });
    container.appendChild(dataCard);

    // 4. Privasi & Status Riset
    const privacyCard = createElement('div', {
      className: 'card',
      style: { padding: '1.75rem', marginBottom: '1.25rem' },
      children: [
        createElement('h3', { text: 'Status Privasi & Instrumen Riset S1', style: { margin: '0 0 0.25rem 0' } }),
        createElement('p', {
          className: 'text-muted text-sm',
          style: { margin: '0 0 1rem 0' },
          text: 'Data yang dicatat adalah aktivitas interaksi edukatif anonim untuk keperluan validasi instrumen skripsi.'
        }),
        createElement('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' },
          children: [
            createElement('div', {
              style: { padding: '1rem', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' },
              children: [
                createElement('strong', { text: 'Status Telemetri Belajar: ', style: { fontSize: '0.85rem' } }),
                createElement('span', { className: 'badge badge-success text-xs', text: 'Aktif Lokal' }),
                createElement('p', { className: 'text-muted text-xs', style: { margin: '0.35rem 0 0' }, text: `${(state.analytics?.events || []).length} event interaksi tersimpan secara aman di peramban.` })
              ]
            }),
            createElement('div', {
              style: { padding: '1rem', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' },
              children: [
                createElement('strong', { text: 'Koneksi Cloud Backend: ', style: { fontSize: '0.85rem' } }),
                createElement('span', { className: 'badge badge-warning text-xs', text: 'Offline / Standalone' }),
                createElement('p', { className: 'text-muted text-xs', style: { margin: '0.35rem 0 0' }, text: 'Tidak ada data pribadi yang dikirim ke server pihak ketiga.' })
              ]
            })
          ]
        })
      ]
    });
    container.appendChild(privacyCard);

    // 5. Account & Identity Management
    const accountCard = createElement('div', {
      className: 'card',
      style: { padding: '1.75rem' },
      children: [
        createElement('h3', { text: 'Identitas Siswa & Sesi', style: { margin: '0 0 0.25rem 0' } }),
        createElement('p', { className: 'text-muted text-sm', style: { margin: '0 0 1rem 0' }, text: 'Profil analis yang terasosiasi dengan catatan evaluasi dan leaderboard.' }),
        createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
          children: [
            createElement('div', {
              children: [
                createElement('strong', { text: student.name || 'Siswa Analis Belum Terdaftar', style: { fontSize: '1.05rem', display: 'block' } }),
                createElement('span', { className: 'text-muted text-sm', text: `Kelas: ${student.className || '-'} • No. Presensi: ${student.attendanceNumber || '-'}` })
              ]
            }),
            createElement('div', {
              style: { display: 'flex', gap: '0.5rem' },
              children: [
                createElement('button', {
                  className: 'btn btn-outline btn-sm',
                  text: 'Ubah Data Identitas',
                  events: { click: () => router.navigate('/identity') }
                }),
                createElement('button', {
                  className: 'btn btn-secondary btn-sm',
                  text: 'Lihat Profil Lengkap',
                  events: { click: () => router.navigate('/profile') }
                })
              ]
            })
          ]
        })
      ]
    });
    container.appendChild(accountCard);
  }

  function createSettingRow(title, desc, checked, onChange) {
    const row = createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)' },
      children: [
        createElement('div', {
          style: { flex: 1 },
          children: [
            createElement('strong', { text: title, style: { fontSize: '0.9rem', display: 'block', marginBottom: '0.2rem' } }),
            createElement('span', { text: desc, className: 'text-muted text-xs' })
          ]
        }),
        createElement('label', {
          style: { position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 },
          children: [
            createElement('input', {
              attributes: { type: 'checkbox' },
              style: { opacity: 0, width: 0, height: 0 },
              properties: { checked },
              events: {
                change: (e) => onChange(e.target.checked)
              }
            }),
            createElement('span', {
              style: {
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: checked ? 'var(--color-primary-strong)' : 'var(--color-border)',
                transition: '0.2s',
                borderRadius: '24px'
              },
              children: [
                createElement('span', {
                  style: {
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: checked ? '22px' : '3px',
                    bottom: '3px',
                    backgroundColor: '#ffffff',
                    transition: '0.2s',
                    borderRadius: '50%'
                  }
                })
              ]
            })
          ]
        })
      ]
    });
    return row;
  }

  store.subscribe(() => {
    render();
  });

  render();
  return container;
}

export default createSettingsPage;
