/**
 * Bookmarks / Evidence Page (Personal Evidence Notebook)
 * Allows students to store, search, filter, sort, view, annotate, and manage
 * critical evidence items discovered during SOC lab investigations and CTF cases.
 * Zero dummy evidence, pure SVG icons, accessible dialogs.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { createIcon } from '../components/Icon.js';
import { openModal, closeModal } from '../components/Modal.js';
import { showToast } from '../components/Toast.js';

export function createBookmarksPage() {
  const container = createElement('div', { className: 'bookmarks-page page-container' });

  let searchQuery = '';
  let selectedFilter = 'all';
  let sortOrder = 'newest';

  function render() {
    container.innerHTML = '';
    const state = store.getState();
    const bookmarks = state.bookmarks || [];

    // 1. Header Hero
    const headerCard = createElement('div', {
      className: 'bookmarks-hero card',
      children: [
        createElement('div', {
          className: 'hero-badges-row',
          children: [
            createElement('span', { className: 'badge badge-primary', text: 'EVIDENCE NOTEBOOK' }),
            createElement('span', { className: 'badge badge-outline', text: `${bookmarks.length} Bukti Tersimpan` })
          ]
        }),
        createElement('h1', { text: 'Evidence Notebook Siswa' }),
        createElement('p', {
          className: 'text-muted',
          text: 'Catatan pribadi bukti log, anomali paket, IOC, dan temuan investigasi yang ditandai selama pengerjaan Lab 01–04 dan Real-Case CTF.'
        })
      ]
    });
    container.appendChild(headerCard);

    // 2. Control Toolbar (Search, Filter, Sort)
    if (bookmarks.length > 0) {
      const toolbarCard = createElement('div', {
        className: 'card',
        style: {
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          margin: '1.25rem 0'
        },
        children: [
          createElement('div', {
            style: { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' },
            children: [
              createIcon({ name: 'search', size: 16 }),
              createElement('input', {
                className: 'form-control',
                attributes: {
                  type: 'search',
                  placeholder: 'Cari evidence berdasarkan judul, catatan, atau tag...',
                  value: searchQuery
                },
                events: {
                  input: (e) => {
                    searchQuery = e.target.value.toLowerCase().trim();
                    renderList();
                  }
                }
              })
            ]
          }),
          createElement('div', {
            style: { display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' },
            children: [
              createElement('select', {
                className: 'form-control',
                style: { width: 'auto' },
                children: [
                  createElement('option', { value: 'all', text: 'Semua Kategori' }),
                  createElement('option', { value: 'log', text: 'Bukti Log' }),
                  createElement('option', { value: 'alert', text: 'Alert IDS' }),
                  createElement('option', { value: 'ioc', text: 'Indikator Kompromi (IOC)' }),
                  createElement('option', { value: 'rule', text: 'Aturan Snort / Suricata' })
                ],
                events: {
                  change: (e) => {
                    selectedFilter = e.target.value;
                    renderList();
                  }
                }
              }),
              createElement('select', {
                className: 'form-control',
                style: { width: 'auto' },
                children: [
                  createElement('option', { value: 'newest', text: 'Terbaru' }),
                  createElement('option', { value: 'oldest', text: 'Terlama' })
                ],
                events: {
                  change: (e) => {
                    sortOrder = e.target.value;
                    renderList();
                  }
                }
              })
            ]
          })
        ]
      });
      container.appendChild(toolbarCard);
    }

    // 3. Evidence List Container
    const listWrapper = createElement('div', { className: 'bookmarks-list-container' });
    container.appendChild(listWrapper);

    function renderList() {
      listWrapper.innerHTML = '';

      if (bookmarks.length === 0) {
        const emptyStateCard = createElement('div', {
          className: 'empty-bookmarks-card card',
          style: { textAlign: 'center', padding: '3.5rem 1.5rem', margin: '1.5rem 0' },
          children: [
            createElement('div', {
              style: { color: 'var(--color-text-muted)', marginBottom: '1rem' },
              children: [createIcon({ name: 'searchCheck', size: 48 })]
            }),
            createElement('h3', { text: 'Belum Ada Evidence Tersimpan' }),
            createElement('p', {
              className: 'text-muted',
              style: { maxWidth: '480px', margin: '0.5rem auto 1.5rem', lineHeight: '1.5' },
              text: 'Saat menemukan evidence penting dalam investigasi di Lab 01–04 atau Real-Case CTF, gunakan tombol Simpan Bukti untuk membangun catatan analisismu.'
            }),
            createElement('div', {
              style: { display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' },
              children: [
                createElement('button', {
                  className: 'btn btn-primary',
                  style: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem' },
                  children: [
                    createIcon({ name: 'route', size: 14 }),
                    createElement('span', { text: 'Buka Alur Kurikulum' })
                  ],
                  events: { click: () => router.navigate('/learning-path') }
                }),
                createElement('button', {
                  className: 'btn btn-outline',
                  style: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem' },
                  children: [
                    createIcon({ name: 'flag', size: 14 }),
                    createElement('span', { text: 'Eksplorasi Bank CTF' })
                  ],
                  events: { click: () => router.navigate('/ctf') }
                })
              ]
            })
          ]
        });
        listWrapper.appendChild(emptyStateCard);
        return;
      }

      // Filter and Sort
      let filtered = [...bookmarks];
      if (selectedFilter !== 'all') {
        filtered = filtered.filter(b => (b.category || b.type || '').toLowerCase() === selectedFilter);
      }
      if (searchQuery) {
        filtered = filtered.filter(b =>
          (b.title || '').toLowerCase().includes(searchQuery) ||
          (b.notes || '').toLowerCase().includes(searchQuery) ||
          (b.source || '').toLowerCase().includes(searchQuery) ||
          (b.snippet || '').toLowerCase().includes(searchQuery)
        );
      }
      if (sortOrder === 'newest') {
        filtered.reverse();
      }

      if (filtered.length === 0) {
        listWrapper.appendChild(createElement('div', {
          className: 'card',
          style: { textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)' },
          text: 'Tidak ada evidence yang sesuai dengan kata kunci atau filter pencarian.'
        }));
        return;
      }

      const grid = createElement('div', {
        style: { display: 'grid', gap: '1rem' },
        children: filtered.map((b, idx) => {
          const originalIndex = bookmarks.indexOf(b);

          return createElement('div', {
            className: 'bookmark-item-card card',
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              padding: '1.25rem',
              borderLeft: '4px solid var(--color-primary-strong)'
            },
            children: [
              createElement('div', {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' },
                children: [
                  createElement('div', {
                    children: [
                      createElement('div', {
                        style: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' },
                        children: [
                          createElement('span', { className: 'badge badge-primary text-xs', text: b.category || b.type || 'Log Evidence' }),
                          b.relatedLab ? createElement('span', { className: 'badge badge-neutral text-xs', text: `Lab 0${b.relatedLab}` }) : null,
                          createElement('span', { className: 'text-muted text-xs', text: b.date ? new Date(b.date).toLocaleDateString('id-ID') : 'Hari ini' })
                        ].filter(Boolean)
                      }),
                      createElement('h4', { text: b.title || 'Bukti Investigasi', style: { margin: '0 0 0.25rem 0', fontSize: '1.05rem' } }),
                      createElement('p', {
                        className: 'text-muted text-sm',
                        style: { margin: 0 },
                        text: b.snippet || b.source || 'Tidak ada pratinjau teks log.'
                      })
                    ]
                  }),
                  createElement('div', {
                    style: { display: 'flex', gap: '0.4rem', alignItems: 'center' },
                    children: [
                      createElement('button', {
                        className: 'btn btn-outline btn-sm',
                        text: 'Lihat Detail',
                        events: {
                          click: () => openDetailModal(b)
                        }
                      }),
                      createElement('button', {
                        className: 'btn btn-secondary btn-sm',
                        text: 'Edit Catatan',
                        events: {
                          click: () => openEditNoteModal(b, originalIndex, render)
                        }
                      }),
                      createElement('button', {
                        className: 'btn btn-icon btn-ghost btn-sm',
                        attributes: { 'aria-label': 'Hapus bukti' },
                        children: [createIcon({ name: 'x', size: 14 })],
                        events: {
                          click: () => {
                            const updated = bookmarks.filter((_, i) => i !== originalIndex);
                            store.setState({ bookmarks: updated });
                            showToast({ type: 'info', message: 'Evidence dihapus dari notebook.' });
                            render();
                          }
                        }
                      })
                    ]
                  })
                ]
              }),
              b.notes ? createElement('div', {
                style: {
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--color-surface-soft)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem'
                },
                children: [
                  createElement('strong', { text: 'Catatan Analis: ', style: { color: 'var(--color-primary-strong)' } }),
                  createElement('span', { text: b.notes })
                ]
              }) : null
            ].filter(Boolean)
          });
        })
      });

      listWrapper.appendChild(grid);
    }

    renderList();
  }

  store.subscribe(() => {
    render();
  });

  render();
  return container;
}

function openDetailModal(item) {
  const content = createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    children: [
      createElement('div', {
        children: [
          createElement('span', { className: 'badge badge-primary', text: item.category || 'Evidence' }),
          createElement('h3', { text: item.title, style: { margin: '0.5rem 0' } }),
          createElement('p', { className: 'text-muted text-sm', text: `Tersimpan: ${item.date ? new Date(item.date).toLocaleString('id-ID') : 'Baru saja'}` })
        ]
      }),
      createElement('div', {
        style: {
          padding: '1rem',
          backgroundColor: 'var(--color-surface-soft)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap'
        },
        text: item.snippet || item.source || 'Tidak ada konten log mentah.'
      }),
      item.notes ? createElement('div', {
        children: [
          createElement('h4', { text: 'Analisis & Catatan:', style: { margin: '0 0 0.35rem 0', fontSize: '0.95rem' } }),
          createElement('p', { text: item.notes, style: { margin: 0, fontSize: '0.9rem' } })
        ]
      }) : null
    ].filter(Boolean)
  });

  openModal({
    title: 'Detail Bukti Investigasi',
    content,
    buttons: [
      { text: 'Tutup', variant: 'secondary' }
    ]
  });
}

function openEditNoteModal(item, index, onSave) {
  const textarea = createElement('textarea', {
    className: 'form-control',
    attributes: {
      rows: '4',
      placeholder: 'Tuliskan catatan analisis, keterkaitan dengan serangan, atau temuan fakta...'
    },
    text: item.notes || ''
  });

  const content = createElement('div', {
    children: [
      createElement('p', { className: 'text-muted text-sm', text: `Menambahkan catatan untuk: ${item.title}` }),
      textarea
    ]
  });

  openModal({
    title: 'Edit Catatan Evidence',
    content,
    buttons: [
      {
        text: 'Simpan Catatan',
        variant: 'primary',
        onClick: () => {
          const state = store.getState();
          const bookmarks = [...(state.bookmarks || [])];
          if (bookmarks[index]) {
            bookmarks[index] = { ...bookmarks[index], notes: textarea.value.trim() };
            store.setState({ bookmarks });
            showToast({ type: 'success', message: 'Catatan evidence berhasil disimpan.' });
            onSave();
          }
        }
      },
      { text: 'Batal', variant: 'secondary' }
    ]
  });
}

export default createBookmarksPage;
